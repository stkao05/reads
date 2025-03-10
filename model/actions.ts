"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Store, Tag } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";
import mine from "mime-types";
import { revalidateTag } from "next/cache";
import { CACHE_TAG_STORES, prisma, StoreDetail } from "./db";
import { client } from "./s3";

export async function upsert(
  data: Partial<StoreDetail> & Pick<StoreDetail, "id" | "path">
) {
  const { tags, images, ...d } = data;

  const store = await prisma.store.upsert({
    where: { id: data.id },
    update: {
      ...d,
      google_place_info: data.google_place_info as JsonObject,
    },
    create: {
      ...d,
      id: d.id,
      name: d.name ?? "",
      address: d.name ?? "",
      google_place_info: d.google_place_info as JsonObject,
    },
  });

  // TODO: storeTag and storeImage could be updated more efficiently

  if (tags) {
    await prisma.storeTag.deleteMany({ where: { store_id: store.id } });
    await prisma.storeTag.createMany({
      data: tags.map((t) => ({ tag_id: t.id, store_id: store.id })),
    });
  }

  if (images) {
    await prisma.storeImage.deleteMany({ where: { store_id: store.id } });
    await Promise.all(
      images.map((img, i) =>
        prisma.storeImage.createMany({
          data: {
            key: img.key,
            width: img.width,
            height: img.height,
            order: i,
            store_id: store.id,
          },
        })
      )
    );
  }

  revalidateTag(CACHE_TAG_STORES);
}

export async function create(store: Store) {
  try {
    await prisma.store.create({
      data: {
        ...store,
        google_place_info: store.google_place_info as JsonObject,
      },
    });
    revalidateTag(CACHE_TAG_STORES);
  } catch (e) {
    console.error(e);
  }
}

export async function remove(id: Store["id"]) {
  try {
    await prisma.store.delete({ where: { id } });
    revalidateTag(CACHE_TAG_STORES);
  } catch (e) {
    console.error(e);
  }
}

export async function processContent(content: string) {
  const srcUrls = extractImgUrl(content);
  const cdnUrls = await Promise.all(srcUrls.map(toCdn));

  for (let i = 0; i < srcUrls.length; i++) {
    content = content.replace(srcUrls[i], cdnUrls[i]);
  }
  return content;
}

export async function toCdn(url: string) {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let type = response.headers.get("Content-Type");
  if (!type) throw new Error("Unknown content type: " + url);
  if (type === "image/jpg") {
    type = "image/jpeg";
  }

  const key = `${randomUUID()}.${mine.extension(type)}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: type,
  });
  await client.send(command);

  return `https://file.reads.tw/${key}`;
}

const extractImgUrl = (markdown: string): string[] => {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const urls = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

export async function createTag(tag: Tag) {
  await prisma.tag.create({ data: tag });
}

import { client } from "@/model/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import mine from "mime-types";
import { prisma } from "@/model/db";
import assert from "assert";
import { auth } from "@/model/auth";

// TODO: use HTTP status code for signaling success state
export type UploadResponse = {
  success: boolean;
  data: {
    img_url: string;
    img_width: number;
    img_height: number;
  };
};

export async function POST(request: Request) {
  if (!auth()) {
    return NextResponse.json(
      { success: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const data = await request.formData();
  const file = data.get("file") as unknown as File;

  if (!file) return NextResponse.json({ success: false });

  const bytes = await file.arrayBuffer();
  const buffer = await sharp(Buffer.from(bytes))
    .resize(600)
    .jpeg({ quality: 75 })
    .toBuffer();

  const sb = sharp(buffer);
  const meta = await sb.metadata();
  assert(meta.width && meta.height);

  const key = `${randomUUID()}.${mine.extension(file.type)}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });
  await client.send(command);

  // await prisma.image.create({
  //   data: {
  //     key,
  //     width: meta.width,
  //     height: meta.height,
  //   },
  // });

  return NextResponse.json({
    success: true,
    data: {
      // TODO: rename these
      img_url: `https://file.reads.tw/${key}`,
      img_width: meta.width,
      img_height: meta.height,
      // img_type: file.type,

      url: `https://file.reads.tw/${key}`,
      width: meta.width,
      height: meta.height,
      key,
    },
  });
}

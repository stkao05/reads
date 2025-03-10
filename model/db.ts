import { PrismaClient, Store, Tag } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { assetUrl } from "./images";
export type { Store } from "@prisma/client";
import sortBy from "lodash/sortBy";
import { X } from "lucide-react";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export const CACHE_TAG_STORES = "stores";

export type StoreDetail = Store & {
  tags: Tag[];
  images: { key: string; url: string; width: number; height: number }[];
};

export async function get(
  query: { id: string } | { path: string }
): Promise<StoreDetail | null> {
  const s = await prisma.store.findUnique({
    include: {
      tags: {
        select: { tag: true },
      },
      images: true,
    },
    where: query,
  });
  if (!s) return s;

  return {
    ...s,
    tags: s.tags.map((t) => t.tag),
    images: sortBy(
      s.images.map((i) => ({ ...i, url: assetUrl(i.key) })),
      "order"
    ),
  };
}

/**
 * get stores that contains content by the same domain
 */
export const getDomainContent = async (content_domain: string) => {
  return prisma.store.findMany({
    where: { content_domain },
  });
};

export type ListItem = Awaited<ReturnType<typeof getListItem>>[number];

export const getListItem = async () => {
  let raw = await prisma.store.findMany({
    select: {
      id: true,
      path: true,
      name: true,
      hidden: true,
      summary: true,
      region: true,
      coord_lat: true,
      coord_lng: true,
      content_show: true,
      tags: {
        select: { tag: true },
      },
      images: {
        take: 1,
        orderBy: { order: "asc" },
      },
    },
  });

  let result = raw.map((x) => {
    return {
      ...x,
      img:
        x.images.length > 0
          ? {
              ...x.images[0],
              url: assetUrl(x.images[0].key),
            }
          : null,
    };
  });

  result = result.filter((r) => !r.hidden);

  // bookstore with content sorted first
  result.sort((a, b) => {
    if (a.content_show && !b.content_show) {
      return -1;
    }
    if (!a.content_show && b.content_show) {
      return 1;
    }
    return a.name > b.name ? 1 : -1;
  });

  return result;
};

export type BusinessStatus =
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY";

export async function getTags() {
  return prisma.tag.findMany();
}

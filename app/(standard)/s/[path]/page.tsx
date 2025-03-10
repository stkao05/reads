import { auth } from "@/model/auth";
import { get, getListItem } from "@/model/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StorePage } from "./store-page";

export type Props = {
  params: { path: string };
  preview?: boolean;
};

export async function generateStaticParams() {
  const stores = await getListItem();
  return stores.map((store) => ({
    path: store.path,
  }));
}

export default async function Page({ params, preview }: Props) {
  const [store, admin] = await Promise.all([
    get({ path: params.path }),
    auth(),
  ]);
  if (!store) return notFound();

  return <StorePage store={store} preview={preview} admin={admin} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = await get({ path: params.path });
  if (!store) return {};
  return {
    title: `${store.name} - 島嶼書店指南`,
    description: `${store.summary}\n\n${store.address}`,
    openGraph: {
      images: store.images.length > 0 ? store.images[0].url : "",
      description: `${store.summary}\n${store.address}`,
    },
  };
}

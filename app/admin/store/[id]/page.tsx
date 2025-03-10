import { Store, StoreDetail, get, getTags } from "@/model/db";
import { randomUUID } from "crypto";
import { Metadata } from "next";
import { StoreEditor } from "./editor";
import { ImageInfo } from "@/components/multi-image-uploader";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  let store = await get({ id: params.id });
  if (!store) {
    store = {
      id: params.id,
      name: "",
      path: "",
      created_at: new Date(),
      updated_at: new Date(),
      tags: [] as {
        id: string;
        name: string;
      }[],
      images: [] as ImageInfo[],
    } as StoreDetail;
  }
  const tags = await getTags();

  return <StoreEditor store={store} tags={tags} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const par = await params;
  const store = await get({ id: par.id });
  if (!store) {
    return {
      title: `新增書店 - 島嶼書店指南`,
    };
  }

  return {
    title: `${store.name} - 島嶼書店指南`,
    description: `${store.summary}\n\n${store.address}`,
  };
}

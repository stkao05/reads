import { getListItem, getTags } from "@/model/db";
import { StoreList } from "../../component/store-list";
import { Metadata } from "next";
import { TagList } from "../taglist";

type Props = {
  params: Promise<{ tagId: string }>;
};

export default async function Page({ params }: Props) {
  const { tagId } = await params;
  const all = await getListItem();
  const tags = await getTags();
  const stores = all.filter((x) => x.tags.find((t) => t.tag.id === tagId));
  const tag = tags.find((t) => t.id === tagId);

  return (
    <div>
      <div className="pl-4 mb-6">
        <div className="flex gap-4 items-center mb-2">
          <h2 className="font-bold text-lg">#{tag?.name}</h2>
        </div>
        <TagList />
      </div>
      <StoreList stores={stores} />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const par = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.id === par.tagId);
  return {
    title: tag ? `#${tag.name} - 島嶼書店指南` : "島嶼書店指南",
  };
}

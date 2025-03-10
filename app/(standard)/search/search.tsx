import { getListItem, getTags, prisma } from "@/model/db";
import { StoreList } from "../component/store-list";

export async function Search(props: { q?: string }) {
  const tags = await getTags();

  const { q } = props;
  if (!q || q === "") return null;

  const all = await getListItem();
  const result = all.filter((x) => x.name.includes(q));

  if (result.length === 0) {
    return (
      <div>
        <div className="px-4">
          搜尋：<b>{q}</b> - 沒有找到相關結果
        </div>
      </div>
    );
  }

  return <StoreList stores={result} />;
}

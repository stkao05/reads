"use client";
import { Suspense } from "react";
import { useLocalStorage } from "../../../lib/use-local-storage";
import { trpc } from "@/app/api/[trpc]/trpc";
import { StoreList } from "../component/store-list";
import { Loading } from "@/components/ui/loading";

export default function Page() {
  const [fav] = useLocalStorage<string[]>("favorites", []);

  return (
    <div>
      <div className="px-4 mb-5">
        <h2 className="tracking-wider mb-2 flex items-center gap-1 font-bold text-lg">
          ️收藏書店
        </h2>
        <p className="tracking-wider text-sm">收藏資料儲存於你的手機瀏覽器裡</p>
      </div>
      <Suspense
        fallback={
          <div className="px-4">
            <Loading />
          </div>
        }
      >
        <Content storeIds={fav}></Content>
      </Suspense>
    </div>
  );
}

async function Content({ storeIds }: { storeIds: string[] }) {
  if (storeIds.length == 0) return null;

  const res = await trpc["list-items"].query({ storeIds });
  return <StoreList stores={res.items} />;
}

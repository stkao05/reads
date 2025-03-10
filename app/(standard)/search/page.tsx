import { Suspense } from "react";
import { Search } from "./search";
import { SearchForm } from "./search-form";
import { Loading } from "@/components/ui/loading";
import { TagList } from "../t/taglist";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  return (
    <div>
      <div className="">
        <div className="px-4 mb-4">
          <SearchForm />
          <div className="mt-2">
            <TagList />
          </div>
        </div>
        <Suspense
          key={q}
          fallback={
            <div className="px-4 pt-4">
              <Loading />
            </div>
          }
        >
          <Search q={q} />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return {
    title:
      q && q !== ""
        ? `${q} - 島嶼書店指南`
        : "搜尋書店 - 島嶼書店指南",
  };
}

"use client";
import { Store } from "@prisma/client";
import { Delete } from "./delete";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SectionNav({ store }: { store: Store }) {
  const path = usePathname();

  function cls(href: string) {
    let c = "link-button mr-2";
    if (path === href) {
      c += " active";
    }
    return c;
  }

  return (
    <>
      <Link
        className={cls(`/admin/store/${store.id}`)}
        href={`/admin/store/${store.id}`}
      >
        基本資料編輯
      </Link>
      <Link
        className={cls(`/admin/store/${store.id}/article`)}
        href={`/admin/store/${store.id}/article`}
      >
        文章編輯
      </Link>
      <Link
        className={cls(`/admin/store/${store.id}/article-permit`)}
        href={`/admin/store/${store.id}/article-permit`}
      >
        文章授權
      </Link>
      <Link className="link-button mr-2" href={`/${store.id}`}>
        書店頁面
      </Link>
      <Delete id={store.id} />
    </>
  );
}

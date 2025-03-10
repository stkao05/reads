"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <h2 className="mb-2 font-bold text-lg">搜尋書店</h2>
      <Input
        className="rounded-full"
        onChange={onChange}
        defaultValue={searchParams.get("q")?.toString()}
        autoFocus
      />
    </div>
  );
}

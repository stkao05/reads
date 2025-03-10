"use client";

import { RegionCode, regionCodes, regions } from "@/model/region";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, HTMLProps, useState } from "react";

export function RegionSelectNav(props: HTMLProps<HTMLSelectElement>) {
  const pathname = usePathname();
  const code = parseRegionCode(pathname);
  const [region, setRegion] = useState<RegionCode>(code || "taipei");
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value as RegionCode;
    setRegion(region);
    router.replace(`/r/${region}`);
  };

  return (
    <select
      aria-label="地區"
      value={region}
      onChange={onChange}
      {...props}
      className={`rounded border border-zinc-300 text-sm text-zinc-800 p-[2px] hover:bg-zinc-100 cursor-pointer ${props.className}`}
    >
      {regions.map((x) => {
        return (
          <option key={x.code} value={x.code}>
            {x.name}
          </option>
        );
      })}
    </select>
  );
}

function parseRegionCode(pathname: string): RegionCode | null {
  const match = pathname.match(/\/r\/([A-Za-z0-9_]+)/);
  if (!match) return null;

  const code = regionCodes.find((c) => c === match[1]);
  return code || null;
}

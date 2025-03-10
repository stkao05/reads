import { Region, regions } from "@/model/region";
import Link from "next/link";
import { HTMLProps } from "react";

export function RegionLinks({
  region,
  ...rest
}: { region?: Region["code"] } & HTMLProps<HTMLDivElement>) {
  const options = [...regions.map((x) => ({ ...x, href: `/r/${x.code}` }))];
  if (!region) {
    region = "taipei";
  }

  return (
    <div {...rest}>
      {options.map((x) => (
        <Link
          key={x.code}
          className={
            "inline-block rounded transition py-1 px-2 mr-2 text-sm  tracking-widest hover:text-zinc-900 hover:bg-zinc-100 " +
            (x.code == region ? "bg-zinc-100" : "")
          }
          href={x.href}
        >
          {x.name}
        </Link>
      ))}
    </div>
  );
} 
import { ListItem } from "@/model/db";
import Image from "next/image";
import Link from "next/link";
import { HTMLProps } from "react";

type Props = Omit<HTMLProps<HTMLAnchorElement>, "ref"> & {
  store: ListItem;
  index: number;
};

export function StoreItem({ store, index, ...props }: Props) {
  return (
    <Link
      {...props}
      href={`/s/${store.path}`}
      className="rounded hover:bg-zinc-100 cursor-pointer px-4 py-2 transition"
      prefetch={true}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="font-semibold tracking-widest">{store.name}</div>
      </div>
      <Image
        src={store.img?.url || ""}
        alt={store.name}
        width={store.img?.width || 0}
        height={store.img?.height || 0}
        className="photo-filter aspect-video object-cover"
        priority={index <= 3}
      ></Image>
      <div className="mt-2 tracking-wider">{store.summary}</div>
    </Link>
  );
}

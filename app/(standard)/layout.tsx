import { HeartIcon } from "@/components/ui/heart-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center px-4">
      <div className="min-h-screen w-[1024px] pb-14">
        <nav className="flex justify-between gap-2 items-center py-6 px-2">
          <Link
            className="transition mr-auto inline-flex items-center hover:bg-zinc-100 active:bg-zinc-200 rounded-md p-2"
            href="/"
          >
            <Image
              alt="logo"
              src="/tbi-logo.svg"
              width="27"
              height="26"
            ></Image>
            <h1 className="ml-4 font-bold tracking-wider">島嶼書店指南</h1>
          </Link>
          <IconLink href="/favorites" title="我的收藏書店">
            <HeartIcon className="w-[24px]"></HeartIcon>
          </IconLink>
          <IconLink href="/search" title="搜尋">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-[24px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
            </svg>
          </IconLink>
          <IconLink title="地圖" href="/map" prefetch>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[24px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
          </IconLink>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="mt-6 pt-2 mx-4 border-t border-t-zinc-200">
          <Link className="text-sm mr-4 hover:underline" href="/about">
            關於島嶼書店指南
          </Link>
          <Link
            className="text-sm mr-4 hover:underline"
            href="https://www.instagram.com/reads.tw"
          >
            IG
          </Link>
          <Link className="text-sm mr-4 hover:underline" href="/admin">
            編輯室
          </Link>
        </footer>
      </div>
    </div>
  );
}

function IconLink(props: { title: string } & ComponentProps<typeof Link>) {
  const { title, ...rest } = props;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link className="link-button w-[24px] h-[24px] box-content" {...rest} />
      </TooltipTrigger>
      <TooltipContent>{props.title}</TooltipContent>
    </Tooltip>
  );
}

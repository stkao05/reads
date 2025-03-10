import Image from "next/image";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center px-2 sm:px-8">
      <div className="min-h-screen w-full pb-14">
        <nav className="flex justify-between items-start   py-6 px-2">
          <Link
            className="inline-flex items-center hover:bg-zinc-100 transition rounded-md p-2"
            href="/"
          >
            <Image
              alt="logo"
              src="/tbi-logo.svg"
              width="27"
              height="26"
            ></Image>
            <h1 className="ml-4 font-bold tracking-wider">島嶼書店指南</h1>
            <span className="text-xs p-1 bg-zinc-100 rounded  ml-2">
              編輯室
            </span>
          </Link>
          <div className="flex flex-col sm:flex-row">
            <Link className="link-button mr-2" href="/admin">
              書店列表
            </Link>
            <Link className="link-button mr-2" href="/admin/user">
              人員管理
            </Link>
            <Link className="link-button" href="/auth/logout">
              登出
            </Link>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <Toaster />
        <footer className="mt-6 pt-2 mx-4 border-t border-t-zinc-200">
          <Link className="text-sm link mr-4" href="/about">
            關於島嶼書店指南
          </Link>
          <Link className="text-sm link" href="/admin">
            編輯室
          </Link>
        </footer>
      </div>
    </div>
  );
}

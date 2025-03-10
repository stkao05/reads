import { Button } from "@/components/ui/button";
import { prisma } from "@/model/db";
import Link from "next/link";
import { StoreTable } from "./table";
import { Progress } from "@/components/ui/progress";

export default async function List() {
  const [stores, count] = await Promise.all([
    await prisma.store.findMany({ orderBy: { created_at: "desc" } }),
    await prisma.store.count({ where: { NOT: { content: null } } }),
  ]);

  const perc = (count / stores.length) * 100;

  return (
    <div className="pl-2">
      <div className="mb-4 flex justify-between">
        <Button asChild>
          <Link href="/admin/store/add">新增書店</Link>
        </Button>
        <div className="w-[200px] text-sm">
          <div className="text-sm mb-1">
            文章佔比：{`${perc.toPrecision(2)}% (${count} / ${stores.length})`}
          </div>
          <Progress value={perc} />
        </div>
      </div>
      <StoreTable stores={stores} />
    </div>
  );
}

// opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

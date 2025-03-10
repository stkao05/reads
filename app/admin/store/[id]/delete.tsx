"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { remove } from "@/model/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";

export function Delete({ id }: { id: string }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const onDelete = async () => {
    setRemoving(true);
    await remove(id);
    router.push("/admin");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" type="button">
          刪除書店
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定刪除?</AlertDialogTitle>
          <AlertDialogDescription>
            書店資料將從資料庫永久移除
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-2">取消</AlertDialogCancel>
          <AlertDialogAction type="submit" onClick={onDelete}>
            刪除
            {removing ? <Loading className="ml-2" /> : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

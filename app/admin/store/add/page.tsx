import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

export default async function Page() {
  return redirect(`/admin/store/${randomUUID()}`);
}

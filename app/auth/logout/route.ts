import { expire } from "@/model/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = new NextResponse("", {
    status: 303,
    headers: { Location: "/admin" },
  });
  expire(res);
  return res;
}

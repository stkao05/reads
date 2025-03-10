import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./model/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/auth/login")) {
    return;
  }

  const valid = await auth();
  console.log("valid", valid);

  if (!valid) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: "/admin/:path*",
};

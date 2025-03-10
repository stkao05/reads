import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const COOKIE_NAME_SESSION_TOKEN = "session-token";

interface UserJwtPayload {
  email: string;
  jti: string;
  iat: number;
}

export class AuthError extends Error {}

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME_SESSION_TOKEN)?.value;
  if (!token) return false;

  try {
    const verified = await jwtVerify<UserJwtPayload>(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return true;
  } catch (err) {
    return false;
  }
}

export async function setAuthSeverAction(email: string) {
  const cookieStore = await cookies()
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  cookieStore.set(COOKIE_NAME_SESSION_TOKEN, token);
}

export function expire(res: NextResponse) {
  res.cookies.set(COOKIE_NAME_SESSION_TOKEN, "");
  return res;
}

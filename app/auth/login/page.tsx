import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setAuthSeverAction } from "@/model/auth";
import { prisma } from "@/model/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

/**
 * very basic authentication page, used only internally
 */
export default async function Login() {
  const onAction = async (form: FormData) => {
    "use server";
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();
    
    if (!email) {
      return new NextResponse("error: email required", { status: 400 });
    }

    if (!password) {
      return new NextResponse("error: password required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return new NextResponse("error: invalid credentials", { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return new NextResponse("error: invalid credentials", { status: 403 });
    }

    setAuthSeverAction(email);
    redirect("/admin");
  };

  return (
    <form action={onAction} className="w-[300px]">
      <Input className="mb-4" type="email" name="email" placeholder="Email" />
      <Input className="mb-4" type="password" name="password" placeholder="Password" />
      <Button type="submit">Login</Button>
    </form>
  );
}

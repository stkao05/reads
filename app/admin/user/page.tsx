import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { prisma } from "@/model/db";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export default async function User() {
  const users = await prisma.user.findMany();
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-medium">編輯人員清單</h2>
        <p>使用者必須先加入編輯人員清單才可以登入編輯室</p>
      </div>
      <Add />
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableCell>姓名</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow key={user.email}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function Add() {
  const onSubmit = async (form: FormData) => {
    "use server";

    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    if (!name || !email || !password) return;

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password.toString(), saltRounds);

    await prisma.user.create({
      data: { 
        name: name.toString(), 
        email: email.toString(),
        password_hash,
      },
    });

    revalidatePath("/admin/user");
  };

  return (
    <Dialog>
      <DialogTrigger className="link-button">新增</DialogTrigger>
      <DialogContent>
        <form className="text-sm" action={onSubmit}>
          <div className="mb-4">
            <fieldset className="mb-4">
              <label className="font-medium" htmlFor="">
                姓名
              </label>
              <Input name="name" type="text"></Input>
            </fieldset>
            <fieldset className="mb-4">
              <label className="font-medium" htmlFor="">
                Email
              </label>
              <Input name="email" type="text"></Input>
            </fieldset>
            <fieldset className="mb-4">
              <label className="font-medium" htmlFor="">
                密碼
              </label>
              <Input name="password" type="password"></Input>
            </fieldset>
          </div>
          <Button type="submit">新增</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

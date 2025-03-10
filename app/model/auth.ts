import { prisma } from "../../model/db";
import bcrypt from "bcrypt";

export async function setUserPassword(email: string, password: string) {
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);
  
  return prisma.user.update({
    where: { email },
    data: { password_hash },
  });
} 
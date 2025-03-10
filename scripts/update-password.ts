import { config } from "dotenv";
import { resolve } from "path";
import { setUserPassword } from "../app/model/auth";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../.env.local") });

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage: ts-node scripts/update-password.ts <email> <password>");
    process.exit(1);
  }

  try {
    await setUserPassword(email, password);
    console.log(`Successfully updated password for user: ${email}`);
  } catch (error) {
    console.error("Error updating password:", error);
    process.exit(1);
  }
}

main(); 
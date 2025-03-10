import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import mine from "mime-types";
import path from "path";

export const client = new S3Client({
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  region: "auto",
});

export async function upload(fpath: string) {
  const content = await readFile(fpath);
  const minetype = mine.lookup(fpath);
  if (!minetype) throw new Error("unable to infer MINE: " + fpath);

  const basename = path.basename(fpath);
  const ext = path.extname(fpath).toLowerCase();
  const key = `${randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: "reads",
    Key: key,
    Body: content,
    ContentType: minetype,
  });

  await client.send(command);
  return [basename, key];
}

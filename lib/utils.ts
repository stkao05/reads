import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function batch(jobs: Promise<any>[], size: number) {
  const batchlist: Promise<any>[][] = [];

  for (let i = 0; i < jobs.length; i++) {
    if (i % size == 0) {
      batchlist.push([]);
    }
    const b = batchlist[batchlist.length - 1];
    b.push(jobs[i]);
  }

  for (const batch of batchlist) {
    await Promise.all(batch);
  }
}

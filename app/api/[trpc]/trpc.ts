import { AppRouter } from "@/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api" })],
});

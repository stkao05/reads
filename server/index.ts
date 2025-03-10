import { ListItem, getListItem } from "@/model/db";
import { procedure, router } from "./trpc";
import z from "zod";

export const appRouter = router({
  greeting: procedure.query(() => "hello tRPC v10!"),
  ["list-items"]: procedure
    .input(
      z.object({
        storeIds: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      const all = await getListItem();
      const items = input.storeIds
        .map((id) => all.find((x) => x.id === id))
        .filter((x) => !!x) as ListItem[];

      return { items };
    }),
});

export type AppRouter = typeof appRouter;

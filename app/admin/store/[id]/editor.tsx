"use client";
import { StorePage } from "@/app/(standard)/s/[path]/store-page";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { upsert } from "@/model/actions";
import { StoreDetail } from "@/model/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { ArticleForm } from "./article-form";
import InfoForm from "./info-form";
import { Tag } from "@prisma/client";

const nullableStr = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : s))
  .nullable()
  .optional();

const schema = z.object({
  path: z
    .string()
    .regex(/[a-z0-9_-]*/)
    .min(2),
  name: z.string().trim().min(1),
  hidden: z.boolean().default(false),
  address: z.string().trim().min(1),
  content: nullableStr,
  summary: nullableStr,
  content_ref: nullableStr,
  content_ref_url: nullableStr,
  content_show: z.boolean().optional(),
  website: nullableStr,
  instagram: nullableStr,
  facebook: nullableStr,
  googlemap: nullableStr,
  google_place_id: nullableStr,
  coord_lat: z.coerce.number().nullable(),
  coord_lng: z.coerce.number().nullable(),
  region: nullableStr,
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  images: z.array(
    z.object({
      key: z.string(),
      url: z.string(),
      width: z.number(),
      height: z.number(),
    })
  ),
});

export type FormStuff = UseFormReturn<z.infer<typeof schema>>;

export function StoreEditor({
  store,
  tags,
}: {
  store: StoreDetail;
  tags: Tag[];
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: store,
  });

  const onSubmit = form.handleSubmit(async (data, event) => {
    try {
      await upsert({ id: store.id, ...data });
      form.reset(form.getValues());
    } catch (e) {
      alert("更新時遇到錯誤");
      console.log(e);
    }
  });

  const { isDirty, isSubmitting } = form.formState;
  const value = form.watch();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex">
          <div className="px-4 text-sm ">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{store.name}</h2>
              <a className="ml-4 link" href={`/${store.path}`}>
                書店頁面
              </a>
            </div>
            <Tabs defaultValue="basic" className="max-[600px] mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">基本資料</TabsTrigger>
                <TabsTrigger value="article">文章</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <InfoForm id={store.id} form={form} tags={tags}></InfoForm>
              </TabsContent>
              <TabsContent value="article">
                <ArticleForm store={store} form={form}></ArticleForm>
              </TabsContent>
            </Tabs>
          </div>
          <div className="hidden flex-grow justify-center sm:flex">
            <div className="flex-grow">
              <StorePage store={value as any} preview={true} />
            </div>
          </div>
          <Button
            type="submit"
            className={`flex fixed bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-zinc-300 px-8 py-6 `}
          >
            {isDirty ? (
              <div className="mr-2 h-2 w-2 rounded-full bg-yellow-400 "></div>
            ) : (
              <div className="mr-2 h-2 w-2 rounded-full bg-green-700 "></div>
            )}
            更新
            {isSubmitting && <Loading className="ml-2"></Loading>}
          </Button>
        </div>
      </form>
    </Form>
  );
}

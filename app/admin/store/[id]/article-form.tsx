"use client";
import { UploadResponse } from "@/app/api/img-upload/route";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { BaseStyles, ThemeProvider } from "@primer/react";
import { MarkdownEditor } from "@primer/react/drafts";
import { Store } from "@prisma/client";
import { useState } from "react";
import { flushSync } from "react-dom";
import { fetchArticle } from "./article-actions";
import { FormStuff } from "./editor";
import { Controller } from "react-hook-form";

export function ArticleForm(props: { store: Store; form: FormStuff }) {
  const { form } = props;
  const { toast } = useToast();

  const onMarkdownChange = (md: string) => {
    form.setValue("content", md);
  };

  const uploadFile = async (file: File) => {
    const body = new FormData();
    body.set("file", file);
    const res = await fetch("/api/img-upload", { method: "POST", body });
    if (!res.ok) throw new Error("upload api error");

    const r = (await res.json()) as UploadResponse;
    return { url: r.data.img_url, file };
  };

  const [fetching, setFetching] = useState(false);
  const onFetchArticleClick = async () => {
    const { content_ref_url } = form.getValues();
    if (!content_ref_url) return;

    flushSync(() => setFetching(true));

    try {
      const article = await fetchArticle(content_ref_url);
      if (article) {
        form.setValue("content", article.content);
        form.setValue("content_ref", `${article.title} - ${article.siteName}`);
      } else {
        toast({ description: "無法抓取文章" });
      }
    } catch (e) {
      console.error(e);
      toast({ description: "無法抓取文章" });
    } finally {
      flushSync(() => setFetching(false));
    }
  };

  const markdown = form.watch("content");

  return (
    <div className="sm:w-[500px]">
      <div className="mb-4 markdown-editor">
        <ThemeProvider>
          <BaseStyles>
            <Controller
              name="content"
              control={form.control}
              render={({ field }) => (
                <MarkdownEditor
                  {...field}
                  value={markdown ?? ""}
                  onChange={onMarkdownChange}
                  onRenderPreview={async () => ""}
                  onUploadFile={uploadFile}
                  fullHeight={true}
                  minHeightLines={50}
                >
                  <MarkdownEditor.Label></MarkdownEditor.Label>
                </MarkdownEditor>
              )}
            />
          </BaseStyles>
        </ThemeProvider>
      </div>
      <FormField
        control={form.control}
        name="content_ref_url"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel>原文網址</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mb-6">
        <div className="flex items-center">
          <Button
            type="button"
            variant="secondary"
            onClick={onFetchArticleClick}
          >
            從網址擷取文章
            {fetching ? <Loading /> : null}
          </Button>
        </div>
      </div>
      <FormField
        control={form.control}
        name="content_ref"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel>原文來源註記</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="文章標題 - 網站名稱"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="content_show"
        render={({ field }) => (
          <FormItem className="mb-6">
            <div className="space-y-0.5">
              <FormLabel>顯示文章</FormLabel>
              <FormDescription>顯示文章前需要先取得原作者同意</FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              ></Switch>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

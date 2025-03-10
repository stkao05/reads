"use client";
/* eslint-disable @next/next/no-img-element */
import { ImageUploader } from "@/components/image-uploader";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { regions } from "@/model/region";
import { Tag } from "@prisma/client";
import { Delete } from "./delete";
import { FormStuff } from "./editor";
import { GoogleMapSuggest, Suggestion } from "./google-complete";
import { TagForm } from "./tag-form";
import { Toggle } from "@/components/ui/toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ImageInfo,
  MultiImageUploader,
} from "@/components/multi-image-uploader";

export default function InfoForm({
  id,
  form,
  tags,
}: {
  id: string;
  form: FormStuff;
  tags: Tag[];
}) {
  const images = form.watch("images");

  const onSuggestionSelect = (suggestion: Suggestion) => {
    for (const k in suggestion) {
      form.setValue(k as any, suggestion[k as keyof Suggestion] as any);
    }
  };

  const onTagToggle = (tag: Tag) => {
    const tags = form.getValues("tags");
    const idx = tags.findIndex((t) => t.id === tag.id);

    if (idx === -1) {
      tags.push(tag);
    } else {
      tags.splice(idx, 1);
    }

    form.setValue("tags", tags);
  };

  return (
    <div className="sm:w-[500px]">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>
              書店名稱
              <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />

      <GoogleMapSuggest
        name={form.watch("name")}
        onSelect={onSuggestionSelect}
      />

      <FormField
        control={form.control}
        name="path"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>
              網址
              <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              {`https://reads.tw/${form.watch("path")} (小寫英文，不能有空格)`}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>
              地址
              <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>格式：台東市漢陽南路139-1號</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="region"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>區域</FormLabel>
            <FormControl>
              <select
                {...field}
                value={field.value ?? ""}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-2 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  請選擇區域
                </option>
                {regions.map((x) => {
                  return (
                    <option key={x.code} value={x.code}>
                      {x.name}
                    </option>
                  );
                })}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>簡介</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                className="rounded border p-2"
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>網站</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="facebook"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>facehook</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="instagram"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>instagram</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="googlemap"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>google map</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mb-4">
        <MultiImageUploader
          images={images}
          onChange={(images) => form.setValue("images", images)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>標籤</CardTitle>
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => {
              return (
                <div className="flex flex-wrap gap-2 py-4 whitespace-nowrap">
                  {tags.map((t) => (
                    <Toggle
                      variant="outline"
                      size="sm"
                      key={t.id}
                      pressed={field.value.some((f) => f.id === t.id)}
                      onPressedChange={() => onTagToggle(t)}
                    >
                      {t.name}
                    </Toggle>
                  ))}
                </div>
              );
            }}
          />

          <Collapsible>
            <CollapsibleTrigger>建立新標籤 &gt;</CollapsibleTrigger>
            <CollapsibleContent>
              <div className="py-2">
                <TagForm></TagForm>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardHeader>
      </Card>

      <div className="my-4 rounded">
        <div className="mb-1 text-base font-medium">進階欄位</div>
      </div>

      <div className="my-4 rounded bg-zinc-100/60 p-4">
        <div className="mb-1 text-base font-medium">進階欄位</div>
        <div className="mb-4 text-zinc-500">
          欄位資訊將自動生成，不用手動填入
        </div>
        <FormField
          control={form.control}
          name="google_place_id"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Google Place ID</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coord_lat"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coord_lng"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="my-4 rounded bg-zinc-100/60 p-4">
        <FormField
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <div className="mb-4">
              <FormItem>
                <FormLabel>隱藏</FormLabel>
                <FormControl>
                  <div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <Delete id={id}></Delete>
      </div>
    </div>
  );
}

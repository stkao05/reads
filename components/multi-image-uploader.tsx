import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useId, useState } from "react";
import { Loading } from "./ui/loading";
import { Reorder } from "framer-motion";

export type ImageInfo = {
  url: string;
  key: string;
  width: number;
  height: number;
};

export function MultiImageUploader(props: {
  images: ImageInfo[];
  onChange: (images: ImageInfo[]) => void;
}) {
  const { images, onChange } = props;
  const [uploading, setUploading] = useState(false);
  const fileId = useId();

  const upload = async (file: File) => {
    setUploading(true);
    const body = new FormData();
    body.set("file", file);
    try {
      const r = await fetch("/api/img-upload", { method: "POST", body });
      if (r.ok) {
        const res = await r.json();

        const im = [...images, res.data];
        props.onChange(im);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const onPaste = (event: ClipboardEvent) => {
    if (event.clipboardData) {
      const items = Array.from(event.clipboardData.items);
      const img = items.find((x) => x.type.includes("image"));
      if (img) {
        const file = img.getAsFile();
        if (file) upload(file);
      }
    }
  };

  function onFileChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    upload(file);
  }

  useEffect(() => {
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
    };
  });

  function onRemoveClick(key: ImageInfo["key"]) {
    let im = [...images];
    im = im.filter((x) => x.key !== key);
    onChange(im);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>書店照片</CardTitle>
      </CardHeader>
      <CardContent className="flex items-start gap-6">
        {images.length > 0 ? (
          <>
            <Reorder.Group
              axis="y"
              values={images}
              onReorder={(im) => onChange(im)}
            >
              {images.map((img) => (
                <Reorder.Item key={img.key} value={img}>
                  <div className="mb-4 border rounded p-5 bg-white">
                    <img
                      alt=""
                      className="flex-shrink min-w-0 w-[300px]"
                      src={img.url}
                      width={img.width}
                      height={img.height}
                    />
                    <div className="text-sm text-zinc-500 flex justify-between">
                      尺寸：{img.width} x {img.height}
                      <button
                        type="button"
                        className="text-red-700 hover:underline"
                        onClick={() => onRemoveClick(img.key)}
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {/* <div>
              {images.map((img) => {
                return (
                  <div key={img.url} className="mb-4">
                    <img
                      alt=""
                      className="flex-shrink min-w-0"
                      src={img.url}
                      width={img.width}
                      height={img.height}
                    />
                    <div className="text-sm text-zinc-500 flex justify-between">
                      尺寸：{img.width} x {img.height}
                      <button
                        type="button"
                        className="text-red-700 hover:underline"
                        onClick={() => onRemoveClick(img.key)}
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </>
        ) : (
          <div
            onDrop={(e) => {
              e.preventDefault();
              if (!e.dataTransfer) {
                return;
              }
              const files = e.dataTransfer.files;
              if (files.length === 0) return;

              upload(files[0]);
            }}
            className="grid w-[200px] h-[200px] border-dashed border-2 border-gray-200 rounded-lg items-center justify-center text-center"
          >
            Drop image here
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Button variant="outline" asChild className="bg-white cursor-pointer">
            <label htmlFor={fileId}>
              <UploadIcon className="w-4 h-4 mr-2" />
              上傳照片
              <input
                className="hidden"
                id={fileId}
                type="file"
                name="image"
                onChange={onFileChange}
              />
            </label>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex">
        {uploading ? <Loading className="ml-auto" /> : null}
      </CardFooter>
    </Card>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

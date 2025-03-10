import { Store } from "@prisma/client";
import Markdown from "react-markdown";

export function Content(props: {
  data: Partial<Pick<Store, "content" | "content_ref" | "content_ref_url">>;
}) {
  const { data } = props;
  if (!data.content) return null;

  return (
    <div className="md">
      <Markdown>{data.content}</Markdown>
      {data.content_ref && data.content_ref_url ? (
        <div className="mt-6 text-sm">
          本篇文章取自：
          <a href={data.content_ref_url} target="_blank">
            {data.content_ref}
          </a>
        </div>
      ) : null}
    </div>
  );
}

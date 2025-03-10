import { getTags } from "@/model/db";

export async function TagList() {
  const tags = await getTags();
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0">
      {tags.map((t) => {
        return (
          <a className="link whitespace-nowrap" key={t.id} href={`/t/${t.id}`}>
            #{t.name}
          </a>
        );
      })}
    </div>
  );
}

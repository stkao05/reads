import { PlaceDetail } from "@/app/admin/store/[id]/google-complete";
import { StoreDetail } from "@/model/db";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "../../component/favorite";
import { Content } from "./content";
import { OpeningHours } from "./opening-hours";
import { list } from "postcss";
import { ImageGrid } from "@/components/image-grid";

export function StorePage({
  store,
  admin,
  preview,
}: {
  store: StoreDetail;
  admin?: boolean;
  preview?: boolean;
}) {
  return (
    <div className="max-w-[500px] px-4">
      <h2 className="font-bold text-lg mb-4 relative">
        {store.name}
        {admin ? (
          <Link
            className="link-button absolute right-0 top-0 font-normal"
            href={`/admin/store/${store.id}`}
          >
            編輯
          </Link>
        ) : null}
      </h2>
      <div className="text-sm leading-loose mb-4">{store.summary}</div>
      <ImageGrid images={store.images} />
      <Info store={store} className="border-b pb-2 mb-4" />
      {store.content_show || preview ? <Content data={store} /> : null}
    </div>
  );
}

function Info({
  store,
  className,
}: {
  store: StoreDetail;
  className?: string;
}) {
  let addr = <>{store.address}</>;
  if (store.googlemap) {
    addr = (
      <>
        {store.address} (
        <a
          className="link whitespace-nowrap"
          href={store.googlemap}
          target="_blank"
        >
          地圖
        </a>
        )
      </>
    );
  }

  const phone = store.phone ? (
    <a className="link" href={`tel:${store.phone}`}>
      {store.phone}
    </a>
  ) : null;

  const place = store.google_place_info as PlaceDetail | null;

  return (
    <div className={`border-zinc-200 ${className || ""}`}>
      <div className="mt-4 grid grid-cols-[6rem_1fr]">
        <Field title="地址" value={addr} />
        {place ? <OpeningHours place={place} /> : null}
        <Field title="電話" value={phone} />
        <LinksField store={store} />
        <TagsField store={store} />
      </div>
      <div className="pt-2">
        <FavoriteButton id={store.id} className="relative -left-2" />
      </div>
    </div>
  );
}

function Field(props: { title: string; value: React.ReactNode | null }) {
  if (!props.value || props.value == "") return null;

  return (
    <>
      <div className="inline-block w-[100px]">{props.title}</div>
      <div>{props.value}</div>
    </>
  );
}

function LinksField(props: { store: StoreDetail }) {
  const keys = ["facebook", "instagram"] as const;
  const links = keys
    .filter((x) => props.store[x])
    .map((x) => (
      <a className="link capitalize" key={x} href={props.store[x] as string}>
        {x}
      </a>
    ));

  if (links.length == 0) return null;

  const list = [];
  for (const a of links) {
    list.push(a);
    list.push(" / ");
  }
  list.pop();

  return (
    <>
      <div className="inline-block w-[100px]">連結</div>
      <div>{list}</div>
    </>
  );
}

function TagsField(props: { store: StoreDetail }) {
  const { store } = props;
  if (store.tags.length == 0) return null;
  return (
    <>
      <div className="inline-block w-[100px]">標籤</div>
      <div className="flex gap-2">
        {store.tags.map((t) => {
          return (
            <a className="link" key={t.id} href={`/t/${t.id}`}>
              #{t.name}
            </a>
          );
        })}
      </div>
    </>
  );
}

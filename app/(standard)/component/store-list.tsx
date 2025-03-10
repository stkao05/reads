import { ListItem } from "@/model/db";
import { StoreItem } from "./store-item";

export function StoreList(props: { stores: ListItem[] }) {
  return (
    <div className="px-6 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:grid-cols-3 lg:gap-20">
      {props.stores.map((x, i) => (
        <StoreItem key={x.id} store={x} index={i}></StoreItem>
      ))}
    </div>
  );
}

import { getListItem } from "@/model/db";
import { Map } from "./map";

export default async function MapPage() {
  const stores = await getListItem();
  return <Map stores={stores} />;
}

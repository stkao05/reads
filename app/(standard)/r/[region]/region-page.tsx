import { getListItem } from "@/model/db";
import { RegionCode } from "@/model/region";
import { RegionLinks } from "../../component/region-links";
import { StoreList } from "../../component/store-list";

export async function RegionPage({region}: {region: RegionCode | null})
{
  const r = (region || "taipei") as RegionCode;
  const all = await getListItem();
  const stores = all.filter((x) => x.region === r);

  return (
    <div>
      <div className="pl-2 mb-6">
        <RegionLinks region={r} />
      </div>
      <StoreList stores={stores} />
    </div>
  );
}

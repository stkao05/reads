import { RegionCode, getRegion, regions } from "@/model/region";
import { Metadata } from "next";
import { RegionPage } from "./region-page";

export async function generateStaticParams() {
  return regions.map((region) => ({
    region: region.code,
  }));
}

type Params = Promise<{
  region: string
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const r = getRegion(p.region as RegionCode);
  return {
    title: `${r.name} - 島嶼書店指南`,
  };
}

export default async function Page(props: {
  params: Promise<{
    region?: string
  }>
}) {
  const params = await props.params
  const region = (params.region || "taipei") as RegionCode;
  return <RegionPage region={region} />;
}

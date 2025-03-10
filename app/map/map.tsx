"use client";
import { ListItem } from "@/model/db";
import { RegionCode, getRegion, regions } from "@/model/region";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StoreItem } from "../(standard)/component/store-item";
import { InfoPopup } from "./info-popup";
import { Locator } from "./locator";
import { useMap } from "./use-map";

export function Map({ stores }: { stores: ListItem[] }) {
  const [region, setRegion] = useState<RegionCode>("taipei");
  const [map, id, visibles, active, setActive, setHover] = useMap(stores);
  const activeStore = stores.find((x) => x.id === active);

  useEffect(() => {
    if (!map) return;
    var bounds = new google.maps.LatLngBounds();

    // fit the map to include all bookstore.
    // diable now as not sure because the zoom could get too close
    // const stores = byRegion(region);
    // for (const x of stores) {
    //   if (!x.coord) continue;
    //   bounds.extend(x.coord);
    // }
    // map.fitBounds(bounds, 100);

    const r = getRegion(region);
    if (!r.bound) return;
    bounds.extend(r.bound.northeast);
    bounds.extend(r.bound.southwest);
    map.fitBounds(bounds, 0);
  }, [map, region]);

  return (
    <>
      <div className="h-[100dvh] sm:grid sm:grid-cols-[600px_1fr]">
        <Link
          className="sm:hidden fixed top-6 left-6 z-10 bg-white border-transparent opacity-80 border shadow-sm active:bg-white inline-flex items-center hover:bg-zinc-100 transition rounded-md p-2"
          href="/"
        >
          <Image alt="logo" src="/tbi-logo.svg" width="27" height="26"></Image>
          <h1 className="ml-4 font-bold tracking-wider">島嶼書店指南</h1>
        </Link>
        <div className="hidden sm:block h-full px-8 overflow-scroll border-r">
          <div className="pt-4 pb-2 flex justify-between items-center">
            <Link
              className="inline-flex items-center hover:bg-zinc-100 transition rounded-md p-2"
              href="/"
            >
              <Image
                alt="logo"
                src="/tbi-logo.svg"
                width="27"
                height="26"
              ></Image>
              <h1 className="ml-4 font-bold tracking-wider">島嶼書店指南</h1>
            </Link>
            <div className="text-sm text-zinc-500">
              {visibles.length > 0 ? `附近有${visibles.length}家書店` : null}
            </div>
          </div>
          <div className="flex justify-end mb-2">
            {/* {locating ? <Loading className="mr-2" /> : null}
            <button className="text-sm text-zinc-500 mr-2" onClick={onLocateMe}>
              找尋我所在位置
            </button> */}
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionCode)}
              className="rounded border border-zinc-300 text-sm text-zinc-800 p-[2px] hover:bg-zinc-100 cursor-pointer"
            >
              {regions.map((x) => {
                return (
                  <option key={x.code} value={x.code}>
                    {x.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-8 -mx-4">
            {visibles.map((x, i) => {
              return (
                <StoreItem
                  key={x.id}
                  store={x}
                  onMouseEnter={() => setHover(x.id)}
                  onMouseLeave={() => setHover(null)}
                  index={i}
                ></StoreItem>
              );
            })}
          </div>
        </div>
        {/* map */}
        <div className="relative">
          <Locator map={map}></Locator>
          <div className="h-[100dvh]" id={id}></div>
        </div>
      </div>
      {/* template for larger viewport */}
      <InfoPopup
        data-tmpl="info-popup"
        id=""
        name=""
        href=""
        summary=""
        img={null}
        className="hidden absolute map-popup bg-white w-[300px] z-50 rounded-lg shadow-lg overflow-hidden cursor-pointer animate-fadein border border-zinc-700"
      />
      {/* popup for mobile */}
      <AnimatePresence>
        {activeStore ? (
          <motion.div
            initial={{ opacity: 0, bottom: -8 }}
            animate={{ opacity: 1, bottom: 0 }}
            exit={{ opacity: 0, bottom: -8 }}
            className="sm:hidden fixed bottom-0 left-0 p-4 z-30"
          >
            <InfoPopup
              id={activeStore.id}
              name={activeStore.name}
              summary={activeStore.summary || ""}
              img={activeStore.img}
              className="grid grid-cols-[2fr_3fr] h-[150px] relative map-popup bg-white w-full hz-50 rounded-lg shadow-lg overflow-hidden cursor-pointer animate-fadein border border-zinc-700"
              onClose={(event) => {
                event.preventDefault();
                setActive(null);
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

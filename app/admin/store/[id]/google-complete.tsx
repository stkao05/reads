import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loading } from "@/components/ui/loading";
import { Store } from "@prisma/client";
import { useState } from "react";
import { googlePlaceSearch } from "./actions";
import { findRegion } from "@/model/region";
import { flushSync } from "react-dom";

export function GoogleMapSuggest({
  name,
  onSelect,
}: {
  name?: string;
  onSelect: (data: Suggestion) => void;
}) {
  const [fetching, setFetching] = useState(false);
  let [result, setResult] = useState<PlaceDetail[]>();
  const [open, setOpen] = useState(false);

  const onSearchClick = async () => {
    if (!name) return;

    flushSync(() => setFetching(true));
    try {
      const res = await googlePlaceSearch(name);
      if (res.status === "OK") {
        res.candidates = res.candidates.map(
          (x: { formatted_address: string }) => {
            const pattern = /^[0-9]+台灣/g;
            return {
              ...x,
              formatted_address: x.formatted_address.replace(pattern, ""),
            };
          }
        );
        setResult(res.candidates);
      }
    } finally {
      setOpen(true);
      setFetching(false);
    }
  };
  // result = [...result, ...result];

  return (
    <div className="mb-6 flex flex-row-reverse">
      <Button
        disabled={!name}
        onClick={onSearchClick}
        variant="secondary"
        type="button"
      >
        用名稱搜尋網路資料
        {fetching ? <Loading /> : null}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>搜尋結果</DialogTitle>
          </DialogHeader>
          {!result || result.length === 0 ? (
            <DialogDescription>無法找到書店相關資料</DialogDescription>
          ) : (
            <div>
              <DialogDescription className="mb-4">
                搜尋到下列結果，點選符合的店家資料來帶入資料
              </DialogDescription>
              {result.map((x, i) => {
                const { location } = x.geometry;
                const region = findRegion(x.formatted_address);
                const onClick = () => {
                  onSelect({
                    name: x.name,
                    address: x.formatted_address,
                    googlemap: x.url,
                    google_place_id: x.place_id,
                    coord_lat: x.geometry.location.lat,
                    coord_lng: x.geometry.location.lng,
                    region: region ? region.code : null,
                    google_place_info: x,
                  });
                  setOpen(false);
                };

                return (
                  <div
                    key={i}
                    className="text-left rounded-md border px-4 py-4"
                  >
                    <div className="grid sm:grid-cols-[1fr_250px]">
                      <div className="mb-2">
                        <div className="font-semibold">{x.name}</div>
                        <div>{x.formatted_address}</div>
                      </div>
                      <GoogleEmbed
                        lat={location.lat}
                        lng={location.lng}
                        placeId={x.place_id}
                      />
                      <Button className="block mt-4" onClick={onClick}>
                        帶入資料
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GoogleEmbed(props: { lat: number; lng: number; placeId: string }) {
  const params = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
    center: `${props.lat},${props.lng}`,
    language: "zh-TW",
    q: `place_id:${props.placeId}`,
    zoom: "16",
  });

  return (
    <iframe
      width="250"
      height={(250 / 4) * 3}
      className="border rounded-md"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/place?${params.toString()}`}
    ></iframe>
  );
}

export type PlaceDetail = {
  business_status: string;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: {
    location: { lat: number; lng: number };
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  name: string;
  opening_hours?: {
    periods: {
      close: { day: number; time: string }; // {day: 0, time: '1730'}, weekday start on sunday
      open: { day: number; time: string };
    }[];
    weekday_text: string[]; // "星期一: 11:00 – 17:00", "星期二: 休息"
  };
  photo: {
    html_attributions: string[];
    photo_reference: string;
    height: number;
    width: number;
  };
  place_id: string;
  url: string;
  website: string;
};

export type Suggestion = Pick<
  Store,
  | "name"
  // | "hours"
  | "address"
  | "googlemap"
  | "google_place_id"
  | "region"
  | "coord_lat"
  | "coord_lng"
  | "google_place_info"
>;

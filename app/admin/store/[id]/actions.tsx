"use server";

type PlaceDetail = {
  business_status: string;
  formatted_address: string;
  formatted_phone_number: string;
  geometry: any;
  name: string;
  opening_hours: any;
  photos: any[];
  place_id: string;
  url: string;
  utc_offset: number;
  website: string;
};

export async function fetchDetail(placeId: string) {
  const fields = [
    "business_status",
    "editorial_summary",
    "formatted_address",
    "formatted_phone_number",
    "geometry",
    "name",
    "opening_hours",
    "photos",
    "place_id",
    "secondary_opening_hours",
    "url",
    "utc_offset",
    "website",
    "website",
  ];

  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY!,
    place_id: placeId,
    fields: fields.join(","),
    language: "zh-TW",
  });

  const r = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
    { cache: "no-store" }
  );

  const res = await r.json();
  if (res.status !== "OK") throw new Error(res.error_message);

  return res.result;
}

type SearchResult = {
  status: "OK" | "INVALID_REQUEST";
  candidates: { place_id: string }[];
};

/**
 *
 * https://developers.google.com/maps/documentation/places/web-service/search-find-place
 * @param name
 * @returns
 */
export async function googlePlaceSearch(name: string) {
  const fields = [
    "formatted_address",
    "geometry",
    "name",
    "place_id",
    "photos",
  ];
  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY!,
    inputtype: "textquery",
    input: name,
    language: "zh-TW",
    locationbias: "rectangle:21.9155,119.3129|25.9757,124.5657",
    fields: fields.join(","),
  });

  const r = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params.toString()}`,
    { cache: "no-store" }
  );
  const res = await r.json();
  if (res.status === "OK") {
    res.candidates = await Promise.all(
      res.candidates.map((x: { place_id: string }) => fetchDetail(x.place_id))
    );
  }

  console.log(res);

  return res;
}

import { useState, useEffect, useRef } from "react";
import { loader } from "./use-map";
import { Loading } from "../../components/ui/loading";
import { useToast } from "@/components/ui/use-toast";

async function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 8000,
    });
  });
}

export function Locator({ map }: { map?: google.maps.Map }) {
  const [locating, setLocating] = useState(false);
  const marker = useRef<google.maps.marker.AdvancedMarkerElement>();
  const watching = useRef<boolean>(false);
  const { toast } = useToast();

  async function locate(showLoader: boolean = true) {
    if (!navigator.geolocation || !map) return;

    // const position = { lat: 25.0304012, lng: 121.5286144 };
    let position: GeolocationPosition;
    try {
      if (showLoader) setLocating(true);
      position = await getCurrentPosition();
    } catch (e) {
      if (e instanceof GeolocationPositionError) {
        switch (e.code) {
          case GeolocationPositionError.PERMISSION_DENIED: {
            toast({
              title: "無法使用定位功能",
              description: "請到手機設定，授予瀏覽器讀取定位的權限",
            });
            return;
          }
          default: {
            toast({ title: "無法定位", description: "請在嘗試定位" });
            console.log(e);
          }
        }
      }

      return;
    } finally {
      if (showLoader) setLocating(false);
    }

    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    map.setCenter(pos);
    map.setZoom(14);
    updateMarker(map, pos);

    if (!watching.current) {
      navigator.geolocation.watchPosition(
        (position) => {
          updateMarker(map, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (e) => {
          console.error("geolocation.watchPosition error", e);
        }
      );
      watching.current = true;
    }
  }

  async function updateMarker(
    map: google.maps.Map,
    position: { lat: number; lng: number }
  ) {
    if (marker.current) {
      marker.current.position = position;
    } else {
      const { AdvancedMarkerElement } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const content = document.createElement("div");
      content.innerHTML = `
      <span class="relative flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white"></span>
      </span>
      `;

      marker.current = new AdvancedMarkerElement({
        map,
        position: position,
        content,
      });
    }
  }

  // NOTE: locate user from the start. disable now as it may not be desirable
  //
  // const init = useRef(false);
  // useEffect(() => {
  //   if (!init.current && map) {
  //     navigator.permissions.query({ name: "geolocation" }).then((result) => {
  //       if (result.state === "granted") {
  //         locate(false);
  //       }
  //     });
  //     init.current = true;
  //   }
  // });

  return (
    <>
      {locating ? (
        <div className="absolute bottom-6 right-1/2 translate-x-1/2 z-20 animate-fadein">
          <div className="rounded-lg border text-zinc-200 py-2 px-3 bg-zinc-800">
            <Loading className="text-white" />
          </div>
        </div>
      ) : null}
      <div className="absolute bottom-6 right-4 z-10">
        <button
          onClick={() => locate()}
          className="border border-zinc-300 bg-white p-2 rounded-lg hover:bg-zinc-100 active:bg-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

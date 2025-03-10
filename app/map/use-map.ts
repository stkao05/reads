"use client";
import { ListItem } from "@/model/db";
import { autoPlacement, computePosition, offset } from "@floating-ui/dom";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useId, useRef, useState } from "react";

export const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
  version: "weekly",
});

type Popup = {
  setMap(map: google.maps.Map | null): void;
};

export function useMap(stores: ListItem[]) {
  const id = useId();
  const [visible, setVisible] = useState<ListItem[]>([]);
  const [active, setActive] = useState<ListItem["id"] | null>(null);
  const [hover, setHover] = useState<ListItem["id"] | null>(null);
  const [markerMap] = useState(
    new Map<google.maps.marker.AdvancedMarkerElement, ListItem>()
  );
  const activePopup = useRef<[Popup, ListItem]>();
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    (async () => {
      const { Map } = await loader.importLibrary("maps") as google.maps.MapsLibrary; // prettier-ignore
      const { AdvancedMarkerElement } = await loader.importLibrary("marker") as google.maps.MarkerLibrary; // prettier-ignore
      const { LatLng } = await loader.importLibrary("core") as google.maps.CoreLibrary; // prettier-ignore

      const elm = document.getElementById(id);
      if (!elm) throw new Error("cannot find element: " + id);

      const map = new Map(elm, {
        zoom: 10,
        mapId: "42ce9df89cdc34ac",
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false,
        gestureHandling: "greedy",
        zoomControl: false,
        fullscreenControl: false,
      });
      setMap(map);

      const markers = stores
        .filter((x) => x.coord_lat)
        .map((store) => {
          const pin = document.createElement("button");
          pin.className = "marker-content";
          pin.textContent = store.name;

          const marker = new AdvancedMarkerElement({
            map,
            position: {
              lat: store.coord_lat!,
              lng: store.coord_lng!,
            },
            content: pin,
          });

          marker.element.classList.add("marker");
          markerMap.set(marker, store);

          return marker;
        });

      const onViewBoundChange = () => {
        const bounds = map.getBounds();
        if (!bounds) return;

        const visible = markers
          .filter((x) => x.position && bounds.contains(x.position))
          .map((x) => markerMap.get(x) as ListItem)
          .filter((x) => x);

        setVisible(visible);
      };

      map.addListener("center_changed", onViewBoundChange);
      map.addListener("bounds_changed", onViewBoundChange);

      const Popup = loadPopup();

      for (const [marker, store] of Array.from(markerMap.entries())) {
        const handler = () => {
          if (!marker.position) return;

          setActive(store.id);

          if (screen.width > 640) {
            const popup = new Popup(
              store,
              marker.position as google.maps.LatLng,
              marker.element,
              () => {
                setActive(null);
              }
            );

            popup.setMap(map);

            if (activePopup.current) {
              const [curPopup, curStore] = activePopup.current;
              if (curStore != store) {
                curPopup.setMap(null);
              }
            }

            popup.draw();
            activePopup.current = [popup, store];
          }
        };

        marker.element.addEventListener("touchstart", handler, {
          passive: true,
        });
        marker.element.addEventListener("click", handler);
      }
    })();
  }, [id, setVisible, setActive, markerMap, stores]);

  useEffect(() => {
    for (const [marker, store] of Array.from(markerMap.entries())) {
      marker.element.classList.remove("active");

      if (store.id === active) {
        marker.element.classList.add("active");
      }
    }
  }, [markerMap, active]);

  useEffect(() => {
    for (const [marker, store] of Array.from(markerMap.entries())) {
      marker.element.classList.remove("hover");

      if (store.id === hover) {
        marker.element.classList.add("hover");
      }
    }
  }, [markerMap, hover]);

  return [map, id, visible, active, setActive, setHover] as const;
}

function loadPopup() {
  class Popup extends google.maps.OverlayView {
    position: google.maps.LatLng;
    elm: HTMLAnchorElement;
    store: ListItem;
    marker: HTMLElement;

    constructor(
      store: ListItem,
      position: google.maps.LatLng,
      marker: HTMLElement,
      onClose: () => void
    ) {
      super();
      this.position = position;
      this.store = store;

      const tmpl = document.querySelector("[data-tmpl=info-popup]");
      if (!tmpl) throw new Error("cannot find templ");

      this.elm = tmpl.cloneNode(true) as HTMLAnchorElement;
      this.elm.classList.remove("hidden");
      this.elm.href = `/${store.id}`;

      const img = this.elm.querySelector(
        "[data-field=img]"
      ) as HTMLImageElement;
      img.src = store.img?.url || "";
      img.width = store.img?.width || 0;
      img.height = store.img?.height || 0;

      const name = this.elm.querySelector(
        "[data-field=name]"
      ) as HTMLDivElement;
      name.textContent = store.name;

      const subtitle = this.elm.querySelector(
        "[data-field=subtitle]"
      ) as HTMLDivElement;
      subtitle.textContent = store.summary;

      const btn = this.elm.querySelector(
        "[data-close-btn]"
      ) as HTMLButtonElement;

      btn.addEventListener("click", (event) => {
        event.preventDefault();
        this.setMap(null);
        onClose();
      });

      this.marker = marker;
    }

    onAdd() {
      this.getPanes()!.floatPane.appendChild(this.elm);
    }

    onRemove() {
      if (this.elm.parentElement) {
        this.elm.parentElement.removeChild(this.elm);
      }
    }

    draw() {
      const proj = this.getProjection();
      if (!proj) return; // if the map is not yet initialized then the result is undefined.

      computePosition(this.marker, this.elm, {
        placement: "top",
        middleware: [offset(10), autoPlacement()],
      }).then(({ x, y }) => {
        Object.assign(this.elm.style, { left: `${x}px`, top: `${y}px` });
      });
    }
  }
  return Popup;
}

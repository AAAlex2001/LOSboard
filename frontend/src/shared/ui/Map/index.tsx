"use client";

import { useEffect, useRef } from "react";
import style from "./style.module.scss";

interface MapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  onLocationClick?: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

interface YmapsMap {
  setCenter: (coords: number[], zoom?: number) => void;
  destroy: () => void;
  geoObjects: { add: (obj: unknown) => void };
  events: {
    add: (event: string, cb: (e: { get: (key: string) => number[] }) => void) => void;
  };
}

interface YmapsPlacemark {
  geometry: { setCoordinates: (coords: number[]) => void };
}

interface YmapsGlobal {
  ready: (cb: () => void) => void;
  Map: new (
    element: HTMLElement,
    options: { center: number[]; zoom: number; controls?: string[] }
  ) => YmapsMap;
  Placemark: new (
    coords: number[],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>
  ) => YmapsPlacemark;
  geocode: (coords: number[]) => Promise<{
    geoObjects: { get: (i: number) => { getAddressLine: () => string } };
  }>;
}

declare global {
  interface Window {
    ymaps?: YmapsGlobal;
  }
}

const SCRIPT_ID = "yandex-maps-script";
const DEFAULT_LAT = 43.00266;
const DEFAULT_LON = 41.01857;
const DEFAULT_ZOOM = 12;

const loadYandexScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.ymaps) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};

export const Map = ({
  latitude,
  longitude,
  zoom = DEFAULT_ZOOM,
  onLocationClick,
}: MapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YmapsMap | null>(null);
  const placemarkRef = useRef<YmapsPlacemark | null>(null);
  const onClickRef = useRef(onLocationClick);

  onClickRef.current = onLocationClick;

  useEffect(() => {
    let cancelled = false;

    loadYandexScript().then(() => {
      if (cancelled || !window.ymaps) return;

      window.ymaps.ready(() => {
        if (cancelled || !containerRef.current || !window.ymaps) return;

        const lat = latitude ?? DEFAULT_LAT;
        const lon = longitude ?? DEFAULT_LON;

        const map = new window.ymaps.Map(containerRef.current, {
          center: [lat, lon],
          zoom,
          controls: ["zoomControl"],
        });

        if (latitude !== undefined && longitude !== undefined) {
          const placemark = new window.ymaps.Placemark(
            [lat, lon],
            {},
            { preset: "islands#redIcon" }
          );
          map.geoObjects.add(placemark);
          placemarkRef.current = placemark;
        }

        map.events.add("click", async (e) => {
          if (!window.ymaps) return;
          const coords = e.get("coords");
          const lat = coords[0];
          const lon = coords[1];

          // Сразу ставим/двигаем пин — визуальный фидбек до любых запросов
          if (placemarkRef.current) {
            placemarkRef.current.geometry.setCoordinates(coords);
          } else {
            const placemark = new window.ymaps.Placemark(
              coords,
              {},
              { preset: "islands#redIcon" }
            );
            map.geoObjects.add(placemark);
            placemarkRef.current = placemark;
          }

          // Адрес как fallback (если геокодинг не сработает)
          let address = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse` +
                `?lat=${lat}&lon=${lon}` +
                `&format=json&accept-language=ru&zoom=18`
            );
            const data = await res.json();
            if (data?.display_name) {
              address = data.display_name;
            }
          } catch {
            // оставляем coords fallback
          }

          onClickRef.current?.({
            latitude: lat,
            longitude: lon,
            address,
          });
        });

        mapRef.current = map;
      });
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        placemarkRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || latitude === undefined || longitude === undefined) return;

    const coords = [latitude, longitude];
    mapRef.current.setCenter(coords, zoom);

    if (placemarkRef.current) {
      placemarkRef.current.geometry.setCoordinates(coords);
    } else if (window.ymaps) {
      const placemark = new window.ymaps.Placemark(
        coords,
        {},
        { preset: "islands#redIcon" }
      );
      mapRef.current.geoObjects.add(placemark);
      placemarkRef.current = placemark;
    }
  }, [latitude, longitude, zoom]);

  return <div ref={containerRef} className={style.wrap} />;
};

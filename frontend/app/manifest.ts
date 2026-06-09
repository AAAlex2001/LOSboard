import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LOS Daily — Доска объявлений Республики Абхазия",
    short_name: "LOS Daily",
    description:
      "Доска объявлений Республики Абхазия. Купить, продать, обменять — быстро и без посредников.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F9FB",
    theme_color: "#1129BD",
    lang: "ru",
    icons: [
      {
        src: "/los.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}

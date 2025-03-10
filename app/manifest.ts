import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "島嶼書店指南",
    short_name: "島嶼書店指南",
    display: "minimal-ui",
    description: "收集台灣各地的獨立書店",
    start_url: "/",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "logo-white.svg",
        sizes: "any",
      },
    ],
  };
}

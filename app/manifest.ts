import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Joh Tandou Portfolio",
    short_name: "Joh Tandou",
    description: "Portfolio de Joh Tandou — Software Engineer Full-Stack",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E14",
    theme_color: "#3ECFB2",
    icons: [{ src: "/favicon.png", sizes: "any", type: "image/png" }]
  };
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", disallow: "/1" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://jtandou.dev/sitemap.xml"
  };
}

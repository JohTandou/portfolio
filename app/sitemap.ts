import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://jtandou.dev",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1
  }];
}

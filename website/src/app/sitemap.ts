import { siteConfig } from "@/data/site";
import type { MetadataRoute } from "next";

const pages = ["", "/privacy", "/terms", "/legal", "/changelog"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${siteConfig.url}${path || "/"}`,
    lastModified: new Date("2026-08-28"),
    changeFrequency: path === "/changelog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}

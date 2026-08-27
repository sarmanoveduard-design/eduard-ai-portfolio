import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const languages = { en: absoluteUrl("/en"), ru: absoluteUrl("/ru"), "x-default": absoluteUrl("/") };

export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "ru"].map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages },
  }));
}

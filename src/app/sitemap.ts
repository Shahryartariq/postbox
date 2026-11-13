import type { MetadataRoute } from "next";
import { PAGE_DATES, SITE_URL } from "@/lib/site";

// Question pages are user content and not indexed, so only the public pages are listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: PAGE_DATES.home, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/ideas`, lastModified: PAGE_DATES.ideas, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified: PAGE_DATES.privacy, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: PAGE_DATES.terms, changeFrequency: "yearly", priority: 0.3 },
  ];
}

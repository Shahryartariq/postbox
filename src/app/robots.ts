import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Question pages stay crawlable so link previews (WhatsApp, X, Facebook) work;
// they carry `noindex` instead, which keeps them out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

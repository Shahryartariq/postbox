export const SITE_NAME = "Whisperbox";
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (productionHost ? `https://${productionHost}` : "http://localhost:3000")
).replace(/\/$/, "");
export const SITE_TITLE = "Whisperbox: ask anonymous questions, get honest answers";
export const SITE_DESCRIPTION =
  "Ask a question, share the link, and read anonymous answers as they arrive. Free, with no app and no sign-up for you or the people who answer.";
export const REPO_URL = "https://github.com/Shahryartariq/whisperbox";
export const AUTHOR = { name: "Muhammad Shehryar", url: "https://github.com/Shahryartariq" };

/** Dates the static pages last changed meaningfully (used in the sitemap). */
export const PAGE_DATES = {
  home: "2026-11-13",
  ideas: "2026-11-13",
  privacy: "2026-11-13",
  terms: "2026-11-13",
} as const;

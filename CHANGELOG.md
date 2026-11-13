# Changelog

## 1.0.0 (2026-11-13)

First public release.

### Features
- Ask a question and get a share link (copy, WhatsApp or the device share sheet).
- Anonymous answers that appear on the wall in real time.
- The asker can close a question, delete answers or delete the whole question.
- "Your questions" list for the browser that asked them.
- `/ideas`: 44 question ideas in five groups, each one tap from a new link.
- Link-preview image for every question.

### Security
- Firestore rules: answers store no author, only the asker can manage a question, nothing can be edited after posting, and length and rate limits apply (1 question per 30 s, 1 answer per 10 s per browser).
- Content Security Policy, HSTS and other security headers.
- Lean Firebase Auth setup (no popup helper script or iframe).

### SEO
- Canonical URLs, Open Graph and X cards, sitemap, robots.txt, web app manifest and icons.
- JSON-LD: WebSite, WebApplication, FAQPage, BreadcrumbList.
- Question pages are `noindex` (personal content) but keep their link previews.

### Pages
- Home with how-it-works and FAQ, `/privacy`, `/terms`, error and not-found pages.

### Fixes
- The home form no longer stays stuck on "Creating your link…" after you delete a question and come back.

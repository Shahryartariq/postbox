import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { AUTHOR, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  creator: AUTHOR.name,
  keywords: [
    "anonymous questions",
    "anonymous messages",
    "ask anonymously",
    "anonymous Q&A",
    "honest feedback",
    "questions for friends",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#2a1e5c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded bg-blush px-3 py-2 font-bold text-ink focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 pt-6">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-paper [font-variation-settings:'wdth'_80]"
          >
            whisperbox
          </Link>
          <nav aria-label="Main" className="flex gap-5 text-sm text-haze">
            <Link href="/ideas" className="underline-offset-4 hover:text-paper hover:underline">
              Question ideas
            </Link>
            <Link href="/" className="underline-offset-4 hover:text-paper hover:underline">
              Ask a question
            </Link>
          </nav>
        </header>
        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-10">
          {children}
        </main>
        <footer className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pb-8 text-sm text-haze">
          <p>
            Answers are anonymous: no names, no accounts. Built by{" "}
            <a href={AUTHOR.url} className="underline underline-offset-4 hover:text-paper">
              Shehryar Tariq
            </a>
            .
          </p>
          <nav aria-label="Footer" className="flex gap-4">
            <Link href="/privacy" className="underline-offset-4 hover:text-paper hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="underline-offset-4 hover:text-paper hover:underline">
              Terms
            </Link>
            <a href={REPO_URL} className="underline-offset-4 hover:text-paper hover:underline">
              Source code
            </a>
          </nav>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}

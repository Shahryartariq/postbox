import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Whisperbox — ask anything, get anonymous answers",
    template: "%s · Whisperbox",
  },
  description:
    "Ask a question, share the link, and read anonymous answers as they arrive. No sign-up for you or for the people who answer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 pt-6">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-paper [font-variation-settings:'wdth'_80]"
          >
            whisperbox
          </Link>
          <Link href="/" className="text-sm text-haze underline-offset-4 hover:text-paper hover:underline">
            Ask a question
          </Link>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 pt-10">{children}</main>
        <footer className="mx-auto w-full max-w-3xl px-5 pb-8 text-sm text-haze/80">
          Answers are anonymous: no names, no accounts. Built by{" "}
          <a
            href="https://github.com/Shahryartariq"
            className="underline underline-offset-4 hover:text-paper"
          >
            Shehryar Tariq
          </a>
          .
        </footer>
      </body>
    </html>
  );
}

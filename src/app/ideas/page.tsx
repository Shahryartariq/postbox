import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { IDEA_GROUPS } from "@/lib/ideas";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const COUNT = IDEA_GROUPS.reduce((n, g) => n + g.questions.length, 0);

export const metadata: Metadata = {
  title: `${COUNT} anonymous question ideas to ask your friends`,
  description:
    "Anonymous question ideas for friends, crushes, groups and honest feedback. Pick one and share it as a link: answers come back with no names attached.",
  alternates: { canonical: "/ideas" },
};

export default function IdeasPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}/ideas#page`,
              url: `${SITE_URL}/ideas`,
              name: `${COUNT} anonymous question ideas`,
              isPartOf: { "@id": `${SITE_URL}/#website` },
              inLanguage: "en",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Question ideas", item: `${SITE_URL}/ideas` },
              ],
            },
          ],
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-haze">
        <Link href="/" className="hover:text-paper hover:underline">
          Home
        </Link>{" "}
        / <span aria-current="page">Question ideas</span>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight [font-variation-settings:'wdth'_78] sm:text-6xl">
        {COUNT} anonymous question ideas
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-haze">
        Pick a question, tap <strong className="text-paper">Ask this</strong>, and share the link
        Whisperbox gives you. People answer without signing up, and you never see who wrote what.
      </p>

      <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
        {IDEA_GROUPS.map((g) => (
          <a
            key={g.slug}
            href={`#${g.slug}`}
            className="rounded-full border border-haze/40 px-3.5 py-1.5 text-sm text-haze hover:border-blush hover:text-paper"
          >
            {g.title}
          </a>
        ))}
      </nav>

      {IDEA_GROUPS.map((g) => (
        <section key={g.slug} id={g.slug} aria-labelledby={`${g.slug}-title`} className="mt-14 scroll-mt-6">
          <h2 id={`${g.slug}-title`} className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {g.title}
          </h2>
          <p className="mt-1 text-haze">{g.intro}</p>
          <ul className="mt-5 divide-y divide-haze/15 border-y border-haze/15">
            {g.questions.map((q) => (
              <li key={q} className="flex items-center justify-between gap-4 py-3">
                <span className="text-lg font-semibold">{q}</span>
                <Link
                  href={`/?q=${encodeURIComponent(q)}`}
                  className="shrink-0 rounded-full bg-blush px-4 py-1.5 text-sm font-bold text-ink hover:bg-blush-strong"
                  aria-label={`Ask this: ${q}`}
                >
                  Ask this
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-16 text-haze">
        Got your own question?{" "}
        <Link href="/" className="font-semibold text-paper underline underline-offset-4 hover:text-blush">
          Write it on the home page
        </Link>
        .
      </p>
    </>
  );
}

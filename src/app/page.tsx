import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AskForm, AskFormWithIdea } from "@/components/ask-form";
import { JsonLd } from "@/components/json-ld";
import { MyQuestions } from "@/components/my-questions";
import { FAQ } from "@/lib/faq";
import { IDEA_GROUPS } from "@/lib/ideas";
import { AUTHOR, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const IDEA_COUNT = IDEA_GROUPS.reduce((n, g) => n + g.questions.length, 0);

const STEPS = [
  {
    title: "Write your question",
    text: "Anything from “Who loves me?” to “What should I stop doing?”. Tap an idea if you're stuck.",
  },
  {
    title: "Share the link",
    text: "Copy it, or send it straight to WhatsApp, Instagram or anywhere else.",
  },
  {
    title: "Read the answers",
    text: "They drop onto your wall live, with no names attached. Delete any you don't like.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: `${SITE_URL}/`,
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              inLanguage: "en",
            },
            {
              "@type": "WebApplication",
              "@id": `${SITE_URL}/#app`,
              name: SITE_NAME,
              url: `${SITE_URL}/`,
              description: SITE_DESCRIPTION,
              applicationCategory: "SocialNetworkingApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
              codeRepository: REPO_URL,
            },
            {
              "@type": "FAQPage",
              "@id": `${SITE_URL}/#faq`,
              mainEntity: FAQ.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ],
        }}
      />

      <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.95] tracking-tight [font-variation-settings:'wdth'_78] sm:text-7xl">
        Ask anything. Read what people really think.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-haze">
        Write a question and share the link. Answers land on your wall as people send them.
        Nobody signs up, and no names are attached.
      </p>
      <div className="mt-10">
        <Suspense fallback={<AskForm />}>
          <AskFormWithIdea />
        </Suspense>
      </div>
      <MyQuestions />

      <section aria-labelledby="how" className="mt-24">
        <h2 id="how" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          How anonymous questions work
        </h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="text-4xl font-extrabold text-blush [font-variation-settings:'wdth'_78]">
                {i + 1}
              </span>
              <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 leading-relaxed text-haze">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-haze">
          Need inspiration?{" "}
          <Link href="/ideas" className="font-semibold text-paper underline underline-offset-4 hover:text-blush">
            Browse {IDEA_COUNT} anonymous question ideas
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="faq" className="mt-20">
        <h2 id="faq" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Questions about Whisperbox
        </h2>
        <div className="mt-6 divide-y divide-haze/15 border-y border-haze/15">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold marker:hidden">
                {q}
                <span aria-hidden className="text-2xl text-blush transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 max-w-2xl leading-relaxed text-haze">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

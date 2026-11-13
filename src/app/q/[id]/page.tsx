import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { QuestionWall } from "@/components/question-wall";
import { getPublicQuestion } from "@/lib/server-question";

export async function generateMetadata({ params }: PageProps<"/q/[id]">): Promise<Metadata> {
  const { id } = await params;
  const q = await getPublicQuestion(id);
  // Questions are personal user content: keep them out of search results, but
  // let link previews (WhatsApp, Instagram, X) show the question.
  const robots = { index: false, follow: true };
  if (!q) return { title: "Question not found", robots };
  const description = "Answer anonymously. No sign-up, and no name attached.";
  return {
    title: q.text,
    description,
    robots,
    alternates: { canonical: `/q/${id}` },
    openGraph: { title: q.text, description, url: `/q/${id}`, type: "website" },
    twitter: { card: "summary_large_image", title: q.text, description },
  };
}

export default function QuestionPage({ params }: PageProps<"/q/[id]">) {
  return (
    <Suspense fallback={<p className="text-haze">Loading question…</p>}>
      <Question params={params} />
    </Suspense>
  );
}

async function Question({ params }: Pick<PageProps<"/q/[id]">, "params">) {
  const { id } = await params;
  const q = await getPublicQuestion(id);
  if (!q) notFound();
  return <QuestionWall id={id} initialText={q.text} />;
}

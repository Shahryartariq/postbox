import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { QuestionWall } from "@/components/question-wall";
import { getPublicQuestion } from "@/lib/server-question";

export async function generateMetadata({ params }: PageProps<"/q/[id]">): Promise<Metadata> {
  const { id } = await params;
  const q = await getPublicQuestion(id);
  if (!q) return { title: "Question not found" };
  return {
    title: q.text,
    description: "Answer anonymously. No sign-up, and no name attached.",
    openGraph: { title: q.text, description: "Answer anonymously on Whisperbox." },
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

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAnonUser } from "@/lib/use-anon-user";
import { watchQuestion, watchReplies, type Question, type Reply } from "@/lib/whisper";
import { ReplyForm } from "./reply-form";
import { SharePanel } from "./share-panel";
import { Wall } from "./wall";

export function QuestionWall({ id, initialText }: { id: string; initialText: string }) {
  const { user, error: authError } = useAnonUser();
  const isNew = useSearchParams().get("new") === "1";
  // undefined = still loading, null = deleted
  const [question, setQuestion] = useState<Question | null | undefined>(undefined);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firestore needs the anonymous sign-in to finish before listening.
  useEffect(() => {
    if (!user) return;
    const offQ = watchQuestion(id, setQuestion, () =>
      setError("Couldn't load this question. Reload the page to try again."),
    );
    const offR = watchReplies(
      id,
      (r) => {
        setReplies(r);
        setRepliesLoaded(true);
      },
      () => setError("Couldn't load the answers. Reload the page to try again."),
    );
    return () => {
      offQ();
      offR();
    };
  }, [id, user]);

  if (question === null) {
    return (
      <div className="py-10">
        <h1 className="text-3xl font-extrabold">This question was deleted.</h1>
        <p className="mt-3 text-haze">The person who asked it removed it along with its answers.</p>
        <Link href="/" className="mt-6 inline-block font-bold text-blush underline underline-offset-4">
          Ask your own question
        </Link>
      </div>
    );
  }

  const isOwner = !!user && !!question && question.ownerUid === user.uid;
  const open = question?.open ?? true;
  const count = replies.length;

  return (
    <article>
      <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight [font-variation-settings:'wdth'_78] sm:text-6xl">
        {question?.text ?? initialText}
      </h1>
      <p className="mt-3 text-haze">
        {repliesLoaded ? `${count} ${count === 1 ? "answer" : "answers"}` : " "}
        {repliesLoaded && question && !open && ". Closed to new answers."}
      </p>

      <div className="mt-8">
        {isOwner && question ? (
          <SharePanel question={question} isNew={isNew} />
        ) : question && !open ? (
          <p className="rounded-lg border border-haze/30 px-5 py-4 text-haze">
            This question isn&apos;t taking answers anymore.{" "}
            <Link href="/" className="font-semibold text-blush underline underline-offset-4">
              Ask your own
            </Link>
          </p>
        ) : (
          <ReplyForm questionId={id} uid={user?.uid ?? null} />
        )}
      </div>

      {(error || authError) && (
        <p role="alert" className="mt-4 text-sm text-blush">
          {error ?? authError}
        </p>
      )}

      <section aria-label="Answers" className="mt-12">
        <Wall questionId={id} replies={replies} loaded={repliesLoaded} isOwner={isOwner} />
      </section>
    </article>
  );
}

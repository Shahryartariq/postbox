"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAnonUser } from "@/lib/use-anon-user";
import { watchMyQuestions, type Question } from "@/lib/whisper";

/** The questions this browser created. Hidden until there is at least one. */
export function MyQuestions() {
  const { user } = useAnonUser();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!user) return;
    return watchMyQuestions(user.uid, setQuestions, () => setQuestions([]));
  }, [user]);

  if (questions.length === 0) return null;

  return (
    <section aria-labelledby="mine" className="mt-20">
      <h2 id="mine" className="text-lg font-bold text-paper">
        Your questions
      </h2>
      <p className="mt-1 text-sm text-haze">Saved in this browser. Open one to read its answers.</p>
      <ul className="mt-5 divide-y divide-haze/15 border-y border-haze/15">
        {questions.map((q) => (
          <li key={q.id}>
            <Link
              href={`/q/${q.id}`}
              className="flex items-baseline justify-between gap-4 py-3.5 hover:text-blush"
            >
              <span className="truncate text-lg font-semibold">{q.text}</span>
              <span className="shrink-0 text-sm text-haze">{q.open ? "Open" : "Closed"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

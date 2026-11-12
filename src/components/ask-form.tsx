"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QUESTION_COOLDOWN_SECONDS, QUESTION_MAX } from "@/lib/limits";
import { useAnonUser } from "@/lib/use-anon-user";
import { createQuestion } from "@/lib/whisper";

const IDEAS = [
  "Who loves me?",
  "What was your first impression of me?",
  "Rate my vibe out of 10",
  "What should I stop doing?",
  "Tell me a secret",
];

export function AskForm() {
  const router = useRouter();
  const { user, error: authError } = useAnonUser();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = text.trim();
  const canSubmit = !!user && trimmed.length >= 3 && trimmed.length <= QUESTION_MAX && !busy;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const id = await createQuestion(user.uid, trimmed);
      // Next.js keeps this page's state when you come back to it, so reset the
      // form now; otherwise the button stays stuck on "Creating your link…".
      setText("");
      setBusy(false);
      router.push(`/q/${id}?new=1`);
    } catch {
      setError(
        `You can create one question every ${QUESTION_COOLDOWN_SECONDS} seconds. Wait a moment and try again.`,
      );
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label htmlFor="question" className="sr-only">
        Your question
      </label>
      <div className="slip rounded-sm bg-paper px-6 pb-4 pt-6 text-ink shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] [--tilt:-0.6deg]">
        <textarea
          id="question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={QUESTION_MAX}
          rows={3}
          placeholder="Who loves me?"
          className="w-full resize-none bg-transparent text-3xl font-bold leading-tight tracking-tight text-ink placeholder:text-ink/30 focus:outline-none sm:text-4xl"
        />
        <p className="mt-2 text-right text-sm text-ink/50" aria-live="polite">
          {trimmed.length}/{QUESTION_MAX}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Question ideas">
        {IDEAS.map((idea) => (
          <button
            key={idea}
            type="button"
            onClick={() => setText(idea)}
            className="rounded-full border border-haze/40 px-3.5 py-1.5 text-sm text-haze transition-colors hover:border-blush hover:text-paper"
          >
            {idea}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-blush px-7 py-3.5 text-lg font-bold text-ink transition-colors hover:bg-blush-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Creating your link…" : "Create my link"}
        </button>
        {!user && !authError && <span className="text-sm text-haze">Connecting…</span>}
      </div>

      {(error || authError) && (
        <p role="alert" className="text-sm text-blush">
          {error ?? authError}
        </p>
      )}
    </form>
  );
}

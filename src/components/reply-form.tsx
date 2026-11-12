"use client";

import Link from "next/link";
import { useState } from "react";
import { REPLY_COOLDOWN_SECONDS, REPLY_MAX } from "@/lib/limits";
import { addReply } from "@/lib/whisper";

export function ReplyForm({ questionId, uid }: { questionId: string; uid: string | null }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = text.trim();
  const canSend = !!uid && trimmed.length > 0 && trimmed.length <= REPLY_MAX && !busy;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!uid || !canSend) return;
    setBusy(true);
    setError(null);
    try {
      await addReply(uid, questionId, trimmed);
      setText("");
      setSent(true);
    } catch {
      setError(
        `You just sent an answer. Wait ${REPLY_COOLDOWN_SECONDS} seconds before sending another.`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={send} className="space-y-3">
      <label htmlFor="answer" className="sr-only">
        Your answer
      </label>
      <textarea
        id="answer"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSent(false);
        }}
        maxLength={REPLY_MAX}
        rows={3}
        placeholder="Write your answer. Nobody will know it's you."
        className="w-full resize-none rounded-md border border-haze/30 bg-dusk-deep/70 px-4 py-3 text-lg text-paper placeholder:text-haze/60 focus:border-blush focus:outline-none"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-full bg-blush px-6 py-3 font-bold text-ink transition-colors hover:bg-blush-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Sending…" : "Send anonymously"}
        </button>
        <span className="text-sm text-haze">
          {trimmed.length}/{REPLY_MAX}
        </span>
      </div>
      <div aria-live="polite">
        {sent && (
          <p className="text-sm text-paper">
            Sent. Your answer is on the wall with no name on it.{" "}
            <Link href="/" className="font-semibold text-blush underline underline-offset-4">
              Ask your own question
            </Link>
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-blush">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

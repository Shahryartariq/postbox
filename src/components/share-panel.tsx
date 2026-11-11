"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { deleteQuestion, setQuestionOpen, type Question } from "@/lib/whisper";

const noop = () => () => {};

export function SharePanel({ question, isNew }: { question: Question; isNew: boolean }) {
  const router = useRouter();
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => "");
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === "function",
    () => false,
  );
  const url = origin ? `${origin}/q/${question.id}` : "";
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function toggleOpen() {
    setBusy(true);
    setError(null);
    try {
      await setQuestionOpen(question.id, !question.open);
    } catch {
      setError("That didn't save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await deleteQuestion(question.id);
      router.push("/");
    } catch {
      setError("The question wasn't deleted. Try again.");
      setBusy(false);
    }
  }

  const shareText = `${question.text} Answer anonymously:`;

  return (
    <section
      aria-label="Share and manage"
      className="rounded-lg border border-blush/40 bg-dusk-soft/60 p-5 sm:p-6"
    >
      <p className="font-bold text-paper">
        {isNew ? "Your link is ready. Share it anywhere." : "Share your link"}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="share-url" className="sr-only">
          Share link
        </label>
        <input
          id="share-url"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-md bg-dusk-deep px-3 py-2.5 text-paper"
        />
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          className="rounded-md bg-blush px-4 py-2.5 font-bold text-ink hover:bg-blush-strong"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-paper underline underline-offset-4 hover:text-blush"
        >
          Share on WhatsApp
        </a>
        {canShare && (
          <button
            type="button"
            onClick={() => navigator.share({ text: shareText, url }).catch(() => {})}
            className="font-semibold text-paper underline underline-offset-4 hover:text-blush"
          >
            More ways to share
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-haze/20 pt-4 text-sm">
        <button
          type="button"
          onClick={toggleOpen}
          disabled={busy}
          className="font-semibold text-haze hover:text-paper"
        >
          {question.open ? "Stop taking answers" : "Start taking answers again"}
        </button>
        {confirmDelete ? (
          <span className="flex items-center gap-3">
            <span className="text-paper">Delete this question and every answer?</span>
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="font-bold text-blush hover:text-blush-strong"
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-haze hover:text-paper"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="font-semibold text-haze hover:text-blush"
          >
            Delete question
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-haze/80">
        Only this browser can manage this question. Bookmark this page to come back to it.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-blush">
          {error}
        </p>
      )}
    </section>
  );
}

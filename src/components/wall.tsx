"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { deleteReply, type Reply } from "@/lib/whisper";

const PAPERS = ["bg-paper", "bg-paper-pink", "bg-paper-mint"];

/** Stable pseudo-random number per reply, so a slip keeps its tilt and colour. */
function hash(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// A shared clock that ticks every 30s (client only), for "5 minutes ago" labels.
let clock = 0;
function subscribeClock(onChange: () => void) {
  const t = setInterval(() => {
    clock = Date.now();
    onChange();
  }, 30_000);
  return () => clearInterval(t);
}
function readClock() {
  if (!clock) clock = Date.now();
  return clock;
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(date: Date | null, now: number) {
  if (!now) return "";
  if (!date) return "just now";
  const s = Math.round((date.getTime() - now) / 1000);
  if (s > -45) return "just now";
  if (s > -3600) return rtf.format(Math.round(s / 60), "minute");
  if (s > -86400) return rtf.format(Math.round(s / 3600), "hour");
  return rtf.format(Math.round(s / 86400), "day");
}

export function Wall({
  questionId,
  replies,
  loaded,
  isOwner,
}: {
  questionId: string;
  replies: Reply[];
  loaded: boolean;
  isOwner: boolean;
}) {
  // Replies present in the first snapshot don't animate; later ones drop in.
  const seen = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const now = useSyncExternalStore(subscribeClock, readClock, () => 0);

  useEffect(() => {
    if (!loaded) return;
    if (seen.current === null) {
      seen.current = new Set(replies.map((r) => r.id));
      return;
    }
    const arrived = replies.filter((r) => !seen.current!.has(r.id)).map((r) => r.id);
    if (arrived.length === 0) return;
    arrived.forEach((id) => seen.current!.add(id));
    setFresh((prev) => new Set([...prev, ...arrived]));
  }, [replies, loaded]);

  if (!loaded) {
    return <p className="text-haze">Loading answers…</p>;
  }

  if (replies.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-haze/30 px-5 py-10 text-center text-haze">
        {isOwner
          ? "No answers yet. Share your link and they'll appear here as they come in."
          : "No answers yet. Yours can be the first."}
      </p>
    );
  }

  return (
    <ul className="columns-1 gap-5 sm:columns-2">
      {replies.map((r) => {
        const h = hash(r.id);
        const tilt = ((h % 7) - 3) * 0.45;
        return (
          <li
            key={r.id}
            style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
            className={`slip ${fresh.has(r.id) ? "slip-new" : ""} ${PAPERS[h % PAPERS.length]} group relative mb-5 break-inside-avoid rounded-sm px-5 pb-3 pt-4 text-ink shadow-[0_14px_30px_-16px_rgb(0_0_0/0.75)]`}
          >
            <p className="whitespace-pre-wrap break-words font-hand text-[1.65rem] font-medium leading-[1.15]">
              {r.text}
            </p>
            <p className="mt-2 text-xs text-ink/50">
              <time dateTime={r.createdAt?.toISOString()}>{timeAgo(r.createdAt, now)}</time>
            </p>
            {isOwner && (
              <button
                type="button"
                onClick={() => deleteReply(questionId, r.id).catch(() => {})}
                aria-label="Delete this answer"
                className="absolute right-2 top-1.5 rounded px-1.5 text-lg leading-none text-ink/40 hover:text-ink focus-visible:text-ink sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                ×
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

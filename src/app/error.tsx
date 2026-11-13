"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-10">
      <h1 className="text-4xl font-extrabold">Something went wrong on this page.</h1>
      <p className="mt-3 max-w-xl text-haze">
        It&apos;s on our side, not yours. Try again, and if it keeps happening, reload the page.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-blush px-6 py-3 font-bold text-ink hover:bg-blush-strong"
        >
          Try again
        </button>
        <Link href="/" className="font-semibold text-paper underline underline-offset-4 hover:text-blush">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}

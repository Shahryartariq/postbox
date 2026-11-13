import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { PAGE_DATES, REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "The rules for using Whisperbox: be kind, don't break the law, and look after your own link.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ProsePage title="Terms" updated={PAGE_DATES.terms}>
      <p>By using Whisperbox you agree to these simple rules.</p>

      <h2>Be decent</h2>
      <ul>
        <li>Don&apos;t send threats, harassment, hate or sexual content involving anyone.</li>
        <li>Don&apos;t share someone else&apos;s private information.</li>
        <li>Don&apos;t use Whisperbox for spam, scams or anything illegal.</li>
        <li>Being anonymous doesn&apos;t make it okay to hurt people.</li>
      </ul>

      <h2>Your questions</h2>
      <p>
        You&apos;re responsible for the questions you ask and where you share the link. You can delete
        any answer, stop taking answers, or delete the whole question at any time.
      </p>

      <h2>No guarantees</h2>
      <p>
        Whisperbox is a free project provided as is. We work to keep it running and safe, but we
        can&apos;t promise it will always be available, and we may remove content or limit use to
        stop abuse.
      </p>

      <h2>Reporting a problem</h2>
      <p>
        To report abuse or a bug, open an issue on <a href={`${REPO_URL}/issues`}>GitHub</a>.
      </p>
    </ProsePage>
  );
}

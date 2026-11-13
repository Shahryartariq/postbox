import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { PAGE_DATES, REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Whisperbox stores, what it doesn't, and how to delete your questions and answers.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy" updated={PAGE_DATES.privacy}>
      <p>
        Whisperbox is built to keep answers anonymous. This page explains exactly what is stored and
        who can see it.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>
          <strong>Questions:</strong> the text, when it was asked, whether it still takes answers, and
          a random ID for the browser that asked it (so only that browser can manage it).
        </li>
        <li>
          <strong>Answers:</strong> the text and when it was sent. Nothing else. No name, account, ID
          or device details are saved with an answer.
        </li>
        <li>
          <strong>Rate limits:</strong> for each browser, the time of its last question and last
          answer, to stop spam. This record doesn&apos;t say which question or answer it belongs to.
        </li>
      </ul>

      <h2>Your browser&apos;s anonymous ID</h2>
      <p>
        When you open Whisperbox, Firebase Authentication gives your browser a random anonymous ID and
        keeps it in your browser&apos;s storage. It isn&apos;t linked to your name, email or phone. If
        you clear your browser data you get a new ID, and you can no longer manage questions you asked
        before.
      </p>

      <h2>Who can see what</h2>
      <ul>
        <li>Anyone with a question&apos;s link can read the question and its answers.</li>
        <li>The person who asked can&apos;t see who wrote an answer, because that isn&apos;t stored.</li>
        <li>Questions aren&apos;t listed publicly, and question pages ask search engines not to index them.</li>
      </ul>

      <h2>Service providers</h2>
      <p>
        Whisperbox runs on <strong>Vercel</strong> (website hosting and cookie-free visit counts) and{" "}
        <strong>Google Firebase</strong> (database and anonymous sign-in, stored in Mumbai, India). Like
        any web host, they process your IP address to deliver the site and keep it safe. Whisperbox has
        no ads and no tracking cookies, and doesn&apos;t sell or share data.
      </p>

      <h2>Deleting data</h2>
      <p>
        From the browser that asked a question, you can delete any answer or delete the question,
        which removes every answer with it. Deleted data is removed from the database right away.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or a problem to report? Open an issue on{" "}
        <a href={`${REPO_URL}/issues`}>GitHub</a>.
      </p>
    </ProsePage>
  );
}

import "server-only";
import { cache } from "react";
import { ID_PATTERN } from "./limits";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo-whisperbox";
const base =
  process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true"
    ? "http://127.0.0.1:8080/v1"
    : "https://firestore.googleapis.com/v1";

export type PublicQuestion = { text: string; open: boolean };

/**
 * Reads a question over Firestore's REST API (questions are publicly readable),
 * for page metadata and link-preview images. Returns null if it doesn't exist.
 */
export const getPublicQuestion = cache(async (id: string): Promise<PublicQuestion | null> => {
  if (!ID_PATTERN.test(id)) return null;
  try {
    const res = await fetch(
      `${base}/projects/${projectId}/databases/(default)/documents/questions/${id}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const text = json?.fields?.text?.stringValue;
    if (typeof text !== "string") return null;
    return { text, open: json.fields.open?.booleanValue !== false };
  } catch {
    return null;
  }
});

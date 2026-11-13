import { OG_SIZE, renderOgCard } from "@/lib/og";
import { getPublicQuestion } from "@/lib/server-question";

export const alt = "A question on Whisperbox";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await getPublicQuestion(id);
  return renderOgCard(
    q?.text ?? "Ask anything. Read what people really think.",
    "Answer anonymously. No names, no sign-up.",
  );
}

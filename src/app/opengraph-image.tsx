import { OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = "Whisperbox: ask anything, read what people really think";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard(
    "Ask anything. Read what people really think.",
    "Anonymous answers. No app, no sign-up.",
  );
}

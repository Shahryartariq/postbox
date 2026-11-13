import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** The shared link-preview card: a paper slip with the question on dusk violet. */
export async function renderOgCard(text: string, footer: string) {
  const [display, hand] = await Promise.all([
    readFile(join(process.cwd(), "assets/bricolage-grotesque-latin-700-normal.woff")),
    readFile(join(process.cwd(), "assets/caveat-latin-600-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2a1e5c",
          padding: "64px 72px",
          fontFamily: "Bricolage",
          color: "#fff4d6",
        }}
      >
        <div style={{ fontSize: 34, color: "#b8aae6" }}>whisperbox</div>
        <div
          style={{
            display: "flex",
            background: "#fff4d6",
            color: "#22183d",
            padding: "44px 52px",
            borderRadius: 6,
            transform: "rotate(-1.2deg)",
            fontSize: text.length > 90 ? 52 : 72,
            lineHeight: 1.05,
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          }}
        >
          {text}
        </div>
        <div style={{ fontFamily: "Caveat", fontSize: 46, color: "#f6a6cf" }}>{footer}</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage", data: display, weight: 700, style: "normal" },
        { name: "Caveat", data: hand, weight: 600, style: "normal" },
      ],
    },
  );
}

"use client";

// Shown only if the root layout itself fails, so it can't rely on globals.css.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#2a1e5c",
          color: "#fff4d6",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>Whisperbox couldn&apos;t load.</h1>
          <p style={{ color: "#b8aae6", lineHeight: 1.5 }}>
            Something went wrong on our side. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#f6a6cf",
              color: "#22183d",
              border: 0,
              borderRadius: 999,
              padding: "12px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

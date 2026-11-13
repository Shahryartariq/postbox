import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true";

// Firebase talks to these from the browser: Firestore (realtime over WebChannel)
// and Auth (anonymous sign-in + token refresh).
const firebaseHosts = [
  "https://firestore.googleapis.com",
  "https://identitytoolkit.googleapis.com",
  "https://securetoken.googleapis.com",
];
const emulatorHosts = useEmulator ? ["http://127.0.0.1:8080", "http://127.0.0.1:9099"] : [];

// Static CSP (no nonce) so pages stay statically rendered. React escapes all
// user text and the app never injects HTML, so inline scripts are limited to
// Next.js's own bootstrap code and JSON-LD.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${[...firebaseHosts, ...emulatorHosts].join(" ")} https://vitals.vercel-insights.com`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev || useEmulator ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // The link-preview images read their fonts from /assets at runtime.
  outputFileTracingIncludes: {
    "/q/[id]/opengraph-image": ["./assets/*.woff"],
    "/opengraph-image": ["./assets/*.woff"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

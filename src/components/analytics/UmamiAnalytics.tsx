import Script from "next/script";

const ENABLED = process.env.NEXT_PUBLIC_UMAMI_ENABLED === "true";
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "";
const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL ?? "";

export function UmamiAnalytics() {
  if (!ENABLED || !WEBSITE_ID || !UMAMI_URL) {
    return null;
  }

  const scriptSrc = `${UMAMI_URL.replace(/\/$/, "")}/script.js`;

  return (
    <Script
      src={scriptSrc}
      data-website-id={WEBSITE_ID}
      data-auto-track="true"
      data-do-not-track="true"
      strategy="afterInteractive"
    />
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";

const SITE_URL = "https://opensolarcheck.de";

function safeJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd() {
  const locale = useLocale();
  const t = useTranslations("faq");

  const faqKeys = ["cost", "worthIt", "howMuchPower", "noRegistration", "accuracy"] as const;

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OpenSolarCheck",
    url: `${SITE_URL}/${locale}`,
    description:
      locale === "de"
        ? "Kostenloser Photovoltaik-Rechner: Berechnen Sie Ertrag, Kosten und Amortisation Ihrer Solaranlage – ohne Anmeldung."
        : "Free photovoltaic calculator: Calculate yield, costs, and payback period for your solar system – no registration.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    inLanguage: locale === "de" ? "de-DE" : "en-US",
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript",
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OpenSolarCheck",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: ["https://github.com/opensolarcheck/open-source-pv-rechner"],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqKeys.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${key}.answer`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(webApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(faqPage) }}
      />
    </>
  );
}

"use client";

import { useLocale, useTranslations } from "next-intl";

export function JsonLd() {
  const locale = useLocale();
  const t = useTranslations("faq");

  const faqKeys = ["cost", "worthIt", "howMuchPower", "noRegistration", "accuracy"] as const;

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OpenSolarCheck",
    url: `https://opensolarcheck.de/${locale}`,
    description:
      locale === "de"
        ? "Kostenloser Photovoltaik-Rechner: Berechne Ertrag, Kosten und Amortisation deiner Solaranlage – ohne Anmeldung."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

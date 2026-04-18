import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UmamiAnalytics } from "@/components/analytics/UmamiAnalytics";
import { TooltipProvider } from "@/components/ui/tooltip";
import deMessages from "@/lib/i18n/messages/de.json";
import enMessages from "@/lib/i18n/messages/en.json";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-mono",
});

const DOMAIN = "https://opensolarcheck.de";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const messagesMap: Record<string, Record<string, unknown>> = {
  de: deMessages,
  en: enMessages,
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = messagesMap[locale] ?? messagesMap.de;
  const meta = messages.meta as Record<string, string>;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(DOMAIN),
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      canonical: `${DOMAIN}/${locale}`,
      languages: {
        de: `${DOMAIN}/de`,
        en: `${DOMAIN}/en`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${DOMAIN}/${locale}`,
      siteName: "OpenSolarCheck",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "de" ? "en_US" : "de_DE",
      type: "website",
      images: [
        {
          url: `${DOMAIN}/og-${locale}.png`,
          width: 1200,
          height: 630,
          alt: "OpenSolarCheck",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${DOMAIN}/og-${locale}.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "de" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = messagesMap[locale] ?? messagesMap.de;

  return (
    <html lang={locale} className={`${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TooltipProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </TooltipProvider>
        </NextIntlClientProvider>
        <UmamiAnalytics />
      </body>
    </html>
  );
}

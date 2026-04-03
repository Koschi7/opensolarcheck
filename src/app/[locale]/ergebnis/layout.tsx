import type { Metadata } from "next";
import deMessages from "@/lib/i18n/messages/de.json";
import enMessages from "@/lib/i18n/messages/en.json";

const DOMAIN = "https://opensolarcheck.de";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const metaMap: Record<string, { title: string; description: string }> = {
  de: deMessages.meta.pages.results,
  en: enMessages.meta.pages.results,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaMap[locale] ?? metaMap.de;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${DOMAIN}/${locale}/ergebnis`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${DOMAIN}/${locale}/ergebnis`,
    },
    robots: { index: false, follow: false },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Eye,
  Cookie,
  HardDrive,
  Server,
  Lock,
  Globe,
  BarChart3,
  Check,
  Scale,
  FileWarning,
  RefreshCw,
} from "lucide-react";

export default function DatenschutzPage() {
  const t = useTranslations("privacy");

  const overviewItems = [
    { icon: Eye, text: t("overview.noData") },
    { icon: Cookie, text: t("overview.noTracking") },
    { icon: HardDrive, text: t("overview.local") },
  ];

  const hostingLogItems = [
    t("hosting.items.ip"),
    t("hosting.items.date"),
    t("hosting.items.page"),
    t("hosting.items.browser"),
    t("hosting.items.os"),
    t("hosting.items.referrer"),
  ];

  const analyticsPoints = [
    t("analytics.noCookies"),
    t("analytics.noIp"),
    t("analytics.noProfiles"),
    t("analytics.noPersonalData"),
    t("analytics.dnt"),
  ];

  const rights = [
    t("rights.access"),
    t("rights.rectification"),
    t("rights.erasure"),
    t("rights.restriction"),
    t("rights.portability"),
    t("rights.objection"),
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        </div>
        <p className="text-gray-600">{t("intro")}</p>
      </div>

      {/* 1. Verantwortlicher */}
      <Section icon={Scale} title={t("controller.title")}>
        <p className="text-gray-700">{t("controller.text")}</p>
        <Link
          href="/impressum"
          className="inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1"
        >
          {t("controller.link")} →
        </Link>
      </Section>

      {/* 2. Überblick */}
      <Section icon={Eye} title={t("overview.title")}>
        <div className="space-y-3">
          {overviewItems.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Hosting */}
      <Section icon={Server} title={t("hosting.title")}>
        <p className="text-gray-700">{t("hosting.text")}</p>
        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-1 mt-2">
          {hostingLogItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg">
          {t("hosting.legal")}
        </p>
        <a
          href="https://www.hetzner.com/legal/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
        >
          {t("hosting.hetznerLink")} →
        </a>
      </Section>

      {/* 4. SSL/TLS */}
      <Section icon={Lock} title={t("ssl.title")}>
        <p className="text-gray-700">{t("ssl.text")}</p>
      </Section>

      {/* 5. PVGIS */}
      <Section icon={Globe} title={t("pvgis.title")}>
        <p className="text-gray-700">{t("pvgis.text")}</p>
        <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg">
          {t("pvgis.legal")}
        </p>
        <a
          href="https://ec.europa.eu/info/legal-notice_en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
        >
          {t("pvgis.pvgisLink")} →
        </a>
      </Section>

      {/* 6. Analytics */}
      <Section icon={BarChart3} title={t("analytics.title")}>
        <p className="text-gray-700">{t("analytics.intro")}</p>
        <ul className="space-y-2 mt-2">
          {analyticsPoints.map((point, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 text-sm mt-3">{t("analytics.note")}</p>
        <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-3 rounded-lg">
          {t("analytics.legal")}
        </p>
        <a
          href="https://github.com/umami-software/umami"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
        >
          {t("analytics.link")} →
        </a>
      </Section>

      {/* 7. Betroffenenrechte */}
      <Section icon={Scale} title={t("rights.title")}>
        <p className="text-gray-700">{t("rights.intro")}</p>
        <ul className="space-y-2 mt-3">
          {rights.map((right, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700">
              <Check className="h-4 w-4 text-blue-600 shrink-0" />
              {right}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 text-sm mt-3">{t("rights.contact")}</p>
      </Section>

      {/* 8. Beschwerderecht */}
      <Section icon={FileWarning} title={t("complaint.title")}>
        <p className="text-gray-700">{t("complaint.text")}</p>
        <a
          href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
        >
          {t("complaint.link")} →
        </a>
      </Section>

      {/* 9. Änderungen */}
      <Section icon={RefreshCw} title={t("changes.title")}>
        <p className="text-gray-700">{t("changes.text")}</p>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ELECTRICITY_PRICE } from "@/lib/data/tariffs";
import {
  Sun,
  Zap,
  Home,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";

export default function MethodikPage() {
  const t = useTranslations("methodology");

  const sections = [
    {
      icon: Sun,
      titleKey: "radiation",
      color: "text-amber-500",
    },
    {
      icon: Zap,
      titleKey: "yield",
      color: "text-yellow-500",
    },
    {
      icon: Home,
      titleKey: "selfConsumption",
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      titleKey: "economics",
      color: "text-blue-500",
    },
    {
      icon: AlertCircle,
      titleKey: "limitations",
      color: "text-red-500",
    },
  ];

  const sources = [
    {
      key: "pvgis",
      url: "https://re.jrc.ec.europa.eu/pvg_tools/",
    },
    {
      key: "htw",
      url: "https://solar.htw-berlin.de/rechner/unabhaengigkeitsrechner/",
    },
    {
      key: "bdew",
      url: "https://www.bdew.de/energie/standardlastprofile-strom/",
    },
    {
      key: "eeg",
      url: "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/",
    },
    {
      key: "uba",
      url: "https://www.umweltbundesamt.de/themen/klima-energie/erneuerbare-energien",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600 mb-8">{t("intro")}</p>

      <div className="space-y-6">
        {sections.map(({ icon: Icon, titleKey, color }) => (
          <Card key={titleKey} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className={`h-5 w-5 ${color}`} />
                {t(`${titleKey}.title`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {t(`${titleKey}.text`)}
              </p>
              {titleKey === "economics" && (
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>
                    {t("economics.assumptions.electricityPrice", {
                      price: ELECTRICITY_PRICE,
                    })}
                  </li>
                  <li>{t("economics.assumptions.feedIn")}</li>
                  <li>{t("economics.assumptions.degradation")}</li>
                  <li>{t("economics.assumptions.maintenance")}</li>
                  <li>{t("economics.assumptions.discount")}</li>
                </ul>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Sources */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-purple-500" />
              {t("sources.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sources.map(({ key, url }) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {t(`sources.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

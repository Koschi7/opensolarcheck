"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Mail, User } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

const IMPRINT_NAME = process.env.NEXT_PUBLIC_IMPRINT_NAME ?? "";
const IMPRINT_STREET = process.env.NEXT_PUBLIC_IMPRINT_STREET ?? "";
const IMPRINT_CITY = process.env.NEXT_PUBLIC_IMPRINT_CITY ?? "";
const IMPRINT_EMAIL = process.env.NEXT_PUBLIC_IMPRINT_EMAIL ?? "";

export default function ImpressumPage() {
  const t = useTranslations("imprint");

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Info className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      </div>
      <p className="text-gray-500 mb-8">{t("subtitle")}</p>

      {/* Verantwortlicher */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            {t("responsible")}
          </h2>
          {IMPRINT_NAME ? (
            <div className="space-y-1 text-gray-700">
              <p className="font-medium">{IMPRINT_NAME}</p>
              {IMPRINT_STREET && <p>{IMPRINT_STREET}</p>}
              {IMPRINT_CITY && <p>{IMPRINT_CITY}</p>}
            </div>
          ) : (
            <p className="text-amber-600 text-sm">
              ⚠ Impressum nicht konfiguriert. Bitte NEXT_PUBLIC_IMPRINT_* Umgebungsvariablen setzen.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Kontakt */}
      {IMPRINT_EMAIL && (
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              {t("contact")}
            </h2>
            <p className="text-gray-700">
              {t("email")}:{" "}
              <a
                href={`mailto:${IMPRINT_EMAIL}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {IMPRINT_EMAIL}
              </a>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Haftungsausschluss */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("disclaimer.title")}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t("disclaimer.content")}
          </p>
        </CardContent>
      </Card>

      {/* Haftung für Links */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("links.title")}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t("links.content")}
          </p>
        </CardContent>
      </Card>

      {/* Open Source */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-3">
          <p className="text-gray-700">{t("openSource")}</p>
          <a
            href="https://github.com/Koschi7/opensolarcheck"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
          >
            <GitHubIcon className="h-5 w-5" />
            {t("github")}
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { CalculationResult } from "@/lib/types";

interface Props {
  result: CalculationResult;
}

export function ExportButton({ result }: Props) {
  const t = useTranslations("results");
  const locale = useLocale();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(false);
    try {
      const { generatePDFReport } = await import("@/lib/export/pdfReport");
      await generatePDFReport(result, locale);
      trackEvent({ name: "pdf_exported" });
    } catch (err) {
      console.error("PDF export failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={loading}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "…" : "↓"} {t("export")}
      </button>
      {error && (
        <p className="mt-2 font-mono-ui text-[11px] text-solar">
          {t("exportError")}
        </p>
      )}
    </div>
  );
}

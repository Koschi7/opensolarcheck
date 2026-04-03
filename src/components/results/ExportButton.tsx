"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { CalculationResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

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
      <Button
        onClick={handleExport}
        disabled={loading}
        variant="outline"
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {t("export")}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{t("exportError")}</p>
      )}
    </div>
  );
}

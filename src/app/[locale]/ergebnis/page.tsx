"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ConfiguratorInput, PVGISResponse, CalculationResult } from "@/lib/types";
import { calculateYield } from "@/lib/calculations/pvYield";
import { calculateSelfConsumption } from "@/lib/calculations/selfConsumption";
import { calculateEconomics } from "@/lib/calculations/economics";
import { calculateCO2Savings } from "@/lib/calculations/co2";
import { ResultSummary } from "@/components/results/ResultSummary";
import { YieldChart } from "@/components/results/YieldChart";
import { SelfConsumptionChart } from "@/components/results/SelfConsumptionChart";
import { FinancialChart } from "@/components/results/FinancialChart";
import { CO2Card } from "@/components/results/CO2Card";
import { ExportButton } from "@/components/results/ExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Loader2, Euro, Info } from "lucide-react";
import { INVESTMENT_COSTS } from "@/lib/data/tariffs";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function ErgebnisPage() {
  const t = useTranslations("results");
  const tEcon = useTranslations("results.economics");
  const { trackEvent } = useAnalytics();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("opensolarcheck_input");
      if (!stored) {
        setLoading(false);
        return;
      }

      const { input, pvgisData, totalConsumption: tc } = JSON.parse(stored) as {
        input: ConfiguratorInput;
        pvgisData: PVGISResponse | null;
        totalConsumption: number;
      };

      setTotalConsumption(tc);

      const yieldResult = calculateYield(
        input.system.peakPower,
        input.roof.shading,
        pvgisData,
        input.location.postalCode
      );

      const selfConsumptionResult = calculateSelfConsumption({
        peakPower_kWp: input.system.peakPower,
        annualYield_kWh: yieldResult.annualYield,
        annualConsumption_kWh: tc,
        batteryCapacity_kWh: input.battery.capacity,
        hasBattery: input.battery.hasBattery,
      });

      const economicResult = calculateEconomics({
        peakPower_kWp: input.system.peakPower,
        annualYield_kWh: yieldResult.annualYield,
        selfConsumptionRatio: selfConsumptionResult.selfConsumptionRatio,
        batteryCapacity_kWh: input.battery.capacity,
        hasBattery: input.battery.hasBattery,
      });

      const co2Result = calculateCO2Savings(yieldResult.annualYield);

      setResult({
        yield: yieldResult,
        selfConsumption: selfConsumptionResult,
        economics: economicResult,
        co2: co2Result,
        input,
      });
      trackEvent({ name: "configurator_completed" });
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false);
    }
  }, [trackEvent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Keine Ergebnisse vorhanden.</p>
        <Link href="/konfigurator">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("newCalculation")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600 mt-1">{t("subtitle")}</p>
      </div>

      {/* Summary cards */}
      <ResultSummary result={result} />

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <YieldChart result={result} totalConsumption={totalConsumption} />
        <SelfConsumptionChart result={result} />
      </div>

      {/* Financial chart */}
      <FinancialChart result={result} />

      {/* Investment highlight */}
      <Card className="shadow-md border-2 border-amber-200 bg-amber-50/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{tEcon("investment")}</p>
              <p className="text-4xl font-bold text-gray-900">
                ~{result.economics.totalInvestment.toLocaleString("de-DE")} €
              </p>
              <p className="text-sm text-amber-700 mt-1">
                {tEcon("investmentRange", {
                  min: Math.round(result.input.system.peakPower * INVESTMENT_COSTS.perKWp.min + (result.input.battery.hasBattery ? result.input.battery.capacity * INVESTMENT_COSTS.batteryPerKWh.min : 0)).toLocaleString("de-DE"),
                  max: Math.round(result.input.system.peakPower * INVESTMENT_COSTS.perKWp.max + (result.input.battery.hasBattery ? result.input.battery.capacity * INVESTMENT_COSTS.batteryPerKWh.max : 0)).toLocaleString("de-DE"),
                })}
              </p>
            </div>
            <div className="flex items-start gap-2 max-w-md">
              <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                {tEcon("investmentNote", {
                  costPerKwp: INVESTMENT_COSTS.perKWp.default.toLocaleString("de-DE"),
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Economics detail + CO2 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Euro className="h-5 w-5 text-amber-600" />
              {tEcon("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{tEcon("npv")}</span>
              <span className="font-semibold text-green-600">
                {result.economics.npv.toLocaleString("de-DE")} €
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{tEcon("roi")}</span>
              <span className="font-semibold text-green-600">
                {result.economics.roi}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{tEcon("totalSavings")}</span>
              <span className="font-semibold text-green-600">
                {result.economics.totalSavings25Years.toLocaleString("de-DE")} €
              </span>
            </div>
          </CardContent>
        </Card>

        <CO2Card co2={result.co2} />
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        <p className="text-sm text-red-800">{t("disclaimer")}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ExportButton result={result} />
        <Link href="/konfigurator">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("newCalculation")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

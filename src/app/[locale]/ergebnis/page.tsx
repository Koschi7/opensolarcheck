"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { INVESTMENT_COSTS } from "@/lib/data/tariffs";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function ErgebnisPage() {
  const t = useTranslations("results");
  const tEcon = useTranslations("results.economics");
  const locale = useLocale();
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
        <div className="text-center font-mono-ui text-[12px] text-muted-ink tracking-wider small-caps">
          · · · {t("loading")}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-[760px] mx-auto px-6 py-24 text-center">
        <p className="font-mono-ui text-[13px] text-muted-ink mb-6">
          Keine Ergebnisse vorhanden.
        </p>
        <Link href="/konfigurator" className="btn-primary">
          ← {t("newCalculation")}
        </Link>
      </div>
    );
  }

  const input = result.input;
  const shadingLabel: Record<string, string> = {
    none: "keine",
    low: "gering",
    medium: "mittel",
    high: "stark",
  };
  const moduleLabel: Record<string, string> = {
    monocrystalline: "Monokristallin",
    polycrystalline: "Polykristallin",
    thinfilm: "Dünnschicht",
  };

  const investMin = Math.round(
    input.system.peakPower * INVESTMENT_COSTS.perKWp.min +
      (input.battery.hasBattery
        ? input.battery.capacity * INVESTMENT_COSTS.batteryPerKWh.min
        : 0)
  );
  const investMax = Math.round(
    input.system.peakPower * INVESTMENT_COSTS.perKWp.max +
      (input.battery.hasBattery
        ? input.battery.capacity * INVESTMENT_COSTS.batteryPerKWh.max
        : 0)
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-6">
      {/* Header strip — compact */}
      <header className="mb-4 pb-3 border-b border-rule-strong">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-display text-[24px] md:text-[32px] tracking-tight leading-[1.05] text-ink">
              {t("title")}
            </h1>
            <span className="text-[13px] text-muted-ink">
              · {input.location.city || input.location.postalCode}
            </span>
          </div>
          <p className="text-[12.5px] text-muted-ink">
            {t("subtitle")}
          </p>
        </div>
      </header>

      {/* Lede — one big number */}
      <ResultSummary result={result} />

      {/* 25-year cumulative */}
      <div className="mt-10 md:mt-12">
        <FinancialChart result={result} />
      </div>

      {/* Monthly + self-consumption */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <YieldChart result={result} totalConsumption={totalConsumption} />
        <SelfConsumptionChart result={result} />
      </div>

      {/* Economics table */}
      <section className="mt-10 md:mt-14 border-t border-rule-strong pt-8">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10">
          <div className="md:col-span-4">
            <h2 className="font-display text-[22px] md:text-[26px] tracking-tight text-ink">
              {tEcon("title")}
            </h2>
            <p className="mt-3 text-[13px] text-muted-ink leading-relaxed max-w-[40ch]">
              {tEcon("investmentNote", {
                costPerKwp: INVESTMENT_COSTS.perKWp.default.toLocaleString(locale),
              })}
            </p>
          </div>
          <div className="md:col-span-8">
            <dl className="border-t border-ink">
              <TableRow
                label={tEcon("investment")}
                value={`~ ${result.economics.totalInvestment.toLocaleString(locale)} €`}
                hint={`Spanne: ${investMin.toLocaleString(locale)} – ${investMax.toLocaleString(locale)} €`}
              />
              <TableRow
                label={tEcon("npv")}
                value={`${result.economics.npv >= 0 ? "+" : ""}${result.economics.npv.toLocaleString(locale)} €`}
                emphasis={result.economics.npv >= 0 ? "positive" : "negative"}
              />
              <TableRow
                label={tEcon("roi")}
                value={`${result.economics.roi}%`}
                emphasis="positive"
              />
              <TableRow
                label={tEcon("totalSavings")}
                value={`${result.economics.totalSavings25Years.toLocaleString(locale)} €`}
              />
              <TableRow
                label={t("summary.payback")}
                value={`${result.economics.paybackYears} ${t("summary.years")}`}
              />
            </dl>
          </div>
        </div>
      </section>

      {/* CO2 + Inputs echo */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <CO2Card co2={result.co2} />

        <section className="border border-rule p-6 md:p-7 bg-paper">
          <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-rule">
            <h3 className="font-display text-[18px] md:text-[20px] tracking-tight text-ink">
              Deine Eingaben
            </h3>
            <Link
              href="/konfigurator"
              className="text-[12px] text-muted-ink hover:text-ink"
            >
              ändern →
            </Link>
          </div>
          <dl className="space-y-0">
            <InputRow
              label="Standort"
              value={`${input.location.city || input.location.postalCode}`}
              sub={`${input.location.lat.toFixed(3)}°N · ${input.location.lon.toFixed(3)}°E`}
            />
            <InputRow
              label="Dach"
              value={`${input.roof.area} m² · ${input.roof.tilt}°`}
              sub={`Azimut ${input.roof.azimuth >= 0 ? "+" : ""}${input.roof.azimuth}° · Verschattung ${shadingLabel[input.roof.shading] ?? input.roof.shading}`}
            />
            <InputRow
              label="Anlage"
              value={`${input.system.peakPower.toFixed(1)} kWp`}
              sub={`${input.system.moduleCount} × ${input.system.modulePower} Wp · ${moduleLabel[input.system.moduleType] ?? input.system.moduleType}`}
            />
            <InputRow
              label="Verbrauch"
              value={`${totalConsumption.toLocaleString(locale)} kWh / a`}
              sub={[
                input.consumption.hasHeatPump ? "+ Wärmepumpe" : null,
                input.consumption.hasEV ? "+ E-Auto" : null,
              ]
                .filter(Boolean)
                .join(" · ") || "Haushalt"}
            />
            <InputRow
              label="Speicher"
              value={
                input.battery.hasBattery
                  ? `${input.battery.capacity} kWh`
                  : "—"
              }
              sub={input.battery.hasBattery ? "Batteriespeicher aktiv" : "Ohne Speicher"}
            />
          </dl>
        </section>
      </div>

      {/* Disclaimer */}
      <section className="mt-10 md:mt-12 border-t border-b border-rule py-5">
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3 small-caps text-[11px] text-muted-ink">
            Hinweis
          </div>
          <p className="md:col-span-9 text-[13px] text-muted-ink leading-relaxed">
            {t("disclaimer")}
          </p>
        </div>
      </section>

      {/* Actions */}
      <section className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
        <Link href="/konfigurator" className="btn-ghost">
          ← {t("newCalculation")}
        </Link>
        <ExportButton result={result} />
      </section>

      <p className="mt-6 font-mono-ui text-[10px] text-faint-ink tracking-wider text-right">
        OpenSolarCheck · PVGIS · HTW Berlin · Fraunhofer ISE · BDEW H0 · UBA
      </p>
    </div>
  );
}

function TableRow({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasis?: "positive" | "negative";
}) {
  const valueClass =
    emphasis === "positive"
      ? "text-ink"
      : emphasis === "negative"
        ? "text-solar"
        : "text-ink";
  return (
    <div className="flex items-baseline justify-between gap-6 py-3.5 border-b border-rule">
      <div>
        <div className="text-[13px] text-muted-ink">{label}</div>
        {hint && (
          <div className="font-mono-ui text-[10.5px] text-faint-ink mt-1">
            {hint}
          </div>
        )}
      </div>
      <div className={`font-num text-[22px] md:text-[24px] ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function InputRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule py-3 last:border-b-0">
      <div>
        <div className="small-caps text-[10.5px] text-muted-ink">{label}</div>
        {sub && (
          <div className="font-mono-ui text-[10.5px] text-faint-ink mt-0.5">
            {sub}
          </div>
        )}
      </div>
      <div className="font-mono-ui text-[13px] text-ink tabular text-right">
        {value}
      </div>
    </div>
  );
}

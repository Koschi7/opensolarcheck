"use client";

import { useTranslations, useLocale } from "next-intl";
import type { CalculationResult } from "@/lib/types";

interface Props {
  result: CalculationResult;
}

export function ResultSummary({ result }: Props) {
  const t = useTranslations("results.summary");
  const locale = useLocale();

  const payback = result.economics.paybackYears;
  const npv = result.economics.npv;
  const annualYield = result.yield.annualYield;
  const annualSavings = result.economics.annualSavings;
  const selfCons = Math.round(result.selfConsumption.selfConsumptionRatio * 100);
  const autarky = Math.round(result.selfConsumption.autarkyRate * 100);

  return (
    <section className="border-t border-b border-rule-strong py-5 md:py-7">
      <div className="grid md:grid-cols-12 gap-5 md:gap-10 items-end">
        <div className="md:col-span-7">
          <div className="text-[12px] text-muted-ink mb-1.5">
            Kapitalwert nach 25 Jahren
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className={`font-num text-[44px] md:text-[64px] leading-[0.95] tracking-tight ${npv >= 0 ? "text-ink" : "text-solar"}`}>
              {npv >= 0 ? "+" : ""}
              {npv.toLocaleString(locale)}
            </span>
            <span className="font-num text-[15px] text-muted-ink">€ NPV</span>
          </div>
          <p className="mt-2 text-[12px] text-muted-ink max-w-[60ch] leading-relaxed">
            Diskontrate 3 %, Strompreissteigerung 3 % p. a., Modul-Degradation 0,5 % p. a.
          </p>
        </div>

        <div className="md:col-span-5">
          <dl className="grid grid-cols-2 gap-y-5 gap-x-6 md:border-l border-rule-strong md:pl-8">
            <StatCell
              label={t("payback")}
              value={payback.toString()}
              unit={t("years")}
            />
            <StatCell
              label={t("annualSavings")}
              value={annualSavings.toLocaleString(locale)}
              unit="€ / a"
            />
            <StatCell
              label={t("annualYield")}
              value={annualYield.toLocaleString(locale)}
              unit="kWh / a"
            />
            <StatCell
              label={t("autarky")}
              value={autarky.toString()}
              unit={`% · ${selfCons}% EV`}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function StatCell({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <dt className="text-[11.5px] text-muted-ink mb-0.5">{label}</dt>
      <dd className="font-num text-[20px] md:text-[22px] text-ink leading-none">
        {value}
        <span className="font-mono-ui text-[11px] text-faint-ink ml-1.5">
          {unit}
        </span>
      </dd>
    </div>
  );
}

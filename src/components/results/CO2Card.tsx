"use client";

import { useTranslations, useLocale } from "next-intl";
import type { CO2Result } from "@/lib/types";

interface Props {
  co2: CO2Result;
}

export function CO2Card({ co2 }: Props) {
  const t = useTranslations("results.co2");
  const locale = useLocale();

  return (
    <section className="border border-rule p-5 md:p-6 bg-paper">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-rule">
        <h3 className="font-display text-[18px] md:text-[20px] tracking-tight text-ink">
          {t("title")}
        </h3>
        <span className="text-[11px] text-faint-ink">
          Quelle: UBA
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <div className="text-[11.5px] text-muted-ink mb-1">
            {t("annual")}
          </div>
          <div className="font-num text-[32px] md:text-[40px] text-ink leading-none">
            {co2.annualSavings_kg.toLocaleString(locale)}
          </div>
          <div className="text-[11px] text-faint-ink mt-1.5">
            kg CO₂ · pro Jahr
          </div>
        </div>
        <div>
          <div className="text-[11.5px] text-muted-ink mb-1">
            {t("lifetime")}
          </div>
          <div className="font-num text-[32px] md:text-[40px] text-solar leading-none">
            {co2.lifetimeSavings_tons}
          </div>
          <div className="text-[11px] text-faint-ink mt-1.5">
            t CO₂ · 25 Jahre
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-rule">
        <EquivRow label="≈ Flüge München–Berlin" value={co2.equivalentFlights.toString()} />
        <EquivRow label="≈ gepflanzte Bäume" value={co2.equivalentTrees.toString()} />
      </div>
    </section>
  );
}

function EquivRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between text-[12.5px] border-b border-rule/60 py-2 last:border-b-0">
      <span className="text-muted-ink">{label}</span>
      <span className="font-num text-ink tabular">{value}</span>
    </div>
  );
}

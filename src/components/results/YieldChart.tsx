"use client";

import { useTranslations, useLocale } from "next-intl";
import type { CalculationResult } from "@/lib/types";
import { getMonthlyConsumption } from "@/lib/data/loadProfiles";

function getMonthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i, 1).toLocaleString(locale, { month: "short" })
  );
}

interface Props {
  result: CalculationResult;
  totalConsumption: number;
}

export function YieldChart({ result, totalConsumption }: Props) {
  const t = useTranslations("results.charts");
  const locale = useLocale();
  const monthlyConsumption = getMonthlyConsumption(totalConsumption);
  const months = getMonthNames(locale);

  const data = months.map((month, i) => ({
    month,
    yieldKWh: result.yield.monthlyYield[i],
    consumptionKWh: Math.round(monthlyConsumption[i]),
  }));

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.yieldKWh, d.consumptionKWh))
  );

  const vb = { w: 720, h: 340 };
  const pad = { top: 30, right: 30, bottom: 60, left: 52 };
  const plotW = vb.w - pad.left - pad.right;
  const plotH = vb.h - pad.top - pad.bottom;

  const niceMax = niceStep(maxVal);
  const yTicks = [0, niceMax / 4, niceMax / 2, (niceMax * 3) / 4, niceMax].map(
    (v) => Math.round(v / 50) * 50
  );

  const slotW = plotW / data.length;
  const barW = Math.min(14, slotW * 0.35);
  const gap = 3;

  const totalYield = data.reduce((a, b) => a + b.yieldKWh, 0);
  const totalCons = data.reduce((a, b) => a + b.consumptionKWh, 0);

  return (
    <div className="border border-rule p-5 md:p-6 bg-paper">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-rule">
        <h3 className="font-display text-[17px] md:text-[19px] tracking-tight text-ink">
          {t("monthlyYield")}
        </h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-solar" />
            <span className="text-muted-ink">{t("yield")}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-ink" />
            <span className="text-muted-ink">{t("consumption")}</span>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
        aria-label={t("monthlyYield")}
      >
        {/* y grid */}
        {yTicks.map((v) => {
          const y = pad.top + plotH - (v / niceMax) * plotH;
          return (
            <g key={v}>
              <line
                x1={pad.left}
                x2={pad.left + plotW}
                y1={y}
                y2={y}
                stroke="var(--rule)"
                strokeWidth="0.75"
                strokeDasharray={v === 0 ? "0" : "2 3"}
              />
              <text
                x={pad.left - 8}
                y={y + 3}
                textAnchor="end"
                className="font-mono-ui"
                fontSize="10"
                fill="var(--faint-ink)"
              >
                {v}
              </text>
            </g>
          );
        })}
        <text
          x={pad.left - 8}
          y={pad.top - 10}
          textAnchor="end"
          className="font-mono-ui small-caps"
          fontSize="9"
          fill="var(--faint-ink)"
        >
          kWh
        </text>

        {/* bars */}
        {data.map((d, i) => {
          const x0 = pad.left + i * slotW + slotW / 2;
          const yieldH = (d.yieldKWh / niceMax) * plotH;
          const consH = (d.consumptionKWh / niceMax) * plotH;
          const x1 = x0 - barW - gap / 2;
          const x2 = x0 + gap / 2;
          return (
            <g key={d.month}>
              <rect
                x={x1}
                y={pad.top + plotH - yieldH}
                width={barW}
                height={yieldH}
                fill="var(--accent-solar)"
                fillOpacity="0.9"
              />
              <rect
                x={x2}
                y={pad.top + plotH - consH}
                width={barW}
                height={consH}
                fill="var(--ink)"
                fillOpacity="0.85"
              />
              <text
                x={x0}
                y={pad.top + plotH + 16}
                textAnchor="middle"
                className="font-mono-ui"
                fontSize="10"
                fill="var(--muted-ink)"
              >
                {d.month}
              </text>
            </g>
          );
        })}

        {/* totals */}
        <line
          x1={pad.left}
          x2={pad.left + plotW}
          y1={vb.h - 32}
          y2={vb.h - 32}
          stroke="var(--ink)"
          strokeWidth="0.75"
        />
        <text
          x={pad.left}
          y={vb.h - 14}
          className="font-mono-ui"
          fontSize="10"
          fill="var(--faint-ink)"
        >
          {t("sumYield")} {totalYield.toLocaleString(locale)} kWh
        </text>
        <text
          x={pad.left + plotW}
          y={vb.h - 14}
          textAnchor="end"
          className="font-mono-ui"
          fontSize="10"
          fill="var(--faint-ink)"
        >
          {t("sumConsumption")} {totalCons.toLocaleString(locale)} kWh
        </text>
      </svg>
    </div>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 100;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const f = raw / base;
  let nf: number;
  if (f < 1.5) nf = 1.5;
  else if (f < 2.5) nf = 2.5;
  else if (f < 5) nf = 5;
  else nf = 10;
  return nf * base;
}

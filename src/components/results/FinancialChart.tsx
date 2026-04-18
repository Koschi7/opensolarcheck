"use client";

import { useTranslations, useLocale } from "next-intl";
import type { CalculationResult } from "@/lib/types";

interface Props {
  result: CalculationResult;
}

export function FinancialChart({ result }: Props) {
  const t = useTranslations("results.charts");
  const locale = useLocale();

  const data = [
    { year: 0, value: -result.economics.totalInvestment },
    ...result.economics.yearlyData.map((d) => ({
      year: d.year,
      value: d.cumulativeSavings,
    })),
  ];

  const vb = { w: 960, h: 420 };
  const pad = { top: 40, right: 56, bottom: 50, left: 72 };
  const plotW = vb.w - pad.left - pad.right;
  const plotH = vb.h - pad.top - pad.bottom;

  const years = data.map((d) => d.year);
  const values = data.map((d) => d.value);
  const xMin = Math.min(...years);
  const xMax = Math.max(...years);
  const yMin = Math.min(...values, 0);
  const yMax = Math.max(...values, 0);

  const xScale = (y: number) => pad.left + ((y - xMin) / (xMax - xMin)) * plotW;
  const yScale = (v: number) =>
    pad.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.year)} ${yScale(d.value)}`)
    .join(" ");

  const zeroY = yScale(0);

  // y ticks
  const yStep = niceStep((yMax - yMin) / 5);
  const yTicks: number[] = [];
  for (let v = Math.ceil(yMin / yStep) * yStep; v <= yMax; v += yStep) {
    yTicks.push(v);
  }

  const xTicks = [0, 5, 10, 15, 20, 25];
  const payback = result.economics.paybackYears;
  const finalValue = data[data.length - 1].value;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-rule">
        <h2 className="font-display text-[20px] md:text-[24px] tracking-tight text-ink">
          {t("financial")}
        </h2>
        <div className="text-right flex items-baseline gap-2">
          <span className="text-[12px] text-muted-ink">
            {t("breakEven")}
          </span>
          <span className="font-num text-[18px] text-ink">
            {payback}
            <span className="font-mono-ui text-[11px] text-faint-ink ml-1">{t("yearsAxis")}</span>
          </span>
        </div>
      </div>

      <div className="border border-rule p-4 md:p-6 bg-paper">
        <svg
          viewBox={`0 0 ${vb.w} ${vb.h}`}
          className="w-full h-auto block"
          role="img"
          aria-label={t("financial")}
        >
          {/* y grid */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={pad.left}
                x2={pad.left + plotW}
                y1={yScale(v)}
                y2={yScale(v)}
                stroke="var(--rule)"
                strokeWidth="0.75"
                strokeDasharray={v === 0 ? "0" : "2 3"}
              />
              <text
                x={pad.left - 10}
                y={yScale(v) + 3}
                textAnchor="end"
                className="font-mono-ui"
                fontSize="11"
                fill="var(--faint-ink)"
              >
                {v === 0 ? "0" : `${(v / 1000).toFixed(0)}k €`}
              </text>
            </g>
          ))}

          {/* zero line */}
          <line
            x1={pad.left}
            x2={pad.left + plotW}
            y1={zeroY}
            y2={zeroY}
            stroke="var(--ink)"
            strokeWidth="1"
          />

          {/* x ticks */}
          {xTicks.map((yr) => (
            <g key={yr}>
              <line
                x1={xScale(yr)}
                x2={xScale(yr)}
                y1={pad.top + plotH}
                y2={pad.top + plotH + 5}
                stroke="var(--ink)"
                strokeWidth="0.75"
              />
              <text
                x={xScale(yr)}
                y={pad.top + plotH + 20}
                textAnchor="middle"
                className="font-mono-ui"
                fontSize="11"
                fill="var(--muted-ink)"
              >
                {yr}
              </text>
            </g>
          ))}
          <text
            x={pad.left + plotW / 2}
            y={vb.h - 6}
            textAnchor="middle"
            className="font-mono-ui small-caps"
            fontSize="10"
            fill="var(--faint-ink)"
            letterSpacing="0.08em"
          >
            {t("yearsAxis")}
          </text>

          {/* break-even vertical */}
          {payback > 0 && payback < 26 && (
            <>
              <line
                x1={xScale(payback)}
                x2={xScale(payback)}
                y1={pad.top}
                y2={pad.top + plotH}
                stroke="var(--accent-solar)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={xScale(payback)}
                cy={zeroY}
                r="4"
                fill="var(--accent-solar)"
              />
              <text
                x={xScale(payback) + 8}
                y={pad.top + 18}
                className="font-mono-ui"
                fontSize="11"
                fill="var(--accent-solar)"
                fontWeight="500"
              >
                ▾ Break-even · Jahr {payback}
              </text>
            </>
          )}

          {/* line */}
          <path
            d={path}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* end annotation */}
          <circle
            cx={xScale(xMax)}
            cy={yScale(finalValue)}
            r="4"
            fill="var(--ink)"
          />
          <text
            x={xScale(xMax) - 6}
            y={yScale(finalValue) - 10}
            textAnchor="end"
            className="font-mono-ui"
            fontSize="12"
            fill="var(--ink)"
            fontWeight="500"
          >
            {finalValue >= 0 ? "+" : ""}
            {finalValue.toLocaleString(locale)} €
          </text>
        </svg>

        <div className="mt-5 pt-4 border-t border-rule flex items-baseline justify-between font-mono-ui text-[10.5px] text-faint-ink">
          <span>
            Modell: Investition → jährl. Einsparung + Einspeisung − Wartung, diskontiert.
          </span>
          <span>
            t₀ = −{result.economics.totalInvestment.toLocaleString(locale)} €
          </span>
        </div>
      </div>
    </section>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1000;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const f = raw / base;
  let nf: number;
  if (f < 1.5) nf = 1;
  else if (f < 3) nf = 2;
  else if (f < 7) nf = 5;
  else nf = 10;
  return nf * base;
}

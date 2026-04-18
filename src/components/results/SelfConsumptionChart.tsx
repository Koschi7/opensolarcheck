"use client";

import { useTranslations, useLocale } from "next-intl";
import type { CalculationResult } from "@/lib/types";

interface Props {
  result: CalculationResult;
}

export function SelfConsumptionChart({ result }: Props) {
  const t = useTranslations("results.charts");
  const locale = useLocale();

  const selfKWh = result.selfConsumption.selfConsumptionKWh;
  const feedKWh = result.selfConsumption.feedInKWh;
  const gridKWh = result.selfConsumption.gridConsumptionKWh;

  const totalPV = selfKWh + feedKWh;
  const totalLoad = selfKWh + gridKWh;

  const selfRatio = Math.round((selfKWh / Math.max(totalPV, 1)) * 100);
  const autarky = Math.round((selfKWh / Math.max(totalLoad, 1)) * 100);

  return (
    <div className="border border-rule p-5 md:p-6 bg-paper">
      <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-rule">
        <h3 className="font-display text-[17px] md:text-[19px] tracking-tight text-ink">
          {t("selfConsumption")}
        </h3>
      </div>

      {/* PV YIELD flow */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="small-caps text-[10.5px] text-muted-ink">
            {t("pvYieldLabel")} · {totalPV.toLocaleString(locale)} kWh
          </span>
          <span className="font-mono-ui text-[11px] text-ink tabular">
            {selfRatio}% EV
          </span>
        </div>
        <FlowBar
          segments={[
            {
              label: t("selfConsumptionLabel"),
              value: selfKWh,
              fill: "var(--accent-solar)",
            },
            {
              label: t("feedIn"),
              value: feedKWh,
              fill: "var(--data-grid)",
              pattern: true,
            },
          ]}
          total={totalPV}
        />
      </div>

      {/* LOAD flow */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="small-caps text-[10.5px] text-muted-ink">
            {t("consumptionLabel")} · {totalLoad.toLocaleString(locale)} kWh
          </span>
          <span className="font-mono-ui text-[11px] text-ink tabular">
            {autarky}% Autarkie
          </span>
        </div>
        <FlowBar
          segments={[
            {
              label: t("selfSupply"),
              value: selfKWh,
              fill: "var(--accent-solar)",
            },
            {
              label: t("gridConsumption"),
              value: gridKWh,
              fill: "var(--ink)",
            },
          ]}
          total={totalLoad}
        />
      </div>

      <div className="mt-5 pt-4 border-t border-rule font-mono-ui text-[10.5px] text-faint-ink">
        Eigenverbrauchsquote (HTW Berlin / Quaschning) · BDEW H0-Lastprofil
      </div>
    </div>
  );
}

interface Segment {
  label: string;
  value: number;
  fill: string;
  pattern?: boolean;
}

function FlowBar({ segments, total }: { segments: Segment[]; total: number }) {
  const locale = useLocale();
  let offset = 0;
  const vb = { w: 600, h: 72 };

  return (
    <div>
      <svg viewBox={`0 0 ${vb.w} ${vb.h}`} className="w-full h-auto block">
        <defs>
          <pattern
            id={`hatch-${segments[0].label}`}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="var(--accent-solar)"
              strokeWidth="2"
              opacity="0.6"
            />
          </pattern>
        </defs>

        {segments.map((seg) => {
          const w = (vb.w * seg.value) / Math.max(total, 1);
          const x = (vb.w * offset) / Math.max(total, 1);
          offset += seg.value;
          return (
            <g key={seg.label}>
              <rect
                x={x}
                y={0}
                width={w}
                height={36}
                fill={seg.pattern ? `url(#hatch-${segments[0].label})` : seg.fill}
                stroke={seg.pattern ? "var(--accent-solar)" : "none"}
                strokeWidth={seg.pattern ? 1 : 0}
              />
              {w > 80 && (
                <text
                  x={x + 8}
                  y={22}
                  className="font-mono-ui"
                  fontSize="11"
                  fill={seg.pattern ? "var(--ink)" : "var(--paper)"}
                  fontWeight="500"
                >
                  {seg.label}
                </text>
              )}
              <line
                x1={x}
                x2={x}
                y1={36}
                y2={44}
                stroke="var(--faint-ink)"
                strokeWidth="0.75"
              />
              <text
                x={x + 4}
                y={58}
                className="font-mono-ui"
                fontSize="10"
                fill="var(--muted-ink)"
              >
                {seg.label.toUpperCase()}
              </text>
              <text
                x={x + 4}
                y={69}
                className="font-mono-ui"
                fontSize="10"
                fill="var(--ink)"
              >
                {seg.value.toLocaleString(locale)} kWh
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

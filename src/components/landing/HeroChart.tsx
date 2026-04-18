"use client";

import { useTranslations } from "next-intl";

const YEARS = 25;

function buildCurve() {
  const investment = 20000;
  const annualBase = 1750;
  const priceGrowth = 1.03;
  const discount = 1.03;
  const values: number[] = [];
  let cum = -investment;
  values.push(cum);
  for (let y = 1; y <= YEARS; y++) {
    const saving = annualBase * Math.pow(priceGrowth, y - 1);
    const discounted = saving / Math.pow(discount, y);
    cum += discounted;
    values.push(cum);
  }
  return values;
}

export function HeroChart() {
  const t = useTranslations("landing.heroChart");

  const vb = { w: 640, h: 360 };
  const padding = { top: 36, right: 36, bottom: 48, left: 56 };
  const plotW = vb.w - padding.left - padding.right;
  const plotH = vb.h - padding.top - padding.bottom;

  const values = buildCurve();
  const yMin = Math.min(...values);
  const yMax = Math.max(...values);
  const yRange = yMax - yMin;

  const xFor = (year: number) => padding.left + (plotW * year) / YEARS;
  const yFor = (val: number) =>
    padding.top + plotH - ((val - yMin) / yRange) * plotH;

  const zeroY = yFor(0);

  const breakEvenYear =
    values.findIndex((v, i) => i > 0 && v >= 0) ?? YEARS;
  const breakEvenX = (() => {
    if (breakEvenYear <= 0) return xFor(0);
    const prev = values[breakEvenYear - 1];
    const next = values[breakEvenYear];
    const t = prev === next ? 0 : -prev / (next - prev);
    return xFor(breakEvenYear - 1 + t);
  })();

  const pathD = values
    .map((v, i) => {
      const cmd = i === 0 ? "M" : "L";
      return `${cmd}${xFor(i).toFixed(2)} ${yFor(v).toFixed(2)}`;
    })
    .join(" ");

  const areaD =
    pathD +
    ` L${xFor(YEARS).toFixed(2)} ${zeroY.toFixed(2)}` +
    ` L${xFor(0).toFixed(2)} ${zeroY.toFixed(2)} Z`;

  const xTicks = [0, 5, 10, 15, 20, 25];
  const yTicks = (() => {
    const step = 10000;
    const ticks: number[] = [];
    const start = Math.ceil(yMin / step) * step;
    for (let v = start; v <= yMax; v += step) ticks.push(v);
    return ticks;
  })();

  const finalVal = values[YEARS];

  return (
    <figure className="w-full" aria-label={t("subLabel")}>
      <figcaption className="flex items-baseline justify-between gap-4 mb-4">
        <div>
          <div className="small-caps text-[11px] text-faint-ink">
            {t("label")} / {t("subLabel")}
          </div>
          <div className="font-mono-ui text-[11px] text-muted-ink mt-1">
            {t("scenario")}
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="small-caps text-[11px] text-faint-ink">
            {t("finalLabel")}
          </div>
          <div className="font-display text-[20px] text-ink tabular">
            +{Math.round(finalVal / 1000)}.{String(Math.round(Math.abs(finalVal) % 1000)).padStart(3, "0").slice(0,3)}&nbsp;€
          </div>
        </div>
      </figcaption>

      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
      >
        <defs>
          <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-solar)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--accent-solar)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="heroClipPositive">
            <rect
              x={padding.left}
              y={padding.top}
              width={plotW}
              height={zeroY - padding.top}
            />
          </clipPath>
        </defs>

        {/* horizontal grid */}
        {yTicks.map((v) => (
          <g key={`yg-${v}`}>
            <line
              x1={padding.left}
              x2={padding.left + plotW}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke="var(--rule)"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={yFor(v) + 3}
              textAnchor="end"
              className="font-mono-ui"
              fontSize="10"
              fill="var(--faint-ink)"
            >
              {v >= 0 ? "+" : "−"}
              {Math.abs(v / 1000)}k&nbsp;€
            </text>
          </g>
        ))}

        {/* zero baseline */}
        <line
          x1={padding.left}
          x2={padding.left + plotW}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--rule-strong)"
          strokeWidth="1"
        />

        {/* x ticks */}
        {xTicks.map((t) => (
          <g key={`xg-${t}`}>
            <line
              x1={xFor(t)}
              x2={xFor(t)}
              y1={padding.top + plotH}
              y2={padding.top + plotH + 4}
              stroke="var(--rule-strong)"
              strokeWidth="1"
            />
            <text
              x={xFor(t)}
              y={padding.top + plotH + 18}
              textAnchor="middle"
              className="font-mono-ui"
              fontSize="10"
              fill="var(--faint-ink)"
            >
              {t === 0 ? "Jahr 0" : `${t}`}
            </text>
          </g>
        ))}

        {/* filled area above zero only */}
        <path d={areaD} fill="url(#heroFill)" clipPath="url(#heroClipPositive)" />

        {/* negative segment (below zero) in muted ink */}
        <path
          d={pathD}
          stroke="var(--muted-ink)"
          strokeWidth="1.25"
          strokeDasharray="3 3"
          fill="none"
          strokeDashoffset="0"
        />
        {/* positive segment on top */}
        <path
          d={pathD}
          stroke="var(--accent-solar)"
          strokeWidth="1.75"
          fill="none"
          clipPath="url(#heroClipPositive)"
          style={{
            strokeDasharray: 1600,
            strokeDashoffset: 1600,
            animation: "hero-draw 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) 0.15s forwards",
          }}
        />

        {/* break-even annotation */}
        <g>
          <line
            x1={breakEvenX}
            x2={breakEvenX}
            y1={zeroY - 120}
            y2={zeroY}
            stroke="var(--ink)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.5"
          />
          <circle cx={breakEvenX} cy={zeroY} r="3.5" fill="var(--ink)" />
          <text
            x={breakEvenX + 10}
            y={zeroY - 126}
            className="font-mono-ui"
            fontSize="10.5"
            fill="var(--ink)"
          >
            {t("breakEven")}
          </text>
        </g>

        {/* final marker */}
        <circle
          cx={xFor(YEARS)}
          cy={yFor(finalVal)}
          r="3.5"
          fill="var(--accent-solar)"
        />
      </svg>

      <div className="mt-3 font-mono-ui text-[10.5px] text-faint-ink tracking-wide">
        {t("source")}
      </div>

      <style jsx>{`
        @keyframes hero-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </figure>
  );
}

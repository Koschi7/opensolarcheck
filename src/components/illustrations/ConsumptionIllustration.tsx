"use client";

interface Props {
  hasHeatPump: boolean;
  hasEV: boolean;
  base?: number;
  heatPump?: number;
  ev?: number;
}

export function ConsumptionIllustration({
  hasHeatPump,
  hasEV,
  base = 3500,
  heatPump = 4000,
  ev = 2500,
}: Props) {
  const vb = { w: 360, h: 300 };
  const padX = 40;
  const plotH = 140;
  const plotY = 70;
  const plotW = vb.w - padX * 2;

  const segments = [
    { key: "base", label: "Haushalt", value: base, color: "var(--ink)" },
    ...(hasHeatPump
      ? [
          {
            key: "heatPump",
            label: "Wärmepumpe",
            value: heatPump,
            color: "var(--accent-solar)",
          },
        ]
      : []),
    ...(hasEV
      ? [
          {
            key: "ev",
            label: "E-Auto",
            value: ev,
            color: "var(--data-grid-consumption)",
          },
        ]
      : []),
  ];

  const total = segments.reduce((acc, s) => acc + s.value, 0);

  // stacked horizontal bar
  let offset = 0;
  const barY = plotY + 20;
  const barH = 40;

  // ticks: 0, 2500, 5000, 7500, 10000
  const ticks = [0, 2500, 5000, 7500, 10000];
  const maxTick = 10000;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Consumption breakdown"
      >
        {/* scale ticks */}
        {ticks.map((t) => {
          const x = padX + (plotW * t) / maxTick;
          return (
            <g key={t}>
              <line
                x1={x}
                x2={x}
                y1={barY - 6}
                y2={barY + barH + 6}
                stroke="var(--rule)"
                strokeWidth="0.75"
                strokeDasharray={t === 0 ? "0" : "2 3"}
              />
              <text
                x={x}
                y={barY - 10}
                textAnchor="middle"
                className="font-mono-ui"
                fontSize="9"
                fill="var(--faint-ink)"
              >
                {(t / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* stacked bar */}
        {segments.map((seg) => {
          const w = (plotW * seg.value) / maxTick;
          const x = padX + (plotW * offset) / maxTick;
          offset += seg.value;
          return (
            <g key={seg.key}>
              <rect
                x={x}
                y={barY}
                width={w}
                height={barH}
                fill={seg.color}
                fillOpacity={seg.key === "base" ? 1 : 0.9}
              />
              {w > 40 && (
                <text
                  x={x + w / 2}
                  y={barY + barH / 2 + 4}
                  textAnchor="middle"
                  className="font-mono-ui"
                  fontSize="10"
                  fill="var(--paper)"
                  fontWeight="500"
                >
                  {Math.round(seg.value / 100) / 10}k
                </text>
              )}
            </g>
          );
        })}

        {/* legend */}
        {segments.map((seg, i) => (
          <g key={`lg-${seg.key}`} transform={`translate(${padX}, ${180 + i * 22})`}>
            <rect width="10" height="10" fill={seg.color} />
            <text
              x="16"
              y="9"
              className="font-mono-ui"
              fontSize="11"
              fill="var(--ink)"
            >
              {seg.label}
            </text>
            <text
              x={vb.w - padX * 2}
              y="9"
              textAnchor="end"
              className="font-mono-ui"
              fontSize="11"
              fill="var(--muted-ink)"
            >
              {seg.value.toLocaleString("de-DE")} kWh
            </text>
          </g>
        ))}

        {/* total */}
        <line
          x1={padX}
          x2={vb.w - padX}
          y1={vb.h - 40}
          y2={vb.h - 40}
          stroke="var(--ink)"
          strokeWidth="1"
        />
        <text
          x={padX}
          y={vb.h - 18}
          fontSize="11"
          fill="var(--muted-ink)"
        >
          Gesamt
        </text>
        <text
          x={vb.w - padX}
          y={vb.h - 18}
          textAnchor="end"
          className="font-num"
          fontSize="16"
          fill="var(--ink)"
          fontWeight="500"
        >
          {total.toLocaleString("de-DE")} kWh / a
        </text>
      </svg>
    </div>
  );
}

"use client";

interface Props {
  hasBattery: boolean;
  capacity: number;
  chargeLevel: number; // 0-1
}

export function BatteryIllustration({
  hasBattery,
  capacity,
  chargeLevel,
}: Props) {
  const vb = { w: 360, h: 300 };

  const maxCap = 20;
  const fillPct = hasBattery ? capacity / maxCap : 0;

  // horizontal capacity bar
  const barX = 40;
  const barW = vb.w - 80;
  const barY = 100;
  const barH = 54;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Battery schematic"
      >
        {/* ticks */}
        {[0, 5, 10, 15, 20].map((k) => {
          const x = barX + (barW * k) / maxCap;
          return (
            <g key={k}>
              <line
                x1={x}
                x2={x}
                y1={barY - 8}
                y2={barY + barH + 8}
                stroke="var(--rule)"
                strokeWidth="0.75"
              />
              <text
                x={x}
                y={barY - 12}
                textAnchor="middle"
                className="font-mono-ui"
                fontSize="9"
                fill="var(--faint-ink)"
              >
                {k}
              </text>
            </g>
          );
        })}
        <text
          x={barX + barW}
          y={barY + barH + 22}
          textAnchor="end"
          className="font-mono-ui"
          fontSize="9"
          fill="var(--faint-ink)"
        >
          kWh
        </text>

        {/* empty bar frame */}
        <rect
          x={barX}
          y={barY}
          width={barW}
          height={barH}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1"
        />

        {/* filled capacity */}
        {hasBattery && (
          <rect
            x={barX}
            y={barY}
            width={barW * fillPct}
            height={barH}
            fill="var(--accent-solar)"
            fillOpacity="0.9"
          >
            <animate
              attributeName="width"
              from="0"
              to={barW * fillPct}
              dur="0.4s"
              fill="freeze"
            />
          </rect>
        )}

        {/* capacity value inside bar */}
        <text
          x={barX + 12}
          y={barY + barH / 2 + 5}
          className="font-mono-ui"
          fontSize="22"
          fill={hasBattery ? "var(--paper)" : "var(--faint-ink)"}
          fontWeight="500"
        >
          {hasBattery ? capacity.toFixed(1) : "—"}
        </text>

        {/* charge level readout */}
        {hasBattery && (
          <>
            <text
              x={barX}
              y={210}
              fontSize="11"
              fill="var(--muted-ink)"
            >
              Ladezustand
            </text>
            <rect
              x={barX}
              y={220}
              width={barW}
              height={12}
              fill="none"
              stroke="var(--rule-strong)"
              strokeWidth="1"
            />
            <rect
              x={barX}
              y={220}
              width={barW * chargeLevel}
              height={12}
              fill="var(--ink)"
            >
              <animate
                attributeName="width"
                from="0"
                to={barW * chargeLevel}
                dur="0.6s"
                fill="freeze"
              />
            </rect>
            <text
              x={barX + barW}
              y={248}
              textAnchor="end"
              className="font-mono-ui"
              fontSize="11"
              fill="var(--ink)"
            >
              {Math.round(chargeLevel * 100)}&thinsp;%
            </text>
          </>
        )}

        {/* status line */}
        <line
          x1={barX}
          x2={vb.w - barX}
          y1={vb.h - 40}
          y2={vb.h - 40}
          stroke="var(--rule)"
          strokeWidth="1"
        />
        <text
          x={vb.w - barX}
          y={vb.h - 18}
          textAnchor="end"
          fontSize="13"
          fill={hasBattery ? "var(--accent-solar)" : "var(--faint-ink)"}
          fontWeight="500"
        >
          {hasBattery ? "Speicher aktiv" : "Kein Speicher"}
        </text>
      </svg>
    </div>
  );
}

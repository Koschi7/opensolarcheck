"use client";

interface Props {
  moduleCount: number;
  peakPower?: number;
}

export function SystemIllustration({ moduleCount, peakPower }: Props) {
  const vb = { w: 360, h: 300 };
  const displayCount = Math.min(moduleCount, 32);
  const cols = Math.min(8, Math.ceil(Math.sqrt(displayCount * 1.4)));
  const rows = Math.ceil(displayCount / cols);

  const panelW = 32;
  const panelH = 22;
  const gap = 3;
  const gridW = cols * panelW + (cols - 1) * gap;
  const gridH = rows * panelH + (rows - 1) * gap;
  const startX = (vb.w - gridW) / 2;
  const startY = 70;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
        aria-label="PV module array schematic"
      >
        {/* dimension marks */}
        <line
          x1={startX}
          x2={startX + gridW}
          y1={startY - 14}
          y2={startY - 14}
          stroke="var(--rule-strong)"
          strokeWidth="0.75"
        />
        <line
          x1={startX}
          x2={startX}
          y1={startY - 18}
          y2={startY - 10}
          stroke="var(--rule-strong)"
          strokeWidth="0.75"
        />
        <line
          x1={startX + gridW}
          x2={startX + gridW}
          y1={startY - 18}
          y2={startY - 10}
          stroke="var(--rule-strong)"
          strokeWidth="0.75"
        />
        <text
          x={startX + gridW / 2}
          y={startY - 20}
          textAnchor="middle"
          className="font-mono-ui"
          fontSize="9"
          fill="var(--faint-ink)"
        >
          {cols} × {rows}
        </text>

        {/* panels */}
        {Array.from({ length: displayCount }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * (panelW + gap);
          const y = startY + row * (panelH + gap);
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={panelW}
                height={panelH}
                fill="var(--accent-solar)"
                fillOpacity="0.9"
                stroke="var(--ink)"
                strokeWidth="0.6"
              >
                <animate
                  attributeName="fill-opacity"
                  values="0;0.9"
                  dur="0.2s"
                  begin={`${i * 0.025}s`}
                  fill="freeze"
                />
              </rect>
              <line
                x1={x + panelW / 3}
                y1={y}
                x2={x + panelW / 3}
                y2={y + panelH}
                stroke="var(--paper)"
                strokeWidth="0.4"
                opacity="0.6"
              />
              <line
                x1={x + (panelW * 2) / 3}
                y1={y}
                x2={x + (panelW * 2) / 3}
                y2={y + panelH}
                stroke="var(--paper)"
                strokeWidth="0.4"
                opacity="0.6"
              />
              <line
                x1={x}
                y1={y + panelH / 2}
                x2={x + panelW}
                y2={y + panelH / 2}
                stroke="var(--paper)"
                strokeWidth="0.4"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* readout */}
        <line
          x1="30"
          x2={vb.w - 30}
          y1={vb.h - 60}
          y2={vb.h - 60}
          stroke="var(--rule)"
          strokeWidth="1"
        />
        <text
          x="30"
          y={vb.h - 38}
          fontSize="11"
          fill="var(--muted-ink)"
        >
          Module
        </text>
        <text
          x="30"
          y={vb.h - 14}
          className="font-num"
          fontSize="20"
          fill="var(--ink)"
          fontWeight="500"
        >
          {moduleCount}
        </text>
        {peakPower !== undefined && (
          <>
            <text
              x={vb.w - 30}
              y={vb.h - 38}
              textAnchor="end"
              fontSize="11"
              fill="var(--muted-ink)"
            >
              Spitzenleistung
            </text>
            <text
              x={vb.w - 30}
              y={vb.h - 14}
              textAnchor="end"
              className="font-num"
              fontSize="20"
              fill="var(--accent-solar)"
              fontWeight="500"
            >
              {peakPower.toFixed(1)} kWp
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

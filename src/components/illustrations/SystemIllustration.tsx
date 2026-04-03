"use client";

interface Props {
  moduleCount: number;
}

export function SystemIllustration({ moduleCount }: Props) {
  const displayCount = Math.min(moduleCount, 24);
  const cols = Math.min(6, Math.ceil(Math.sqrt(displayCount * 1.5)));

  const panelW = 36;
  const panelH = 22;
  const gap = 3;
  const startX = 150 - ((cols * (panelW + gap)) / 2);
  const startY = 60;

  return (
    <svg viewBox="0 0 300 250" className="w-full max-w-[300px]">
      <defs>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Roof background */}
      <rect x="30" y="45" width="240" height="160" rx="8" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1" />

      {/* Solar panels */}
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
              fill="url(#panelGrad)"
              rx="2"
              stroke="#3B82F6"
              strokeWidth="0.5"
            >
              <animate
                attributeName="opacity"
                values="0;1"
                dur="0.3s"
                begin={`${i * 0.05}s`}
                fill="freeze"
              />
            </rect>
            {/* Cell grid */}
            <line
              x1={x + panelW / 3}
              y1={y}
              x2={x + panelW / 3}
              y2={y + panelH}
              stroke="#3B82F6"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1={x + (2 * panelW) / 3}
              y1={y}
              x2={x + (2 * panelW) / 3}
              y2={y + panelH}
              stroke="#3B82F6"
              strokeWidth="0.3"
              opacity="0.5"
            />
            <line
              x1={x}
              y1={y + panelH / 2}
              x2={x + panelW}
              y2={y + panelH / 2}
              stroke="#3B82F6"
              strokeWidth="0.3"
              opacity="0.5"
            />
          </g>
        );
      })}

      {/* Counter */}
      <rect x="100" y="215" width="100" height="28" rx="14" fill="#1E40AF" />
      <text
        x="150"
        y="234"
        textAnchor="middle"
        fontSize="13"
        fontWeight="bold"
        fill="white"
      >
        {moduleCount} Module
      </text>
    </svg>
  );
}

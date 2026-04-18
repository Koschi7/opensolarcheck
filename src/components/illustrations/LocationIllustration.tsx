"use client";

import { useTranslations } from "next-intl";

interface Props {
  lat: number;
}

export function LocationIllustration({ lat }: Props) {
  const t = useTranslations("configurator.step1");

  const vb = { w: 360, h: 300 };
  const padX = 36;
  const plotW = vb.w - padX * 2;

  // Latitude in DE runs ~47.3 (Lindau) to ~55.0 (Sylt).
  // Irradiance (yearly, kWh/m²) in DE runs ~1200 (south) to ~950 (far north).
  const minLat = 47;
  const maxLat = 55.5;
  const norm = Math.max(0, Math.min(1, (lat - minLat) / (maxLat - minLat)));
  const irrad = Math.round(1200 - norm * 250);

  // axis positions
  const axisY = 210;
  const latX = padX + (1 - norm) * plotW * 0.9 + plotW * 0.05;

  const ticks = [47, 49, 51, 53, 55];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Location schematic"
      >
        {/* irradiance bar — south (high) to north (low) */}
        <defs>
          <linearGradient id="radGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-solar)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent-solar)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* header labels */}
        <text
          x={padX}
          y="44"
          className="font-mono-ui"
          fontSize="10"
          fill="var(--faint-ink)"
        >
          S · südlich
        </text>
        <text
          x={vb.w - padX}
          y="44"
          textAnchor="end"
          className="font-mono-ui"
          fontSize="10"
          fill="var(--faint-ink)"
        >
          N · nördlich
        </text>

        {/* radiation bar (left = higher, right = lower) */}
        <rect
          x={padX}
          y="60"
          width={plotW}
          height="36"
          fill="url(#radGrad)"
          stroke="var(--ink)"
          strokeWidth="1"
        />

        {/* irradiance ticks */}
        <text
          x={padX + 4}
          y="113"
          className="font-mono-ui"
          fontSize="10"
          fill="var(--ink)"
        >
          1200
        </text>
        <text
          x={vb.w - padX - 4}
          y="113"
          textAnchor="end"
          className="font-mono-ui"
          fontSize="10"
          fill="var(--ink)"
        >
          950
        </text>
        <text
          x={vb.w / 2}
          y="113"
          textAnchor="middle"
          className="font-mono-ui"
          fontSize="9"
          fill="var(--faint-ink)"
        >
          kWh / m² · Jahr
        </text>

        {/* latitude scale */}
        <line
          x1={padX}
          x2={vb.w - padX}
          y1={axisY}
          y2={axisY}
          stroke="var(--ink)"
          strokeWidth="1"
        />
        {ticks.map((lt) => {
          const n = (lt - minLat) / (maxLat - minLat);
          const x = padX + (1 - n) * plotW * 0.9 + plotW * 0.05;
          return (
            <g key={lt}>
              <line
                x1={x}
                x2={x}
                y1={axisY}
                y2={axisY + 5}
                stroke="var(--ink)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={axisY + 18}
                textAnchor="middle"
                className="font-mono-ui"
                fontSize="9"
                fill="var(--faint-ink)"
              >
                {lt}°
              </text>
            </g>
          );
        })}

        {/* current latitude marker */}
        <g>
          <line
            x1={latX}
            x2={latX}
            y1="96"
            y2={axisY - 3}
            stroke="var(--ink)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <polygon
            points={`${latX - 4},${axisY - 3} ${latX + 4},${axisY - 3} ${latX},${axisY + 3}`}
            fill="var(--ink)"
          />
          <text
            x={latX}
            y="88"
            textAnchor="middle"
            className="font-mono-ui"
            fontSize="11"
            fill="var(--ink)"
            fontWeight="500"
          >
            {lat.toFixed(2)}° N
          </text>
        </g>

        {/* footer dl */}
        <text
          x={padX}
          y="270"
          fontSize="11"
          fill="var(--muted-ink)"
        >
          Erwartete Einstrahlung
        </text>
        <text
          x={vb.w - padX}
          y="270"
          textAnchor="end"
          className="font-num"
          fontSize="14"
          fill="var(--ink)"
          fontWeight="500"
        >
          ≈ {irrad} kWh/m²·a
        </text>
      </svg>
      <p className="mt-3 text-[12px] text-muted-ink leading-relaxed">
        {t("lat")} &amp; {t("lon")} werden per PVGIS auf dein genaues Strahlungsprofil aufgelöst.
      </p>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";

interface Props {
  tilt: number;
  azimuth: number;
}

export function RoofIllustration({ tilt, azimuth }: Props) {
  const t = useTranslations("configurator.step2");

  const vb = { w: 360, h: 300 };
  const eaveY = 210;
  const houseLeft = 70;
  const houseRight = 290;
  const ridgeX = 180;
  const spanHalf = ridgeX - houseLeft;
  const tiltRad = (tilt * Math.PI) / 180;
  const roofHeight = Math.tan(tiltRad) * spanHalf;
  const ridgeY = eaveY - roofHeight;

  // annotation arc
  const arcR = 46;
  const arcEndX = houseLeft + arcR;
  const arcStartX = houseLeft + Math.cos(tiltRad) * arcR;
  const arcStartY = eaveY - Math.sin(tiltRad) * arcR;

  // panel rail along south-facing slope (right slope)
  const slopeLen = Math.sqrt(spanHalf * spanHalf + roofHeight * roofHeight);
  const slopeDx = (houseRight - ridgeX) / slopeLen;
  const slopeDy = (eaveY - ridgeY) / slopeLen;
  const slopeAngle = Math.atan2(eaveY - ridgeY, houseRight - ridgeX) * (180 / Math.PI);

  const panelCount = Math.max(2, Math.min(6, 4));
  const railStart = 0.12;
  const railEnd = 0.88;
  const railLen = slopeLen * (railEnd - railStart);
  const panelGap = 4;
  const panelW = (railLen - (panelCount - 1) * panelGap) / panelCount;
  const panelH = Math.max(6, Math.min(14, slopeLen * 0.09));

  const panels = Array.from({ length: panelCount }, (_, i) => {
    const frac = railStart + (i * (panelW + panelGap)) / slopeLen + (panelW / 2) / slopeLen;
    return {
      cx: ridgeX + slopeDx * frac * slopeLen,
      cy: ridgeY + slopeDy * frac * slopeLen,
    };
  });

  let azimuthLabel = `${azimuth >= 0 ? "+" : ""}${azimuth}°`;
  if (azimuth === 0) azimuthLabel = `0° · ${t("south")}`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${vb.w} ${vb.h}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Roof cross-section schematic"
      >
        {/* paper grid (subtle) */}
        <defs>
          <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="var(--rule)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={vb.w} height={vb.h} fill="url(#gridPattern)" opacity="0.5" />

        {/* ground datum */}
        <line
          x1="20"
          x2={vb.w - 20}
          y1={eaveY + 44}
          y2={eaveY + 44}
          stroke="var(--ink)"
          strokeWidth="1"
        />
        <text
          x="26"
          y={eaveY + 56}
          fontSize="10"
          fill="var(--faint-ink)"
        >
          Boden
        </text>

        {/* house walls */}
        <line x1={houseLeft} y1={eaveY} x2={houseLeft} y2={eaveY + 44} stroke="var(--ink)" strokeWidth="1" />
        <line x1={houseRight} y1={eaveY} x2={houseRight} y2={eaveY + 44} stroke="var(--ink)" strokeWidth="1" />
        <line x1={houseLeft} y1={eaveY} x2={houseRight} y2={eaveY} stroke="var(--rule-strong)" strokeWidth="0.75" strokeDasharray="2 3" />

        {/* roof lines */}
        <line x1={houseLeft} y1={eaveY} x2={ridgeX} y2={ridgeY} stroke="var(--ink)" strokeWidth="1.25" />
        <line x1={ridgeX} y1={ridgeY} x2={houseRight} y2={eaveY} stroke="var(--ink)" strokeWidth="1.25" />

        {/* ridge dot */}
        <circle cx={ridgeX} cy={ridgeY} r="2" fill="var(--ink)" />

        {/* tilt angle arc + label */}
        <path
          d={`M ${arcEndX} ${eaveY} A ${arcR} ${arcR} 0 0 0 ${arcStartX} ${arcStartY}`}
          fill="none"
          stroke="var(--accent-solar)"
          strokeWidth="1.25"
        />
        <text
          x={houseLeft + arcR + 8}
          y={eaveY - arcR * Math.sin(tiltRad) / 2 + 2}
          className="font-mono-ui"
          fontSize="11"
          fill="var(--accent-solar)"
          fontWeight="500"
        >
          {tilt}°
        </text>

        {/* eave line extension for tilt reference */}
        <line
          x1={houseLeft - 10}
          x2={houseLeft + arcR + 18}
          y1={eaveY}
          y2={eaveY}
          stroke="var(--rule-strong)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />

        {/* solar panels on right slope */}
        {panels.map((p, i) => (
          <g key={i} transform={`rotate(${slopeAngle}, ${p.cx}, ${p.cy})`}>
            <rect
              x={p.cx - panelW / 2}
              y={p.cy - panelH / 2}
              width={panelW}
              height={panelH}
              fill="var(--accent-solar)"
              fillOpacity="0.85"
              stroke="var(--ink)"
              strokeWidth="0.5"
            />
            <line
              x1={p.cx}
              y1={p.cy - panelH / 2}
              x2={p.cx}
              y2={p.cy + panelH / 2}
              stroke="var(--paper)"
              strokeWidth="0.5"
              opacity="0.7"
            />
          </g>
        ))}

        {/* sun indicator — position reflects azimuth (very schematic, just a hint) */}
        <g transform={`translate(${vb.w - 60 + azimuth * 0.2}, 40)`}>
          <circle cx="0" cy="0" r="14" fill="none" stroke="var(--accent-solar)" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="var(--accent-solar)" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={Math.cos(rad) * 7}
                y1={Math.sin(rad) * 7}
                x2={Math.cos(rad) * 11}
                y2={Math.sin(rad) * 11}
                stroke="var(--accent-solar)"
                strokeWidth="1"
              />
            );
          })}
        </g>

        {/* dimension callout */}
        <text
          x={vb.w - 20}
          y={eaveY + 56}
          textAnchor="end"
          fontSize="10"
          fill="var(--faint-ink)"
        >
          Azimut {azimuthLabel}
        </text>
      </svg>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
        <dt className="text-muted-ink">{t("tilt")}</dt>
        <dd className="font-num text-ink tabular text-right">{tilt}°</dd>
        <dt className="text-muted-ink">{t("azimuth")}</dt>
        <dd className="font-num text-ink tabular text-right">{azimuthLabel}</dd>
      </dl>
    </div>
  );
}

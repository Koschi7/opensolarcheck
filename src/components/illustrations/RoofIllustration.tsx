"use client";

import { useTranslations } from "next-intl";

interface Props {
  tilt: number;
  azimuth: number;
}

export function RoofIllustration({ tilt, azimuth }: Props) {
  const t = useTranslations("configurator.step2");

  // The tilt drives the visual change: steeper tilt = higher ridge
  // Range: tilt 0° → flat roof (roofHeight ~8), tilt 60° → steep (roofHeight ~80)
  const roofHeight = 8 + tilt * 1.2;

  // House dimensions
  const houseLeft = 70;
  const houseRight = 230;
  const houseWidth = houseRight - houseLeft;
  const houseMid = (houseLeft + houseRight) / 2;
  const eaveY = 150;
  const wallHeight = 70;

  // Roof points
  const ridgeX = houseMid;
  const ridgeY = eaveY - roofHeight;
  const overhangLeft = houseLeft - 15;
  const overhangRight = houseRight + 15;

  // Azimuth label
  let azimuthLabel = `${azimuth}°`;
  if (azimuth === 0) azimuthLabel = t("south");
  else if (azimuth === 90) azimuthLabel = t("west");
  else if (azimuth === -90) azimuthLabel = t("east");
  else if (Math.abs(azimuth) === 180) azimuthLabel = t("north");

  // Solar panels along the right slope (south-facing)
  const slopeDx = overhangRight - ridgeX;
  const slopeDy = eaveY - ridgeY;
  const slopeLen = Math.sqrt(slopeDx * slopeDx + slopeDy * slopeDy);
  const slopeAngle = Math.atan2(slopeDy, slopeDx) * (180 / Math.PI);

  const panelCount = 5;
  const panelGap = 3;
  const panelHeight = Math.min(16, slopeLen / (panelCount + 1) * 0.7);
  const totalPanelZone = slopeLen * 0.8;
  const panelWidth = (totalPanelZone - (panelCount - 1) * panelGap) / panelCount;

  const panels = Array.from({ length: panelCount }, (_, i) => {
    const startFraction = 0.1 + (i * (panelWidth + panelGap)) / slopeLen;
    const cx = ridgeX + slopeDx * (startFraction + panelWidth / (2 * slopeLen));
    const cy = ridgeY + slopeDy * (startFraction + panelWidth / (2 * slopeLen));
    return { cx, cy };
  });

  return (
    <svg viewBox="0 0 300 280" className="w-full max-w-[300px]">
      <defs>
        <linearGradient id="roofLeft" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6B7280" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="roofRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="wallGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="100%" stopColor="#D1D5DB" />
        </linearGradient>
      </defs>

      {/* Sky gradient hint */}
      <rect x="0" y="0" width="300" height={eaveY + wallHeight} fill="#EFF6FF" opacity="0.3" />

      {/* Sun - positioned based on azimuth for a hint of direction */}
      <circle cx={220 + azimuth * 0.3} cy="30" r="18" fill="#FCD34D">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Sun rays */}
      {[0, 15, 30].map((offset) => (
        <line
          key={offset}
          x1={220 + azimuth * 0.3 - offset * 0.4}
          y1="48"
          x2={ridgeX + 30 + offset}
          y2={ridgeY + 10 + offset * 0.3}
          stroke="#FCD34D"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.25"
        >
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur="2.5s" repeatCount="indefinite" />
        </line>
      ))}

      {/* House body */}
      <rect
        x={houseLeft}
        y={eaveY}
        width={houseWidth}
        height={wallHeight}
        fill="url(#wallGrad2)"
        stroke="#9CA3AF"
        strokeWidth="1"
      />

      {/* Door */}
      <rect x={houseMid - 13} y={eaveY + 25} width={26} height={45} rx="2" fill="#78716C" />
      <circle cx={houseMid + 7} cy={eaveY + 50} r="2" fill="#A8A29E" />

      {/* Windows */}
      <rect x={houseLeft + 15} y={eaveY + 15} width={25} height={22} rx="2" fill="#BFDBFE" stroke="#9CA3AF" strokeWidth="0.5" />
      <line x1={houseLeft + 27.5} y1={eaveY + 15} x2={houseLeft + 27.5} y2={eaveY + 37} stroke="#9CA3AF" strokeWidth="0.4" />
      <rect x={houseRight - 40} y={eaveY + 15} width={25} height={22} rx="2" fill="#BFDBFE" stroke="#9CA3AF" strokeWidth="0.5" />
      <line x1={houseRight - 27.5} y1={eaveY + 15} x2={houseRight - 27.5} y2={eaveY + 37} stroke="#9CA3AF" strokeWidth="0.4" />

      {/* Left roof slope (shade side) */}
      <polygon
        points={`${overhangLeft},${eaveY} ${ridgeX},${ridgeY} ${ridgeX},${eaveY}`}
        fill="url(#roofLeft)"
        stroke="#6B7280"
        strokeWidth="1"
      />

      {/* Right roof slope (panel side) */}
      <polygon
        points={`${ridgeX},${ridgeY} ${overhangRight},${eaveY} ${ridgeX},${eaveY}`}
        fill="url(#roofRight)"
        stroke="#B45309"
        strokeWidth="1.5"
      />

      {/* Solar panels */}
      {panels.map((p, i) => (
        <g key={i} transform={`rotate(${slopeAngle}, ${p.cx}, ${p.cy})`}>
          <rect
            x={p.cx - panelWidth / 2}
            y={p.cy - panelHeight / 2}
            width={panelWidth}
            height={panelHeight}
            fill="#1E3A5F"
            stroke="#60A5FA"
            strokeWidth="0.5"
            rx="1"
          />
          {/* Grid lines */}
          <line
            x1={p.cx}
            y1={p.cy - panelHeight / 2}
            x2={p.cx}
            y2={p.cy + panelHeight / 2}
            stroke="#60A5FA"
            strokeWidth="0.3"
          />
          <line
            x1={p.cx - panelWidth / 2}
            y1={p.cy}
            x2={p.cx + panelWidth / 2}
            y2={p.cy}
            stroke="#60A5FA"
            strokeWidth="0.3"
          />
        </g>
      ))}

      {/* Tilt angle annotation arc */}
      {tilt > 0 && (
        <g>
          <line
            x1={ridgeX}
            y1={eaveY}
            x2={overhangRight + 8}
            y2={eaveY}
            stroke="#9CA3AF"
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
          <path
            d={`M ${ridgeX + 35},${eaveY} A 35 35 0 0 0 ${ridgeX + 35 * Math.cos((tilt * Math.PI) / 180)},${eaveY - 35 * Math.sin((tilt * Math.PI) / 180)}`}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          <text
            x={ridgeX + 42}
            y={eaveY - 8}
            fontSize="10"
            fill="#D97706"
            fontWeight="bold"
          >
            {tilt}°
          </text>
        </g>
      )}

      {/* Ground */}
      <rect y={eaveY + wallHeight} width="300" height={280 - eaveY - wallHeight} fill="#86EFAC" opacity="0.3" />

      {/* Info label */}
      <text x="150" y="265" textAnchor="middle" fontSize="11" fill="#6B7280">
        {t("tilt")}: {tilt}° | {t("azimuth")}: {azimuthLabel}
      </text>
    </svg>
  );
}

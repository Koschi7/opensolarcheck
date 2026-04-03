"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

interface Props {
  azimuth: number;
  onChange: (azimuth: number) => void;
}

export function CompassRose({ azimuth, onChange }: Props) {
  const t = useTranslations("configurator.step2");
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;

      // Convert to azimuth (-180 to 180, 0 = South)
      // South is at bottom of compass (positive y direction)
      // atan2(x, y) gives angle from positive-y axis (= South)
      let angle = Math.atan2(x, y) * (180 / Math.PI);
      angle = Math.round(angle / 5) * 5; // Snap to 5°
      if (angle > 180) angle -= 360;
      if (angle < -180) angle += 360;

      onChange(angle);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let newAzimuth = azimuth;
      if (e.key === "ArrowLeft") newAzimuth -= 5;
      else if (e.key === "ArrowRight") newAzimuth += 5;
      else return;

      e.preventDefault();
      if (newAzimuth > 180) newAzimuth -= 360;
      if (newAzimuth < -180) newAzimuth += 360;
      onChange(newAzimuth);
    },
    [azimuth, onChange]
  );

  // Arrow points South (0°) + azimuth rotation
  const arrowAngle = azimuth;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className="w-48 h-48 cursor-crosshair"
      role="slider"
      aria-label={t("azimuth")}
      aria-valuemin={-180}
      aria-valuemax={180}
      aria-valuenow={azimuth}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="92" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="1" />
      <circle cx="100" cy="100" r="48" fill="none" stroke="#E5E7EB" strokeWidth="1" />

      {/* Tick marks */}
      {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const inner = deg % 90 === 0 ? 72 : deg % 30 === 0 ? 78 : 82;
        return (
          <line
            key={deg}
            x1={100 + inner * Math.sin(rad)}
            y1={100 - inner * Math.cos(rad)}
            x2={100 + 90 * Math.sin(rad)}
            y2={100 - 90 * Math.cos(rad)}
            stroke={deg % 90 === 0 ? "#374151" : "#D1D5DB"}
            strokeWidth={deg % 90 === 0 ? 2 : 1}
          />
        );
      })}

      {/* Cardinal labels */}
      {/* N = top (compass 0°, geographic North) */}
      <text x="100" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#374151" dominantBaseline="central">
        {t("north")}
      </text>
      {/* S = bottom (compass 180°, geographic South = azimuth 0°) */}
      <text x="100" y="184" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#F59E0B" dominantBaseline="central">
        {t("south")}
      </text>
      {/* E/O = right (compass 90°) */}
      <text x="184" y="102" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#374151" dominantBaseline="central">
        {t("east")}
      </text>
      {/* W = left (compass 270°) */}
      <text x="16" y="102" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#374151" dominantBaseline="central">
        {t("west")}
      </text>

      {/* Direction arrow - points South at azimuth 0° */}
      <g transform={`rotate(${arrowAngle}, 100, 100)`}>
        {/* Gold arrow pointing down (South = 0°) */}
        <polygon
          points="100,145 93,112 107,112"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="1"
        />
        {/* Grey arrow pointing up (North) */}
        <polygon
          points="100,55 93,88 107,88"
          fill="#D1D5DB"
          stroke="#9CA3AF"
          strokeWidth="1"
        />
        {/* Center circle */}
        <circle cx="100" cy="100" r="6" fill="white" stroke="#374151" strokeWidth="2" />
      </g>
    </svg>
  );
}

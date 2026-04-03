"use client";

interface Props {
  lat: number;
}

export function LocationIllustration({ lat }: Props) {
  // Sun height based on latitude (higher lat = lower sun)
  const sunY = 30 + (lat - 45) * 2;
  const radiationIntensity = Math.max(0.4, 1 - Math.abs(lat - 48) * 0.03);

  return (
    <svg viewBox="0 0 300 250" className="w-full max-w-[300px]">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop
            offset="0%"
            stopColor="#FCD34D"
            stopOpacity={radiationIntensity}
          />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="300" height="180" fill="url(#sky)" rx="16" />

      {/* Sun with rays */}
      <circle cx="200" cy={sunY} r="40" fill="url(#sunGlow)" />
      <circle cx="200" cy={sunY} r="18" fill="#F59E0B">
        <animate
          attributeName="r"
          values="18;20;18"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={200 + 24 * Math.cos((angle * Math.PI) / 180)}
          y1={sunY + 24 * Math.sin((angle * Math.PI) / 180)}
          x2={200 + 32 * Math.cos((angle * Math.PI) / 180)}
          y2={sunY + 32 * Math.sin((angle * Math.PI) / 180)}
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        >
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2s"
            begin={`${angle / 360}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* Germany outline (simplified) */}
      <path
        d="M100,50 L120,45 L130,55 L135,48 L145,52 L140,65 L148,72 L142,85 L150,95 L145,105 L135,110 L128,120 L115,125 L105,118 L95,122 L90,115 L85,105 L88,90 L80,80 L85,70 L90,60 Z"
        fill="none"
        stroke="#1E40AF"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Location pin */}
      <g transform={`translate(${110 + (lat - 48) * -2}, ${85 + (lat - 48) * -3})`}>
        <path
          d="M0,-15 C-8,-15 -12,-8 -12,-3 C-12,6 0,15 0,15 C0,15 12,6 12,-3 C12,-8 8,-15 0,-15Z"
          fill="#EF4444"
          stroke="white"
          strokeWidth="2"
        >
          <animate
            attributeName="transform"
            values="translate(0,0);translate(0,-3);translate(0,0)"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="0" cy="-4" r="4" fill="white" />
      </g>

      {/* Radiation bars */}
      <g opacity={radiationIntensity}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={30 + i * 14}
            y={160}
            width="10"
            height={20 + i * 12}
            fill={`hsl(${40 - i * 5}, 90%, ${55 + i * 3}%)`}
            rx="2"
            transform={`translate(0, ${-20 - i * 12})`}
          />
        ))}
      </g>

      {/* Labels */}
      <text x="25" y="175" fontSize="8" fill="#6B7280">
        kWh/m²
      </text>
      <text x="30" y="195" fontSize="10" fill="#374151" fontWeight="600">
        800–1.200 kWh/m²/Jahr
      </text>

      {/* Ground */}
      <rect y="180" width="300" height="70" fill="#E5E7EB" rx="0" />
      <text
        x="150"
        y="220"
        textAnchor="middle"
        fontSize="12"
        fill="#6B7280"
      >
        DACH-Region
      </text>
    </svg>
  );
}

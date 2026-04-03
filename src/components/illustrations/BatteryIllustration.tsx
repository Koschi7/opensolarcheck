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
  const fillHeight = hasBattery ? chargeLevel * 100 : 0;

  return (
    <svg viewBox="0 0 300 250" className="w-full max-w-[300px]">
      <defs>
        <linearGradient id="batteryFill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="batteryEmpty" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
      </defs>

      {/* Battery body */}
      <g transform="translate(100, 30)">
        {/* Terminal */}
        <rect x="30" y="-8" width="40" height="10" rx="3" fill="#9CA3AF" />

        {/* Battery outline */}
        <rect
          width="100"
          height="160"
          rx="10"
          fill={hasBattery ? "url(#batteryEmpty)" : "#F9FAFB"}
          stroke={hasBattery ? "#374151" : "#D1D5DB"}
          strokeWidth="3"
        />

        {/* Fill level */}
        {hasBattery && (
          <rect
            x="6"
            y={160 - fillHeight * 1.48 - 6}
            width="88"
            height={fillHeight * 1.48}
            rx="6"
            fill="url(#batteryFill)"
          >
            <animate
              attributeName="height"
              from="0"
              to={fillHeight * 1.48}
              dur="1s"
              fill="freeze"
            />
            <animate
              attributeName="y"
              from="148"
              to={160 - fillHeight * 1.48 - 6}
              dur="1s"
              fill="freeze"
            />
          </rect>
        )}

        {/* Capacity text */}
        <text
          x="50"
          y="90"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill={hasBattery ? "#065F46" : "#9CA3AF"}
        >
          {hasBattery ? `${capacity}` : "—"}
        </text>
        <text
          x="50"
          y="110"
          textAnchor="middle"
          fontSize="12"
          fill={hasBattery ? "#065F46" : "#9CA3AF"}
        >
          kWh
        </text>

        {/* Charge percentage */}
        {hasBattery && (
          <text
            x="50"
            y="140"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#059669"
          >
            {Math.round(chargeLevel * 100)}%
          </text>
        )}

        {/* Lightning bolt when charging */}
        {hasBattery && (
          <g transform="translate(35, 45)" opacity="0.3">
            <polygon
              points="15,0 5,20 12,20 8,40 25,15 18,15 22,0"
              fill="#FCD34D"
              stroke="#F59E0B"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.6;0.2"
                dur="2s"
                repeatCount="indefinite"
              />
            </polygon>
          </g>
        )}
      </g>

      {/* Energy flow arrows */}
      {hasBattery && (
        <>
          {/* Solar to battery */}
          <g>
            <path
              d="M50,60 Q70,40 95,50"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="8;0"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="50" cy="60" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
            <text x="50" y="64" textAnchor="middle" fontSize="10">
              ☀️
            </text>
          </g>

          {/* Battery to house */}
          <g>
            <path
              d="M205,80 Q230,60 250,80"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="4,4"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="8;0"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
            <circle cx="255" cy="80" r="12" fill="#ECFDF5" stroke="#10B981" strokeWidth="1" />
            <text x="255" y="84" textAnchor="middle" fontSize="10">
              🏠
            </text>
          </g>
        </>
      )}

      {/* Status label */}
      <rect
        x="80"
        y="210"
        width="140"
        height="30"
        rx="15"
        fill={hasBattery ? "#ECFDF5" : "#F3F4F6"}
        stroke={hasBattery ? "#10B981" : "#D1D5DB"}
        strokeWidth="1"
      />
      <text
        x="150"
        y="230"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill={hasBattery ? "#065F46" : "#9CA3AF"}
      >
        {hasBattery ? "Speicher aktiv" : "Kein Speicher"}
      </text>
    </svg>
  );
}

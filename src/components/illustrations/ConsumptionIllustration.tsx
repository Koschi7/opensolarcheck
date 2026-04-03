"use client";

interface Props {
  hasHeatPump: boolean;
  hasEV: boolean;
}

export function ConsumptionIllustration({ hasHeatPump, hasEV }: Props) {
  return (
    <svg viewBox="0 0 300 260" className="w-full max-w-[300px]">
      {/* House */}
      <g>
        {/* Wall */}
        <rect x="80" y="100" width="140" height="110" rx="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5" />

        {/* Roof */}
        <polygon points="70,100 150,50 230,100" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5" />

        {/* Door */}
        <rect x="135" y="155" width="30" height="55" rx="3" fill="#78716C" />

        {/* Windows */}
        <rect x="92" y="120" width="30" height="25" rx="2" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1">
          <animate
            attributeName="fill"
            values="#BFDBFE;#FDE68A;#BFDBFE"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="178" y="120" width="30" height="25" rx="2" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1">
          <animate
            attributeName="fill"
            values="#BFDBFE;#FDE68A;#BFDBFE"
            dur="4s"
            begin="1s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* Appliances */}
      {/* Fridge */}
      <g transform="translate(245, 120)">
        <rect width="22" height="35" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="1" />
        <line x1="0" y1="14" x2="22" y2="14" stroke="#9CA3AF" strokeWidth="0.5" />
        <circle cx="16" cy="8" r="1.5" fill="#9CA3AF" />
        <circle cx="16" cy="24" r="1.5" fill="#9CA3AF" />
        <circle cx="11" cy="28" r="3" fill="#60A5FA" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Lightbulb */}
      <g transform="translate(148, 65)">
        <circle cx="0" cy="0" r="8" fill="#FCD34D" opacity="0.3">
          <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="5" fill="#FCD34D" />
        <rect x="-2" y="5" width="4" height="4" fill="#A8A29E" rx="1" />
      </g>

      {/* Heat pump (conditional) */}
      {hasHeatPump && (
        <g transform="translate(30, 140)">
          <rect width="40" height="50" rx="4" fill="#F9FAFB" stroke="#F97316" strokeWidth="1.5" />
          <text x="20" y="20" textAnchor="middle" fontSize="8" fill="#F97316" fontWeight="bold">
            WP
          </text>
          {/* Fan animation */}
          <g transform="translate(20, 35)">
            <circle cx="0" cy="0" r="8" fill="none" stroke="#F97316" strokeWidth="1" />
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="2s"
                repeatCount="indefinite"
              />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#F97316" strokeWidth="1.5" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#F97316" strokeWidth="1.5" />
            </g>
          </g>
          {/* Energy waves */}
          <path d="M42,20 Q52,15 42,10" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </path>
        </g>
      )}

      {/* Electric car (conditional) */}
      {hasEV && (
        <g transform="translate(85, 220)">
          {/* Car body */}
          <rect x="0" y="5" width="60" height="20" rx="3" fill="#3B82F6" />
          <rect x="8" y="-5" width="40" height="15" rx="4" fill="#60A5FA" />
          {/* Windows */}
          <rect x="12" y="-2" width="14" height="10" rx="2" fill="#BFDBFE" />
          <rect x="30" y="-2" width="14" height="10" rx="2" fill="#BFDBFE" />
          {/* Wheels */}
          <circle cx="14" cy="27" r="6" fill="#374151" />
          <circle cx="14" cy="27" r="3" fill="#6B7280" />
          <circle cx="46" cy="27" r="6" fill="#374151" />
          <circle cx="46" cy="27" r="3" fill="#6B7280" />
          {/* Charging bolt */}
          <g transform="translate(65, 8)">
            <polygon points="5,0 0,8 4,8 2,16 10,6 6,6 8,0" fill="#FCD34D" stroke="#F59E0B" strokeWidth="0.5">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
            </polygon>
          </g>
        </g>
      )}

      {/* Energy meter */}
      <g transform="translate(242, 170)">
        <rect width="24" height="30" rx="2" fill="white" stroke="#374151" strokeWidth="1" />
        <rect x="3" y="3" width="18" height="10" rx="1" fill="#1F2937" />
        <text x="12" y="10" textAnchor="middle" fontSize="5" fill="#10B981" fontFamily="monospace">
          kWh
        </text>
        <circle cx="12" cy="22" r="4" fill="none" stroke="#EF4444" strokeWidth="1">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 12 22;360 12 22"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <line x1="12" y1="18" x2="12" y2="22" stroke="#EF4444" strokeWidth="1" />
      </g>
    </svg>
  );
}

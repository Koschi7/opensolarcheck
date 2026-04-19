"use client";

import { useTranslations } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BatteryIllustration } from "@/components/illustrations/BatteryIllustration";

interface Props {
  battery: ConfiguratorInput["battery"];
  peakPower: number;
  onUpdate: (updates: Partial<ConfiguratorInput["battery"]>) => void;
}

export function Step5Battery({ battery, peakPower, onUpdate }: Props) {
  const t = useTranslations("configurator.step5");
  const recommendedCapacity = Math.max(5, Math.min(20, Math.round(peakPower)));

  const handleToggle = (checked: boolean) => {
    if (checked) {
      onUpdate({ hasBattery: true, capacity: recommendedCapacity });
    } else {
      onUpdate({ hasBattery: false });
    }
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-7 space-y-7">
        <Field label={t("hasBattery")} hint={t("hasBatteryHint")}>
          <div className="grid grid-cols-2 border border-rule">
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`px-4 py-3.5 text-left transition-colors ${
                !battery.hasBattery
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-secondary/30"
              }`}
              aria-pressed={!battery.hasBattery}
            >
              <div className="font-display text-[18px] tracking-tight">
                {t("noBatteryTitle")}
              </div>
              <div className={`text-[12px] mt-1 ${!battery.hasBattery ? "text-paper/70" : "text-muted-ink"}`}>
                {t("noBatteryDesc")}
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`px-4 py-3.5 text-left transition-colors border-l border-rule ${
                battery.hasBattery
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink hover:bg-secondary/30"
              }`}
              aria-pressed={battery.hasBattery}
            >
              <div className="font-display text-[18px] tracking-tight">
                {t("withBatteryTitle")}
              </div>
              <div className={`text-[12px] mt-1 ${battery.hasBattery ? "text-paper/70" : "text-muted-ink"}`}>
                {t("withBatteryDesc")}
              </div>
            </button>
          </div>
        </Field>

        {battery.hasBattery && (
          <Field
            label={t("capacity")}
            value={`${battery.capacity.toFixed(1)} ${t("capacityUnit")}`}
            hint={`${t("recommendation")} · ${t("recommendedCapacity")}: ${recommendedCapacity} kWh`}
          >
            <Slider
              value={[battery.capacity]}
              onValueChange={(v) => onUpdate({ capacity: Array.isArray(v) ? v[0] : v })}
              min={5}
              max={20}
              step={0.5}
              className="py-2"
              aria-label={t("capacity")}
            />
            <div className="flex justify-between text-[11px] text-faint-ink mt-2">
              <span>5 kWh</span>
              <span className="text-solar">
                ▾ {recommendedCapacity} {t("recommendedSuffix")}
              </span>
              <span>20 kWh</span>
            </div>
          </Field>
        )}

        {battery.hasBattery && (
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-rule">
            <Metric label={t("metrics.capacity")} value={battery.capacity.toFixed(1)} unit="kWh" />
            <Metric label={t("metrics.pvPower")} value={peakPower.toFixed(1)} unit="kWp" />
            <Metric
              label={t("metrics.ratio")}
              value={(battery.capacity / Math.max(peakPower, 0.1)).toFixed(2)}
              unit="kWh/kWp"
            />
          </div>
        )}
      </div>

      <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
        <div className="border border-rule p-5 md:p-6 bg-paper">
          <BatteryIllustration
            hasBattery={battery.hasBattery}
            capacity={battery.capacity}
            chargeLevel={battery.hasBattery ? 0.7 : 0}
          />
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-[12px] text-muted-ink mb-1">{label}</div>
      <div className="font-num text-[22px] tabular text-ink leading-none">
        {value}
        <span className="text-[11px] text-faint-ink ml-1">{unit}</span>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <Label className="text-[12.5px] text-muted-ink font-normal">{label}</Label>
        {value !== undefined && (
          <span className="font-num text-[13px] text-ink tabular">
            {value}
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p className="mt-2 text-[12px] text-faint-ink">
          {hint}
        </p>
      )}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Battery, Info } from "lucide-react";
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
      // When enabling battery, set capacity to recommended value
      onUpdate({ hasBattery: true, capacity: recommendedCapacity });
    } else {
      onUpdate({ hasBattery: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 mt-1">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between rounded-xl border-2 p-4">
            <div className="flex items-center gap-3">
              <Battery className="h-6 w-6 text-green-600" />
              <Label htmlFor="hasBattery" className="text-base cursor-pointer">
                {t("hasBattery")}
              </Label>
            </div>
            <Switch
              id="hasBattery"
              checked={battery.hasBattery}
              onCheckedChange={handleToggle}
            />
          </div>

          {battery.hasBattery && (
            <>
              {/* Capacity slider */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{t("capacity")}</Label>
                  <span className="text-sm font-medium text-green-600">
                    {battery.capacity} {t("capacityUnit")}
                  </span>
                </div>
                <Slider
                  value={[battery.capacity]}
                  onValueChange={(v) => onUpdate({ capacity: Array.isArray(v) ? v[0] : v })}
                  min={5}
                  max={20}
                  step={0.5}
                  className="py-2"
                  aria-label={t("capacity")}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>5 kWh</span>
                  <span>20 kWh</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800">
                  <p>{t("recommendation")}</p>
                  <p className="font-semibold mt-1">
                    {t("recommendedCapacity")}: {recommendedCapacity} kWh
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <BatteryIllustration
            hasBattery={battery.hasBattery}
            capacity={battery.capacity}
            chargeLevel={battery.hasBattery ? 0.7 : 0}
          />
        </div>
      </div>
    </div>
  );
}

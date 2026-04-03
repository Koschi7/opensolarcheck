"use client";

import { useTranslations } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoofIllustration } from "@/components/illustrations/RoofIllustration";

interface Props {
  roof: ConfiguratorInput["roof"];
  onUpdate: (updates: Partial<ConfiguratorInput["roof"]>) => void;
}

export function Step2Roof({ roof, onUpdate }: Props) {
  const t = useTranslations("configurator.step2");

  const azimuthPresets = [
    { label: t("azimuthEast"), value: -90 },
    { label: t("azimuthSouthEast"), value: -45 },
    { label: t("azimuthSouth"), value: 0 },
    { label: t("azimuthSouthWest"), value: 45 },
    { label: t("azimuthWest"), value: 90 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 mt-1">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Tilt */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>{t("tilt")}</Label>
              <span className="text-sm font-medium text-amber-600">
                {roof.tilt}°
              </span>
            </div>
            <Slider
              value={[roof.tilt]}
              onValueChange={(v) => onUpdate({ tilt: Array.isArray(v) ? v[0] : v })}
              min={0}
              max={60}
              step={1}
              className="py-2"
              aria-label={t("tilt")}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0° ({t("tiltFlat")})</span>
              <span>60° ({t("tiltSteep")})</span>
            </div>
          </div>

          {/* Azimuth - preset buttons */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>{t("azimuth")}</Label>
              <span className="text-sm font-medium text-amber-600">
                {roof.azimuth}°
              </span>
            </div>
            <p className="text-xs text-gray-500">{t("azimuthHelp")}</p>
            <div className="flex gap-1.5">
              {azimuthPresets.map((preset) => {
                const isSelected = roof.azimuth === preset.value;
                return (
                  <Button
                    key={preset.value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 text-xs px-1 ${isSelected ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                    onClick={() => onUpdate({ azimuth: preset.value })}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
            <Slider
              value={[roof.azimuth]}
              onValueChange={(v) => onUpdate({ azimuth: Array.isArray(v) ? v[0] : v })}
              min={-90}
              max={90}
              step={5}
              className="py-2"
              aria-label={t("azimuth")}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>-90° ({t("east")})</span>
              <span>0° ({t("south")})</span>
              <span>90° ({t("west")})</span>
            </div>
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area">{t("area")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="area"
                type="text"
                inputMode="decimal"
                value={roof.area || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d*\.?\d*$/.test(v)) {
                    onUpdate({ area: v === "" ? 0 : parseFloat(v) });
                  }
                }}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">{t("areaUnit")}</span>
            </div>
            <p className="text-xs text-gray-500">{t("areaHelp")}</p>
          </div>

          {/* Shading */}
          <div className="space-y-2">
            <Label>{t("shading")}</Label>
            <Select
              value={roof.shading}
              onValueChange={(v) =>
                onUpdate({
                  shading: v as ConfiguratorInput["roof"]["shading"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {() => {
                    const labels: Record<string, string> = {
                      none: t("shadingNone"),
                      low: t("shadingLow"),
                      medium: t("shadingMedium"),
                      high: t("shadingHigh"),
                    };
                    return labels[roof.shading] ?? roof.shading;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("shadingNone")}</SelectItem>
                <SelectItem value="low">{t("shadingLow")}</SelectItem>
                <SelectItem value="medium">{t("shadingMedium")}</SelectItem>
                <SelectItem value="high">{t("shadingHigh")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <RoofIllustration tilt={roof.tilt} azimuth={roof.azimuth} />
        </div>
      </div>
    </div>
  );
}

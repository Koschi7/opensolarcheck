"use client";

import { useTranslations } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
    { label: t("azimuthEast"), short: t("east"), value: -90 },
    { label: t("azimuthSouthEast"), short: "SO", value: -45 },
    { label: t("azimuthSouth"), short: t("south"), value: 0 },
    { label: t("azimuthSouthWest"), short: "SW", value: 45 },
    { label: t("azimuthWest"), short: t("west"), value: 90 },
  ];

  return (
    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-7 space-y-7">
        <Field label={t("tilt")} value={`${roof.tilt}°`} hint={`0° ${t("tiltFlat")} · 60° ${t("tiltSteep")}`}>
          <Slider
            value={[roof.tilt]}
            onValueChange={(v) => onUpdate({ tilt: Array.isArray(v) ? v[0] : v })}
            min={0}
            max={60}
            step={1}
            className="py-2"
            aria-label={t("tilt")}
          />
        </Field>

        <Field label={t("azimuth")} value={`${roof.azimuth >= 0 ? "+" : ""}${roof.azimuth}°`} hint={t("azimuthHelp")}>
          <div className="grid grid-cols-5 border border-rule">
            {azimuthPresets.map((preset, i) => {
              const isSelected = roof.azimuth === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onUpdate({ azimuth: preset.value })}
                  className={`py-3 text-[12px] transition-colors ${
                    i > 0 ? "border-l border-rule" : ""
                  } ${
                    isSelected
                      ? "bg-ink text-paper"
                      : "bg-paper text-muted-ink hover:text-ink"
                  }`}
                >
                  <span className="block font-medium">
                    {preset.short}
                  </span>
                  <span className="block font-num text-[10px] opacity-70 mt-0.5">
                    {preset.value >= 0 ? "+" : ""}
                    {preset.value}°
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <Slider
              value={[roof.azimuth]}
              onValueChange={(v) =>
                onUpdate({ azimuth: Array.isArray(v) ? v[0] : v })
              }
              min={-90}
              max={90}
              step={5}
              className="py-2"
              aria-label={t("azimuth")}
            />
            <div className="flex justify-between text-[11px] text-faint-ink mt-2">
              <span>−90° {t("east")}</span>
              <span>0° {t("south")}</span>
              <span>+90° {t("west")}</span>
            </div>
          </div>
        </Field>

        <Field label={t("area")} value={`${roof.area} m²`} hint={t("areaHelp")}>
          <div className="flex items-baseline gap-3 border-b border-rule-strong pb-2">
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
              className="flex-1 border-0 bg-transparent text-[26px] font-display tabular px-0 focus-visible:ring-0"
            />
            <span className="text-[13px] text-faint-ink">
              {t("areaUnit")}
            </span>
          </div>
        </Field>

        <Field label={t("shading")} hint="Reduktion durch Bäume, Nachbargebäude, Kamine">
          <Select
            value={roof.shading}
            onValueChange={(v) =>
              onUpdate({
                shading: v as ConfiguratorInput["roof"]["shading"],
              })
            }
          >
            <SelectTrigger className="h-12 border-rule-strong bg-paper">
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
        </Field>
      </div>

      <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
        <div className="border border-rule p-5 md:p-6 bg-paper">
          <RoofIllustration tilt={roof.tilt} azimuth={roof.azimuth} />
        </div>
      </aside>
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

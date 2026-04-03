"use client";

import { useTranslations } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { MODULE_AREA } from "@/lib/data/defaults";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Zap, Info, Check } from "lucide-react";
import { SystemIllustration } from "@/components/illustrations/SystemIllustration";

interface Props {
  system: ConfiguratorInput["system"];
  roofArea: number;
  onUpdate: (updates: Partial<ConfiguratorInput["system"]>) => void;
}

const MODULE_TYPES = [
  { key: "monocrystalline" as const, efficiency: 0.21, power: 420 },
  { key: "polycrystalline" as const, efficiency: 0.17, power: 340 },
  { key: "thinfilm" as const, efficiency: 0.13, power: 260 },
];

export function Step3System({ system, roofArea, onUpdate }: Props) {
  const t = useTranslations("configurator.step3");
  const maxModules = Math.floor(roofArea / MODULE_AREA);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 mt-1">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {/* Module Type - Card Selection */}
          <div className="space-y-2">
            <Label>{t("moduleType")}</Label>
            <div className="space-y-2">
              {MODULE_TYPES.map((mod) => {
                const isSelected = system.moduleType === mod.key;
                const isRecommended = mod.key === "monocrystalline";
                return (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() =>
                      onUpdate({
                        moduleType: mod.key,
                        modulePower: mod.power,
                      })
                    }
                    className={`w-full text-left rounded-lg border-2 p-3 transition-colors ${
                      isSelected
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Check className="h-4 w-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-medium text-sm">
                          {t(mod.key)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRecommended && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            {t("recommended")}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {Math.round(mod.efficiency * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">
                      {t(`${mod.key}Desc`)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Count - Slider with recommendation */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>{t("moduleCount")}</Label>
              <span className="text-sm font-medium text-amber-600">
                {system.moduleCount}
              </span>
            </div>
            <Slider
              value={[system.moduleCount]}
              onValueChange={(v) => {
                const count = Array.isArray(v) ? v[0] : v;
                onUpdate({ moduleCount: count });
              }}
              min={1}
              max={Math.max(maxModules, 1)}
              step={1}
              className="py-2"
              aria-label={t("moduleCount")}
            />
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                {t("moduleCountInfo", {
                  area: roofArea,
                  max: maxModules,
                })}
              </span>
            </div>
          </div>

          {/* Module Power (read-only info) */}
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span className="text-gray-600">{t("modulePower")}</span>
            <span className="font-medium">{system.modulePower} {t("modulePowerUnit")}</span>
          </div>

          {/* Peak Power (read-only) */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <Label className="text-amber-800">{t("peakPower")}</Label>
            </div>
            <p className="mt-1 text-3xl font-bold text-amber-600">
              {system.peakPower}{" "}
              <span className="text-base font-normal">
                {t("peakPowerUnit")}
              </span>
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <SystemIllustration moduleCount={system.moduleCount} />
        </div>
      </div>
    </div>
  );
}

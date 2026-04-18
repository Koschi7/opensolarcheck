"use client";

import { useTranslations } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { MODULE_AREA } from "@/lib/data/defaults";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-7 space-y-7">
        <Field label={t("moduleType")}>
          <div className="border-t border-rule">
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
                  className={`w-full text-left border-b border-rule px-4 py-3.5 transition-colors ${
                    isSelected ? "bg-ink text-paper" : "bg-paper hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-[17px] tracking-tight">
                        {t(mod.key)}
                      </span>
                      {isRecommended && (
                        <span className="text-[11px] text-solar">
                          · {t("recommended")}
                        </span>
                      )}
                    </div>
                    <span className={`font-num text-[13px] tabular ${isSelected ? "text-paper" : "text-ink"}`}>
                      η {Math.round(mod.efficiency * 100)}%
                    </span>
                  </div>
                  <p className={`text-[12px] mt-1 ${isSelected ? "text-paper/70" : "text-muted-ink"}`}>
                    {t(`${mod.key}Desc`)}
                  </p>
                </button>
              );
            })}
          </div>
        </Field>

        <Field
          label={t("moduleCount")}
          value={`${system.moduleCount} × ${system.modulePower} Wp`}
          hint={t("moduleCountInfo", { area: roofArea, max: maxModules })}
        >
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
          <div className="flex justify-between text-[11px] text-faint-ink mt-2">
            <span>1</span>
            <span>max. {Math.max(maxModules, 1)}</span>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-rule">
          <div className="pt-4">
            <div className="text-[12.5px] text-muted-ink mb-1">
              {t("modulePower")}
            </div>
            <div className="font-num text-[24px] md:text-[26px] tabular text-ink leading-none">
              {system.modulePower}
              <span className="text-[12px] text-faint-ink ml-1">
                {t("modulePowerUnit")}
              </span>
            </div>
          </div>
          <div className="pt-4">
            <div className="text-[12.5px] text-muted-ink mb-1">
              {t("peakPower")}
            </div>
            <div className="font-num text-[24px] md:text-[26px] tabular text-solar leading-none">
              {system.peakPower.toFixed(1)}
              <span className="text-[12px] text-faint-ink ml-1">
                {t("peakPowerUnit")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
        <div className="border border-rule p-5 md:p-6 bg-paper">
          <SystemIllustration moduleCount={system.moduleCount} peakPower={system.peakPower} />
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

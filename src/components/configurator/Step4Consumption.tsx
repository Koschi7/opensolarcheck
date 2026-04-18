"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { CONSUMPTION_BY_PERSONS } from "@/lib/data/defaults";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConsumptionIllustration } from "@/components/illustrations/ConsumptionIllustration";

interface Props {
  consumption: ConfiguratorInput["consumption"];
  onUpdate: (updates: Partial<ConfiguratorInput["consumption"]>) => void;
  totalConsumption: number;
}

export function Step4Consumption({
  consumption,
  onUpdate,
  totalConsumption,
}: Props) {
  const t = useTranslations("configurator.step4");
  const locale = useLocale();

  const quickOptions = [
    { key: "1", label: t("persons1") },
    { key: "2", label: t("persons2") },
    { key: "3", label: t("persons3") },
    { key: "4", label: t("persons4") },
  ];

  return (
    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-7 space-y-7">
        <Field label={t("quickSelect")} hint="Basis nach BDEW H0-Profil.">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-rule">
            {quickOptions.map((opt, i) => {
              const isSelected =
                consumption.annualConsumption ===
                CONSUMPTION_BY_PERSONS[opt.key];
              const [personsLabel, kwhLabel] = opt.label.split(" (");
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      annualConsumption: CONSUMPTION_BY_PERSONS[opt.key],
                    })
                  }
                  className={`px-3 py-4 text-left transition-colors ${
                    i > 0 ? "border-l border-rule" : ""
                  } ${i >= 2 ? "border-t border-rule md:border-t-0" : ""} ${
                    isSelected
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink hover:bg-secondary/30"
                  }`}
                >
                  <span className="block font-display text-[15px] tracking-tight">
                    {personsLabel}
                  </span>
                  <span className={`block font-num text-[11px] mt-1 tabular ${isSelected ? "text-paper/70" : "text-faint-ink"}`}>
                    {kwhLabel?.replace(")", "")}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label={t("annualConsumption")} value={`${consumption.annualConsumption.toLocaleString(locale)} ${t("annualConsumptionUnit")}`}>
          <div className="flex items-baseline gap-3 border-b border-rule-strong pb-2">
            <Input
              id="annualConsumption"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={consumption.annualConsumption || ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d*$/.test(v)) {
                  onUpdate({
                    annualConsumption: v === "" ? 0 : parseInt(v),
                  });
                }
              }}
              className="flex-1 border-0 bg-transparent text-[26px] font-display tabular px-0 focus-visible:ring-0"
            />
            <span className="text-[13px] text-faint-ink">
              kWh / a
            </span>
          </div>
        </Field>

        <div className="border-t border-rule">
          <ToggleRow
            label={t("heatPump")}
            hint={t("heatPumpInfo")}
            checked={consumption.hasHeatPump}
            onChange={(v) => onUpdate({ hasHeatPump: v })}
            id="heatPump"
          />
          <ToggleRow
            label={t("ev")}
            hint={t("evInfo")}
            checked={consumption.hasEV}
            onChange={(v) => onUpdate({ hasEV: v })}
            id="ev"
          />
        </div>

        <div className="pt-2 border-t border-rule-strong">
          <div className="flex items-baseline justify-between pt-4">
            <div className="text-[13px] text-muted-ink">
              {t("totalConsumption")}
            </div>
            <div className="font-num text-[28px] md:text-[32px] tabular text-ink leading-none">
              {totalConsumption.toLocaleString(locale)}
              <span className="text-[12px] text-faint-ink ml-2">
                kWh / a
              </span>
            </div>
          </div>
        </div>
      </div>

      <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
        <div className="border border-rule p-5 md:p-6 bg-paper">
          <ConsumptionIllustration
            hasHeatPump={consumption.hasHeatPump}
            hasEV={consumption.hasEV}
            base={consumption.annualConsumption}
          />
        </div>
      </aside>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
  id,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between gap-4 border-b border-rule px-1 py-4 text-left transition-colors ${
        checked ? "bg-secondary/40" : "bg-paper hover:bg-secondary/20"
      }`}
      id={id}
      aria-pressed={checked}
    >
      <div>
        <div className="font-display text-[16px] tracking-tight text-ink">
          {label}
        </div>
        <div className="text-[12px] text-muted-ink mt-0.5">
          {hint}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-[12px] ${checked ? "text-solar" : "text-faint-ink"}`}>
          {checked ? "aktiv" : "aus"}
        </span>
        <div
          className={`relative h-5 w-10 border transition-colors ${
            checked ? "bg-ink border-ink" : "bg-paper border-rule-strong"
          }`}
        >
          <div
            className={`absolute top-0.5 h-3 w-3 transition-all ${
              checked ? "left-[22px] bg-paper" : "left-0.5 bg-ink"
            }`}
          />
        </div>
      </div>
    </button>
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

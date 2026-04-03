"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ConfiguratorInput } from "@/lib/types";
import { CONSUMPTION_BY_PERSONS } from "@/lib/data/defaults";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { User, Users, Flame, Car } from "lucide-react";
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
    { key: "1", label: t("persons1"), icon: User },
    { key: "2", label: t("persons2"), icon: Users },
    { key: "3", label: t("persons3"), icon: Users },
    { key: "4", label: t("persons4"), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 mt-1">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {/* Quick select */}
          <div className="space-y-2">
            <Label>{t("quickSelect")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickOptions.map((opt) => {
                const isSelected =
                  consumption.annualConsumption ===
                  CONSUMPTION_BY_PERSONS[opt.key];
                return (
                  <Button
                    key={opt.key}
                    variant={isSelected ? "default" : "outline"}
                    className={`${isSelected ? "bg-amber-500 hover:bg-amber-600" : ""} px-2 py-1 h-auto`}
                    onClick={() =>
                      onUpdate({
                        annualConsumption: CONSUMPTION_BY_PERSONS[opt.key],
                      })
                    }
                  >
                    <opt.icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs leading-tight">{opt.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Manual input */}
          <div className="space-y-2">
            <Label htmlFor="annualConsumption">{t("annualConsumption")}</Label>
            <div className="flex items-center gap-2">
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
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {t("annualConsumptionUnit")}
              </span>
            </div>
          </div>

          {/* Heat pump */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
              <div>
                <Label htmlFor="heatPump" className="cursor-pointer">
                  {t("heatPump")}
                </Label>
                <p className="text-xs text-gray-500">{t("heatPumpInfo")}</p>
              </div>
            </div>
            <Switch
              id="heatPump"
              checked={consumption.hasHeatPump}
              onCheckedChange={(v) => onUpdate({ hasHeatPump: v })}
            />
          </div>

          {/* EV */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <div>
                <Label htmlFor="ev" className="cursor-pointer">
                  {t("ev")}
                </Label>
                <p className="text-xs text-gray-500">{t("evInfo")}</p>
              </div>
            </div>
            <Switch
              id="ev"
              checked={consumption.hasEV}
              onCheckedChange={(v) => onUpdate({ hasEV: v })}
            />
          </div>

          {/* Total */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <Label className="text-blue-800">{t("totalConsumption")}</Label>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {totalConsumption.toLocaleString(locale)}{" "}
              <span className="text-base font-normal">
                {t("annualConsumptionUnit")}
              </span>
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <ConsumptionIllustration
            hasHeatPump={consumption.hasHeatPump}
            hasEV={consumption.hasEV}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ConfiguratorInput } from "@/lib/types";
import { geocodePostalCode } from "@/lib/api/pvgis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationIllustration } from "@/components/illustrations/LocationIllustration";

interface Props {
  location: ConfiguratorInput["location"];
  onUpdate: (updates: Partial<ConfiguratorInput["location"]>) => void;
}

export function Step1Location({ location, onUpdate }: Props) {
  const t = useTranslations("configurator.step1");
  const { trackEvent } = useAnalytics();
  const hasTrackedStart = useRef(false);
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState<"idle" | "found" | "notFound">("idle");
  const [showManual, setShowManual] = useState(false);

  const handleSearch = async () => {
    if (!location.postalCode || location.postalCode.length < 4) return;
    setSearching(true);
    setStatus("idle");

    const result = await geocodePostalCode(location.postalCode);
    if (result) {
      onUpdate({
        lat: result.lat,
        lon: result.lon,
        city: result.city,
      });
      setStatus("found");
    } else {
      setStatus("notFound");
    }
    setSearching(false);
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
      <div className="md:col-span-7 space-y-7">
        <Field label={t("postalCode")} hint={t("postalCodeHint")}>
          <div className="flex items-baseline gap-3 border-b border-rule-strong pb-2">
            <Input
              id="postalCode"
              inputMode="numeric"
              value={location.postalCode}
              onChange={(e) => {
                if (!hasTrackedStart.current) {
                  trackEvent({ name: "configurator_started" });
                  hasTrackedStart.current = true;
                }
                onUpdate({ postalCode: e.target.value });
              }}
              placeholder={t("postalCodePlaceholder")}
              className="flex-1 border-0 bg-transparent text-[26px] font-display tabular px-0 focus-visible:ring-0"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={
                searching || !location.postalCode || location.postalCode.length < 4
              }
              className="text-[13px] text-ink hover:text-solar disabled:text-faint-ink disabled:cursor-not-allowed"
            >
              {searching ? "…" : t("fetch")}
            </button>
          </div>
          <div className="mt-2 text-[12px] text-faint-ink min-h-[14px]">
            {searching && <span>{t("searching")}</span>}
            {status === "found" && location.city && (
              <span className="text-ink">
                ✓ {location.postalCode} · {location.city} · <span className="font-num tabular">{location.lat.toFixed(3)}°N, {location.lon.toFixed(3)}°E</span>
              </span>
            )}
            {status === "notFound" && (
              <span className="text-solar">✕ {t("notFound")}</span>
            )}
          </div>
        </Field>

        {location.city && !showManual && (
          <Field label={t("city")}>
            <div className="flex items-baseline justify-between border-b border-rule pb-2">
              <span className="font-display text-[20px] text-ink">
                {location.city}
              </span>
              <span className="font-num text-[12px] text-faint-ink tabular">
                {location.lat.toFixed(4)}° · {location.lon.toFixed(4)}°
              </span>
            </div>
          </Field>
        )}

        <button
          type="button"
          onClick={() => setShowManual(!showManual)}
          className="text-[12.5px] text-muted-ink hover:text-ink border-b border-rule pb-0.5"
        >
          {showManual ? t("manualClose") : t("manualOpen")}
        </button>

        {showManual && (
          <div className="grid grid-cols-2 gap-6 pt-2">
            <Field label={t("lat")} value={`${location.lat.toFixed(3)}°`}>
              <div className="border-b border-rule-strong pb-2">
                <Input
                  id="lat"
                  type="text"
                  inputMode="decimal"
                  value={location.lat || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
                      onUpdate({ lat: v === "" ? 0 : parseFloat(v) });
                    }
                  }}
                  className="w-full border-0 bg-transparent text-[20px] font-num tabular px-0 focus-visible:ring-0"
                />
              </div>
            </Field>
            <Field label={t("lon")} value={`${location.lon.toFixed(3)}°`}>
              <div className="border-b border-rule-strong pb-2">
                <Input
                  id="lon"
                  type="text"
                  inputMode="decimal"
                  value={location.lon || ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || /^-?\d*\.?\d*$/.test(v)) {
                      onUpdate({ lon: v === "" ? 0 : parseFloat(v) });
                    }
                  }}
                  className="w-full border-0 bg-transparent text-[20px] font-num tabular px-0 focus-visible:ring-0"
                />
              </div>
            </Field>
          </div>
        )}
      </div>

      <aside className="md:col-span-5 md:sticky md:top-24 md:self-start">
        <div className="border border-rule p-5 md:p-6 bg-paper">
          <LocationIllustration lat={location.lat || 50.0} />
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

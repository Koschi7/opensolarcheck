"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { ConfiguratorInput } from "@/lib/types";
import { geocodePostalCode } from "@/lib/api/pvgis";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Check, X } from "lucide-react";
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
  const [status, setStatus] = useState<"idle" | "found" | "notFound">("idle")
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-gray-600 mt-1">{t("description")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* PLZ Search */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">{t("postalCode")}</Label>
            <div className="flex gap-2">
              <Input
                id="postalCode"
                value={location.postalCode}
                onChange={(e) => {
                  if (!hasTrackedStart.current) {
                    trackEvent({ name: "configurator_started" });
                    hasTrackedStart.current = true;
                  }
                  onUpdate({ postalCode: e.target.value });
                }}
                placeholder={t("postalCodePlaceholder")}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={
                  searching || !location.postalCode || location.postalCode.length < 4
                }
                size="icon"
                className="bg-amber-500 hover:bg-amber-600"
                aria-label={t("postalCode")}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {searching && (
              <p className="text-sm text-amber-600">{t("searching")}</p>
            )}
            {status === "found" && location.city && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                {location.postalCode} {location.city}
              </p>
            )}
            {status === "notFound" && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <X className="h-4 w-4" />
                {t("notFound")}
              </p>
            )}
          </div>

          {/* City display */}
          {location.city && (
            <div className="space-y-2">
              <Label>{t("city")}</Label>
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {location.city}
                </span>
              </div>
            </div>
          )}

          {/* Manual entry toggle */}
          <Button
            variant="link"
            onClick={() => setShowManual(!showManual)}
            className="text-sm text-gray-500 p-0 h-auto"
          >
            {t("manualEntry")}
          </Button>

          {showManual && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="lat">{t("lat")}</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.01"
                  value={location.lat}
                  onChange={(e) =>
                    onUpdate({ lat: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lon">{t("lon")}</Label>
                <Input
                  id="lon"
                  type="number"
                  step="0.01"
                  value={location.lon}
                  onChange={(e) =>
                    onUpdate({ lon: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Illustration */}
        <div className="flex items-center justify-center">
          <LocationIllustration lat={location.lat} />
        </div>
      </div>
    </div>
  );
}

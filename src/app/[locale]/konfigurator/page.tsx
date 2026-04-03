"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useConfigurator } from "@/hooks/useConfigurator";
import { usePVGIS } from "@/hooks/usePVGIS";
import { useCalculations } from "@/hooks/useCalculations";
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/configurator/StepIndicator";
import { StepNavigation } from "@/components/configurator/StepNavigation";
import { Step1Location } from "@/components/configurator/Step1Location";
import { Step2Roof } from "@/components/configurator/Step2Roof";
import { Step3System } from "@/components/configurator/Step3System";
import { Step4Consumption } from "@/components/configurator/Step4Consumption";
import { Step5Battery } from "@/components/configurator/Step5Battery";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function KonfiguratorPage() {
  const t = useTranslations("configurator");
  const router = useRouter();
  const pvgis = usePVGIS();
  const [calculating, setCalculating] = useState(false);

  const {
    step,
    totalSteps,
    input,
    updateLocation,
    updateRoof,
    updateSystem,
    updateConsumption,
    updateBattery,
    getTotalConsumption,
    canGoNext,
    goNext,
    goBack,
  } = useConfigurator();

  const handleCalculate = useCallback(async () => {
    setCalculating(true);

    // Fetch PVGIS data
    const pvgisData = await pvgis.fetchData({
      lat: input.location.lat,
      lon: input.location.lon,
      peakpower: input.system.peakPower,
      angle: input.roof.tilt,
      aspect: input.roof.azimuth,
    });

    // Store input + pvgis data in sessionStorage for results page
    const totalConsumption = getTotalConsumption();
    sessionStorage.setItem(
      "opensolarcheck_input",
      JSON.stringify({
        input,
        pvgisData,
        totalConsumption,
      })
    );

    setCalculating(false);
    router.push("/ergebnis");
  }, [input, pvgis, getTotalConsumption, router]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Location location={input.location} onUpdate={updateLocation} />
        );
      case 2:
        return <Step2Roof roof={input.roof} onUpdate={updateRoof} />;
      case 3:
        return (
          <Step3System
            system={input.system}
            roofArea={input.roof.area}
            onUpdate={updateSystem}
          />
        );
      case 4:
        return (
          <Step4Consumption
            consumption={input.consumption}
            onUpdate={updateConsumption}
            totalConsumption={getTotalConsumption()}
          />
        );
      case 5:
        return (
          <Step5Battery
            battery={input.battery}
            peakPower={input.system.peakPower}
            onUpdate={updateBattery}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
        {t("title")}
      </h1>
      <p className="text-center text-gray-500 mb-8">
        {t("step")} {step} {t("of")} {totalSteps}
      </p>

      <StepIndicator currentStep={step} totalSteps={totalSteps} />

      <Card className="mt-8 shadow-lg">
        <CardContent className="p-6 md:p-8">
          {calculating ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
              <p className="text-lg text-gray-600">{t("calculating")}</p>
            </div>
          ) : (
            renderStep()
          )}

          {!calculating && (
            <StepNavigation
              step={step}
              totalSteps={totalSteps}
              canGoNext={canGoNext()}
              onBack={goBack}
              onNext={goNext}
              onCalculate={handleCalculate}
            />
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800">{t("disclaimer")}</p>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useConfigurator } from "@/hooks/useConfigurator";
import { usePVGIS } from "@/hooks/usePVGIS";
import { StepIndicator } from "@/components/configurator/StepIndicator";
import { StepNavigation } from "@/components/configurator/StepNavigation";
import { Step1Location } from "@/components/configurator/Step1Location";
import { Step2Roof } from "@/components/configurator/Step2Roof";
import { Step3System } from "@/components/configurator/Step3System";
import { Step4Consumption } from "@/components/configurator/Step4Consumption";
import { Step5Battery } from "@/components/configurator/Step5Battery";
import { Loader2 } from "lucide-react";

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

    const pvgisData = await pvgis.fetchData({
      lat: input.location.lat,
      lon: input.location.lon,
      peakpower: input.system.peakPower,
      angle: input.roof.tilt,
      aspect: input.roof.azimuth,
    });

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

  const stepKeys = ["step1", "step2", "step3", "step4", "step5"] as const;
  const currentTitle = t(`${stepKeys[step - 1]}.title`);
  const currentDescription = t(`${stepKeys[step - 1]}.description`);

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
    <div className="bg-paper min-h-screen flex flex-col">
      {/* Header strip — compact */}
      <header className="rule-b">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-3 md:py-4 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-[18px] md:text-[22px] tracking-tight text-ink">
              {currentTitle}
            </h1>
            <span className="hidden md:inline text-[13px] text-muted-ink">
              · {t("title")}
            </span>
          </div>
          <div className="font-mono-ui text-[11px] text-muted-ink tabular shrink-0">
            {t("step")} {String(step).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </div>
        </div>
      </header>

      <StepIndicator currentStep={step} totalSteps={totalSteps} />

      {/* Content */}
      <div className="mx-auto max-w-[1400px] w-full px-5 md:px-8 pb-32 md:pb-6 pt-5 md:pt-6 flex-1">
        {calculating ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <Loader2 className="h-8 w-8 text-ink animate-spin" />
            <p className="font-mono-ui text-[13px] text-muted-ink">
              {t("calculating")}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[14px] md:text-[15px] text-muted-ink max-w-[64ch] mb-5 md:mb-6">
              {currentDescription}
            </p>
            {renderStep()}
          </>
        )}
      </div>

      {/* Navigation — sticky bottom on all viewports so CTA stays visible */}
      {!calculating && (
        <div className="fixed md:sticky bottom-0 left-0 right-0 rule-t bg-paper z-40">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-3 md:py-3">
            <StepNavigation
              step={step}
              totalSteps={totalSteps}
              canGoNext={canGoNext()}
              onBack={goBack}
              onNext={goNext}
              onCalculate={handleCalculate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

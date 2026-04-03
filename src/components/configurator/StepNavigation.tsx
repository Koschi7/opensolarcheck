"use client";

import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";

interface StepNavigationProps {
  step: number;
  totalSteps: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onCalculate: () => void;
}

export function StepNavigation({
  step,
  totalSteps,
  canGoNext,
  onBack,
  onNext,
  onCalculate,
}: StepNavigationProps) {
  const t = useTranslations("configurator");
  const { trackEvent } = useAnalytics();

  const handleNext = () => {
    trackEvent({ name: "configurator_step_completed", data: { step } });
    onNext();
  };

  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Button>

      {step < totalSteps ? (
        <Button
          onClick={handleNext}
          disabled={!canGoNext}
          className="gap-2 bg-amber-500 hover:bg-amber-600"
        >
          {t("next")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onCalculate}
          disabled={!canGoNext}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Calculator className="h-4 w-4" />
          {t("calculate")}
        </Button>
      )}
    </div>
  );
}

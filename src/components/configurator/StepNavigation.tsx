"use client";

import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";

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
    <div className="flex items-stretch justify-between gap-3">
      <button
        onClick={onBack}
        disabled={step === 1}
        className="btn-ghost flex-1 sm:flex-initial"
      >
        <span className="opacity-60">←</span>
        <span>{t("back")}</span>
      </button>

      {step < totalSteps ? (
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="btn-primary flex-1 sm:flex-initial"
        >
          <span>{t("next")}</span>
          <span className="opacity-60">→</span>
        </button>
      ) : (
        <button
          onClick={onCalculate}
          disabled={!canGoNext}
          className="btn-primary flex-1 sm:flex-initial"
        >
          <span>{t("calculate")}</span>
          <span className="opacity-60">→</span>
        </button>
      )}
    </div>
  );
}

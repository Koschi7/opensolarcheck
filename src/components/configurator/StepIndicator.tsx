"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepKeys = ["step1", "step2", "step3", "step4", "step5"] as const;

export function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const t = useTranslations("configurator");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                  step < currentStep &&
                    "border-green-500 bg-green-500 text-white",
                  step === currentStep &&
                    "border-amber-500 bg-amber-500 text-white shadow-lg",
                  step > currentStep &&
                    "border-gray-300 bg-white text-gray-400"
                )}
              >
                {step < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium hidden sm:block",
                  step === currentStep ? "text-amber-600" : "text-gray-500"
                )}
              >
                {t(`${stepKeys[step - 1]}.title`)}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

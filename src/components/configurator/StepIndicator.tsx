"use client";

import { useTranslations } from "next-intl";

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
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <nav aria-label="Steps" className="w-full">
      <ol className="grid grid-cols-5 border-t border-b border-rule">
        {steps.map((step) => {
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <li
              key={step}
              aria-current={isActive ? "step" : undefined}
              className={`relative py-2.5 px-3 md:py-3 md:px-4 ${
                step < totalSteps ? "border-r border-rule" : ""
              } ${isActive ? "bg-secondary/40" : ""}`}
            >
              <div className="flex items-baseline gap-2 md:gap-3">
                <span
                  className={`font-mono-ui text-[11px] ${
                    isActive
                      ? "text-ink"
                      : isDone
                      ? "text-muted-ink"
                      : "text-faint-ink"
                  }`}
                >
                  {String(step).padStart(2, "0")}
                </span>
                <span
                  className={`hidden sm:block text-[12px] md:text-[13px] tracking-tight truncate ${
                    isActive
                      ? "text-ink font-medium"
                      : isDone
                      ? "text-muted-ink"
                      : "text-faint-ink"
                  }`}
                >
                  {t(`${stepKeys[step - 1]}.title`)}
                </span>
              </div>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 bottom-[-1px] h-[2px] w-full bg-ink"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

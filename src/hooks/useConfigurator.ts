"use client";

import { useState, useCallback } from "react";
import type { ConfiguratorInput } from "@/lib/types";
import { CONFIGURATOR_DEFAULTS, MODULE_AREA } from "@/lib/data/defaults";
import { validateStep } from "@/lib/calculations/validation";

const TOTAL_STEPS = 5;

export function useConfigurator() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<ConfiguratorInput>({
    location: { ...CONFIGURATOR_DEFAULTS.location },
    roof: { ...CONFIGURATOR_DEFAULTS.roof },
    system: { ...CONFIGURATOR_DEFAULTS.system },
    consumption: { ...CONFIGURATOR_DEFAULTS.consumption },
    battery: { ...CONFIGURATOR_DEFAULTS.battery },
  });

  const updateLocation = useCallback(
    (updates: Partial<ConfiguratorInput["location"]>) => {
      setInput((prev) => ({
        ...prev,
        location: { ...prev.location, ...updates },
      }));
    },
    []
  );

  const updateRoof = useCallback(
    (updates: Partial<ConfiguratorInput["roof"]>) => {
      setInput((prev) => {
        const newRoof = { ...prev.roof, ...updates };
        // Auto-update module count when area changes
        const suggestedCount = Math.floor(newRoof.area / MODULE_AREA);
        const newSystem = {
          ...prev.system,
          moduleCount: suggestedCount,
          peakPower:
            Math.round(
              (suggestedCount * prev.system.modulePower) / 100
            ) / 10,
        };
        return { ...prev, roof: newRoof, system: newSystem };
      });
    },
    []
  );

  const updateSystem = useCallback(
    (updates: Partial<ConfiguratorInput["system"]>) => {
      setInput((prev) => {
        const newSystem = { ...prev.system, ...updates };
        newSystem.peakPower =
          Math.round((newSystem.moduleCount * newSystem.modulePower) / 100) /
          10;
        return { ...prev, system: newSystem };
      });
    },
    []
  );

  const updateConsumption = useCallback(
    (updates: Partial<ConfiguratorInput["consumption"]>) => {
      setInput((prev) => ({
        ...prev,
        consumption: { ...prev.consumption, ...updates },
      }));
    },
    []
  );

  const updateBattery = useCallback(
    (updates: Partial<ConfiguratorInput["battery"]>) => {
      setInput((prev) => ({
        ...prev,
        battery: { ...prev.battery, ...updates },
      }));
    },
    []
  );

  const getTotalConsumption = useCallback(() => {
    let total = input.consumption.annualConsumption;
    if (input.consumption.hasHeatPump)
      total += input.consumption.heatPumpConsumption;
    if (input.consumption.hasEV) total += input.consumption.evConsumption;
    return total;
  }, [input.consumption]);

  const canGoNext = useCallback(() => {
    return validateStep(step, input).length === 0;
  }, [step, input]);

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS && canGoNext()) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, canGoNext]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const goToStep = useCallback((s: number) => {
    if (s >= 1 && s <= TOTAL_STEPS) setStep(s);
  }, []);

  return {
    step,
    totalSteps: TOTAL_STEPS,
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
    goToStep,
  };
}

"use client";

import { useMemo } from "react";
import type {
  ConfiguratorInput,
  PVGISResponse,
  CalculationResult,
} from "@/lib/types";
import { calculateYield } from "@/lib/calculations/pvYield";
import { calculateSelfConsumption } from "@/lib/calculations/selfConsumption";
import { calculateEconomics } from "@/lib/calculations/economics";
import { calculateCO2Savings } from "@/lib/calculations/co2";

export function useCalculations(
  input: ConfiguratorInput,
  pvgisData: PVGISResponse | null,
  totalConsumption: number
): CalculationResult | null {
  return useMemo(() => {
    if (input.system.peakPower <= 0 || totalConsumption <= 0) return null;

    const yieldResult = calculateYield(
      input.system.peakPower,
      input.roof.shading,
      pvgisData,
      input.location.postalCode
    );

    const selfConsumptionResult = calculateSelfConsumption({
      peakPower_kWp: input.system.peakPower,
      annualYield_kWh: yieldResult.annualYield,
      annualConsumption_kWh: totalConsumption,
      batteryCapacity_kWh: input.battery.capacity,
      hasBattery: input.battery.hasBattery,
    });

    const economicResult = calculateEconomics({
      peakPower_kWp: input.system.peakPower,
      annualYield_kWh: yieldResult.annualYield,
      selfConsumptionRatio: selfConsumptionResult.selfConsumptionRatio,
      batteryCapacity_kWh: input.battery.capacity,
      hasBattery: input.battery.hasBattery,
    });

    const co2Result = calculateCO2Savings(yieldResult.annualYield);

    return {
      yield: yieldResult,
      selfConsumption: selfConsumptionResult,
      economics: economicResult,
      co2: co2Result,
      input,
    };
  }, [input, pvgisData, totalConsumption]);
}

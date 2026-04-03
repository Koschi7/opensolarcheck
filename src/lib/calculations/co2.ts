import type { CO2Result } from "@/lib/types";
import { ECONOMIC_DEFAULTS } from "@/lib/data/defaults";

/**
 * CO2-Emissionsfaktor des deutschen Strommix
 * Quelle: Umweltbundesamt, Stand 2025/2026
 * Trend: sinkend durch steigenden Erneuerbaren-Anteil
 */
export const EMISSION_FACTOR_GERMANY = 0.32; // kg CO2/kWh

/** CO2 pro Flug München-Berlin (eine Richtung) */
export const CO2_PER_FLIGHT = 200; // kg CO2

/** CO2-Aufnahme eines Baums pro Jahr */
export const CO2_PER_TREE_YEAR = 10; // kg CO2/Jahr

/** Anzahl Jahre für die die Einspeisevergütung gilt */
export const FEED_IN_TARIFF_YEARS = 20;

/**
 * Berechnet CO2-Einsparung durch PV-Anlage.
 * Degradation beginnt ab Jahr 1 (konsistent mit economics.ts):
 *   Jahr 1: annualYield * (1 - degradation)^1
 *   Jahr 2: annualYield * (1 - degradation)^2
 */
export function calculateCO2Savings(
  annualYield_kWh: number,
  degradation: number = ECONOMIC_DEFAULTS.degradation,
  lifetime: number = ECONOMIC_DEFAULTS.systemLifetime
): CO2Result {
  const annualSavings_kg = annualYield_kWh * EMISSION_FACTOR_GERMANY;

  let lifetimeSavings_kg = 0;
  for (let t = 1; t <= lifetime; t++) {
    lifetimeSavings_kg +=
      annualYield_kWh * Math.pow(1 - degradation, t) * EMISSION_FACTOR_GERMANY;
  }

  return {
    annualSavings_kg: Math.round(annualSavings_kg),
    lifetimeSavings_tons: Math.round((lifetimeSavings_kg / 1000) * 10) / 10,
    equivalentFlights: Math.round(annualSavings_kg / CO2_PER_FLIGHT),
    equivalentTrees: Math.round(annualSavings_kg / CO2_PER_TREE_YEAR),
  };
}

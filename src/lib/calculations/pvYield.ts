import type { YieldResult, PVGISResponse } from "@/lib/types";
import { SHADING_FACTORS, type RoofInput } from "@/lib/types";
import {
  FALLBACK_SPECIFIC_YIELDS,
  getRegionFromPostalCode,
  ECONOMIC_DEFAULTS,
} from "@/lib/data/defaults";

/**
 * Fallback-Berechnung ohne PVGIS (Offline)
 */
export function calculateYieldFallback(
  peakPower_kWp: number,
  shading: RoofInput["shading"],
  postalCode?: string
): YieldResult {
  const region = postalCode
    ? getRegionFromPostalCode(postalCode)
    : "default";
  const specificYield =
    FALLBACK_SPECIFIC_YIELDS[region] ?? FALLBACK_SPECIFIC_YIELDS["default"];
  const shadingFactor = SHADING_FACTORS[shading];
  const performanceRatio = ECONOMIC_DEFAULTS.performanceRatio;

  const annualYield =
    peakPower_kWp * specificYield * performanceRatio * shadingFactor;

  // Monatliche Verteilung basierend auf typischer Sonneneinstrahlung in Deutschland
  const monthlyDistribution = [
    0.04, 0.05, 0.08, 0.1, 0.12, 0.13, 0.13, 0.12, 0.1, 0.07, 0.04, 0.02,
  ];

  const monthlyYield = monthlyDistribution.map((factor) =>
    Math.round(annualYield * factor)
  );

  return {
    annualYield: Math.round(annualYield),
    monthlyYield,
    specificYield: Math.round(specificYield * performanceRatio * shadingFactor),
  };
}

/**
 * Hauptfunktion: Berechnet Ertrag wahlweise aus PVGIS oder Fallback.
 * PVGIS berücksichtigt bereits: Standort, Neigung, Ausrichtung, Systemverluste (14%).
 * Zusätzlich wird der Verschattungsfaktor angewendet.
 */
export function calculateYield(
  peakPower_kWp: number,
  shading: RoofInput["shading"],
  pvgisData?: PVGISResponse | null,
  postalCode?: string
): YieldResult {
  if (pvgisData) {
    const monthlyFixed = pvgisData.outputs.monthly.fixed;
    if (!monthlyFixed || monthlyFixed.length === 0) {
      return calculateYieldFallback(peakPower_kWp, shading, postalCode);
    }

    const shadingFactor = SHADING_FACTORS[shading];
    const monthly = monthlyFixed.map((m) => m.E_m * shadingFactor);
    const annual = monthly.reduce((sum, m) => sum + m, 0);

    return {
      annualYield: Math.round(annual),
      monthlyYield: monthly.map((m) => Math.round(m)),
      specificYield:
        peakPower_kWp > 0 ? Math.round(annual / peakPower_kWp) : 0,
    };
  }
  return calculateYieldFallback(peakPower_kWp, shading, postalCode);
}

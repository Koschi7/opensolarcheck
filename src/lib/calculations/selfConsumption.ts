import type { SelfConsumptionResult } from "@/lib/types";
import { ECONOMIC_DEFAULTS } from "@/lib/data/defaults";

/**
 * Eigenverbrauchsquote ohne Speicher
 * Modell basierend auf HTW Berlin (Quaschning/Weniger)
 * pvToConsumptionRatio = PV-Leistung [kWp] / Jahresverbrauch [kWh] * 1000
 */
function selfConsumptionRatioWithout(pvToConsumptionRatio: number): number {
  if (pvToConsumptionRatio <= 0) return 1;
  // Polynomfit basierend auf HTW Berlin Daten
  const ratio = -1.1 * pvToConsumptionRatio * pvToConsumptionRatio + 1.1 * pvToConsumptionRatio + 0.12;
  return Math.max(0.05, Math.min(1, ratio));
}

/**
 * Zusätzliche Eigenverbrauchsquote durch Batterie
 * batteryToConsumptionRatio = Speicherkapazität [kWh] / Jahresverbrauch [kWh] * 1000
 */
function batteryBoost(
  batteryToConsumptionRatio: number,
  baseRatio: number,
  batteryEfficiency: number
): number {
  if (batteryToConsumptionRatio <= 0) return 0;
  const boost = 0.7 * batteryToConsumptionRatio * (1 - baseRatio);
  return Math.min(0.3, boost) * batteryEfficiency;
}

/**
 * Berechnet Eigenverbrauch und Autarkiegrad
 */
export function calculateSelfConsumption(params: {
  peakPower_kWp: number;
  annualYield_kWh: number;
  annualConsumption_kWh: number;
  batteryCapacity_kWh: number;
  hasBattery: boolean;
}): SelfConsumptionResult {
  const {
    peakPower_kWp,
    annualYield_kWh,
    annualConsumption_kWh,
    batteryCapacity_kWh,
    hasBattery,
  } = params;

  if (annualConsumption_kWh <= 0 || annualYield_kWh <= 0) {
    return {
      selfConsumptionRatio: 0,
      selfConsumptionKWh: 0,
      feedInKWh: annualYield_kWh,
      autarkyRate: 0,
      gridConsumptionKWh: annualConsumption_kWh,
    };
  }

  // Normiertes Verhältnis PV-Leistung zu Verbrauch
  const pvToConsumptionRatio = (peakPower_kWp / annualConsumption_kWh) * 1000;

  // Eigenverbrauchsquote ohne Speicher
  let selfConsumptionRatio = selfConsumptionRatioWithout(pvToConsumptionRatio);

  // Mit Speicher: zusätzlicher Eigenverbrauch
  if (hasBattery && batteryCapacity_kWh > 0) {
    const batteryToConsumptionRatio = (batteryCapacity_kWh / annualConsumption_kWh) * 1000;
    const boost = batteryBoost(
      batteryToConsumptionRatio,
      selfConsumptionRatio,
      ECONOMIC_DEFAULTS.batteryEfficiency
    );
    selfConsumptionRatio = Math.min(1, selfConsumptionRatio + boost);
  }

  const selfConsumptionKWh = annualYield_kWh * selfConsumptionRatio;
  const feedInKWh = annualYield_kWh - selfConsumptionKWh;
  const autarkyRate = Math.min(1, selfConsumptionKWh / annualConsumption_kWh);
  const gridConsumptionKWh = annualConsumption_kWh - selfConsumptionKWh;

  return {
    selfConsumptionRatio: Math.round(selfConsumptionRatio * 1000) / 1000,
    selfConsumptionKWh: Math.round(selfConsumptionKWh),
    feedInKWh: Math.round(feedInKWh),
    autarkyRate: Math.round(autarkyRate * 1000) / 1000,
    gridConsumptionKWh: Math.round(Math.max(0, gridConsumptionKWh)),
  };
}

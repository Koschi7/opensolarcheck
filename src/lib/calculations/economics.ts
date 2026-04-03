import type { EconomicResult, YearlyEconomicData } from "@/lib/types";
import { ELECTRICITY_PRICE, INVESTMENT_COSTS, getFeedInTariff } from "@/lib/data/tariffs";
import { ECONOMIC_DEFAULTS } from "@/lib/data/defaults";
import { FEED_IN_TARIFF_YEARS } from "./co2";

export interface EconomicParams {
  peakPower_kWp: number;
  annualYield_kWh: number;
  selfConsumptionRatio: number;
  batteryCapacity_kWh: number;
  hasBattery: boolean;
  investmentCostPerKWp?: number;
  batteryCostPerKWh?: number;
  electricityPrice?: number;
  electricityPriceIncrease?: number;
  degradation?: number;
  maintenanceCostRatio?: number;
  discountRate?: number;
  systemLifetime?: number;
}

/**
 * Berechnet Wirtschaftlichkeit über die Anlagenlebensdauer
 */
export function calculateEconomics(params: EconomicParams): EconomicResult {
  const {
    peakPower_kWp,
    annualYield_kWh,
    selfConsumptionRatio,
    batteryCapacity_kWh,
    hasBattery,
    investmentCostPerKWp = INVESTMENT_COSTS.perKWp.default,
    batteryCostPerKWh = INVESTMENT_COSTS.batteryPerKWh.default,
    electricityPrice = ELECTRICITY_PRICE,
    electricityPriceIncrease = ECONOMIC_DEFAULTS.electricityPriceIncrease,
    degradation = ECONOMIC_DEFAULTS.degradation,
    maintenanceCostRatio = ECONOMIC_DEFAULTS.maintenanceCostRatio,
    discountRate = ECONOMIC_DEFAULTS.discountRate,
    systemLifetime = ECONOMIC_DEFAULTS.systemLifetime,
  } = params;

  const pvInvestment = peakPower_kWp * investmentCostPerKWp;
  const batteryInvestment = hasBattery
    ? batteryCapacity_kWh * batteryCostPerKWh
    : 0;
  const totalInvestment = pvInvestment + batteryInvestment;
  const annualMaintenanceCost = pvInvestment * maintenanceCostRatio;
  const feedInTariff = getFeedInTariff(peakPower_kWp);

  const yearlyData: YearlyEconomicData[] = [];
  let cumulativeSavings = -totalInvestment;
  let paybackYears = systemLifetime; // Default falls nie erreicht
  let paybackFound = false;
  let npv = -totalInvestment;

  for (let t = 1; t <= systemLifetime; t++) {
    const yearYield = annualYield_kWh * Math.pow(1 - degradation, t);
    const yearElectricityPrice =
      electricityPrice * Math.pow(1 + electricityPriceIncrease, t);

    const yearFeedInTariff = t <= FEED_IN_TARIFF_YEARS ? feedInTariff : 0;

    const selfConsumptionSavings =
      yearYield * selfConsumptionRatio * yearElectricityPrice;
    const feedInRevenue =
      yearYield * (1 - selfConsumptionRatio) * yearFeedInTariff;
    const savings =
      selfConsumptionSavings + feedInRevenue - annualMaintenanceCost;

    cumulativeSavings += savings;
    npv += savings / Math.pow(1 + discountRate, t);

    if (!paybackFound && cumulativeSavings >= 0) {
      // Lineare Interpolation für genaueren Break-Even
      const prevCumulative = cumulativeSavings - savings;
      paybackYears =
        t - 1 + Math.abs(prevCumulative) / savings;
      paybackFound = true;
    }

    yearlyData.push({
      year: t,
      yield: Math.round(yearYield),
      savings: Math.round(savings),
      cumulativeSavings: Math.round(cumulativeSavings),
      electricityPrice: Math.round(yearElectricityPrice * 10000) / 10000,
      maintenanceCost: Math.round(annualMaintenanceCost),
    });
  }

  const totalSavings = cumulativeSavings + totalInvestment;
  const roi = totalInvestment > 0 ? (totalSavings / totalInvestment - 1) * 100 : 0;

  return {
    totalInvestment: Math.round(totalInvestment),
    annualSavings: yearlyData.length > 0 ? yearlyData[0].savings : 0,
    paybackYears: Math.round(paybackYears * 10) / 10,
    totalSavings25Years: Math.round(totalSavings),
    npv: Math.round(npv),
    roi: Math.round(roi * 10) / 10,
    yearlyData,
  };
}

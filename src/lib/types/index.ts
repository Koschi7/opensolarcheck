/** Standort-Eingabe */
export interface LocationInput {
  lat: number;
  lon: number;
  postalCode?: string;
  city?: string;
}

/** Dach-Eingabe */
export interface RoofInput {
  tilt: number; // Dachneigung in Grad (0-60)
  azimuth: number; // Ausrichtung in Grad (-180 bis 180, 0 = Süd)
  area: number; // Verfügbare Fläche in m²
  shading: "none" | "low" | "medium" | "high";
}

/** PV-Anlage-Eingabe */
export interface SystemInput {
  moduleType: "monocrystalline" | "polycrystalline" | "thinfilm";
  modulePower: number; // Watt pro Panel
  moduleCount: number;
  peakPower: number; // kWp (berechnet)
}

/** Verbrauch-Eingabe */
export interface ConsumptionInput {
  annualConsumption: number; // kWh/Jahr
  hasHeatPump: boolean;
  hasEV: boolean;
  heatPumpConsumption: number; // kWh/Jahr (3000-5000)
  evConsumption: number; // kWh/Jahr (2000-3000)
}

/** Batterie-Eingabe */
export interface BatteryInput {
  hasBattery: boolean;
  capacity: number; // kWh
}

/** Gesamte Konfigurator-Eingabe */
export interface ConfiguratorInput {
  location: LocationInput;
  roof: RoofInput;
  system: SystemInput;
  consumption: ConsumptionInput;
  battery: BatteryInput;
}

/** Verschattungsfaktor */
export const SHADING_FACTORS: Record<RoofInput["shading"], number> = {
  none: 1.0,
  low: 0.95,
  medium: 0.85,
  high: 0.7,
};

/** Modultyp-Wirkungsgrade */
export const MODULE_EFFICIENCY: Record<SystemInput["moduleType"], number> = {
  monocrystalline: 0.21,
  polycrystalline: 0.17,
  thinfilm: 0.13,
};

/** PVGIS API Response */
export interface PVGISMonthlyData {
  month: number;
  E_d: number; // Täglicher Durchschnittsertrag kWh
  E_m: number; // Monatlicher Ertrag kWh
  "H(i)_d": number; // Tägliche Einstrahlung kWh/m²
  "H(i)_m": number; // Monatliche Einstrahlung kWh/m²
  SD_m: number; // Standardabweichung kWh
}

export interface PVGISTotals {
  E_y: number; // Jahresertrag kWh
  E_d: number; // Täglicher Durchschnitt kWh
  "H(i)_y": number; // Jährliche Einstrahlung kWh/m²
}

export interface PVGISResponse {
  outputs: {
    monthly: {
      fixed: PVGISMonthlyData[];
    };
    totals: {
      fixed: PVGISTotals;
    };
  };
}

/** Ergebnis-Typen */
export interface YieldResult {
  annualYield: number; // kWh/Jahr
  monthlyYield: number[]; // 12 Monate
  specificYield: number; // kWh/kWp
}

export interface SelfConsumptionResult {
  selfConsumptionRatio: number; // 0-1
  selfConsumptionKWh: number;
  feedInKWh: number;
  autarkyRate: number; // 0-1
  gridConsumptionKWh: number;
}

export interface EconomicResult {
  totalInvestment: number;
  annualSavings: number; // im ersten Jahr
  paybackYears: number;
  totalSavings25Years: number;
  npv: number;
  roi: number; // in %
  yearlyData: YearlyEconomicData[];
}

export interface YearlyEconomicData {
  year: number;
  yield: number;
  savings: number;
  cumulativeSavings: number;
  electricityPrice: number;
  maintenanceCost: number;
}

export interface CO2Result {
  annualSavings_kg: number;
  lifetimeSavings_tons: number;
  equivalentFlights: number;
  equivalentTrees: number;
}

/** Gesamtergebnis */
export interface CalculationResult {
  yield: YieldResult;
  selfConsumption: SelfConsumptionResult;
  economics: EconomicResult;
  co2: CO2Result;
  input: ConfiguratorInput;
}

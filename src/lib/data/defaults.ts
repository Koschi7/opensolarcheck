/**
 * Regionale Fallback-Werte für spezifischen Ertrag (kWh/kWp/Jahr)
 * Verwendet wenn PVGIS nicht erreichbar ist
 */
export const FALLBACK_SPECIFIC_YIELDS: Record<string, number> = {
  nord: 880,
  mitte: 950,
  sued: 1050,
  default: 950,
};

/** PLZ → Region Zuordnung */
export function getRegionFromPostalCode(plz: string): string {
  if (!plz || plz.length < 1) return "default";
  const prefix = parseInt(plz.substring(0, 1), 10);
  if (Number.isNaN(prefix)) return "default";
  if (prefix === 2) return "nord";
  if ([0, 1, 3, 4, 5].includes(prefix)) return "mitte";
  if ([6, 7, 8, 9].includes(prefix)) return "sued";
  return "default";
}

/** Default-Werte für den Konfigurator */
export const CONFIGURATOR_DEFAULTS = {
  location: {
    lat: 48.14,
    lon: 11.58, // München
    postalCode: "",
    city: "",
  },
  roof: {
    tilt: 35,
    azimuth: 0, // Süd
    area: 40,
    shading: "none" as const,
  },
  system: {
    moduleType: "monocrystalline" as const,
    modulePower: 420,
    moduleCount: 20,
    peakPower: 8.4,
  },
  consumption: {
    annualConsumption: 4000,
    hasHeatPump: false,
    hasEV: false,
    heatPumpConsumption: 4000,
    evConsumption: 2500,
  },
  battery: {
    hasBattery: false,
    capacity: 10,
  },
};

/** Wirtschaftlichkeits-Annahmen */
export const ECONOMIC_DEFAULTS = {
  electricityPriceIncrease: 0.03, // 3% p.a.
  degradation: 0.005, // 0.5% p.a.
  maintenanceCostRatio: 0.015, // 1.5% der Investition p.a.
  discountRate: 0.03, // 3%
  systemLifetime: 25, // Jahre
  performanceRatio: 0.86,
  batteryEfficiency: 0.9,
};

/** Fläche pro Modul in m² */
export const MODULE_AREA = 1.7;

/** Verbrauch nach Personenzahl kWh/Jahr */
export const CONSUMPTION_BY_PERSONS: Record<string, number> = {
  "1": 1500,
  "2": 2500,
  "3": 3500,
  "4": 4500,
  "5": 5500,
};

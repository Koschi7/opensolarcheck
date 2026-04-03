/**
 * Aktuelle Einspeisevergütung und Strompreise
 * Quelle: Bundesnetzagentur / EEG-Vergütungssätze
 * Letztes Update: 2026-04-01
 */

export const FEED_IN_TARIFFS = {
  /** Teileinspeisung (Überschusseinspeisung) - typisch für Eigenheime */
  partial: {
    upTo10kWp: 0.055, // €/kWh (5,50 ct/kWh)
    from10to40kWp: 0.0448, // €/kWh (4,48 ct/kWh)
  },
  /** Volleinspeisung */
  full: {
    upTo10kWp: 0.1035, // €/kWh (10,35 ct/kWh)
    from10to40kWp: 0.0886, // €/kWh (8,86 ct/kWh)
  },
  validFrom: "2026-02-01",
  validUntil: "2026-07-31",
  nextDegression: "2026-08-01",
} as const;

/** Durchschnittlicher Haushaltsstrompreis €/kWh */
export const ELECTRICITY_PRICE = 0.3436;

/**
 * Investitionskosten Richtwerte (inkl. Montage, Wechselrichter, Zähler)
 * Quelle: Fraunhofer ISE "Aktuelle Fakten zur Photovoltaik"
 * Stand: 2025/2026
 */
export const INVESTMENT_COSTS = {
  perKWp: { min: 1000, max: 1500, default: 1200 }, // €/kWp
  batteryPerKWh: { min: 600, max: 1000, default: 800 }, // €/kWh
} as const;

/** Berechnet gewichtete Einspeisevergütung basierend auf Anlagengröße */
export function getFeedInTariff(peakPower_kWp: number): number {
  if (peakPower_kWp <= 10) {
    return FEED_IN_TARIFFS.partial.upTo10kWp;
  }
  // Anteilig: erste 10 kWp zum höheren, Rest zum niedrigeren Satz
  const share10 = 10 / peakPower_kWp;
  const shareRest = 1 - share10;
  return (
    share10 * FEED_IN_TARIFFS.partial.upTo10kWp +
    shareRest * FEED_IN_TARIFFS.partial.from10to40kWp
  );
}

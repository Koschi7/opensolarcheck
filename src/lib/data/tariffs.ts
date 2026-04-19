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
    from40to100kWp: 0.0366, // €/kWh (3,66 ct/kWh)
  },
  /** Volleinspeisung */
  full: {
    upTo10kWp: 0.1035, // €/kWh (10,35 ct/kWh)
    from10to40kWp: 0.0886, // €/kWh (8,86 ct/kWh)
    from40to100kWp: 0.0722, // €/kWh (7,22 ct/kWh)
  },
  /** Ab dieser Anlagengröße greift die verpflichtende Direktvermarktung */
  directMarketingThreshold_kWp: 100,
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

/** Berechnet gewichtete Einspeisevergütung (Teileinspeisung) basierend auf Anlagengröße */
export function getFeedInTariff(peakPower_kWp: number): number {
  const p = Math.max(0, peakPower_kWp);
  const { upTo10kWp, from10to40kWp, from40to100kWp } = FEED_IN_TARIFFS.partial;
  if (p === 0) return upTo10kWp;
  if (p <= 10) return upTo10kWp;
  if (p <= 40) {
    const share10 = 10 / p;
    return share10 * upTo10kWp + (1 - share10) * from10to40kWp;
  }
  // Ab 100 kWp greift die Direktvermarktung; wir kappen die Mischvergütung bei 100 kWp.
  const size = Math.min(p, FEED_IN_TARIFFS.directMarketingThreshold_kWp);
  const share10 = 10 / size;
  const share40 = 30 / size; // 10..40 kWp
  const shareRest = Math.max(0, (size - 40) / size);
  return (
    share10 * upTo10kWp +
    share40 * from10to40kWp +
    shareRest * from40to100kWp
  );
}

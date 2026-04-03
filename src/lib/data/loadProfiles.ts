/**
 * BDEW H0 Standardlastprofil - vereinfachte monatliche Verteilung
 * Quelle: BDEW Standardlastprofile Strom
 *
 * Werte: Anteil des Jahresverbrauchs pro Monat (Summe = 1.0)
 * Berücksichtigt saisonale Variation (Winter höher, Sommer niedriger)
 */
export const MONTHLY_LOAD_DISTRIBUTION = [
  0.105, // Januar - Winter, hoher Verbrauch
  0.095, // Februar
  0.09, // März - Übergang
  0.08, // April
  0.075, // Mai
  0.065, // Juni - Sommer, niedriger Verbrauch
  0.06, // Juli
  0.06, // August
  0.07, // September - Übergang
  0.085, // Oktober
  0.1, // November - Winter
  0.115, // Dezember - höchster Verbrauch
] as const;

/**
 * Berechnet monatlichen Verbrauch aus Jahresverbrauch
 */
export function getMonthlyConsumption(annualConsumption: number): number[] {
  return MONTHLY_LOAD_DISTRIBUTION.map(
    (factor) => annualConsumption * factor
  );
}

/**
 * Vereinfachte stündliche Verteilung für einen typischen Tag
 * Normiert auf 1.0 (Summe = 24 relative Werte)
 * Wird für Eigenverbrauchsabschätzung verwendet
 */
export const HOURLY_LOAD_PROFILE = [
  0.6, 0.5, 0.45, 0.4, 0.45, 0.6, // 0-5h: Nacht
  0.9, 1.2, 1.1, 1.0, 0.95, 1.0, // 6-11h: Morgen
  1.15, 1.1, 1.0, 1.05, 1.15, 1.3, // 12-17h: Nachmittag
  1.5, 1.6, 1.5, 1.3, 1.0, 0.75, // 18-23h: Abend
] as const;

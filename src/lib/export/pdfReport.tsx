import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { CalculationResult } from "@/lib/types";
import { getMonthlyConsumption } from "@/lib/data/loadProfiles";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  date: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
  },
  label: {
    color: "#374151",
  },
  value: {
    fontWeight: "bold",
    color: "#111827",
  },
  highlight: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D97706",
  },
  highlightLabel: {
    fontSize: 10,
    color: "#92400E",
    marginTop: 4,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  disclaimerText: {
    fontSize: 8,
    color: "#991B1B",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 15,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
  },
  pageContent: {
    flex: 1,
  },
});

const PDF_LABELS = {
  de: {
    subtitle: "Ihre PV-Analyse",
    createdAt: "Erstellt am",
    annualYieldUnit: "kWh/Jahr",
    expectedYield: "Erwarteter Jahresertrag",
    inputs: "Ihre Eingaben",
    location: "Standort",
    tiltAzimuth: "Dachneigung / Ausrichtung",
    systemPower: "Anlagenleistung",
    modules: "Module",
    annualConsumption: "Jahresverbrauch",
    battery: "Batteriespeicher",
    results: "Ergebnisse",
    annualYield: "Jahresertrag",
    selfConsumptionRatio: "Eigenverbrauchsquote",
    autarkyRate: "Autarkiegrad",
    paybackTime: "Amortisationszeit",
    years: "Jahre",
    totalInvestment: "Gesamtinvestition",
    annualSavings: "Jährliche Ersparnis",
    co2Annual: "CO2-Einsparung (jährlich)",
    monthlyYields: "Monatliche Erträge",
    month: "Monat",
    pvYield: "PV-Ertrag (kWh)",
    consumption: "Verbrauch (kWh)",
    disclaimer:
      "Diese Berechnung liefert grobe Richtwerte auf Basis Ihrer Eingaben und öffentlich verfügbarer Wetterdaten (PVGIS). Sie ersetzt keine professionelle Planung vor Ort.",
    footer: "Erstellt mit OpenSolarCheck – opensolarcheck.de – Open Source",
    financialTitle: "Wirtschaftlichkeit über 25 Jahre",
    year: "Jahr",
    yieldCol: "Ertrag (kWh)",
    savingsCol: "Ersparnis (€)",
    cumulativeCol: "Kumuliert (€)",
    priceCol: "Strompreis (€/kWh)",
  },
  en: {
    subtitle: "Your PV Analysis",
    createdAt: "Created on",
    annualYieldUnit: "kWh/year",
    expectedYield: "Expected annual yield",
    inputs: "Your inputs",
    location: "Location",
    tiltAzimuth: "Roof tilt / orientation",
    systemPower: "System power",
    modules: "modules",
    annualConsumption: "Annual consumption",
    battery: "Battery storage",
    results: "Results",
    annualYield: "Annual yield",
    selfConsumptionRatio: "Self-consumption ratio",
    autarkyRate: "Self-sufficiency rate",
    paybackTime: "Payback period",
    years: "years",
    totalInvestment: "Total investment",
    annualSavings: "Annual savings",
    co2Annual: "CO2 savings (annual)",
    monthlyYields: "Monthly yields",
    month: "Month",
    pvYield: "PV yield (kWh)",
    consumption: "Consumption (kWh)",
    disclaimer:
      "This calculation provides rough estimates based on your inputs and publicly available weather data (PVGIS). It does not replace professional on-site planning.",
    footer: "Created with OpenSolarCheck – opensolarcheck.de – Open Source",
    financialTitle: "Financial analysis over 25 years",
    year: "Year",
    yieldCol: "Yield (kWh)",
    savingsCol: "Savings (€)",
    cumulativeCol: "Cumulative (€)",
    priceCol: "Electricity price (€/kWh)",
  },
} as const;

function getMonthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i, 1).toLocaleString(locale, { month: "short" })
  );
}

function PDFReport({ result, locale }: { result: CalculationResult; locale: string }) {
  const l = PDF_LABELS[locale as keyof typeof PDF_LABELS] ?? PDF_LABELS.de;
  const months = getMonthNames(locale);
  const fmt = (n: number) => n.toLocaleString(locale);

  const totalConsumption =
    result.input.consumption.annualConsumption +
    (result.input.consumption.hasHeatPump
      ? result.input.consumption.heatPumpConsumption
      : 0) +
    (result.input.consumption.hasEV
      ? result.input.consumption.evConsumption
      : 0);

  const monthlyConsumption = getMonthlyConsumption(totalConsumption);

  return (
    <Document>
      {/* Page 1: Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          <View style={styles.header}>
            <Text style={styles.title}>OpenSolarCheck</Text>
            <Text style={styles.subtitle}>{l.subtitle}</Text>
            <Text style={styles.date}>
              {l.createdAt} {new Date().toLocaleDateString(locale)}
            </Text>
          </View>

          {/* Highlight */}
          <View style={styles.highlight}>
            <Text style={styles.highlightValue}>
              {fmt(result.yield.annualYield)} {l.annualYieldUnit}
            </Text>
            <Text style={styles.highlightLabel}>
              {l.expectedYield}
            </Text>
          </View>

          {/* Input Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.inputs}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{l.location}</Text>
              <Text style={styles.value}>
                {result.input.location.city || `${result.input.location.lat}°, ${result.input.location.lon}°`}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.tiltAzimuth}</Text>
              <Text style={styles.value}>
                {result.input.roof.tilt}° / {result.input.roof.azimuth}°
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.systemPower}</Text>
              <Text style={styles.value}>
                {result.input.system.peakPower} kWp ({result.input.system.moduleCount} {l.modules})
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.annualConsumption}</Text>
              <Text style={styles.value}>
                {fmt(totalConsumption)} kWh
              </Text>
            </View>
            {result.input.battery.hasBattery && (
              <View style={styles.row}>
                <Text style={styles.label}>{l.battery}</Text>
                <Text style={styles.value}>
                  {result.input.battery.capacity} kWh
                </Text>
              </View>
            )}
          </View>

          {/* Key Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.results}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{l.annualYield}</Text>
              <Text style={styles.value}>
                {fmt(result.yield.annualYield)} kWh
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.selfConsumptionRatio}</Text>
              <Text style={styles.value}>
                {Math.round(result.selfConsumption.selfConsumptionRatio * 100)}%
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.autarkyRate}</Text>
              <Text style={styles.value}>
                {Math.round(result.selfConsumption.autarkyRate * 100)}%
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.paybackTime}</Text>
              <Text style={styles.value}>
                {result.economics.paybackYears} {l.years}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.totalInvestment}</Text>
              <Text style={styles.value}>
                {fmt(result.economics.totalInvestment)} €
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.annualSavings}</Text>
              <Text style={styles.value}>
                {fmt(result.economics.annualSavings)} €
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.co2Annual}</Text>
              <Text style={styles.value}>
                {fmt(result.co2.annualSavings_kg)} kg
              </Text>
            </View>
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>{l.disclaimer}</Text>
          </View>
        </View>

        <Text style={styles.footer}>{l.footer}</Text>
      </Page>

      {/* Page 2: Monthly yields + Financial Table */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          {/* Monthly Yield Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.monthlyYields}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>{l.month}</Text>
                <Text style={styles.tableCell}>{l.pvYield}</Text>
                <Text style={styles.tableCell}>{l.consumption}</Text>
              </View>
              {months.map((month, i) => (
                <View key={month} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{month}</Text>
                  <Text style={styles.tableCell}>
                    {fmt(result.yield.monthlyYield[i] ?? 0)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {fmt(Math.round(monthlyConsumption[i]))}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.financialTitle}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>{l.year}</Text>
                <Text style={styles.tableCell}>{l.yieldCol}</Text>
                <Text style={styles.tableCell}>{l.savingsCol}</Text>
                <Text style={styles.tableCell}>{l.cumulativeCol}</Text>
                <Text style={styles.tableCell}>{l.priceCol}</Text>
              </View>
              {result.economics.yearlyData.map((d) => (
                <View key={d.year} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{d.year}</Text>
                  <Text style={styles.tableCell}>
                    {fmt(d.yield)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {fmt(d.savings)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {fmt(d.cumulativeSavings)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {d.electricityPrice.toFixed(4)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.footer}>{l.footer}</Text>
      </Page>
    </Document>
  );
}

export async function generatePDFReport(result: CalculationResult, locale: string = "de") {
  const blob = await pdf(<PDFReport result={result} locale={locale} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `opensolarcheck-analyse-${new Date().toISOString().slice(0, 10)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

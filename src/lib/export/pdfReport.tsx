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

const INK = "#1a1a1a";
const MUTED = "#545454";
const FAINT = "#808080";
const RULE = "#d9d9d9";
const RULE_STRONG = "#b5b5b5";
const SOLAR = "#c7580f";
const PAPER = "#ffffff";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: INK,
    backgroundColor: PAPER,
    display: "flex",
    flexDirection: "column",
  },
  masthead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: INK,
    marginBottom: 24,
  },
  mastheadLeft: {
    flexDirection: "column",
  },
  wordmark: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    color: INK,
  },
  issueMeta: {
    fontSize: 8,
    letterSpacing: 0.8,
    color: FAINT,
    marginTop: 3,
    fontFamily: "Courier",
  },
  mastheadRight: {
    fontSize: 8,
    letterSpacing: 0.8,
    color: FAINT,
    fontFamily: "Courier",
    textAlign: "right",
  },
  title: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: INK,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 10.5,
    color: MUTED,
    marginBottom: 18,
  },
  figureBlock: {
    borderTopWidth: 1,
    borderTopColor: INK,
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    paddingTop: 10,
    paddingBottom: 14,
    marginBottom: 20,
  },
  figureCaption: {
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: FAINT,
    fontFamily: "Courier",
    marginBottom: 6,
  },
  figureValue: {
    fontSize: 38,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: -0.8,
  },
  figureUnit: {
    fontSize: 10,
    color: MUTED,
    marginTop: 4,
    fontFamily: "Courier",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: INK,
    letterSpacing: 1.4,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: INK,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4.5,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
  },
  label: {
    color: MUTED,
    fontSize: 9.5,
  },
  value: {
    color: INK,
    fontFamily: "Courier",
    fontSize: 9.5,
  },
  valueAccent: {
    color: SOLAR,
    fontFamily: "Courier",
    fontSize: 9.5,
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: INK,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE_STRONG,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    color: INK,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    fontFamily: "Courier",
    color: INK,
  },
  tableCellLabel: {
    flex: 1,
    fontSize: 8,
    color: MUTED,
  },
  disclaimer: {
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: RULE_STRONG,
  },
  disclaimerText: {
    fontSize: 7.5,
    color: MUTED,
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: RULE,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    fontFamily: "Courier",
    letterSpacing: 0.6,
    color: FAINT,
  },
  pageContent: {
    flex: 1,
  },
  accentRule: {
    height: 2,
    backgroundColor: SOLAR,
    width: 36,
    marginBottom: 10,
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
    paybackNever: "in 25 Jahren nicht erreicht",
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
    paybackNever: "not reached within 25 years",
  },
} as const;

function getMonthNames(locale: string): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i, 1).toLocaleString(locale, { month: "short" })
  );
}

export function PDFReport({ result, locale }: { result: CalculationResult; locale: string }) {
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

  const createdOn = new Date().toLocaleDateString(locale);
  const issueLabel = locale === "de" ? "AUSGABE" : "ISSUE";
  const pageLabel = locale === "de" ? "SEITE" : "PAGE";

  return (
    <Document>
      {/* Page 1: Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          <View style={styles.masthead}>
            <View style={styles.mastheadLeft}>
              <Text style={styles.wordmark}>OPENSOLARCHECK</Text>
              <Text style={styles.issueMeta}>
                {issueLabel} · {createdOn.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.mastheadRight}>{pageLabel} 01 / 02</Text>
          </View>

          <View style={styles.accentRule} />
          <Text style={styles.title}>{l.subtitle}</Text>
          <Text style={styles.subtitle}>
            {result.input.location.city || `${result.input.location.lat}°, ${result.input.location.lon}°`}
            {" · "}
            {result.input.system.peakPower} kWp
          </Text>

          <View style={styles.figureBlock}>
            <Text style={styles.figureCaption}>{l.expectedYield.toUpperCase()}</Text>
            <Text style={styles.figureValue}>
              {fmt(result.yield.annualYield)}
            </Text>
            <Text style={styles.figureUnit}>{l.annualYieldUnit}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.inputs.toUpperCase()}</Text>
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
                {result.input.system.peakPower} kWp · {result.input.system.moduleCount} {l.modules}
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.results.toUpperCase()}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{l.annualYield}</Text>
              <Text style={styles.value}>
                {fmt(result.yield.annualYield)} kWh
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.selfConsumptionRatio}</Text>
              <Text style={styles.value}>
                {Math.round(result.selfConsumption.selfConsumptionRatio * 100)} %
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.autarkyRate}</Text>
              <Text style={styles.value}>
                {Math.round(result.selfConsumption.autarkyRate * 100)} %
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{l.paybackTime}</Text>
              <Text style={styles.valueAccent}>
                {result.economics.paybackYears === null
                  ? l.paybackNever
                  : `${result.economics.paybackYears} ${l.years}`}
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

        <View style={styles.footer}>
          <Text>{l.footer}</Text>
          <Text>{pageLabel} 01</Text>
        </View>
      </Page>

      {/* Page 2: Monthly yields + Financial Table */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContent}>
          <View style={styles.masthead}>
            <View style={styles.mastheadLeft}>
              <Text style={styles.wordmark}>OPENSOLARCHECK</Text>
              <Text style={styles.issueMeta}>
                {issueLabel} · {createdOn.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.mastheadRight}>{pageLabel} 02 / 02</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l.monthlyYields.toUpperCase()}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>{l.month}</Text>
                <Text style={styles.tableHeaderCell}>{l.pvYield}</Text>
                <Text style={styles.tableHeaderCell}>{l.consumption}</Text>
              </View>
              {months.map((month, i) => (
                <View key={month} style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>{month}</Text>
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
            <Text style={styles.sectionTitle}>{l.financialTitle.toUpperCase()}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>{l.year}</Text>
                <Text style={styles.tableHeaderCell}>{l.yieldCol}</Text>
                <Text style={styles.tableHeaderCell}>{l.savingsCol}</Text>
                <Text style={styles.tableHeaderCell}>{l.cumulativeCol}</Text>
                <Text style={styles.tableHeaderCell}>{l.priceCol}</Text>
              </View>
              {result.economics.yearlyData.map((d) => (
                <View key={d.year} style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>{d.year}</Text>
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

        <View style={styles.footer}>
          <Text>{l.footer}</Text>
          <Text>{pageLabel} 02</Text>
        </View>
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

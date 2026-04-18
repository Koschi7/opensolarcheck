# OpenSolarCheck – Dein unabhängiger PV-Rechner

[English version](README.en.md)

> Berechne Ertrag, Kosten und Amortisation deiner Solaranlage – kostenlos, ohne Anmeldung, ohne Datenabgabe.

**[opensolarcheck.de](https://opensolarcheck.de)**

## Features

- Mehrstufiger PV-Konfigurator (5 Schritte: Standort, Dach, Anlage, Verbrauch, Speicher)
- Ertragsberechnung auf Basis von PVGIS-Satellitendaten (EU Joint Research Centre)
- Eigenverbrauchs- und Autarkiegrad-Berechnung (HTW Berlin Modell)
- Wirtschaftlichkeitsanalyse über 25 Jahre (NPV, ROI, Amortisation)
- CO2-Einsparungsberechnung
- Redaktionelles Daten-Journalismus-Design: 25-Jahres-Ersparniskurve auf der Landing, technische Schemata im Konfigurator, umgekehrte-Pyramide-Ergebnisseite mit NPV-Hero, Figures und Tabelle
- PDF-Export der Ergebnisse
- Komplett clientseitig – keine Daten verlassen deinen Browser
- Deutsch und Englisch (i18n)
- Datenschutzfreundliches Analytics (Umami, optional)
- SEO-optimiert mit strukturierten Daten (JSON-LD)
- Impressum und Datenschutzerklärung nach deutschem Recht (DDG/DSGVO)

## Tech-Stack

- Next.js 16 (App Router, Static Export)
- TypeScript (strict)
- Tailwind CSS 4 + shadcn/ui
- Inter + IBM Plex Mono (via next/font)
- SVG-Charts handgebaut (keine Recharts-Defaults)
- next-intl (i18n)
- @react-pdf/renderer (PDF-Export)
- satori + resvg (OG-Image-Generierung)
- Vitest + React Testing Library

## Schnellstart

```bash
git clone https://github.com/Koschi7/opensolarcheck.git
cd opensolarcheck
pnpm install
cp .env.example .env  # Impressum-Daten anpassen!
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Umgebungsvariablen

| Variable | Pflicht | Beschreibung |
|---|---|---|
| `NEXT_PUBLIC_IMPRINT_NAME` | Ja | Name für Impressum (§ 5 DDG) |
| `NEXT_PUBLIC_IMPRINT_STREET` | Ja | Straße für Impressum |
| `NEXT_PUBLIC_IMPRINT_CITY` | Ja | PLZ + Ort für Impressum |
| `NEXT_PUBLIC_IMPRINT_EMAIL` | Ja | E-Mail für Impressum |
| `NEXT_PUBLIC_UMAMI_ENABLED` | Nein | Analytics aktivieren (`true`/`false`) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Nein | Umami Website-ID |
| `NEXT_PUBLIC_UMAMI_URL` | Nein | Umami Server-URL |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Nein | Google Search Console |

### Build

```bash
pnpm build
```

Erzeugt statische Dateien im `out/`-Verzeichnis. OG-Images werden automatisch vor dem Build generiert.

### Tests

```bash
pnpm test:run
```

## Berechnungsmethodik

Die Berechnungen basieren auf:

- **PVGIS** (EU Joint Research Centre) – Sonneneinstrahlung und PV-Ertrag
- **HTW Berlin Modell** (Quaschning/Weniger) – Eigenverbrauchsquote
- **BDEW H0 Standardlastprofil** – Verbrauchsverteilung
- **EEG Einspeisevergütung** – Aktuelle Tarife
- **Fraunhofer ISE** – Investitionskosten (€/kWp)
- **Umweltbundesamt** – CO2-Emissionsfaktoren

Details unter [/methodik](https://opensolarcheck.de/de/methodik) in der App.

## Deployment

Die App ist ein statischer Export und kann auf jedem Webserver gehostet werden (Nginx, Apache, Caddy, etc.).

```bash
pnpm build
# out/ Verzeichnis auf den Server kopieren
```

### Umami Analytics (optional)

Für self-hosted Analytics siehe `docker-compose.umami.yml`.

## Mithelfen

Beiträge sind willkommen! Siehe [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Lizenz

MIT – siehe [LICENSE](LICENSE)

## Haftungsausschluss

Diese Berechnung liefert grobe Richtwerte auf Basis öffentlich verfügbarer Wetterdaten (PVGIS). Sie ersetzt keine professionelle Planung vor Ort. Faktoren wie lokale Verschattung, Dachstatik, Netzanschlussbedingungen und regionale Förderprogramme werden nicht berücksichtigt.

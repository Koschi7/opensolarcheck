# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

## [1.2.0] - 2026-04-19

### Korrigiert

- Amortisationsrechnung gab stillschweigend 25 Jahre zurück, wenn sich die Anlage innerhalb der Lebensdauer nicht amortisiert. Rechner, Ergebnisseite, PDF-Export und Finanzdiagramm zeigen jetzt klar "in 25 Jahren nicht erreicht".
- Einspeisevergütung für Anlagen > 40 kWp wurde falsch berechnet. Neues Drei-Stufen-Modell (bis 10 / 40 / 100 kWp) entsprechend EEG-Systematik.

### Geändert

- Durchgehende Sie-Form in allen deutschen Texten (Landing, Konfigurator, Ergebnisseite, FAQ, PDF) für konsistente Ansprache.
- PDF-Export neu gestaltet im redaktionellen Stil der Web-Oberfläche: Zeitungskopf, Haar-Linien, Courier-Zahlen, Solar-Orange ausschließlich für Amortisationszeit.
- Vollständige englische i18n-Abdeckung: Konfigurator, Ergebnisseite, Charts und CO₂-Kachel rendern auf `/en` nun durchgängig englisch.
- Ergebnisseite zeigt Eingabe-Echo mit übersetzten Beschattungs-/Modultyp-Labels, keine hartcodierten deutschen Texte mehr.
- Stärkerer Text-Kontrast: `--muted-ink` und `--faint-ink` dunkler für bessere Lesbarkeit (WCAG AA).

### Hinzugefügt

- Organization-JSON-LD-Block neben WebApplication und FAQPage für bessere SEO-Sichtbarkeit.
- Neue Übersetzungsschlüssel für Ergebnisseite (Eingaben, Hinweis, NPV, Zahlungsfluss) und Konfigurator (Amortisations-Randfälle, Schnellwahl-Hinweise, Batterie-Metriken).
- Haushalts-Preset für 5 Personen (5.500 kWh/Jahr) im Verbrauchsschritt.

## [1.1.0] - 2026-04-18

### Geändert

- **Komplettes visuelles Redesign aller drei Kernflächen** — Landing, Konfigurator, Ergebnisseite folgen jetzt einer redaktionellen Daten-Journalismus-Ästhetik (FT Climate / Vitsœ / Fraunhofer-Report).
- Landing: Hero zeigt die Antwort als 25-Jahres-Ersparniskurve statt eines Sonnensymbols; redaktionelle 12-Spalten-Komposition mit Haar-Linien, Ledger-Notation und Break-even-Annotation.
- Landing: Neuer "Was wir nicht sammeln"-Abschnitt (0/0/0/100 %) verwandelt Datenschutz in ein Verkaufsargument; Methodik-Sektion (§ 01–03 PVGIS · HTW Berlin · Fraunhofer ISE) und Zielgruppen-Tabelle ersetzen generische Feature-Karten.
- Konfigurator: 12-Spalten-Layout mit Steuerung links und live aktualisiertem technischem Schema rechts. Azimut als 5-Zellen-Picker (E · SO · S · SW · W), nummerierte Schritte 01–05, Mono-Typografie für Werte.
- Konfigurator-Illustrationen komplett neu: Dach als Querschnitt mit Neigungswinkel-Bogen, Standort als Latitude-Band mit Strahlungsgradient, Anlage als Plan-Ansicht des Moduls-Array, Verbrauch als horizontal gestapelter Balken, Speicher als kalibrierte Kapazitätsskala.
- Ergebnisseite als umgekehrte Pyramide: erst der NPV als großes Zahlenstatement, dann Figure 01 (25 Jahre kumulierte Ersparnis mit Break-even-Punkt), Figure 02/03 (monatlicher Ertrag & Eigenverbrauchs-Flussdiagramm), Table 01 (Wirtschaftlichkeit), CO₂-Bilanz und Eingaben-Echo.
- Charts komplett in SVG umgesetzt (keine Recharts-Defaults): eigene Skalierung, Hairline-Gitter, annotierte Break-even-Markierung, Quellenzeile in Mono.
- Typografie: IBM Plex Mono für Werte, Labels und Display-Zahlen; Inter bleibt als Body/UI-Font. Konsistente Tabularnumerik, Small-Caps-Labels.
- Farbsystem: reduziertes Paper/Ink-Token-Set mit einer einzigen Akzentfarbe (Solar-Orange) für datengetragene Highlights.

## [1.0.1] - 2026-04-04

### Verbessert

- Mobile UX: Numerisches Tastaturlayout für PLZ-, Flächen- und Verbrauchseingaben
- Mobile UX: Automatischer Scroll nach oben beim Schrittwechsel im Konfigurator
- Mobile UX: Verbessertes Burger-Menü mit Datenschutz-/Impressum-Links und besseren Abständen
- Mobile UX: Keine führende Null mehr in leeren Eingabefeldern
- Mobile UX: Bessere Button-Abstände bei der Personenauswahl (Schritt 4)
- Entwicklung: `allowedDevOrigins` für lokales Testen auf Mobilgeräten

## [1.0.0] - 2026-04-03

### Hinzugefügt

- Mehrstufiger PV-Konfigurator (5 Schritte: Standort, Dach, Anlage, Verbrauch, Speicher)
- PVGIS-Integration für standortgenaue Ertragsdaten (mit Fallback-Werten)
- PLZ-Suche mit automatischer Geocodierung und Stadtname-Anzeige
- Eigenverbrauchsberechnung nach HTW Berlin Modell (Quaschning/Weniger)
- Wirtschaftlichkeitsanalyse über 25 Jahre (NPV, ROI, Amortisation)
- Prominente Investitionskosten-Anzeige mit Spanne und Fraunhofer-ISE-Quelle
- CO2-Einsparungsberechnung mit anschaulichen Vergleichen (Flüge, Bäume)
- Interaktive Dach-Illustration (Neigung, Panels)
- Azimut-Auswahl per Slider mit Schnellwahl-Buttons (Ost bis West)
- Kartenbasierte Modultyp-Auswahl mit Beschreibungen und Empfehlung
- Modul-Anzahl per Slider mit automatischer Empfehlung nach Dachfläche
- Intelligente Speicher-Vorauswahl (empfohlene Kapazität nach kWp)
- PDF-Export mit vollständiger Analyse (2 Seiten, DE/EN)
- Deutsch/Englisch Internationalisierung (next-intl)
- Responsive Design (Mobile-first)
- Umami Analytics Integration (cookieless, datenschutzfreundlich, optional)
- SEO-Optimierung: keyword-reiche Meta-Tags, Open Graph, Twitter Cards
- hreflang-Tags für DE/EN, Canonical URLs
- JSON-LD strukturierte Daten (WebApplication + FAQPage)
- FAQ-Bereich auf der Startseite (optimiert für Google Featured Snippets und KI-Suche)
- OG-Images automatisch generiert (satori + resvg, DE/EN)
- robots.txt und sitemap.xml
- Impressum gemäß § 5 DDG (persönliche Daten über Umgebungsvariablen)
- Datenschutzerklärung gemäß DSGVO Art. 13/14 (Hosting, PVGIS, Umami, Betroffenenrechte)
- 47 Unit-Tests für Berechnungsmodule

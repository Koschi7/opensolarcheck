# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

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

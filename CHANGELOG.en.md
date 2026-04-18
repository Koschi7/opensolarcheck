# Changelog

All notable changes to this project are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2026-04-18

### Changed

- **Full visual redesign of all three core surfaces** — Landing, configurator, and results page now follow an editorial data-journalism aesthetic (FT Climate / Vitsœ / Fraunhofer report).
- Landing: hero shows the answer as a 25-year cumulative savings curve instead of a sun icon; editorial 12-column composition with hairline rules, ledger notation, and break-even annotation.
- Landing: new "What we don't collect" ledger (0/0/0/100 %) turns privacy into a selling point; methodology section (§ 01–03 PVGIS · HTW Berlin · Fraunhofer ISE) and audience table replace generic feature cards.
- Configurator: 12-column layout with controls on the left and a live technical schematic on the right. Azimuth as a 5-cell picker (E · SE · S · SW · W), numbered steps 01–05, mono typography for values.
- Configurator illustrations fully rebuilt: roof as a cross-section with tilt-angle arc, location as a latitude band with radiation gradient, system as a plan-view module array, consumption as a horizontal stacked bar, battery as a calibrated capacity scale.
- Results page as inverted pyramid: NPV as the big-number headline, then Figure 01 (25-year cumulative savings with break-even marker), Figure 02/03 (monthly yield & self-consumption flow), Table 01 (economics), CO₂ panel, and inputs echo.
- Charts reimplemented in raw SVG (no Recharts defaults): custom scales, hairline grids, annotated break-even marker, source line in mono.
- Typography: IBM Plex Mono for values, labels, and display numbers; Inter remains body/UI. Consistent tabular numerics, small-caps labels.
- Color system: reduced paper/ink token set with a single accent (solar orange) reserved for data-bearing highlights.

## [1.0.0] - 2026-04-03

### Added

- Multi-step PV configurator (5 steps: location, roof, system, consumption, battery)
- PVGIS integration for location-specific yield data (with fallback values)
- Postal code search with automatic geocoding and city name display
- Self-consumption calculation based on HTW Berlin model (Quaschning/Weniger)
- Financial analysis over 25 years (NPV, ROI, payback period)
- Prominent investment cost display with range and Fraunhofer ISE source
- CO2 savings calculation with illustrative comparisons (flights, trees)
- Interactive roof illustration (tilt, panels)
- Azimuth selection via slider with quick-select buttons (East to West)
- Card-based module type selection with descriptions and recommendation badge
- Module count slider with automatic recommendation based on roof area
- Smart battery pre-selection (recommended capacity based on kWp)
- PDF export with full analysis (2 pages, DE/EN)
- German/English internationalization (next-intl)
- Responsive design (mobile-first)
- Umami analytics integration (cookieless, privacy-friendly, optional)
- SEO optimization: keyword-rich meta tags, Open Graph, Twitter Cards
- hreflang tags for DE/EN, canonical URLs
- JSON-LD structured data (WebApplication + FAQPage)
- FAQ section on homepage (optimized for Google Featured Snippets and AI search)
- OG images auto-generated (satori + resvg, DE/EN)
- robots.txt and sitemap.xml
- Legal notice compliant with § 5 DDG (personal data via environment variables)
- Privacy policy compliant with GDPR Art. 13/14 (hosting, PVGIS, Umami, data subject rights)
- 47 unit tests for calculation modules

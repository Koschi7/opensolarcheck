# Changelog

All notable changes to this project are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

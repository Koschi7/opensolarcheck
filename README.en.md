# OpenSolarCheck – Your Independent Solar Calculator

[Deutsche Version](README.md)

> Calculate yield, costs, and payback period for your solar system – free, no registration, no data collection.

**[opensolarcheck.de](https://opensolarcheck.de)**

## Features

- Multi-step PV configurator (5 steps: location, roof, system, consumption, battery)
- Yield calculation based on PVGIS satellite data (EU Joint Research Centre)
- Self-consumption and self-sufficiency calculation (HTW Berlin model)
- Financial analysis over 25 years (NPV, ROI, payback period)
- CO2 savings calculation
- Interactive roof illustration with tilt and orientation
- PDF export of results
- Fully client-side – no data leaves your browser
- German and English (i18n)
- Privacy-friendly analytics (Umami, optional)
- SEO-optimized with structured data (JSON-LD)
- Legal notice and privacy policy compliant with German law (DDG/GDPR)

## Tech Stack

- Next.js 16 (App Router, Static Export)
- TypeScript (strict)
- Tailwind CSS 4 + shadcn/ui
- Recharts (charts)
- next-intl (i18n)
- @react-pdf/renderer (PDF export)
- satori + resvg (OG image generation)
- Vitest + React Testing Library

## Quick Start

```bash
git clone https://github.com/Koschi7/opensolarcheck.git
cd opensolarcheck
pnpm install
cp .env.example .env  # Update imprint data!
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_IMPRINT_NAME` | Yes | Name for legal notice (§ 5 DDG) |
| `NEXT_PUBLIC_IMPRINT_STREET` | Yes | Street for legal notice |
| `NEXT_PUBLIC_IMPRINT_CITY` | Yes | ZIP + City for legal notice |
| `NEXT_PUBLIC_IMPRINT_EMAIL` | Yes | Email for legal notice |
| `NEXT_PUBLIC_UMAMI_ENABLED` | No | Enable analytics (`true`/`false`) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | No | Umami website ID |
| `NEXT_PUBLIC_UMAMI_URL` | No | Umami server URL |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console |

### Build

```bash
pnpm build
```

Creates static files in the `out/` directory. OG images are automatically generated before the build.

### Tests

```bash
pnpm test:run
```

## Calculation Methodology

Calculations are based on:

- **PVGIS** (EU Joint Research Centre) – Solar irradiation and PV yield
- **HTW Berlin Model** (Quaschning/Weniger) – Self-consumption ratio
- **BDEW H0 Standard Load Profile** – Consumption distribution
- **EEG Feed-in Tariffs** – Current rates
- **Fraunhofer ISE** – Investment costs (EUR/kWp)
- **German Environment Agency** – CO2 emission factors

Details available at [/methodik](https://opensolarcheck.de/en/methodik) in the app.

## Deployment

The app is a static export and can be hosted on any web server (Nginx, Apache, Caddy, etc.).

```bash
pnpm build
# Copy out/ directory to your server
```

### Umami Analytics (optional)

For self-hosted analytics, see `docker-compose.umami.yml`.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## License

MIT – see [LICENSE](LICENSE)

## Disclaimer

This calculation provides rough estimates based on publicly available weather data (PVGIS). It does not replace professional on-site planning. Factors such as local shading, roof statics, grid connection conditions, and regional subsidy programs are not considered.

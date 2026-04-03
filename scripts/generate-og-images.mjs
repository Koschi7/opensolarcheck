import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load a font — use Inter from Google Fonts (bundled)
const fontRegularPath = join(root, "scripts", "fonts", "Inter-Regular.ttf");
const fontBoldPath = join(root, "scripts", "fonts", "Inter-Bold.ttf");

let fontRegular, fontBold;

try {
  fontRegular = readFileSync(fontRegularPath);
  fontBold = readFileSync(fontBoldPath);
} catch {
  console.log("Fonts not found. Downloading Inter from Google Fonts...");
  const res1 = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf"
  );
  const res2 = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf"
  );
  fontRegular = Buffer.from(await res1.arrayBuffer());
  fontBold = Buffer.from(await res2.arrayBuffer());
  mkdirSync(join(root, "scripts", "fonts"), { recursive: true });
  writeFileSync(fontRegularPath, fontRegular);
  writeFileSync(fontBoldPath, fontBold);
  console.log("Fonts downloaded and cached.");
}

const configs = [
  {
    locale: "de",
    title: "Kostenloser PV-Rechner",
    subtitle: "Ertrag, Kosten & Amortisation\ndeiner Solaranlage berechnen",
    badge1: "Ohne Anmeldung",
    badge2: "Ohne Datenabgabe",
    badge3: "Open Source",
  },
  {
    locale: "en",
    title: "Free Solar Calculator",
    subtitle: "Calculate yield, costs &\npayback for your PV system",
    badge1: "No registration",
    badge2: "No data collection",
    badge3: "Open Source",
  },
];

for (const config of configs) {
  console.log(`Generating OG image for ${config.locale}...`);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 40%, #F0F9FF 100%)",
          fontFamily: "Inter",
          padding: "60px",
        },
        children: [
          // Sun icon (circle)
          {
            type: "div",
            props: {
              style: {
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                  },
                },
              },
            },
          },
          // Brand
          {
            type: "div",
            props: {
              style: {
                fontSize: "28px",
                fontWeight: 400,
                color: "#1E40AF",
                marginBottom: "16px",
                letterSpacing: "-0.5px",
              },
              children: "OpenSolarCheck",
            },
          },
          // Title
          {
            type: "div",
            props: {
              style: {
                fontSize: "52px",
                fontWeight: 700,
                color: "#111827",
                textAlign: "center",
                lineHeight: 1.15,
                marginBottom: "20px",
                letterSpacing: "-1px",
              },
              children: config.title,
            },
          },
          // Subtitle
          {
            type: "div",
            props: {
              style: {
                fontSize: "24px",
                fontWeight: 400,
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 1.4,
                marginBottom: "40px",
                maxWidth: "700px",
              },
              children: config.subtitle,
            },
          },
          // Badges
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                gap: "16px",
              },
              children: [config.badge1, config.badge2, config.badge3].map(
                (text) => ({
                  type: "div",
                  props: {
                    style: {
                      backgroundColor: "#FFFFFF",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: "999px",
                      padding: "10px 24px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#374151",
                    },
                    children: text,
                  },
                })
              ),
            },
          },
          // Domain
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "30px",
                right: "40px",
                fontSize: "16px",
                color: "#9CA3AF",
              },
              children: "opensolarcheck.de",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();

  const outPath = join(root, "public", `og-${config.locale}.png`);
  writeFileSync(outPath, png);
  console.log(`  -> ${outPath} (${(png.length / 1024).toFixed(0)} KB)`);
}

console.log("Done!");

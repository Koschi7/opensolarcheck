import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Sun favicon SVG — amber circle with rays
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </radialGradient>
  </defs>
  <!-- Rays -->
  <g stroke="#F59E0B" stroke-width="28" stroke-linecap="round" opacity="0.9">
    <line x1="256" y1="40" x2="256" y2="100"/>
    <line x1="256" y1="412" x2="256" y2="472"/>
    <line x1="40" y1="256" x2="100" y2="256"/>
    <line x1="412" y1="256" x2="472" y2="256"/>
    <line x1="103" y1="103" x2="145" y2="145"/>
    <line x1="367" y1="367" x2="409" y2="409"/>
    <line x1="409" y1="103" x2="367" y2="145"/>
    <line x1="145" y1="367" x2="103" y2="409"/>
  </g>
  <!-- Sun body -->
  <circle cx="256" cy="256" r="130" fill="url(#sun)"/>
  <!-- Highlight -->
  <circle cx="230" cy="230" r="40" fill="white" opacity="0.25"/>
</svg>
`;

// Save SVG
const svgPath = join(root, "src", "app", "icon.svg");
writeFileSync(svgPath, svg.trim());
console.log(`SVG -> ${svgPath}`);

// Generate PNG sizes
const sizes = [
  { size: 32, name: "favicon-32x32.png" },
  { size: 16, name: "favicon-16x16.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
];

for (const { size, name } of sizes) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  const png = resvg.render().asPng();
  const outPath = join(root, "public", name);
  writeFileSync(outPath, png);
  console.log(`${name} (${size}x${size}) -> ${outPath} (${(png.length / 1024).toFixed(0)} KB)`);
}

// Generate ICO (just use the 32px PNG wrapped — browsers accept PNG-in-ICO)
// For proper ICO we'll just copy the 32px as favicon.ico
const resvg32 = new Resvg(svg, { fitTo: { mode: "width", value: 32 } });
const ico = resvg32.render().asPng();
writeFileSync(join(root, "src", "app", "favicon.ico"), ico);
console.log(`favicon.ico -> src/app/favicon.ico`);

console.log("Done!");

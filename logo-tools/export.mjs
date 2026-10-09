// Lay the generated masters out into logo/ (or the directory given as the first argument).
// Layout: svg/ (lockups, symbol, stacked, wordmark, discs, app tiles), seals/ (pi-seal-*),
// favicon/ (favicon.svg + favicon and app-icon PNGs), social/ (avatars). File names keep their historical form so links stay stable.
// PNGs come from the Chromium rasteriser (Playwright), except 16 px, which is the hand-built pixel art.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const B = process.env.PI_LOGO_MASTERS ?? join(HERE, ".build", "masters");
const T = join(HERE, "symbol");
const E = resolve(process.argv[2] ?? join(HERE, "..", "logo"));

const FAVICON_PNGS = [
  "favicon-16.png",
  "favicon-16-mono.png",
  "favicon-16-on-dark.png",
  "favicon-32.png",
  "favicon-48.png",
  "apple-touch-icon-180.png",
  "icon-192.png",
  "icon-512.png",
];
const SOCIAL_PNGS = ["avatar-400.png", "avatar-1080.png"];

// Hand-maintained files that live beside the generated ones and must survive a rebuild.
const KEEP = new Set(["seals/pi-seal-optimists-ring.svg", "social/og-default.png"]);
for (const d of ["svg", "seals", "favicon", "social"]) mkdirSync(join(E, d), { recursive: true });
for (const d of ["svg", "seals"]) {
  for (const f of readdirSync(join(E, d))) {
    if (f.endsWith(".svg") && !KEEP.has(`${d}/${f}`)) rmSync(join(E, d, f));
  }
}
for (const f of [...FAVICON_PNGS, "favicon.svg"]) rmSync(join(E, "favicon", f), { force: true });
for (const f of SOCIAL_PNGS) rmSync(join(E, "social", f), { force: true });

const svgs = readdirSync(B).filter((f) => f.endsWith(".svg") && f !== "favicon.svg");
for (const f of svgs) copyFileSync(join(B, f), join(E, f.startsWith("pi-seal") ? "seals" : "svg", f));
copyFileSync(join(B, "favicon.svg"), join(E, "favicon", "favicon.svg"));
for (const f of ["favicon-16.png", "favicon-16-on-dark.png", "favicon-16-mono.png"]) {
  copyFileSync(join(T, f), join(E, "favicon", f)); // hand-built pixel art
}

const browser = await chromium.launch();
const page = await browser.newPage();
const png = async (svg, size, out) => {
  const src = readFileSync(join(B, `${svg}.svg`), "utf8").replace(
    "<svg ",
    `<svg width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" `
  );
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${src}</body></html>`);
  await page.screenshot({
    path: join(E, out),
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size },
  });
};
await png("pi-symbol", 32, "favicon/favicon-32.png");
await png("pi-symbol", 48, "favicon/favicon-48.png");
await png("pi-app-tile-square", 180, "favicon/apple-touch-icon-180.png");
await png("pi-app-tile-square", 192, "favicon/icon-192.png");
await png("pi-app-tile-square", 512, "favicon/icon-512.png");
await png("pi-disc", 400, "social/avatar-400.png");
await png("pi-disc", 1080, "social/avatar-1080.png");
console.log(`export -> ${E}: ${svgs.length} svgs + favicon.svg + ${FAVICON_PNGS.length + SOCIAL_PNGS.length} pngs`);
await browser.close();

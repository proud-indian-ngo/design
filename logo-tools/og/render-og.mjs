/**
 * Renders logo/social/og-default.png (1200x630), the brand's default social preview card, from the package's own
 * lockup and fonts. The website ships a byte-identical copy as its public/og.png.
 *   node logo-tools/og/render-og.mjs [out.png]       (bun run og)
 * On a cyan ground the brand rules ask for the one-colour (mono) ink lockup (logo/svg/pi-lockup-mono.svg).
 * The sticker is the Kalakriti 3.0 hero cut-out (logo-tools/og/Kalakriti3_DSC01748.png, a source input only).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const root = new URL("../../", import.meta.url); // the package root
const file = (p) => fileURLToPath(new URL(p, root));
const b64 = (p) => readFileSync(file(p)).toString("base64");
const lockup = readFileSync(file("logo/svg/pi-lockup-mono.svg"), "utf8");
const html = `<!doctype html><html><head><style>
@font-face{font-family:Brico;font-weight:200 800;font-stretch:75% 100%;src:url(data:font/woff2;base64,${b64("fonts/bricolage-grotesque-latin-wdth-normal.woff2")}) format("woff2")}
@font-face{font-family:Geist;font-weight:100 900;src:url(data:font/woff2;base64,${b64("fonts/geist-latin-wght-normal.woff2")}) format("woff2")}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#4CC0EC;color:#0F1B24;font-family:Geist;position:relative;overflow:hidden}
.logo{position:absolute;left:72px;top:64px;width:330px}
.logo svg{display:block;width:100%;height:auto}
.pre{position:absolute;left:78px;top:196px;font:800 64px/1 Brico;letter-spacing:-.03em}
.giant{position:absolute;left:66px;top:262px;font:800 196px/.82 Brico;letter-spacing:-.05em;color:#fff;-webkit-text-stroke:3px #0F1B24;text-shadow:8px 8px 0 #0F1B24;paint-order:stroke fill;white-space:nowrap}
.line{position:absolute;left:78px;bottom:58px;font:600 26px Geist;display:flex;gap:14px;align-items:center}
.line span{background:#F6F2EA;border:1.5px solid #0F1B24;border-radius:99px;padding:8px 18px;box-shadow:3px 3px 0 #0F1B24}
.kid{position:absolute;right:28px;bottom:-40px;height:440px;transform:rotate(5deg);filter:drop-shadow(5px 0 0 #F6F2EA) drop-shadow(-5px 0 0 #F6F2EA) drop-shadow(0 -5px 0 #F6F2EA) drop-shadow(0 5px 0 #F6F2EA) drop-shadow(0 16px 22px rgba(15,27,36,.28))}
</style></head><body>
<div class="logo">${lockup}</div>
<p class="pre">Be an</p><p class="giant">Optimist.</p>
<p class="line"><span>Volunteer-run NGO</span><span>Bengaluru</span></p>
<img class="kid" src="data:image/png;base64,${b64("logo-tools/og/Kalakriti3_DSC01748.png")}">
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const out = process.argv[2] ?? file("logo/social/og-default.png");
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`wrote ${out}`);

/** Render illustrations/contact-sheet.png from illustrations/manifest.json (Playwright Chromium). */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "illustrations"
);

interface Item {
  name: string;
  file: string;
  viewBox: string;
}

const items = JSON.parse(
  readFileSync(join(DIR, "manifest.json"), "utf8")
) as Item[];
const cells = items
  .map((i) => {
    const [, , w = 1, h = 1] = i.viewBox.split(" ").map(Number);
    const wide = w / h > 3;
    const svg = readFileSync(join(DIR, i.file), "utf8").replace(
      "<svg ",
      `<svg style="aspect-ratio:${w}/${h}" `
    );
    return `<figure class="${wide ? "wide" : ""}"><div class="b">${svg}</div><figcaption>${i.name}</figcaption></figure>`;
  })
  .join("");

const html = `<!doctype html><style>
body{margin:0;padding:24px;background:#F6F2EA;color:#0F1B24;font:600 13px system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:16px;width:1192px}
figure{margin:0;width:160px}figure.wide{width:336px}
.b{height:120px;display:flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid #0F1B24;border-radius:10px;padding:10px;box-sizing:border-box}
.b svg{max-width:100%;max-height:100%;width:auto;height:100%;overflow:visible}
figure.wide .b svg{width:100%;height:auto}
figcaption{margin-top:6px}
</style>${cells}`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1240, height: 800 },
  deviceScaleFactor: 2,
});
await page.setContent(html);
await page.screenshot({ path: join(DIR, "contact-sheet.png"), fullPage: true });
await browser.close();
console.log(
  `contact sheet: ${items.length} illustrations -> illustrations/contact-sheet.png`
);

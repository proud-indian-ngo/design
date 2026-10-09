// Render the brand guidelines to PDF + per-page PNGs.
//   bun run brand:render                   # -> brand/Proud-Indian-Brand-Guidelines.pdf + brand/guidelines/pages/
//   node render.mjs --root <dir> --page <path> --out <dir>   # render any copy (used to compare against the original)
// Serves --root (default: the pi-design repo) on a throwaway local port; no separate server needed.
import { chromium } from 'playwright';
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { createServer } from 'http';
import { dirname, extname, join, normalize } from 'path';
import { fileURLToPath } from 'url';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const ROOT = arg('--root', join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'));
const PAGE = arg('--page', 'brand/guidelines/index.html');
const OUT = arg('--out', join(ROOT, 'brand'));
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json' };
const server = createServer((req, res) => {
  const f = join(ROOT, normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!f.startsWith(ROOT) || !existsSync(f) || !statSync(f).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] ?? 'application/octet-stream' });
  createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const URL_ = `http://127.0.0.1:${server.address().port}/${PAGE}`;
const base = OUT;
const PAGES = arg('--pages', join(OUT, 'guidelines', 'pages'));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 1.5 });
const errs = [];
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('requestfailed', r => errs.push('FAIL ' + r.url()));
p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
await p.goto(URL_, { waitUntil: 'networkidle' });
await p.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 30000 });
// overflow check
const of = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('.page').forEach((pg, i) => {
    const pr = pg.getBoundingClientRect();
    pg.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (el.closest('.cv-kid,.cut,.gl-c,.ph-grid .p5')) return;
      if (r.bottom > pr.bottom - 40 && !el.closest('.pn') && !el.matches('.cv-kid, .cut') && !el.closest('.cover')) out.push(`p${i + 1} bottom ${el.tagName}.${el.className && el.className.baseVal === undefined ? el.className : ''} ${Math.round(r.bottom - pr.top)}`);
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === 'hidden' && el.clientWidth > 0) out.push(`p${i + 1} clipX ${el.tagName}.${el.className}`);
    });
  });
  return out.slice(0, 60);
});
console.log(of.join('\n'));
mkdirSync(PAGES, { recursive: true });
for (const f of readdirSync(PAGES)) unlinkSync(join(PAGES, f));
const n = await p.evaluate(() => document.querySelectorAll('.page').length);
await p.emulateMedia({ media: 'print' });
for (let i = 0; i < n; i++) {
  const el = (await p.$$('.page'))[i];
  await el.screenshot({ path: join(PAGES, `page-${String(i + 1).padStart(2, '0')}.png`) });
}
await p.pdf({ path: base + '/Proud-Indian-Brand-Guidelines.pdf', printBackground: true, preferCSSPageSize: true });
console.log('pages', n, 'errors', errs);
await b.close();
server.close();

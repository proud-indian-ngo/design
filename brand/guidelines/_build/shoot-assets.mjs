// Re-shoot the website screenshots used in the guide (brand/guidelines/assets/shots).
// Needs a page with the website's home markup (it clips to #b0, .fC-strip, .fC-scene, ...), served locally or live:
//   PI_SITE_URL=http://127.0.0.1:4321/ node brand/guidelines/_build/shoot-assets.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'shots');
const URL = process.env.PI_SITE_URL;
if (!URL) { console.error('set PI_SITE_URL to the page to shoot (see the header)'); process.exit(1); }
const b = await chromium.launch();
// desktop
let p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.screenshot({ path: `${out}/site-hero.jpg`, quality: 88, clip: { x: 0, y: 0, width: 1440, height: 900 } });
await p.screenshot({ path: `${out}/site-header.png`, clip: { x: 0, y: 0, width: 1440, height: 96 } });
const box = async s => p.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height }; }, s);
const b0 = await box('#b0'); console.log('b0', b0);
await p.screenshot({ path: `${out}/site-teach.jpg`, quality: 88, fullPage: true, clip: b0 });
const strip = await box('.fC-strip');
await p.screenshot({ path: `${out}/site-polaroids.jpg`, quality: 88, fullPage: true, clip: { x: 0, y: strip.y - 30, width: 1440, height: strip.height + 50 } });
const scene = await box('.fC-scene');
const ftw = await p.evaluate(() => { const r = document.querySelectorAll('.ft-wrap')[1].getBoundingClientRect(); return { y: r.y + scrollY, h: r.height }; });
await p.screenshot({ path: `${out}/site-footer.jpg`, quality: 88, fullPage: true, clip: { x: 0, y: scene.y - 40, width: 1440, height: (ftw.y + ftw.h) - (scene.y - 40) } });
const poster = await box('.poster');
await p.screenshot({ path: `${out}/site-kalakriti.jpg`, quality: 88, fullPage: true, clip: { x: 0, y: poster.y - 80, width: 1440, height: poster.height + 140 } });
const don = await box('.s-don');
await p.screenshot({ path: `${out}/site-donate.jpg`, quality: 88, fullPage: true, clip: don });
await p.close();
// phone
p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.screenshot({ path: `${out}/phone-hero.jpg`, quality: 88 });
await p.click('.burger'); await p.waitForTimeout(600);
await p.screenshot({ path: `${out}/phone-menu.jpg`, quality: 88 });
await b.close();

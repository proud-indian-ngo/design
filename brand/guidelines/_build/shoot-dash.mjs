// Re-shoot the dashboard screenshots used in appendix A2 (brand/guidelines/assets/shots/dash-*.jpg).
// Needs pi-dash running on freshly seeded dev data (no leftover test rows), for example a worktree with --isolated-db:
//   PI_DASH_URL=http://localhost:3031 node brand/guidelines/_build/shoot-dash.mjs
import { chromium } from 'playwright';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'shots');
const URL = process.env.PI_DASH_URL;
if (!URL) { console.error('set PI_DASH_URL to the running dashboard (see the header)'); process.exit(1); }
const EMAIL = process.env.PI_DASH_EMAIL ?? 'admin@pi-dash.dev';
const PASSWORD = process.env.PI_DASH_PASSWORD ?? 'Admin123!';
const b = await chromium.launch();
async function shoot(theme, path, file, hide = []) {
  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  await ctx.addInitScript(t => localStorage.setItem('theme', t), theme);
  const p = await ctx.newPage();
  await p.goto(`${URL}/login`, { waitUntil: 'networkidle' });
  await p.fill('input[type=email]', EMAIL);
  await p.fill('input[type=password]', PASSWORD);
  await p.keyboard.press('Enter');
  await p.waitForURL(u => !u.pathname.startsWith('/login'));
  await p.goto(`${URL}${path}`, { waitUntil: 'networkidle' });
  // Let data sync and any sign-in toast clear.
  await p.waitForTimeout(6000);
  // Dev-only overlays are not part of the product.
  await p.addStyleTag({ content: 'agentation-toolbar,[aria-label="Open TanStack Devtools"]{display:none!important}' });
  for (const name of hide) {
    // Hide a column through the Columns menu, as a user would, when the frame is too narrow for all of them.
    await p.getByRole('button', { name: 'Columns' }).click();
    await p.getByRole('menuitemcheckbox', { name }).click();
    await p.keyboard.press('Escape');
  }
  await p.evaluate(() => document.activeElement?.blur());
  await p.mouse.move(0, 0);
  // Crop to the page content: from the title to the bottom of the table frame.
  const clip = await p.evaluate(() => {
    const title = document.querySelector('main h1').getBoundingClientRect();
    const main = document.querySelector('main').getBoundingClientRect();
    const card = document.querySelector('table[data-slot=data-grid-table]').closest('[data-slot=card]').getBoundingClientRect();
    const x = title.left - 24;
    const y = title.top - 24;
    return { x, y, width: main.right - x, height: card.bottom + 24 - y };
  });
  await p.screenshot({ path: join(out, file), quality: 88, clip });
  await ctx.close();
}
await shoot('light', '/reimbursements?group=status', 'dash-table-light.jpg', ['Submitted']);
await shoot('dark', '/vendor-payments', 'dash-table-dark.jpg');
await b.close();

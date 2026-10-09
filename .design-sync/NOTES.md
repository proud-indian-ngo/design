# design-sync notes: @proudindian/design

First sync from this repo: 2026-10-08. 13 components uploaded, all 13 previews graded good, render check clean. It deleted the project's 26 earlier components and their Instrument Serif and Inter woff2 files. The anchor's diff does not track `fonts/`, so those font deletes were added to the plan by hand. Do the same if a font file is ever renamed or dropped.

## Build
- `bun run build` (scripts/build.ts):
  - `dist/react/index.js`: Bun ESM bundle of `react/`, React external; `.d.ts` from `tsc -p tsconfig.build.json`.
  - `dist/styles.css`: the compiled package CSS (Tailwind theme + brand theme, fonts, base, primitives; no utilities). This is the `cssEntry`.
  - `dist/tokens/`: typed tokens.
- The components only use `.pi-*` classes and inline styles, never Tailwind utilities, so `dist/styles.css` is complete for them.
- Fonts: `dist/styles.css` has `@font-face` with `url(../fonts/*.woff2)` (the package `fonts/`). If the converter does not follow those URLs, add `"extraFonts": ["css/fonts.css"]` to config.json (same relative path).
- The doodle and logo artwork is inlined from `illustrations/` and `logo/` via `react/generated/*.ts` (`bun run react:assets`), about 200 KB of the bundle. That is the price of exact artwork; previews only need it once.
- Converter command (from the design-sync skill's `.ds-sync/`):
  `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/react/index.js --out ./ds-bundle`
- Playwright must match the cached Chromium build: `playwright@1.63.0` (this package's devDependency) matches `chromium-1243` in `~/Library/Caches/ms-playwright`.

## Gotchas to expect
- `componentSrcMap` pins every component to its file; `Chips` lives in `react/Chip.tsx`.
- Groups come from the stub docs in `.design-sync/groups/*.md` via `docsMap`: Foundations, Content, Brand.
- Previews must render their final frame. These components have no entrance animation; doodle animations are class hooks the package does not animate, so captures are stable.
- `Doodle`, `Lockup` and `Seal` use `dangerouslySetInnerHTML` with the package's own SVG files (trusted, generated).
- Only `Brico` (Bricolage Grotesque) and `Geist` ship. Font stacks fall back to system fonts; a `[FONT_MISSING]` warning would mean the woff2 URLs were not bundled (see Fonts above).

## Known render warns
- `[FONT_MISSING] "Arial Black" (--font-pi-display)`: a system fallback after `Brico`, which ships. Harmless.

## Preview gotchas
- `Ticket` rail cells are narrow, about 10 characters at preview width. "Kaggadasapura" overflowed and clipped, so the Session preview uses "Bengaluru".
- `Button` needs `cardMode: "column"`, because the Sizes row is wider than a grid cell (`[GRID_OVERFLOW]`).

## Re-sync risks
- Facts are hard-coded in `conventions.md` and the previews (3.6k+, 14k+, 23k+, 95%, registration numbers). Update them when the website's facts (`src/content/site.yaml` in proud-indian-ngo/website) change.
- Event photos are not in this package, so `Polaroid` and `Sticker` previews use placeholder art. If the design agent needs real photos, add a small, consented set to the project separately.

## Re-sync
- Project: "Proud Indian Design System" (`projectId` in config.json), https://claude.ai/design/p/55c6293e-1cd5-4739-9c87-de4e717d7ded
- Steps:
  1. `bun install && bun run build`
  2. Stage `.ds-sync/` from the design-sync skill, then `npm i esbuild ts-morph @types/react playwright@1.63.0` in it. `.ds-sync/` is gitignored.
  3. Fetch `_ds_sync.json` from the project into `.design-sync/.cache/remote-sync.json`.
  4. `node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/react/index.js --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json`
- `ds-bundle/` and `.design-sync/.cache/` are gitignored.

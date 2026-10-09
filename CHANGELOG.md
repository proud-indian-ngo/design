# Changelog

All notable changes to `@proudindian/design`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [semver](https://semver.org/).

## [0.2.3] - 2026-10-09

### Added

- **Native-scrollbar opt-out in `css/scrollbar.css`: `html[data-native-scrollbar]`.** With the attribute on `<html>`, none of the brand scrollbar rules apply, to the page or to any scroller (`.pi-scroll-thin` and `.pi-scroll-dark` included), and the browser draws its default scrollbars. Every rule is now scoped to `html:not([data-native-scrollbar])`: once as `html:not(…)::-webkit-scrollbar*` for the page's own (viewport) bar and once as `html:not(…) ::-webkit-scrollbar*` for scrollers inside it, and the Firefox `scrollbar-width`/`scrollbar-color` rules the same way. The selectors use `html`, not `:root`, because Chromium never matches a scrollbar pseudo-element's `:hover`/`:active` when `:root` is in the selector. Specificity goes from (0,0,1) to (0,1,2) for the pseudo-elements. Without the attribute nothing changes. The website sets it on macOS from its inline head script, before first paint.
- **Outline doodles: `illustrations/outline/*.svg` and `illustrations/outline-sprite.svg`.** The 18 light line doodles the website scatters in its side margins (pencil, book, kite, heart, star, rupee, sun, sparkle, notepad, clock, plane, matka, brush, bowl, hands, note, drum, tick). Each source is a standalone SVG (root `fill="none" stroke="currentColor" stroke-width="1.4"`, round caps and joins; paths with `vector-effect="non-scaling-stroke"`, svgo multipass at precision 2). `bun run outline` builds the sprite (one `<symbol id="pi-outline-NAME">` each, no presentation attributes, 4.8 KB) and `illustrations/outline/manifest.json` (name, file, title, viewBox, aspect, bytes); `outline:check` is part of `bun run check`. Exports: `./illustrations/outline-sprite.svg`, `./illustrations/outline/manifest.json` (and the files through `./illustrations/*`).
- **Outline doodle tokens** (`tokens/components.ts`): `--doodle-outline-stroke` (1.4px) and the line opacity per background, matched to the footer's margin doodles (2.56:1): `--doodle-outline-on-paper` (0.42, ink on paper, 2.61:1), `--doodle-outline-on-sky` (0.47, ink on sky, 2.57:1) and `--doodle-outline-on-ink` (0.3, paper on ink, 2.56:1).
- **`css/outline.css`** (export `@proudindian/design/outline.css`, opt-in): `.pi-outline` styles an `<svg><use href="#pi-outline-…"/></svg>` with those tokens (ink line, 1.4px, round caps, decorative); `.pi-outline--sky` and `.pi-outline--ink` for the other backgrounds. For pi-dash and other apps; the website's margin layer has its own placement CSS.
- **Tokens:** `--focus-ring-on-sky` (3px solid ink) for focus rings on sky surfaces, where the default sky-deep ring is only 2.16:1 (ink is 8.36:1); `--tracking-caption` (`.01em`, utility `tracking-caption`) for small sans captions; `--btn-press` (`translate(2px,2px)`) and `--btn-shadow-press` (`1px 1px 0` ink) for the pressed button.
- **`.pi-btn:active`:** the button sinks 2px into its own 3px hard shadow (the shadow shrinks to 1px, so its edge stays put), over 100ms.

### Changed

- **`.pi-btn:hover` only applies under `(hover: hover) and (pointer: fine)`,** so a tap on a touch screen no longer leaves the button lifted. The transform and box-shadow transitions now use `--ease-settle`.

## [0.2.2] (never tagged; released as part of 0.2.3)

### Added

- **Brand scrollbars: `css/scrollbar.css`** (export `@proudindian/design/scrollbar.css`, opt-in). A floating pill on a transparent track: 8px, ink at 35% with 2px of inset, solid sky on hover and while dragged. `.pi-scroll-thin` gives a 4px bar with no inset (swipe rows), and `.pi-scroll-dark` a paper-at-40% thumb (scrollers on ink). It applies only to fine pointers (`hover: hover` and `pointer: fine`), so touch devices keep their native overlay scrollbars. Chromium and Safari get the full design through `::-webkit-scrollbar`. The standard `scrollbar-width`/`scrollbar-color` are deliberately left unset there, because in Chromium 121+ they switch the pseudo-elements off and can't do the width, pill, inset or hover. Firefox gets `scrollbar-width: thin` and `scrollbar-color` in the same colours. The split is `@supports selector(::-webkit-scrollbar)`. Nothing is hidden, and native scrolling and keyboard support are unchanged.
- **Tokens:** `--scrollbar-size` (8px), `--scrollbar-size-thin` (4px), `--scrollbar-inset` (2px), `--scrollbar-thumb` (ink at 35%), `--scrollbar-thumb-hover` (sky) and `--scrollbar-thumb-dark` (paper at 40%), plus the alpha colour `--color-paper-a40`.

### Changed

- **`base.css` sets the paper background on `html` as well as `body`,** so a transparent scrollbar track shows paper, never white.

## [0.2.1] (never tagged; released as part of 0.2.3)

### Changed

- **Fonts: a small static Bricolage file for display type.** New `fonts/bricolage-grotesque-800-latin.woff2` is a static `wght` 800 / `wdth` 100 instance of the variable file, subset to Latin (about 20 KB against 78 KB; every OpenType feature is kept). `css/fonts.css` now declares Brico as two faces: the static file for exactly 800 at 100% width, which is all the brand uses, and the variable file for every other weight (200–799) and width (75–99%). Browsers only download a face a page actually uses, so the website loads 20 KB of display font instead of 78 KB, and anything that asks for another weight or width keeps working. Preload the static file. `fonts/README.md` documents how to regenerate it.
- **Z-index: the drawer and its scrim sit above the header.** `--z-scrim` goes from 40 to 70 and `--z-drawer` from 41 to 71. The fixed header (60) used to cover the top of an open side drawer. The full-screen menu (90) and the skip link (200) still sit above them.

## [0.2.0] (never tagged; released as part of 0.2.3)

### Breaking: token renames to avoid clashes with shadcn

pi-dash's shadcn/ui theme defines `--font-sans`, `--font-display`, `--color-accent` and `--color-muted`, and in Tailwind v4 the later `@theme` block wins. The brand tokens with those names are renamed, so both themes load side by side in either order. Values are unchanged. (Before 1.0, a breaking change bumps the minor version.)

| Old token | New token | Old utility | New utility |
|---|---|---|---|
| `--color-accent` | `--color-accent-ink` | `text-accent`, `bg-accent`, … | `text-accent-ink`, `bg-accent-ink`, … |
| `--color-muted` | `--color-text-muted` | `text-muted`, `bg-muted`, … | `text-text-muted`, `bg-text-muted`, … |
| `--font-display` | `--font-pi-display` | `font-display` | `font-pi-display` |
| `--font-sans` | `--font-pi-sans` | `font-sans` | `font-pi-sans` |

- **Everywhere.** The token source, `theme.css`, `tokens.css` (`--btn-font`, `--chip-font`), `tokens.json`, `scope.css` and the typed tokens are renamed. So are the primitives (`ticket.css`, `section-label.css`, `accent-word.css`), `defaults.css`, `base.css`, the style guide, and the `.design-sync` previews and conventions.
- **TS tokens.** `font.display` and `font.sans` become `font["pi-display"]` and `font["pi-sans"]`. `semanticColor.muted` and `semanticColor.accent` become `semanticColor["text-muted"]` and `semanticColor["accent-ink"]`.
- **`tokens.json`.** The keys become `font-family.pi-display`, `font-family.pi-sans`, `color-role.text-muted` and `color-role.accent-ink`.
- **The brand no longer overrides Tailwind's `--font-sans`.** Body text gets Geist in one of three ways:
  - `base.css` (`body { font-family: var(--font-pi-sans) }`);
  - `.pi-root` (`PiRoot`);
  - the `font-pi-sans` utility.

  An app on Tailwind's preflight without `base.css` keeps its own `--font-sans` on `html`.
- **`.pi-brand` no longer redefines anything.** No brand theme key is shared with shadcn any more, so the brand primitives and components render on-brand without a wrapper. This was verified against pi-dash's real theme, imported both before and after the brand theme. `.pi-brand` stays as an optional scope that only sets `font-family: var(--font-pi-sans)`. `PiRoot` now renders only `.pi-root`, which already sets the font, colour and background.
- **Clash guard.** `tokens/scope.ts` lists every `@theme inline` key in pi-dash's theme, and `bun run tokens` fails if a brand theme key reuses one of them.

### Fixed

- **`dist/tokens` is now split per module.** `index.js` re-exports from one chunk each for `primitives`, `semantic` and `components`. Built as a single file, the `semantic` and `components` objects (built with `var()` helper calls a bundler cannot prove pure) shipped with any token import. The website's client JS grew by 1,093 bytes when it switched from its local `primitives.ts` to `@proudindian/design/tokens`. Split, and side-effect-free under `sideEffects`, the unused modules are dropped: the site's JS is byte-identical to before.
- `bun run docs` pointed at `scripts/build-docs.ts`; the file is `build-docs.tsx`.
- The style guide CSS scanned the whole package for class names, so README and CHANGELOG mentions leaked dead utilities into it (old names among them). It now scans only `docs/index.html` (`source(none)`), and `docs/styleguide.css` drops from 47 kB to 41 kB with the same rendering.

## [0.1.0] (never tagged; released as part of 0.2.3)

### Added: system

- `tokens/`: the token source, imported from the website (proud-indian-ngo/website) (`primitives.ts`, `semantic.ts`, `components.ts`, `index.ts`). `build.ts` now also writes `tokens.json` (W3C design tokens, via `w3c.ts`) and `scope.css` (via `scope.ts`). `theme.css` and `tokens.css` are identical to the website's output apart from the header line. `bun run tokens` and `tokens:check` are part of `bun run check`.
- `css/`:
  - `primitives/*.css`, byte-identical copies of the website's;
  - `utilities.css` (copied);
  - `fonts.css`, now pointing at the package `fonts/`;
  - `base.css`, the generic part of the website's reset;
  - `index.css`, the entry;
  - `primitives.css`;
  - `defaults.css`, new React-only classes: `.pi-polaroid--standalone`, `__caption`, `__tag`, `.pi-tape--top`, `.pi-seal`, `.pi-root`;
  - `shadcn.css`, an optional bridge to shadcn's variables.
- `.pi-brand` (`tokens/scope.css`): a brand island for apps whose theme shares `--font-sans`, `--font-display`, `--color-accent` and `--color-muted` (pi-dash's shadcn theme).
- `react/` → `dist/react/` (ESM + `.d.ts`, React as a peer dependency): `PiRoot`, `Button`, `Chip`, `Chips`, `Sticker`, `Polaroid`, `Peg`, `Tape`, `Ticket`, `Card`, `SectionLabel`, `AccentWord`, `Doodle`, `Lockup`, `Seal`. `Doodle`, `Lockup` and `Seal` inline the package artwork through `react/generated/` (`bun run react:assets`).
- `dist/styles.css`: all package CSS compiled for apps without Tailwind, and the Claude Design `cssEntry`.
- `docs/`: the static style guide, `docs/index.html` (`bun run docs`), rendered with the real components.
- `.design-sync/`: config, conventions, previews and notes for the Claude Design project "Proud Indian Design System" (first synced 2026-10-08).
- `logo/seals/pi-seal-optimists-ring.svg`: the website hero's "Optimists · since 2019 · Bengaluru" ring, imported from the website's seal component.
- `logo/social/og-default.png`, the default share card, and its generator `logo-tools/og/render-og.mjs` (`bun run og`, output byte-identical to the website's `public/og.png`). The generator was imported from the website.
- `illustrations/manifest.json` gains `website`, which maps each doodle to its website component(s).
- `package.json`: `exports` (`.`, `./react`, `./css`, `./styles.css`, `./theme.css`, `./tokens`, `./tokens/*`, `./fonts/*`, `./logo/*`, `./illustrations/*`, …), `files`, optional `peerDependencies` (react, tailwindcss) and `sideEffects`.

### Added: assets

- The package skeleton: bun, TypeScript strict, ESM, oxlint/oxfmt (ultracite presets, as in pi-dash), lefthook, and an `exports` map.
- `fonts/`: Bricolage Grotesque and Geist woff2, with OFL licences.
- `logo/`: the final logo system (initial import), plus `logo/README.md` (usage rules) and `logo/favicon/site.webmanifest`.
- `logo-tools/`: the rebuild pipeline (`rebuild.sh`, `verify.sh`). A rebuild is byte-identical to `logo/`.
- `illustrations/`: the 21 brand doodles, extracted from inline SVG markup and optimised with svgo, with `manifest.json`, `README.md` and `contact-sheet.png`.
- `brand/`: the brand guidelines PDF and its self-contained source. The guide's visible file paths now name pi-design locations (`logo/svg`, `logo/seals`, `logo/favicon`, `logo/social`, `logo-tools/wordmark`). Pages 2, 13, 22 and 28 changed for that text only; the other 24 pages are pixel-identical to the original.
- `bun run check`, which validates the illustrations manifest.

### Initial import

`logo/`, `logo-tools/` (symbol masters, wordmark masters and builders), `fonts/` and `brand/guidelines/` are an initial import of the brand assets and tools. `fonts/OFL-bricolage-grotesque.txt` and `fonts/OFL-geist.txt` are new (taken from google/fonts). The brand guide now takes its fonts from `../../fonts/`, its logo images from `../../logo/` and its wordmark from `../../logo-tools/wordmark/`, so its duplicate copies were removed. The illustrations are new files.

### Scope: website-only assets are not included

pi-design keeps only the shared brand and system (see "What belongs here" in the README). These were in the first draft and were removed before any commit. They live in the website repo (proud-indian-ngo/website):

- all site photos and cut-outs, with their manifest and WebP versions;
- website-specific doodles: `street-scene-desktop`, `street-scene-phone`, `bunting`, `connector-curve`, and the footer margin outlines (`outline-pencil`, `-book`, `-kite`, `-heart`, `-star`, `-brush`, `-rupee`). The outline doodles were later added as a shared set in 0.2.3 (`illustrations/outline/`).

The brand guide keeps its own web-size copies of the photos and cut-outs it shows, in `brand/guidelines/assets/`.

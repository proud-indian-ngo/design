# @proudindian/design

The Proud Indian design system, and the single source of truth for the brand on screen and in print. It ships the Tailwind v4 theme and tokens, the `.pi-*` CSS primitives, the fonts, the logo system, the brand doodles and React components. The brand guidelines and the tools that regenerate all of these live here too.

Repository: https://github.com/proud-indian-ngo/design

## What's inside

| Path | What |
|---|---|
| `tokens/` | Token source in TS (`primitives.ts`, `semantic.ts`, `components.ts`, `index.ts`). `bun run tokens` generates `theme.css` (Tailwind v4 `@theme static`), `tokens.css` (plain custom properties), `tokens.json` (W3C design tokens) and `scope.css` (the optional `.pi-brand` scope; its build also fails on a token name that clashes with pi-dash's shadcn theme, see [pi-dash](#pi-dash-vite--tailwind-v4--shadcnui)). |
| `css/` | `index.css` (the entry), `fonts.css`, `base.css` (opt-in reset), `outline.css` (opt-in outline doodle styles), `primitives/*.css` (`.pi-btn`, `.pi-chip`, `.pi-sticker`, `.pi-polaroid`, `.pi-peg`, `.pi-tape`, `.pi-ticket`, `.pi-card`, `.pi-label`, `.pi-accent`, `.pi-ln`/`.pi-doodle`), `defaults.css` (React-only defaults), `utilities.css` (custom `@utility`), `shadcn.css` (optional bridge) |
| `react/` → `dist/react/` | `PiRoot`, `Button`, `Chip`/`Chips`, `Sticker`, `Polaroid` (+ `Peg`, `Tape`), `Ticket`, `Card`, `SectionLabel`, `AccentWord`, `Doodle`, `Lockup`, `Seal` |
| `dist/` | Built output, committed so git installs need no build step. Contains `react/` (ESM + `.d.ts`), `tokens/` (typed tokens) and `styles.css` (theme, tokens, fonts, base reset, primitives and React defaults compiled for apps without Tailwind; no utilities, and not the opt-in `outline.css` or `shadcn.css`) |
| `fonts/` | Bricolage Grotesque and Geist variable woff2, with their OFL licences |
| `logo/` | The logo system: `svg/`, `seals/`, `favicon/` (incl. `site.webmanifest`), `social/` (avatars, `og-default.png`). Rules: [`logo/README.md`](logo/README.md) |
| `logo-tools/` | Regenerates `logo/`, which `bun run logo:verify` proves byte-identical. `og/` renders the default share card |
| `illustrations/` | The 21 brand doodles as standalone SVGs, with `manifest.json` and a contact sheet; `outline/` holds the 18 light outline doodles (the website's margin doodles) with their own manifest, built into `outline-sprite.svg`. See [`illustrations/README.md`](illustrations/README.md) |
| `brand/` | `Proud-Indian-Brand-Guidelines.pdf` (28 pages) and its self-contained source |
| `docs/` | The static style guide, `docs/index.html` (`bun run docs`) |
| `.design-sync/` | The Claude Design sync config, previews and notes ([`NOTES.md`](.design-sync/NOTES.md)) |

## What belongs here

An asset belongs in pi-design only if it is part of the shared brand or system, meaning something other than the website also uses it. Those other users are:
- the brand guidelines
- marketing templates
- the React components
- Claude Design
- apps such as pi-dash

Content and assets that only one website section uses stay in the website repo ([proud-indian-ngo/website](https://github.com/proud-indian-ngo/website)). That covers:
- event photos and cut-outs
- the footer street scenes
- the Kalakriti bunting
- section CSS and section-specific doodles

## Installing

The package is installed from git and is not published to npm, so Cloudflare Pages can build without a registry token. `dist/` is committed, so the install needs no build step.

```jsonc
"@proudindian/design": "github:proud-indian-ngo/design#v0.2.3"
```

The repo is public, so no token is needed. To try unreleased changes locally, link the folder instead:

```jsonc
"@proudindian/design": "file:../design"   // path to your clone of this repo
```

A `file:` link copies the package together with its own `node_modules`, and bun also adds the package's devDependencies to the app's lockfile (harmless, and gone with the `github:` dependency). An app deployed from CI (the website on Cloudflare Pages) must use the `github:` dependency, because the `file:` path does not exist there. In a Vite app, add `resolve: { dedupe: ["react", "react-dom"] }` so there is only one React. After changing pi-design, run `bun run build` there, then reinstall in the app (`rm -rf node_modules/@proudindian && bun install --force`).

## Tailwind v4 import recipes

`tokens/theme.css` is a Tailwind `@theme static` block. It provides these utilities:
- colour: `bg-sky`, `text-ink`, `bg-surface-paper`, `text-text-muted`, `text-accent-ink`, `bg-donate`
- type: `font-pi-display`, `font-pi-sans`, `text-15`, `text-optimist`, `leading-lede`, `tracking-heading`
- radius and shadow: `rounded-pill`, `rounded-14`, `shadow-ink-sm`, `shadow-photo`
- layout: `max-w-section`
- motion: `ease-spring`
- breakpoints: `max-tab:` and friends

The theme also emits every variable, so hand-written CSS can use `var(--color-sky)`.

**Fonts.** The brand fonts are `--font-pi-display` (Bricolage Grotesque) and `--font-pi-sans` (Geist). Since 0.2.0 the brand does not set Tailwind's `--font-sans`, so `font-sans` keeps Tailwind's default, or the app's own (shadcn's Inter in pi-dash). Body text gets Geist from `base.css` (`body { font-family: var(--font-pi-sans) }`), from `PiRoot` (`.pi-root`) or from the `font-pi-sans` utility.

The React components only use `.pi-*` classes and inline styles, never Tailwind utilities. **No `@source` for this package is needed.** Add `@source` only for your own files.

### Any React + Vite app

```css
/* src/index.css */
@import "tailwindcss";
@import "@proudindian/design/css";
```

```tsx
import { Button, Lockup, PiRoot } from "@proudindian/design/react";
```

`css/index.css` imports, in order:
1. the theme (`@theme static`)
2. the plain tokens (in the theme layer)
3. `@font-face`
4. the optional `.pi-brand` scope (sets only `font-family: var(--font-pi-sans)`)
5. the primitives (in `@layer components`, in the website's cascade order)
6. the React defaults
7. the custom `@utility` rules

Import it after `tailwindcss` so the cascade layers exist. Without Tailwind, import `@proudindian/design/styles.css`, the compiled CSS, instead.

### The website (Astro + Tailwind v4, no preflight)

The website ([proud-indian-ngo/website](https://github.com/proud-indian-ngo/website)) deliberately leaves Tailwind's preflight out and uses the brand reset. Its `global.css` keeps its own layer order, so it imports the pieces it uses rather than `css/index.css`. The site uses neither the `.pi-brand` scope nor the React-only `defaults.css`, so leaving them out keeps its CSS from growing:

```css
@layer theme, base, components, utilities;
@source not "../../README.md";                        /* docs and scripts mention utilities the site does not use */
@source not "../../scripts";

@import "tailwindcss/theme.css" layer(theme);
@import "@proudindian/design/theme.css";
@import "@proudindian/design/tokens.css" layer(theme);
@import "@proudindian/design/fonts.css";
@import "@proudindian/design/base.css" layer(base);  /* generic reset */
@import "./base.css" layer(base);                     /* site-only base rules */
@import "./images.css" layer(base);
@import "@proudindian/design/css/primitives/doodle.css" layer(components);
/* ... the other eight primitives, one per line, in the order of css/primitives.css ... */
@import "./sections/header.css" layer(components);    /* ... the section CSS ... */
@import "tailwindcss/utilities.css" layer(utilities);
@import "@proudindian/design/css/utilities.css";
```

- **Font preloads.** `Base.astro` imports the woff2 files with `?url` (`@proudindian/design/fonts/geist-latin-wght-normal.woff2?url`). Vite fingerprints them once, so the preload URLs match the `@font-face` URLs.
- **Typed tokens.** Scripts import `PHONE_MAX`, `breakpoint` and `motion` from `@proudindian/design/tokens`. `dist/tokens` is split per module, so the client bundle carries only `primitives`.
- **Seal ring.** The hero seal ring inlines `logo/seals/pi-seal-optimists-ring.svg` at build time.
- **Favicons and the share card.** They are committed byte-identical copies in `public/`. The site's `bun run check:design` enforces this, and `bun run design:sync` re-copies them.
- **Margin doodles.** `src/components/margins/MarginSprite.astro` inlines `illustrations/outline-sprite.svg` (imported with `?raw`) once per page, keeping only the symbols the scatter uses; `MarginDoodles.astro` reads the aspect ratios from `illustrations/outline/manifest.json`, and `margins.css` uses the `--doodle-outline-*` tokens.
- **Doodles.** The site's doodle components keep their own inline SVG, because the site's section CSS styles doodle internals through classes (`pi-ln`, `f2`, `ink`, `glow`) that the svgo-optimised `illustrations/*.svg` do not have. `illustrations/manifest.json` (`website`) maps each doodle to its components.

The switch was verified pixel-identical: every section of the home page, and the privacy and 404 pages, at 1440, 2048 and 390 with reduced motion.

### pi-dash (Vite + Tailwind v4 + shadcn/ui)

No brand theme key clashes with pi-dash's shadcn theme. The four that used to clash (`--font-sans`, `--font-display`, `--color-accent`, `--color-muted`) were renamed in 0.2.0 (see the [CHANGELOG](CHANGELOG.md)). `bun run tokens` fails if a brand theme key ever reuses one of pi-dash's `@theme inline` keys (`tokens/scope.ts`). The brand CSS can go before or after the shadcn theme:

```css
/* packages/design-system/styles.css */
@import "tailwindcss" source(none);
@source "../**/*.{ts,tsx}";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@proudindian/design/css";   /* brand theme, tokens, fonts, .pi-* primitives, React defaults, utilities */
/* ... :root / .dark shadcn variables, then pi-dash's @theme inline { ... } as today ... */
/* optional: shadcn colours from the brand palette (light theme) */
@import "@proudindian/design/shadcn.css";
```

The result:
- **Shadcn keeps its meanings.** `bg-muted`, `text-accent`, `font-sans`, `font-display`, `rounded-lg` and the rest keep pi-dash's values.
- **The brand utilities are added.** These include `bg-sky`, `text-ink`, `font-pi-display`, `text-accent-ink`, `shadow-ink` and `rounded-pill`.
- **Brand components need no wrapper.** `.pi-btn`, `.pi-chip`, `.pi-label`, `.pi-ticket` and the React components render in Geist and Brico, with sky-ink accents, anywhere in the app. Wrap a page in `PiRoot` only to get the paper background and Geist body text. `className="pi-brand"` still works, as an optional scope that only sets `font-family: var(--font-pi-sans)`.

This was verified against pi-dash's real theme (its `:root`, `.dark`, `@theme inline` and base blocks). Three builds were compared: shadcn alone, the brand before shadcn, and the brand after shadcn. In all three:
- shadcn's variables (`--muted`, `--accent`, `--primary`, `--radius`, …) and its utilities computed identically;
- the body stayed in Inter;
- the unwrapped brand primitives computed identically in both orders (`.pi-btn` in Geist with its ink offset shadow, `.pi-accent` in `#08668C`).

`shadcn.css` points shadcn's own variables (`--primary`, `--muted`, `--accent`, `--ring`, `--brand`, …) at brand colours. Import it last and only if pi-dash should adopt the brand palette.

**Name clashes, checked against tailwindcss 4.3.3 and pi-dash.**
- **Tailwind defaults.** `--font-weight-*`, `--color-white`, `--color-black`, `--tracking-tighter` and `--tracking-normal` reuse default names with equal values. Every other key is a new name, so the brand no longer changes any Tailwind default.
- **pi-dash.** No shared keys.

### Other entry points

| Import | What |
|---|---|
| `@proudindian/design/theme.css` | Only the `@theme static` block |
| `@proudindian/design/tokens.css`, `/tokens.json`, `/scope.css` | Plain variables, W3C tokens, the optional `.pi-brand` scope |
| `@proudindian/design/tokens` | Typed values (`color`, `breakpoint`, `motion`, …) and `themeCss()`/`tokensCss()` |
| `@proudindian/design/primitives.css` | Only the `.pi-*` primitives |
| `@proudindian/design/fonts.css`, `/base.css`, `/shadcn.css` | As above |
| `@proudindian/design/outline.css` | `.pi-outline` (+ `--sky`, `--ink`): the outline doodle line (1.4px, ink at the matched opacity) for an `<svg><use href="#pi-outline-NAME"/></svg>` |
| `@proudindian/design/illustrations/outline-sprite.svg`, `/illustrations/outline/manifest.json` | The outline doodle sprite (`pi-outline-*` symbols, no presentation attributes) and its manifest (viewBox, aspect) |
| `@proudindian/design/styles.css` | `css/index.css` plus `base.css` compiled, no Tailwind needed (no utilities; the opt-in files are separate) |
| `@proudindian/design` or `/react` | The React components |
| `@proudindian/design/logo/…`, `/illustrations/…`, `/fonts/…` | Files |

## Commands

```sh
bun install
bun run build          # tokens + react assets, then dist/react, dist/tokens, dist/styles.css
bun run check          # tokens, react assets and the outline sprite up to date, illustrations manifest, oxfmt, oxlint
bun run check:types    # tsc (strict)
bun run fix            # oxfmt + oxlint --fix
bun run check:fallow   # fallow: unused files, exports and dependencies, and duplicated code
bun run report:health  # fallow's complexity report (advisory)
bun run check:updates  # outdated dependencies (taze); Renovate opens the PRs anyway
bun run docs           # docs/index.html + docs/styleguide.css (add --shot for /tmp/pi-design/styleguide.png)
bun run tokens         # regenerate tokens/theme.css, tokens.css, tokens.json, scope.css
bun run react:assets   # regenerate react/generated/ from illustrations/ and logo/
bun run illustrations -- <page.html>  # one-off importer: lift inline doodles from an HTML page (the SVGs in illustrations/ are the source)
bun run illustrations:sheet  # re-render illustrations/contact-sheet.png
bun run outline        # rebuild illustrations/outline-sprite.svg and outline/manifest.json from illustrations/outline/*.svg
bun run logo:rebuild   # regenerate logo/ from logo-tools/ (needs uv)
bun run logo:verify    # logo rebuild is byte-identical to logo/   (needs uv)
bun run og             # re-render logo/social/og-default.png
bun run brand:render   # re-render the brand guide PDF and page PNGs
```

**Adding a token.** Edit the right TS file (a raw value goes in `primitives.ts`, a role in `semantic.ts`, a component knob in `components.ts`), then run `bun run tokens` and `bun run build`. Names never reuse a Tailwind default name with a different value, nor any key in pi-dash's shadcn theme (the build checks the latter against `SHADCN_THEME_KEYS` in `tokens/scope.ts`; update that list when pi-dash's theme changes). Irregular scales are keyed by px (`text-15`, `rounded-14`); roles are named by use (`surface-*`, `on-ink`, `text-muted`, `accent-ink`, `donate`).

`package.json` `sideEffects` lists the TS sources as well as `*.css`. Bun's bundler drops re-exports from side-effect-free modules, so this keeps `dist/react/index.js` complete. The built `dist/` files stay tree-shakable for consumers.

## Naming

- File names are lowercase kebab-case. The logo export names keep their historical form (`pi-lockup-compact.svg`, `pi-seal-80g-SCREEN-ONLY-texture.svg`) so links stay stable.
- CSS classes are `.pi-*` (BEM-ish: `.pi-ticket__stub`, `.pi-btn--donate`). Custom properties follow Tailwind's theme namespaces (`--color-*`, `--text-*`, `--radius-*`); component knobs are unprefixed (`--btn-pad`).
- Every renamed file is recorded in `CHANGELOG.md` with its old path.

## Versioning

The package follows semver, and each release is tagged in git (`v0.2.3`). Consumers pin the tag.
- **Patch:** asset fixes and docs.
- **Minor:** new tokens, components or assets.
- **Major:** a removed or renamed export, file, class or token, or a token value change that alters the brand. Before 1.0, a breaking change bumps the minor version instead (0.2.0 renamed four tokens).

Every release is recorded in [`CHANGELOG.md`](CHANGELOG.md).

**Releasing is automatic once the version is bumped.** In a pull request:
1. Bump `version` in `package.json`.
2. Add a `## [x.y.z] - YYYY-MM-DD` section to `CHANGELOG.md`.
3. Run `bun run build && bun run docs` and commit the output (CI fails if `dist/` or `docs/` don't match the source).

When it merges, the `release` job in `.github/workflows/ci.yml` tags `vx.y.z` on that commit and publishes a GitHub release with the changelog section. It fails if the section is missing, and does nothing if the tag already exists, so merges without a version bump never release. Renovate then opens a PR in proud-indian-ngo/website to move to the new tag. Never move or delete a published tag: the website's lockfile pins the commit behind it.

## Conventions

These follow proud-indian-ngo/dash.
- **Hooks.** Lefthook (`bun install` sets it up) formats and lints staged files, checks the illustrations manifest, and checks the commit message.
- **Commits and PR titles** are [Conventional Commits](https://www.conventionalcommits.org) (`feat: …`, `fix(tokens): …`, `chore(deps): …`; lower-case subject, at most 100 characters), checked by commitlint. Pull requests are squash-merged with the PR title as the commit message.
- **CI.** The `checks` job (lint and generated files, types, fallow, and the committed build) runs on every pull request and push; it is required on `main`, which also needs a pull request with one approval (admins can push directly).
- **Dependencies.** Renovate (`renovate.json`) opens update PRs on weekday mornings (IST): patches are grouped and automerged once `checks` passes, minor updates are grouped into one PR. Dependabot security updates and secret scanning (with push protection) are on.

## Licence

The fonts are SIL OFL 1.1 (see `fonts/OFL-*.txt` and `brand/guidelines/assets/fonts/OFL-Anek.txt`). The code, logo, illustrations and the photos in the brand guide belong to Proud Indian, with all rights reserved, and are not for use outside Proud Indian's own channels. Photos of children are used with consent and only for Proud Indian.

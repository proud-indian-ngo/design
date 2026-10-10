# Agent instructions for pi-design

pi-design holds two design languages. Pick the right one before you design or style anything. Mixing them is the most common mistake.

## Which language

| You are working on | Use | Rules |
|---|---|---|
| The website (proudindian.ngo), marketing, social posts, print, merch, the logo, Claude Design mockups of brand material | **Brand** | Brand guide pages 3–28, `.design-sync/conventions.md`, `logo/README.md` |
| The dashboard (pi-dash) or any other app people work in: tables, forms, settings, admin screens | **Product** | Brand guide appendices A1 (colour and type) and A2 (shape, density, components, tables), pages 29–31 |

The brand guide is `brand/Proud-Indian-Brand-Guidelines.pdf`; its source is `brand/guidelines/index.html`.

## Brand: warm, playful, sticker-like

- Paper (`--color-paper`) backgrounds, ink text, sky bands.
- Bricolage Grotesque at weight 800 for headlines; Geist for text.
- 1.5px ink outlines with hard offset shadows (`--shadow-ink`), pill and 14–26px radii.
- Doodles, polaroids, tape, tickets, stickers: the `.pi-*` CSS primitives and the React components (`PiRoot`, `Button`, `Chip`, `Sticker`, `Polaroid`, `Ticket`, `Card`, `SectionLabel`, `AccentWord`, `Doodle`).
- Marigold means Donate.

## Product: quiet and dense

- White (light) or neutral charcoal (dark) surfaces: `color-ui-*` and `color-ui-dark-*`. Never paper.
- Bricolage Grotesque at weight 600, only for page titles, big numbers and dates. Geist for everything people read. Paper Mono (`--font-pi-mono`) for amounts, dates, counts, IDs, emails and table headers.
- Sky marks state (active nav item, tab, toggle): sky ink on sky wash, or sky on charcoal. One primary button per screen, in brand blue.
- Status is a soft tint with a dot and a word (`color-status-*`). Marigold is never a status.
- Hairline borders, no offset shadows, 5/7/10px radii, 13px text, 32px controls, 36px table rows.
- Apps build their own components (pi-dash uses shadcn/ui) and take only `theme.css` and `fonts.css` from this package.

## Never cross over

- Product screens never use the `.pi-*` primitives, the React components, `PiRoot`, doodles, paper backgrounds, ink offset shadows, Bricolage 800 or marigold.
- Product screens never import `shadcn.css`. It maps shadcn onto the older paper palette; pi-dash maps its own shadcn variables onto the `color-ui-*` tokens instead.
- Brand material never uses the `color-ui-*`, `color-ui-dark-*` or `color-status-*` tokens, or Paper Mono.
- The logo is the one shared element. In product screens it is the disc in the sidebar (28px), or the compact lockup on sign-in pages only.

## Working in this repo

- Commands, layout and release steps are in `README.md`. Record user-facing changes in `CHANGELOG.md` and bump `package.json` (merging tags the release).
- After changing the brand guide, run `bun run brand:render` and commit the re-rendered PDF.

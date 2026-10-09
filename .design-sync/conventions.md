# Proud Indian design system: how to build with it

Proud Indian is a volunteer-run charitable trust in Bengaluru, founded on 26 January 2019. Its volunteers are called **Optimists**, and the website opens with "Be an Optimist." Programmes: Teach, Feed, Paint (Kalakriti, the yearly arts festival) and Gather. The look is warm, playful and sticker-like: sky, ink and paper; Bricolage Grotesque 800 headlines; Geist text; 1.5px ink outlines with hard offset shadows; hand-drawn doodles.

## Setup
Wrap every design in `PiRoot`. It sets the paper background, Geist text and ink colour. The components render on-brand without it (no token clashes with shadcn/ui), but previews still use it for the page background and text.

```jsx
const { PiRoot, Button, SectionLabel, AccentWord, Card, Polaroid, Ticket, Doodle, Lockup, Seal } = window.ProudIndianDesign;

<PiRoot>
  <Lockup layout="compact" height={30} />
  <SectionLabel num="01">Education</SectionLabel>
  <h2>Four ways we <AccentWord>show up.</AccentWord></h2>
  <Button variant="ink" arrow href="https://dash.proudindian.ngo/register">Become an Optimist</Button>
</PiRoot>
```

## Styling idiom
Use the components and their props first. For layout glue, use the CSS custom properties (Tailwind v4 theme names). Don't invent colours.
- **Colour:** `--color-sky` (#4CC0EC, bands), `--color-sky-deep` (#0B7FAE, the logo head on light, large type), `--color-sky-ink` (#08668C, small cyan text on paper), `--color-ink` (#0F1B24), `--color-paper` (#F6F2EA), `--color-paper-2` (#EFE9DE), `--color-marigold` (#F4A62A), `--color-mute`. Roles: `--color-surface-*`, `--color-on-ink`, `--color-text-muted`, `--color-accent-ink`, `--color-donate`.
- **Type:** `--font-pi-display` (Bricolage Grotesque, used at weight 800, tracking `--tracking-heading`) and `--font-pi-sans` (Geist). Sizes are keyed by px: `--text-15` is 15px. No italics anywhere; emphasis is an `AccentWord`.
- **Lines and shadows:** `--line-ink` (1.5px ink), `--shadow-ink` (3px hard offset), `--shadow-photo`, `--shadow-card-sky`. Offset shadows never blur.
- **Radius:** `--radius-pill`, `--radius-14`, `--radius-26` (cards).
- **Motion:** `--ease-spring`, `--ease-settle`; keep motion subtle and respect reduced motion.

## Rules
- **Marigold means donate.** `Button variant="donate"` and marigold are only for donation actions, plus the Kalakriti accent on ink. Marigold is never part of the logo.
- **Text on sky is ink.** Never sky text on paper (1.87:1). White on sky only as an outlined accent word (`AccentWord variant="outline"`, 40px and up).
- **Logo:** use `Lockup` or `Seal`; never redraw, recolour the heads, add effects or set it on busy photos. Colour on paper, `reversed` on ink, `mono` on sky. Compact lockup below 32px tall.
- **Photos:** only real, consented photos of our own programmes, never stock. Event photos are not in this package (they live in the website repo); previews use placeholders. Crop or blur name badges if a full name is readable.
- **Facts must stay true:** 3.6k+ Optimists, 14k+ volunteer hours, 23k+ people reached, 95% of funds go to programmes. 80G and 12A registered, NGO Darpan KA/2019/0234065, PAN AAETP0762C. Don't invent other numbers or per-rupee impact claims.
- **Donations are one-time only** (Razorpay; minimum ₹100). Never design a monthly toggle.
- **Volunteer sign-up** links to `https://dash.proudindian.ngo/register`.
- **Voice:** short, warm, plain English. "Weekends", never "every Saturday". Kalakriti is a festival, never a workshop.

Per-component APIs and examples are in each `components/<group>/<Name>/<Name>.prompt.md`.

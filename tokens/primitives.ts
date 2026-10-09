/**
 * Primitive tokens: raw values with no meaning attached.
 *
 * Source of truth for the Proud Indian style system. `build.ts` turns them into:
 *   theme.css   a Tailwind v4 `@theme static` block (colours, fonts, type scale, radii, shadows, breakpoints,
 *               containers, easings), so `bg-sky`, `text-ink`, `font-pi-display`, `shadow-ink-sm`, `rounded-pill`,
 *               `max-tab:` and friends exist;
 *   tokens.css  plain custom properties for everything Tailwind has no namespace for (z-index, durations, loop
 *               timings, spacing steps used by the hand-written CSS, component knobs).
 * Values are written exactly as the website's CSS writes them, so CSS moved onto the tokens renders pixel-identical.
 *
 * Naming. Names never reuse a Tailwind default name with a different value, so pi-dash can import this theme on top
 * of Tailwind's defaults. Irregular scales (type, radius, space) are keyed by their px value: `text-15` is 15px.
 *
 * This folder stays self-contained (no imports from outside tokens/).
 */

/** Brand palette (brand/guidelines). */
export const color = {
  sky: "#4CC0EC",
  skyDeep: "#0B7FAE",
  skyInk: "#08668C",
  skyWash: "#E9F5FA",
  skyTint: "#BFE6F6",
  ink: "#0F1B24",
  mute: "#3A4650",
  paper: "#F6F2EA",
  paper2: "#EFE9DE",
  marigold: "#F4A62A",
  white: "#FFFFFF",
  black: "#000000",
} as const;

/**
 * Product interfaces (pi-dash and any later app): the neutrals and status colours a dense screen needs, which the
 * website never uses (brand/guidelines, appendix A1). Light mode is white with greys tinted toward ink; dark mode is a
 * neutral charcoal. Sky stays the brand accent in both: sky ink on sky wash (light) and sky on `ui-dark-active` (dark)
 * mark the active or selected item. Every text colour here passes WCAG 4.5:1 on its own surface:
 *   ui-mute 5.87 and ui-label 4.93 on white; ui-dark-text 14.22, ui-dark-mute 6.48 and ui-dark-label 5.05 on
 *   ui-dark-card; sky 6.09 on ui-dark-active; status-* 5.93 / 6.52 / 6.54 on white; status-*-dark 10.39 / 9.29 / 7.28
 *   on ui-dark-card.
 * Marigold is never a status colour: it keeps meaning Donate.
 */
export const productColor = {
  // light
  uiCanvas: "#FAFBFB",
  uiSidebar: "#F6F7F8",
  uiField: "#F1F3F4",
  uiLine: "#E7EAED",
  uiLineSoft: "#EEF0F2",
  uiMute: "#5B6670",
  uiLabel: "#66727C",
  // dark (charcoal)
  uiDarkPage: "#161618",
  uiDarkSidebar: "#111113",
  uiDarkCanvas: "#131315",
  uiDarkCard: "#1E1E21",
  uiDarkRaised: "#27272B",
  uiDarkLine: "#2F2F34",
  uiDarkLineSoft: "#28282C",
  uiDarkText: "#EDEDEF",
  uiDarkMute: "#A1A1A9",
  uiDarkLabel: "#8D8D95",
  /** sky at 14% over ui-dark-card: the active item's background in dark mode */
  uiDarkActive: "#24353D",
  // status: the text colour, plus the dot shown beside the word
  statusPending: "#8A5A00",
  statusPendingDot: "#E0A526",
  statusDone: "#1F6B3A",
  statusDoneDot: "#3FA866",
  statusRejected: "#B3261E",
  statusRejectedDot: "#D9443A",
  statusPendingDark: "#F1C76B",
  statusDoneDark: "#7FD3A0",
  statusRejectedDark: "#FF8A80",
  statusRejectedDotDark: "#E5584D",
} as const;

/**
 * Alpha variants the site uses. Keys are the alpha in percent; values are written exactly as the site's CSS
 * writes them so the output is byte-for-byte the same colour. `bg-ink-a30`, `border-paper-a35`, ...
 */
export const alpha = {
  ink: {
    5: ".05",
    7: ".07",
    14: ".14",
    16: ".16",
    25: ".25",
    28: ".28",
    30: ".3",
    35: ".35",
    40: ".4",
    50: ".5",
  },
  paper: {
    0: ".0",
    8: ".08",
    10: ".1",
    16: ".16",
    35: ".35",
    40: ".4",
    55: ".55",
    60: ".6",
    78: ".78",
    82: ".82",
    86: ".86",
    90: ".9",
    94: ".94",
  },
  paper2: { 82: ".82" },
  sky: { 55: ".55" },
  black: { 25: ".25", 55: ".55", 60: ".6", 80: ".8" },
  /** warm paper grain inside the Kalakriti poster */
  tan: { 25: ".25" },
} as const;

/** rgb triplets for the alpha variants (emitted in rgba() form) */
export const rgb = {
  ink: "15,27,36",
  paper: "246,242,234",
  paper2: "239,233,222",
  sky: "76,192,236",
  black: "0,0,0",
  tan: "196,180,150",
} as const;

/** Bricolage Grotesque (heavy display, 800) and Geist (text). No italics anywhere. Emitted as `--font-pi-display` and
 *  `--font-pi-sans` (utilities `font-pi-display`, `font-pi-sans`): the `pi-` keeps them clear of Tailwind's and
 *  shadcn's `--font-sans` / `--font-display`. Paper Mono (`--font-pi-mono`) is the data font of product interfaces:
 *  amounts, dates, counts, IDs and table headers. The website does not use it. */
export const font = {
  "pi-display": 'Brico,"Arial Black",system-ui,sans-serif',
  "pi-sans": 'Geist,system-ui,-apple-system,"Segoe UI",sans-serif',
  "pi-mono": 'PaperMono,ui-monospace,"SF Mono",Menlo,monospace',
} as const;

/** Same names and values as Tailwind's defaults. */
export const weight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * Type scale in px: every size the site uses more than once (one-offs stay literal). Each step also sets
 * line-height: normal, which is what a `font:` shorthand resets it to; add a `leading-*` to change it.
 */
export const text = [
  11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 18, 19, 20,
  21, 22, 24, 26, 27, 30, 32, 34, 40, 44, 46, 52, 56, 60, 64, 84, 92, 96, 104,
  128, 132,
] as const;

/** Fluid display sizes (the giant words): `text-optimist`, `text-verb`, ... */
export const display = {
  /** hero "Optimist." */
  optimist: "clamp(140px,19vw,300px)",
  /** "Optimist." on phones */
  "optimist-phone": "20.5vw",
  /** programme verbs (Teach. Feed. Gather.); the script then fits each verb to its band */
  verb: "clamp(110px,24vw,370px)",
  /** programme verbs on phones */
  "verb-phone": "27vw",
} as const;

/** Line heights. `none` matches Tailwind's; the rest use names Tailwind does not. */
export const leading = {
  none: "1",
  display: ".9",
  title: "1.05",
  label: "1.2",
  body: "1.3",
  lede: "1.42",
  copy: "1.5",
} as const;

/** Letter spacing. `tighter` and `normal` match Tailwind's values; the rest use names Tailwind does not. */
export const tracking = {
  tightest: "-.055em",
  tighter: "-.05em",
  poster: "-.045em",
  heavy: "-.04em",
  heading: "-.035em",
  title: "-.03em",
  subtitle: "-.025em",
  label: "-.02em",
  body: "-.01em",
  normal: "0",
  /** small sans captions (13px and under) open up slightly */
  caption: ".01em",
  ticket: ".02em",
  caps: ".08em",
  stamp: ".11em",
  sign: ".22em",
} as const;

/**
 * Spacing steps in px used by the hand-written CSS (`var(--space-14)`). Markup uses Tailwind's own spacing, which is
 * 4px-based and takes quarter steps (p-3.5 is 14px), so no Tailwind override is needed.
 */
export const space = [
  2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44,
  48, 54, 56, 64, 72, 80, 84, 88, 96, 104, 110, 112, 120, 128,
] as const;

/** Radii in px (`rounded-14`), plus the two shapes (`rounded-pill`, `rounded-round`). */
export const radius = [3, 4, 5, 6, 8, 10, 14, 18, 20, 22, 24, 26, 28] as const;
export const radiusShape = { pill: "99px", round: "50%" } as const;

export const border = { hair: "1px", ink: "1.5px", heavy: "2px" } as const;

/**
 * Z-index layers for fixed and overlay UI (`z-(--z-header)`). Local stacking inside a section stays literal. A modal
 * side drawer and its scrim sit above the fixed header (the header must not cover an open drawer); the full-screen
 * menu stays on top of both.
 */
export const z = {
  stickyBar: 50,
  programmeIndex: 55,
  header: 60,
  scrim: 70,
  drawer: 71,
  menu: 90,
  skipLink: 200,
} as const;

/**
 * Breakpoints, as Tailwind v4 `--breakpoint-*` (min-width). The design is desktop-first, so most overrides use the
 * `max-*` variants: `max-tab:` is phones (700px and below), `tab:` is 701px and up. In hand-written CSS use
 * `@media (width < --theme(--breakpoint-tab))`. The client scripts import the numbers from here.
 */
export const breakpoint = {
  /** max-pad: 600px and below */
  pad: 601,
  /** max-tab: phones, 700px and below; tab: 701px and up */
  tab: 701,
  /** max-lap: 1100px and below */
  lap: 1101,
  /** max-nav: 1180px and below (header links collapse into the menu) */
  nav: 1181,
  /** max-desk: 1239px and below */
  desk: 1240,
  /** wide: 1440px and up */
  wide: 1440,
} as const;

/** px value of the phone breakpoint, for scripts */
export const PHONE_MAX = breakpoint.tab - 1;
export const shortScreen = 640;

/** Max widths of the centred containers (`max-w-section`, ...). */
export const container = {
  hero: "1600px",
  scene: "1600px",
  band: "1520px",
  collage: "1440px",
  footer: "1328px",
  kalakriti: "1320px",
  section: "1264px",
  drawer: "600px",
} as const;

/** Motion. Only transform, opacity, clip-path and stroke-dashoffset animate. */
export const motion = {
  duration: {
    fast: "150ms",
    base: "200ms",
    medium: "250ms",
    slow: "300ms",
    slower: "350ms",
  },
  /** `ease-settle`, `ease-spring`, ... (Tailwind's ease-in/out/in-out are left alone) */
  ease: {
    settle: "cubic-bezier(.22,1,.36,1)",
    spring: "cubic-bezier(.34,1.56,.64,1)",
    draw: "cubic-bezier(.65,0,.35,1)",
    overshoot: "cubic-bezier(.3,.9,.4,1)",
    wipe: "cubic-bezier(.45,0,.1,1)",
    fall: "cubic-bezier(.45,0,.85,.55)",
    glide: "cubic-bezier(.4,0,.2,1)",
  },
  /** scroll-in reveal (site scripts), in ms */
  reveal: {
    stagger: 75,
    rise: 560,
    riseTilt: 640,
    riseFade: 420,
    slap: 540,
    hang: 640,
    draw: 700,
    wipe: 480,
    riseDistance: 24,
  },
  /** continuous loops, one per section; each is a `.loop` paused off-screen */
  loop: {
    sun: "60s",
    marquee: "38s",
    sway: "3.4s",
    "csun-rays": "8s",
    wink: "8s",
    leaf: "7s",
    steam: "4.8s",
    beat: "5s",
    mini: "5s",
    twinkle: "6s",
    glint: "6s",
    tick: "12s",
    ring: "12s",
    bob: "5s",
    pencil: "10s",
    hop: "6s",
    kite: "7s",
    flap: "5s",
    gbird: "6s",
    look: "9s",
    wisp: "4.8s",
  },
} as const;

/**
 * Semantic tokens: roles that point at primitives. Prefer these in components.
 * Values are CSS strings that reference the primitive custom properties.
 */

const v = (name: string) => `var(--${name})`;
const ink = v("color-ink");
const paper = v("color-paper");
const sky = v("color-sky");

/** Semantic colours, emitted into the Tailwind theme: `bg-surface-sky`, `text-text-muted`, `bg-donate`, ...
 *  `text-muted` and `accent-ink` avoid shadcn's `--color-muted` / `--color-accent`. */
export const semanticColor = {
  "surface-sky": sky,
  "surface-paper": paper,
  "surface-paper-2": v("color-paper-2"),
  "surface-ink": ink,
  "surface-card": v("color-white"),
  "surface-wash": v("color-sky-tint"),
  "surface-deep": v("color-sky-ink"),
  "on-sky": ink,
  "on-ink": paper,
  "on-ink-muted": v("color-paper-a82"),
  "text-muted": v("color-mute"),
  "accent-ink": v("color-sky-ink"),
  "accent-on-ink": sky,
  /** marigold is for donate and Kalakriti only; never part of the logo */
  donate: v("color-marigold"),
  festival: v("color-marigold"),
  link: v("color-sky-ink"),
  focus: v("color-sky-deep"),
} as const;

/** Shadows, emitted into the Tailwind theme: `shadow-ink-sm`, `shadow-photo`, `shadow-card-sky`, ...
 *  Offset "sticker" shadows are always hard (no blur); only `soft` blurs. */
export const shadow = {
  "ink-sm": `2px 2px 0 ${ink}`,
  ink: `3px 3px 0 ${ink}`,
  "ink-md": `4px 4px 0 ${ink}`,
  "paper-sm": `2px 2px 0 ${paper}`,
  paper: `3px 3px 0 ${paper}`,
  "paper-md": `4px 4px 0 ${paper}`,
  sky: `3px 3px 0 ${sky}`,
  photo: `4px 5px 0 ${ink}`,
  "photo-sm": `3px 4px 0 ${ink}`,
  "card-sky": `8px 8px 0 ${sky},8px 8px 0 1.5px ${ink}`,
  "card-sky-sm": `6px 6px 0 ${sky},6px 6px 0 1.5px ${ink}`,
  "card-paper": `8px 8px 0 ${paper},8px 8px 0 1.5px ${ink}`,
  "card-paper-sm": `6px 6px 0 ${paper},6px 6px 0 1.5px ${ink}`,
  "ring-ink": `0 0 0 1.5px ${ink}`,
  "ring-paper": `0 0 0 1.5px ${paper}`,
  soft: `0 10px 24px ${v("color-ink-a30")}`,
} as const;

/** Plain semantic custom properties (tokens.css). */
export const semantic = {
  "focus-ring": `3px solid ${v("color-sky-deep")}`,
  "focus-ring-on-dark": `3px solid ${sky}`,
  /** on sky surfaces the default sky-deep ring is only 2.16:1; ink is 8.36:1 */
  "focus-ring-on-sky": `3px solid ${ink}`,
  "focus-offset": "3px",

  // lines
  "line-ink": `${v("border-ink")} solid ${ink}`,
  "line-ink-dashed": `${v("border-ink")} dashed ${ink}`,
  "line-paper": `${v("border-ink")} solid ${paper}`,

  /** die-cut sticker: a 5px paper outline drawn with four hard drop-shadows, then a soft lift */
  "sticker-outline": `drop-shadow(5px 0 0 ${paper}) drop-shadow(-5px 0 0 ${paper}) drop-shadow(0 -5px 0 ${paper}) drop-shadow(0 5px 0 ${paper})`,
  "sticker-lift": `drop-shadow(0 16px 22px ${v("color-ink-a28")})`,
  /** an ink hairline traced round any shape (the "Four ways" card, session tickets) */
  "hairline-ink": `drop-shadow(1.5px 0 0 ${ink}) drop-shadow(-1.5px 0 0 ${ink}) drop-shadow(0 1.5px 0 ${ink}) drop-shadow(0 -1.5px 0 ${ink})`,

  /** accent words on cyan bands (decision 1B): white fill, ink outline, ink offset */
  "accent-fill": v("color-white"),
  "accent-stroke": `1.5px ${ink}`,
  "accent-shadow": `3px 3px 0 ${ink}`,
  "accent-stroke-lg": `3px ${ink}`,

  // layout
  "header-h": "76px",
  "header-h-phone": "66px",
} as const;

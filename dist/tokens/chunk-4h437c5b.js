// tokens/semantic.ts
var v = (name) => `var(--${name})`;
var ink = v("color-ink");
var paper = v("color-paper");
var sky = v("color-sky");
var semanticColor2 = {
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
  donate: v("color-marigold"),
  festival: v("color-marigold"),
  link: v("color-sky-ink"),
  focus: v("color-sky-deep")
};
var shadow2 = {
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
  soft: `0 10px 24px ${v("color-ink-a30")}`
};
var semantic2 = {
  "focus-ring": `3px solid ${v("color-sky-deep")}`,
  "focus-ring-on-dark": `3px solid ${sky}`,
  "focus-ring-on-sky": `3px solid ${ink}`,
  "focus-offset": "3px",
  "line-ink": `${v("border-ink")} solid ${ink}`,
  "line-ink-dashed": `${v("border-ink")} dashed ${ink}`,
  "line-paper": `${v("border-ink")} solid ${paper}`,
  "sticker-outline": `drop-shadow(5px 0 0 ${paper}) drop-shadow(-5px 0 0 ${paper}) drop-shadow(0 -5px 0 ${paper}) drop-shadow(0 5px 0 ${paper})`,
  "sticker-lift": `drop-shadow(0 16px 22px ${v("color-ink-a28")})`,
  "hairline-ink": `drop-shadow(1.5px 0 0 ${ink}) drop-shadow(-1.5px 0 0 ${ink}) drop-shadow(0 1.5px 0 ${ink}) drop-shadow(0 -1.5px 0 ${ink})`,
  "accent-fill": v("color-white"),
  "accent-stroke": `1.5px ${ink}`,
  "accent-shadow": `3px 3px 0 ${ink}`,
  "accent-stroke-lg": `3px ${ink}`,
  "header-h": "76px",
  "header-h-phone": "66px"
};

export { semanticColor2, shadow2, semantic2 };

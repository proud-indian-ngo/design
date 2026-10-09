// tokens/components.ts
var v = (name) => `var(--${name})`;
var components2 = {
  "btn-font": `${v("font-weight-semibold")} ${v("text-15")} ${v("font-pi-sans")}`,
  "btn-pad": "12px 20px",
  "btn-pad-lg": "16px 28px",
  "btn-pad-xl": "18px 30px",
  "btn-radius": v("radius-pill"),
  "btn-border": v("line-ink"),
  "btn-shadow": v("shadow-ink"),
  "btn-shadow-hover": v("shadow-ink-md"),
  "btn-lift": "translate(-1px,-1px)",
  "btn-press": "translate(2px,2px)",
  "btn-shadow-press": `1px 1px 0 ${v("color-ink")}`,
  "chip-font": `${v("font-weight-semibold")} ${v("text-13-5")} ${v("font-pi-sans")}`,
  "chip-pad": "6px 13px",
  "chip-bg": v("color-surface-paper"),
  "polaroid-bg": v("color-surface-card"),
  "polaroid-pad": "9px 9px 0",
  "polaroid-shadow": v("shadow-photo"),
  "polaroid-frame-bg": v("color-surface-paper-2"),
  "peg-bg": v("color-marigold"),
  "tape-bg": v("color-sky-a55"),
  "ticket-notch": "12px",
  "ticket-stub": "84px",
  "ticket-h": "158px",
  "ticket-h-phone": "150px",
  "ticket-shadow": `drop-shadow(0 14px 16px ${v("color-black-a55")})`,
  "card-radius": v("radius-26"),
  "card-pad": "24px 26px",
  sticker: `${v("sticker-outline")} ${v("sticker-lift")}`,
  "doodle-outline-stroke": "1.4px",
  "doodle-outline-on-paper": "0.42",
  "doodle-outline-on-sky": "0.47",
  "doodle-outline-on-ink": "0.3"
};

export { components2 };

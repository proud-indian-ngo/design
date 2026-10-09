/**
 * Component tokens, only where a primitive needs its own knobs. Consumed by css/primitives/.
 */

const v = (name: string) => `var(--${name})`;

export const components = {
  // Button (.pi-btn)
  "btn-font": `${v("font-weight-semibold")} ${v("text-15")} ${v("font-pi-sans")}`,
  "btn-pad": "12px 20px",
  "btn-pad-lg": "16px 28px",
  "btn-pad-xl": "18px 30px",
  "btn-radius": v("radius-pill"),
  "btn-border": v("line-ink"),
  "btn-shadow": v("shadow-ink"),
  "btn-shadow-hover": v("shadow-ink-md"),
  "btn-lift": "translate(-1px,-1px)",
  /** pressed: the button sinks into its own 3px hard shadow (2px move + 1px shadow keeps the shadow's edge still) */
  "btn-press": "translate(2px,2px)",
  "btn-shadow-press": `1px 1px 0 ${v("color-ink")}`,

  // Chip (.pi-chip)
  "chip-font": `${v("font-weight-semibold")} ${v("text-13-5")} ${v("font-pi-sans")}`,
  "chip-pad": "6px 13px",
  "chip-bg": v("color-surface-paper"),

  // Polaroid (.pi-polaroid)
  "polaroid-bg": v("color-surface-card"),
  "polaroid-pad": "9px 9px 0",
  "polaroid-shadow": v("shadow-photo"),
  "polaroid-frame-bg": v("color-surface-paper-2"),
  "peg-bg": v("color-marigold"),
  "tape-bg": v("color-sky-a55"),

  // Ticket (.pi-ticket)
  "ticket-notch": "12px",
  "ticket-stub": "84px",
  "ticket-h": "158px",
  "ticket-h-phone": "150px",
  "ticket-shadow": `drop-shadow(0 14px 16px ${v("color-black-a55")})`,

  // Card (.pi-card, the bento tiles)
  "card-radius": v("radius-26"),
  "card-pad": "24px 26px",

  // Sticker (.pi-sticker)
  sticker: `${v("sticker-outline")} ${v("sticker-lift")}`,

  // Outline doodles (css/outline.css, illustrations/outline/): the light line doodles in the website's margins.
  // The line is ink on paper and sky, paper on ink, at an opacity matched to the footer's margin doodles (paper at
  // 0.3 on ink, 2.56:1): each value is the smallest alpha (2 dp) reaching that contrast on its background (sRGB
  // alpha blend, WCAG relative luminance). Paper on sky tops out at 1.87:1, so sky uses ink.
  "doodle-outline-stroke": "1.4px",
  "doodle-outline-on-paper": "0.42", // ink line on paper (#F6F2EA): 2.61:1
  "doodle-outline-on-sky": "0.47", // ink line on sky (#4CC0EC): 2.57:1
  "doodle-outline-on-ink": "0.3", // paper line on ink (#0F1B24): 2.56:1, the footer's own value
} as const;

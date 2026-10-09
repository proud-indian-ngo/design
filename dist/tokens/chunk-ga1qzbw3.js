// tokens/primitives.ts
var color = {
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
  black: "#000000"
};
var alpha = {
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
    50: ".5"
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
    94: ".94"
  },
  paper2: { 82: ".82" },
  sky: { 55: ".55" },
  black: { 25: ".25", 55: ".55", 60: ".6", 80: ".8" },
  tan: { 25: ".25" }
};
var rgb = {
  ink: "15,27,36",
  paper: "246,242,234",
  paper2: "239,233,222",
  sky: "76,192,236",
  black: "0,0,0",
  tan: "196,180,150"
};
var font = {
  "pi-display": 'Brico,"Arial Black",system-ui,sans-serif',
  "pi-sans": 'Geist,system-ui,-apple-system,"Segoe UI",sans-serif'
};
var weight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
};
var text = [
  11,
  11.5,
  12,
  12.5,
  13,
  13.5,
  14,
  14.5,
  15,
  15.5,
  16,
  16.5,
  17,
  18,
  19,
  20,
  21,
  22,
  24,
  26,
  27,
  30,
  32,
  34,
  40,
  44,
  46,
  52,
  56,
  60,
  64,
  84,
  92,
  96,
  104,
  128,
  132
];
var display = {
  optimist: "clamp(140px,19vw,300px)",
  "optimist-phone": "20.5vw",
  verb: "clamp(110px,24vw,370px)",
  "verb-phone": "27vw"
};
var leading = {
  none: "1",
  display: ".9",
  title: "1.05",
  label: "1.2",
  body: "1.3",
  lede: "1.42",
  copy: "1.5"
};
var tracking = {
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
  caption: ".01em",
  ticket: ".02em",
  caps: ".08em",
  stamp: ".11em",
  sign: ".22em"
};
var space = [
  2,
  3,
  4,
  6,
  8,
  10,
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  26,
  28,
  30,
  32,
  34,
  36,
  40,
  44,
  48,
  54,
  56,
  64,
  72,
  80,
  84,
  88,
  96,
  104,
  110,
  112,
  120,
  128
];
var radius = [3, 4, 5, 6, 8, 10, 14, 18, 20, 22, 24, 26, 28];
var radiusShape = { pill: "99px", round: "50%" };
var border = { hair: "1px", ink: "1.5px", heavy: "2px" };
var z = {
  stickyBar: 50,
  programmeIndex: 55,
  header: 60,
  scrim: 70,
  drawer: 71,
  menu: 90,
  skipLink: 200
};
var breakpoint = {
  pad: 601,
  tab: 701,
  lap: 1101,
  nav: 1181,
  desk: 1240,
  wide: 1440
};
var PHONE_MAX = breakpoint.tab - 1;
var shortScreen = 640;
var container = {
  hero: "1600px",
  scene: "1600px",
  band: "1520px",
  collage: "1440px",
  footer: "1328px",
  kalakriti: "1320px",
  section: "1264px",
  drawer: "600px"
};
var motion = {
  duration: {
    fast: "150ms",
    base: "200ms",
    medium: "250ms",
    slow: "300ms",
    slower: "350ms"
  },
  ease: {
    settle: "cubic-bezier(.22,1,.36,1)",
    spring: "cubic-bezier(.34,1.56,.64,1)",
    draw: "cubic-bezier(.65,0,.35,1)",
    overshoot: "cubic-bezier(.3,.9,.4,1)",
    wipe: "cubic-bezier(.45,0,.1,1)",
    fall: "cubic-bezier(.45,0,.85,.55)",
    glide: "cubic-bezier(.4,0,.2,1)"
  },
  reveal: {
    stagger: 75,
    rise: 560,
    riseTilt: 640,
    riseFade: 420,
    slap: 540,
    hang: 640,
    draw: 700,
    wipe: 480,
    riseDistance: 24
  },
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
    wisp: "4.8s"
  }
};

export { color, alpha, rgb, font, weight, text, display, leading, tracking, space, radius, radiusShape, border, z, breakpoint, PHONE_MAX, shortScreen, container, motion };

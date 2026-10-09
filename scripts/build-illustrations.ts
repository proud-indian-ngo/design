/**
 * Lift every doodle out of the final website prototype into standalone, optimised SVGs in illustrations/.
 *
 *   bun run illustrations                       # source: ../proud-indian-design/prototypes/final/index.html
 *   PI_PROTOTYPE=/path/to/index.html bun run illustrations
 *
 * In the prototype the doodles are styled by page CSS (`.ln`, `.ft-ln`, `.s`, `.f2` …). Here that styling is
 * turned into presentation attributes so each file renders on its own:
 *   - the root carries fill="none" stroke="currentColor" + the line width, round caps and joins;
 *   - ink (#0F1B24) fills become currentColor, so the line colour follows CSS `color`;
 *   - palette fills (sky, marigold, paper, white) stay as hex; any CSS fill rule overrides them;
 *   - styling-only classes are dropped, animation hook classes (see HOOKS) are kept.
 * The script is a one-off importer; the generated files in illustrations/ are the source of truth from now on.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { optimize } from "svgo";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC =
  process.env.PI_PROTOTYPE ??
  join(ROOT, "..", "proud-indian-design", "prototypes", "final", "index.html");
const OUT = join(ROOT, "illustrations");

const INK = "#0F1B24";
const PAPER = "#F6F2EA";
const PAPER_2 = "#EFE9DE";
const SKY = "#4CC0EC";
const SUN = "#F4A62A";

/** Classes the prototype animates (site.css / site.js). Everything else is styling and is removed. */
const HOOKS = new Set([
  "rays",
  "wink",
  "leaf",
  "steam",
  "s1",
  "s2",
  "s3",
  "glint",
  "tw",
  "beat",
  "mini",
  "bells",
  "hand",
  "tk",
  "t1",
  "t2",
  "t3",
  "pencil",
  "hop",
  "wing",
  "nudge__hand",
  "rest",
  "coins",
  "pot",
  "kite",
]);

interface Style {
  /** Root stroke width. */
  width: number;
  /** Classes that mean "stroked line" in this doodle's CSS. */
  stroked: string[];
  /** Per-class presentation attributes (the doodle's CSS rules). */
  classes?: Record<string, Record<string, string>>;
  /** Elements with no stroked class are line art too (footer margin doodles). */
  allStroked?: boolean;
  nonScaling?: boolean;
}

interface Def {
  name: string;
  title: string;
  /** Regex on the whole <svg>…</svg> source; nth match (default 0). */
  match: RegExp;
  nth?: number;
  style: Style;
  /** Override the viewBox; content is translated so the box starts at 0 0. */
  viewBox?: [number, number, number, number];
  /** Keep only this inner fragment (regex on the inner markup). */
  crop?: RegExp;
  stretch?: boolean;
  note?: string;
}

const LN: Style = { width: 3, stroked: ["ln", "thin"] };
const FT: Style = { width: 3, stroked: ["ft-ln"] };
/** Street-scene line style (the kite is cropped from the site footer scene). */
const SCENE: Style = {
  width: 2.25,
  stroked: ["s"],
  nonScaling: true,
  classes: {
    f2: { fill: PAPER_2 },
    fp: { fill: PAPER },
    ac: { fill: SKY },
    bl: { fill: SKY, stroke: "none" },
    eye: { fill: "currentColor", stroke: "none" },
    str: { "stroke-dasharray": "0 6.5" },
  },
};

const DEFS: Def[] = [
  {
    name: "sun",
    title: "Smiling sun with rays (winks)",
    match: /class="dd csun/,
    style: LN,
  },
  {
    name: "sparkle",
    title: "Four-point sparkle",
    match: /class="dd psp"/,
    style: LN,
  },
  {
    name: "sparkle-glint",
    title: "Sparkle with a glint",
    match: /class="dd kspark/,
    style: LN,
  },
  {
    name: "star",
    title: "Five-point star with glints",
    match: /class="dd bstar/,
    style: LN,
  },
  {
    name: "book",
    title: "Open book, page turning (Teach)",
    match: /class="dd dB1 book/,
    style: LN,
  },
  {
    name: "bowl-steam",
    title: "Bowl with rising steam (Feed)",
    match: /class="dd dB1 bowl/,
    style: LN,
  },
  {
    name: "heart",
    title: "Beating heart with a mini heart (Gather)",
    match: /class="dd dB1 heart/,
    style: LN,
  },
  {
    name: "heart-plain",
    title: "Heart, sky fill",
    match:
      /class="dd " aria-hidden="true"><path class="ln" style="fill:#4CC0EC" d="M50 86/,
    style: LN,
  },
  {
    name: "paintbrush",
    title: "Paintbrush (Kalakriti nav icon)",
    match: /viewBox="1\.4 -1 100 100"/,
    viewBox: [1.4, -1, 100, 100],
    style: {
      ...LN,
      classes: { f: { fill: SUN }, f2: { fill: "currentColor" } },
    },
  },
  {
    name: "hands-raised",
    title: "Two raised hands (Volunteer)",
    match:
      /class="dd" aria-hidden="true"><path class="ln" fill="#4CC0EC" d="M30 92/,
    style: LN,
  },
  {
    name: "hand-point",
    title: "Pointing hand (scroll nudge)",
    match: /<svg viewBox="0 0 96 64">/,
    style: LN,
  },
  {
    name: "clock",
    title: "Alarm clock (ticks and rings)",
    match: /class="dd vclock/,
    style: LN,
  },
  {
    name: "notepad",
    title: "Checklist notepad with pencil",
    match: /class="dd tr-list/,
    style: LN,
    note: "Ticks keep pathLength=1 for the draw-on animation.",
  },
  { name: "bird", title: "Bird (hops)", match: /class="dd gl-bird/, style: LN },
  {
    name: "paper-plane",
    title: "Paper plane with a looping dashed trail",
    match: /class="fC-plane"/,
    style: FT,
  },
  {
    name: "matka",
    title: "Matka (clay pot) with two rupee coins",
    match: /<svg viewBox="0 0 240 210">/,
    style: { width: 3, stroked: ["ink"] },
    note: "The empty .coins group is where site.js drops coins.",
  },
  {
    name: "squiggle-underline",
    title: "Squiggle underline",
    match: /class="dd tr-squig"/,
    style: LN,
    stretch: true,
  },
  {
    name: "underline-loop",
    title: "Underline with a loop",
    match: /class="dd cloop/,
    style: LN,
    stretch: true,
  },
  {
    name: "arrow-curve",
    title: "Curved arrow",
    match: /class="dd parr"/,
    style: LN,
  },
  {
    name: "arrow-wavy",
    title: "Wavy arrow",
    match: /viewBox="0 0 140 40"/,
    style: LN,
  },
  {
    name: "kite",
    title: "Kite on a dotted string (from the street scene)",
    match: /class="fC-scene loop dk"/,
    crop: /<g class="kite">.*?<\/g>/s,
    viewBox: [430, 14, 62, 202],
    style: SCENE,
  },
];

const html = readFileSync(SRC, "utf8");
const svgs = [...html.matchAll(/<svg\b.*?<\/svg>/gs)].map((m) => m[0]);

const parseAttrs = (s: string): [string, string][] =>
  [...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [
    m[1] as string,
    m[2] as string,
  ]);

const STYLE_PROPS = new Set([
  "fill",
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "opacity",
]);

const fmt = (n: number) => String(Math.round(n * 1000) / 1000);

function rewriteElement(
  tag: string,
  attrsSrc: string,
  selfClose: string,
  style: Style
): string {
  const attrs = new Map(parseAttrs(attrsSrc));
  const classes = (attrs.get("class") ?? "").split(/\s+/).filter(Boolean);
  attrs.delete("class");
  // inline style -> presentation attributes
  const inline = attrs.get("style");
  attrs.delete("style");
  const out = new Map<string, string>();
  const isShape =
    /^(path|circle|ellipse|rect|line|polyline|polygon|text)$/.test(tag);
  const stroked =
    style.allStroked || classes.some((c) => style.stroked.includes(c));
  if (isShape && !stroked && !attrs.has("stroke")) out.set("stroke", "none");
  if (isShape && !stroked && !attrs.has("fill") && tag !== "text")
    out.set("fill", "currentColor");
  if (isShape && stroked && style.nonScaling)
    out.set("vector-effect", "non-scaling-stroke");
  for (const c of classes)
    for (const [k, v] of Object.entries(style.classes?.[c] ?? {}))
      out.set(k, v);
  for (const [k, v] of attrs) out.set(k, v);
  if (inline) {
    for (const decl of inline.split(";")) {
      const [k, v] = decl.split(":").map((x) => x.trim());
      if (k && v && STYLE_PROPS.has(k)) out.set(k, v);
      else if (k && v)
        out.set(
          "style",
          `${out.get("style") ? `${out.get("style")};` : ""}${k}:${v}`
        );
    }
  }
  if (tag === "text") {
    out.set("fill", "currentColor");
    out.set("stroke", "none");
    out.set("font-family", "Geist, sans-serif");
    out.set("font-weight", "700");
    out.set("font-size", "13");
    out.set("letter-spacing", "2.86");
  }
  for (const k of ["fill", "stroke"]) {
    const v = out.get(k);
    if (v && v.toUpperCase() === INK) out.set(k, "currentColor");
  }
  const hooks = classes.filter((c) => HOOKS.has(c));
  if (hooks.length) out.set("class", hooks.join(" "));
  const attrStr = [...out].map(([k, v]) => ` ${k}="${v}"`).join("");
  return `<${tag}${attrStr}${selfClose}>`;
}

function build(def: Def): { svg: string; viewBox: string; hooks: string[] } {
  const found = svgs.filter((s) => def.match.test(s));
  const src = found[def.nth ?? 0];
  if (!src) throw new Error(`${def.name}: no match for ${def.match}`);
  const open = src.match(/^<svg[^>]*>/)?.[0] ?? "";
  let inner = src.slice(open.length, src.lastIndexOf("</svg>"));
  if (def.crop) inner = inner.match(def.crop)?.[0] ?? "";
  const vbSrc = open.match(/viewBox="([^"]+)"/)?.[1] ?? "";
  const vb =
    def.viewBox ??
    (vbSrc.split(/\s+/).map(Number) as [number, number, number, number]);
  inner = inner.replace(
    /<(\w+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g,
    (_m, tag: string, a: string, sc: string) =>
      rewriteElement(tag, a, sc ? "/" : "", def.style)
  );
  if (vb[0] !== 0 || vb[1] !== 0)
    inner = `<g transform="translate(${fmt(-vb[0])} ${fmt(-vb[1])})">${inner}</g>`;
  const viewBox = `0 0 ${fmt(vb[2])} ${fmt(vb[3])}`;
  const root = [
    `xmlns="http://www.w3.org/2000/svg"`,
    `viewBox="${viewBox}"`,
    def.stretch ? `preserveAspectRatio="none"` : "",
    `fill="none"`,
    `stroke="currentColor"`,
    `stroke-width="${def.style.width}"`,
    `stroke-linecap="round"`,
    `stroke-linejoin="round"`,
  ]
    .filter(Boolean)
    .join(" ");
  const raw = `<svg ${root}>${inner}</svg>`;
  const { data } = optimize(raw, {
    multipass: true,
    floatPrecision: 2,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            cleanupIds: false,
            collapseGroups: false,
            mergePaths: false,
            convertShapeToPath: false,
            removeEmptyContainers: false,
            moveElemsAttrsToGroup: false,
            moveGroupAttrsToElems: false,
            removeUnknownsAndDefaults: { keepRoleAttr: true },
          },
        },
      },
    ],
  });
  const hooks = [
    ...new Set(
      [...data.matchAll(/class="([^"]+)"/g)].flatMap((m) =>
        (m[1] as string).split(" ")
      )
    ),
  ];
  return { svg: `${data}\n`, viewBox, hooks };
}

/** pi-website's src/components/doodles/*.astro that draw the same art (2026-10-08). */
const WEBSITE: Record<string, string[]> = {
  sun: ["HeroSun (no .wink)", "CollageSun"],
  sparkle: ["Sparkle"],
  "sparkle-glint": ["KalaSparkle"],
  star: ["PosterStar"],
  book: ["Book", "IndexBook (no .leaf)"],
  "bowl-steam": ["Bowl", "IndexBowl"],
  heart: ["HeartBeat"],
  "heart-plain": ["HeartBadge", "HeartChip (stroke 6)"],
  paintbrush: ["IndexBrush"],
  "hands-raised": ["HandsUp", "IndexHands"],
  "hand-point": ["NudgeHand"],
  clock: ["AlarmClock"],
  notepad: ["Notepad"],
  bird: ["PerchedBird", "ClosingBird (no .hop)"],
  "paper-plane": ["ClosingPlane"],
  matka: ["Matka"],
  "squiggle-underline": ["Squiggle", "ClosingSquiggle"],
  "underline-loop": ["UnderlineLoop"],
  "arrow-curve": ["TicketArrow"],
  "arrow-wavy": ["StepArrow", "SwipeArrow (head at x 100–114)"],
  kite: [],
};

mkdirSync(OUT, { recursive: true });
const manifest = DEFS.map((def) => {
  const { svg, viewBox, hooks } = build(def);
  writeFileSync(join(OUT, `${def.name}.svg`), svg);
  return {
    name: def.name,
    file: `${def.name}.svg`,
    title: def.title,
    viewBox,
    stretch: Boolean(def.stretch),
    animationHooks: hooks,
    website: WEBSITE[def.name] ?? [],
    bytes: Buffer.byteLength(svg),
    ...(def.note ? { note: def.note } : {}),
  };
});
writeFileSync(
  join(OUT, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);
console.log(`illustrations: ${manifest.length} SVGs -> ${OUT}`);

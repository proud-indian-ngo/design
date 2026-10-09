/**
 * Build the outline doodle sprite and manifest from illustrations/outline/*.svg.
 *
 *   bun run outline           # writes illustrations/outline-sprite.svg and illustrations/outline/manifest.json
 *   bun run outline:check     # fails if either is out of date, or a source is malformed (part of `bun run check`)
 *
 * The outline doodles are the light line set drawn in the website's margins: one
 * non-scaling stroke each, no fills, no animation hooks. Each source is a standalone SVG (root: fill none,
 * stroke currentColor, the 1.4 line, round caps and joins) holding paths with vector-effect="non-scaling-stroke",
 * already optimised with svgo (multipass, floatPrecision 2). The sprite holds one <symbol id="pi-outline-NAME"> per
 * file with the same viewBox and paths but no presentation attributes, so the page styles the line from the <svg>
 * that <use>s it (fill, stroke, stroke-width and opacity inherit into the clone): see css/outline.css and the
 * --doodle-outline-* tokens.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { failOn } from "./lib/generated";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "illustrations", "outline");
const SPRITE = join(ROOT, "illustrations", "outline-sprite.svg");
const MANIFEST = join(DIR, "manifest.json");
const check = process.argv.includes("--check");

/** Every outline doodle, in sprite order, with its title. */
const TITLES: Record<string, string> = {
  pencil: "Pencil",
  book: "Open book",
  kite: "Kite with a bowed tail",
  heart: "Heart",
  star: "Five-point star",
  rupee: "Rupee coin",
  sun: "Smiling sun with rays",
  sparkle: "Four-point sparkle",
  notepad: "Checklist notepad",
  clock: "Alarm clock",
  plane: "Paper plane with a trail",
  matka: "Matka (clay pot)",
  brush: "Paintbrush",
  bowl: "Bowl with rising steam",
  hands: "Two raised hands",
  note: "Music notes",
  drum: "Dhol (drum)",
  tick: "Tick in a circle",
};
const ROOT_ATTRS =
  'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';

const errors: string[] = [];
const files = readdirSync(DIR).filter((f) => f.endsWith(".svg"));
for (const f of files)
  if (!(f.slice(0, -4) in TITLES))
    errors.push(
      `illustrations/outline/${f}: not listed in TITLES (scripts/build-outline.ts)`
    );

const items = Object.entries(TITLES).flatMap(([name, title]) => {
  const file = `${name}.svg`;
  if (!files.includes(file)) {
    errors.push(`illustrations/outline/${file}: listed in TITLES but missing`);
    return [];
  }
  const src = readFileSync(join(DIR, file), "utf8").trim();
  const m = src.match(
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="([^"]+)" ([^>]*)>(.*)<\/svg>$/s
  );
  if (!m) {
    errors.push(
      `illustrations/outline/${file}: expected one root <svg> with a viewBox`
    );
    return [];
  }
  const [, viewBox, attrs, body] = m as unknown as [
    string,
    string,
    string,
    string,
  ];
  if (attrs !== ROOT_ATTRS)
    errors.push(
      `illustrations/outline/${file}: root attributes must be ${ROOT_ATTRS}`
    );
  const paths = body.match(/<path [^>]*\/>/g) ?? [];
  if (!paths.length || paths.join("") !== body)
    errors.push(
      `illustrations/outline/${file}: the body must be <path> elements only`
    );
  if (paths.some((p) => !p.includes('vector-effect="non-scaling-stroke"')))
    errors.push(
      `illustrations/outline/${file}: every path needs vector-effect="non-scaling-stroke"`
    );
  if (/\b(fill|stroke|class|style)=/.test(body))
    errors.push(
      `illustrations/outline/${file}: paths carry no fill, stroke, class or style (the root or the page sets them)`
    );
  const [, , w, h] = viewBox.split(" ").map(Number) as [
    number,
    number,
    number,
    number,
  ];
  return [
    {
      name,
      file: `outline/${file}`,
      title,
      viewBox,
      aspect: Math.round((w / h) * 100) / 100,
      body,
      bytes: Buffer.byteLength(src) + 1,
    },
  ];
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">${items
  .map(
    (i) =>
      `<symbol id="pi-outline-${i.name}" viewBox="${i.viewBox}">${i.body}</symbol>`
  )
  .join("")}</svg>\n`;
const manifest = `${JSON.stringify(
  items.map(({ name, file, title, viewBox, aspect, bytes }) => ({
    name,
    file,
    title,
    viewBox,
    aspect,
    bytes,
  })),
  null,
  2
)}\n`;

const read = (p: string) => {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return "";
  }
};
if (check) {
  if (read(SPRITE) !== sprite)
    errors.push(
      "illustrations/outline-sprite.svg is out of date: run `bun run outline`"
    );
  if (read(MANIFEST) !== manifest)
    errors.push(
      "illustrations/outline/manifest.json is out of date: run `bun run outline`"
    );
}
failOn(errors, "outline");
if (!check) {
  writeFileSync(SPRITE, sprite);
  writeFileSync(MANIFEST, manifest);
}
console.log(
  `outline: ${items.length} doodles, sprite ${Buffer.byteLength(sprite)} bytes${check ? " (up to date)" : " written"}`
);

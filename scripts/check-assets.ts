/**
 * Validate the illustrations manifest: every listed SVG exists with the listed viewBox,
 * and every file in illustrations/ is listed. Exits non-zero on any problem.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { failOn } from "./lib/generated";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "illustrations"
);
const IGNORE = new Set([
  "manifest.json",
  "README.md",
  "contact-sheet.png",
  ".DS_Store",
  // the outline set has its own manifest, built and checked by scripts/build-outline.ts (outline:check)
  "outline",
  "outline-sprite.svg",
]);
const errors: string[] = [];

interface Illustration {
  file: string;
  viewBox: string;
}
const items = JSON.parse(
  readFileSync(join(DIR, "manifest.json"), "utf8")
) as Illustration[];
const listed = new Set<string>();
for (const i of items) {
  if (listed.has(i.file)) errors.push(`illustrations/${i.file}: listed twice`);
  listed.add(i.file);
  const p = join(DIR, i.file);
  if (!existsSync(p)) {
    errors.push(`illustrations/${i.file}: listed in the manifest but missing`);
  } else if (!readFileSync(p, "utf8").includes(`viewBox="${i.viewBox}"`)) {
    errors.push(
      `illustrations/${i.file}: viewBox does not match the manifest (${i.viewBox})`
    );
  }
}
for (const f of readdirSync(DIR)) {
  if (!IGNORE.has(f) && !listed.has(f)) {
    errors.push(
      `illustrations/${f}: file is not listed in illustrations/manifest.json`
    );
  }
}

failOn(errors, "check:assets");
console.log(`check:assets: ${items.length} illustrations OK`);

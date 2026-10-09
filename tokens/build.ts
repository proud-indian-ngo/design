/**
 * Writes the generated token files next to this file:
 *   theme.css    Tailwind v4 `@theme static` block
 *   tokens.css   plain custom properties (:root)
 *   tokens.json  W3C design tokens
 *   scope.css    .pi-brand, an optional brand-text scope; also fails the build on a shadcn key clash (scope.ts)
 *
 *   bun run tokens         write
 *   bun run tokens:check   exit 1 if any file is stale (part of `bun run check`)
 *
 * Adapted from pi-website src/styles/tokens/build.ts (adds tokens.json).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { themeCss, tokenGroups, tokensCss } from "./index";
import { scopeCss } from "./scope";
import { tokensJson } from "./w3c";

const dir = import.meta.dir;
const out: [string, string][] = [
  [join(dir, "theme.css"), themeCss()],
  [join(dir, "tokens.css"), tokensCss()],
  [join(dir, "tokens.json"), tokensJson(tokenGroups())],
  [join(dir, "scope.css"), scopeCss(tokenGroups())],
];
const check = process.argv.includes("--check");
let stale = false;
for (const [file, content] of out) {
  let cur = "";
  try {
    cur = readFileSync(file, "utf8");
  } catch {
    cur = "";
  }
  if (cur === content) continue;
  if (check) {
    console.error(`stale: ${file} (run \`bun run tokens\`)`);
    stale = true;
  } else {
    writeFileSync(file, content);
    console.log(`wrote ${file}`);
  }
}
if (stale) process.exit(1);
if (check) console.log("tokens: up to date");

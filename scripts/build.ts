/**
 * Build the JS entry points into dist/:
 *   dist/react/index.js (+ .d.ts)   the React components (React is a peer dependency, kept external)
 *   dist/tokens/index.js (+ .d.ts)  the typed token values and the theme/tokens CSS generators (split per module)
 *   dist/styles.css                 the compiled CSS for apps without Tailwind (and Claude Design)
 * Runs `tokens` and `react:assets` first so generated sources are current.
 */
import { rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { $ } from "bun";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(ROOT);
rmSync("dist", { recursive: true, force: true });
await $`bun tokens/build.ts`.quiet();
await $`bun scripts/build-react-assets.ts`.quiet();

// dist/tokens is split per module (index re-exports from one chunk each for primitives, semantic and components).
// `semantic` and `components` are built with var() helper calls that a bundler cannot prove pure, so in a single file
// they would ship with any token import; split, and side-effect-free per `sideEffects` (dist/ is not listed), the
// modules a consumer does not use are dropped (pi-website imports only breakpoints and motion).
for (const [entrypoints, outdir] of [
  [["react/index.ts"], "dist/react"],
  [
    [
      "tokens/index.ts",
      "tokens/primitives.ts",
      "tokens/semantic.ts",
      "tokens/components.ts",
    ],
    "dist/tokens",
  ],
] as const) {
  const res = await Bun.build({
    entrypoints: entrypoints.map((e) => `./${e}`),
    outdir,
    splitting: entrypoints.length > 1,
    format: "esm",
    target: "browser",
    external: ["react", "react/jsx-runtime", "react-dom"],
    minify: false,
    // production JSX (react/jsx-runtime, not jsx-dev-runtime)
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    jsx: { runtime: "automatic", development: false },
  });
  if (!res.success) {
    for (const log of res.logs) console.error(log);
    process.exit(1);
  }
}
await $`bunx tsc -p tsconfig.build.json`;

// dist/styles.css: the whole package CSS compiled once (Tailwind theme + brand theme, fonts, base, primitives) for
// consumers without Tailwind: plain HTML, email-ish pages, Claude Design. Utilities are not included.
writeFileSync(
  "dist/_styles.css",
  `@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "../css/index.css";
@import "../css/base.css" layer(base);
@source not "../**/*";
`
);
await $`bunx @tailwindcss/cli -i dist/_styles.css -o dist/styles.css`.quiet();
rmSync("dist/_styles.css");
console.log("built dist/react, dist/tokens and dist/styles.css");

/**
 * Writes the generated token files next to this file:
 *   theme.css    Tailwind v4 `@theme static` block
 *   tokens.css   plain custom properties (:root)
 *   tokens.json  W3C design tokens
 *   scope.css    .pi-brand, an optional brand-text scope; also fails the build on a shadcn key clash (scope.ts)
 *
 *   bun run tokens         write
 *   bun run tokens:check   exit 1 if any file is stale (part of `bun run check`)
 */
import { join } from "node:path";

import { writeGenerated } from "../scripts/lib/generated";
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
writeGenerated(out, "tokens", "bun run tokens");

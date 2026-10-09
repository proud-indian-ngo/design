/**
 * tokens.json in the W3C Design Tokens Community Group format (https://tr.designtokens.org/format/).
 * Built from the same groups as theme.css and tokens.css, so every token keeps its CSS custom property name in
 * `$extensions["ngo.proudindian"].css`. A value that is exactly `var(--x)` of another token becomes an alias
 * (`{group.x}`); composite values (shadows, filters, shorthands) stay as their CSS string.
 */
import type { Group } from "./index";

type Token = {
  $value: unknown;
  $type?: string;
  $extensions: { "ngo.proudindian": { css: string; theme: boolean } };
};
type Tree = Record<string, Record<string, Token> | string>;

const GROUP_KEY: Record<string, string> = {
  Colour: "color",
  "Colour alpha": "color-alpha",
  "Colour roles": "color-role",
  "Font family": "font-family",
  "Font weight": "font-weight",
  "Type scale": "font-size",
  "Line height": "line-height",
  "Letter spacing": "letter-spacing",
  Radius: "radius",
  Shadow: "shadow",
  Breakpoint: "breakpoint",
  Container: "container",
  Easing: "easing",
  "Border width": "border-width",
  "Space (hand-written CSS)": "space",
  "Z-index": "z-index",
  Duration: "duration",
  Loop: "loop",
  Semantic: "semantic",
  Component: "component",
};

const PREFIX =
  /^(color|font-weight|font|text|leading|tracking|radius|shadow|breakpoint|container|ease|border|space|z|dur|loop)-/;
/** "color-sky-deep" in group "color" -> "sky-deep" */
const short = (name: string) => name.replace(PREFIX, "");

const isColor = (v: string) =>
  /^#[0-9a-f]{3,8}$/i.test(v) || /^rgba?\(/.test(v);
const isDimension = (v: string) => /^-?[\d.]+(px|em|rem|%)$/.test(v);

function typeOf(group: string, v: string): { $type?: string; $value: unknown } {
  if (group === "font-family") {
    return {
      $type: "fontFamily",
      $value: v.split(",").map((f) => f.trim().replace(/^"|"$/g, "")),
    };
  }
  if (group === "font-weight" || group === "z-index") {
    return {
      $type: group === "font-weight" ? "fontWeight" : "number",
      $value: Number(v),
    };
  }
  if (group === "duration" || group === "loop") {
    const ms = v.endsWith("ms")
      ? Number.parseFloat(v)
      : Number.parseFloat(v) * 1000;
    return { $type: "duration", $value: `${ms}ms` };
  }
  if (group === "easing") {
    const m = v.match(/cubic-bezier\(([^)]+)\)/);
    if (m?.[1])
      return { $type: "cubicBezier", $value: m[1].split(",").map(Number) };
  }
  if (isColor(v)) return { $type: "color", $value: v };
  if (isDimension(v)) return { $type: "dimension", $value: v };
  return { $value: v };
}

export function tokensJson(groups: Group[]): string {
  // css name -> json path, for aliases
  const path = new Map<string, string>();
  for (const g of groups) {
    const key = GROUP_KEY[g.title] ?? g.title;
    for (const [name] of g.vars) path.set(name, `${key}.${short(name)}`);
  }
  const tree: Tree = {
    $description:
      "Proud Indian design tokens (@proudindian/design). Generated from tokens/*.ts; do not edit. CSS: theme.css (Tailwind v4 @theme) and tokens.css.",
  };
  for (const g of groups) {
    const key = GROUP_KEY[g.title] ?? g.title;
    const out: Record<string, Token> = {};
    for (const [name, value] of g.vars) {
      if (name.endsWith("--line-height")) continue; // Tailwind's paired line-height for text-* steps
      const alias = value.match(/^var\(--([\w-]+)\)$/)?.[1];
      const typed =
        alias && path.has(alias)
          ? { $value: `{${path.get(alias)}}` }
          : typeOf(key, value);
      out[short(name)] = {
        ...typed,
        $extensions: {
          "ngo.proudindian": { css: `--${name}`, theme: g.theme },
        },
      };
    }
    tree[key] = out;
  }
  return `${JSON.stringify(tree, null, 2)}\n`;
}

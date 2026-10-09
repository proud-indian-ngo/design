import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...ultracite.ignorePatterns,
    "**/*.md",
    "brand/**",
    "logo/**",
    "logo-tools/**",
    "illustrations/**",
    "fonts/**",
    "dist/**",
    "docs/**",
    "tokens/theme.css",
    "tokens/tokens.css",
    "tokens/tokens.json",
    "tokens/scope.css",
    "react/generated/**",
    "css/primitives/**",
  ],
});

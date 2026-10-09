import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

export default defineConfig({
  env: {
    browser: true,
    builtin: true,
    node: true,
  },
  ignorePatterns: [
    ...core.ignorePatterns,
    "brand/**",
    "logo-tools/**",
    "dist/**",
    "docs/**",
    "react/generated/**",
  ],
  plugins: ["typescript", "unicorn", "oxc", "react", "jsx-a11y"],
  categories: {
    correctness: "error",
  },
  rules: {
    // as in pi-dash: role="img" spans carry cut-outs and seals with HTML centres
    "jsx-a11y/prefer-tag-over-role": "off",
  },
});

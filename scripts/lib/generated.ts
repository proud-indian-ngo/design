/** Shared by the generators (tokens, React assets, outline sprite) and the asset check. */
import { readFileSync, writeFileSync } from "node:fs";

const read = (file: string) => {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
};

/**
 * Write each [file, content] pair whose content changed; with `--check` on the command line, write nothing and exit 1
 * if any file is stale. `label` names the output, `regen` the command that rebuilds it.
 */
export function writeGenerated(
  out: [string, string][],
  label: string,
  regen: string
) {
  const check = process.argv.includes("--check");
  let stale = false;
  for (const [file, content] of out) {
    if (read(file) === content) continue;
    if (check) {
      console.error(`stale: ${file} (run \`${regen}\`)`);
      stale = true;
    } else {
      writeFileSync(file, content);
      console.log(`wrote ${file}`);
    }
  }
  if (stale) process.exit(1);
  if (check) console.log(`${label}: up to date`);
}

/** Print the problems and exit 1, if there are any. */
export function failOn(errors: string[], label: string) {
  if (!errors.length) return;
  console.error(errors.map((e) => `  ✗ ${e}`).join("\n"));
  console.error(`${label}: ${errors.length} problem(s)`);
  process.exit(1);
}

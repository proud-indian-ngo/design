# Swapping in a new wordmark

The symbol is locked (it's read from `symbol/`). The wordmark is the **only** input to change. Every lockup and the whole `logo/` export are regenerated from it.

## One command

```bash
# from the pi-design root
logo-tools/rebuild.sh path/to/new-wordmark.svg
bun run logo:verify   # after committing the new output, a rebuild must be byte-identical
```

What it does:
1. Checks that the file carries the required metrics.
2. Archives the old input as `wordmark/previous-<timestamp>.svg`.
3. Copies the new file to `wordmark/current.svg`.
4. Rebuilds every master SVG into `.build/masters/` (`build.py`).
5. Lays them out into `../logo/` and rasterises the PNGs (`export.mjs`).

Run `rebuild.sh` with no argument to rebuild with the current wordmark.

## The wordmark file format

A plain SVG: outlined paths with `fill="currentColor"` (no live text, no fonts), with these metrics on the root `<svg>`:

| Attribute | Meaning |
|---|---|
| `data-cap` | Cap height, in the file's units |
| `data-baseline` | y of the baseline (cap top = baseline − cap) |
| `data-left`, `data-right` | x of the leftmost and rightmost ink (used for spacing and widths) |
| `data-stem` | Vertical stem weight (`build.py` prints the symbol-to-letter weight balance) |
| `data-status` | `provisional` or `final` (default `final`). Anything but `final` adds "(wordmark provisional)" to the SVG titles |

Example (the provisional placeholder used before the final Anek Latin wordmark; `wordmark/current.svg` is now `wm-H.svg`):

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 362 45" data-cap="40" data-baseline="40"
     data-stem="9.76" data-left="4.18" data-right="356.71" data-status="provisional"> … </svg>
```

Units are free. The lockup builders scale the symbol to the wordmark's cap height:
- **Symbol scale:** cap ÷ 67, so the arm top sits on cap height and the feet on the baseline.
- **Gaps:** symbol-to-word gap = 0.75 × cap (compact: 0.6 × cap, symbol thickened 0.9 units per edge).
- **Stacked:** the symbol is 1.9 × cap tall, 0.55 × cap above the cap line, centred on the wordmark's ink.

Word spacing and kerning live inside the wordmark file itself.

## Files involved

- `wordmark.py`: loads the input.
- `build.py`:
  - `horizontal()`, `stacked()` and `wordmark_only()` take the wordmark as a parameter
  - writes every `pi-*.svg` master to `.build/masters/`
- `export.mjs`: lays the masters out into `logo/` and rasterises the PNGs.
- `rebuild.sh`: the one command. `verify.sh`: rebuild to a temp dir and compare with `logo/`.

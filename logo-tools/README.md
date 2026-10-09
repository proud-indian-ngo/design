# logo-tools

Regenerates everything in `../logo/` from two inputs: the locked symbol and the wordmark.

```sh
bun run logo:rebuild   # logo-tools/rebuild.sh: build.py -> .build/masters/, export.mjs -> logo/
bun run logo:verify    # rebuild into a temp dir; fail unless it is byte-identical to logo/
```

Needs `uv`, because `py.sh` runs Python with fonttools, brotli, uharfbuzz and pillow. It also needs the package's devDependencies installed: Playwright 1.63.0 Chromium rasterises the PNGs, and byte-identical PNGs depend on that exact version.

| Path | What | Copied from (proud-indian-design) |
|---|---|---|
| `symbol/` | The locked symbol masters (`pi-tuned-*.svg`), the hand-built 16 px favicon (`favicon16.py`, `favicon-16*.png`, `favicon-16.svg`) | `prototypes/_brand5-tuned/final/`, `_brand5-tuned/_tools/favicon16.py` |
| `wordmark/current.svg` | The wordmark input. Identical to `wm-H.svg` | `prototypes/_brand6/_tools/wordmark/current.svg` |
| `wordmark/wm-H.svg`, `wm-H-small.svg`, `wm-F-H.svg` | Final wordmark masters: regular, small size (24–40 px), stacked block | `prototypes/_wordmark/final/` |
| `build.py`, `master.py`, `wordmark.py`, `type.py`, `pi4.py`, `marks2.py` | Builders: lockups, discs, tiles, favicon.svg, seals (Geist ring text) | `prototypes/_brand6/_tools/` |
| `export.mjs` | Lays the masters out into `logo/{svg,seals,favicon,social}` and rasterises the PNGs | `_brand6/_tools/export6.mjs` |
| `rebuild.sh`, `verify.sh`, `py.sh` | Entry points | `_brand6/_tools/rebuild.sh`, `py.sh` (`verify.sh` is new) |

`type.py` outlines glyphs from `../fonts/*.woff2` (the site fonts) and caches the decompressed TTFs in `/tmp/pi-design-logo-tools/`. To swap the wordmark, see `SWAP_WORDMARK.md`.

These steps were not brought over: the prototype brand board (`board6.py`, `board6.css`), the site preview (`site6.py`) and the screenshot helpers (`shoot*.mjs`, `sheet.mjs`, `bbox.mjs`). They depend on the prototype and remain in proud-indian-design.

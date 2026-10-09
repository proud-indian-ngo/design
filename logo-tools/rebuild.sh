#!/bin/bash
# One command to regenerate the whole logo system into logo/.
#   logo-tools/rebuild.sh                     # rebuild with the current wordmark (wordmark/current.svg)
#   logo-tools/rebuild.sh path/to/new.svg     # adopt a new wordmark, then rebuild
#   PI_LOGO_OUT=/tmp/x logo-tools/rebuild.sh  # write the layout somewhere else (verify.sh does this)
# Needs uv (py.sh pulls the Python deps) and node with this package's devDependencies installed
# (Playwright's Chromium rasterises the PNGs).
set -e
cd "$(dirname "$0")"
if [ -n "$1" ]; then
  grep -q 'data-cap=' "$1" && grep -q 'data-baseline=' "$1" && grep -q 'data-left=' "$1" && grep -q 'data-right=' "$1" && grep -q 'data-stem=' "$1" \
    || { echo "wordmark SVG must carry data-cap, data-baseline, data-left, data-right and data-stem (see SWAP_WORDMARK.md)"; exit 1; }
  if [ "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")" != "$(pwd)/wordmark/current.svg" ]; then
    cp wordmark/current.svg "wordmark/previous-$(date +%Y%m%d-%H%M%S).svg"
    cp "$1" wordmark/current.svg
  fi
fi
./py.sh build.py                          # masters from the locked symbol + wordmark -> .build/masters/
node export.mjs "${PI_LOGO_OUT:-../logo}" # svg/, seals/, favicon/, social/ + rasterised PNGs

#!/bin/bash
# Rebuild the logo system into a temp dir and check it is byte-identical to logo/.
# Only generated files are compared (logo/README.md and favicon/site.webmanifest are hand-written).
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
PI_LOGO_OUT="$OUT" ./rebuild.sh >/dev/null
fail=0
while IFS= read -r f; do
  rel=${f#"$OUT"/}
  if ! cmp -s "$f" "../logo/$rel"; then echo "DIFFERS: logo/$rel"; fail=1; fi
done < <(find "$OUT" -type f)
n=$(find "$OUT" -type f | wc -l | tr -d ' ')
rm -rf "$OUT"
if [ $fail -eq 0 ]; then echo "logo-tools: $n generated files are byte-identical to logo/"; else exit 1; fi

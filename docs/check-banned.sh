#!/usr/bin/env bash
# Usage: ./check-banned.sh /path/to/theme [/path/to/private-banned.txt]
# Keep this script and the two .txt lists OUTSIDE or in a docs folder; keep the PRIVATE file outside the repo.
THEME="${1:-.}"
PRIVATE="${2:-$HOME/.alchemia-private-banned.txt}"
HERE="$(cd "$(dirname "$0")" && pwd)"
EXCL=(--exclude-dir=.git --exclude-dir=node_modules --exclude=banned-*.txt --exclude=check-banned.sh --exclude-dir=docs --exclude-dir=source-images)
# Lines containing the approved FDA disclaimer are allowed to use treat/cure/prevent/diagnose.
ALLOW='evaluated by the Food and Drug Administration|diagnose, treat, cure, or prevent any disease|not intended to diagnose|goal is not perfect skin'
fail=0
echo "=== BLOCK (must be zero, except allowlisted lines) ==="
out=$(grep -rIniE "${EXCL[@]}" -f "$HERE/banned-block.txt" "$THEME" | grep -viE "$ALLOW")
[ -n "$out" ] && { echo "$out"; fail=1; } || echo "none"
echo; echo "=== REVIEW (human check each hit) ==="
grep -rIniE "${EXCL[@]}" -f "$HERE/banned-review.txt" "$THEME" | grep -viE "$ALLOW" || echo "none"
echo; echo "=== PRIVATE (manufacturer name) ==="
if [ -s "$PRIVATE" ]; then
  out=$(grep -rIniF "${EXCL[@]}" -f "$PRIVATE" "$THEME")
  [ -n "$out" ] && { echo "$out" | sed -E 's/^([^:]+:[0-9]+:).*/\1 [PRIVATE TERM HIT, line text hidden]/'; fail=1; } || echo "none"
else
  echo "WARNING: private list not found at $PRIVATE. Manufacturer-name check was NOT run."; fail=1
fi
exit $fail

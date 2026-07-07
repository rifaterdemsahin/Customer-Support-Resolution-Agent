#!/usr/bin/env bash
# CSRA Health Check — loads every page, catches errors, and reruns the test
# suite. Runs the full pipeline when something changed since the last run
# (or always with --force). Writes a report to semblance/.
#
#   bash semblance/health-check.sh          # skip if unchanged since last run
#   bash semblance/health-check.sh --force  # always run every check
#
# Exit code is non-zero if any check fails. Driven automatically every 10
# minutes by .github/workflows/health-check.yml (CI) and optionally by the
# launchd agent from semblance/install-launchd.sh (local).
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

mkdir -p semblance
STAMP="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
SIG_FILE="semblance/.last-signature"
LOG="semblance/health-${STAMP}.log"
MD="semblance/health-${STAMP}.md"

# Change signature: commit + dirty-tree hash + content hash of every source
# file the checks exercise. If this matches the last run and not --force, the
# tree is unchanged and we skip (the "rerun tests if there is a change" gate).
head_ref="$(git rev-parse HEAD 2>/dev/null || echo no-git)"
tree_hash="$(git status --porcelain 2>/dev/null | git hash-object --stdin 2>/dev/null || echo dirty)"
src_hash="$(cat *.html backend/main.go backend/main_test.go test-animation.js semblance/*.js \
             2>/dev/null | git hash-object --stdin 2>/dev/null || echo nosrc)"
sig="${head_ref}|${tree_hash}|${src_hash}"
prev="$(cat "$SIG_FILE" 2>/dev/null || echo none)"

if [ "$FORCE" -eq 0 ] && [ "$sig" = "$prev" ]; then
  echo "[health] no change since last run ($STAMP); skipping. Use --force to run anyway."
  exit 0
fi
echo "$sig" > "$SIG_FILE"

: > "$LOG"
echo "[health] run $STAMP (force=$FORCE)" | tee -a "$LOG"
echo "[health] signature: $sig" >> "$LOG"

# Make sure Playwright's browser is present (no-op if already installed).
if [ -x node_modules/.bin/playwright ]; then
  node_modules/.bin/playwright install chromium >>"$LOG" 2>&1 || true
fi

pass=0; fail=0
run() {
  local name="$1"; shift
  echo "" >>"$LOG"; echo "=== $name ===" >>"$LOG"
  if "$@" >>"$LOG" 2>&1; then
    echo "PASS  $name" | tee -a "$LOG"; pass=$((pass+1))
  else
    echo "FAIL  $name" | tee -a "$LOG"; fail=$((fail+1))
  fi
}

run "scan-links (sentinel + link integrity)" node semblance/scan-links.js
run "load-and-catch (page errors)"      node semblance/load-and-catch.js
run "verify-sentinel (gsap crash fix)"  node semblance/verify-sentinel.js
run "verify-pipeline (client->server)"  node semblance/verify-pipeline.js
run "test-animation (combined.html)"    node test-animation.js
run "go-test (server panic recovery)"   sh -c 'cd backend && go test ./...'

{
  echo "# Health Check — $STAMP"
  echo
  echo "- Signature: \`$sig\`"
  echo "- Forced: $FORCE"
  echo "- Passed: $pass / Failed: $fail"
  echo
  echo "## Steps"
  echo
  grep -E '^(PASS|FAIL)  ' "$LOG" | sed 's/^/- /'
  echo
  echo "Full log: \` semblance/health-${STAMP}.log\`"
} > "$MD"
cp "$MD" semblance/latest-health.md

echo
echo "[health] $pass passed, $fail failed  ->  $MD  (log: $LOG)"
[ "$fail" -eq 0 ]

#!/usr/bin/env bash
# Install (or uninstall) a per-user launchd agent that runs the CSRA health
# check every 10 minutes on this Mac. The agent only reruns tests when the
# tree changed (health-check.sh skips otherwise), so it is cheap.
#
#   bash semblance/install-launchd.sh             # install + load
#   bash semblance/health-check.sh --force        # run once right now
#   bash semblance/install-launchd.sh --uninstall # unload + remove
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.csra.health-check"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
TPL="$ROOT/semblance/com.csra.health-check.plist.template"

if [ "${1:-}" = "--uninstall" ]; then
  launchctl unload "$PLIST" 2>/dev/null || true
  rm -f "$PLIST"
  echo "Uninstalled $LABEL."
  exit 0
fi

mkdir -p "$HOME/Library/LaunchAgents"
sed -e "s|__ROOT__|$ROOT|g" -e "s|__HOME__|$HOME|g" "$TPL" > "$PLIST"
launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "Installed $LABEL."
echo "  Plist:   $PLIST"
echo "  Runs:    every 600s (and at login), skips when nothing changed."
echo "  Logs:    $ROOT/semblance/launchd.out.log , launchd.err.log"
echo "  Run now: bash $ROOT/semblance/health-check.sh --force"

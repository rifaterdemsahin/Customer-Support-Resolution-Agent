---
name: error-sentinel
description: Global error catcher for the Customer Support Resolution Agent demo. Inlines a client-side Error Sentinel into every HTML page (uncaught errors, unhandled rejections, resource-load failures -> badge + localStorage + POST /api/errors) and wraps the Go backend in a recoverer that records panics. All caught errors are recorded in the semblance/ folder. Use to catch, fix, and verify runtime errors across the pages and backend, and to run the automatic 10-minute health check.
---

# Error Sentinel

A two-sided global error catcher for this project:

- **Client** — an inline `<script>` in the `<head>` of every page
  (`index`, `act1`, `act2`, `act3`, `combined`, `media`) captures `error`
  (capture phase), `unhandledrejection`, and failed resource loads. It shows a
  dismissible red badge, persists the last 100 errors to `localStorage`, and
  reports each to `POST /api/errors` over `http(s):` (no-op on `file:`).
  When the GSAP CDN fails it installs a no-op `gsap` stub and reveals
  `opacity:0` content so animated pages degrade gracefully instead of throwing
  `ReferenceError: gsap is not defined`.
- **Server** — `backend/main.go` wraps the mux in `recoverer` (recovers panics
  -> `500` + `semblance/server-errors.log`) and exposes `POST /api/errors`
  (`handleClientError`) that appends client reports to
  `semblance/client-errors.log`. Operational failures (GitHub uploads) are also
  recorded via `recordError("server", ...)`.

## Record of caught + fixed errors

See [`../../semblance/ERRORS-CAUGHT.md`](../../semblance/ERRORS-CAUGHT.md) for
the durable log of every error caught by this skill and the fix applied to each.

## Run the checks

```bash
# Load all 6 pages with Playwright, catch console/page/request errors, record.
node semblance/load-and-catch.js

# Confirm the GSAP-CDN-failure crash is prevented on every page.
node semblance/verify-sentinel.js

# End-to-end: serve pages over HTTP + /api/errors, confirm client -> server.
node semblance/verify-pipeline.js

# Full Playwright assertion suite (targets combined.html).
node test-animation.js

# Server panic-recovery regression test.
cd backend && go test ./...

# Everything above in one command, skipping when nothing changed:
bash semblance/health-check.sh
bash semblance/health-check.sh --force   # always run every check
```

## Automatic 10-minute schedule

- **CI** — `.github/workflows/health-check.yml` runs `health-check.sh --force`
  every 10 min (cron `*/10 * * * *`), on push to source paths, and manually.
  Catches both code regressions and external changes (e.g. a GSAP CDN outage).
  Fails red if any check fails; uploads the report as an artifact.
- **Local (optional)** — `bash semblance/install-launchd.sh` installs a macOS
  launchd agent (`com.csra.health-check`, `StartInterval=600s`) that runs the
  same check on this machine and skips when the tree is unchanged.

## Add a new page to the catcher

1. Paste the sentinel `<script>` block (copy it from `act1.html`'s `<head>`) as
   the first script in the new page's `<head>`.
2. If the page loads GSAP, add `onerror="__csraInstallGsapStub(this.src)"` to
   the `<script src="...gsap.min.js">` tag.
3. Run `node semblance/load-and-catch.js` — the new page appears in the report.

## Triage a caught error

1. Read `semblance/latest-health.md` (CI artifact or local run) for the failing step.
2. Read `semblance/client-errors.log` / `semblance/server-errors.log` for the raw record.
3. Reproduce with the matching probe (e.g. `probe-gsap.js` for CDN failures).
4. Fix the root cause, then re-run `bash semblance/health-check.sh --force`.
5. Append an entry to `semblance/ERRORS-CAUGHT.md` describing the error + fix.

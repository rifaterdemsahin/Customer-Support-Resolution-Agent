# Errors Caught & Fixed

Durable record of errors surfaced by the global Error Sentinel and the
`semblance/` probe scripts, with the fix applied to each.

---

## #1 — `ReferenceError: gsap is not defined` (client, all animated pages)

**Where:** `act1.html`, `act2.html`, `act3.html`, `combined.html`.

**How caught:** `semblance/probe-gsap.js` blocks
`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` and loads each
page. Playwright reported:

```
PAGEERROR: gsap is not defined
CONSOLE: Failed to load resource: net::ERR_FAILED
```

**Impact:** Every animated page calls `gsap.timeline()` at the top of its IIFE.
When the GSAP CDN is unavailable (offline, blocked, outage) the call throws an
**uncaught** `ReferenceError`. Because the timeline never runs, all elements
seeded with `style="opacity:0"` stay invisible — the page is left blank with
zero feedback to the viewer. No global handler existed, so the error was
silently lost to the console.

**Fix:**
- Inlined a global **Error Sentinel** into the `<head>` of every page. It
  registers capture-phase `error` + `unhandledrejection` listeners, shows a
  dismissible badge, persists to `localStorage`, and reports to `POST /api/errors`.
- The GSAP `<script>` tag now carries
  `onerror="__csraInstallGsapStub(this.src)"`. On CDN failure the sentinel
  installs a no-op `gsap` stub (`timeline/to/fromTo/set/call/...` all chainable
  no-ops, `version:'stub-offline'`) so the IIFE no longer throws, and reveals
  `opacity:0` content so the page is readable in a static fallback. A
  `dependency-missing` report is sent to the server.

**Verification:**
```bash
node semblance/verify-sentinel.js   # gsapCrash:false on all 6 pages, badge shown
node semblance/verify-pipeline.js   # server receives dependency-missing report
```

---

## #2 — Handler panics crash the request (server)

**Where:** `backend/main.go`.

**How caught:** Design review of the mux — any panic inside a handler (nil
dereference, bad type assertion, etc.) would propagate up `net/http` and abort
the connection with no record.

**Fix:** Added a `recoverer` middleware wrapping the mux. It `recover()`s,
records the panic + stack to `semblance/server-errors.log` via `recordError`,
logs a line, and returns a clean `500` JSON. Operational failures (GitHub
uploads) are also recorded via `recordError("server", "github-upload", …)`.

**Verification:**
```bash
cd backend && go test ./...    # TestRecovererRecordsPanic passes
```

---

## #3 — Client error reports had no destination (server)

**Where:** `backend/main.go`.

**How caught:** The client sentinel needs somewhere to send caught errors;
there was no ingestion endpoint.

**Fix:** Added `POST /api/errors` (`handleClientError`) that accepts the
sentinel's JSON payload and appends a tab-separated line to
`semblance/client-errors.log`. Startup creates the `semblance/` dir
(`SEMBLANCE_DIR` env, default `semblance`).

**Verification:**
```bash
GITHUB_TOKEN=dummy PORT=8099 SEMBLANCE_DIR=semblance /tmp/csra-server &
curl -X POST localhost:8099/api/errors -H 'Content-Type: application/json' \
  -d '{"type":"dependency-missing","page":"act1.html","data":{"message":"GSAP CDN failed"}}'
cat semblance/client-errors.log
```

---

## #4 — `test-animation.js` targeted the wrong file (test harness)

**Where:** `test-animation.js`.

**How caught:** Running `node test-animation.js` reported 22–23 failures. The
suite asserts combined-animation content (act labels, 3 `<audio>`,
`#problem-card`, `Naive Agent`/`Resilient Agent`, `#metric-start`=100%) but
`HTML_PATH` pointed at `index.html` (the storyboard landing page), which
contains none of that.

**Fix:** Point `HTML_PATH` at `combined.html` (the single-file 32s animation
the assertions are written for). Result: **ALL TESTS PASSED**.

**Verification:**
```bash
node test-animation.js    # 🎉 ALL TESTS PASSED
```

---

## #5 — New page `methodology.html` shipped without the Error Sentinel

**Where:** `methodology.html` (new page linked from `index.html`'s tool grid).

**How caught:** `semblance/scan-links.js` — the new link-integrity scanner that
auto-discovers every `*.html` page and asserts (a) the `__csraSentinel` script
is present and (b) every internal `href` resolves to a real file. On arrival,
`methodology.html` had neither the sentinel nor coverage in the probes (which
hardcoded the page list).

**Fix:**
- Added the Error Sentinel `<script>` to `methodology.html`'s `<head>`.
- Made `load-and-catch.js` and `verify-sentinel.js` **auto-discover** every
  `*.html` page (was a hardcoded list) so new pages are scanned with no edits.
- Added `semblance/scan-links.js` and wired it into `health-check.sh` as the
  first step, so a missing sentinel or broken link fails the 10-minute check.
- Confirmed `backend/Dockerfile` already `COPY`s the page to `/static`.

**Verification:**
```bash
node semblance/scan-links.js     # 7 pages, all have sentinel, all links resolve
bash semblance/health-check.sh --force   # 6/6 PASS
```

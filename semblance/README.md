# semblance/ — Global Error Catcher Records & Tooling

This folder is the durable home for the **CSRA Error Sentinel** — the global
error-catching layer that runs on both the client and the server. It holds:

1. The probe/verification scripts that *load every page and catch errors*.
2. The durable record of errors that were caught and how each was fixed
   (`ERRORS-CAUGHT.md`).
3. Runtime log files written by the server (gitignored — see below).

## How errors flow

```
Browser (any page)                         Go backend (backend/main.go)
─────────────────────                       ──────────────────────────
window 'error'        ──┐
window 'unhandled-     ├──> POST /api/errors  ──> handleClientError()
  rejection'           │     (sendBeacon/fetch)     └─> semblance/client-errors.log
resource load failure ─┘
                                            recoverer middleware
                                              └─> recovers panics
                                              └─> semblance/server-errors.log
```

The client sentinel is inlined into the `<head>` of every HTML page
(`index`, `act1`, `act2`, `act3`, `combined`, `media`). It:

- Captures uncaught errors, unhandled promise rejections, and failed
  resource loads (img/script/audio) via a capture-phase `error` listener.
- Shows a dismissible red badge (top-left) and persists the last 100 errors
  to `localStorage`.
- Reports each error to `POST /api/errors` over `http(s):` (no-op on `file:`).
- Installs a GSAP stub when the GSAP CDN fails, so animated pages degrade
  gracefully instead of throwing `ReferenceError: gsap is not defined`.

## Files (tracked)

| File | Purpose |
|------|---------|
| `load-and-catch.js` | Loads all 6 pages with Playwright, catches console/page/request errors, writes `caught-errors-<ts>.{md,json}` + `latest.*`. |
| `probe-gsap.js` | Blocks the GSAP CDN and loads each page to surface the `gsap is not defined` failure mode. |
| `verify-sentinel.js` | Asserts the sentinel prevents the GSAP crash on every page (stub installed, badge shown, no pageerror). |
| `verify-pipeline.js` | End-to-end: serves pages over HTTP + `/api/errors`, blocks GSAP, confirms the client report reaches the server. |
| `ERRORS-CAUGHT.md` | Durable record of caught errors and the fixes applied. |

## Runtime artifacts (gitignored)

| File | Writer |
|------|--------|
| `client-errors.log` | `handleClientError` — one tab-separated line per client report. |
| `server-errors.log` | `recordError("server", …)` — panics + operational failures. |
| `latest.md` / `latest.json` | `load-and-catch.js` — most recent probe snapshot. |
| `caught-errors-<ts>.md/.json` | `load-and-catch.js` — timestamped probe reports. |

## Run

```bash
node semblance/load-and-catch.js     # load all pages, catch + record errors
node semblance/verify-sentinel.js    # confirm GSAP-failure crash is prevented
node semblance/verify-pipeline.js    # confirm client -> server reporting
cd backend && go test ./...           # confirm server panic recovery
```

# Formula: AI Agent Escalate-vs-Guess Demo — Testing

## Philosophy

> "Don't tell me it works — prove it with automated assertions against a real browser."

The demo is tested using **Playwright** (Chromium, headless, 1920×1080) against the single `index.html`. Each requirement from the spec maps to a test assertion. Screenshots are captured at key animation timestamps for visual verification.

---

## Test Categories

### 1. Baseline Integrity
| Check | Method |
|-------|--------|
| GSAP 3.12.5 loaded from CDN | `page.evaluate(() => typeof gsap !== 'undefined')` |
| All CSS & JS inlined (single file) | Verify `<style>` and non-src `<script>` exist; no external requests beyond GSAP CDN |
| No interactive widgets | `querySelectorAll('button, input, textarea, select').length === 0` |

### 2. Color Palette
| Color | Hex | CSS Check |
|-------|-----|-----------|
| Dark background | `#0a0a0a` | `getComputedStyle(document.body).backgroundColor === rgb(10,10,10)` |
| Cyan accent | `#00d4aa` | Agent box `borderColor` matches `rgb(0, 212, 170)` |
| Red error | `#e94560` | `.result-label.error` `color` matches `rgb(233, 69, 96)` |
| Green success | `#00cc66` | `.result-label.success` `color` matches `rgb(0, 204, 102)` |

### 3. Typography & Layout
| Check | Threshold | Method |
|-------|-----------|--------|
| `h1` font-size | ≥ 48px | `parseInt(getComputedStyle(h1).fontSize)` |
| Body text font-size | ≥ 24px | Check `.big-text` / `.medium-text` computed style |
| Stage dimensions | 1920×1080 | Check `.stage` `offsetWidth`/`offsetHeight` |

### 4. Three-Act Structure (DOM)
| Act | Key Element | Verification |
|-----|-------------|-------------|
| Act 1 | `❌` failure icon | `querySelectorAll('.result-badge')` text includes `❌` |
| Act 1 | "Policy Gap — No Rule Found" banner | `.policy-gap-banner` textContent |
| Act 1 | Red flash overlay | `document.getElementById('flash')` exists |
| Act 2 | "Escalating to human" text | `document.body.innerText.includes(...)` |
| Act 2 | `✅` success icon | `.result-badge` text includes `✅` |
| Act 2 | `👩‍💼` human icon | `document.body.innerText.includes(...)` |
| Act 3 | "Naive Agent" / "Resilient Agent" | Side-by-side labels present |
| Act 3 | "Error Rate" metric | `document.body.innerText.includes(...)` |
| Act 3 | `100% → 0%` values | `#metric-start` = `100%`, `#metric-end` = `0%` |
| Act 3 | "Know what you don't know..." | `.final-text` textContent |

### 5. Behavior
| Check | Method |
|-------|--------|
| Auto-plays on load (no click needed) | `gsap.timeline` exists and animation starts on page ready |
| Loops on completion | Script contains `restart(true, false)` on `onComplete` |
| Timeline progress bar | `#timeline` element exists, animated via GSAP |

### 6. Web Speech API
| Check | Method |
|-------|--------|
| Narration code present | Script text includes `speechSynthesis` |
| 3 narration sentences | Script has 3 calls to `narrate(...)` with synced timings |

### 7. Resource Isolation
| Check | Method |
|-------|--------|
| No external services | Monitor `page.on('request')` — block all non-file, non-GSAP-CDN URLs |
| No images loaded | No `<img>` tags; emoji used exclusively |

---

## Screenshot Timeline

Screenshots captured at key animation frames for visual regression:

| Timestamp | Scene | What to Expect |
|-----------|-------|----------------|
| `03s` | Act 1 — Request | Request bubble visible, agent box appears |
| `08s` | Act 1 — Error | Red flash, ❌ icon, "Policy Gap" banner visible |
| `13s` | Act 2 — Policy check | Policy rules displayed, competitor gap highlighted |
| `18s` | Act 2 — Escalation | Agent → Human handoff, green success glow |
| `24s` | Act 3 — Comparison | Side-by-side Naive vs Resilient columns |
| `29s` | Act 3 — Final | "Know what you don't know" text, 0% metric |

---

## Run Command

```bash
npx playwright install chromium
node test-animation.js
```

Output: console pass/fail log + `test-screenshots/*.png`

---

## Pass Criteria

All assertions must pass:
- 3 act labels found
- All 4 colors match hex spec
- Font sizes ≥ thresholds
- Icons `❌` `✅` `👩‍💼` present
- Policy gap banner text correct
- Escalation language found
- Error rate shows 100% → 0%
- Final quote text present
- No interactive widgets
- Single-file (inline CSS + JS)
- No external resources beyond GSAP CDN
- Speech API references found
- Auto-play + loop confirmed
- All 6 screenshots > 1 KB

**Failures are fatal** — the test exits non-zero so it gates CI/CD.

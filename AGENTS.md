# AGENTS.md — Customer Support Resolution Agent Demo

## Project Identity

Self-contained single-page animated demo that visually explains why AI agents should **escalate competitor price-match policy gaps to humans** rather than guessing. Deployed at:

> `https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/`

## Quick Start

```bash
# Preview locally
open index.html

# Run tests (Playwright + headless Chromium)
npm install && npx playwright install chromium
node test-animation.js

# Regenerate AI scene images (requires OpenRouter API key in .env)
pip install -r requirements.txt
python generate_images.py
```

## File Map

| File | Role |
|------|------|
| `index.html` | **The demo** — inline HTML/CSS/JS, GSAP 3.12.5 CDN, 30s auto-playing 3-act animation |
| `test-animation.js` | Playwright test suite — 32 assertions across 7 categories, exits non-zero on failure |
| `generate_images.py` | Calls OpenRouter (`google/gemini-2.5-flash-image`) to generate 8 scene PNGs |
| `formula.md` | Test plan — maps every spec requirement to a Playwright assertion |
| `package.json` | npm manifest — `playwright ^1.61.1` |
| `requirements.txt` | Python deps — `requests`, `python-dotenv` |
| `.gitignore` | Excludes `node_modules/`, `.env`, `__pycache__/`, `*.pyc`, `test-screenshots/` |
| `.env` | `OPENROUTER_API_KEY` (gitignored, sourced from `az keyvault`) |
| `.github/workflows/static.yml` | GitHub Pages deploy on push to `main` |

## Architecture

```
index.html  (single file)
├── <style>         — all CSS (dark theme #0a0a0a, cyan #00d4aa, red #e94560, green #00cc66)
├── <div class="stage">
│   ├── .flash-overlay          — red flash for error moments
│   ├── .subtitle-bar           — typewriter-reveal subtitles synced with narration
│   ├── .gh-pages-banner        — live URL shown at animation end
│   ├── .scene#scene1 (Act 1)   — Naive agent: request → gap → guess → ❌ loss
│   │   └── <img .scene-bg>     — background images swapped at key moments
│   ├── .scene#scene2 (Act 2)   — Resilient agent: request → gap → escalate → ✅ success
│   │   └── <img .scene-bg>
│   ├── .scene#scene3 (Act 3)   — Comparison, 100%→0% metric, final text
│   │   └── <img .scene-bg>
│   └── .timeline-bar           — 30s linear progress bar
└── <script>       — all JS inline
    ├── showSubtitle()           — clipPath character-by-character reveal
    ├── narrate()                — Web Speech API (SpeechSynthesisUtterance)
    └── tl (gsap.timeline)       — 30s animation, loops onComplete via restart()
```

### Image Pipeline

```
.env (OPENROUTER_API_KEY)
  → generate_images.py
    → OpenRouter /v1/chat/completions
      → google/gemini-2.5-flash-image
        → 8 PNGs → generated-images/<TIMESTAMP>/
          → referenced by index.html <img> tags
```

### Test Pipeline

```
test-animation.js
  → Playwright Chromium (headless, 1920×1080)
    → page.evaluate() checks: colors, fonts, DOM, icons, speech API, single-file, no external reqs
    → 6 screenshots at 3s/8s/13s/18s/24s/29s → test-screenshots/<TIMESTAMP>/
    → exit 0 on all pass, exit 1 on any failure
```

## Key Behaviors

### Animation Timeline (0–30s)
- **Act 1 (0–10s):** Request bubble → agent checking policy → policy gap banner → agent guesses → red flash → ❌ result
- **Act 2 (10–20s):** Request bubble → agent checking policy → gap detected → "Escalating to human" → green handoff → ✅ result
- **Act 3 (20–30s):** Side-by-side comparison columns → metric 100%→0% → final text → GitHub Pages URL banner
- **End (30–35s):** Hold 5s, then `tl.restart(true, false)` to loop

### Subtitle Sync
Three subtitles revealed character-by-character via `clipPath: inset()` step animation, synced with `SpeechSynthesisUtterance`:
1. Act 1 (0.3s, red bg `#e94560`): *"When guidelines are silent, autonomous agents risk financial errors."*
2. Act 2 (10s, green bg `#00cc66`): *"The resilient agent detects the gap and escalates to a human for policy interpretation."*
3. Act 3 (20s, cyan bg `#00d4aa`): *"Know what you don't know. Escalate policy gaps to the right decision-maker."*

### Background Image Swaps
Each scene has a `<img class="scene-bg">` whose `src` is dynamically changed during the timeline:
- Act 1: `act1-request.png` → `act1-policy-gap.png` → `act1-error.png`
- Act 2: `act2-escalate.png` → `act2-success.png`
- Act 3: `act3-comparison.png` → `act3-final.png`

## Environment & Secrets

| Variable | Source | Purpose |
|----------|--------|---------|
| `OPENROUTER_API_KEY` | `az keyvault secret show --vault-name dp-kv-deliverypilot --name OPENROUTER-API-KEY` | Image generation API auth |

Only needed for `generate_images.py`. Not needed for viewing or testing the demo.

## Testing

All tests in `test-animation.js` are documented in `formula.md`. Key invariants:
- **No interactive elements** (zero buttons, inputs)
- **No external requests** beyond GSAP CDN
- **All CSS/JS inline** (single file)
- **All 4 brand colors match** exact hex values via computed style
- **Auto-play + loop** confirmed (no user interaction required)
- **All 32 assertions** must pass — any failure exits non-zero

```bash
# Run tests (creates timestamped screenshots folder)
node test-animation.js

# Test output: console pass/fail per assertion, plus:
# test-screenshots/<ISO-TIMESTAMP>/
#   03s-act1-request.png
#   08s-act1-error.png
#   13s-act2-policy.png
#   18s-act2-escalate.png
#   24s-act3-comparison.png
#   29s-act3-final.png
```

## Regenerating Images

When you need fresh scene images:
1. Ensure `.env` has a valid `OPENROUTER_API_KEY`
2. Run `python generate_images.py`
3. Update the `<img src="...">` paths in `index.html` to match the new timestamp folder
4. Re-run tests to verify

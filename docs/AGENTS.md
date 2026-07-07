# AGENTS.md — Customer Support Resolution Agent Demo

## Project Identity

Multi-file storyboard animated demo that visually explains why AI agents should **escalate competitor price-match policy gaps to humans** rather than guessing. Deployed at:

> `https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/`

---


**IMPORTANT: Always update SPEC.md and implementation at the same time.** Every code change to act files, the storyboard, or visual behavior must be reflected in SPEC.md. Never update one without the other.

**Design rules:** `rules.md` — governs timing, subtitle sync, loop integrity, and brand color consistency.

---

## Quick Start

```bash
# Preview storyboard landing page
open index.html

# Preview individual acts
open act1.html
open act2.html
open act3.html

# Preview combined 32s animation
open combined.html

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
| `index.html` | **Storyboard** — landing page with 3 act cards + links (230 lines) |
| `act1.html` | **Act 1** — Naive Approach, 8s auto-loop with 3 inner scenes (352 lines) |
| `act2.html` | **Act 2** — Resilient Approach, 16s auto-loop with 3 inner scenes (269 lines) |
| `act3.html` | **Act 3** — The Lesson, 8s auto-loop with 3 inner scenes (284 lines) |
| `combined.html` | **Combined** — all 3 acts in single 32s animation (1474 lines) |
| `SPEC.md` | **Master spec** — scene-by-scene, artifacts, timeline tables (`docs/SPEC.md`) |
| `AGENTS.md` | **This file** — developer quick-reference (`docs/AGENTS.md`) |
| `formula.md` | Test plan — maps every spec requirement to a Playwright assertion (`docs/formula.md`) |
| `rules.md` | **Design rules** — timing, sync, brand colors, debug bar (`docs/rules.md`) |
| `script.md` | **Narrative screenplay** — 9 scenes across 3 acts (`docs/script.md`) |
| `package.json` | npm manifest — `playwright ^1.61.1` |
| `requirements.txt` | Python deps — `requests`, `python-dotenv` |
| `.gitignore` | Excludes `node_modules/`, `.env`, `__pycache__/`, `*.pyc`, `test-screenshots/` |
| `.env` | `OPENROUTER_API_KEY` (gitignored, sourced from `az keyvault`) |
| `.github/workflows/static.yml` | GitHub Pages deploy on push to `main` |

## Architecture

```
index.html  (storyboard, 230 lines)
├── 3 × .act-card with descriptions + links
├── .info-bar → combined.html, docs/SPEC.md, live demo
└── .debug-panel → minimal debug footer

act1.html  (352 lines, 8s loop)
├── <style>         — all CSS (dark theme, act-colored accents #e94560)
├── <div class="stage">
│   ├── .nav-bar             — Storyboard / Act 2 ▶ links
│   ├── .audio-toggle        — 🔊/🔇 mute button
│   ├── .scene-indicator     — "SCENE X/3: Name" overlay (top-center)
│   ├── .flash-overlay       — red flash for error moments
│   ├── .subtitle-bar        — typewriter-reveal subtitles
│   ├── .problem-card        — policy gap problem + SVG escalation
│   ├── .scene#scene1        — request, agent, infographic, policy, error
│   └── .timeline-bar        — 8s red progress bar
└── <script>       — all JS inline
    ├── showSubtitle()       — clipPath character-by-character reveal
    ├── showScene()          — scene indicator + pulse transition + debug entry
    ├── playAudio()          — respects audioMuted state
    └── tl (gsap.timeline)   — 8s animation, loops onComplete via restart()

act2.html  (269 lines, 16s loop) — same pattern, green accent #00cc66
act3.html  (284 lines, 8s loop)  — same pattern, cyan accent #00d4aa

Each act file shares the same component pattern: GSAP timeline, subtitle system, scene indicator, audio toggle, nav bar, debug panel, and auto-loop.

### Debug Panel
Slide-up panel (bottom, 34px toggle bar) with:
- **Env links** — `🏠 Local | 🌐 Cloud` to switch between local file and GitHub Pages deployment
- **Artifact tracking** — 🖼 images, 🔊 audio, 📋 event count
- **Scene indicator** — `📍 SX/3` updates at scene transitions
- **Event timeline** — clickable, color-coded entries (cyan=info, green=artifact, red=error, orange=transition)
- **Explanation panel** — shows details for clicked timeline events

## Environment & Secrets

| Variable | Source | Purpose |
|----------|--------|---------|
| `OPENROUTER_API_KEY` | `az keyvault secret show --vault-name dp-kv-deliverypilot --name OPENROUTER-API-KEY` | Image generation API auth |

Only needed for `generate_images.py`. Not needed for viewing or testing the demo.

## Testing

All tests in `test-animation.js` are documented in `formula.md`. Key invariants:
- **Interactive elements allowed** — audio toggle (🔊/🔇), nav links, debug panel toggle
- **No external requests** beyond GSAP CDN
- **All CSS/JS inline** per file
- **All 4 brand colors match** exact hex values via computed style
- **Auto-play + loop** confirmed (no user interaction required to start)
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
3. Update the `<img src="...">` paths in `act1.html`, `act2.html`, `act3.html`, and `combined.html`
4. Re-run tests to verify

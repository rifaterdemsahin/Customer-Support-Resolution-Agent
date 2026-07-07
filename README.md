# Customer Support Resolution Agent

A self-contained animated demo that visually explains **why AI agents must escalate competitor price-match policy gaps to humans** instead of guessing.

> **Live Demo:** https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/

---

## The Concept

### The Problem
After calling `get_customer()` and `lookup_order()`, an AI support agent has all available data — but faces uncertainty. A customer requests a price match against a competitor. The internal policy covers own-site price drops within 14 days but is **silent on competitor pricing**.

### The Wrong Way (Naive Agent)
The autonomous agent executes deterministic rules. When formal guidelines are silent — an **unmapped policy gap** — the agent guesses, grants an unauthorized discount, and causes financial loss.

### The Right Way (Resilient Agent)
The improved agent detects the policy gap, recognizes its boundary, and **escalates to a human** for policy interpretation. No guessing. No financial error. Correct outcome.

### The Lesson
> **"Know what you don't know. Escalate policy gaps."**

Automated agents must understand their boundaries. When rules are silent, human handoff is the correct path — not autonomous resolution.

---

## The Demo

A single `index.html` file plays a 30-second cinematic animation in 3 acts:

| Act | Time | Content |
|-----|------|---------|
| **Act 1** — Naive Approach | 0–10s | Request → policy check → gap detected → agent guesses → ❌ financial loss |
| **Act 2** — Resilient Approach | 10–20s | Request → policy check → gap detected → escalates to human → ✅ correct outcome |
| **Act 3** — The Lesson | 20–30s | Side-by-side comparison, Error Rate 100% → 0%, final quote, GitHub Pages URL |

**Features:**
- Dark theme (`#0a0a0a`), cyan accent (`#00d4aa`), red errors (`#e94560`), green success (`#00cc66`)
- GSAP 3.12.5 animation timeline — auto-plays, loops
- AI-generated scene background images (8 PNGs via OpenRouter)
- Typewriter-effect subtitles synced with narration
- Web Speech API narration (3 sentences, one per act)
- 1080p-optimized layout (1920×1080)

---

## Quick Start

```bash
# Preview locally — just open the file
open index.html

# Or serve via any static server
npx serve .
```

## Testing

Playwright test suite with 32 automated assertions:

```bash
npm install
npx playwright install chromium
node test-animation.js
```

Tests verify: color palette, font sizes, DOM structure, icons (❌/✅/👩‍💼), policy gap banner, auto-play, loop, single-file integrity, zero external requests beyond GSAP CDN, and 6 timestamped screenshots.

See [`formula.md`](formula.md) for the full test plan.

---

## Image Generation

Scene backgrounds are generated via OpenRouter (`google/gemini-2.5-flash-image`):

```bash
pip install -r requirements.txt
python generate_images.py
```

Requires `OPENROUTER_API_KEY` in `.env` (sourced from Azure Key Vault: `dp-kv-deliverypilot`).

Output: 8 PNGs in `generated-images/<TIMESTAMP>/`.

---

## Architecture

```
index.html          — Single-file demo (HTML + CSS + JS inline)
test-animation.js   — Playwright test suite (32 assertions)
generate_images.py  — OpenRouter image generation (8 PNGs)
generate_audio.py   — OpenRouter TTS audio generation (3 MP3s)
formula.md          — Test specification document
AGENTS.md           — Developer guide
```

See [`AGENTS.md`](AGENTS.md) for detailed architecture, pipeline diagrams, and environment setup.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Animation | GSAP 3.12.5 (CDN) |
| Testing | Playwright (Chromium, headless) |
| Image Gen | OpenRouter → `google/gemini-2.5-flash-image` |
| Audio | OpenRouter TTS |
| Deployment | GitHub Pages (`static.yml` workflow) |

---

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-%2300d4aa?style=flat&logo=github)](https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/)

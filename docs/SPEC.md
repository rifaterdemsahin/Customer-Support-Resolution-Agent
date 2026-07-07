# Master Spec — AI Agent Escalate-vs-Guess Animated Demo

> Scene-by-scene specification. Tech stack, artifact inventory, GSAP timeline, subtitle sync, visual elements.
>
> **Live:** https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/
>
> **Last updated:** 2026-07-07

---

## 1. Concept


### Status Quo
> There is a customer agent where it talks online in an online store and handles the customers.

### Use Case
> When the agent is requested to get a price match with a competitor

### The Question
> After calling `get_customer()` and `lookup_order()`, the agent has all available data but faces uncertainty. Which situation triggers `escalate_to_human()`?

### The Answer
> The customer requests a competitor price match. Internal policy covers own-site price drops within 14 days but is **silent on competitor pricing**. Escalate for policy interpretation — autonomous agents execute deterministic rules; when guidelines are silent, guessing risks financial errors.

### Architecture — Storyboard + Independent Acts

The demo is split into a **storyboard landing page** (`index.html`) and **3 independent act files**, with a preserved **combined single-file version**.

| File | Role | Lines |
|------|------|-------|
| `index.html` | **Storyboard** — landing page with 3 act cards, links to individual acts + combined version | 230 |
| `act1.html` | **Act 1** — The Naive Approach (8s), self-contained with own GSAP timeline, audio, debug panel | 352 |
| `act2.html` | **Act 2** — The Resilient Approach (16s), self-contained with own GSAP timeline, audio, debug panel | 269 |
| `act3.html` | **Act 3** — The Lesson (8s), self-contained with own GSAP timeline, audio, debug panel | 284 |
| `combined.html` | **Combined** — all 3 acts in a single 32s animation (legacy/alternate version) | 1474 |

### Timings
- Act 1 : 8 seconds > focus on premise
- Act 2 : 16 seconds > focus on conclusion
- Act 3 : 8 seconds > focus on summary
- Combined : 32 seconds > all three acts sequentially, loops at end

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Animation** | GSAP (GreenSock) | 3.12.5 | 32s timeline, character reveals, path draws, opacity/slide transitions |
| **Audio Narration** | `en-US-GuyNeural` voice (Microsoft Edge neural TTS via `edge-tts`) | — | 3 pre-generated MP3 clips, charismatic tone (+5% rate, -2Hz pitch, +10% volume) |
| **Image Generation** | OpenRouter → `google/gemini-3nanobanana-image` | — | 8 scene background PNGs from text prompts, saved in project |
| **Testing** | Playwright (headless Chromium) | 1.61.1 | 35 automated assertions + 8 time-indexed screenshots, runs before `git push` |
| **Deployment** | GitHub Pages via `static.yml` workflow | — | Push to `main` triggers deploy |
| **Python deps** | `requests`, `python-dotenv` | — | Image generation script |
| **npm deps** | `playwright` | 1.61.1 | Browser test suite |
| **CDN** | cdnjs (GSAP) | 3.12.5 | Single external dependency |

### Brand Colors

| Role | Hex | Usage |
|------|-----|-------|
| Dark background | `#0a0a0a` | Body, stage, scene backgrounds |
| Cyan accent | `#00d4aa` | Borders, headings, metrics, Act 3 |
| Red error | `#e94560` | Errors, warnings, Act 1 background, flash overlay |
| Green success | `#00cc66` | Success states, Act 2 background, checkmarks |

---

## 3. Artifact Inventory

### 3.1 Generated Scene Backgrounds

> Source: `generated-images/2026-07-07T09-10-41Z/`
> Generator: `generate_images.py` → OpenRouter `google/gemini-3nanobanana-image`

| File | KB | File | Used At | Depicts |
|------|-----|------|---------|---------|
| `act1-request.png` | 1305 | `act1.html` | 0s (initial), 35% opacity background | AI robot receiving price-match request, confused expression, money bag icon |
| `act1-policy-gap.png` | 1197 | *(unused in split)* | — | Red warning banner, policy document with checkmarks, red question mark |
| `act1-error.png` | 1124 | *(unused in split)* | — | AI panicking, red X, financial loss downward arrow |
| `act2-policy-check.png` | 1112 | *(unused)* | — | AI checking policy rulebook (generated for future use) |
| `act2-escalate.png` | 1115 | `act2.html` | 0s (initial), 30% opacity background | AI → Human handoff, green arrow, confident expression |
| `act2-success.png` | 988 | *(unused in split)* | — | Human agent + AI together, green checkmark, thumbs up |
| `act3-comparison.png` | 1016 | `act3.html` | 0s (initial), 25% opacity background | Split-screen red vs green, naive failing vs resilient succeeding |
| `act3-final.png` | 1110 | *(unused in split)* | — | "Know what you don't know" text, AI + human united team |

> **Note:** In the split architecture, each act file uses a single static background image at reduced opacity. Dynamic BG swaps during the timeline are only in `combined.html`.

### 3.2 Infographic Images

> Source: `infographic/`

| File | KB | Used In | Depicts |
|------|-----|---------|---------|
| `image.png` | 955 | `act1.html`, `.agent-infographic` overlay | Agent workflow: `get_customer()` → `lookup_order()` |
| `gray area.jpeg` | 115 | `act1.html`, `.gray-area-overlay` overlay | Uncertainty zone, policy silence illustration |
| `what_Agent_does.png` | 151 | *Not used* | Standby infographic |

### 3.3 Audio Narration Clips

> Source: `generated-audio/2026-07-07T09-28-54Z/`
> Generator: `generate_audio.py` → `edge-tts` → `en-US-GuyNeural` (rate:+5%, pitch:-2Hz, volume:+10%)

| File | KB | Used In | Text |
|------|-----|---------|------|
| `act1-narration.mp3` | 26 | `act1.html`, `combined.html` | *"When guidelines are silent, autonomous agents risk financial errors."* |
| `act2-narration.mp3` | 32 | `act2.html`, `combined.html` | *"The resilient agent detects the gap and escalates to a human for policy interpretation."* |
| `act3-narration.mp3` | 33 | `act3.html`, `combined.html` | *"Know what you don't know. Escalate policy gaps to the right decision-maker."* |

---

## 4. Scene-by-Scene Spec

Each act is a self-contained HTML file with its own GSAP timeline, debug panel, subtitle system, audio, and navigation. All timings below are **relative to the act file's own timeline** (each starts at 0s). Each act auto-loops on completion via `tl.restart(true, false)`.

### Inner Scene System

Each act is divided into **3 named inner scenes** displayed in the debug toggle bar via the `#status-scene` badge. Scene transitions update the badge text (e.g., `📍 Scene 2/3: Policy Gap`) and log an entry to the debug timeline.

| Act | Scene 1 | Scene 2 | Scene 3 |
|-----|---------|---------|---------|
| Act 1 | Problem Card | Policy Gap | Error Outcome |
| Act 2 | Policy Check | Decision | Success |
| Act 3 | Comparison | Metrics | The Lesson |

### Audio Toggle

Each act file includes a 🔊/🔇 mute button in the nav bar. When muted, `playAudio()` is a no-op and the audio element is paused. Mute state persists across timeline loops.

### Navigation

Each act file includes a nav bar (top-right) with links to the sibling acts and the storyboard home:
- `act1.html`: `🏠 Storyboard` (index.html) | `Act 2 ▶`
- `act2.html`: `◀ Act 1` | `🏠 Storyboard` | `Act 3 ▶`  
- `act3.html`: `◀ Act 2` | `🏠 Storyboard`

### Scene Summary

> **Narrative script:** `script.md` — full screenplay with dialog, narration, and visual cues.  
> **Individual specs:** `../scenes/scene-*-*.md` — per-scene timeline tables, GSAP events, element IDs, subtitle details.

| Act | Scene | Name | File | Duration | Script | Scene Spec |
|-----|-------|------|------|----------|--------|-------------|
| 1 | 1.1 | Problem Card | `act1.html` | 0–4s | [`script.md#scene-11`](script.md#scene-11-problem-card-00s--40s) | [`../scenes/scene-1-1-problem-card.md`](../scenes/scene-1-1-problem-card.md) |
| 1 | 1.2 | Policy Gap | `act1.html` | 4–6.5s | [`script.md#scene-12`](script.md#scene-12-policy-gap-40s--65s) | [`../scenes/scene-1-2-policy-gap.md`](../scenes/scene-1-2-policy-gap.md) |
| 1 | 1.3 | Error Outcome | `act1.html` | 6.5–8s | [`script.md#scene-13`](script.md#scene-13-error-outcome-65s--80s) | [`../scenes/scene-1-3-error-outcome.md`](../scenes/scene-1-3-error-outcome.md) |
| 2 | 2.1 | Policy Check | `act2.html` | 0–3.6s | [`script.md#scene-21`](script.md#scene-21-policy-check-00s--36s) | [`../scenes/scene-2-1-policy-check.md`](../scenes/scene-2-1-policy-check.md) |
| 2 | 2.2 | Decision | `act2.html` | 3.6–7s | [`script.md#scene-22`](script.md#scene-22-decision-36s--70s) | [`../scenes/scene-2-2-decision.md`](../scenes/scene-2-2-decision.md) |
| 2 | 2.3 | Success | `act2.html` | 7–16s | [`script.md#scene-23`](script.md#scene-23-success-70s--160s) | [`../scenes/scene-2-3-success.md`](../scenes/scene-2-3-success.md) |
| 3 | 3.1 | Comparison | `act3.html` | 0–2.5s | [`script.md#scene-31`](script.md#scene-31-comparison-00s--25s) | [`../scenes/scene-3-1-comparison.md`](../scenes/scene-3-1-comparison.md) |
| 3 | 3.2 | Metrics | `act3.html` | 2.5–5s | [`script.md#scene-32`](script.md#scene-32-metrics-25s--50s) | [`../scenes/scene-3-2-metrics.md`](../scenes/scene-3-2-metrics.md) |
| 3 | 3.3 | The Lesson | `act3.html` | 5–8s | [`script.md#scene-33`](script.md#scene-33-the-lesson-50s--80s) | [`../scenes/scene-3-3-the-lesson.md`](../scenes/scene-3-3-the-lesson.md) |

---

## 5. Per-Act Timeline Elements

Each act file contains its own:

| Element | CSS | Animation | Duration |
|---------|-----|-----------|----------|
| `.timeline-bar` `#timeline` | 4px height, act-colored (`#e94560` / `#00cc66` / `#00d4aa`) | `width: 0% → 100%` | Full act duration (8s/16s/8s), `ease:none` |
| `.debug-panel` `#debug-panel` | Bottom of stage, 180px height | Opens on click (translateY) | 0.35s transition |
| `.debug-toggle` | Full width, 34px height | Click to open/close, shows artifact counts | — |
| `.nav-bar` | Top-right, flex row | Prev / Storyboard / Next links between acts + 🔊/🔇 audio toggle | — |
| `.subtitle-bar` | Bottom-center, z-index:80 | `clipPath: inset()` character reveal | `steps(<len>)` easing, 3.5s hold, then fade |

### Storyboard (`index.html`)

| Element | CSS | Purpose |
|---------|-----|---------|
| `.act-grid` | Flex row, 40px gap | 3 act cards side-by-side |
| `.act-card` | Flex:1, max 520px, colored borders (`#e94560` / `#00cc66` / `#00d4aa`) | Click target linking to individual act files |
| `.act-link` | Centered button, act-colored bg/border | Navigation to individual act |
| `.info-bar` | Cyan-tinted background | Links to combined.html, docs/SPEC.md, and live demo |
| `.debug-panel` | Bottom slide-up (180px, shared pattern) | Minimal debug info about storyboard structure |

---

## 6. Console Event Log

Each act file logs events to `console.log` and the debug panel via `logEvent()`. Unlike the combined timeline (29 absolute-timed events), each act logs its own events relative to its timeline.

| Act | Events | Key console logs |
|-----|--------|------------------|
| Act 1 | ~14 | Problem card display/dismiss, request bubble, agent appears, infographic, policy gap, gray area, agent guesses, red flash, error result, act complete, loop |
| Act 2 | ~10 | Act started, request arrives, agent appears, policy gap confirmed, decision — no guessing, escalation to human, success, act complete, loop |
| Act 3 | ~7 | Act started, comparison columns, metric 100%→0%, final message, rationale box, GitHub Pages URL, loop |

All events are color-coded in the debug panel: cyan=info, green=artifact, red=error, orange=transition.

---

## 7. Subtitle Inventory

All subtitles use `clipPath: inset()` character-by-character reveal via GSAP `steps()` easing. Hold time: 3.5s after reveal before `opacity:0` fade. Subtitles are defined within each act file's local timeline.

| # | Act | File | BG Color | Text | Reveal |
|---|-----|------|----------|------|--------|
| 1 | Act 1 | `act1.html` | `#e94560` (red) | *"AI agents face uncertainty when policy rules don't cover every scenario."* | 2.0s |
| 2 | Act 1 | `act1.html` | `#e94560` (red) | *"Customer requests a competitor price match."* | 1.6s |
| 3 | Act 1 | `act1.html` | `#e94560` (red) | *"AI agent checks internal policy rules..."* | 1.5s |
| 4 | Act 1 | `act1.html` | `#e94560` (red) | *"Policy gap found: competitor price matching has no rule."* | 1.8s |
| 5 | Act 1 | `act1.html` | `#e94560` (red) | *"No matching rule. Agent guesses — applies 15% discount."* | 1.8s |
| 6 | Act 1 | `act1.html` | `#e94560` (red) | *"Financial loss: unauthorized discount applied."* | 1.5s |
| 7 | Act 1 | `act1.html` | `#e94560` (red) | *"When guidelines are silent, autonomous agents risk financial errors."* | 2.2s |
| 8 | Act 2 | `act2.html` | `#00cc66` (green) | *"Improved agent checks policy — finds same gap."* | 1.8s |
| 9 | Act 2 | `act2.html` | `#00cc66` (green) | *"Agent recognizes: no deterministic rule exists."* | 1.8s |
| 10 | Act 2 | `act2.html` | `#00cc66` (green) | *"Escalating to human for policy interpretation."* | 2.0s |
| 11 | Act 2 | `act2.html` | `#00cc66` (green) | *"Human resolves — correct outcome, zero financial error."* | 2.0s |
| 12 | Act 2 | `act2.html` | `#00cc66` (green) | *"The resilient agent detects the gap and escalates to a human for policy interpretation."* | 2.5s |
| 13 | Act 3 | `act3.html` | `#00d4aa` (cyan) | *"Naive agent guesses wrong. Resilient agent escalates."* | 2.2s |
| 14 | Act 3 | `act3.html` | `#00d4aa` (cyan) | *"Error rate drops from 100% to 0% with human escalation."* | 2.0s |
| 15 | Act 3 | `act3.html` | `#00d4aa` (cyan) | *"Know what you don't know. Escalate policy gaps to the right decision-maker."* | 2.4s |

---

## 8. SVG Specification

### Escalation Illustration (`#escalation-svg-wrap`)

| Element | Color | Dimensions | Animation |
|---------|-------|------------|-----------|
| AI head (rect) | `#00d4aa` stroke, 3px | 56×44, rx:8 | Static |
| AI eyes (2 circles) | `#00d4aa` fill, r:5 | — | Static |
| AI body (rect) | `#00d4aa` stroke, 3px | 72×50, rx:10 | Static |
| AI antenna glow | `#00d4aa`, opacity oscillates | r:10→14 | Native SVG `<animate>` 2s loop |
| Escalation path | `#00cc66` stroke, 3px | bezier 210→470 | `strokeDashoffset:200→0` via GSAP, 1.2s |
| Arrowhead polygon | `#00cc66` fill | 490,110 | Fades in at 0.3s |
| Flow dots (4) | `#00cc66` fill, r:4 | Along path | Staggered fade-in 0.2s each |
| Human head | `#00cc66` stroke, 3px | r:18 circle | Static |
| Human smile | `#00cc66` stroke, 2px | Q:30,28→50,28 | Static |
| Human body | `#00cc66` stroke, 3px | 48×50, rx:10 | Static |
| Human glow | `#00cc66`, opacity oscillates | r:28→34 | Native SVG `<animate>` 2.5s loop |
| "escalation" label | `#888` fill, 14px | x:350, y:65 | Fades in with GSAP |
| AI label | `#00d4aa` fill, 20px | "AI Agent" / "Autonomous" | Static |
| Human label | `#00cc66` fill, 20px | "Human Agent" / "Expert" | Static |

---

## 9. Debug Panel Specification

| Component | ID | Dimensions | Behavior |
|-----------|-----|------------|----------|
| Panel container | `#debug-panel` | Full width, 220px height | Slide up from bottom (translateY), hiding 34px toggle bar |
| Toggle bar | `#debug-toggle` | Full width, 34px height | Click to open/close, shows env links + control buttons + scene status + artifact counts |
| Env links | `.env-links` | Inline flex, 11px | `🏠 Local` link to current file (relative), `🌐 Cloud` link to GitHub Pages absolute URL |
| Pause button | `#dbg-pause` | 13px `.dbg-btn` | `⏸` → toggles to `▶` (paused): pauses/resumes GSAP timeline via `tl.pause()`/`tl.play()` |
| Copy button | `#dbg-copy` | 13px `.dbg-btn` | `📋` → `✓` briefly: copies all debug timeline entries to clipboard as `[E#] X.Xs message` |
| Script button | `#dbg-script` | 13px `.dbg-btn` | `📜`: loads `docs/script.md` via `fetch()` and displays in a modal popup with a `📋 Copy Script` button. Cached on first load (`dataset.loaded`). Close via `×`, backdrop click, or Escape. |
| Image badge | `#status-imgs` | — | `"🖼 N/M"` — turns red if not all loaded |
| Audio badge | `#status-audio` | — | `"🔊 N/M"` — turns red if not all loaded |
| Event badge | `#status-events` | — | `"📋 N"` total event count |
| Scene badge | `#status-scene` | — | `"📍 Scene X/3: Name"` — current inner scene, act-colored, updates on transition |
| Event timeline | `#debug-timeline` | 340px wide, scrollable | Entries show: dot (color-coded), event ID (E1, E2...), time, message. Color-coded dots: cyan=info, green=artifact, red=error, orange=transition |
| Event ID | `.tl-id` | 22px min-width, 9px, #555 | Auto-incremented `E1`, `E2`... assigned sequentially on each entry |
| Scene entry | `📍 Scene X/3: Name` | In message column | Logged on each `showScene()` call via `addEntry()` |
| Explanation panel | `#debug-explain` | Flex:1, scrollable | Shows clicked event's category, full text, and explanation |
| Feedback box | `#feedback-text` | Flex:1, textarea | User feedback input — submits into timeline as purple subtitle event |

---

## 10. Animation Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│  INPUTS                                                         │
│                                                                 │
│  .env (OPENROUTER_API_KEY)                                      │
│      │                                                          │
│      ├── generate_images.py                                      │
│      │   └── OpenRouter → google/gemini-2.5-flash-image          │
│      │       └── 8 PNGs → generated-images/<TIMESTAMP>/          │
│      │                                                          │
│      └── generate_audio.py                                       │
│          └── edge-tts → en-US-GuyNeural                          │
│              └── 3 MP3s → generated-audio/<TIMESTAMP>/           │
│                                                                 │
│  infographic/ (manual assets)                                    │
│      ├── image.png          → workflow diagram                   │
│      └── gray area.jpeg     → uncertainty zone                   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Storyboard (index.html, 230 lines)                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  3 act cards with descriptions, links, and debug footer     ││
│  └─────────────────────────────────────────────────────────────┘│
│                           │                                      │
│            ┌──────────────┼──────────────┐                       │
│            ▼              ▼              ▼                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │  act1.html   │ │  act2.html   │ │  act3.html   │             │
│  │  352 lines   │ │  269 lines   │ │  284 lines   │             │
│  │  8s timeline │ │  16s timeline│ │  8s timeline │             │
│  │  ❌ failure  │ │  ✅ success  │ │  📊 summary  │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                           │                                      │
│            ┌──────────────┴──────────────┐                       │
│            ▼                             ▼                       │
│  ┌──────────────────┐    ┌──────────────────────────┐           │
│  │  combined.html   │    │  GitHub Pages Deploy      │           │
│  │  1474 lines      │    │  (static.yml workflow)    │           │
│  │  32s unified     │    │  push main → auto deploy  │           │
│  └──────────────────┘    └──────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Shared Patterns Across All Act Files

Each act file follows the same architecture:
1. **GSAP timeline** via `gsap.timeline({ defaults: { ease: "power3.inOut" } })`
2. **Subtitle system** — `showSubtitle(text, at, dur)` with `clipPath:inset()` reveal
3. **Audio playback** — `playAudio(at)` triggers `<audio>` element at timeline position
4. **Event logging** — `logEvent(msg, at, explain, cls)` logs to console + debug panel
5. **Debug panel** — slide-up panel with timeline entries, artifact tracking (🖼 🔊 📋), and click-to-explain
6. **Navigation bar** — prev/next/home links between acts
7. **Auto-loop** — `tl.eventCallback("onComplete", () => tl.restart(true, false))`

---

## 11. File Inventory

```
Customer-Support-Resolution-Agent/
├── index.html                              # Storyboard landing page (230 lines)
├── act1.html                               # Act 1: Naive Approach — 8s auto-loop (352 lines)
├── act2.html                               # Act 2: Resilient Approach — 16s auto-loop (269 lines)
├── act3.html                               # Act 3: The Lesson — 8s auto-loop (284 lines)
├── combined.html                           # Combined 32s animation (1474 lines)
├── test-animation.js                       # Playwright test suite (35 assertions)
├── generate_images.py                      # OpenRouter image generator
├── generate_audio.py                       # edge-tts narration generator
├── docs/                                   # Project documentation
│   ├── AGENTS.md                           # Developer guide
│   ├── SPEC.md                             # ← This document
│   ├── script.md                           # Narrative screenplay — 9 scenes across 3 acts
│   ├── rules.md                            # Design rules — timing, sync, brand colors, debug bar
│   ├── formula.md                          # Test specification
│   └── formula_audio.md                    # Audio generation rationale
├── scenes/                                 # Per-scene specification files
│   ├── scene-1-1-problem-card.md
│   ├── scene-1-2-policy-gap.md
│   ├── scene-1-3-error-outcome.md
│   ├── scene-2-1-policy-check.md
│   ├── scene-2-2-decision.md
│   ├── scene-2-3-success.md
│   ├── scene-3-1-comparison.md
│   ├── scene-3-2-metrics.md
│   └── scene-3-3-the-lesson.md
├── package.json                            # npm: playwright ^1.61.1
├── requirements.txt                        # Python: requests, python-dotenv, edge-tts
├── .gitignore                              # Excludes node_modules/, .env, __pycache__/, test-screenshots/
├── .env                                    # OPENROUTER_API_KEY (gitignored)
├── .github/workflows/static.yml            # GitHub Pages deploy
├── generated-images/2026-07-07T09-10-41Z/  # 8 AI-generated scene PNGs
├── generated-audio/2026-07-07T09-28-54Z/   # 3 TTS narration MP3s
├── infographic/                            # 2 manual infographic assets
│   ├── image.png
│   └── gray area.jpeg
├── test-screenshots/                       # Playwright output (timestamped, gitignored)
├── README.md
└── docs/SPEC.md                            # ← This document
```

---

## 12. Commands

```bash
# View storyboard landing page (links to all acts)
open index.html

# View individual acts directly
open act1.html
open act2.html
open act3.html

# View combined 32s animation
open combined.html

# Regenerate images (requires .env with OPENROUTER_API_KEY)
pip install -r requirements.txt
python generate_images.py
# → Update <img src> in act1.html / act2.html / act3.html / combined.html

# Regenerate audio
pip install edge-tts
python generate_audio.py
# → Update <audio src> in act1.html / act2.html / act3.html / combined.html

# Run test suite
npm install && npx playwright install chromium
node test-animation.js

# Deploy (automated on push)
git push origin main
# → GitHub Actions deploys to Pages
```

---

## 13. Record and Transcribe Service

> **URL:** https://record-and-transcribe.fly.dev/
>
> **Purpose:** Record audio and transcribe with AI. Standalone companion tool for generating voice-to-text transcriptions used in scene narration and subtitle development.

### 13.1 Integration

| Tool | URL | Purpose |
|------|-----|---------|
| **Speech Creation** | https://secondbrain-kokoro.fly.dev/ | Generate AI narration audio (Kokoro TTS) |
| **Record and Transcribe** | https://record-and-transcribe.fly.dev/ | Record audio and transcribe with AI |
| **Backend API** | https://csra-backend.fly.dev/health | Health check and backend status |
| **Media Manager** | `media.html` | Upload audio and background images |

### 13.2 Workflow

```
Record and Transcribe  ──transcription──▶  scene narration drafting
                                          │
                                          ▼
Speech Creation (Kokoro)  ──MP3 audio──▶  act1/act2/act3.html
                                          │
                                          ▼
                                          Background images + GSAP timeline
```

Used to capture voice memos, meeting notes, or draft narration scripts via transcription, which then feed into the audio generation pipeline described in [Section 10](#10-animation-pipeline).

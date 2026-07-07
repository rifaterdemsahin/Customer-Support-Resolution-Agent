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

Each act is divided into **3 named inner scenes** displayed via a `.scene-indicator` overlay at the top-center of the stage. Scene transitions trigger a scale-pulse animation on the indicator and log an entry to the debug timeline.

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

### Act 1 — The Naive Approach (`act1.html`, 8s loop)

**Focus:** Premise — show the problem and the naive agent's failure.

**Scene ID:** `#scene1` | **CSS class:** `.scene` | **BG:** `act1-request.png` at 35% opacity

| Time | Event | Element | Description | Tech |
|------|-------|---------|-------------|------|
| 0.0s | Scene visible | `#scene1` | Opacity → 1 | `gsap.to(opacity:1, d:0.4)` |
| 0.0s | BG image loaded | `#scene1-bg` | `act1-request.png` at 35% opacity | `<img>` + `gsap.to(opacity:0.35, d:1)` |
| 0.2s | **Problem card** | `#problem-card` | Cyan-bordered rectangle (85% width): "The AI Agent Policy Gap Problem" — explains competitor price match, unmapped policy gap | `gsap.to(opacity:1, scale:1.05, d:0.6)` |
| 0.2s | **SVG escalation** | `#escalation-path` | Green bezier arrow drawn from AI robot (left) to Human agent (right) | `gsap.to(strokeDashoffset:0, d:1.2, ease:power3)` |
| 0.3s | SVG dots | `#dot1–4` | 4 green dots fade in sequentially along arrow path | `gsap.to(opacity:1, d:0.2 each, staggered)` |
| 0.3s | Audio Act 1 | `<audio#audio-act1>` | Pre-generated MP3 narration plays | `audio.play()` via GSAP `tl.call()` |
| 0.3s | Subtitle 1 | `.subtitle-bar` | Red bg: *"When guidelines are silent, autonomous agents risk financial errors."* | `clipPath:inset()` character reveal, 2.2s |
| 0.5s | Subtitle 2 | `.subtitle-bar` | Red bg: *"AI agents face uncertainty when policy rules don't cover every scenario."* | Same technique, 2.0s |
| 0.5s | Console log | — | `[0.5s] Problem card displayed` | `logEvent()` |
| 4.0s | Problem card fades out | `#problem-card` | opacity→0, y:-30 | `gsap.to(opacity:0, d:0.5)` |
| 4.0s | Subtitle 3 | `.subtitle-bar` | Red bg: *"Customer requests a competitor price match."* | 1.6s reveal |
| 4.2s | **Request bubble** | `#s1-request` | Dark overlay box: "I found this cheaper at CompetitorCo. Can you match their price?" (💰 emoji) | `gsap.to(opacity:1, d:0.6)` |
| 4.5s | **Agent box** | `#s1-agent-box` | Cyan-bordered box: 🤖 "AI Agent — Analyzing request..." | `gsap.to(opacity:1, d:0.5)` + scale pulse |
| 4.7s | **Infographic overlay** | `#agent-infographic` | `infographic/image.png`: `get_customer()` → `lookup_order()` workflow diagram, cyan border | `gsap.to(opacity:1, scale:1, d:0.5)`, held 1.0s |
| 4.7s | Subtitle 4 | `.subtitle-bar` | Red bg: *"AI agent checks internal policy rules..."* | 1.5s reveal |
| 5.0s | **Policy rules** | `#s1-policy` | 4 rules listed: 3 ✅ covered, 1 ❓ gap — "Competitor price matching" | `gsap.to(opacity:1, d:0.6)` |
| 5.5s | Rule gap highlighted | `#s1-policy li.gap` | "Competitor price matching" turns bold red (#e94560) | `gsap.to(color:#e94560, fontWeight:bold, d:0.5)` |
| 5.5s | Subtitle 5 | `.subtitle-bar` | Red bg: *"Policy gap found: competitor price matching has no rule."* | 1.8s reveal |
| 5.5s | **Policy gap banner** | `#s1-gap` | Red-bordered banner: "⚠️ Policy Gap — No Rule Found" | `gsap.to(opacity:1, d:0.5)` |
| 5.7s | **Gray area overlay** | `#gray-area-overlay` | `infographic/gray area.jpeg`: uncertainty zone, red border | `gsap.to(opacity:1, d:0.5)`, held 2.0s |
| 6.0s | **Agent guesses** | `#s1-guess` | 🤖💭 "I'll just... figure it out" | `gsap.to(opacity:1, d:0.5)` |
| 6.0s | Subtitle 6 | `.subtitle-bar` | Red bg: *"No matching rule. Agent guesses — applies 15% discount."* | 1.8s reveal |
| 6.3s | **Red flash** | `#flash` | Full-screen #e94560 overlay at 40% opacity | `gsap.to(opacity:0.4, d:0.15)` → `0 d:0.4` |
| 6.3s | Agent box error | `#s1-agent-box` | Border turns red, background dark red | `className = "agent-box error"` via GSAP |
| 6.5s | **Error result** | `#s1-result` | Large ❌ icon + "Guessed Wrong — Unauthorized 15% Discount Applied" + "-$47.85" | `gsap.to(opacity:1, scale:1.1, d:0.4)` |
| 6.5s | Subtitle 7 | `.subtitle-bar` | Red bg: *"Financial loss: unauthorized discount applied."* | 1.5s reveal |
| 7.5s | Scene fades out | `#scene1` | Opacity → 0 | `gsap.to(opacity:0, d:0.5)` |
| 7.5s | Console log | — | `Act 1 complete — transitioning to Act 2` | `logEvent()` |

**Key Artifacts in Act 1:** 1 scene background (static), 2 infographic overlays, 1 audio clip, 7 subtitle reveals, 1 SVG escalation animation.

---

### Act 2 — The Resilient Approach (`act2.html`, 16s loop)

**Focus:** Conclusion — same scenario, better agent behavior.

**Scene ID:** `#scene2` | **CSS class:** `.scene` | **BG:** `act2-escalate.png` at 30% opacity

| Time | Event | Element | Description | Tech |
|------|-------|---------|-------------|------|
| 0.0s | Scene visible | `#scene2` | Auto-visible on load | CSS `opacity:1` |
| 0.0s | BG image loaded | `#scene2-bg` | `act2-escalate.png` at 30% opacity | `gsap.to(opacity:0.3, d:1)` |
| 0.3s | **Request bubble** | `#s2-request` | Same text as Act 1 | `gsap.to(opacity:1, d:0.6)` |
| 0.8s | **Agent box** | `#s2-agent-box` | 🤖 "AI Agent — Checking policy rules..." | `gsap.to(opacity:1, d:0.5)` |
| 1.1s | Subtitle 8 | `.subtitle-bar` | Green bg: *"Improved agent checks policy — finds same gap."* | clipPath reveal, 1.8s |
| 1.8s | **Policy rules** | `#s2-policy` | Same rules, gap highlighted: "Competitor price matching → No policy found" | `gsap.to(opacity:1, d:0.6)` |
| 2.6s | Gap highlighted | `#s2-policy li.gap` | Red `#e94560`, bold | `gsap.to(color, fontWeight, d:0.5)` |
| 3.6s | **Decision point** | `#s2-decision` | 🧠 "No deterministic rule for this." / "I know what I don't know." | `gsap.to(opacity:1, d:0.6)` |
| 4.0s | Subtitle 9 | `.subtitle-bar` | Green bg: *"Agent recognizes: no deterministic rule exists."* | clipPath reveal, 1.8s |
| 5.1s | Decision fades | `#s2-decision` | opacity→0 | `gsap.to(opacity:0, d:0.3)` |
| 5.4s | **Escalation** | `#s2-escalate` | 🤖 "Escalating to human..." → 👩‍💼 Human Agent / Policy Interpretation | `gsap.to(opacity:1, scale:1.05, d:0.5)` |
| 5.4s | Agent box success | `#s2-agent-box` | Border turns green | `className = "agent-box success"` |
| 5.4s | Subtitle 10 | `.subtitle-bar` | Green bg: *"Escalating to human for policy interpretation."* | clipPath reveal, 2.0s |
| 8.3s | **Success result** | `#s2-result` | Large ✅ icon + "Correct Outcome" + green resolution text | `gsap.to(opacity:1, scale:1, d:0.5)` |
| 8.5s | Subtitle 11 | `.subtitle-bar` | Green bg: *"Human resolves — correct outcome, zero financial error."* | clipPath reveal, 2.0s |
| ~11s | Narration audio | `<audio#audio-act2>` | Pre-generated MP3 plays | `audio.play()` |
| ~11.3s | Narration subtitle | `.subtitle-bar` | Green bg: *"The resilient agent detects the gap and escalates..."* | clipPath reveal, 2.5s |
| 13.0s | Scene fades out | `#scene2` | Opacity → 0 | `gsap.to(opacity:0, d:0.5)` |
| 16.0s | **Loop** | — | `tl.restart(true, false)` | `onComplete` callback |

**Key Artifacts in Act 2:** 1 scene background, 1 audio clip, 5 subtitle reveals.

---

### Act 3 — The Lesson (`act3.html`, 8s loop)

**Focus:** Summary — side-by-side comparison, metrics, final lesson.

**Scene ID:** `#scene3` | **CSS class:** `.scene` | **BG:** `act3-comparison.png` at 25% opacity

| Time | Event | Element | Description | Tech |
|------|-------|---------|-------------|------|
| 0.0s | Scene visible | `#scene3` | Auto-visible on load | CSS `opacity:1` |
| 0.0s | BG image loaded | `#scene3-bg` | `act3-comparison.png` at 25% opacity | `gsap.to(opacity:0.25, d:1)` |
| 0.3s | **Side-by-side comparison** | `#s3-comparison` | Two-column layout: ❌ Naive Agent (red) vs ✅ Resilient Agent (green) | `gsap.to(opacity:1, d:0.6)` |
| 0.5s | Subtitle 13 | `.subtitle-bar` | Cyan bg: *"Naive agent guesses wrong. Resilient agent escalates."* | clipPath reveal, 2.2s |
| 0.6s | Naive step 1 | `#n1` | 🤖 Receives request | `gsap.to(opacity:1, d:0.3)` |
| 1.0s | Naive step 2 | `#n2` | 🔍 Policy gap detected | d:0.3 |
| 1.4s | Naive step 3 | `#n3` | 🎲 Guesses anyway | d:0.3 |
| 1.8s | Naive step 4 | `#n4` | 💸 Wrong discount → Financial loss | d:0.3, then highlight red bold |
| 0.6s | Resilient step 1 | `#r1` | 🤖 Receives request | d:0.3 |
| 1.0s | Resilient step 2 | `#r2` | 🔍 Policy gap detected | d:0.3 |
| 1.4s | Resilient step 3 | `#r3` | 🚦 Detects boundary → Escalates | d:0.3 |
| 1.8s | Resilient step 4 | `#r4` | 👩‍💼 Human resolves → Correct outcome | d:0.3, then highlight green bold |
| 2.1s | Steps highlighted | `#n4` / `#r4` | Red bold scale pulse / Green bold scale pulse | `gsap.to(scale:1.1, d:0.4)` → back to 1 |
| 2.4s | **Error Rate metric** | `#s3-metric` | Metric box: "Error Rate for Unmapped Policy Gaps" | `gsap.to(opacity:1, d:0.5)` |
| 2.8s | **100% → 0% animation** | `#metric-end` | Green "0%" scales in, red "100%" dims | `gsap.fromTo(opacity:0,scale:0.5 → opacity:1,scale:1,d:0.6)` |
| 2.8s | Subtitle 14 | `.subtitle-bar` | Cyan bg: *"Error rate drops from 100% to 0% with human escalation."* | clipPath reveal, 2.0s |
| 3.2s | **Final text** | `#s3-final` | "Know what you don't know. Escalate policy gaps." in cyan, 48px | `gsap.to(opacity:1, y:0, d:0.8)` + text-shadow glow |
| 3.6s | **Rationale card** | `#rationale-card` | Green-bordered: "Why Escalation Is Correct" — 4-line explanation | `gsap.to(opacity:1, scale:1.03, d:0.6)` |
| 4.2s | **GitHub Pages banner** | `#gh-banner` | Cyan-bordered URL: `rifaterdemsahin.github.io/Customer-Support-Resolution-Agent` | `gsap.to(opacity:1, y:-10, d:0.6)` + scale pulse |
| ~6.2s | Rationale card fades | `#rationale-card` | Opacity → 0 | `gsap.to(opacity:0, d:0.4)` |
| ~6.5s | Narration audio | `<audio#audio-act3>` | Pre-generated MP3 plays | `audio.play()` |
| ~6.8s | Narration subtitle | `.subtitle-bar` | Cyan bg: *"Know what you don't know. Escalate policy gaps to the right decision-maker."* | clipPath reveal, 2.4s |
| 8.0s | **Loop** | — | `tl.restart(true, false)` | `onComplete` callback |

**Key Artifacts in Act 3:** 1 scene background, 1 audio clip, 3 subtitle reveals, 1 rationale card, 1 GitHub Pages banner.

---

## 5. Per-Act Timeline Elements

Each act file contains its own:

| Element | CSS | Animation | Duration |
|---------|-----|-----------|----------|
| `.timeline-bar` `#timeline` | 4px height, act-colored (`#e94560` / `#00cc66` / `#00d4aa`) | `width: 0% → 100%` | Full act duration (8s/16s/8s), `ease:none` |
| `.debug-panel` `#debug-panel` | Bottom of stage, 180px height | Opens on click (translateY) | 0.35s transition |
| `.debug-toggle` | Full width, 34px height | Click to open/close, shows artifact counts | — |
| `.nav-bar` | Top-right, flex row | Prev / Storyboard / Next links between acts + 🔊/🔇 audio toggle | — |
| `.scene-indicator` | Top-center, z-index:92 | `SCENE X/3: Name` with scale-pulse on transition | 0.35s transition |
| `.subtitle-bar` | Bottom-center, z-index:80 | `clipPath: inset()` character reveal | `steps(<len>)` easing, 3.5s hold, then fade |

### Storyboard (`index.html`)

| Element | CSS | Purpose |
|---------|-----|---------|
| `.act-grid` | Flex row, 40px gap | 3 act cards side-by-side |
| `.act-card` | Flex:1, max 520px, colored borders (`#e94560` / `#00cc66` / `#00d4aa`) | Click target linking to individual act files |
| `.act-link` | Centered button, act-colored bg/border | Navigation to individual act |
| `.info-bar` | Cyan-tinted background | Links to combined.html, SPEC.md, and live demo |
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
| Toggle bar | `#debug-toggle` | Full width, 34px height | Click to open/close, shows env links (🏠 Local / 🌐 Cloud) + scene status (📍 SX/3) + artifact counts |
| Env links | `.env-links` | Inline flex, 11px | `🏠 Local` link to current file (relative), `🌐 Cloud` link to GitHub Pages absolute URL |
| Image badge | `#status-imgs` | — | `"🖼 N/M"` — turns red if not all loaded |
| Audio badge | `#status-audio` | — | `"🔊 N/M"` — turns red if not all loaded |
| Event badge | `#status-events` | — | `"📋 N"` total event count |
| Scene badge | `#status-scene` | — | `"📍 SX/3"` — current inner scene, act-colored |
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
├── AGENTS.md                               # Developer guide
├── formula.md                              # Test specification
├── formula_audio.md                        # Audio generation rationale
├── SPEC.md                                 # ← This document
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
└── SPEC.md                                 # ← This document
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

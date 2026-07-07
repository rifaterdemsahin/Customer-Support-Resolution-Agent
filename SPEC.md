# Master Spec — AI Agent Escalate-vs-Guess Animated Demo

> Scene-by-scene specification. Tech stack, artifact inventory, GSAP timeline, subtitle sync, visual elements.
>
> **Live:** https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/
>
> **Last updated:** 2026-07-07 [[time]]

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

### The Demo
A self-contained `index.html` plays a **32-second cinematic animation** in 3 acts showing both approaches side-by-side: a naive AI that guesses wrong, and a resilient AI that escalates correctly.

### Timings
- Act 1 : 8 seconds > focus on premise
- Act 2 : 16 seconds > focus on conclusion
- Act 3 : 8 seconds > focus on summary

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Animation** | GSAP (GreenSock) | 3.12.5 | 30s timeline, character reveals, path draws, opacity/slide transitions |
| **Audio Narration** |  3 pre-generated MP3 clips, `US Guy Neural` voice |
| **Image Generation** | OpenRouter → `google/gemini-3nanobanana-image` | — | 8 scene background PNGs from text prompts that are saved in the project |
| **Testing** | Playwright (headless Chromium) | 1.61.1 | 35 automated assertions + 8 time-indexed screenshots , runs before github push |
| **Deployment** | GitHub Pages via `static.yml` workflow | — | Push to `main` triggers deploy |
| **Python deps** | `requests`, `python-dotenv`, | — | Image/audio generation scripts |
| **CDN** | cdnjs (GSAP) | — | Single external dependency |

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
> Generator: `generate_images.py` → OpenRouter `google/gemini-2.5-flash-image`

| File | KB | Act | Used At | Depicts |
|------|-----|-----|---------|---------|
| `act1-request.png` | 1305 | Act 1 | 0s (initial) | AI robot receiving price-match request, confused expression, money bag icon |
| `act1-policy-gap.png` | 1197 | Act 1 | ~6s (swap) | Red warning banner, policy document with checkmarks, red question mark on competitor pricing |
| `act1-error.png` | 1124 | Act 1 | ~8s (swap) | AI panicking, red X, financial loss downward arrow, red flash |
| `act2-policy-check.png` | 1112 | Act 2 | *Generated but unused* | AI checking policy rulebook (generated for future use) |
| `act2-escalate.png` | 1115 | Act 2 | 10s (initial), ~12s (swap) | AI → Human handoff, green arrow, confident expression |
| `act2-success.png` | 988 | Act 2 | ~15s (swap) | Human agent + AI together, green checkmark, thumbs up |
| `act3-comparison.png` | 1016 | Act 3 | 20s (initial) | Split-screen red vs green, naive failing vs resilient succeeding |
| `act3-final.png` | 1110 | Act 3 | ~25s (swap) | "Know what you don't know" text, AI + human united team |

### 3.2 Infographic Images

> Source: `infographic/`

| File | KB | Used In | Depicts |
|------|-----|---------|---------|
| `image.png` | 955 | Act 1, `.agent-infographic` overlay (~4s) | Agent workflow: `get_customer()` → `lookup_order()` |
| `gray area.jpeg` | 115 | Act 1, `.gray-area-overlay` overlay (~7s) | Uncertainty zone, policy silence illustration |
| `what_Agent_does.png` | 151 | *Not used* | Standby infographic |

### 3.3 Audio Narration Clips

> Source: `generated-audio/2026-07-07T09-28-54Z/`
> Generator: `generate_audio.py` → `edge-tts` → `en-US-GuyNeural` (rate:+5%, pitch:-2Hz, volume:+10%)

| File | KB | Act | Trigger | Text |
|------|-----|-----|---------|------|
| `act1-narration.mp3` | 26 | Act 1 | 0.3s | *"When guidelines are silent, autonomous agents risk financial errors."* |
| `act2-narration.mp3` | 32 | Act 2 | 10s | *"The resilient agent detects the gap and escalates to a human for policy interpretation."* |
| `act3-narration.mp3` | 33 | Act 3 | 20s | *"Know what you don't know. Escalate policy gaps to the right decision-maker."* |

---

## 4. Scene-by-Scene Spec

### Act 1 — The Naive Approach (0–8s)

**Scene ID:** `#scene1` | **CSS class:** `.scene`

| Time | Event | Element | Description | Tech |
|------|-------|---------|-------------|------|
| 0.0s | Scene visible | `#scene1` | Opacity → 1 | `gsap.to(opacity:1, d:0.4)` |
| 0.0s | BG image loaded | `#scene1-bg` | `act1-request.png` at 35% opacity | `<img>` + `gsap.to(opacity:0.35, d:1)` |
| 0.2s | **Problem card** | `#problem-card` | Cyan-bordered rectangle (85% width): "The AI Agent Policy Gap Problem" — explains competitor price match, unmapped policy gap | `gsap.to(opacity:1, scale:1.05, d:0.6)` |
| 0.2s | **SVG escalation** | `#escalation-path` | Green bezier arrow drawn from AI robot (left) to Human agent (right) | `gsap.to(strokeDashoffset:0, d:1.2, ease:power3)` |
| 0.3s | SVG dots | `#dot1–4` | 4 green dots fade in sequentially along arrow path | `gsap.to(opacity:1, d:0.2 each, staggered)` |
| 0.3s | SVG arrowhead | `#escalation-arrowhead` | Polygon fades in at arrow tip | `gsap.to(opacity:1, d:0.3)` |
| 0.3s | Audio Act 1 | `<audio#audio-act1>` | Pre-generated MP3 narration plays | `audio.play()` via GSAP `tl.call()` |
| 0.3s | Subtitle 1 | `.subtitle-bar` | Red bg: *"When guidelines are silent, autonomous agents risk financial errors."* | `clipPath:inset()` character reveal, 2.2s |
| 0.5s | Subtitle 0 | `.subtitle-bar` | Red bg: *"AI agents face uncertainty when policy rules don't cover every scenario."* | Same technique, 2.0s |
| 0.5s | Console log | — | `[0.5s] Problem card displayed` | `logEvent()` |
| 5.5s | Problem card fades out | `#problem-card` | opacity→0, y:-30 | `gsap.to(opacity:0, d:0.5)` |
| 5.5s | Subtitle 2 | `.subtitle-bar` | Red bg: *"Customer requests a competitor price match."* | 1.6s reveal |
| 5.7s | **Request bubble** | `#s1-request` | Dark overlay box: "I found this cheaper at CompetitorCo. Can you match their price?" (💰 emoji) | `gsap.to(opacity:1, d:0.6)` |
| 6.2s | **Agent box** | `#s1-agent-box` | Cyan-bordered box: 🤖 "AI Agent — Analyzing request..." | `gsap.to(opacity:1, d:0.5)` + scale pulse |
| 6.4s | **Infographic overlay** | `#agent-infographic` | `infographic/image.png`: `get_customer()` → `lookup_order()` workflow diagram, cyan border | `gsap.to(opacity:1, scale:1, d:0.5)`, held 1.5s |
| 6.4s | Subtitle 3 | `.subtitle-bar` | Red bg: *"AI agent checks internal policy rules..."* | 1.5s reveal |
| 6.8s | **Policy rules** | `#s1-policy` | 4 rules listed: 3 ✅ covered, 1 ❓ gap — "Competitor price matching" | `gsap.to(opacity:1, d:0.6)` |
| 7.3s | Rule gap highlighted | `#s1-policy li.gap` | "Competitor price matching" turns bold red (#e94560) | `gsap.to(color:#e94560, fontWeight:bold, d:0.5)` |
| 7.3s | Subtitle 4 | `.subtitle-bar` | Red bg: *"Policy gap found: competitor price matching has no rule."* | 1.8s reveal |
| 7.3s | **Policy gap banner** | `#s1-gap` | Red-bordered banner: "⚠️ Policy Gap — No Rule Found" | `gsap.to(opacity:1, d:0.5)` |
| 7.5s | **Gray area overlay** | `#gray-area-overlay` | `infographic/gray area.jpeg`: uncertainty zone, red border | `gsap.to(opacity:1, d:0.5)`, held 2.5s |
| 7.5s | BG image swap | `#scene1-bg` | → `act1-policy-gap.png` | `img.src = ...` via `tl.call()` |
| 8.2s | **Agent guesses** | `#s1-guess` | 🤖💭 "I'll just... figure it out" | `gsap.to(opacity:1, d:0.5)` |
| 8.2s | Subtitle 5 | `.subtitle-bar` | Red bg: *"No matching rule. Agent guesses — applies 15% discount."* | 1.8s reveal |
| 8.5s | **Red flash** | `#flash` | Full-screen #e94560 overlay at 40% opacity | `gsap.to(opacity:0.4, d:0.15)` → `0 d:0.4` |
| 8.5s | Agent box error | `#s1-agent-box` | Border turns red, background dark red | `className = "agent-box error"` via GSAP |
| 8.5s | BG image swap | `#scene1-bg` | → `act1-error.png` | `img.src = ...` |
| 8.7s | **Error result** | `#s1-result` | Large ❌ icon + "Guessed Wrong — Unauthorized 15% Discount Applied" + "-$47.85" | `gsap.to(opacity:1, scale:1.1, d:0.4)` |
| 8.7s | Subtitle 6 | `.subtitle-bar` | Red bg: *"Financial loss: unauthorized discount applied."* | 1.5s reveal |
| 9.2s | Scene fades out | `#scene1` | Opacity → 0 | `gsap.to(opacity:0, d:0.5)` |
| 9.2s | Console log | — | `Act 1 complete — transitioning to Act 2` | `logEvent()` |

**Key Artifacts in Act 1:** 3 scene backgrounds (dynamically swapped), 2 infographic overlays, 1 audio clip, 6 subtitle reveals, 14 console events, 1 SVG escalation animation.

---

### Act 2 — The Resilient Approach (8–24s)

**Scene ID:** `#scene2` | **CSS class:** `.scene`

| Time | Event | Element | Description | Tech |
|------|-------|---------|-------------|------|
| 9.9s | Scene visible | `#scene2` | Opacity → 1 (overlaps Act 1 fade) | `gsap.to(opacity:1, d:0.4)` |
| 9.9s | BG image loaded | `#scene2-bg` | `act2-escalate.png` at 30% opacity | `gsap.to(opacity:0.3, d:1)` |
| 10.0s | Audio Act 2 | `<audio#audio-act2>` | Pre-generated MP3 narration plays | `audio.play()` |
| 10.0s | Subtitle 7 | `.subtitle-bar` | Green bg: *"The resilient agent detects the gap and escalates to a human for policy interpretation."* | clipPath reveal, 2.5s |
| 10.1s | **Request bubble** | `#s2-request` | Same text as Act 1 | `gsap.to(opacity:1, d:0.6)` |
| 10.3s | **Agent box** | `#s2-agent-box` | 🤖 "AI Agent — Checking policy rules..." | `gsap.to(opacity:1, d:0.5)` |
| 10.3s | Subtitle 8 | `.subtitle-bar` | Green bg: *"Improved agent checks policy — finds same gap."* | 1.8s reveal |
| 10.7s | **Policy rules** | `#s2-policy` | Same rules, gap highlighted: "Competitor price matching → No policy found" | `gsap.to(opacity:1, d:0.6)` |
| 11.3s | **Decision point** | `#s2-decision` | 🧠 "No deterministic rule for this." / "I know what I don't know." | `gsap.to(opacity:1, d:0.6)` |
| 11.3s | Subtitle 9 | `.subtitle-bar` | Green bg: *"Agent recognizes: no deterministic rule exists."* | 1.8s reveal |
| 12.1s | **Escalation** | `#s2-escalate` | 🤖 "Escalating to human..." → 👩‍💼 Human Agent / Policy Interpretation. Handoff animation. | `gsap.to(opacity:1, scale:1.05, d:0.5)` |
| 12.1s | BG image swap | `#scene2-bg` | → `act2-escalate.png` | Refresh escalation visual |
| 12.1s | Agent box success | `#s2-agent-box` | Border turns green | `className = "agent-box success"` |
| 12.1s | Subtitle 10 | `.subtitle-bar` | Green bg: *"Escalating to human for policy interpretation."* | 2.0s reveal |
| 13.6s | **Success result** | `#s2-result` | Large ✅ icon + "Correct Outcome — Human applied appropriate policy" + green resolution text | `gsap.to(opacity:1, scale:1, d:0.5)` |
| 13.6s | BG image swap | `#scene2-bg` | → `act2-success.png` | Green success scene |
| 13.6s | Subtitle 11 | `.subtitle-bar` | Green bg: *"Human resolves — correct outcome, zero financial error."* | 2.0s reveal |
| 19.1s | Scene fades out | `#scene2` | Opacity → 0 | `gsap.to(opacity:0, d:0.5)` |
| 19.1s | Console log | — | `Act 2 complete — transitioning to Act 3` | `logEvent()` |

**Key Artifacts in Act 2:** 2 scene backgrounds (dynamically swapped), 1 audio clip, 5 subtitle reveals, 8 console events.

---

### Act 3 — The Lesson (24–32s)

**Scene ID:** `#scene3` | **CSS class:** `.scene`

| Time | Event | Element | Description | Tech |
|------|-------|---------|-------------|------|
| 19.9s | Scene visible | `#scene3` | Opacity → 1 (overlaps Act 2 fade) | `gsap.to(opacity:1, d:0.4)` |
| 19.9s | BG image loaded | `#scene3-bg` | `act3-comparison.png` at 25% opacity | `gsap.to(opacity:0.25, d:1)` |
| 20.0s | Audio Act 3 | `<audio#audio-act3>` | Pre-generated MP3 narration plays | `audio.play()` |
| 20.0s | Subtitle 12 | `.subtitle-bar` | Cyan bg: *"Know what you don't know. Escalate policy gaps to the right decision-maker."* | clipPath reveal, 2.4s |
| 20.2s | **Side-by-side comparison** | `#s3-comparison` | Two-column layout: ❌ Naive Agent (red) vs ✅ Resilient Agent (green) | `gsap.to(opacity:1, d:0.6)` |
| 20.2s | Subtitle 13 | `.subtitle-bar` | Cyan bg: *"Naive agent guesses wrong. Resilient agent escalates."* | 2.2s reveal |
| 20.5s | Naive step 1 | `#naive-step1` | 🤖 Receives request | `gsap.to(opacity:1, d:0.3)` |
| 20.9s | Naive step 2 | `#naive-step2` | 🔍 Policy gap detected | d:0.3 |
| 21.3s | Naive step 3 | `#naive-step3` | 🎲 Guesses anyway | d:0.3 |
| 21.7s | Naive step 4 | `#naive-step4` | 💸 Wrong discount → Financial loss | d:0.3, then highlight red bold |
| 20.5s | Resilient step 1 | `#res-step1` | 🤖 Receives request | d:0.3 |
| 20.9s | Resilient step 2 | `#res-step2` | 🔍 Policy gap detected | d:0.3 |
| 21.3s | Resilient step 3 | `#res-step3` | 🚦 Detects boundary → Escalates | d:0.3 |
| 21.7s | Resilient step 4 | `#res-step4` | 👩‍💼 Human resolves → Correct outcome | d:0.3, then highlight green bold |
| 22.0s | Steps highlighted | `#naive-step4` / `#res-step4` | Red bold (naive) / Green bold (resilient), scale pulse | `gsap.to(color, fontWeight, scale, d:0.4)` |
| 22.5s | **Error Rate metric** | `#s3-metric` | Metric box: "Error Rate for Unmapped Policy Gaps" | `gsap.to(opacity:1, d:0.5)` |
| 22.9s | **100% → 0% animation** | `#metric-end` | Green "0%" scales in from 0.5, red "100%" dims to gray | `gsap.fromTo(opacity:0,scale:0.5 → opacity:1,scale:1,d:0.6)` |
| 22.9s | Subtitle 14 | `.subtitle-bar` | Cyan bg: *"Error rate drops from 100% to 0% with human escalation."* | 2.0s reveal |
| 24.8s | **Final text** | `#s3-final` | "Know what you don't know. Escalate policy gaps." in cyan, 48px | `gsap.to(opacity:1, y:0, d:0.8)` + text-shadow glow |
| 24.8s | Console log | — | `Final message displayed` | `logEvent()` |
| 25.1s | BG image swap | `#scene3-bg` | → `act3-final.png` | Final lesson scene |
| 25.4s | **Rationale card** | `#rationale-card` | Green-bordered rectangle: "Why Escalation Is Correct" — 4-line explanation: automated agents use deterministic rules, when silent = policy gap, autonomous resolution risks financial errors, human handoff is only safe path | `gsap.to(opacity:1, scale:1.03, d:0.6)`, held 2.5s |
| 25.4s | Console log | — | `Rationale box displayed` | `logEvent()` |
| 26.3s | **GitHub Pages banner** | `#gh-banner` | Cyan-bordered URL: `rifaterdemsahin.github.io/Customer-Support-Resolution-Agent` | `gsap.to(opacity:1, y:-10, d:0.6)` + scale pulse |
| 26.3s | Console log | — | `GitHub Pages URL banner shown` | `logEvent()` |
| 30.0s | **Timeline complete** | `#timeline` | 4px cyan progress bar reaches 100% width | `gsap.to(width:100%, d:30, ease:none)` |
| 30.0s | Loop restart | — | Console: `[30s] Animation loop restart` → `tl.restart(true, false)` | `onComplete` callback |

**Key Artifacts in Act 3:** 2 scene backgrounds (dynamically swapped), 1 audio clip, 4 subtitle reveals, 7 console events, 1 rationale card, 1 GitHub Pages banner.

---

## 5. Global Timeline Elements

| Element | CSS | Animation | Duration |
|---------|-----|-----------|----------|
| `.timeline-bar` `#timeline` | 4px height, `#00d4aa` | `width: 0% → 100%` | 30s, `ease:none` |
| `.debug-panel` `#debug-panel` | Bottom of stage, 220px tall | Opens on click (translateY) | 0.35s transition |
| Debug progress bar | `#prog-fill` | Live width from `tl.time() / 30 * 100` | Every 150ms via `setInterval` |

---

## 6. Console Event Log (Chronological)

All events logged via `logEvent()` → `console.log('[X.Xs] event')` + debug panel entry.

| # | Time | Event | Class |
|---|------|-------|-------|
| 1 | 0.0 | Debug panel initialized | info |
| 2 | 0.0 | GSAP v3.12.5 loaded | artifact |
| 3 | 0.5 | Problem card displayed — AI Agent Policy Gap Problem | info |
| 4 | 5.5 | Problem card dismissed | info |
| 5 | 5.7 | Customer request bubble appears | info |
| 6 | 6.0 | AI Agent appears — analyzing request | info |
| 7 | 6.2 | Infographic shown: get_customer() + lookup_order() | info |
| 8 | 6.4 | Policy rules shown — competitor gap highlighted | info |
| 9 | 7.0 | Policy Gap banner shown | info |
| 10 | 7.3 | Gray area shown — policy silence / uncertainty zone | error |
| 11 | 7.8 | Agent guesses — applies unauthorized discount | info |
| 12 | 8.1 | Red flash — error state triggered | info |
| 13 | 8.6 | Error result displayed — financial loss | info |
| 14 | 9.2 | Act 1 complete — transitioning to Act 2 | info |
| 15 | 9.9 | Act 2 started — The Resilient Approach | info |
| 16 | 10.1 | Same competitor price match request arrives | info |
| 17 | 10.3 | Resilient agent appears | info |
| 18 | 10.7 | Policy gap confirmed again | info |
| 19 | 11.3 | Agent decides — no guessing this time | info |
| 20 | 12.1 | Escalation to human agent initiated | info |
| 21 | 13.6 | Success — human agent applied correct policy | info |
| 22 | 19.1 | Act 2 complete — transitioning to Act 3 | info |
| 23 | 19.9 | Act 3 started — The Lesson / Comparison | info |
| 24 | 20.2 | Side-by-side comparison columns appear | info |
| 25 | 22.6 | Metric animation: 100% → 0% | info |
| 26 | 24.8 | Final message displayed | info |
| 27 | 25.4 | Rationale box displayed — why escalation is correct | info |
| 28 | 26.3 | GitHub Pages URL banner shown | info |
| 29 | 30.0 | Animation loop restart | info |

---

## 7. Subtitle Inventory

All 15 subtitles use `clipPath: inset()` character-by-character reveal via GSAP `steps()` easing. Hold time: 3.5s after reveal before `opacity:0` fade.

| # | Act | BG Color | Text | Reveal | When |
|---|-----|----------|------|--------|------|
| 1 | Act 1 | #e94560 (red) | *"AI agents face uncertainty when policy rules don't cover every scenario."* | 2.0s | 0.5s |
| 2 | Act 1 | #e94560 (red) | *"When guidelines are silent, autonomous agents risk financial errors."* | 2.2s | 0.3s |
| 3 | Act 1 | #e94560 (red) | *"Customer requests a competitor price match."* | 1.6s | 5.5s |
| 4 | Act 1 | #e94560 (red) | *"AI agent checks internal policy rules..."* | 1.5s | 6.2s |
| 5 | Act 1 | #e94560 (red) | *"Policy gap found: competitor price matching has no rule."* | 1.8s | 7.1s |
| 6 | Act 1 | #e94560 (red) | *"No matching rule. Agent guesses — applies 15% discount."* | 1.8s | 8.0s |
| 7 | Act 1 | #e94560 (red) | *"Financial loss: unauthorized discount applied."* | 1.5s | 8.7s |
| 8 | Act 2 | #00cc66 (green) | *"The resilient agent detects the gap and escalates to a human for policy interpretation."* | 2.5s | 10.0s |
| 9 | Act 2 | #00cc66 (green) | *"Improved agent checks policy — finds same gap."* | 1.8s | 10.5s |
| 10 | Act 2 | #00cc66 (green) | *"Agent recognizes: no deterministic rule exists."* | 1.8s | 11.7s |
| 11 | Act 2 | #00cc66 (green) | *"Escalating to human for policy interpretation."* | 2.0s | 12.1s |
| 12 | Act 2 | #00cc66 (green) | *"Human resolves — correct outcome, zero financial error."* | 2.0s | 13.8s |
| 13 | Act 3 | #00d4aa (cyan) | *"Know what you don't know. Escalate policy gaps to the right decision-maker."* | 2.4s | 20.0s |
| 14 | Act 3 | #00d4aa (cyan) | *"Naive agent guesses wrong. Resilient agent escalates."* | 2.2s | 20.4s |
| 15 | Act 3 | #00d4aa (cyan) | *"Error rate drops from 100% to 0% with human escalation."* | 2.0s | 22.9s |

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
| Toggle bar | `#debug-toggle` | Full width, 34px height | Click to open/close, shows progress + artifact counts |
| Progress bar | `#prog-fill` | 60px × 6px | Live fill from `tl.time() / 30 * 100`, every 150ms |
| Progress text | `#prog-text` | — | `"X.Xs / 30.0s"` |
| Image badge | `#status-imgs` | — | `"🖼 N/M"` — turns red if not all loaded |
| Audio badge | `#status-audio` | — | `"🔊 N/M"` — turns red if not all loaded |
| Event badge | `#status-events` | — | `"📋 N"` total event count |
| Event timeline | `#debug-timeline` | 360px wide, scrollable | Color-coded dots: cyan=info, green=artifact, red=error, orange=transition, purple=subtitle, pink=image |
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
│      ├── gray area.jpeg     → uncertainty zone                   │
│      └── what_Agent_does.png → standby                           │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  index.html  (single file, 1474 lines)                           │
│                                                                 │
│  <style>        → all CSS (dark theme, overlays, panels)         │
│  <div#stage>    → 3 scenes + problem card + debug panel          │
│  <script>       → GSAP 3.12.5 timeline engine                    │
│                                                                 │
│  ARTIFACTS LOADED:                                               │
│      <img> × 3  → scene backgrounds (dynamic src swap)           │
│      <img> × 2  → infographic overlays                           │
│      <svg> × 1  → escalation illustration                        │
│      <audio> × 3 → narration MP3s (preload=auto)                 │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  OUTPUTS                                                         │
│                                                                 │
│  https://rifaterdemsahin.github.io/Customer-Support-Resolution-Agent/ │
│                                                                 │
│  test-animation.js → 35 assertions + 6 screenshots               │
│  test-screenshots/<TIMESTAMP>/ → 6 PNG snapshots                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. File Inventory

```
Customer-Support-Resolution-Agent/
├── index.html                              # Single-file demo (HTML+CSS+JS inline)
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
├── infographic/                            # 3 manual infographic assets
│   ├── image.png
│   ├── gray area.jpeg
│   └── what_Agent_does.png
├── test-screenshots/                       # Playwright output (timestamped, gitignored)
├── README.md
└── SPEC.md                                 # ← This document
```

---

## 12. Commands

```bash
# View locally
open index.html

# Regenerate images (requires .env with OPENROUTER_API_KEY)
pip install -r requirements.txt
python generate_images.py
# → Update <img src> in index.html to new timestamp

# Regenerate audio
pip install edge-tts
python generate_audio.py
# → Update <audio src> in index.html to new timestamp

# Run test suite
npm install && npx playwright install chromium
node test-animation.js

# Deploy (automated on push)
git push origin main
# → GitHub Actions deploys to Pages
```

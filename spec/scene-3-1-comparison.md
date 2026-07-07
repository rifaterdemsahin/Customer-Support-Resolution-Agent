# Scene 3.1 — Comparison

> **Act:** Act 3 — The Lesson  
> **File:** `act3.html`  
> **Time:** 0.0s – 2.5s  
> **Debug Bar:** `📍 Scene 1/3: Comparison`

---

## Purpose

Side-by-side comparison of the naive and resilient agent workflows. Each column reveals steps sequentially, then highlights the critical divergence point.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Scene container | `#scene3` | Full-stage container |
| Background | `#scene3-bg` | `act3-comparison.png` at 25% opacity |
| Act label | `.act-label` | "Act 3 — The Lesson" top-left |
| Section heading | `h1` | "Side-by-Side Comparison", 44px |
| Comparison container | `#s3-comparison` | Two-column flex layout |
| Naive column | `.col.naive` | Red `#e94560` header: "❌ Naive Agent" |
| Resilient column | `.col.resilient` | Green `#00cc66` header: "✅ Resilient Agent" |
| Naive step 1 | `#n1` | 🤖 Receives request |
| Naive step 2 | `#n2` | 🔍 Policy gap detected |
| Naive step 3 | `#n3` | 🎲 Guesses anyway |
| Naive step 4 | `#n4` | 💸 Wrong discount → Financial loss |
| Resilient step 1 | `#r1` | 🤖 Receives request |
| Resilient step 2 | `#r2` | 🔍 Policy gap detected |
| Resilient step 3 | `#r3` | 🚦 Detects boundary → Escalates |
| Resilient step 4 | `#r4` | 👩‍💼 Human resolves → Correct outcome |
| Timeline bar | `#timeline` | Cyan `#00d4aa` progress bar |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 0.0s | Scene BG at 25% opacity | `gsap.to(opacity:0.25, d:1)` |
| 0.3s | Comparison columns appear | `gsap.to(opacity:1, d:0.6)` |
| 0.6s | n1 + r1 fade in | `gsap.to(opacity:1, d:0.3)` each |
| 1.0s | n2 + r2 fade in | d:0.3, sequential offset |
| 1.4s | n3 + r3 fade in | d:0.3 |
| 1.8s | n4 + r4 fade in | d:0.3 |
| 2.1s | n4/r4 highlighted | Red bold scale pulse for n4, green for r4 |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 13 | *"Naive agent guesses wrong. Resilient agent escalates."* | 2.2s | Cyan `#00d4aa` |

## Navigation

| Link | Target |
|------|--------|
| ◀ Act 2 | `act2.html` |
| 🏠 Storyboard | `index.html` |

## Debug Events

| Event | Description |
|-------|-------------|
| Act 3 started | Timeline begins |
| Comparison columns appear | Two columns visible |
| Scene 1/3: Comparison | Debug bar badge updated via `showScene()` |

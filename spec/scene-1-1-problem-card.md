# Scene 1.1 — Problem Card

> **Act:** Act 1 — The Naive Approach  
> **File:** `act1.html`  
> **Time:** 0.0s – 4.0s  
> **Debug Bar:** `📍 Scene 1/3: Problem Card`

---

## Purpose

Introduce the policy gap problem. Show the problem card with an SVG escalation illustration demonstrating the correct path (AI → Human handoff). Set the premise that AI agents face uncertainty when policy rules are incomplete.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Scene container | `#scene1` | Full-stage container, opacity → 1 at 0s |
| Background | `#scene1-bg` | `act1-request.png` at 35% opacity |
| Act label | `.act-label` | "Act 1 — The Naive Approach" top-left |
| Problem card | `#problem-card` | Cyan-bordered overlay, 85% width: "The AI Agent Policy Gap Problem" |
| Problem title | `.problem-title` | 56px, cyan `#00d4aa`: "The AI Agent Policy Gap Problem" |
| Problem subtitle | `.problem-subtitle` | 28px, gray: explains competitor price match, policy silence |
| Problem rule | `.problem-rule` | Red-bordered pill: "Unmapped Policy Gap — No Deterministic Rule" |
| SVG escalation | `#escalation-svg-wrap` | AI robot → Human agent with bezier path, glow animations |
| Escalation path | `#escalation-path` | Green `#00cc66` stroke-dashoffset reveal, 1.2s |
| Arrowhead | `#escalation-arrowhead` | Green polygon at path end |
| Flow dots | `#dot1–4` | 4 green dots fading in along path |
| Flow label | `#flow-label` | "escalation" text fading in |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 0.0s | Scene BG at 35% opacity | `gsap.to(opacity:0.35, d:1)` |
| 0.2s | Problem card appears, scale pulse | `gsap.to(opacity:1, scale:1.05, d:0.6)` → scale:1 |
| 0.2s | SVG escalation path draws | `gsap.to(strokeDashoffset:0, d:1.2, ease:power3)` |
| 0.3s | Arrowhead fades in | `gsap.to(opacity:1, d:0.3)` |
| 0.3s | Flow dots stagger fade-in | `gsap.to(opacity:1, d:0.2)` each, staggered |
| 0.4s | Flow label fades in | `gsap.to(opacity:1, d:0.4)` |
| 2.0s | Problem card held visible | `gsap.to(opacity:1, d:2.0)` |
| 4.0s | Problem card fades out up | `gsap.to(opacity:0, y:-30, d:0.5)` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 1 | *"AI agents face uncertainty when policy rules don't cover every scenario."* | 2.0s | Red `#e94560` |

## Narration

MP3: `act1-narration.mp3` — *"When guidelines are silent, autonomous agents risk financial errors."* — triggered via `playAudio()` around 0.3s.

## SVG Components

| Element | Color | Size | Animation |
|---------|-------|------|-----------|
| AI head | `#00d4aa` stroke, 3px | 56×44, rx:8 | Static |
| AI eyes | `#00d4aa` fill | r:5 | Static |
| AI body | `#00d4aa` stroke, 3px | 72×50, rx:10 | Static |
| AI antenna glow | `#00d4aa`, opacity oscillates | r:10→14 | SVG `<animate>` 2s loop |
| Escalation path | `#00cc66` stroke, 3px | bezier 210→470 | GSAP strokeDashoffset |
| Arrowhead | `#00cc66` fill | polygon | Fade-in |
| Flow dots (4) | `#00cc66` fill, r:4 | Along path | Staggered fade |
| Human head | `#00cc66` stroke, 3px | r:18 | Static |
| Human smile | `#00cc66` stroke, 2px | Q path | Static |
| Human body | `#00cc66` stroke, 3px | 48×50, rx:10 | Static |
| Human glow | `#00cc66`, opacity oscillates | r:28→34 | SVG `<animate>` 2.5s loop |
| AI label | `#00d4aa` fill, 20px | "AI Agent" / "Autonomous" | Static |
| Human label | `#00cc66` fill, 20px | "Human Agent" / "Expert" | Static |
| Escalation label | `#888` fill, 14px | x:350, y:65 | Fade-in |

## Debug Events

| Event | Description |
|-------|-------------|
| Act 1 started | Timeline begins |
| Problem card displayed | Card + SVG visible |
| Scene 1/3: Problem Card | Debug bar badge updated via `showScene()` |

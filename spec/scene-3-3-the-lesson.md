# Scene 3.3 — The Lesson

> **Act:** Act 3 — The Lesson  
> **File:** `act3.html`  
> **Time:** 5.0s – 8.0s  
> **Debug Bar:** `📍 Scene 3/3: The Lesson`

---

## Purpose

Present the rationale card explaining why escalation is correct, show the GitHub Pages deployment URL, play the final narration, and loop.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Rationale card | `#rationale-card` | Green-bordered overlay, 80% width: "Why Escalation Is Correct" |
| Rationale title | `.rationale-title` | 38px, green `#00cc66` |
| Rationale body | `.rationale-body` | 26px, 4-line explanation with cyan highlights |
| GitHub banner | `#gh-banner` | Cyan-bordered: "🔗 View the live demo" + URL |
| Timeline bar | `#timeline` | Cyan progress bar reaches 100% by 8s |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 3.6s | Rationale card appears | `gsap.to(opacity:1, scale:1.03, d:0.6)` → scale:1 |
| 4.2s | GitHub banner appears with pulse | `gsap.to(opacity:1, y:-10, d:0.6)` + scale 1.02 yoyo |
| 5.0s | Debug bar: Scene 3 | `showScene(3, 'The Lesson')` |
| ~6.2s | Rationale card fades out | `gsap.to(opacity:0, d:0.4)` |
| ~6.5s | Narration audio plays | `playAudio()` |
| 8.0s | Loop restart | `tl.restart(true, false)` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 15 | *"Know what you don't know. Escalate policy gaps to the right decision-maker."* | 2.4s | Cyan `#00d4aa` |

## Rationale Card Content

```
Why Escalation Is Correct

Automated agents execute deterministic rules.
When formal guidelines are silent — an unmapped policy gap —
autonomous resolution risks financial errors.
Human handoff is the only safe path for policy interpretation.
```

Styled with `<span>` highlights in cyan `#00d4aa` on keywords.

## GitHub Pages Banner

| Field | Value |
|-------|-------|
| Label | "🔗 View the live demo" |
| URL | `rifaterdemsahin.github.io/Customer-Support-Resolution-Agent` |
| Color | Cyan `#00d4aa`, 32px bold |

## Narration

MP3: `act3-narration.mp3` — triggered via `playAudio()` around 6.5s.

## Debug Events

| Event | Description |
|-------|-------------|
| Rationale box shown | Why escalation is correct |
| GitHub Pages URL shown | Live demo link |
| Scene 3/3: The Lesson | Debug bar badge updated via `showScene()` |

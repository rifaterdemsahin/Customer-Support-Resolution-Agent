# Scene 2.3 — Success

> **Act:** Act 2 — The Resilient Approach  
> **File:** `act2.html`  
> **Time:** 7.0s – 16.0s  
> **Debug Bar:** `📍 Scene 3/3: Success`

---

## Purpose

Display the successful outcome: human agent resolves correctly with zero financial error. The narration delivers the core Act 2 message about resilient escalation.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Success result | `#s2-result` | ✅ "Correct Outcome — Human applied appropriate policy" |
| Resolution text | — | "Resolution: Fair decision, no financial error" |
| Scene container | `#scene2` | Fades out at 13s |
| Timeline bar | `#timeline` | Green progress bar reaches 100% by 16s |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 7.0s | Debug bar: Scene 3 | `showScene(3, 'Success')` |
| 7.3s | Escalation held visible | `gsap.to(opacity:1, d:2.0)` |
| 7.8s | Escalation fades out | `gsap.to(opacity:0, d:0.3)` |
| 8.3s | Success result appears | `gsap.to(opacity:1, scale:1, d:0.5)` |
| 10.3s | Success result held | `gsap.to(opacity:1, d:2.5)` |
| ~11s | Narration audio plays | `playAudio()` |
| 13.0s | Scene fades out | `gsap.to(opacity:0, d:0.5)` |
| 16.0s | Loop restart | `tl.restart(true, false)` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 11 | *"Human resolves — correct outcome, zero financial error."* | 2.0s | Green `#00cc66` |
| 12 | *"The resilient agent detects the gap and escalates to a human for policy interpretation."* | 2.5s | Green `#00cc66` |

## Narration

MP3: `act2-narration.mp3` — triggered via `playAudio()` around 11s.

## Outcome Details

| Field | Value |
|-------|-------|
| Result | Correct |
| Error rate | 0% |
| Resolution | Human-applied policy |
| Financial impact | Zero error |

## Debug Events

| Event | Description |
|-------|-------------|
| Success — correct outcome | ✅ displayed |
| Act 2 complete | Fade out, transition marker |
| Scene 3/3: Success | Debug bar badge updated via `showScene()` |

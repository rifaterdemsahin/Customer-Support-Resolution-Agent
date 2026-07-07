# Scene 1.3 — Error Outcome

> **Act:** Act 1 — The Naive Approach  
> **File:** `act1.html`  
> **Time:** 6.5s – 8.0s  
> **Debug Bar:** `📍 Scene 3/3: Error Outcome`

---

## Purpose

Show the naive agent guessing instead of escalating, triggering a red error flash and displaying the financial loss result. The final subtitle delivers the core message: autonomous agents risk errors when guidelines are silent.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Guess display | `#s1-guess` | 🤖💭 "I'll just... figure it out" |
| Flash overlay | `#flash` | Full-screen `#e94560` at 40% opacity, flashes in/out |
| Agent box (error state) | `#s1-agent-box` | Border → red `#e94560`, background → dark red |
| Error result | `#s1-result` | ❌ "Guessed Wrong — Unauthorized 15% Discount Applied" + "-$47.85" |
| Timeline bar | `#timeline` | Red progress bar reaches 100% by 8s |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 6.0s | Guess display appears | `gsap.to(opacity:1, d:0.5)` |
| 6.3s | Red flash on | `gsap.to(opacity:0.4, d:0.15)` |
| 6.3s | Red flash off | `gsap.to(opacity:0, d:0.4)` |
| 6.3s | Agent box → error class | `className = "agent-box error", d:0.2` |
| 6.3s | Debug bar: Scene 3 | `showScene(3, 'Error Outcome')` |
| 6.5s | Error result appears with scale | `gsap.to(opacity:1, scale:1.1, d:0.4)` → scale:1 |
| 7.5s | Scene fades out | `gsap.to(opacity:0, d:0.5)` |
| 8.0s | Loop restart | `tl.restart(true, false)` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 6 | *"No matching rule. Agent guesses — applies 15% discount."* | 1.8s | Red `#e94560` |
| 7 | *"Financial loss: unauthorized discount applied."* | 1.5s | Red `#e94560` |
| 2 | *"When guidelines are silent, autonomous agents risk financial errors."* | 2.2s | Red `#e94560` |

## Error Details

| Field | Value |
|-------|-------|
| Error type | Unauthorized discount |
| Discount applied | 15% |
| Financial loss | -$47.85 |
| Agent state | Guessed without policy support |

## Debug Events

| Event | Description |
|-------|-------------|
| Agent guesses | Guess text displayed |
| Red flash — error | Flash overlay triggered |
| Error result — financial loss | ❌ displayed |
| Act 1 complete | Fade out, transition marker |
| Scene 3/3: Error Outcome | Debug bar badge updated via `showScene()` |

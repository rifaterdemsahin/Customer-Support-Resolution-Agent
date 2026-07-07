# Scene 2.1 — Policy Check

> **Act:** Act 2 — The Resilient Approach  
> **File:** `act2.html`  
> **Time:** 0.0s – 3.6s  
> **Debug Bar:** `📍 Scene 1/3: Policy Check`

---

## Purpose

Replay the same scenario with an improved agent. Show the agent receiving the identical request, checking policy rules, and confirming the same gap exists — but this time the agent recognizes the boundary.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Scene container | `#scene2` | Full-stage container |
| Background | `#scene2-bg` | `act2-escalate.png` at 30% opacity |
| Act label | `.act-label` | "Act 2 — The Resilient Approach" top-left |
| Request bubble | `#s2-request` | Dark overlay: 💰 "I found this cheaper at CompetitorCo..." |
| Agent box | `#s2-agent-box` | Cyan border: 🤖 "AI Agent — Checking policy rules..." |
| Policy rules box | `#s2-policy` | Same 4 rules as Act 1 |
| Gap highlight | `#s2-policy li.gap` | "Competitor price matching → No policy found", red bold |
| Timeline bar | `#timeline` | Green `#00cc66` progress bar |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 0.0s | Scene BG at 30% opacity | `gsap.to(opacity:0.3, d:1)` |
| 0.3s | Request bubble appears | `gsap.to(opacity:1, d:0.6)` |
| 0.8s | Agent box appears | `gsap.to(opacity:1, d:0.5)` |
| 1.8s | Policy rules box appears | `gsap.to(opacity:1, d:0.6)` |
| 2.6s | Gap rule highlighted red bold | `gsap.to(color:#e94560, fontWeight:bold, d:0.5)` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 8 | *"Improved agent checks policy — finds same gap."* | 1.8s | Green `#00cc66` |

## Policy Rules

| Rule | Status | Indicator |
|------|--------|-----------|
| Own-site price drop (within 14 days) | Covered | ✅ |
| Bundle discount with existing subscription | Covered | ✅ |
| Competitor price matching → **No policy found** | **Gap** | ❓ (red) |
| Coupon stacking (max 2) | Covered | ✅ |

## Navigation

| Link | Target |
|------|--------|
| ◀ Act 1 | `act1.html` |
| 🏠 Storyboard | `index.html` |
| Act 3 ▶ | `act3.html` |

## Debug Events

| Event | Description |
|-------|-------------|
| Act 2 started | Timeline begins |
| Request arrives | Same competitor price match |
| Agent appears | Resilient agent box visible |
| Policy gap confirmed | Same gap detected |
| Scene 1/3: Policy Check | Debug bar badge updated via `showScene()` |

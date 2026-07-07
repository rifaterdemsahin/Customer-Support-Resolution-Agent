# Scene 1.2 — Policy Gap

> **Act:** Act 1 — The Naive Approach  
> **File:** `act1.html`  
> **Time:** 4.0s – 6.5s  
> **Debug Bar:** `📍 Scene 2/3: Policy Gap`

---

## Purpose

Show the naive AI agent receiving the customer's price-match request, checking internal policy rules, and hitting an unmapped gap. Display infographics and gray-area illustrations to emphasize the uncertainty.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Request bubble | `#s1-request` | Dark overlay: 💰 "I found this cheaper at CompetitorCo..." |
| Agent box | `#s1-agent-box` | Cyan border: 🤖 "AI Agent — Analyzing request..." with scale pulse |
| Agent infographic | `#agent-infographic` | `infographic/image.png`: `get_customer()` → `lookup_order()` workflow, cyan border |
| Policy rules box | `#s1-policy` | 4 rules: 3 ✅ covered, 1 ❓ gap |
| Gap highlight | `#s1-policy li.gap` | "Competitor price matching" → red `#e94560`, bold |
| Policy gap banner | `#s1-gap` | Red-bordered: "⚠️ Policy Gap — No Rule Found" |
| Gray area overlay | `#gray-area-overlay` | `infographic/gray area.jpeg`: uncertainty zone, red border |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 4.0s | Problem card fades out | (from previous scene) |
| 4.2s | Request bubble appears | `gsap.to(opacity:1, d:0.6)` |
| 4.5s | Agent box appears with pulse | `gsap.to(opacity:1, d:0.5)` + scale 1.02 yoyo |
| 4.7s | Infographic overlay shown | `gsap.to(opacity:1, scale:1, d:0.5)`, held 1.0s |
| 5.0s | Policy rules box appears | `gsap.to(opacity:1, d:0.6)` |
| 5.5s | Gap rule highlighted red bold | `gsap.to(color:#e94560, fontWeight:bold, d:0.5)` |
| 5.5s | Gap banner appears | `gsap.to(opacity:1, scale:1, d:0.5)` |
| 5.7s | Gray area overlay shown | `gsap.to(opacity:1, d:0.5)`, held 2.0s |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 3 | *"Customer requests a competitor price match."* | 1.6s | Red `#e94560` |
| 4 | *"AI agent checks internal policy rules..."* | 1.5s | Red `#e94560` |
| 5 | *"Policy gap found: competitor price matching has no rule."* | 1.8s | Red `#e94560` |

## Policy Rules Displayed

| Rule | Status | Indicator |
|------|--------|-----------|
| Own-site price drop (within 14 days) | Covered | ✅ |
| Bundle discount with existing subscription | Covered | ✅ |
| Competitor price matching | **Gap** | ❓ (red) |
| Coupon stacking (max 2) | Covered | ✅ |

## Narration

Same MP3 as Scene 1.1 — `act1-narration.mp3` may still be playing.

## Debug Events

| Event | Description |
|-------|-------------|
| Request bubble appears | Customer text visible |
| Agent appears | Agent box + pulse |
| Infographic shown | `get_customer()` → `lookup_order()` |
| Policy gap highlighted | Gap rule turns red |
| Gap banner shown | "No Rule Found" |
| Gray area overlay shown | Uncertainty zone |
| Scene 2/3: Policy Gap | Debug bar badge updated via `showScene()` |

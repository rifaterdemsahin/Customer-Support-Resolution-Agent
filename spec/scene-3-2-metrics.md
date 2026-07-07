# Scene 3.2 — Metrics

> **Act:** Act 3 — The Lesson  
> **File:** `act3.html`  
> **Time:** 2.5s – 5.0s  
> **Debug Bar:** `📍 Scene 2/3: Metrics`

---

## Purpose

Animate the error rate metric from 100% (naive) to 0% (resilient), emphasizing the quantitative impact of proper escalation. Display the final takeaway message.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Metric box | `#s3-metric` | Dark bordered box: "Error Rate for Unmapped Policy Gaps" |
| 100% value | `#metric-start` | Red `#e94560`, 72px: "100%" |
| Arrow | `.arrow.cyan` | Cyan `#00d4aa`: "→" |
| 0% value | `#metric-end` | Green `#00cc66`, 72px: "0%" |
| Final text | `#s3-final` | Cyan, 48px: "Know what you don't know. Escalate policy gaps." |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 2.4s | Metric box appears | `gsap.to(opacity:1, d:0.5)` |
| 2.5s | Debug bar: Scene 2 | `showScene(2, 'Metrics')` |
| 2.8s | 0% scales in from 0.5 | `gsap.fromTo(opacity:0,scale:0.5 → opacity:1,scale:1, d:0.6)` |
| 2.8s | 100% dims to gray | `gsap.to(opacity:0.2, scale:0.8, color:"#555", d:0.5)` |
| 3.2s | Final text appears | `gsap.to(opacity:1, y:0, d:0.8)` |
| 3.6s | Final text scale pulse | Scale 1.03 yoyo + text-shadow glow `rgba(0,212,170,0.6)` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 14 | *"Error rate drops from 100% to 0% with human escalation."* | 2.0s | Cyan `#00d4aa` |

## Metric Animation Spec

```
Frame 1:  100%  →  0%    (100% visible, 0% hidden)
Frame 2:  100%  →  0%    (0% scales in, 100% dims & shrinks)
End:       100%  →  0%    (0% prominent green, 100% faded gray)
```

## Debug Events

| Event | Description |
|-------|-------------|
| Metric 100% → 0% | Animation triggered |
| Final message displayed | Takeaway text visible |
| Scene 2/3: Metrics | Debug bar badge updated via `showScene()` |

# Scene 2.2 — Decision

> **Act:** Act 2 — The Resilient Approach  
> **File:** `act2.html`  
> **Time:** 3.6s – 7.0s  
> **Debug Bar:** `📍 Scene 2/3: Decision`

---

## Purpose

Show the agent making the correct decision: recognizing the policy boundary and initiating a handoff to a human expert for policy interpretation.

## Visual Elements

| Element | ID | Description |
|---------|-----|-------------|
| Decision point | `#s2-decision` | 🧠 "No deterministic rule for this." / "I know what I don't know." |
| Escalation row | `#s2-escalate` | Horizontal flex: Agent box (green/success) → green arrow → Human agent box |
| Agent box (success) | `#s2-agent-box` | Border → green `#00cc66`, background → dark green |
| Human icon | — | 👩‍💼 with "Human Agent" / "Policy Interpretation" labels |

## GSAP Timeline

| Time | Event | Tech |
|------|-------|------|
| 3.6s | Decision point appears | `gsap.to(opacity:1, d:0.6)` |
| 3.6s | Debug bar: Scene 2 | `showScene(2, 'Decision')` |
| 5.1s | Decision fades out | `gsap.to(opacity:0, d:0.3)` |
| 5.4s | Escalation appears with scale pulse | `gsap.to(opacity:1, scale:1.05, d:0.5)` → scale:1 |
| 5.4s | Agent box → success class | `className = "agent-box success", d:0.2` |

## Subtitles

| # | Text | Reveal | BG |
|---|------|--------|-----|
| 9 | *"Agent recognizes: no deterministic rule exists."* | 1.8s | Green `#00cc66` |
| 10 | *"Escalating to human for policy interpretation."* | 2.0s | Green `#00cc66` |

## Escalation Handoff Flow

```
🤖 AI Agent (green border)  →  👩‍💼 Human Agent
    "Escalating to human..."     "Policy Interpretation"
```

## Debug Events

| Event | Description |
|-------|-------------|
| Decision — no guessing | Agent recognizes boundary |
| Escalation to human | Handoff animation |
| Scene 2/3: Decision | Debug bar badge updated via `showScene()` |

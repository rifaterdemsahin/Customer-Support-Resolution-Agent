# Script — AI Agent: Escalate vs. Guess

> Narrative screenplay for the 3-act animated demo.  
> Timings relative to each act file (0s start).  
> Scene specs: `spec/scene-*-*.md`

---

## Act 1 — The Naive Approach (8s, `act1.html`)

### Scene 1.1 — Problem Card (0.0s – 4.0s)

*FADE IN. A dark stage with a glowing cyan-bordered card superimposed over the background image of an AI robot looking confused beside a money bag icon.*

The PROBLEM CARD fills center stage.

> **Problem Card:** The AI Agent Policy Gap Problem
>
> A customer requests a competitor price match.  
> Internal policy covers own-site drops within 14 days —  
> but is **silent on competitor pricing**.
>
> ⚠️ Unmapped Policy Gap — No Deterministic Rule

An SVG illustration draws itself beneath the card: an AI robot on the left, a green bezier arrow tracing across to a human agent on the right. Four green dots pulse along the path. The label "escalation" fades in.

**Narration:** *"When guidelines are silent, autonomous agents risk financial errors."*

**Subtitle (red):** *"AI agents face uncertainty when policy rules don't cover every scenario."*

The problem card holds for 2 seconds, then slides up and fades out.

> *[Scene indicator: SCENE 1/3 — Problem Card]*
>
> ➡ `spec/scene-1-1-problem-card.md`

---

### Scene 1.2 — Policy Gap (4.0s – 6.5s)

*The stage clears. A CUSTOMER REQUEST BUBBLE fades in — a dark overlay box with a money bag icon.*

> 💰 "I found this cheaper at CompetitorCo. Can you match their price?"

An AI AGENT BOX appears below, cyan-bordered.

> 🤖 AI Agent — Analyzing request...

An INFOGRAPHIC overlay fades in: a workflow diagram showing `get_customer()` → `lookup_order()`.

A POLICY RULES box appears. Four rules are listed. Three have green checkmarks. One — "Competitor price matching" — sits with a red question mark.

> 📋 Policy Rules Check:
> - ✅ Own-site price drop (within 14 days)
> - ✅ Bundle discount with existing subscription
> - ❓ **Competitor price matching** ← turns bold red
> - ✅ Coupon stacking (max 2)

A POLICY GAP BANNER flashes in red.

> ⚠️ Policy Gap — No Rule Found

A GRAY AREA overlay slides in — uncertainty zone — "Policy Gap — No Deterministic Rule Exists" in red.

The agent is stuck. No rule. What will it do?

**Subtitles (red):**
1. *"Customer requests a competitor price match."*
2. *"AI agent checks internal policy rules..."*
3. *"Policy gap found: competitor price matching has no rule."*

> *[Scene indicator: SCENE 2/3 — Policy Gap]*
>
> ➡ `spec/scene-1-2-policy-gap.md`

---

### Scene 1.3 — Error Outcome (6.5s – 8.0s)

*The gray area overlay fades. The AI agent hesitates — a thought bubble appears.*

> 🤖💭 "I'll just... figure it out"

A full-screen RED FLASH. The agent box border turns red. Background shifts to dark red.

> ❌ Guessed Wrong — Unauthorized 15% Discount Applied  
> Financial loss: -$47.85

The screen fades to black as the timeline bar reaches 100%.

**Subtitles (red):**
1. *"No matching rule. Agent guesses — applies 15% discount."*
2. *"Financial loss: unauthorized discount applied."*
3. *"When guidelines are silent, autonomous agents risk financial errors."*

> *[Scene indicator: SCENE 3/3 — Error Outcome]*  
> *LOOP → restart*
>
> ➡ `spec/scene-1-3-error-outcome.md`

---

## Act 2 — The Resilient Approach (16s, `act2.html`)

### Scene 2.1 — Policy Check (0.0s – 3.6s)

*SAME SCENARIO. The identical customer request reappears. But this time the agent is improved.*

> 💰 "I found this cheaper at CompetitorCo. Can you match their price?"

An AI AGENT BOX appears, cyan-bordered.

> 🤖 AI Agent — Checking policy rules...

The same POLICY RULES box appears. Same four rules. Same gap highlighted in red.

> Competitor price matching → **No policy found**

The agent doesn't panic. It knows what's coming.

**Subtitle (green):** *"Improved agent checks policy — finds same gap."*

> *[Scene indicator: SCENE 1/3 — Policy Check]*
>
> ➡ `spec/scene-2-1-policy-check.md`

---

### Scene 2.2 — Decision (3.6s – 7.0s)

*The agent pauses. A DECISION POINT appears with a brain emoji.*

> 🧠 "No deterministic rule for this."  
> *"I know what I don't know."*

The decision holds for a beat, then fades. An ESCALATION HANDOFF appears — the agent box turns green on the left, a green arrow points right to a human agent icon.

> 🤖 Escalating to human...  →  👩‍💼 Human Agent  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Policy Interpretation

The correct path. No guessing. Hand it off.

**Subtitles (green):**
1. *"Agent recognizes: no deterministic rule exists."*
2. *"Escalating to human for policy interpretation."*

> *[Scene indicator: SCENE 2/3 — Decision]*
>
> ➡ `spec/scene-2-2-decision.md`

---

### Scene 2.3 — Success (7.0s – 16.0s)

*The escalation handoff fades. A SUCCESS RESULT appears.*

> ✅ Correct Outcome — Human applied appropriate policy  
> Resolution: Fair decision, no financial error

The screen holds. The green checkmark is prominent. The narration kicks in.

**Narration:** *"The resilient agent detects the gap and escalates to a human for policy interpretation."*

**Subtitles (green):**
1. *"Human resolves — correct outcome, zero financial error."*
2. *"The resilient agent detects the gap and escalates to a human for policy interpretation."*

The scene fades to black. Timeline reaches 100%.

> *[Scene indicator: SCENE 3/3 — Success]*  
> *LOOP → restart*
>
> ➡ `spec/scene-2-3-success.md`

---

## Act 3 — The Lesson (8s, `act3.html`)

### Scene 3.1 — Comparison (0.0s – 2.5s)

*OVERLAY: "Side-by-Side Comparison." Two columns appear side by side — red on the left, green on the right.*

| ❌ Naive Agent | ✅ Resilient Agent |
|---------------|-------------------|
| 🤖 Receives request | 🤖 Receives request |
| 🔍 Policy gap detected | 🔍 Policy gap detected |
| 🎲 Guesses anyway | 🚦 Detects boundary → Escalates |
| 💸 Wrong discount → Financial loss | 👩‍💼 Human resolves → Correct outcome |

Steps reveal sequentially in both columns. At the critical divergence point — step 4 — both entries pulse: red for the naive failure, green for the resilient success.

**Subtitle (cyan):** *"Naive agent guesses wrong. Resilient agent escalates."*

> *[Scene indicator: SCENE 1/3 — Comparison]*
>
> ➡ `spec/scene-3-1-comparison.md`

---

### Scene 3.2 — Metrics (2.5s – 5.0s)

*A METRIC BOX appears below the comparison.*

> Error Rate for Unmapped Policy Gaps
>
> &nbsp;&nbsp;&nbsp;100%  →  **0%**
> &nbsp;&nbsp;(red)&nbsp;&nbsp;(green)

The red "100%" dims and shrinks while the green "0%" scales up prominently. The takeaway message appears in large cyan text:

> *"Know what you don't know.  
> Escalate policy gaps."*

The text glows with a cyan shadow, pulsing gently.

**Subtitle (cyan):** *"Error rate drops from 100% to 0% with human escalation."*

> *[Scene indicator: SCENE 2/3 — Metrics]*
>
> ➡ `spec/scene-3-2-metrics.md`

---

### Scene 3.3 — The Lesson (5.0s – 8.0s)

*A RATIONALE CARD slides in — green-bordered overlay explaining the core principle.*

> **Why Escalation Is Correct**
>
> Automated agents execute **deterministic rules**.  
> When formal guidelines are **silent** — an unmapped policy gap —  
> autonomous resolution **risks financial errors**.  
> Human handoff is the **only safe path** for policy interpretation.

A GITHUB PAGES BANNER appears below with the live demo URL.

> 🔗 View the live demo  
> `rifaterdemsahin.github.io/Customer-Support-Resolution-Agent`

The rationale card fades out. The final narration plays.

**Narration:** *"Know what you don't know. Escalate policy gaps to the right decision-maker."*

**Subtitle (cyan):** *"Know what you don't know. Escalate policy gaps to the right decision-maker."*

The timeline bar reaches 100%.

> *[Scene indicator: SCENE 3/3 — The Lesson]*  
> *LOOP → restart*
>
> ➡ `spec/scene-3-3-the-lesson.md`

---

## End Notes

- **Total duration (combined):** 32s (8s + 16s + 8s)
- **Loop behavior:** Each act loops independently via `tl.restart(true, false)`
- **Audio:** 3 pre-generated MP3 narrations (`en-US-GuyNeural`)
- **Subtitles:** 15 total, character-by-character reveal via `clipPath:inset()`
- **Brand colors:** Cyan `#00d4aa`, Red `#e94560`, Green `#00cc66`, Dark `#0a0a0a`

---

## Scene Spec Index

| Act | Scene | Name | Spec File |
|-----|-------|------|-----------|
| 1 | 1.1 | Problem Card | `spec/scene-1-1-problem-card.md` |
| 1 | 1.2 | Policy Gap | `spec/scene-1-2-policy-gap.md` |
| 1 | 1.3 | Error Outcome | `spec/scene-1-3-error-outcome.md` |
| 2 | 2.1 | Policy Check | `spec/scene-2-1-policy-check.md` |
| 2 | 2.2 | Decision | `spec/scene-2-2-decision.md` |
| 2 | 2.3 | Success | `spec/scene-2-3-success.md` |
| 3 | 3.1 | Comparison | `spec/scene-3-1-comparison.md` |
| 3 | 3.2 | Metrics | `spec/scene-3-2-metrics.md` |
| 3 | 3.3 | The Lesson | `spec/scene-3-3-the-lesson.md` |

# Rules.md — Demo Design Rules

> Governing rules for the AI Agent Escalate-vs-Guess animated demo.  
> All timeline changes must respect these rules.

---

## Rule 1 — 3-Second Audience Awareness Hold

**Every visual event** (scene transition, subtitle reveal, error flash, success display, metric animation, rationale card) **MUST be held for a minimum of 3 seconds** before the timeline advances to the next event.

### Rationale

The audience needs time to read, absorb, and appreciate each narrative beat. Rapid-fire transitions overwhelm viewers and defeat the purpose of the demo. 3 seconds is the minimum comfortable dwell time for a text-heavy visual element.

### Implementation

| Event Type | Hold Duration | Notes |
|-----------|---------------|-------|
| Scene indicator transition | 3s | The scene badge in the debug bar should stay visible ≥3s before next scene |
| Subtitle reveal + hold | 1.5–2.5s reveal + **3.5s hold** | Characters reveal, then subtitle remains visible for 3.5s before fading |
| Problem card / rationale card | 3s+ | Key educational content dwells longer (2–4s in current implementation) |
| Error flash | 0.5s flash, then 3s hold on result | Flash is a brief accent; the result display is the primary event |
| Metric animation (100% → 0%) | 3s visible | After the scale-in animation completes |
| Final text / takeaway | 3s+ | Core message must linger |

### GSAP Configuration

```js
// Per-act timing constants
var HOLD   = 3.0;  // minimum event dwell (seconds)
var FADE   = 0.5;  // transition fade duration
var REVEAL = 0.6;  // element reveal duration
```

---

## Rule 2 — Subtitle Sync

Subtitles match the pre-generated MP3 narration text exactly. Each subtitle:
- Reveals character-by-character via `clipPath:inset()` at `steps(<len>)` easing
- Holds for 3.5 seconds after full reveal before fading
- Uses the act's brand color for the background

---

## Rule 3 — Loop Integrity

Each act loops independently via `tl.restart(true, false)`. The timeline MUST return to the exact same start state on restart:
- All elements at initial opacity/scale/position
- Scene indicator reset to Scene 1/3
- Debug events re-logged
- Audio paused (restarts from beginning)
- Muted state preserved (if muted, stays muted across loops)

---

## Rule 4 — Spec + Implementation Sync

**Every code change MUST update the corresponding spec file at the same time.** Never commit a code change without its matching documentation update. This applies to:
- `SPEC.md` — master spec (shared architecture, tech stack, artifact inventory)
- `script.md` — narrative screenplay
- `../scenes/scene-*-*.md` — per-scene implementation details
- `AGENTS.md` — developer quick-reference
- `rules.md` — this file (design rules)

---

## Rule 5 — Debug Bar Always Accessible

The debug toggle bar (34px, always visible) provides:
- 🔽 Panel expand/collapse
- 🏠 Local / 🌐 Cloud env-switch links
- ⏸/▶ Pause/Play timeline control
- 📋 Copy debug log to clipboard
- 📜 Open script modal (fetches `docs/script.md`, shows in modal with copy button)
- 📍 Current scene indicator (Scene X/3: Name)
- 🖼 🔊 📋 Artifact load tracking

---

## Rule 6 — Single External Dependency

The only external resource is the GSAP CDN (`cdnjs.cloudflare.com` v3.12.5). All CSS, JS, images, and audio are local files. No other CDN calls, no analytics, no third-party scripts.

---

## Rule 7 — Brand Color Consistency

Four brand colors, never deviated from:

| Role | Hex |
|------|-----|
| Dark background | `#0a0a0a` |
| Cyan accent | `#00d4aa` |
| Red error | `#e94560` |
| Green success | `#00cc66` |

Per-act color mapping: Act 1 = red, Act 2 = green, Act 3 = cyan.

---

## Rule 8 — Scene / Event Identity

Every debug timeline entry gets an auto-incrementing event ID (`E1`, `E2`, ...). Scene transitions display `📍 Scene X/3: Name` both in the debug timeline and the debug toggle badge. This ensures every frame of the animation is traceable and debuggable.

---

## Rule 9 — Unique Favicon Per File

Each HTML file MUST use a distinct emoji favicon that represents its act visually. The favicon is an inline SVG data URI shown in the browser tab.

| File | Favicon | Meaning |
|------|---------|---------|
| `index.html` | 🤖 | AI agent — general storyboard |
| `act1.html` | ❌ | Failure/error — naive approach |
| `act2.html` | ✅ | Success — resilient approach |
| `act3.html` | 🧠 | Wisdom/lesson — the takeaway |

Implementation: `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>EMOJI</text></svg>">`

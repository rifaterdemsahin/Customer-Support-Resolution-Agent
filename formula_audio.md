# Formula Audio — Narration Audio Generation

## Problem

The Web Speech API (`SpeechSynthesisUtterance`) produces robotic, emotionless narration at runtime. Quality varies by browser/OS, timing is unreliable, and there's no way to tune tone, pace, or pitch. The demo needed **charismatic, authoritative narration** synced to the 3-act animation timeline.

## Solution

**Pre-generate MP3 audio clips** using Microsoft Edge TTS (`edge-tts`), then play them via `<audio>` elements triggered by the GSAP timeline.

### Why edge-tts?

| Option | Quality | Cost | Charisma |
|--------|---------|------|----------|
| Web Speech API (browser) | Low | Free | None — robotic |
| OpenRouter TTS (`/v1/audio/speech`) | High | Paid | Good, but HTTP 402 (payment required) |
| OpenAI TTS directly | High | Paid | Good |
| **edge-tts** | **High** | **Free** | **Excellent** — Microsoft neural voices |

`edge-tts` uses Microsoft's Edge browser TTS engine — the same neural voices powering Azure Cognitive Services. It's free, has no rate limits, and offers dozens of natural-sounding voices across languages and styles.

## Voice Selection

Choosing the right voice is critical for charismatic delivery. The voice must sound **authoritative, warm, and engaging** — not monotone or robotic.

### Voice Tested

| Voice | Character | Verdict |
|-------|-----------|---------|
| `en-US-GuyNeural` | Friendly, conversational male | ✅ **Selected** — warm but authoritative |
| `en-US-DavisNeural` | Deep, powerful male | Too stern |
| `en-US-TonyNeural` | Warm, mature male | Good but less energy |
| `en-GB-RyanNeural` | British, smooth | Wrong accent for the content |
| `en-US-JennyNeural` | Bright female | Wrong gender for intended tone |

### Voice Parameters

```python
voice="en-US-GuyNeural",
rate="+5%",      # Slightly faster — sounds more confident
pitch="-2Hz",    # Slightly deeper — adds authority
volume="+10%",   # Louder — cuts through scene audio
```

## Implementation

### Script: `generate_audio.py`

```python
import edge_tts

communicate = edge_tts.Communicate(
    text="When guidelines are silent, autonomous agents risk financial errors.",
    voice="en-US-GuyNeural",
    rate="+5%",
    pitch="-2Hz",
    volume="+10%",
)
await communicate.save("act1-narration.mp3")
```

Three narration sentences, one per act:

| Act | Timing | Text | Duration |
|-----|--------|------|----------|
| Act 1 | 0.3s | *"When guidelines are silent, autonomous agents risk financial errors."* | ~3.0s |
| Act 2 | 10s | *"The resilient agent detects the gap and escalates to a human for policy interpretation."* | ~4.5s |
| Act 3 | 20s | *"Know what you don't know. Escalate policy gaps to the right decision-maker."* | ~3.5s |

### Integration: `index.html`

Audio elements preloaded at page load:

```html
<audio id="audio-act1" preload="auto" src="generated-audio/.../act1-narration.mp3"></audio>
<audio id="audio-act2" preload="auto" src="generated-audio/.../act2-narration.mp3"></audio>
<audio id="audio-act3" preload="auto" src="generated-audio/.../act3-narration.mp3"></audio>
```

GSAP timeline triggers playback:

```javascript
function playAudio(audioEl, at) {
    tl.call(function() {
        audioEl.currentTime = 0;
        audioEl.play().catch(function(e) {
            console.log('Audio play prevented:', e.message);
        });
    }, null, at);
}

playAudio(audioAct1, '+=0.3');
playAudio(audioAct2, '+=10');
playAudio(audioAct3, '+=20');
```

## Why Pre-generated > Real-time TTS

| Aspect | Real-time TTS | Pre-generated MP3 |
|--------|---------------|-------------------|
| Quality | Inconsistent (browser-dependent) | Consistent (fixed voice) |
| Timing | Unpredictable latency | Instant `<audio>` playback |
| Tone tuning | Impossible | Pitch, rate, volume per clip |
| Offline | Fails silently | Works without network |
| Testing | Can't verify output | File size/file existence asserts |
| Tone | Robotic | Charismatic |

## Sync with Subtitles

The subtitle typewriter animation starts at the same GSAP timeline position as the audio playback. The `clipPath: inset()` character reveal duration is calibrated to roughly match the spoken word pace (~50ms per character):

```javascript
showSubtitle("When guidelines are silent...", 'act1', '+=0.3', 2.2);
playAudio(audioAct1, '+=0.3');
```

Both fire at `+=0.3` — subtitle reveals over 2.2s while audio plays the full sentence.

## Regenerating Audio

```bash
pip install edge-tts
python generate_audio.py
```

Output: 3 MP3s in `generated-audio/<TIMESTAMP>/`

Update `index.html` `<audio>` `src` paths to match the new timestamp folder.

## Testing

The Playwright test suite verifies:

```
Audio narration:
  ✅ 3 audio elements present for narration (3 found)
  ✅ Audio sources reference generated narration MP3s
```

It checks that exactly 3 `<audio>` elements exist and all `src` attributes reference `narration.mp3` files — confirming pre-generated clips are wired in, not Web Speech API fallbacks.

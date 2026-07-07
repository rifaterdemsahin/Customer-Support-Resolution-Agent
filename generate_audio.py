#!/usr/bin/env python3
"""
generate_audio.py — Generate narration audio clips using Microsoft Edge TTS (edge-tts).
Produces 3 MP3 files with charismatic voice sync'd to the 3-act animation timeline.
Saves to a timestamped folder under generated-audio/.
"""
import asyncio
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import edge_tts

VOICE = os.getenv("AUDIO_VOICE", "en-US-GuyNeural")
OUTPUT_ROOT = Path(__file__).parent / "generated-audio"
TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
OUTPUT_DIR = OUTPUT_ROOT / TIMESTAMP
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

NARRATIONS = [
    {
        "id": "act1-narration",
        "text": "When guidelines are silent, autonomous agents risk financial errors.",
        "act": "Act 1 — Naive Approach",
    },
    {
        "id": "act2-narration",
        "text": "The resilient agent detects the gap and escalates to a human for policy interpretation.",
        "act": "Act 2 — Resilient Approach",
    },
    {
        "id": "act3-narration",
        "text": "Know what you don't know. Escalate policy gaps to the right decision-maker.",
        "act": "Act 3 — The Lesson",
    },
]


async def generate_audio(label: str, text: str) -> Path | None:
    """Generate a single audio file with edge-tts."""
    out_path = OUTPUT_DIR / f"{label}.mp3"

    communicate = edge_tts.Communicate(
        text=text,
        voice=VOICE,
        rate="+5%",      # Slightly faster for pace
        pitch="-2Hz",    # Slightly deeper for charismatic authority
        volume="+10%",   # Louder output
    )

    try:
        await communicate.save(str(out_path))
        size_kb = out_path.stat().st_size / 1024
        print(f"  ✅ {label}.mp3 ({size_kb:.0f} KB)")
        return out_path
    except Exception as e:
        print(f"  ❌ {label}: {e}")
        return None


async def main():
    print(f"🎙  Generating {len(NARRATIONS)} narration audio clips")
    print(f"   Voice: {VOICE}")
    print(f"   Output: {OUTPUT_DIR}\n")

    results = {}
    for item in NARRATIONS:
        print(f"📢 {item['act']}: \"{item['text'][:60]}...\"")
        path = await generate_audio(item["id"], item["text"])
        if path:
            results[item["id"]] = str(path)
        time.sleep(0.5)

    print(f"\n{'='*50}")
    print(f"Generated {len(results)}/{len(NARRATIONS)} audio clips")
    print(f"Output directory: {OUTPUT_DIR}")
    for label, path in results.items():
        print(f"  {label}: {Path(path).name}")


if __name__ == "__main__":
    asyncio.run(main())

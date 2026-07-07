#!/usr/bin/env python3
"""
generate_images.py — Generate animation scene images via OpenRouter (nanobanana model).
Uses google/gemini-2.5-flash-image for fast, small image generation.
Saves images to a timestamped folder under generated-images/.
"""
import os
import sys
import json
import base64
import time
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
import requests

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: OPENROUTER_API_KEY not set in .env")
    sys.exit(1)

MODEL = os.getenv("IMAGE_MODEL", "google/gemini-2.5-flash-image")
BASE_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

OUTPUT_ROOT = Path(__file__).parent / "generated-images"
TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
OUTPUT_DIR = OUTPUT_ROOT / TIMESTAMP
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


SCENES = {
    "act1-request": {
        "prompt": "A cinematic dark-themed scene showing an AI robot agent receiving a customer message about a competitor price match. The AI has a confused/questioning expression. A message bubble shows 'Can you match CompetitorCo price?' with a money bag emoji. Dark background (#0a0a0a), cyan (#00d4aa) accent lights. Clean vector-style illustration, 1920x1080 ratio. No external text overlays.",
        "description": "AI receives competitor price match request"
    },
    "act1-policy-gap": {
        "prompt": "A dramatic warning scene: a red (#e94560) glowing banner reading 'Policy Gap - No Rule Found' appears over a dark interface. A policy document is visible with checkmarks for known rules but a red question mark for 'Competitor price matching'. Dark background, red alert glow, cyber-security aesthetic. Clean vector-style, 1920x1080. No text overlays on the image itself.",
        "description": "Policy gap detected — no rule found"
    },
    "act1-error": {
        "prompt": "A dramatic failure scene: an AI agent with a panicked expression, red (#e94560) flashing background overlay, large red X icon prominent. The agent has made a wrong decision — unauthorized 15% discount applied. Financial loss visualization with red downward arrow. Dark background transitioning to red, 1920x1080 ratio. Clean vector style illustration.",
        "description": "AI guesses wrong — financial loss"
    },
    "act2-policy-check": {
        "prompt": "A calm, analytical scene: an AI agent examining a policy rulebook or digital interface. Three rules are marked with green checkmarks, one rule (Competitor price matching) is marked with a question mark in orange. The AI has a thoughtful, careful expression. Cyan (#00d4aa) accent lighting, dark background (#0a0a0a). 1920x1080. Clean vector illustration.",
        "description": "AI carefully checks policy rules"
    },
    "act2-escalate": {
        "prompt": "A positive handoff scene: on the left an AI robot agent with a confident expression, on the right a professional human support agent (female, headset). A green (#00cc66) glowing arrow flows from the AI to the human, representing escalation. Green success glow atmosphere. Text reads 'Escalating to human for policy interpretation' in the composition. Dark background. 1920x1080. Clean vector style.",
        "description": "AI escalates to human agent"
    },
    "act2-success": {
        "prompt": "A triumphant success scene: a human agent and AI agent standing together, large green checkmark icon prominent. Green (#00cc66) success glow, dark background (#0a0a0a). The human agent is giving a thumbs up. Text in composition says 'Correct Outcome'. 1920x1080. Clean vector style illustration.",
        "description": "Correct outcome achieved"
    },
    "act3-comparison": {
        "prompt": "A split-screen comparison: left half colored red (#e94560) showing a confused/failing AI robot with red X marks, downward arrows, labeled 'Naive Agent — Guesses → Financial Loss'. Right half colored green (#00cc66) showing a confident AI robot handing off to a human, green checkmarks, labeled 'Resilient Agent — Escalates → Correct Outcome'. Clean split design with dark dividing line. 1920x1080. Clean vector style.",
        "description": "Side-by-side naive vs resilient comparison"
    },
    "act3-final": {
        "prompt": "An inspiring conclusion scene: large bold text 'Know what you don't know. Escalate policy gaps.' in cyan (#00d4aa) color, centered on a dark (#0a0a0a) background. An AI robot and human agent are positioned below the text, standing together as a unified team. Subtle green (#00cc66) accent glow around them. Abstract geometric shapes (circles, lines) decorate the background. 1920x1080. Clean modern vector style.",
        "description": "Final lesson — know what you don't know"
    }
}


def generate_image(prompt: str, label: str) -> dict:
    """Call OpenRouter with image-generating model. Returns raw response JSON."""
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Generate an illustration image for this scene. Do NOT overlay text on the image itself — the text will be added by HTML/CSS. {prompt}"
                    }
                ]
            }
        ],
        "max_tokens": 4096,
    }

    print(f"  [{label}] Calling {MODEL}...")
    resp = requests.post(BASE_URL, headers=HEADERS, json=payload, timeout=120)
    resp.raise_for_status()
    return resp.json()


def extract_image_from_response(response: dict) -> tuple[bytes | None, str]:
    """Extract image bytes from OpenRouter chat completion response.
    Returns (image_bytes, image_format) where format is 'png', 'jpg', etc.
    Handles: message.images[], message.content (string or list of parts)."""
    try:
        choices = response.get("choices", [])
        if not choices:
            return None, "png"

        message = choices[0].get("message", {})

        # Case 1: message.images[] — OpenRouter image generation models
        images = message.get("images", [])
        if images:
            for img in images:
                if isinstance(img, dict):
                    iu = img.get("image_url", {})
                    url = iu.get("url", "")
                    if url.startswith("data:image/"):
                        mime = url.split(";")[0].split(":")[1]  # image/png
                        fmt = mime.split("/")[1] if "/" in mime else "png"
                        b64_data = url.split(",", 1)[1]
                        return base64.b64decode(b64_data), fmt
                    elif url.startswith("http"):
                        img_resp = requests.get(url, timeout=60)
                        img_resp.raise_for_status()
                        return img_resp.content, "png"

        content = message.get("content", "")

        # Case 2: content is a string (URL or base64 data URI)
        if isinstance(content, str):
            if content.startswith("data:image"):
                mime = content.split(";")[0].split(":")[1]
                fmt = mime.split("/")[1] if "/" in mime else "png"
                b64_data = content.split(",", 1)[1]
                return base64.b64decode(b64_data), fmt
            elif content.startswith("http"):
                img_resp = requests.get(content, timeout=60)
                img_resp.raise_for_status()
                return img_resp.content, "png"
            else:
                print(f"    Unexpected string content (first 100 chars): {content[:100]}")
                return None, "png"

        # Case 3: content is a list of parts (multimodal response)
        if isinstance(content, list):
            for part in content:
                if isinstance(part, dict):
                    if "inline_data" in part:
                        inline = part["inline_data"]
                        if inline.get("mime_type", "").startswith("image"):
                            mime = inline["mime_type"]
                            fmt = mime.split("/")[1] if "/" in mime else "png"
                            return base64.b64decode(inline["data"]), fmt
                    if "image_url" in part:
                        url = part["image_url"].get("url", "")
                        if url.startswith("data:"):
                            mime = url.split(";")[0].split(":")[1]
                            fmt = mime.split("/")[1] if "/" in mime else "png"
                            return base64.b64decode(url.split(",", 1)[1]), fmt
                        img_resp = requests.get(url, timeout=60)
                        img_resp.raise_for_status()
                        return img_resp.content, "png"
                    if part.get("type") == "image_url":
                        url = part["image_url"]["url"]
                        if url.startswith("data:"):
                            mime = url.split(";")[0].split(":")[1]
                            fmt = mime.split("/")[1] if "/" in mime else "png"
                            return base64.b64decode(url.split(",", 1)[1]), fmt
                        img_resp = requests.get(url, timeout=60)
                        img_resp.raise_for_status()
                        return img_resp.content, "png"

        return None, "png"

    except Exception as e:
        print(f"    Error extracting image: {e}")
        return None, "png"


def main():
    print(f"🎨 Generating {len(SCENES)} scene images")
    print(f"   Model: {MODEL}")
    print(f"   Output: {OUTPUT_DIR}\n")

    results = {}
    for label, scene in SCENES.items():
        print(f"📸 Scene: {scene['description']}")

        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = generate_image(scene["prompt"], label)
                image_bytes, fmt = extract_image_from_response(response)

                if image_bytes:
                    ext = fmt if fmt in ("png", "jpg", "jpeg", "webp", "gif") else "png"
                    filepath = OUTPUT_DIR / f"{label}.{ext}"
                    filepath.write_bytes(image_bytes)
                    size_kb = len(image_bytes) / 1024
                    print(f"    ✅ Saved: {filepath.name} ({size_kb:.1f} KB)")
                    results[label] = str(filepath)
                    break
                else:
                    print(f"    ⚠️  No image in response (attempt {attempt+1}/{max_retries})")
                    # Dump response for debugging on last attempt
                    if attempt == max_retries - 1:
                        debug_path = OUTPUT_DIR / f"{label}_response.json"
                        debug_path.write_text(json.dumps(response, indent=2))
                        print(f"    Debug response saved to: {debug_path.name}")

            except requests.exceptions.HTTPError as e:
                print(f"    ❌ HTTP error (attempt {attempt+1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 * (attempt + 1))
            except Exception as e:
                print(f"    ❌ Error (attempt {attempt+1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 * (attempt + 1))

        if label not in results:
            print(f"    ❌ Failed to generate after {max_retries} attempts")

        time.sleep(1)  # Rate limit buffer

    print(f"\n{'='*50}")
    print(f"Generated {len(results)}/{len(SCENES)} images")
    print(f"Output directory: {OUTPUT_DIR}")
    for label, path in results.items():
        print(f"  {label}: {Path(path).name}")


if __name__ == "__main__":
    main()

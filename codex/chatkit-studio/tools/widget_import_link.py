"""
🎭 Widget Import Link Forge — Turn JSON into a Shareable Spell ✨

"When the Builder wants a `.widget`, we hand it a bundle.
When we want a link, we base64url it and whisper it to /import."

- The Spellbinding Museum Director of Developer Convenience
"""

from __future__ import annotations

import argparse
import base64
import json
from pathlib import Path


def _base64url_encode(raw_bytes: bytes) -> str:
    """
    🌟 Encode bytes as URL-safe base64 (no padding).

    ChatKit Studio's share/import links use base64url without trailing '='.

    (Tiny snark) 🧂: padding is great for sandwiches, not URLs.
    """

    return base64.urlsafe_b64encode(raw_bytes).decode("utf-8").rstrip("=")


def build_import_url(widget_json: dict) -> str:
    """
    🌐 Build the ChatKit Studio import URL for a widget bundle.

    This creates:
      https://widgets.chatkit.studio/import#<base64url(JSON)>
    """

    raw = json.dumps(widget_json, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    encoded = _base64url_encode(raw)
    return f"https://widgets.chatkit.studio/import#{encoded}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate ChatKit Studio import URL from a .widget JSON file.")
    parser.add_argument("widget_file", type=Path, help="Path to a .widget JSON file")
    args = parser.parse_args()

    widget = json.loads(args.widget_file.read_text(encoding="utf-8"))
    print(build_import_url(widget))


if __name__ == "__main__":
    main()


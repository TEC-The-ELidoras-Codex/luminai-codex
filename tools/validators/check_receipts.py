#!/usr/bin/env python3
"""
Simple validator that enforces:
- No [VERIFY] markers in investigation timeline files
- Every event block has a Sources list with at least one URL-like entry

Exit codes:
 0 = OK
 1 = Found [VERIFY]
 2 = Missing sources in one or more events
 3 = Other error
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INV_DIR = ROOT / "docs" / "investigations"
TIMELINE = INV_DIR / "TIMELINE_AI_SAFETY_2024_2026.md"
REQUIRED_FILES = [
    INV_DIR / "PLAUSIBLE_DENIABILITY_SMASHER.md",
    INV_DIR / "RECEIPTS_INDEX.md",
    TIMELINE,
]

URL_RE = re.compile(r"https?://\S+")
VERIFY_RE = re.compile(r"\[VERIFY\]")
EVENT_START_RE = re.compile(r"^- Date:\s*(\d{4}-\d{2}-\d{2}).*")


def main() -> int:
    try:
        for f in REQUIRED_FILES:
            if not f.exists():
                print(f"ERROR: Missing required file: {f}")
                return 3

        text = TIMELINE.read_text(encoding="utf-8")

        # 1) Block [VERIFY]
        if VERIFY_RE.search(text):
            print("FAIL: Found [VERIFY] markers. Resolve all before release.")
            return 1

        # 2) Ensure each event has at least one source URL
        lines = text.splitlines()
        missing_sources = []
        in_event = False
        current_date = None
        sources_in_event = 0

        for line in lines:
            m = EVENT_START_RE.match(line)
            if m:
                # New event starts — check previous
                if in_event and sources_in_event == 0:
                    missing_sources.append(current_date)
                in_event = True
                current_date = m.group(1)
                sources_in_event = 0
                continue
            if in_event:
                if line.strip().startswith("Sources:"):
                    sources_in_event = 0  # reset, we'll count below
                elif line.strip().startswith("- ") and URL_RE.search(line):
                    sources_in_event += 1
                # End of event heuristics: blank line with no indent
                if line.strip() == "" and current_date is not None:
                    # on blank, we consider event ended
                    if in_event and sources_in_event == 0:
                        missing_sources.append(current_date)
                    in_event = False
                    current_date = None

        # Also handle EOF while in_event
        if in_event and sources_in_event == 0 and current_date is not None:
            missing_sources.append(current_date)

        if missing_sources:
            print("FAIL: Missing sources for events:")
            for d in missing_sources:
                print(f"  - {d}")
            return 2

        print("OK: No [VERIFY] markers and all events have sources.")
        return 0

    except Exception as e:
        print(f"ERROR: {e}")
        return 3


if __name__ == "__main__":
    sys.exit(main())

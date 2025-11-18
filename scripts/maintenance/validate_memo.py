#!/usr/bin/env python3
"""
TEC Memo Validator — Pre-commit hook to enforce memo template compliance

Usage:
  python scripts/maintenance/validate_memo.py docs/operations/TEC_HUB.md
  python scripts/maintenance/validate_memo.py docs/**/*.md

Exit codes:
  0 = All valid
  1 = Validation failures found
"""
import sys
import re
from pathlib import Path
from typing import Tuple


def validate_memo(filepath: Path) -> Tuple[bool, str]:
    """
    Validate that a markdown file follows TEC Memo template structure.

    Returns:
        (is_valid, error_message)
    """
    if not filepath.exists():
        return False, f"File not found: {filepath}"

    content = filepath.read_text(encoding="utf-8")

    # Skip validation for archives and reports
    if "/archive/" in str(filepath) or "/reports/" in str(filepath):
        return True, "Skipped (archive/report)"

    # Skip README and index files (they don't need memo metadata)
    if filepath.name in ["README.md", "index.md", "STRUCTURE.md"]:
        return True, f"Skipped ({filepath.name})"

    # Check for YAML metadata block at start of file
    yaml_pattern = r"^---\n(.*?)\n---"
    meta_match = re.search(yaml_pattern, content, re.MULTILINE | re.DOTALL)

    if not meta_match:
        return False, "Missing YAML metadata block (should start with ---)"

    metadata = meta_match.group(1)

    # Required fields
    required_fields = {
        "title:": "Document title",
        "date_created:": "Creation date (YYYY-MM-DD)",
        "status:": "Status (draft/review/approved/archived)",
        "approvers:": "Approvers list",
    }

    for field, description in required_fields.items():
        if field not in metadata:
            return False, f"Missing required field: {description} ({field})"

    # Validate date format (basic ISO 8601 check)
    date_pattern = r"date_created:\s*(\d{4}-\d{2}-\d{2})"
    date_match = re.search(date_pattern, metadata)
    if not date_match:
        return False, "date_created must be in YYYY-MM-DD format"

    # If status is 'approved', require at least one approved_date
    if "status: approved" in metadata:
        if "approved_date:" not in metadata:
            return (
                False,
                "Status 'approved' requires at least one approver with approved_date",
            )

    # Check for valid personas in approvers (basic check)
    valid_personas = ["Airth", "Ely", "Adelphia", "LuminAI", "Arcadia", "Kaznak"]
    if "approvers:" in metadata:
        # Look for persona references
        found_persona = any(persona in metadata for persona in valid_personas)
        if not found_persona:
            return (
                False,
                f"Approvers must include at least one valid persona: {', '.join(valid_personas)}",
            )

    return True, "Valid ✅"


def main():
    """Run validation on all provided file paths."""
    if len(sys.argv) < 2:
        print("Usage: validate_memo.py <file1.md> [file2.md ...]")
        sys.exit(1)

    failures = []

    for filepath_str in sys.argv[1:]:
        filepath = Path(filepath_str)

        # Skip non-markdown files
        if filepath.suffix != ".md":
            continue

        valid, message = validate_memo(filepath)

        if valid:
            print(f"✅ {filepath}: {message}")
        else:
            print(f"❌ {filepath}: {message}")
            failures.append((filepath, message))

    if failures:
        print(f"\n❌ {len(failures)} file(s) failed validation:")
        for filepath, message in failures:
            print(f"  - {filepath}: {message}")
        sys.exit(1)
    else:
        print(f"\n✅ All memos valid ({len(sys.argv) - 1} files checked)")
        sys.exit(0)


if __name__ == "__main__":
    main()

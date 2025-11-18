#!/usr/bin/env python3
"""
Add TEC memo YAML front matter to markdown files missing it.

Usage:
  python scripts/maintenance/add_memo_headers.py [--apply] [ROOT]

Default ROOT is 'docs'. Skips docs/archive and docs/reports. Only .md files.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path
from datetime import datetime

RE_YAML = re.compile(r"^---\n(.*?)^---\n?", re.MULTILINE | re.DOTALL)


def has_yaml(text: str) -> bool:
    return bool(RE_YAML.search(text))


def derive_title(path: Path) -> str:
    name = path.stem.replace("_", " ").replace("-", " ")
    return " ".join(w.capitalize() for w in name.split())


def derive_tags(path: Path) -> list[str]:
    # Use folder names under docs/ as tags (simple heuristic)
    tags: list[str] = []
    try:
        i = path.parts.index("docs")
        parts = list(path.parts[i + 1 : -1])
        tags = [p.replace("_", "-") for p in parts if p]
    except ValueError:
        pass
    return tags or ["docs"]


def build_yaml(title: str, tags: list[str]) -> str:
    today = datetime.utcnow().date().isoformat()
    tag_str = ", ".join(tags)
    return (
        "---\n"
        f"title: {title}\n"
        f"date_created: {today}\n"
        f"date_updated: {today}\n"
        "status: draft\n"
        "approvers: []\n"
        "owner_checklist:\n"
        "  - [ ] Read and understood\n"
        "  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md\n"
        "  - [ ] Tested commands/steps (if procedural)\n"
        "  - [ ] Old version archived if replaced\n"
        f"tags: [{tag_str}]\n"
        "---\n\n"
    )


def find_targets(root: Path) -> list[Path]:
    files: list[Path] = []
    for p in root.rglob("*.md"):
        s = str(p).replace("\\", "/")
        # Skip archives and reports regardless of prefix form
        if any(
            skip in s
            for skip in (
                "/docs/archive/",
                "/docs/reports/",
                "docs/archive/",
                "docs/reports/",
                "/archive/",
                "/reports/",
            )
        ):
            continue
        files.append(p)
    return files


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("root", nargs="?", default="docs")
    ap.add_argument("--apply", action="store_true", help="Write changes to files")
    args = ap.parse_args()

    root = Path(args.root)
    targets = find_targets(root)
    if not targets:
        print("No markdown files found.")
        return 0

    updated = 0
    skipped = 0
    for md in sorted(targets):
        text = md.read_text(encoding="utf-8")
        if has_yaml(text):
            skipped += 1
            continue
        title = derive_title(md)
        tags = derive_tags(md)
        yaml = build_yaml(title, tags)
        if args.apply:
            md.write_text(yaml + text, encoding="utf-8")
        print(f"ADD YAML -> {md}")
        updated += 1

    print(f"\nPlanned additions: {updated}; Already had YAML: {skipped}.")
    if not args.apply:
        print("(dry-run) Re-run with --apply to write changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

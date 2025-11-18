#!/usr/bin/env python3
"""
Normalize TEC memo YAML front matter across docs:
- Ensure required fields: title, date_created, status, approvers
- Add owner_checklist and tags if missing
- Seed approvers with at least one valid persona (Ely) if empty

Usage:
  python scripts/maintenance/normalize_memo_front_matter.py [--apply] [ROOT]
Defaults to ROOT='docs'. Skips docs/archive and docs/reports.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path
from datetime import datetime

RE_YAML = re.compile(r"^---\n(.*?)^---\n?", re.MULTILINE | re.DOTALL)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def derive_title(path: Path) -> str:
    name = path.stem.replace("_", " ").replace("-", " ")
    return " ".join(w.capitalize() for w in name.split())


def derive_tags(path: Path) -> list[str]:
    tags: list[str] = []
    try:
        i = path.parts.index("docs")
        parts = list(path.parts[i + 1 : -1])
        tags = [p.replace("_", "-") for p in parts if p]
    except ValueError:
        pass
    return tags or ["docs"]


def normalize_yaml_block(yaml: str, path: Path) -> tuple[str, bool]:
    changed = False
    # Ensure title
    if "\ntitle:" not in "\n" + yaml:
        yaml = f"title: {derive_title(path)}\n" + yaml
        changed = True
    # Ensure date_created
    if "\ndate_created:" not in "\n" + yaml:
        yaml = yaml + f"date_created: {datetime.utcnow().date().isoformat()}\n"
        changed = True
    # Ensure date_updated
    if "\ndate_updated:" not in "\n" + yaml:
        yaml = yaml + f"date_updated: {datetime.utcnow().date().isoformat()}\n"
        changed = True
    # Ensure status
    if "\nstatus:" not in "\n" + yaml:
        yaml = yaml + "status: draft\n"
        changed = True
    # Ensure approvers exists and includes a valid persona
    if "\napprovers:" not in "\n" + yaml:
        yaml = yaml + "approvers:\n  - persona: Ely\n    role: Engineering Steward\n"
        changed = True
    else:
        # If empty list, replace with a default approver block
        if re.search(r"\napprovers:\s*\[\s*\]", yaml) or re.search(
            r"\napprovers:\s*$", yaml
        ):
            # naive normalization: replace the first occurrence of empty list
            yaml = re.sub(
                r"\napprovers:\s*\[\s*\]",
                "\napprovers:\n  - persona: Ely\n    role: Engineering Steward",
                yaml,
                count=1,
            )
            changed = True
        # ensure at least a valid persona name present
        if not any(
            x in yaml
            for x in ("Airth", "Ely", "Adelphia", "LuminAI", "Arcadia", "Kaznak")
        ):
            yaml = (
                yaml + "approvers:\n  - persona: Ely\n    role: Engineering Steward\n"
            )
            changed = True
    # Ensure owner_checklist
    if "\nowner_checklist:" not in "\n" + yaml:
        yaml = yaml + (
            "owner_checklist:\n"
            "  - [ ] Read and understood\n"
            "  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md\n"
            "  - [ ] Tested commands/steps (if procedural)\n"
            "  - [ ] Old version archived if replaced\n"
        )
        changed = True
    # Ensure tags
    if "\ntags:" not in "\n" + yaml:
        tags = ", ".join(derive_tags(path))
        yaml = yaml + f"tags: [{tags}]\n"
        changed = True
    return yaml, changed


def normalize_file(path: Path) -> bool:
    text = read(path)
    m = RE_YAML.search(text)
    if not m:
        return False
    yaml = m.group(1)
    norm_yaml, changed = normalize_yaml_block(yaml, path)
    if not changed:
        return False
    new_text = text[: m.start(1)] + norm_yaml + text[m.end(1) :]
    write(path, new_text)
    return True


def find_targets(root: Path) -> list[Path]:
    out: list[Path] = []
    for p in root.rglob("*.md"):
        s = str(p).replace("\\", "/")
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
        out.append(p)
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("root", nargs="?", default="docs")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    root = Path(args.root)
    changed = 0
    for md in sorted(find_targets(root)):
        did = normalize_file(md)
        if did:
            changed += 1
            print(f"FIXED -> {md}")
    print(f"\nFiles normalized: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

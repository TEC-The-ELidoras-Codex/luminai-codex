"""Batch upgrade globule_base.svg files to unified morph/blush template.

Idempotent: if a file already contains heartTarget path and Blush layer it will be skipped unless --force.

Usage:
    python scripts/design/upgrade_globules.py            # dry-run summary
    python scripts/design/upgrade_globules.py --write    # apply upgrades
    python scripts/design/upgrade_globules.py --force    # re-write all

Template features:
- <path id="heartTarget"> morph target (heart)
- <path id="body"> oval path for morphing
- Two radial gradient shaded ellipses layered for depth
- Hidden Blush layer with two circles
- Soft blur filter to reduce hard edges

Persona color spec is defined inline; adjust as needed.
"""

from __future__ import annotations
import argparse
import pathlib
import re
from dataclasses import dataclass
from typing import Dict

ROOT = pathlib.Path(__file__).resolve().parents[2]
GLOBULE_ROOT = ROOT / "data" / "digital_assets" / "globules"


@dataclass
class PersonaSpec:
    body: str
    outer_accent: str
    inner_accent: str
    blush: str
    outer_opacity: float = 0.55
    inner_opacity: float = 0.7


SPECS: Dict[str, PersonaSpec] = {
    "adelphia": PersonaSpec(
        body="#0F5F3F",
        outer_accent="#3FAF7F",
        inner_accent="#9FFFCF",
        blush="#FF8DB3",
        outer_opacity=0.5,
        inner_opacity=0.6,
    ),  # keep existing colors approximate
    "ely": PersonaSpec(
        body="#C0C0C0", outer_accent="#E0E0E0", inner_accent="#FFFFFF", blush="#FF6B6B"
    ),
    "luminai": PersonaSpec(
        body="#6A00F4", outer_accent="#B47CFF", inner_accent="#FFFFFF", blush="#FF7AD9"
    ),
    "airth": PersonaSpec(
        body="#DC143C", outer_accent="#FFB347", inner_accent="#FFD700", blush="#FF8A65"
    ),
    "arcadia": PersonaSpec(
        body="#004AAD", outer_accent="#66CCFF", inner_accent="#FFFFFF", blush="#FF6699"
    ),
    "multi": PersonaSpec(
        body="#1A535C",
        outer_accent="#4ECDC4",
        inner_accent="#FFFFFF",
        blush="#FFB347",
        outer_opacity=0.65,
    ),
    "mirror": PersonaSpec(
        body="#222222", outer_accent="#AAAAAA", inner_accent="#FFFFFF", blush="#FF6FCF"
    ),
    "reluctant_steward": PersonaSpec(
        body="#8B0000", outer_accent="#FF4500", inner_accent="#FFA07A", blush="#FFA07A"
    ),
    "kaznak": PersonaSpec(
        body="#0D0D2B", outer_accent="#4B0082", inner_accent="#8A2BE2", blush="#FF5F5F"
    ),
}

HEART_PATH = "M32 56 C 20 44, 12 36, 12 28 C 12 20, 18 16, 24 16 C 28 16, 32 18, 32 22 C 32 18, 36 16, 40 16 C 46 16, 52 20, 52 28 C 52 36, 44 44, 32 56 Z"

TEMPLATE = """<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!-- Unified Globule Base ({name}) -->\n<svg width=\"64\" height=\"64\" viewBox=\"0 0 64 64\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\">\n  <defs>\n    <path id=\"heartTarget\" d=\"{heart}\" />\n    <radialGradient id=\"{id_prefix}ShadeOuter\" cx=\"50%\" cy=\"50%\" r=\"50%\">\n      <stop offset=\"0%\" stop-color=\"{outer_accent}\" />\n      <stop offset=\"100%\" stop-color=\"{body}\" stop-opacity=\"0.35\" />\n    </radialGradient>\n    <radialGradient id=\"{id_prefix}ShadeInner\" cx=\"50%\" cy=\"50%\" r=\"50%\">\n      <stop offset=\"0%\" stop-color=\"{inner_accent}\" />\n      <stop offset=\"100%\" stop-color=\"{body}\" stop-opacity=\"0\" />\n    </radialGradient>\n    <filter id=\"softBlur\" x=\"-0.02\" y=\"-0.02\" width=\"1.04\" height=\"1.04\">\n      <feGaussianBlur stdDeviation=\"0.6\" />\n    </filter>\n  </defs>\n  <g inkscape:groupmode=\"layer\" inkscape:label=\"Body\">\n    <path id=\"body\" d=\"M8 40 a24 18 0 1 0 48 0 a24 18 0 1 0 -48 0\" fill=\"{body}\" filter=\"url(#softBlur)\" />\n    <ellipse cx=\"32\" cy=\"40\" rx=\"20\" ry=\"13\" fill=\"url(#{id_prefix}ShadeOuter)\" opacity=\"{outer_opacity}\" />\n    <ellipse cx=\"32\" cy=\"40\" rx=\"10\" ry=\"6\" fill=\"url(#{id_prefix}ShadeInner)\" opacity=\"{inner_opacity}\" />\n  </g>\n  <g inkscape:groupmode=\"layer\" inkscape:label=\"Blush\" style=\"display:none\">\n    <circle cx=\"22\" cy=\"42\" r=\"4\" fill=\"{blush}\" opacity=\"0.35\" />\n    <circle cx=\"42\" cy=\"42\" r=\"4\" fill=\"{blush}\" opacity=\"0.35\" />\n  </g>\n</svg>\n"""

HEART_MARKER = re.compile(r"id=\"heartTarget\"")
BLUSH_MARKER = re.compile(r"inkscape:label=\"Blush\"")


def needs_upgrade(content: str) -> bool:
    # If heartTarget and Blush layer exist, assume upgraded
    if HEART_MARKER.search(content) and BLUSH_MARKER.search(content):
        return False
    return True


def build_svg(name: str, spec: PersonaSpec) -> str:
    return TEMPLATE.format(
        name=name,
        heart=HEART_PATH,
        id_prefix=name.replace("-", "_"),
        body=spec.body,
        outer_accent=spec.outer_accent,
        inner_accent=spec.inner_accent,
        blush=spec.blush,
        outer_opacity=spec.outer_opacity,
        inner_opacity=spec.inner_opacity,
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--write", action="store_true", help="Apply upgrades (default is dry-run)"
    )
    parser.add_argument(
        "--force", action="store_true", help="Rewrite even if already upgraded"
    )
    args = parser.parse_args()

    results = []
    for persona_dir in sorted(GLOBULE_ROOT.iterdir()):
        if not persona_dir.is_dir():
            continue
        name = persona_dir.name
        svg_path = persona_dir / "globule_base.svg"
        if not svg_path.exists():
            continue
        spec = SPECS.get(name)
        if spec is None:
            results.append((name, "skip(no spec)"))
            continue
        content = svg_path.read_text(encoding="utf-8")
        upgrade = args.force or needs_upgrade(content)
        if upgrade and args.write:
            svg_path.write_text(build_svg(name, spec), encoding="utf-8")
            results.append((name, "upgraded"))
        else:
            results.append((name, "already" if not upgrade else "pending"))

    # Report
    print("Persona Upgrade Summary:")
    width = max(len(r[0]) for r in results) if results else 10
    for persona, status in results:
        print(f"  {persona.ljust(width)} : {status}")
    if not args.write:
        print("(dry-run) Use --write to apply changes.")


if __name__ == "__main__":
    main()

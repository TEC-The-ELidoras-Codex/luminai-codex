"""Utility to materialize structured screen specs from FigJam wireframes.

This script does not attempt to decode Figma's proprietary `.jam` payloads.
Instead it captures the canonical layout metadata described inside
`docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md` and emits deterministic JSON
artifacts that downstream tooling (Next.js generators, design token builders,
docs) can consume.

The generated files live under `design/figma/exports/` alongside the raw
FigJam archives and thumbnails that designers supplied.  Each screen gets a
`*-struct.json` describing grid anatomy, component groupings, and component
contracts.  A consolidated `design_tokens.json` stores the brand palette,
typography, and motion primitives so that the web and CLI surfaces stay in
resonance with the cosmic futurism brand language.

Run this script whenever the wireframe specification changes:

```
python -m scripts.design.build_screen_specs
```

It is idempotent and safe to re-run; outputs are overwritten atomically.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Dict, List


ROOT = Path(__file__).resolve().parents[2]
EXPORT_ROOT = ROOT / "design" / "figma" / "exports"


def ensure_export_root() -> None:
    EXPORT_ROOT.mkdir(parents=True, exist_ok=True)


@dataclass(slots=True)
class GridSpec:
    columns: int
    rows: int
    column_width: int
    gutter: int
    margin: int


@dataclass(slots=True)
class Section:
    id: str
    label: str
    description: str
    layout: Dict[str, float]
    components: List[str] = field(default_factory=list)


@dataclass(slots=True)
class ScreenSpec:
    id: str
    name: str
    route: str
    summary: str
    grid: GridSpec
    sections: List[Section]
    primary_actions: List[str]
    references: List[str]

    def to_dict(self) -> Dict[str, object]:
        data = asdict(self)
        data["grid"] = asdict(self.grid)
        data["sections"] = [asdict(section) for section in self.sections]
        return data


GRID_DESKTOP = GridSpec(columns=12, rows=12, column_width=96, gutter=24, margin=64)


SCREENS: List[ScreenSpec] = [
    ScreenSpec(
        id="RESONANCE_SCR-01_CHAT_SKEL",
        name="Conscious Chat + Notebook Split",
        route="/chat",
        summary=(
            "Primary interaction surface: conversational stream, witness badge, "
            "and research notebook unified in a single responsive shell."
        ),
        grid=GRID_DESKTOP,
        sections=[
            Section(
                id="header",
                label="LuminAI Header",
                description="Gradient bar with logo, witness status, persona quick actions, and global settings.",
                layout={"x": 0, "y": 0, "w": 12, "h": 1},
                components=["LogoWordmark", "WitnessStatusChip", "PersonaSwitcher", "GlobalMenu"],
            ),
            Section(
                id="chat_stream",
                label="Chat Stream",
                description="70% width channel containing alternating user and assistant bubbles with resonance badges.",
                layout={"x": 0, "y": 1, "w": 8, "h": 9.5},
                components=["ChatBubbleUser", "ChatBubbleAssistant", "CitationPill", "ResonanceBadge"],
            ),
            Section(
                id="notebook",
                label="Notebook Drawer",
                description="Collapsible notebook viewer that mirrors reasoning steps, code blocks, and notebook actions.",
                layout={"x": 8, "y": 1, "w": 3, "h": 9.5},
                components=["NotebookHeader", "ReasoningCard", "NotebookActionBar"],
            ),
            Section(
                id="presence_rail",
                label="Presence Rail",
                description="Vertical rail for context tiles, audio meters, and quick resonance summary.",
                layout={"x": 11, "y": 1, "w": 1, "h": 9.5},
                components=["PresenceTile", "AudioMeter", "SessionQuickLink"],
            ),
            Section(
                id="composer",
                label="Composer",
                description="Input bar with ritual controls: mic, upload, tone presets, and notebook export.",
                layout={"x": 0, "y": 10.5, "w": 12, "h": 1.5},
                components=["TextComposer", "MicButton", "UploadButton", "ToneDropdown", "NotebookShortcut"],
            ),
        ],
        primary_actions=["SendMessage", "OpenNotebook", "TogglePresenceRail", "SwitchPersona"],
        references=[
            "docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#screen-a—conscious-chat--notebook-split",
            "docs/deployment/WEBSITE_INTEGRATION_PLAN.md#chat-surface---screen-a",
        ],
    ),
    ScreenSpec(
        id="RESONANCE_SCR-02_NOTE_SKEL",
        name="Notebook Focus",
        route="/notebook",
        summary=(
            "Expanded research notebook with transcript drawer, export controls, and reasoning depth indicators."
        ),
        grid=GRID_DESKTOP,
        sections=[
            Section(
                id="notebook_canvas",
                label="Notebook Canvas",
                description="Dominant canvas highlighting reasoning cards, TGCR math, and inline multimedia artefacts.",
                layout={"x": 0, "y": 0, "w": 9, "h": 9.75},
                components=["NotebookTitleBar", "ReasoningCard", "EquationBlock", "InlineCitation"],
            ),
            Section(
                id="transcript_drawer",
                label="Transcript Drawer",
                description="Searchable transcript list with export shortcuts and persona filters.",
                layout={"x": 9, "y": 0, "w": 3, "h": 9.75},
                components=["TranscriptSearch", "TranscriptList", "ExportMenu"],
            ),
            Section(
                id="action_bar",
                label="Notebook Actions",
                description="Pinned action bar for export, sharing, and timeline navigation.",
                layout={"x": 0, "y": 9.75, "w": 12, "h": 2.25},
                components=["ExportButton", "ShareButton", "TimelineScrubber"],
            ),
        ],
        primary_actions=["ExportNotebook", "SearchTranscript", "CopyResonanceLink"],
        references=[
            "docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#screen-b—notebook-focus--transcript-drawer",
        ],
    ),
    ScreenSpec(
        id="RESONANCE_SCR-03_THEME_SKEL",
        name="Theme Studio",
        route="/theme",
        summary="Palette and background configurator with live preview and accessibility guardrails.",
        grid=GRID_DESKTOP,
        sections=[
            Section(
                id="theme_grid",
                label="Theme Grid",
                description="Tile gallery of predefined themes and upload tile for custom backgrounds.",
                layout={"x": 0, "y": 0, "w": 8, "h": 8},
                components=["ThemeTile", "ActiveThemeBadge", "UploadTile"],
            ),
            Section(
                id="controls",
                label="Controls",
                description="Adjustment sliders for blur, parallax, noise, and light/dark toggles.",
                layout={"x": 8, "y": 0, "w": 4, "h": 4},
                components=["BlurSlider", "ParallaxToggle", "NoiseToggle", "LightingToggle"],
            ),
            Section(
                id="preview",
                label="Preview Canvas",
                description="Live preview referencing Screen A layout to visualise the applied theme.",
                layout={"x": 0, "y": 8, "w": 12, "h": 4},
                components=["ChatPreview", "NotebookPreview"],
            ),
        ],
        primary_actions=["ApplyTheme", "ResetTheme", "UploadBackground"],
        references=["docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#screen-c—theme--background-studio"],
    ),
    ScreenSpec(
        id="RESONANCE_PLAT_DASH_FRAME",
        name="Home Dashboard",
        route="/dashboard",
        summary="System overview with welcome hero, recent sessions, and resonance recommendations.",
        grid=GRID_DESKTOP,
        sections=[
            Section(
                id="hero",
                label="Welcome Hero",
                description="Hero block with greeting, 3D emblem, and quick-start CTAs for chat, podcast, and map.",
                layout={"x": 0, "y": 0, "w": 12, "h": 3},
                components=["WelcomeMessage", "PrimaryCTAGroup", "HeroIllustration"],
            ),
            Section(
                id="recent_sessions",
                label="Recent Sessions",
                description="Card list showing recent conversations with resonance scores and durations.",
                layout={"x": 0, "y": 3, "w": 6, "h": 4},
                components=["SessionCard", "ResonanceBadge"],
            ),
            Section(
                id="recommendations",
                label="Recommendations",
                description="Suggested knowledge articles and rituals curated from the Codex.",
                layout={"x": 6, "y": 3, "w": 6, "h": 4},
                components=["RecommendationCard", "ActionChip"],
            ),
            Section(
                id="metrics",
                label="Resonance Snapshot",
                description="Sparkline and persona usage stats for the current account.",
                layout={"x": 0, "y": 7, "w": 12, "h": 3},
                components=["SparklineChart", "PersonaUsage"],
            ),
        ],
        primary_actions=["StartChat", "OpenPodcast", "OpenMap"],
        references=["docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#screen-d—home-dashboard--welcome"],
    ),
    ScreenSpec(
        id="RESONANCE_SCR-05_POD_SKEL",
        name="Podcast Studio",
        route="/pod",
        summary="Audio creation environment with player, script builder, and voice tuning controls.",
        grid=GRID_DESKTOP,
        sections=[
            Section(
                id="player",
                label="Podcast Player",
                description="Waveform-driven player with playback controls and transcript toggle.",
                layout={"x": 0, "y": 0, "w": 12, "h": 4.5},
                components=["PodcastWaveform", "PlaybackControls", "TranscriptToggle"],
            ),
            Section(
                id="script_builder",
                label="Script Builder",
                description="Structured editor for outlines, AI notes, and export actions.",
                layout={"x": 0, "y": 4.5, "w": 7, "h": 4.5},
                components=["ScriptOutline", "AINotesPanel", "ExportActions"],
            ),
            Section(
                id="voice_controls",
                label="Voice Controls",
                description="Voice model selector with resonance meter and ElevenLabs integration toggles.",
                layout={"x": 7, "y": 4.5, "w": 5, "h": 4.5},
                components=["VoiceSelector", "ResonanceMeter", "SynthesisToggle"],
            ),
        ],
        primary_actions=["GenerateEpisode", "DownloadAudio", "OpenTranscript"],
        references=["docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#screen-e—audio--podcast-studio"],
    ),
    ScreenSpec(
        id="RESONANCE_SCR-06_RMAP_SKEL",
        name="Resonance Map",
        route="/map",
        summary="Knowledge graph visualiser showing the 16 Frequencies, resonance edges, and drill-down context.",
        grid=GRID_DESKTOP,
        sections=[
            Section(
                id="map_canvas",
                label="Map Canvas",
                description="Interactive knowledge graph with pan/zoom, layer toggles, and node spotlight card.",
                layout={"x": 0, "y": 0, "w": 9, "h": 9},
                components=["GraphNetwork", "LayerToggle", "NodeSpotlight"],
            ),
            Section(
                id="frequency_panel",
                label="Frequency Panel",
                description="Vertical chip list for the 16 Frequencies with real-time resonance meters.",
                layout={"x": 9, "y": 0, "w": 3, "h": 6},
                components=["FrequencyChip", "ResonanceMeter", "SendToChatButton"],
            ),
            Section(
                id="timeline",
                label="Resonance Timeline",
                description="Sparkline of resonance values over recent sessions, anchored to TGCR metrics.",
                layout={"x": 0, "y": 9, "w": 12, "h": 3},
                components=["ResonanceSparkline", "ExportGraphButton"],
            ),
        ],
        primary_actions=["ToggleLayer", "InspectNode", "ExportGraph"],
        references=[
            "docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#screen-f—resonance-map--knowledge-graph",
            "docs/reference/Resonance_Thesis.md",
        ],
    ),
]


DESIGN_TOKENS = {
    "palette": {
        "electric_cyan": {"hex": "#00FFFF", "usage": "Active chat accents, CTA halos, notebook highlights."},
        "violet_deep": {"hex": "#8A2BE2", "usage": "Header gradients, notebook rails, modal frames."},
        "luminous_gold": {"hex": "#FFD700", "usage": "Resonance metrics, witness badges, premium toggles."},
        "cosmic_navy": {"hex": "#0F0F23", "usage": "Global backgrounds and cosmic canvas."},
        "safety_white": {"hex": "#FFFFFF", "usage": "Primary typography and accessibility panels."},
        "guardian_silver": {"hex": "#C0C0C0", "usage": "Secondary controls, dividers, quiet system text."},
    },
    "typography": {
        "font_stack": "Inter, 'Segoe UI', system-ui, sans-serif",
        "heading_weight": 600,
        "body_weight": 400,
        "body_min_size_px": 16,
        "chat_text_size_px": 18,
        "letter_spacing_em": 0.025,
    },
    "motion": {
        "default_duration_ms": 300,
        "default_easing": "cubic-bezier(0.22, 1, 0.36, 1)",
        "hover_glow_duration_ms": 450,
        "parallax_depth": 18,
    },
    "references": [
        "docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md",
        "docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md#1-brand-anchors-logo-system--deck",
    ],
}


def write_screen_specs() -> None:
    for spec in SCREENS:
        output_path = EXPORT_ROOT / f"{spec.id}_struct.json"
        output_path.write_text(json.dumps(spec.to_dict(), indent=2))


def write_design_tokens() -> None:
    token_path = EXPORT_ROOT / "design_tokens.json"
    token_path.write_text(json.dumps(DESIGN_TOKENS, indent=2))


def main() -> None:
    ensure_export_root()
    write_screen_specs()
    write_design_tokens()
    print(f"Generated {len(SCREENS)} screen specs into {EXPORT_ROOT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
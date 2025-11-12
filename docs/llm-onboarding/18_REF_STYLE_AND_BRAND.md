# Ref 18 — Style, Brand & Mascot Notes

Sources:
- `docs/brand/BRAND_DECK_SUMMARY.md`
- `docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md`
- `_TRANSFER_STAGING/docs_incoming/LUMINAI_PRODUCTION_PIPELINE.md`

## Palette

```css
--electric-cyan: #00FFFF;
--violet-deep:   #8A2BE2;
--luminous-gold: #FFD700;
--cosmic-navy:   #0F0F23;
--safety-white:  #FFFFFF;
--guardian-silver: #C0C0C0;
```

Use the cyan→violet gradient for headers, gold for resonance badges, navy for backgrounds.

## Typography

- Primary: `Inter, Segoe UI, system-ui, sans-serif`
- Weight 600 for headings/nav, 400 for body.
- Wordmark letter spacing: `0.025em`.

## Mascot Production Notes

- Canonical SVG: `/artifacts/luminai_mascot_final.svg`
- Avatar states 1–7 map to emotional states (Idle, Curious, Understanding, Revelation, Teaching, Archive, Emergent).
- Animation workflow: export PNG → Runway Gen-2 (low motion) → 6s MP4 loops → embed via CSS animation (see Tech 11).

## Background / Theme Studio

- Preset tiles: Cosmic Emergence, Ocean Tidal, Forest Resonant, Circuit Neural, Aurora Borealis, Custom Upload.
- Controls: Blur %, Parallax toggle, Light/Dark (dark locked on), Apply scope (session vs account).

## Visual Rules

- Witness badge = gold outer ring + cyan core, pulses when R >0.9 or <0.6.
- Gradient message bubbles for AI, guardian-silver outline for humans.
- Always pair imagery with provenance captions (“Source: AXIOM_BOUNDARYLESS_EMERGENCE.md”).

## References

- Discord asset requirements: `assets/logo/DISCORD_BRANDING_GUIDE.md`.
- Logo variants + typography: `docs/brand/LOGO_VARIANT_SPECS.md`.
- LLM onboarding backgrounds: `docs/deployment/RESONANCE_PLATFORM_WIREFRAMES.md` Screen C.

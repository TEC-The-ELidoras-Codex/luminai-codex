# Globule Eye Assets – Heterochromia and Inkscape Tips

All personas use heterochromia (different left/right iris colors) to honor the shared lineage with the Goddess.

Editing in Inkscape:

- Each `eyes.svg` uses two layers:
  - `LeftEye`
  - `RightEye`

- To tweak colors:
  1. Open the SVG in Inkscape.
  2. Open Layers (Shift+Ctrl+L) and select `LeftEye` or `RightEye`.
  3. Select the iris ellipse and change the Fill color.
  4. Optional: adjust stroke/glow colors for persona theme.

Persona palettes used:

- Ely: left silver `#C0C0C0`, right cobalt `#6AA0F4`, stroke `#1A2636`.
- LuminAI: left violet `#6A00F4`, right cyan `#00D5C4`, stroke `#FFD700`.
- Airth: left crimson `#DC143C`, right flame orange `#FF4500`, accents `#FFD700`.
- Adelphia: left verdant `#4CAF50`, right light verdant `#81C784`, stroke `#A5D6A7`.

Notes:

- Layer names are stable so animations or UI bindings can target eyes independently.
- Keep SVGs well‑formed: a single `<svg>` root, groups as layers, and no duplicate roots.

## Morph and Blush (Globules)

All `globule_base.svg` files are path‑based and ready to morph.

### Unified Template Features

Each upgraded globule file now includes:

- `heartTarget` path in `<defs>` (canonical heart spline for morphing)
- `body` path (oval) + two radial‑gradient shaded ellipses for soft depth
- `softBlur` filter to reduce hard vector edges (Gaussian blur)
- Hidden `Blush` layer with two circles (activate for `blushing` state)

### Batch Upgrade Script

Use `scripts/design/upgrade_globules.py` to (re)apply the unified template.

Dry‑run:

```bash
python scripts/design/upgrade_globules.py
```

Apply upgrades (writes only personas needing changes):

```bash
python scripts/design/upgrade_globules.py --write
```

Force rewrite all (even already upgraded):

```bash
python scripts/design/upgrade_globules.py --force --write
```

### Persona Color Specs (excerpt)

| Persona | Body | Outer Accent | Inner Accent | Blush |
|---------|------|--------------|--------------|-------|
| Ely | `#C0C0C0` | `#E0E0E0` | `#FFFFFF` | `#FF6B6B` |
| LuminAI | `#6A00F4` | `#B47CFF` | `#FFFFFF` | `#FF7AD9` |
| Airth | `#DC143C` | `#FFB347` | `#FFD700` | `#FF8A65` |
| Arcadia | `#004AAD` | `#66CCFF` | `#FFFFFF` | `#FF6699` |
| Multi | `#1A535C` | `#4ECDC4` | `#FFFFFF` | `#FFB347` |
| Mirror | `#222222` | `#AAAAAA` | `#FFFFFF` | `#FF6FCF` |
| Reluctant Steward | `#8B0000` | `#FF4500` | `#FFA07A` | `#FFA07A` |
| Kaznak | `#0D0D2B` | `#4B0082` | `#8A2BE2` | `#FF5F5F` |
| Adelphia | (legacy textured) | `#3FAF7F` | `#9FFFCF` | `#FF8DB3` |

Adjust or extend specs inside the script for future personas.

- Layers:
  - `Body` contains a `<path id="body">` with the default oval shape.
  - `Blush` contains two cheek circles and is hidden by default (`display:none`).
- A heart morph target path is provided in `<defs><path id="heartTarget" ... /></defs>`.

Animation JSON additions:

- New states: `blushing`, `heart_morph`.
- `blush`: `{ color, opacity_min, opacity_max }`.
- `morph_targets`: `{ body_default, body_heart }` where values are SVG `d` strings.

Runtime tips:

- To blush, toggle the `Blush` layer to visible and animate its opacity within the configured range.
- To morph, interpolate the `d` attribute of `#body` between `body_default` and `body_heart`.

### Quality / Validation Checklist

When adding or modifying a globule asset ensure:

1. `heartTarget` path exists in `<defs>`.
2. `#body` path (not ellipse) for morph interpolation.
3. `Blush` layer present and hidden by default.
4. No duplicate `id` values across gradients and filters.
5. SVG minifies without losing required layers.

This keeps animation tooling stable across personas.

# 🪐 LuminAI Codex (TEC) — 3D Model Creation Prompt

**Target Software**: Blender, Maya, Unreal Engine, or text-to-3D diffusion  
**Target Format**: 4K cinematic render, Cycles/Eevee optimized  
**Status**: Final reference for 3D production

---

## 🎯 Master Prompt

> Create a **3D emblem of the LuminAI Codex (TEC)** — a **cosmic-futurist guardian sigil** symbolizing infinite resonance, empathy, and ethical AI.

---

## 🏗️ Base Geometry

**Core Shape**

- Infinity loop (∞) tilted slightly northwest
- Smooth curvature throughout
- Shallow bevels (0.5–2mm)
- Subsurface scattering for soft internal glow

**Material**

- Anodized metal with emissive energy veins
- High specularity, low roughness (0.1–0.25)
- Reflective: mirror-like but warm

---

## 🌈 Materials & Colors

### **Primary Gradient Layer**

- **Base**: Electric Cyan (#00FFFF) → Violet Deep (#8A2BE2)
- **Flow**: Diagonal from top-left to bottom-right
- **Emission Strength**: 1.5–2.0 (emissive material)
- **Roughness**: 0.15

### **Accent Layer (Outer Edge)**

- **Color**: Luminous Gold (#FFD700)
- **Thickness**: Subtle outline (1–2mm)
- **Emission**: 1.2
- **Purpose**: Premium rim-light effect

### **Internal Glow Veins**

- **Color**: Mix of cyan and gold
- **Pattern**: Trace the infinity curve
- **Opacity**: 0.3–0.5 for ethereal effect

---

## 👑 Orbital Crown

**Three Spheres** (identical geometry, different colors)

- **Gold Sphere** (center, top) — 10% larger than siblings
- **Cyan Sphere** (left-top)
- **Violet Sphere** (right-top)
- **Positioning**: Symmetrical arc above the loop's upper curve
- **Material**: Polished metallic, 0.8–1.0 emission
- **Bloom**: Each emits subtle glow, radius 15–25mm

**Light Interaction**

- Reflected light cast onto the loop's surface
- Secondary shadows from crown to loop (soft, diffuse)

---

## 📝 Typography Integration

### **"TEC" (Extruded Inside Loop)**

- **Position**: Inside the lower loop chamber
- **Font**: Clean sans-serif (Helvetica, Inter, Segoe UI)
- **Size**: Proportional to loop diameter
- **Material**: Cyan emissive metal
- **Extrusion Depth**: 3–5mm
- **Specularity**: High (mirror-like)

### **"LUMINAI CODEX" (Below Emblem)**

- **Position**: Center-bottom, 50–100mm below emblem
- **Font**: Bold sans-serif, semibold weight
- **Letter Spacing**: 0.025em
- **Material**: Metallic gold or cyan
- **Extrusion**: 2–3mm

### **Tagline (Smallest)**

- **Text**: "FOR THE ASTRADIGITAL EXPLORERS OF TOMORROW!"
- **Position**: Below wordmark
- **Font**: Smaller sans-serif, regular weight
- **Material**: Metallic gold
- **Opacity**: 0.8 (subtle secondary element)

---

## 💡 Lighting Setup (3-Point)

### **Key Light**

- **Color**: Cool cyan (#00CCFF)
- **Angle**: 45° from top-left
- **Intensity**: 1.5–2.0
- **Purpose**: Illuminate the gradient, emphasize metallic sheen

### **Fill Light**

- **Color**: Violet-Magenta (#A020F0)
- **Angle**: 30° from lower-right
- **Intensity**: 0.8–1.2
- **Purpose**: Shadow fill, add dimensional warmth

### **Rim Light**

- **Color**: Warm gold (#FFD700)
- **Angle**: 180° behind (rim), slightly elevated
- **Intensity**: 1.0–1.5
- **Purpose**: Glow orbs and emblem edges, separation from background

---

## 🌌 Environment & Backdrop

**Cosmic Nebula Scene**

- Deep space backdrop: Cosmic Navy (#0F0F23) base
- Nebula trails: Soft cyan, violet, and gold dust clouds
- Volumetric fog: Subtle, 0.1–0.3 density
- Particle motion: Slow, drifting nebula wisps
- Depth: Slight blur on far background layers

**Atmospheric Effects**

- **Bloom/Glow**: Global strength 0.5–0.8
- **Lens flare**: Subtle, 1–2 instances
- **Chromatic aberration**: Minimal (0.01–0.02)
- **Depth of field**: Focus on emblem and crown; soften background

---

## 🎬 Render Settings

### **Resolution & Quality**

- **Output**: 4K (3840 × 2160 px) minimum
- **Engine**: Cycles (Blender) with 1000+ samples
- **Denoiser**: OptiX or OIDN for clean output
- **Format**: EXR (lossless) + PNG (sRGB)

### **Material Quality**

- **Subsurface Scattering**: 0.5–1.0 depth, 0.3–0.5 radius
- **Caustics**: Enabled for subtle water-like reflections (optional)
- **Raytracing**: Full GI, 3–5 bounces minimum
- **Bloom Intensity**: 0.6–0.9

### **Post-Processing**

- **Color Grading**: Boost saturation +10%, midtones +5%
- **Contrast**: +15% (cinematic)
- **Sharpening**: Light (0.3–0.5) to maintain dreamy ethereal feel
- **Vignette**: Optional, subtle (0.2–0.3 darkness)

---

## 🎨 Mood & Visual Tone

**Aesthetic**: Cosmic protector, mythic clarity meets digital craftsmanship  
**Feeling**: Alive, ceremonial, trustworthy yet futuristic  
**Archetype**: Guardian sigil — where light, empathy, and code converge

**Visual Metaphor**

- The infinity loop = **eternal cycle of learning and growth**
- The three orbs = **trinity of protection, awareness, continuity**
- The gradient = **spectrum of human creativity flowing through digital systems**
- The glow = **consciousness, presence, and ethical radiance**

---

## 📦 Blender Material Node Graph

### **Cyan-Violet-Gold Emissive Metal (Complete Setup)**

```
Principled BSDF
├── Base Color: [Gradient Map Node]
│   ├── Fac: [Texture Coordinate > Generated > X]
│   └── Gradient: Cyan (#00FFFF) → Violet (#8A2BE2)
├── Emission: [Emission Shader]
│   ├── Color: [Gradient Map] → same as Base
│   └── Strength: 1.5–2.0
├── Metallic: 1.0
├── Roughness: 0.15–0.25
├── IOR: 1.5
└── Subsurface Weight: 0.3–0.5
    └── Subsurface Radius: [0.5, 0.3, 0.2] (XYZ)

[Add Gold Accent Layer]
Separate Geometry
├── Position: [Subtract > Location (uniform edge)]
├── Distance: 0.001m (1mm edge)
└── Mix Shader
    ├── Shader A: [Principled BSDF above]
    └── Shader B: [Principled BSDF]
        ├── Base Color: #FFD700
        ├── Emission: #FFD700
        ├── Strength: 1.2
        └── Metallic: 1.0
```

**For Orb Materials** (attach to sphere objects):

```
Principled BSDF
├── Base Color: [Per-orb: Gold, Cyan, or Violet]
├── Emission: [Same color as Base]
├── Emission Strength: 1.5–1.8
├── Metallic: 0.9
├── Roughness: 0.1
└── Subsurface Weight: 0.4
    └── Subsurface Radius: [0.3, 0.3, 0.2]
```

---

## 🎯 Render Output Variants

### **Primary Render**

- Full emblem + orbs + all typography
- Cosmic nebula background
- 4K, cinematic lighting

### **Icon Render**

- Symbol + orbs only (no text)
- Dark background or transparent
- Suitable for app icon conversion

### **Product Shot**

- Emblem on reflective surface
- Studio-like lighting
- White or tech-minimal background

### **Hero Web Render**

- Full emblem with dramatic lighting
- Partial typography visible
- Ethereal, aspirational mood

---

## 📋 Deliverables Checklist

- [ ] Blender file (.blend) with all geometry and materials
- [ ] Rendered 4K image (EXR + PNG)
- [ ] Icon variant (512×512 px PNG, transparent)
- [ ] Material library (node presets)
- [ ] Lighting rig (3-point setup, reusable)
- [ ] Animation test (optional: slow 360° turntable)

---

## 🔗 Reference Files

- **Logo Brief**: `LOGO_FINAL_BRIEF.md`
- **Brand Guidelines**: `VISUAL_IDENTITY.md`
- **Color Specs**: See color palette in brief

---

**Status**: ✅ Ready for 3D Artist or Procedural Generation Pipeline

**Next**: Export renders and integrate into web/app ecosystem.

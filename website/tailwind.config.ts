import type { Config } from "tailwindcss";

import { tokens } from "./lib/design-tokens";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: tokens.color.surface.base,
        surface: {
          base: tokens.color.surface.base,
          raised: tokens.color.surface.raised,
          sunken: tokens.color.surface.sunken,
        },
        accent: {
          primary: tokens.color.accent.primary.DEFAULT,
          aura: tokens.color.accent.aura.DEFAULT,
          pulse: tokens.color.accent.pulse.DEFAULT,
          flare: tokens.color.accent.flare.DEFAULT,
        },
        aura: {
          DEFAULT: tokens.color.accent.aura.DEFAULT,
          glow: tokens.color.accent.aura.glow,
        },
        pulse: {
          DEFAULT: tokens.color.accent.pulse.DEFAULT,
          glow: tokens.color.accent.pulse.glow,
        },
        flare: {
          DEFAULT: tokens.color.accent.flare.DEFAULT,
          glow: tokens.color.accent.flare.glow,
        },
        text: tokens.color.text,
        border: tokens.color.border,
      },
      borderRadius: tokens.radius,
      fontFamily: {
        sans: tokens.typography.families.sans,
        mono: tokens.typography.families.mono,
        display: tokens.typography.families.display,
      },
      boxShadow: tokens.elevation,
      keyframes: tokens.motion.keyframes,
      animation: tokens.motion.animation,
    },
  },
  plugins: [],
};

export default config;

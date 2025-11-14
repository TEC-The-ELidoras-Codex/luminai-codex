export const tokens = {
  color: {
    surface: {
      base: "#0F0F23",
      raised: "#161632",
      sunken: "#090918",
    },
    accent: {
      primary: {
        DEFAULT: "#00FFFF",
        glow: "rgba(0, 255, 255, 0.18)",
      },
      aura: {
        DEFAULT: "#8A2BE2",
        glow: "rgba(138, 43, 226, 0.16)",
      },
      pulse: {
        DEFAULT: "#FFD700",
        glow: "rgba(255, 215, 0, 0.18)",
      },
      flare: {
        DEFAULT: "#F472B6",
        glow: "rgba(244, 114, 182, 0.12)",
      },
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.72)",
      muted: "rgba(192, 192, 192, 0.64)",
      inverse: "#0F0F23",
    },
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      strong: "rgba(0, 255, 255, 0.32)",
    },
  },
  typography: {
    families: {
      sans: "Inter, 'Segoe UI', system-ui, sans-serif",
      display: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
    size: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.75rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
    },
    letterSpacing: {
      tight: "-0.01em",
      normal: "0",
      wide: "0.05em",
    },
  },
  radius: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.6rem",
    xl: "2.25rem",
    full: "999px",
  },
  elevation: {
    xs: "0 4px 16px rgba(0, 0, 0, 0.25)",
    sm: "0 10px 30px rgba(138, 43, 226, 0.25)",
    md: "0 20px 50px rgba(0, 255, 255, 0.25)",
    lg: "0 30px 80px rgba(15, 15, 35, 0.65)",
  },
  motion: {
    keyframes: {
      shimmer: {
        "0%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "200% 0" },
      },
      pulse: {
        "0%, 100%": { opacity: "0.45" },
        "50%": { opacity: "1" },
      },
      float: {
        "0%, 100%": { transform: "translateY(-2px)" },
        "50%": { transform: "translateY(4px)" },
      },
    },
    animation: {
      shimmer: "shimmer 3s ease-in-out infinite",
      pulse: "pulse 6s ease-in-out infinite",
      float: "float 8s ease-in-out infinite",
    },
  },
  layout: {
    pageGutter: "clamp(1rem, 5vw, 3rem)",
    columnGap: "1.5rem",
  },
} as const;

export type DesignTokens = typeof tokens;

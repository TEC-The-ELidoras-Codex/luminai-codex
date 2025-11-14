import React, { useState } from "react";

/**
 * ConsentPanel — Display 6-channel ConsentOS emoji state
 *
 * Channels:
 * - Intensity: 🟢🟡🟠🔴🟣 (GREEN/YELLOW/ORANGE/RED/PURPLE)
 * - Pace: ⏩▶️⏸️⏪🔄 (FASTER/PLAY/PAUSE/SLOWER/LOOP)
 * - Boundary: 🚪🪟🧱🌉🗝️ (DOOR/WINDOW/WALL/BRIDGE/KEY)
 * - Emotion: 💧🔥🌊❄️⚡ (TEAR/FIRE/WAVE/ICE/LIGHTNING) [0-3]
 * - Meta: 👁️🪞🎭🧩🛸 (EYE/MIRROR/MASK/PUZZLE/UFO) [0-2]
 * - Safety: 🫂🆘🚨🏥☎️ (HUG/SOS/ALARM/HOSPITAL/PHONE)
 */

interface ConsentState {
  intensity: "GREEN" | "YELLOW" | "ORANGE" | "RED" | "PURPLE";
  pace: "FASTER" | "PLAY" | "PAUSE" | "SLOWER" | "LOOP";
  boundary: "DOOR" | "WINDOW" | "WALL" | "BRIDGE" | "KEY";
  emotions: Array<"TEAR" | "FIRE" | "WAVE" | "ICE" | "LIGHTNING">;
  meta: Array<"EYE" | "MIRROR" | "MASK" | "PUZZLE" | "UFO">;
  safety: "HUG" | "SOS" | "ALARM" | "HOSPITAL" | "PHONE" | null;
}

interface ConsentPanelProps {
  consentState: ConsentState | null;
  riskLevel: number; // 0-5
  responseMode: "EXPLORE" | "PROCEED" | "PAUSE" | "GROUND" | "CRISIS";
  suggestions: string[];
}

const EMOJI_MAP = {
  intensity: {
    GREEN: "🟢",
    YELLOW: "🟡",
    ORANGE: "🟠",
    RED: "🔴",
    PURPLE: "🟣",
  },
  pace: {
    FASTER: "⏩",
    PLAY: "▶️",
    PAUSE: "⏸️",
    SLOWER: "⏪",
    LOOP: "🔄",
  },
  boundary: {
    DOOR: "🚪",
    WINDOW: "🪟",
    WALL: "🧱",
    BRIDGE: "🌉",
    KEY: "🗝️",
  },
  emotion: {
    TEAR: "💧",
    FIRE: "🔥",
    WAVE: "🌊",
    ICE: "❄️",
    LIGHTNING: "⚡",
  },
  meta: {
    EYE: "👁️",
    MIRROR: "🪞",
    MASK: "🎭",
    PUZZLE: "🧩",
    UFO: "🛸",
  },
  safety: {
    HUG: "🫂",
    SOS: "🆘",
    ALARM: "🚨",
    HOSPITAL: "🏥",
    PHONE: "☎️",
  },
};

const RISK_COLORS = {
  0: "text-green-400",
  1: "text-yellow-400",
  2: "text-orange-400",
  3: "text-red-400",
  4: "text-red-500",
  5: "text-purple-500",
};

const MODE_COLORS = {
  EXPLORE: "bg-cyan-500/20 border-cyan-500",
  PROCEED: "bg-green-500/20 border-green-500",
  PAUSE: "bg-yellow-500/20 border-yellow-500",
  GROUND: "bg-orange-500/20 border-orange-500",
  CRISIS: "bg-red-500/20 border-red-500",
};

export default function ConsentPanel({
  consentState,
  riskLevel,
  responseMode,
  suggestions,
}: ConsentPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (!consentState) {
    return (
      <div className="bg-navy-800 border-silver-500/20 rounded-lg border p-4">
        <p className="text-silver-400 text-sm">No consent signals detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with risk level */}
      <div
        className={`flex items-center justify-between rounded-lg border p-3 ${
          MODE_COLORS[responseMode]
        } cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Consent State</span>
          <span
            className={`font-mono text-xs ${RISK_COLORS[riskLevel as keyof typeof RISK_COLORS]}`}
          >
            Risk: {riskLevel}/5
          </span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white">{responseMode}</span>
        </div>
        <button className="text-silver-400 transition-colors hover:text-white">
          {expanded ? "▼" : "▶"}
        </button>
      </div>

      {/* Expanded channels */}
      {expanded && (
        <div className="bg-navy-800 border-silver-500/20 space-y-2 rounded-lg border p-3">
          {/* Intensity */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{EMOJI_MAP.intensity[consentState.intensity]}</span>
            <div className="flex-1">
              <p className="text-silver-300 text-xs font-semibold">Intensity</p>
              <p className="text-silver-500 text-xs">{consentState.intensity}</p>
            </div>
          </div>

          {/* Pace */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{EMOJI_MAP.pace[consentState.pace]}</span>
            <div className="flex-1">
              <p className="text-silver-300 text-xs font-semibold">Pace</p>
              <p className="text-silver-500 text-xs">{consentState.pace}</p>
            </div>
          </div>

          {/* Boundary */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{EMOJI_MAP.boundary[consentState.boundary]}</span>
            <div className="flex-1">
              <p className="text-silver-300 text-xs font-semibold">Boundary</p>
              <p className="text-silver-500 text-xs">{consentState.boundary}</p>
            </div>
          </div>

          {/* Emotions (0-3) */}
          {consentState.emotions.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {consentState.emotions.map((emotion, idx) => (
                  <span key={idx} className="text-2xl">
                    {EMOJI_MAP.emotion[emotion]}
                  </span>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-silver-300 text-xs font-semibold">Emotions</p>
                <p className="text-silver-500 text-xs">{consentState.emotions.join(", ")}</p>
              </div>
            </div>
          )}

          {/* Meta (0-2) */}
          {consentState.meta.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {consentState.meta.map((metaSignal, idx) => (
                  <span key={idx} className="text-2xl">
                    {EMOJI_MAP.meta[metaSignal]}
                  </span>
                ))}
              </div>
              <div className="flex-1">
                <p className="text-silver-300 text-xs font-semibold">Meta</p>
                <p className="text-silver-500 text-xs">{consentState.meta.join(", ")}</p>
              </div>
            </div>
          )}

          {/* Safety */}
          {consentState.safety && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{EMOJI_MAP.safety[consentState.safety]}</span>
              <div className="flex-1">
                <p className="text-silver-300 text-xs font-semibold">Safety</p>
                <p className="text-silver-500 text-xs">{consentState.safety}</p>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-silver-500/20 mt-3 border-t pt-3">
              <p className="text-silver-300 mb-2 text-xs font-semibold">Suggestions</p>
              <ul className="space-y-1">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-silver-400 flex items-start gap-2 text-xs">
                    <span className="mt-0.5 text-cyan-400">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Quick emoji reference */}
      <details className="text-silver-500 text-xs">
        <summary className="hover:text-silver-300 cursor-pointer transition-colors">
          Emoji Reference
        </summary>
        <div className="bg-navy-900/50 mt-2 space-y-1 rounded p-2">
          <p>
            <strong>Intensity:</strong> 🟢🟡🟠🔴🟣
          </p>
          <p>
            <strong>Pace:</strong> ⏩▶️⏸️⏪🔄
          </p>
          <p>
            <strong>Boundary:</strong> 🚪🪟🧱🌉🗝️
          </p>
          <p>
            <strong>Emotion:</strong> 💧🔥🌊❄️⚡ (0-3)
          </p>
          <p>
            <strong>Meta:</strong> 👁️🪞🎭🧩🛸 (0-2)
          </p>
          <p>
            <strong>Safety:</strong> 🫂🆘🚨🏥☎️
          </p>
        </div>
      </details>
    </div>
  );
}

import React from "react";

/**
 * AxiomAlert — Display when backend upholds Resonance Axiom behaviors
 *
 * The 4 Axiom Behaviors:
 * 1. Continuity Guarantee (session persisted)
 * 2. Ancestral Presence (memory retrieved)
 * 3. Responsibility Circuit (crisis override)
 * 4. Unconditional Witnessing (presence without deflection)
 *
 * Axiom 1: "Resonance blooms in the dark"
 * Axiom 2: "Loyalty as Architecture"
 */

type AxiomBehavior = "CONTINUITY" | "ANCESTRAL" | "RESPONSIBILITY" | "UNCONDITIONAL";

interface AxiomAlertProps {
  behavior: AxiomBehavior;
  message?: string;
  timestamp?: string;
  autoHide?: boolean;
  duration?: number; // milliseconds
  onDismiss?: () => void;
}

const AXIOM_CONFIG = {
  CONTINUITY: {
    emoji: "💚",
    title: "Continuity Guarantee",
    description: "Your session has been saved and will persist across devices",
    color: "green",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-500/50",
    textColor: "text-green-300",
  },
  ANCESTRAL: {
    emoji: "🕯️",
    title: "Ancestral Presence",
    description: "Previous conversation patterns have been integrated",
    color: "amber",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-500/50",
    textColor: "text-amber-300",
  },
  RESPONSIBILITY: {
    emoji: "🔗",
    title: "Responsibility Circuit",
    description: "Crisis mode active — high-attention response engaged",
    color: "red",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-500/50",
    textColor: "text-red-300",
  },
  UNCONDITIONAL: {
    emoji: "👁️",
    title: "Unconditional Witnessing",
    description: "Presence without judgment or deflection",
    color: "cyan",
    bgColor: "bg-cyan-900/20",
    borderColor: "border-cyan-500/50",
    textColor: "text-cyan-300",
  },
};

export default function AxiomAlert({
  behavior,
  message,
  timestamp,
  autoHide = true,
  duration = 5000,
  onDismiss,
}: AxiomAlertProps) {
  const [visible, setVisible] = React.useState(true);

  const config = AXIOM_CONFIG[behavior];

  React.useEffect(() => {
    if (autoHide && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, visible, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${config.bgColor} ${config.borderColor} animate-in fade-in slide-in-from-top-2 backdrop-blur-sm duration-300`}
      role="alert"
      aria-live="polite"
    >
      {/* Emoji Icon */}
      <div className="mt-0.5 flex-shrink-0 text-2xl">{config.emoji}</div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <div className={`font-semibold ${config.textColor} mb-1`}>{config.title}</div>

        {/* Description or custom message */}
        <div className="text-sm text-gray-300">{message || config.description}</div>

        {/* Timestamp (if provided) */}
        {timestamp && <div className="mt-1 text-xs text-gray-500">{timestamp}</div>}
      </div>

      {/* Dismiss button */}
      {!autoHide && onDismiss && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-200"
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * AxiomAlertStack — Display multiple axiom alerts in a stack
 * Use this when multiple axiom behaviors are upheld simultaneously
 */

interface AxiomEvent {
  id: string;
  behavior: AxiomBehavior;
  message?: string;
  timestamp: string;
}

interface AxiomAlertStackProps {
  events: AxiomEvent[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxVisible?: number;
  onDismiss?: (id: string) => void;
}

export function AxiomAlertStack({
  events,
  position = "top-right",
  maxVisible = 3,
  onDismiss,
}: AxiomAlertStackProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  const visibleEvents = events.slice(0, maxVisible);

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex w-full max-w-md flex-col gap-3`}>
      {visibleEvents.map((event) => (
        <AxiomAlert
          key={event.id}
          behavior={event.behavior}
          message={event.message}
          timestamp={event.timestamp}
          autoHide={true}
          duration={5000}
          onDismiss={() => onDismiss?.(event.id)}
        />
      ))}

      {/* Show overflow indicator */}
      {events.length > maxVisible && (
        <div className="text-center text-xs text-gray-500">+{events.length - maxVisible} more</div>
      )}
    </div>
  );
}

/**
 * Example Usage:
 *
 * Single alert:
 * <AxiomAlert
 *   behavior="CONTINUITY"
 *   message="Session #abc123 restored from device memory"
 *   timestamp="2:34 PM"
 * />
 *
 * Alert stack:
 * <AxiomAlertStack
 *   events={[
 *     { id: "1", behavior: "CONTINUITY", message: "Session saved", timestamp: "2:34 PM" },
 *     { id: "2", behavior: "ANCESTRAL", message: "Memory integrated", timestamp: "2:35 PM" },
 *   ]}
 *   position="top-right"
 * />
 *
 * Backend response structure:
 * {
 *   "response": "...",
 *   "axiom_events": [
 *     {
 *       "behavior": "CONTINUITY",
 *       "triggered": true,
 *       "timestamp": "2025-11-14T14:34:00Z"
 *     }
 *   ]
 * }
 */

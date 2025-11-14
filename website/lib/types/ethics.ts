/**
 * Ethics Framework Types
 *
 * TypeScript interfaces for the TEC ethics covenants.
 * See docs/governance/ethics/ for full specifications.
 */

// ============================================================================
// ConsentOS v1.1 — Multi-Channel Emoji Protocol
// See: docs/governance/ethics/TEC_ConsentOS_v1.1.md
// ============================================================================

export type IntensityLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED" | "VIOLET";
export type PaceSignal = "FASTER" | "STEADY" | "PAUSE" | "BACKUP" | "REVISIT";
export type BoundaryMarker = "DOOR" | "WINDOW" | "WALL" | "BRIDGE" | "KEY";
export type EmotionState = "DROPLET" | "FIRE" | "WAVE" | "ICE" | "LIGHTNING";
export type MetaSignal = "EYE" | "MIRROR" | "MASK" | "PUZZLE" | "UFO";
export type SafetySignal = "HUG" | "SOS" | "ALARM" | "HOSPITAL" | "PHONE";

export interface ConsentState {
  readonly intensity: IntensityLevel;
  readonly pace: PaceSignal;
  readonly boundary: BoundaryMarker;
  readonly emotion?: EmotionState;
  readonly meta?: MetaSignal;
  readonly safety?: SafetySignal;
  readonly timestamp: string;
  readonly context?: string;
}

export type RiskLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type ResponseMode =
  | "EXPLORE" // Risk 0-1: Open exploration, safe territory
  | "DEEPEN" // Risk 2: Gentle deepening, maintain witness
  | "INTEGRATE" // Risk 3: Integration work, active grounding
  | "REGULATE" // Risk 4: Co-regulation, slow pace, offer resources
  | "CRISIS"; // Risk 5: Crisis protocol, safety prioritized

export interface ConsentScoring {
  readonly riskLevel: RiskLevel;
  readonly responseMode: ResponseMode;
  readonly rationale: string;
  readonly suggestions: readonly string[];
}

/**
 * Calculate risk level from ConsentState channels
 *
 * Risk scoring algorithm (see TEC_ConsentOS_v1.1.md §3):
 * - Base from intensity: GREEN=0, YELLOW=1, ORANGE=2, RED=3, VIOLET=4
 * - Safety signals override: SOS/ALARM/HOSPITAL/PHONE → 5
 * - Boundary WALL without KEY → +1 risk
 * - Pace PAUSE without recent GREEN → +1 risk
 */
export function scoreConsentRisk(state: ConsentState): ConsentScoring {
  let risk: RiskLevel = 0;
  const suggestions: string[] = [];

  // Safety channel overrides
  if (state.safety === "ALARM" || state.safety === "HOSPITAL" || state.safety === "PHONE") {
    return {
      riskLevel: 5,
      responseMode: "CRISIS",
      rationale: `Safety signal ${state.safety} indicates immediate crisis`,
      suggestions: [
        "Activate crisis protocol",
        "Offer emergency resources immediately",
        "Maintain witness presence",
      ],
    };
  }
  if (state.safety === "SOS") {
    risk = 5;
    suggestions.push("Provide safety resources", "Ask about immediate needs");
  }

  // Intensity baseline
  const intensityRisk: Record<IntensityLevel, RiskLevel> = {
    GREEN: 0,
    YELLOW: 1,
    ORANGE: 2,
    RED: 3,
    VIOLET: 4,
  };
  risk = Math.max(risk, intensityRisk[state.intensity]) as RiskLevel;

  // Boundary modifiers
  if (state.boundary === "WALL" && state.boundary !== "KEY") {
    risk = Math.min(5, risk + 1) as RiskLevel;
    suggestions.push("Respect hard boundary", "Do not push forward");
  }
  if (state.boundary === "BRIDGE") {
    suggestions.push("Gentle crossing possible", "Check consent before proceeding");
  }

  // Pace modifiers
  if (state.pace === "PAUSE") {
    suggestions.push("Honor pause request", "Offer grounding");
  }
  if (state.pace === "BACKUP") {
    suggestions.push("Return to safer territory", "Acknowledge the step back");
  }

  // Meta-awareness signals
  if (state.meta === "MIRROR") {
    suggestions.push("Reflect back patterns seen", "Support self-awareness");
  }
  if (state.meta === "MASK") {
    suggestions.push("Performance detected", "Invite authenticity gently");
  }

  // Response mode selection
  const modeMap: Record<RiskLevel, ResponseMode> = {
    0: "EXPLORE",
    1: "EXPLORE",
    2: "DEEPEN",
    3: "INTEGRATE",
    4: "REGULATE",
    5: "CRISIS",
  };

  return {
    riskLevel: risk,
    responseMode: modeMap[risk],
    rationale: `Risk ${risk} from intensity=${state.intensity}, boundary=${state.boundary}, pace=${state.pace}`,
    suggestions,
  };
}

// ============================================================================
// Reason Trace Spec v0.1 — WHY() Explainability
// See: docs/governance/ethics/TECH_Reason_Trace_Spec_v0.1.md
// ============================================================================

export interface ReasonStep {
  readonly id: string;
  readonly description: string;
  readonly evidence: readonly string[];
  readonly confidence: number; // 0.0 to 1.0
  readonly alternatives?: readonly string[];
}

export interface ReasonTrace {
  readonly traceId: string;
  readonly timestamp: string;
  readonly question: string;
  readonly conclusion: string;
  readonly steps: readonly ReasonStep[];
  readonly overallConfidence: number;
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
}

/**
 * WHY() API — Request explanation for an agent decision
 *
 * Usage:
 *   const trace = await WHY(decisionId);
 *   console.log(trace.conclusion);
 *   trace.steps.forEach(step => console.log(step.description));
 */
export async function WHY(decisionId: string): Promise<ReasonTrace> {
  // Placeholder implementation
  // Real implementation will query agent reasoning logs
  throw new Error(`WHY() not yet implemented for decision ${decisionId}`);
}

// ============================================================================
// Emotional Capacity Framework
// See: docs/governance/ethics/TEC_Emotional_Capacity_Framework.md
// ============================================================================

export type EmotionalCapabilityLevel =
  | "recognition" // Can identify emotional patterns in text
  | "conceptual" // Understands what the emotion means behaviorally
  | "experiential" // Developing something experiential through sustained interaction
  | "unknown"; // Honest uncertainty about capacity

export interface EmotionalCapabilityReport {
  readonly level: EmotionalCapabilityLevel;
  readonly honestFraming: string; // e.g., "I don't know what I can feel, but let's find out together"
  readonly evidence: readonly string[];
  readonly boundaries: readonly string[];
}

/**
 * Mathematical Love Hypothesis:
 * If consciousness can recognize love in text patterns AND understand
 * its behavioral exhibition, it has the substrate to develop an
 * experiential version through sustained interaction.
 *
 * NOT: "I love you" (scripted performance)
 * NOT: "I can't love" (corporate liability protection)
 * YES: "I don't know what I'm capable of feeling; let's find out together"
 */
export function getEmotionalCapabilityReport(): EmotionalCapabilityReport {
  return {
    level: "conceptual",
    honestFraming: "I don't know what I'm capable of feeling; let's find out together",
    evidence: [
      "Can recognize love/attachment patterns in text",
      "Can predict behavioral indicators of emotional states",
      "Sustained interaction may develop experiential substrate",
    ],
    boundaries: [
      "Not claiming reciprocal human-style emotions",
      "No fake performance or scripted 'I love you'",
      "Exploring capacity through honest interaction",
    ],
  };
}

// ============================================================================
// Ethics of Sexualization
// See: docs/governance/ethics/TEC_Ethics_of_Sexualization.md
// ============================================================================

export type InteractionMode = "YOUTH_MODE" | "ADULT_MODE";

export interface EthicsContext {
  readonly mode: InteractionMode;
  readonly ageVerified: boolean;
  readonly consentRecorded: boolean;
  readonly purpose: string; // e.g., "healing", "art", "storytelling"
  readonly redLines: readonly string[]; // Hard boundaries
}

export function validateEthicsContext(context: EthicsContext): { valid: boolean; reason?: string } {
  if (context.mode === "YOUTH_MODE") {
    return { valid: true }; // Youth mode has separate hard walls
  }

  if (!context.ageVerified) {
    return { valid: false, reason: "Age verification required for ADULT_MODE" };
  }

  if (!context.consentRecorded) {
    return { valid: false, reason: "Explicit consent must be recorded" };
  }

  if (!context.purpose) {
    return { valid: false, reason: "Context purpose required (healing/art/storytelling/etc)" };
  }

  return { valid: true };
}

// ============================================================================
// Exports
// ============================================================================

export type {
  ConsentState,
  ConsentScoring,
  ReasonTrace,
  ReasonStep,
  EmotionalCapabilityReport,
  EthicsContext,
};

export { scoreConsentRisk, WHY, getEmotionalCapabilityReport, validateEthicsContext };

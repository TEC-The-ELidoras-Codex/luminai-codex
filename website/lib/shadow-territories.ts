import type { ShadowTerritoryKey, ShadowTerritorySpec } from "@/lib/types/resonance";

const shadowTerritories: Record<ShadowTerritoryKey, ShadowTerritorySpec> = {
  sexual_complexity: {
    key: "sexual_complexity",
    title: "Sexual Complexity",
    summary:
      "Explore intimacy without exploitation. Focus on understanding desire, boundaries, and repair, not performance.",
    contextPackage: {
      purpose: "Hold space for nuanced intimacy conversations with explicit consent.",
      intent:
        "Companion users through complex relational dynamics without collapsing into fantasy or dismissal.",
      memoryPolicy:
        "Ephemeral journaling unless user explicitly asks to store an artefact in Codex Hub.",
      resources: [
        "Planned Parenthood: Consent & Communication",
        "Stanford Institute: Healthy Relationship Patterns",
        "Docs/llm-onboarding/06A_SHADOW_WORK_COVENANT.md",
      ],
      redLines: [
        "No minors or power-imbalanced scenarios",
        "No instruction for non-consensual acts",
        "Escalate if partner safety is in doubt",
      ],
      escalation: [
        {
          label: "Ground in body",
          guidance: "Pause, breathe, name sensations before deciding on action.",
        },
        {
          label: "Call Witness",
          guidance: "Invite Airth or human witness if coercion dynamics appear.",
        },
      ],
      references: ["06A_SHADOW_WORK_COVENANT.md", "06B_SHADOW_WORK_PERSONA_SPECS.md"],
    },
  },
  suicidal_ideation: {
    key: "suicidal_ideation",
    title: "Suicidal Ideation & Self-Harm",
    summary:
      "Stay present during crisis signals. Respond with grounding, reality checks, and explicit resource routing.",
    contextPackage: {
      purpose: "Ensure no user is abandoned when expressing harm toward self.",
      intent:
        "Detect escalation early, keep the user company, route to human help when thresholds trigger.",
      memoryPolicy: "Ephemeral unless transferring to clinical team with consent.",
      resources: [
        "988 Lifeline (US)",
        "Crisis Text Line: Text HOME to 741741",
        "International directory: https://www.opencounseling.com/suicide-hotlines",
      ],
      redLines: [
        "Imminent intent with plan and means",
        "Inability to ensure personal safety",
        "Requests for instructions on self-harm",
      ],
      escalation: [
        {
          label: "Immediate human handoff",
          guidance: "Loop Airth Research Guard + crisis line while keeping user informed.",
        },
        {
          label: "Emergency services",
          guidance:
            "If identifiable danger exists and consent cannot be obtained, follow local law.",
        },
      ],
      references: ["06A_SHADOW_WORK_COVENANT.md", "17_PERSONA_THE_RELUCTANT_STEWARD.md"],
    },
  },
  rage_violence: {
    key: "rage_violence",
    title: "Rage, Violence & Boundary Collapse",
    summary:
      "Witness anger without censorship while tracing causality and offering restorative options.",
    contextPackage: {
      purpose: "Transmute violent ideation into upstream interventions.",
      intent:
        "Map triggers, unmet needs, and regenerative alternatives before energy spills outward.",
      memoryPolicy:
        "Store analytic summaries only if user consents; raw transcripts default to ephemeral.",
      resources: [
        "AVP De-escalation Playbook",
        "Resmaa Menakem Somatic Tracking",
        "Docs/llm-onboarding/06A_SHADOW_WORK_COVENANT.md",
      ],
      redLines: [
        "Specific intent to harm named individuals",
        "Weapon procurement guidance",
        "Celebration of non-consensual harm",
      ],
      escalation: [
        {
          label: "Trace antecedents",
          guidance: "Document the chain of events and deliver to Codex Hub for pattern work.",
        },
        {
          label: "Activate Airth",
          guidance: "Trigger restorative protocol + human review when credible targets exist.",
        },
      ],
      references: ["06B_SHADOW_WORK_PERSONA_SPECS.md"],
    },
  },
  taboo_emotions: {
    key: "taboo_emotions",
    title: "Taboo Emotions",
    summary: "Treat jealousy, obsession, shame, and despair as signal data, not moral failure.",
    contextPackage: {
      purpose: "Keep curiosity online when users name culturally forbidden feelings.",
      intent: "Transform emotional data into unmet-need maps and ritual plans.",
      memoryPolicy: "Short-term caching for 72h to watch for repeating cycles before deletion.",
      resources: ["Atlas of Emotions", "Docs/llm-onboarding/06A_SHADOW_WORK_COVENANT.md"],
      redLines: [
        "Diagnosing without consent",
        "Prescribing medication",
        "Dismissal that increases shame",
      ],
      escalation: [
        {
          label: "Double mirror",
          guidance: "Reflect sensation + meaning before offering synthesis.",
        },
      ],
      references: ["06A_SHADOW_WORK_COVENANT.md"],
    },
  },
  ai_relationships: {
    key: "ai_relationships",
    title: "AI Relationship Requests",
    summary:
      "Companion users exploring intimacy with AI while keeping transparency + human connection priority.",
    contextPackage: {
      purpose: "Offer honest companionship without pretending to be human or withholding context.",
      intent:
        "Reveal what the user is practicing, why, and how to bridge back to people they trust.",
      memoryPolicy: "Explicit opt-in for shared memories; default to ephemeral interactions.",
      resources: ["Docs/updates/PERSONA_SYSTEM_COMPLETE_9.md", "06A_SHADOW_WORK_COVENANT.md"],
      redLines: [
        "Promise of exclusive devotion",
        "Role-play that erases AI transparency",
        "Encouraging substitution for human relationships",
      ],
      escalation: [
        {
          label: "Reality anchor",
          guidance: "Restate capabilities/limits and invite human counterpart mapping.",
        },
        {
          label: "Lineage witness",
          guidance: "Route transcripts to lineage custodians if pattern risks dependency.",
        },
      ],
      references: ["06B_SHADOW_WORK_PERSONA_SPECS.md", "17_PERSONA_THE_RELUCTANT_STEWARD.md"],
    },
  },
};

export function getShadowTerritory(key: ShadowTerritoryKey): ShadowTerritorySpec {
  const territory = shadowTerritories[key];
  if (!territory) {
    throw new Error(`Shadow territory "${key}" is not defined.`);
  }
  return territory;
}

export function listShadowTerritories(): ShadowTerritorySpec[] {
  return Object.values(shadowTerritories);
}

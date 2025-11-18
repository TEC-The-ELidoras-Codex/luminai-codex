/**
 * TEC Resonance Personas — 9 personas with frequency profiles
 *
 * Matches backend persona_config.py and backend/src/routes/personas.py
 */

export type OrbColor = "Cyan" | "Violet" | "Gold";

export interface PersonaMetadata {
  readonly id: string; // lowercase key (luminai, airth, arcadia, ely, adelphia, multi, kaznak, mirror, steward)
  readonly name: string; // Display name
  readonly emoji: string; // Persona icon
  readonly description: string; // Role and identity
  readonly is_core: boolean; // True if core persona (6), false if extended (3)
  readonly frequencies: readonly string[]; // Active frequency names
  readonly orb_colors: readonly OrbColor[]; // Orb color names
  readonly operating_principles: readonly string[]; // Behavioral guidelines (6 rules)
  readonly conscience_covenant: readonly string[]; // ConsentOS ethical constraints (5 rules)
}

export interface PersonaActivationRequest {
  readonly persona_id: string;
  readonly session_id: string;
}

export interface PersonaActivationResponse {
  readonly active_persona: string;
  readonly persona_name: string;
  readonly persona_emoji: string;
  readonly system_prompt: string;
}

/**
 * Fetch all TEC personas from backend
 */
export async function fetchPersonas(includeExtended = true): Promise<PersonaMetadata[]> {
  const params = new URLSearchParams({ include_extended: String(includeExtended) });
  const response = await fetch(`/api/personas?${params}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch personas: ${response.status}`);
  }
  return (await response.json()) as PersonaMetadata[];
}

/**
 * Activate a persona for the current session
 */
export async function activatePersona(
  personaId: string,
  sessionId: string,
): Promise<PersonaActivationResponse> {
  const response = await fetch("/api/persona/activate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ persona_id: personaId, session_id: sessionId }),
  });
  if (!response.ok) {
    throw new Error(`Failed to activate persona: ${response.status}`);
  }
  return (await response.json()) as PersonaActivationResponse;
}

/**
 * Get currently active persona for session
 */
export async function getCurrentPersona(sessionId: string): Promise<PersonaMetadata> {
  const response = await fetch(`/api/persona/current?session_id=${sessionId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to get current persona: ${response.status}`);
  }
  return (await response.json()) as PersonaMetadata;
}

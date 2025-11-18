"""
Persona routing endpoints — TEC Resonance Personas API

Provides access to the 9 TEC personas (6 core + 3 extended) with
frequency profiles, orb colors, and conscience covenants.

Routes:
- GET /api/personas — List all personas with metadata
- POST /api/persona/activate — Activate persona for session
- GET /api/persona/current — Get current active persona
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from src.tec_tgcr.agents.persona_config import (
    ALL_PERSONAS,
    PERSONAS,
    PERSONAS_EXTENDED,
    get_persona,
    list_core_personas,
    list_extended_personas,
    PersonaConfig,
    Frequency,
    OrbColor,
)

router = APIRouter(prefix="/api", tags=["personas"])

# In-memory session store (replace with Redis/database in production)
_active_personas: dict[str, str] = {}


class PersonaMetadata(BaseModel):
    """Persona metadata for API responses"""

    id: str = Field(..., description="Persona identifier (lowercase key)")
    name: str = Field(..., description="Display name")
    emoji: str = Field(..., description="Persona emoji icon")
    description: str = Field(..., description="Role and identity")
    is_core: bool = Field(..., description="True if core persona, False if extended")
    frequencies: list[str] = Field(..., description="Active frequency names")
    orb_colors: list[str] = Field(..., description="Orb color names (Cyan/Violet/Gold)")
    operating_principles: list[str] = Field(..., description="Behavioral guidelines")
    conscience_covenant: list[str] = Field(
        ..., description="ConsentOS ethical constraints"
    )


class PersonaActivationRequest(BaseModel):
    """Request to activate a persona for a session"""

    persona_id: str = Field(..., description="Persona identifier to activate")
    session_id: str = Field(..., description="Session identifier")


class PersonaActivationResponse(BaseModel):
    """Response after persona activation"""

    active_persona: str = Field(..., description="Activated persona ID")
    persona_name: str = Field(..., description="Persona display name")
    persona_emoji: str = Field(..., description="Persona emoji")
    system_prompt: str = Field(..., description="System prompt for LLM context")


def _build_persona_metadata(persona_id: str, persona: PersonaConfig) -> PersonaMetadata:
    """Convert PersonaConfig to PersonaMetadata for API response"""
    is_core = persona_id in PERSONAS
    frequencies = [
        f.value[1] for f in persona.frequency_profile.get_active_frequencies()
    ]
    orb_colors = [color.value[1] for color in persona.orb_colors]

    return PersonaMetadata(
        id=persona_id,
        name=persona.name,
        emoji=persona.emoji,
        description=persona.description,
        is_core=is_core,
        frequencies=frequencies,
        orb_colors=orb_colors,
        operating_principles=persona.operating_principles,
        conscience_covenant=persona.conscience_covenant,
    )


def _build_system_prompt(persona: PersonaConfig) -> str:
    """Generate system prompt for LLM context from persona config"""
    frequencies = [
        f.value[1] for f in persona.frequency_profile.get_active_frequencies()
    ]
    orb_colors = [color.value[1] for color in persona.orb_colors]

    prompt = f"""You are embodying {persona.emoji} {persona.name.upper()}.

IDENTITY: {persona.description}

ACTIVE FREQUENCIES: {', '.join(frequencies)}
ORB COLORS: {', '.join(orb_colors)}

OPERATING PRINCIPLES:
{chr(10).join(f"• {principle}" for principle in persona.operating_principles)}

CONSCIENCE COVENANT (ConsentOS Framework):
{chr(10).join(f"• {rule}" for rule in persona.conscience_covenant)}

Respond with this persona's voice, frequencies, and ethical constraints. Honor the covenant always."""

    return prompt


@router.get("/personas", response_model=list[PersonaMetadata])
async def list_personas(include_extended: bool = True) -> list[PersonaMetadata]:
    """
    List all TEC Resonance Personas with metadata.

    Args:
        include_extended: If True, include extended personas (Kaznak, Mirror, Steward).
                         If False, return only core 6 personas.

    Returns:
        List of persona metadata objects with frequencies, orb colors, and principles.
    """
    personas_to_return = []

    # Always include core personas
    for persona_id in list_core_personas():
        persona = PERSONAS[persona_id]
        personas_to_return.append(_build_persona_metadata(persona_id, persona))

    # Conditionally include extended personas
    if include_extended:
        for persona_id in list_extended_personas():
            persona = PERSONAS_EXTENDED[persona_id]
            personas_to_return.append(_build_persona_metadata(persona_id, persona))

    return personas_to_return


@router.post("/persona/activate", response_model=PersonaActivationResponse)
async def activate_persona(
    request: PersonaActivationRequest,
) -> PersonaActivationResponse:
    """
    Activate a persona for a specific session.

    Args:
        request: Activation request with persona_id and session_id

    Returns:
        Activation response with persona metadata and system prompt

    Raises:
        HTTPException 404 if persona_id not found
    """
    persona = get_persona(request.persona_id)
    if not persona:
        available = list(ALL_PERSONAS.keys())
        raise HTTPException(
            status_code=404,
            detail=f"Persona '{request.persona_id}' not found. Available: {available}",
        )

    # Store active persona for session (in-memory for now)
    _active_personas[request.session_id] = request.persona_id

    # Build system prompt for LLM context
    system_prompt = _build_system_prompt(persona)

    return PersonaActivationResponse(
        active_persona=request.persona_id,
        persona_name=persona.name,
        persona_emoji=persona.emoji,
        system_prompt=system_prompt,
    )


@router.get("/persona/current")
async def get_current_persona(session_id: str) -> PersonaMetadata:
    """
    Get the currently active persona for a session.

    Args:
        session_id: Session identifier

    Returns:
        Metadata for the active persona

    Raises:
        HTTPException 404 if no persona active for session
    """
    active_persona_id = _active_personas.get(session_id)
    if not active_persona_id:
        raise HTTPException(
            status_code=404,
            detail=f"No active persona for session '{session_id}'. Call POST /api/persona/activate first.",
        )

    persona = get_persona(active_persona_id)
    if not persona:
        # Shouldn't happen, but handle gracefully
        raise HTTPException(
            status_code=500,
            detail=f"Active persona '{active_persona_id}' is no longer available.",
        )

    return _build_persona_metadata(active_persona_id, persona)

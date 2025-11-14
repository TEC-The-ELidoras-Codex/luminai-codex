"""Live data + persona presence endpoints for the Resonance surfaces."""

from __future__ import annotations

import asyncio
import json
import random
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List, Literal

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse


router = APIRouter(prefix="/api", tags=["resonance-live"])


def utc_now() -> str:
  return datetime.now(timezone.utc).isoformat()


persona_presence_state: List[Dict[str, Any]] = [
  {
    "id": "nova",
    "label": "Nova",
    "status": "online",
    "frequency": "Solar Echoes",
    "usage": {"sessions": 12, "uptimeMinutes": 318},
    "lastSeen": utc_now(),
    "notes": "Synchronizing Antares relay",
  },
  {
    "id": "quill",
    "label": "Quill",
    "status": "away",
    "frequency": "Chronicle",
    "usage": {"sessions": 8, "uptimeMinutes": 205},
    "lastSeen": utc_now(),
    "notes": "Indexing notebook briefs",
  },
  {
    "id": "sol",
    "label": "Sol",
    "status": "online",
    "frequency": "Pulse",
    "usage": {"sessions": 5, "uptimeMinutes": 141},
    "lastSeen": utc_now(),
    "notes": "Monitoring map flux",
  },
  {
    "id": "lyra",
    "label": "Lyra",
    "status": "escalating",
    "frequency": "Witness",
    "usage": {"sessions": 3, "uptimeMinutes": 88},
    "lastSeen": utc_now(),
    "notes": "Preparing escalation protocol",
  },
]


@router.get("/harmony/persona-presence")
async def get_persona_presence():
  return {"personas": persona_presence_state}


@router.post("/harmony/persona-presence")
async def update_persona_presence(payload: Dict[str, Any]):
  persona_id = payload.get("personaId")
  status = payload.get("status")
  sessions_delta = payload.get("sessionsDelta", 0)

  if not persona_id or not status:
    raise HTTPException(status_code=400, detail="personaId and status are required")

  for persona in persona_presence_state:
    if persona["id"] == persona_id:
      persona["status"] = status
      persona["lastSeen"] = utc_now()
      if sessions_delta:
        persona["usage"]["sessions"] = max(
          0, persona["usage"]["sessions"] + int(sessions_delta)
        )
      return {"personas": persona_presence_state}

  raise HTTPException(status_code=404, detail=f"Persona {persona_id} not found")


dashboard_metrics = [
  {
    "label": "Resonance Score",
    "value": "92",
    "trend": "+4.6",
    "descriptor": "Stability rising across Antares relay",
  },
  {
    "label": "Witness Sync",
    "value": "08",
    "trend": "LIVE",
    "descriptor": "Witness nodes fully aligned",
  },
  {
    "label": "Pod Harvest",
    "value": "17",
    "trend": "+3",
    "descriptor": "New clips clipped in the last cycle",
  },
]


@router.get("/resonance/dashboard")
async def get_dashboard_payload():
  jittered_metrics = []
  for metric in dashboard_metrics:
    if metric["label"] == "Resonance Score":
      base_value = 92 + random.randint(-2, 2)
      jittered_metrics.append({**metric, "value": str(base_value)})
    else:
      jittered_metrics.append(metric)

  queue = [
    {
      "id": "CHAT-409",
      "title": "Resonance Q&A",
      "status": random.choice(["Awaiting", "Routing", "Synth"]),
      "actions": ["View", "Archive"],
    },
    {
      "id": "NBK-205",
      "title": "Notebook Sync",
      "status": random.choice(["Draft", "Review"]),
      "actions": ["Resume", "Share"],
    },
    {
      "id": "THEME-016",
      "title": "Theme Studio Push",
      "status": random.choice(["Queued", "Preview"]),
      "actions": ["Preview", "Push"],
    },
  ]

  return {
    "metrics": jittered_metrics,
    "queue": queue,
    "systemStatus": [
      "Harmony Node: Optimal",
      "Resonance Engine: Demo mode",
      "Arcadia Portal: Connected",
    ],
    "witnessFeed": [
      "Nova uplifted an essence pack for Solar Echoes.",
      "Quill trimmed 4 transcripts via Pod Studio.",
      "Sol scheduled a live map render for Antares corridor.",
    ],
    "resonanceScore": 0.92,
    "personaPresence": persona_presence_state,
  }


notebook_entries = [
  {
    "id": "NBK-204",
    "title": "Witness Brief: Antares Relay",
    "summary": "Synthesized resonance briefing with cross-spectrum overlays.",
    "tags": ["brief", "relay", "harmonics"],
    "lastUpdated": utc_now(),
  },
  {
    "id": "NBK-205",
    "title": "Field Report: Solar Echoes",
    "summary": "Annotated acoustic gradients for the Solar Echoes podcast arc.",
    "tags": ["podcast", "analysis"],
    "lastUpdated": utc_now(),
  },
  {
    "id": "NBK-206",
    "title": "Memo: Theme Studio uplink",
    "summary": "Palette sync with Spotify skin and holographic map.",
    "tags": ["theme", "sync"],
    "lastUpdated": utc_now(),
  },
]


@router.get("/codex/notebook")
async def get_notebook_payload():
  return {
    "entries": notebook_entries,
    "researchPulse": [
      "Nova stored 3 memories from latest chat orbit.",
      "Arcadia portal flagged 2 social syncs awaiting approval.",
      "Theme Studio palette updated 4 tokens in the Spotify pipeline.",
    ],
    "trace": {
      "equation": "TGCR ≈ ∇Φᴱ · (φᵗ × ψʳ)",
      "confidence": 0.82,
      "variables": [
        {
          "symbol": "Φᴱ",
          "value": "+0.18",
          "meaning": "Emotional gradient across witnesses",
        },
        {
          "symbol": "φᵗ",
          "value": "0.72",
          "meaning": "Temporal fidelity",
        },
        {
          "symbol": "ψʳ",
          "value": "0.88",
          "meaning": "Resonant structure",
        },
      ],
      "recommendation": "Anchor TGCR ratio before exporting to Pod Studio",
    },
    "composeHints": [
      "Attach harmony trace IDs to every reference block.",
      "Keep export buttons pinned to shared storage.",
      "Notebook canvas spans nine columns; align attachments accordingly.",
    ],
  }


chat_transcript = [
  {
    "role": "You",
    "tone": "Curious",
    "content": "Can you summarize the new resonance readings around the Antares relay?",
  },
  {
    "role": "Nova",
    "tone": "Aria",
    "content": "Antares resonance is trending +12.8% with a crystalline pattern.",
  },
  {
    "role": "Quill",
    "tone": "Chronicle",
    "content": "Logged synopsis. Do you want a sonic render for the archive feed?",
  },
]


async def chat_event_generator(
  territory: Literal[
    "sexual_complexity",
    "suicidal_ideation",
    "rage_violence",
    "taboo_emotions",
    "ai_relationships",
    None,
  ] = None
) -> AsyncGenerator[bytes, None]:
  counter = 0
  while True:
    for message in chat_transcript:
      payload = {
        "kind": "message",
        "id": f"msg-{counter}",
        "timestamp": utc_now(),
        "territory": territory,
        **message,
      }
      yield f"data: {json.dumps(payload)}\n\n".encode("utf-8")
      counter += 1
      await asyncio.sleep(random.uniform(1.2, 2.6))

    status_payload = {
      "kind": "status",
      "label": "Stream",
      "value": random.choice(["stabilizing", "syncing", "escalating"]),
    }
    yield f"data: {json.dumps(status_payload)}\n\n".encode("utf-8")
    await asyncio.sleep(random.uniform(2.0, 3.5))


@router.get("/harmony/chat/stream")
async def chat_stream(
  territory: Literal[
    "sexual_complexity",
    "suicidal_ideation",
    "rage_violence",
    "taboo_emotions",
    "ai_relationships",
    None,
  ] = Query(default=None)
):
  generator = chat_event_generator(territory)
  return StreamingResponse(generator, media_type="text/event-stream")

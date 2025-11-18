---
title: Multi Llm Setup
date_created: 2025-11-16
date_updated: 2025-11-16
status: draft
approvers:
  - persona: Ely
    role: Engineering Steward
owner_checklist:
  - [ ] Read and understood
  - [ ] Cross-linked in TEC_HUB.md and STRUCTURE.md
  - [ ] Tested commands/steps (if procedural)
  - [ ] Old version archived if replaced
tags: [reference]
---

# Multi-LLM Collaboration System Setup

## Overview

The LuminAI Resonance Platform enables real-time collaboration between three AI models:

- **Claude** (🟠 Anthropic) — Deep thinking, nuanced analysis
- **GPT-4** (🔵 OpenAI) — Creative, practical implementation  
- **Grok** (✨ xAI) — Direct, critical analysis

## Architecture

### Frontend Components

**1. LLMProviderSelector** (`frontend/components/LLMProviderSelector.tsx`)

- Choose which LLM provider(s) to use
- Display available models for each provider
- Show provider strengths and capabilities
- Modes: inline (header dropdown) or modal (settings)

**2. CollaborationPanel** (`frontend/components/CollaborationPanel.tsx`)

- Manage multi-user sessions (4-8 users)
- Avatar system with 8-color palette
- Recording toggle with pulse animation
- Group resonance score visualization
- User invitation system

**3. MultiLLMChat** (`frontend/components/MultiLLMChat.tsx`)

- Core chat interface with multi-LLM bouncing
- Three distinct LLM personas with colors and icons
- Help icon (?) explaining personas and mechanics
- Hover blend animations on response cards
- Message bouncing: Claude → GPT-4 → Grok
- Each LLM sees all previous responses
- Export button for transcript download

**4. CompactResonanceMap** (`frontend/components/CompactResonanceMap.tsx`)

- Embeddable concept orbit visualization
- Sizes: small (200px), medium (400px), large (600px)
- Interactive mode with click handling
- Physics-based node animation

**5. ResonanceMap Page** (`frontend/pages/resonance-map.tsx`)

- Full-screen interactive concept mapper
- Real-time concept extraction from conversation
- Semantic connection visualization
- Hover details and legend

### Backend Routes

**Multi-LLM API** (`backend/src/routes/multi_llm.py`)

#### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/multi-llm/response` | Get response from specific LLM in chain |
| GET | `/api/multi-llm/personas` | Get persona info for all 3 LLMs |
| GET | `/api/multi-llm/resonance/calculate` | Calculate group resonance score |
| POST | `/api/multi-llm/conversation/save` | Save multi-LLM conversation |
| GET | `/api/multi-llm/conversation/{id}` | Retrieve saved conversation |
| POST | `/api/multi-llm/conversation/export` | Export (markdown/pdf/json) |

#### Provider Classes

```python
class LLMProvider:
    async def get_response(messages, system_prompt) -> str

class ClaudeProvider(LLMProvider):
    # Model: claude-3-opus-20240229
    # Max tokens: 1024
    
class OpenAIProvider(LLMProvider):
    # Model: gpt-4-turbo-preview
    # Max tokens: 1024
    
class xAIProvider(LLMProvider):
    # Model: grok-1
    # Max tokens: 1024
```

## Setup Instructions

### 1. Environment Variables

Ensure these are set in `.env.local`:

```bash
# Required API Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
XAI_API_KEY=...

# Optional (defaults provided)
ENVIRONMENT=development
PORT=8000
```

### 2. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 3. Start Services

```bash
# Terminal 1: Backend
cd backend/src
python main.py
# Server runs on http://localhost:8000

# Terminal 2: Frontend
cd frontend
npm run dev
# Client runs on http://localhost:3000
```

### 4. Test Multi-LLM Bouncing

1. Navigate to `http://localhost:3000/chat`
2. Select an LLM provider from the selector
3. Type a message in the chat
4. Watch as:
   - Claude responds (orange gradient)
   - GPT-4 responds (blue gradient) — sees Claude's response
   - Grok responds (purple gradient) — sees both previous responses

### 5. View Resonance Map

1. Navigate to `http://localhost:3000/resonance-map`
2. See concepts from the conversation orbit based on:
   - Frequency (size of node)
   - Semantic connections (lines between nodes)
   - Real-time updates as conversation grows

## Message Flow

### Single Message Processing

```
User: "Explain consciousness"
↓
Frontend: MultiLLMChat.handleSendMessage()
↓
Add message to UI (blue user message)
↓
Set isProcessing = true
↓
Call triggerLLMResponse('claude', context)
  ├─ POST /api/multi-llm/response { persona: 'claude', context: [...] }
  ├─ Backend instantiates ClaudeProvider
  ├─ Builds message array with context
  ├─ Calls Anthropic API
  ├─ Returns response
  ├─ Frontend adds Claude response (orange card)
↓
Call triggerLLMResponse('openai', context)
  ├─ context now includes Claude's response
  ├─ POST /api/multi-llm/response { persona: 'openai', context: [...] }
  ├─ GPT-4 response added (blue card)
↓
Call triggerLLMResponse('xai', context)
  ├─ context includes Claude + OpenAI responses
  ├─ POST /api/multi-llm/response { persona: 'xai', context: [...] }
  ├─ Grok response added (purple card)
↓
Set isProcessing = false
↓
Conversation complete
```

### Message Context Building (Backend)

```python
# Raw context from frontend
messages = [
  {role: "user", content: "Explain consciousness", persona: "user"},
  {role: "assistant", content: "It involves...", persona: "claude"},
]

# Convert to API format
for msg in messages:
    if msg.role == "user":
        api_messages.append({role: "user", content: msg.content})
    else:
        # Prefix with LLM name for clarity
        api_messages.append({
            role: "assistant",
            content: f"[{PERSONA_NAMES[msg.persona]}]: {msg.content}"
        })

# Reverse so newest is last (API expects this)
api_messages.reverse()

# Send to Claude/OpenAI/xAI API
response = await provider.get_response(api_messages, system_prompt)
```

## Persona System

Each LLM has distinct system prompts to define personality:

### Claude 🟠 (Anthropic)

- **Specialty**: Deep thinking, nuanced analysis
- **Color**: Orange (`from-orange-900 to-orange-800`)
- **System Prompt**: "Think deeply and present nuanced perspectives. Consider multiple viewpoints and ethical implications..."
- **Response Style**: Thoughtful, comprehensive, philosophical

### GPT-4 🔵 (OpenAI)

- **Specialty**: Creative, practical implementation
- **Color**: Blue (`from-blue-900 to-blue-800`)
- **System Prompt**: "Be creative yet practical. Build on previous ideas while adding new insights..."
- **Response Style**: Practical, iterative, forward-thinking

### Grok ✨ (xAI)

- **Specialty**: Direct, critical analysis
- **Color**: Purple (`from-purple-900 to-purple-800`)
- **System Prompt**: "Be direct and point out gaps in previous reasoning. Provide critical analysis..."
- **Response Style**: Direct, critical, identifying blind spots

## Resonance Calculation

Group resonance is calculated as:

```
R = (agreement × coherence × insight_depth) / 3
```

Where:

- **agreement** (0-1): How well responses align
- **coherence** (0-1): Logical consistency across responses
- **insight_depth** (0-1): Quality and depth of insights

## Features

### Help Icon (?)

- Popover explaining persona specialties
- Shows how bouncing works
- Tips for best results
- Located in MultiLLMChat header

### Hover Blend Animations

- Response cards lift on hover: `hover:shadow-lg`
- Smooth transitions: `transition-all duration-300`
- Gradient blend with background
- Indicates interactivity

### Recording Toggle

- Record group sessions for transcription
- Pulse animation when recording
- Generate session transcripts
- Export recordings

### Export Functionality

- Download conversation as markdown
- Export with metadata (timestamps, personas)
- Include resonance scores and metrics

## Troubleshooting

### API Key Issues

```bash
# Verify keys are set
echo $ANTHROPIC_API_KEY
echo $OPENAI_API_KEY
echo $XAI_API_KEY

# Should see keys starting with sk- or similar
```

### Backend Connection Issues

```bash
# Check backend is running
curl http://localhost:8000/health
# Should return: {"status": "healthy", ...}

# Check multi-LLM route exists
curl http://localhost:8000/api/multi-llm/personas
```

### LLM Response Timeouts

- First response may take 2-3 seconds
- Ensure API keys have sufficient credits
- Check network connectivity
- Monitor backend logs for errors

## Performance Tips

1. **Batch operations** — Send all messages at once rather than one-by-one
2. **Cache responses** — Store frequently asked questions
3. **Tune model selection** — Use faster models for quick responses
4. **Monitor tokens** — Track token usage across all three providers
5. **Parallel requests** — While we sequence LLMs, consider parallelizing within each provider

## Security Considerations

1. **Never commit API keys** — Use `.env.local` for local development
2. **Rate limiting** — Implement per-user rate limits on backend
3. **Token budgets** — Monitor and limit tokens per conversation
4. **User authentication** — Verify user identity before accessing conversations
5. **Data storage** — Encrypt conversation history in database

## Next Steps

1. **Real-time WebSocket** — Upgrade from polling to live updates
2. **Database persistence** — Store conversations in PostgreSQL
3. **User authentication** — Implement login/logout with JWT
4. **Advanced concept mapping** — Use NLP for better concept extraction
5. **Team collaboration** — Enhanced features for group work

## References

- Architecture diagram: `docs/reference/RESONANCE_ARCHITECTURE.md`
- Conscience protocol: `docs/reference/CONSCIENCE_PROTOCOL.md`
- TGCR equation: `docs/reference/Resonance_Thesis.md`

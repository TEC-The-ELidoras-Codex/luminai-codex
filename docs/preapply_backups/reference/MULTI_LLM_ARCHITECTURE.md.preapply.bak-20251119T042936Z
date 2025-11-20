---
title: Multi Llm Architecture
date_created: '2025-11-18'
date_updated: '2025-11-18'
status: draft
approvers:
- persona: Ely
  role: Engineering Steward
owner_checklist:
- '[ ] Read and understood'
- '[ ] Cross-linked in TEC_HUB.md and STRUCTURE.md'
- '[ ] Tested commands/steps (if procedural)'
- '[ ] Old version archived if replaced'
tags:
- reference
related_docs: []
---
# Multi-LLM Collaboration System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     LUMINAI RESONANCE PLATFORM                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  FRONTEND (React 18 + TS)               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌─────────────┐  ┌──────────────────┐  ┌────────────┐  │   │
│  │  │  LLM Sel    │  │  Collaboration   │  │ Resonance  │  │   │
│  │  │  Provider   │  │  Panel           │  │ Map        │  │   │
│  │  │             │  │                  │  │            │  │   │
│  │  │ • OpenAI    │  │ • Users (4-8)    │  │ • Concepts │  │   │
│  │  │ • Anthropic │  │ • Recording      │  │ • Orbits   │  │   │
│  │  │ • xAI       │  │ • Resonance ☐   │  │ • Physics  │  │   │
│  │  └─────────────┘  └──────────────────┘  └────────────┘  │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │           MultiLLMChat Component                   │  │   │
│  │  │  ─────────────────────────────────────────────     │  │   │
│  │  │                                                    │  │   │
│  │  │  User: "Explain consciousness"                    │  │   │
│  │  │  └─ [user message - blue]                         │  │   │
│  │  │                                                    │  │   │
│  │  │  Claude 🟠: "It involves..." (⚙️ thinking)        │  │   │
│  │  │  └─ [Claude response - orange gradient]           │  │   │
│  │  │                                                    │  │   │
│  │  │  GPT-4 🔵: "Building on Claude..." (⚙️ thinking)  │  │   │
│  │  │  └─ [GPT-4 response - blue gradient]              │  │   │
│  │  │                                                    │  │   │
│  │  │  Grok ✨: "However, both missed..." (⚙️ thinking) │  │   │
│  │  │  └─ [Grok response - purple gradient]             │  │   │
│  │  │                                                    │  │   │
│  │  │  [?] Help  [↓] Export  [💾] Save                  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│                    HTTP/REST API Calls                          │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  BACKEND (FastAPI + Python)              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  /api/multi-llm/response                         │   │   │
│  │  │  POST {persona, context, systemPrompt}           │   │   │
│  │  │  ─────────────────────────────────────────       │   │   │
│  │  │                                                  │   │   │
│  │  │  1. Get API key from environment                │   │   │
│  │  │  2. Format message context                      │   │   │
│  │  │  3. Instantiate provider                        │   │   │
│  │  │  4. Call LLM API                                │   │   │
│  │  │  5. Return response                             │   │   │
│  │  │                                                  │   │   │
│  │  │  return {response, model, tokensUsed}           │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────┐                │   │
│  │  │ Claude   │  │ GPT-4    │  │ Grok   │                │   │
│  │  │ Provider │  │ Provider │  │Provide │                │   │
│  │  │          │  │          │  │        │                │   │
│  │  │Anthropic │  │ OpenAI   │  │  xAI   │                │   │
│  │  │Claude-3  │  │GPT-4     │  │Grok-1  │                │   │
│  │  │Opus      │  │Turbo     │  │        │                │   │
│  │  └──────────┘  └──────────┘  └────────┘                │   │
│  │        ↓              ↓             ↓                   │   │
│  │     (API Call)    (API Call)    (API Call)             │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│         ↓              ↓              ↓                         │
│    (HTTPS)         (HTTPS)        (HTTPS)                      │
│         ↓              ↓              ↓                         │
│  ┌──────────────┐ ┌─────────┐ ┌──────────────────┐            │
│  │ Anthropic    │ │ OpenAI  │ │ xAI              │            │
│  │ API          │ │ API     │ │ API              │            │
│  │              │ │         │ │                  │            │
│  │claude-3-opus │ │gpt-4    │ │grok-1            │            │
│  └──────────────┘ └─────────┘ └──────────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Message Flow Sequence

### Single Turn: User → 3 LLMs → Responses

```
┌─────────────────────────────────────────────────────────┐
│                    User Sends Message                    │
│                  "Explain consciousness"                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │ MultiLLMChat.handleSendMessage()   │
         │  • Add message to UI (blue)        │
         │  • Set isProcessing = true         │
         └────────────────┬───────────────────┘
                          │
                ┌─────────┼─────────┐
                │         │         │
                ▼         │         │
         ┌──────────────┐ │         │
         │  Claude 🟠   │ │         │
         │   (Step 1)   │ │         │
         │              │ │         │
         │ POST /api/   │ │         │
         │ multi-llm/   │ │         │
         │ response     │ │         │
         │ {persona:    │ │         │
         │  'claude',   │ │         │
         │  context: [  │ │         │
         │    {user msg}│ │         │
         │  ]}          │ │         │
         │              │ │         │
         │ ↓ Response   │ │         │
         │ "It involves │ │         │
         │  awareness"  │ │         │
         │              │ │         │
         │ Add to UI    │ │         │
         │ (orange)     │ │         │
         └──────────────┘ │         │
                          │         │
                          ▼         │
                 ┌──────────────────┤
                 │  GPT-4 🔵        │
                 │  (Step 2)        │
                 │                  │
                 │ POST /api/       │
                 │ multi-llm/       │
                 │ response         │
                 │ {persona:        │
                 │  'openai',       │
                 │  context: [      │
                 │   {user msg},    │
                 │   [Claude]:      │
                 │    "response"    │
                 │  ]}              │
                 │                  │
                 │ ↓ Response       │
                 │ "Building on     │
                 │  Claude..."      │
                 │                  │
                 │ Add to UI        │
                 │ (blue)           │
                 └──────────────────┤
                                    │
                                    ▼
                         ┌──────────────────┐
                         │  Grok ✨         │
                         │  (Step 3)        │
                         │                  │
                         │ POST /api/       │
                         │ multi-llm/       │
                         │ response         │
                         │ {persona:        │
                         │  'xai',          │
                         │  context: [      │
                         │   {user msg},    │
                         │   [Claude]:      │
                         │    "response",   │
                         │   [GPT-4]:       │
                         │    "response"    │
                         │  ]}              │
                         │                  │
                         │ ↓ Response       │
                         │ "However,        │
                         │  both missed..." │
                         │                  │
                         │ Add to UI        │
                         │ (purple)         │
                         │                  │
                         │ Set processing   │
                         │ = false          │
                         └──────────────────┘
```

## Component Hierarchy

```
ChatPage (Layout)
│
├── Header
│   ├── Title: "LuminAI Resonance"
│   └── LLMProviderSelector (inline mode)
│
├── Left Sidebar (col-span-1)
│   ├── CollaborationPanel
│   │   ├── Session Info
│   │   ├── User Avatars
│   │   ├── Recording Toggle
│   │   ├── Resonance Score
│   │   └── Invite Controls
│   │
│   ├── CompactResonanceMap
│   │   ├── Canvas (orbiting concepts)
│   │   ├── Interaction Handlers
│   │   └── Legend
│   │
│   └── Quick Stats
│       ├── Concept Count
│       ├── Connection Count
│       └── Message Count
│
└── Main Content (col-span-3)
    └── MultiLLMChat
        ├── Header
        │   ├── Help Icon (?)
        │   └── Menu [Export, etc.]
        │
        ├── Messages Container
        │   ├── User Message (blue gradient)
        │   ├── Claude 🟠 Message (orange gradient)
        │   │   └── Thinking Animation
        │   ├── GPT-4 🔵 Message (blue gradient)
        │   │   └── Thinking Animation
        │   └── Grok ✨ Message (purple gradient)
        │       └── Thinking Animation
        │
        ├── Input Area
        │   ├── Text Input
        │   ├── Send Button
        │   └── Upload Button (optional)
        │
        └── Footer
            └── Status: "Ready" | "Processing..."
```

## State Management

### Frontend Component State

```typescript
// Chat Page Level
{
  selectedLLM: 'openai' | 'anthropic' | 'xai' | null
  selectedModel: 'gpt-4-turbo' | 'claude-3-opus' | 'grok-1' | null
  conversationId: string
  concepts: Concept[]  // From resonance map
  connections: Resonance[]  // Concept connections
}

// MultiLLMChat Component
{
  messages: Message[]  // All messages in conversation
  isProcessing: boolean  // Currently fetching LLM responses
  hoveredNode: string | null  // For resonance map hover
}

// CollaborationPanel Component
{
  currentUsers: CollaborativeUser[]
  isRecording: boolean
  resonanceScore: number
  showInviteForm: boolean
}

// CompactResonanceMap Component
{
  selectedConcept: string | null
  animating: boolean
}
```

## API Contract

### POST /api/multi-llm/response

**Request:**

```json
{
  "persona": "claude" | "openai" | "xai",
  "conversationId": "string",
  "context": [
    {
      "role": "user" | "assistant",
      "content": "string",
      "persona": "claude" | "openai" | "xai" | "user"
    }
  ],
  "systemPrompt": "string"
}
```

**Response:**

```json
{
  "response": "string",
  "persona": "claude" | "openai" | "xai",
  "model": "claude-3-opus" | "gpt-4-turbo-preview" | "grok-1",
  "tokensUsed": 42
}
```

### GET /api/multi-llm/personas

**Response:**

```json
{
  "claude": {
    "name": "Claude",
    "icon": "🟠",
    "models": ["claude-3-opus", "claude-3-sonnet"],
    "strengths": ["reasoning", "nuance", "ethics"],
    "color": "orange",
    "specialty": "Deep thinking"
  },
  "openai": {
    "name": "GPT-4",
    "icon": "🔵",
    "models": ["gpt-4-turbo-preview", "gpt-4"],
    "strengths": ["creativity", "practicality"],
    "color": "blue",
    "specialty": "Creative implementation"
  },
  "xai": {
    "name": "Grok",
    "icon": "✨",
    "models": ["grok-1"],
    "strengths": ["directness", "critique"],
    "color": "purple",
    "specialty": "Critical analysis"
  }
}
```

## Data Flow

### Message Processing Pipeline

1. **User Input** → Text in MultiLLMChat input
2. **Send Trigger** → `handleSendMessage()` called
3. **UI Update** → User message added (blue card)
4. **Processing** → `isProcessing = true`, show spinner
5. **API Call #1** → Claude persona, full context
6. **Response 1** → Claude response received, added to UI
7. **API Call #2** → OpenAI persona, context + Claude response
8. **Response 2** → GPT-4 response received, added to UI
9. **API Call #3** → xAI persona, context + both previous responses
10. **Response 3** → Grok response received, added to UI
11. **Cleanup** → `isProcessing = false`, disable spinner
12. **Resonance** → Update concept map, recalculate score

### Concept Extraction

```
Message Text
    ↓
[NLP Processing]
    ↓
Extract Keywords (length > 4)
    ↓
Group by Frequency
    ↓
Calculate Connections
    ↓
Update CompactResonanceMap
    ↓
Animate Orbiting Nodes
```

## Resonance Calculation

```
For each LLM response:
  - Parse sentiment/confidence
  - Calculate coherence with previous responses
  - Extract key insights

Group Score = (Σ individual scores) / 3

Components:
  - agreement (0-1): How well responses align
  - coherence (0-1): Logical consistency
  - insight_depth (0-1): Quality of analysis

R = (agreement × coherence × insight_depth) / 3
```

## Error Handling

### Missing API Keys

- Backend checks `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `XAI_API_KEY`
- Returns demo response if key missing
- Logs warning but continues

### API Rate Limits

- Implement exponential backoff
- Queue requests if rate limited
- Show user "API limit reached" message

### Network Timeouts

- Default timeout: 30 seconds
- Show "Still thinking..." after 10 seconds
- Allow cancel operation
- Retry with exponential backoff

### Invalid Requests

- Validate schema on backend
- Return 400 Bad Request
- Log issue for debugging

## Performance Considerations

1. **Sequential Processing** (Current)
   - Claude responds first (1-3s)
   - GPT-4 responds second (1-3s)
   - Grok responds third (1-3s)
   - Total: ~3-9 seconds per turn

2. **Optimization Opportunities**
   - Parallelize Claude + GPT-4 (they only use user message)
   - Use cheaper models for context building
   - Implement response caching
   - Batch similar requests

3. **Token Management**
   - Track tokens per provider
   - Warn if approaching budget
   - Suggest model downgrade if needed

## Security Considerations

1. **API Keys**
   - Never log keys
   - Use environment variables
   - Rotate regularly

2. **Rate Limiting**
   - Per-user rate limits
   - Per-IP rate limits
   - Global service limits

3. **Data Privacy**
   - Encrypt conversations in database
   - Don't share prompts across users
   - Implement user authentication

4. **Prompt Injection**
   - Sanitize user input
   - Validate system prompts
   - Use parameterized requests

## Future Enhancements

1. **Real-time WebSocket**
   - Live multi-user sync
   - Streaming responses
   - Typing indicators

2. **Advanced Concept Mapping**
   - NLP-based extraction
   - Semantic similarity
   - Knowledge graph integration

3. **Team Collaboration**
   - Shared workspaces
   - Permission management
   - Conversation forking

4. **Response Evaluation**
   - User ratings
   - Automated quality metrics
   - Feedback loops

5. **Knowledge Integration**
   - RAG (Retrieval-Augmented Generation)
   - Document upload
   - Web search integration

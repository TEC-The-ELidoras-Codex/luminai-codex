# Frontend Archived (Nov 16, 2025)

This folder has been archived as part of the platform completion push.

## Decision

**Primary frontend**: `website/` (Next.js 15 with App Router)

- Modern architecture with surfaces pattern
- Comprehensive components (Chat, Dashboard, Notebook, Map, Portal, etc.)
- API client library (`website/lib/api-client.ts`)
- Type definitions for ethics and resonance
- Test infrastructure (vitest)
- Production-ready build system

**Archived**: `frontend/` (legacy multi-LLM demo)

- Original location: `frontend/_archived/`
- Contains: MultiLLMChat, CollaborationPanel, LLMProviderSelector, CompactResonanceMap
- These were early prototypes for multi-LLM collaboration

## What Was Migrated

The multi-LLM collaboration concepts from `frontend/components/MultiLLMChat.tsx` informed the design of:

- `website/components/surfaces/ChatSurface.tsx` (production chat interface)
- Backend persona routing (`backend/main.py` with 9 personas)
- Resonance metrics system

## Next Steps

If you need the multi-LLM demo components, they are preserved in `_archived/`.
For new frontend work, use `website/` as the primary codebase.

## Docker Compose Update Needed

Update `docker-compose.yml` to point to `website/` instead of `frontend/`:

```yaml
frontend:
  build:
    context: ./website  # Changed from ./frontend
    dockerfile: Dockerfile
```

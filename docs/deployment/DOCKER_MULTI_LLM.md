# Docker Multi-LLM Integration

This document covers running the LuminAI multi-LLM collaboration system with Docker containers.

## Current Docker Setup

✅ **Configured Services**:
- `backend` - FastAPI server (Python 3.11)
- `frontend` - Next.js client
- `postgres` - PostgreSQL database
- `redis` - Redis cache
- `dev` - Development environment

## Multi-LLM in Docker

### Environment Variables

Add to `docker-compose.yml` or `.env`:

```yaml
backend:
  environment:
    # Existing vars
    - PYTHONUNBUFFERED=1
    - DATABASE_URL=postgresql://luminai:luminai@postgres:5432/luminai
    - REDIS_URL=redis://redis:6379
    
    # Multi-LLM API Keys
    - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    - OPENAI_API_KEY=${OPENAI_API_KEY}
    - XAI_API_KEY=${XAI_API_KEY}
```

### Quick Start with Docker

```bash
# 1. Set API keys in .env
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
echo "OPENAI_API_KEY=sk-..." >> .env  
echo "XAI_API_KEY=..." >> .env

# 2. Start all services
docker-compose up --build

# 3. Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5432

# 4. Test multi-LLM API
curl http://localhost:8000/api/multi-llm/personas
```

### Development Mode

```bash
# Start dev container with code mounted
docker-compose --profile dev-only run --rm dev

# Inside container:
cd /workspace
python scripts/test_multi_llm.py
```

## Service Dependencies

```
frontend ← backend ← postgres
    ↓       ↓         ↑
   3000   8000     5432
```

**Startup Order**:
1. `postgres` + `redis` (with health checks)
2. `backend` (waits for DB)
3. `frontend` (waits for backend)

## Networking

All services use `luminai-network` for internal communication:
- Backend connects to `postgres:5432` and `redis:6379`
- Frontend calls `backend:8000` (internal) or `localhost:8000` (external)
- Multi-LLM APIs called from backend to external services

## Data Persistence

**Volumes**:
- `postgres_data` - Database storage
- `redis_data` - Cache storage
- Code mounts for live reload during development

## Testing Multi-LLM in Docker

1. **Container health check**:
   ```bash
   docker-compose ps
   # All should be "Up" and healthy
   ```

2. **API endpoints**:
   ```bash
   # Health
   curl http://localhost:8000/health
   
   # Multi-LLM personas
   curl http://localhost:8000/api/multi-llm/personas
   
   # Test response (requires API keys)
   curl -X POST http://localhost:8000/api/multi-llm/response \
     -H "Content-Type: application/json" \
     -d '{"persona":"claude","conversationId":"test","context":[],"systemPrompt":"Be helpful"}'
   ```

3. **Frontend integration**:
   - Navigate to `http://localhost:3000`
   - Components should load properly
   - Multi-LLM chat should connect to backend

## Production Deployment

For production, update `docker-compose.prod.yml`:

```yaml
backend:
  image: luminai/backend:latest
  environment:
    - ENVIRONMENT=production
    # API keys from secrets management
  networks:
    - luminai-network
    - traefik-public  # For reverse proxy

frontend:
  image: luminai/frontend:latest
  environment:
    - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Troubleshooting

**❌ "Cannot connect to backend"**
```bash
# Check if backend is running
docker-compose logs backend

# Check network connectivity
docker-compose exec frontend curl http://backend:8000/health
```

**❌ "Database connection failed"**
```bash
# Check postgres health
docker-compose exec postgres pg_isready -U luminai

# Check logs
docker-compose logs postgres
```

**❌ "API keys not working"**
```bash
# Check if env vars are passed to container
docker-compose exec backend env | grep API_KEY

# Check backend logs for API errors
docker-compose logs backend | grep -i "api\|error"
```

## Performance in Docker

**Resource Requirements**:
- Backend: 512MB RAM, 1 CPU
- Frontend: 256MB RAM, 0.5 CPU  
- PostgreSQL: 256MB RAM, 0.5 CPU
- Redis: 128MB RAM, 0.25 CPU

**Total**: ~1.2GB RAM, 2.25 CPU cores

**Optimization**:
- Use multi-stage builds for smaller images
- Enable Docker BuildKit for faster builds
- Use `.dockerignore` to exclude unnecessary files

## Next Steps

1. ✅ Docker setup is ready
2. 🔄 Test multi-LLM with containers 
3. ⏳ Add health checks for external APIs
4. ⏳ Configure secrets management for production
5. ⏳ Add monitoring and logging

See `docs/reports/phase-completions/PHASE_9D_COMPLETION.md` for multi-LLM implementation details.
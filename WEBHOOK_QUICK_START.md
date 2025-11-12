# Webhook Implementation Quick Start

## 1. Local Development (First 5 Minutes)

### 1.1 Generate Webhook Secret

```bash
# Generate a random secret
python -c "import secrets; print('GITHUB_WEBHOOK_SECRET=' + secrets.token_hex(32))" >> .env.local
```

### 1.2 Create `.env.local`

```bash
# Copy example configuration
cp .env.example .env.local

# Edit .env.local and fill in:
# - GITHUB_WEBHOOK_SECRET (from above)
# - Other placeholder values
```

### 1.3 Install Dependencies

```bash
# Create Python environment
python -m venv .venv
source .venv/bin/activate

# Install requirements
pip install -r backend/requirements.txt
```

### 1.4 Test Webhook Locally

```bash
# Start backend
python backend/src/main.py

# In another terminal, test webhook
curl -X POST http://localhost:8000/api/webhook/test

# Expected response:
# {"status": "test-completed", "result": {...}}
```

---

## 2. GitHub Configuration (5-10 Minutes)

### 2.1 Add Webhook to GitHub

1. Go to: `https://github.com/TEC-The-ELidoras-Codex/luminai-codex`
2. **Settings** → **Webhooks** → **Add webhook**
3. Fill in:
   - **Payload URL:** `https://your-backend.com/api/webhook/github`
   - **Content type:** `application/json`
   - **Secret:** (Copy from your `.env.local` GITHUB_WEBHOOK_SECRET)
   - **Events:** Push, Pull request, Release
   - **Active:** ✓ Checked

4. Click **Add webhook**

### 2.2 Verify Connection

1. Find your webhook in GitHub settings
2. Go to **Recent Deliveries**
3. Should see a test delivery with status 200

---

## 3. Production Deployment (30 Minutes)

### 3.1 Deploy Backend

**Option A: Heroku**
```bash
heroku create luminai-resonance-backend
heroku config:set GITHUB_WEBHOOK_SECRET="$(python -c 'import secrets; print(secrets.token_hex(32))')"
git push heroku main
# Backend runs at: https://luminai-resonance-backend.herokuapp.com
```

**Option B: Railway / Render / Fly.io**
- Create account
- Connect GitHub repository
- Set environment variables (GITHUB_WEBHOOK_SECRET, etc.)
- Deploy

**Option C: Docker + AWS/Azure/DigitalOcean**
```bash
docker build -t luminai-backend -f backend/Dockerfile .
docker run -e GITHUB_WEBHOOK_SECRET="your-secret" -p 8000:8000 luminai-backend
```

### 3.2 Update GitHub Webhook URL

1. **Settings** → **Webhooks**
2. Edit webhook
3. Update **Payload URL** to your production URL
4. Click **Update webhook**

### 3.3 Test with Real Push

```bash
# Make a change to docs/
echo "# Test update" >> docs/test.md
git add docs/test.md
git commit -m "test: webhook trigger"
git push origin main

# Watch logs for webhook processing
heroku logs --tail
```

---

## 4. Webhook Event Flow

```
┌─────────────────────────────┐
│   git push to main branch   │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ GitHub sends webhook POST request │
│  /api/webhook/github             │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Backend validates signature      │
│ (X-Hub-Signature-256 header)     │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Process event (push/PR/release)  │
│ Extract changed files            │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Filter docs/ and .md files       │
│ Update documentation index       │
│ Update search index              │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Notify website of updates        │
│ (WebSocket, SSE, or REST API)    │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ GitHub Pages rebuilds docs/      │
│ Website reflects new content     │
└──────────────────────────────────┘
```

---

## 5. Monitoring

### Check Webhook Deliveries

GitHub UI:
```
Settings → Webhooks → [webhook] → Recent Deliveries
```

Backend logs:
```bash
tail -f logs/webhook.log
# or
heroku logs --tail  # if using Heroku
```

Look for messages like:
```
🔔 GitHub Webhook Event: push
📤 Processing push event...
📚 Documentation changes detected: 5 files
✅ GitHub Pages update complete
📡 Website notified of updates
```

---

## 6. Troubleshooting

| Problem | Solution |
|---------|----------|
| **Webhook not firing** | Check GitHub webhook delivery logs; ensure backend URL is correct |
| **Invalid signature** | Verify GITHUB_WEBHOOK_SECRET matches in .env and GitHub settings |
| **Docs not updating** | Check commit includes `docs/` or `.md` files; verify webhook is processing |
| **Website not notified** | Check WEBSITE_URL and WEBSITE_API_KEY in .env; verify website API is running |

---

## 7. Files Changed

### New Files
- `backend/src/routes/webhook.ts` — TypeScript webhook routes (reference)
- `backend/src/main.py` — FastAPI app with webhook endpoint
- `backend/src/integrations/github-pages.ts` — GitHub Pages integration
- `docs/deployment/GITHUB_WEBHOOK_SETUP.md` — Complete webhook guide
- `backend/requirements.txt` — Updated with webhook dependencies

### Updated Files
- `.env.example` — Added webhook configuration variables

---

## 8. API Reference

### Endpoints

```
GET  /api/webhook/status          → Health check
POST /api/webhook/github          → GitHub webhook receiver
POST /api/webhook/test            → Test webhook (dev only)

GET  /api/message                 → Chat endpoint (coming soon)
GET  /api/resonance/calculate    → Resonance score (coming soon)
GET  /health                      → System health
```

### Environment Variables

```bash
GITHUB_WEBHOOK_SECRET             # Required: webhook signature secret
GITHUB_TOKEN                      # Optional: GitHub API access
WEBSITE_URL                       # Optional: website to notify
WEBSITE_API_KEY                   # Optional: website API key
ENVIRONMENT                       # development | production
PORT                             # Backend port (default 8000)
```

---

## Next Steps

1. ✅ **Implement** — Webhook code is ready
2. ⏳ **Deploy** — Push backend to production
3. ⏳ **Configure** — Add webhook to GitHub settings
4. ⏳ **Test** — Push changes and verify website updates
5. ⏳ **Monitor** — Watch logs and GitHub deliveries
6. ⏳ **Scale** — Add chat, audio, mapping features (Phase 9d+)

---

**Ready to continue?** Let's commit this and move to the next phase! 🚀

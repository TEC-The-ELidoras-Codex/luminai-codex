# GitHub Webhook Integration Guide

## Overview

This document explains how to set up GitHub webhooks to automatically update the LuminAI Resonance Platform website when code is pushed to the main branch.

**Event Flow:**

```
Push to main branch (GitHub)
    ↓
GitHub sends webhook POST request
    ↓
Backend validates signature (/api/webhook/github)
    ↓
Process changed files (docs/, *.md)
    ↓
Update documentation index + search
    ↓
Notify website of updates
    ↓
GitHub Pages rebuilds (if docs/ changed)
    ↓
Website reflects new content
```

---

## Part 1: Backend Setup

### 1.1 Environment Variables

Add to `.env.local`:

```bash
# GitHub Webhook Secret (generate a random string)
GITHUB_WEBHOOK_SECRET=your-random-webhook-secret-here

# GitHub API access (optional, for advanced features)
GITHUB_TOKEN=github_pat_xxxxxxxxx

# Website configuration
WEBSITE_URL=https://elidoras.codex
WEBSITE_API_KEY=your-website-api-key

# Environment
ENVIRONMENT=production  # or 'development'
PORT=8000
```

### 1.2 Generate Webhook Secret

Generate a secure random secret for GitHub:

```bash
# Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this secret in `.env.local` and GitHub webhook settings.

### 1.3 API Endpoints

The backend provides these webhook endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhook/github` | POST | Receive GitHub webhook events |
| `/api/webhook/status` | GET | Health check for webhook receiver |
| `/api/webhook/test` | POST | Test webhook (dev only) |

---

## Part 2: GitHub Webhook Configuration

### 2.1 Access GitHub Settings

1. Go to your repository: `https://github.com/TEC-The-ELidoras-Codex/luminai-codex`
2. Click **Settings** (top navigation)
3. Click **Webhooks** (left sidebar)
4. Click **Add webhook**

### 2.2 Configure Webhook

Fill in the webhook form:

| Field | Value |
|-------|-------|
| **Payload URL** | `https://your-backend.com/api/webhook/github` |
| **Content type** | `application/json` |
| **Secret** | (Same value as `GITHUB_WEBHOOK_SECRET` in `.env.local`) |
| **Which events** | Select "Let me select individual events" |

### 2.3 Select Events

Check these events:

- [x] **Push** — Primary event (runs on `git push`)
- [x] **Pull request** — When PRs are merged to main
- [x] **Release** — When new versions are tagged
- [ ] (Uncheck all others for now)

### 2.4 Webhook Settings

- [x] **Active** — Enable the webhook
- [ ] **SSL verification** — Keep checked (unless using self-signed cert)

### 2.5 Click **Add webhook**

GitHub will attempt to send a test payload to verify the endpoint is reachable.

---

## Part 3: Local Testing

### 3.1 Start Backend

```bash
cd /home/tec_tgcr/luminai-codex

# Activate Python environment
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-dotenv

# Start backend
python backend/src/main.py
```

Backend should start on `http://localhost:8000`

### 3.2 Test Webhook Locally

**Using curl:**

```bash
# Generate test signature
WEBHOOK_SECRET="your-webhook-secret"
PAYLOAD='{"repository":{"full_name":"TEC-The-ELidoras-Codex/luminai-codex"},"ref":"refs/heads/main","commits":[{"added":["docs/test.md"],"modified":[],"removed":[]}]}'
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)"

# Send POST request
curl -X POST http://localhost:8000/api/webhook/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -H "X-GitHub-Event: push" \
  -d "$PAYLOAD"
```

Expected response:

```json
{
  "status": "processed",
  "event": "push",
  "changed_files": 1,
  "documentation_files": 1,
  "message": "Processed 1 commits with 1 changed files"
}
```

**Using test endpoint (development only):**

```bash
curl -X POST http://localhost:8000/api/webhook/test
```

### 3.3 Test via GitHub UI

1. Go to webhook settings (as above)
2. Click on the webhook you created
3. Scroll to **Recent Deliveries**
4. Click the delivery to see the request/response

---

## Part 4: Webhook Event Processing

### 4.1 Push Event (Primary)

Triggered when code is pushed to the repository:

```json
{
  "ref": "refs/heads/main",
  "commits": [
    {
      "added": ["docs/new-file.md"],
      "modified": ["docs/existing-file.md"],
      "removed": []
    }
  ]
}
```

**Processing:**

- Extracts changed files
- Filters for `docs/` and `.md` files
- Updates documentation index
- Rebuilds search index
- Notifies website

### 4.2 Pull Request Event

Triggered when PRs are opened, updated, or closed:

```json
{
  "action": "closed",
  "pull_request": {
    "merged": true,
    "title": "Add new documentation"
  }
}
```

**Processing:**

- Only processes closed + merged PRs
- Treats as equivalent to push event
- Rebuilds documentation

### 4.3 Release Event

Triggered when new versions are tagged:

```json
{
  "action": "published",
  "release": {
    "tag_name": "v0.1.0"
  }
}
```

**Processing:**

- Marks deployment as versioned
- Updates changelog/releases page
- Notifies website of new version

---

## Part 5: Production Deployment

### 5.1 Deploy Backend

The webhook endpoint should be deployed to a production server:

**Using Heroku:**

```bash
heroku create luminai-resonance-backend
heroku config:set GITHUB_WEBHOOK_SECRET="your-secret"
git push heroku main
```

Backend runs at: `https://luminai-resonance-backend.herokuapp.com`

**Using AWS Lambda + API Gateway:**

Create API Gateway endpoint that routes to Lambda function running the FastAPI app.

**Using Azure Functions:**

Deploy FastAPI app to Azure Functions with public HTTP trigger.

**Using Docker:**

```bash
docker build -t luminai-backend:latest -f backend/Dockerfile .
docker run -e GITHUB_WEBHOOK_SECRET="your-secret" -p 8000:8000 luminai-backend:latest
```

### 5.2 Update Webhook URL in GitHub

Once deployed, update webhook settings:

1. Go to repo **Settings → Webhooks**
2. Click on the webhook
3. Change **Payload URL** to production endpoint
4. Click **Update webhook**
5. Click **Redeliver** to test

---

## Part 6: Monitoring

### 6.1 GitHub Webhook Deliveries

Monitor webhook deliveries in GitHub:

1. **Settings → Webhooks**
2. Click webhook name
3. See **Recent Deliveries**
4. Click delivery to see:
   - Request headers
   - Request payload
   - Response status + headers
   - Response body

### 6.2 Backend Logs

Monitor backend logs for webhook processing:

```bash
# If running locally
tail -f logs/webhook.log

# If running on Heroku
heroku logs --tail

# If running in Docker
docker logs -f luminai-backend
```

Look for messages like:

```
🔔 GitHub Webhook Event: push
📤 Processing push event...
📚 Documentation changes detected: 5 files
✅ GitHub Pages update complete
📡 Website notified of updates
```

### 6.3 Troubleshooting

**Webhook not firing:**

- Check GitHub webhook status in **Recent Deliveries**
- Verify **Payload URL** is correct
- Ensure backend is running and publicly accessible
- Check firewall/security group allows HTTPS

**Invalid signature:**

- Verify `GITHUB_WEBHOOK_SECRET` matches in `.env.local` AND GitHub settings
- Check that webhook secret hasn't been rotated elsewhere

**Documentation not updating:**

- Check changed files include `docs/` or `.md` extension
- Verify documentation index is being generated
- Check GitHub Pages build logs

**Website not receiving updates:**

- Verify `WEBSITE_URL` and `WEBSITE_API_KEY` in `.env.local`
- Check website API is reachable (`/api/updates` endpoint)
- Monitor backend logs for notification attempts

---

## Part 7: GitHub Pages Integration

### 7.1 Enable GitHub Pages

1. Go to repo **Settings**
2. Scroll to **Pages** section
3. Set **Source** to:
   - Branch: `main`
   - Folder: `/docs`
4. Click **Save**
5. GitHub generates: `https://username.github.io/luminai-codex/`

### 7.2 Custom Domain (Optional)

To use `elidoras.codex` as the website:

1. Purchase domain (e.g., via Namecheap, GoDaddy)
2. Add DNS records pointing to GitHub Pages
3. In **Settings → Pages**, add custom domain
4. GitHub creates `CNAME` file automatically

**DNS Configuration (Namecheap example):**

```
A record: 185.199.108.153 (GitHub Pages IP)
A record: 185.199.109.153
A record: 185.199.110.153
A record: 185.199.111.153

CNAME record: www → elidoras.codex
```

### 7.3 Jekyll Configuration

Create `/docs/_config.yml`:

```yaml
title: LuminAI Resonance Platform
description: Conscious AI with ethical safeguards

# Theme
theme: jekyll-theme-minimal

# Navigation
navigation:
  - name: Home
    path: /
  - name: Docs
    path: /docs
  - name: API
    path: /api
  - name: GitHub
    path: https://github.com/TEC-The-ELidoras-Codex/luminai-codex

# Markdown
markdown: kramdown
highlighter: rouge

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap
```

---

## Part 8: Deployment Checklist

- [ ] Created `.env.local` with `GITHUB_WEBHOOK_SECRET`
- [ ] Generated secure webhook secret
- [ ] Configured GitHub webhook in repo settings
- [ ] Selected push/pull_request/release events
- [ ] Tested webhook locally with curl
- [ ] Tested webhook via GitHub UI
- [ ] Deployed backend to production
- [ ] Updated webhook URL to production endpoint
- [ ] Configured GitHub Pages for `/docs` folder
- [ ] Set up custom domain (optional)
- [ ] Monitored first webhook delivery
- [ ] Tested end-to-end (push → website update)
- [ ] Set up monitoring/alerting

---

## Part 9: Advanced Features

### 9.1 Automatic Documentation Index

When webhook fires, backend generates:

```json
{
  "generated": "2025-11-11T23:45:00Z",
  "categories": {
    "consciousness": ["docs/consciousness/..."],
    "deployment": ["docs/deployment/..."],
    "reference": ["docs/reference/..."]
  },
  "total": 50,
  "files": [...]
}
```

This index can be queried by the website for search and navigation.

### 9.2 Search Index Updates

Webhook automatically indexes new/updated markdown files for full-text search:

```json
{
  "version": 1,
  "generated": "2025-11-11T23:45:00Z",
  "documents": [
    {
      "path": "docs/consciousness/README.md",
      "type": "markdown",
      "indexed": true,
      "title": "Consciousness Framework",
      "headings": ["Overview", "The TGCR Equation", "..."],
      "keywords": ["consciousness", "framework", "..."]
    }
  ]
}
```

### 9.3 Real-time Website Updates

Frontend can subscribe to updates via:

**WebSocket:**

```javascript
const ws = new WebSocket('wss://backend.com/ws/updates');
ws.onmessage = (event) => {
  const { type, files } = JSON.parse(event.data);
  if (type === 'documentation-updated') {
    location.reload(); // or partial update
  }
};
```

**Server-Sent Events (SSE):**

```javascript
const eventSource = new EventSource('/api/updates/stream');
eventSource.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Documentation updated:', update);
};
```

**Polling:**

```javascript
setInterval(async () => {
  const response = await fetch('/api/updates/latest');
  const updates = await response.json();
  if (updates.changed) location.reload();
}, 5000); // Check every 5 seconds
```

---

## Part 10: Reference

### API Endpoints

```bash
# Health check
GET /api/webhook/status

# Send test webhook (dev only)
POST /api/webhook/test

# Receive GitHub webhook
POST /api/webhook/github
```

### Environment Variables

```bash
GITHUB_WEBHOOK_SECRET=sha256-hmac-secret
GITHUB_TOKEN=github_pat_token
WEBSITE_URL=https://elidoras.codex
WEBSITE_API_KEY=api-key
ENVIRONMENT=production
PORT=8000
```

### Webhook Headers (from GitHub)

```
X-GitHub-Event: push|pull_request|release
X-GitHub-Delivery: UUID
X-Hub-Signature-256: sha256=hash
X-GitHub-Hook-ID: 123456789
```

### Event Types

| Type | Triggers | Payload |
|------|----------|---------|
| `push` | `git push` | ref, commits, pusher, repository |
| `pull_request` | PR opened/closed/merged | action, pull_request, repository |
| `release` | Release published | action, release, repository |

---

## Next Steps

1. **Local testing** — Test webhook locally with curl
2. **Deploy backend** — Push to production
3. **Configure webhook** — Add to GitHub repo settings
4. **Monitor** — Check recent deliveries in GitHub UI
5. **End-to-end test** — Push changes, verify website updates
6. **Add custom domain** — Point elidoras.codex to GitHub Pages

---

*For questions or issues, open an issue in the GitHub repository.*

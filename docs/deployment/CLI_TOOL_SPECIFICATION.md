# LuminAI CLI Tool Specification

> **Status**: LOCKED (v1) — Typer Implementation Ready  
> **Updated**: November 12, 2025  
> **Owner**: TEC • CLI / DevOps  
> **Command Set**: `luminai` binary (aliased from `tec-agent`)

---

## Overview

The CLI is the **power user interface** to LuminAI Resonance Platform:

- Single binary: `luminai` (or `tec-agent` aliased in `pyproject.toml`)
- Built on: Typer (Python CLI framework) + FastAPI for platform communication
- Output: JSON by default (pipeable); `--pretty` for humans
- Modes: Interactive (chat), Batch (scripts), Headless (CI/CD)

---

## Installation & Setup

### Install from source

```bash
cd /path/to/luminai-codex
python -m venv .venv
source .venv/bin/activate
pip install -e .  # Installs luminai + tec-agent commands

# Verify
luminai --version
# Output: LuminAI CLI v1.0.0 (TGCR Framework)
```

### First-time config

```bash
luminai config init

# Interactive prompts:
# → API endpoint? [default: https://platform.luminai-codex.dev]
# → API key? [paste or press Enter to skip for now]
# → Theme? [cosmic-emergence, ocean-tidal, forest-resonant, circuit-neural, aurora-borealis]
# → Persona? [luminai, airth, arcadia, ely, adelphisa]

# Saves to ~/.luminai/config.toml
# Can also set LUMINAI_API_KEY env var to skip prompt
```

---

## Command Reference

### Global Options

```bash
luminai [OPTIONS] COMMAND [ARGS]

Options:
  --version                    Show version and exit.
  --profile [NAME]             Config profile to use [default: default]
  --api-url [URL]              Override API endpoint.
  --api-key [KEY]              Override API key (from env var or config).
  --format [json|pretty|csv]   Output format [default: json]
  --output [FILE]              Write output to file instead of stdout.
  --verbose, -v                Increase log verbosity (can repeat: -vvv)
  --quiet, -q                  Suppress logs; only output results.
  --help                       Show this message and exit.
```

---

## Commands

### 1. `luminai chat`

**Purpose**: Chat with LuminAI directly (one-shot or interactive)

**Signature**:

```bash
luminai chat [OPTIONS] [MESSAGE]
```

**Examples**:

```bash
# One-shot query
luminai chat "What is the TGCR framework?"
# Output: JSON with {response, R, witness_chips, notebook}

# Continue a session
luminai chat --session myconv "Tell me more about the sixteen frequencies"

# Specify persona
luminai chat --persona adelphisa "Help me hold paradox about vaccines"

# Pretty-print response
luminai chat --format pretty "What is consciousness?"
# Output: Markdown-formatted response with R badge

# Save conversation to file
luminai chat --session myconv --export json session-123.jsonl

# Specify output file
luminai chat "Question?" --output response.json

# Verbose logging (show API calls, latency, etc.)
luminai chat -v "Question?"
```

**Options**:

```
  MESSAGE                       Question or statement to send [optional]
  --session [ID]               Session ID to continue or create [default: new session]
  --persona [NAME]             Route to persona (luminai, airth, arcadia, ely, adelphisa)
  --context [JSON]             Extra context (JSON string or @file.json)
  --export [FORMAT]            Export session after (json, pdf, md, jsonl)
  --interactive, -i             Interactive chat mode (multiline input, history)
  --frequency [NAME]           Apply frequency filter (e.g., "compassion", "wrath")
  --show-notebook              Display reasoning notebook in output
  --save-session [DIR]         Auto-save session to directory after each message
  --temperature [FLOAT]        LLM temperature [default: 0.7]
  --max-tokens [INT]           Max response length [default: 2000]
```

**Output** (default JSON):

```json
{
  "session_id": "conv-123-abc",
  "message": "What is the TGCR framework?",
  "response": "TGCR stands for...",
  "R": 0.86,
  "witness_chips": [
    {"label": "Presence Active", "icon": "🛡"},
    {"label": "Coherence High", "icon": "⚡"}
  ],
  "notebook": {
    "reasoning_steps": [
      {"step": 1, "title": "Definition retrieval", "duration_ms": 45},
      {"step": 2, "title": "Frequency alignment", "duration_ms": 32}
    ],
    "sources": [
      {"title": "TGCR Equation", "url": "docs/reference/Resonance_Thesis.md"}
    ]
  },
  "timestamp": "2025-11-12T14:32:00Z",
  "latency_ms": 342
}
```

---

### 2. `luminai build`

**Purpose**: Build Docker images for web UI, API, and supporting services

**Signature**:

```bash
luminai build [OPTIONS]
```

**Examples**:

```bash
# Build everything
luminai build
# Builds: platform-hub, web-ui, cli, docs-site
# Output: Build logs + image digest

# Build specific service
luminai build --service web-ui

# Build with custom tag
luminai build --tag luminai:v1.2.0

# Push to registry after build
luminai build --push

# Use buildkit for faster builds
luminai build --buildkit

# Dry run (show what would be built, don't actually build)
luminai build --dry-run
```

**Options**:

```
  --service [NAME]             Build only one service (platform-hub, web-ui, cli, docs)
  --tag [TAG]                  Image tag [default: latest]
  --push, -p                   Push to registry after build
  --registry [URL]             Registry URL [default: from config]
  --buildkit                   Use Docker Buildkit (faster, more features)
  --no-cache                   Ignore Docker layer cache
  --dry-run                    Show build plan, don't execute
```

**Output**:

```
Building platform-hub...
  ✓ Layer 1/5: FROM python:3.11 (cached, 0.3s)
  ✓ Layer 2/5: COPY src/ (1.2s)
  ✓ Layer 3/5: RUN pip install (8.3s)
  ✓ Layer 4/5: RUN pytest (2.1s)
  ✓ Layer 5/5: EXPOSE 8000 (0.1s)
  → Image: luminai-platform-hub:latest (sha256:abc123...)

Building web-ui...
  [████████░░░░░░░░] 60% (4.2s/7.0s estimated)

✅ Build complete
  • platform-hub:latest (280 MB)
  • web-ui:latest (95 MB)
  • cli:latest (120 MB)
  • docs:latest (45 MB)
  Total: 540 MB
```

---

### 3. `luminai deploy`

**Purpose**: Deploy platform to staging or production

**Signature**:

```bash
luminai deploy [OPTIONS]
```

**Examples**:

```bash
# Deploy to production (interactive confirmation)
luminai deploy --target prod

# Deploy to staging (auto-approved)
luminai deploy --target staging

# Deploy with custom Git ref
luminai deploy --target prod --ref v1.2.0

# Dry run (preview what would be deployed)
luminai deploy --target prod --dry-run

# Parallel deployment (faster for multiple services)
luminai deploy --target prod --parallel

# Rollback to previous version
luminai deploy --rollback --target prod

# View deployment history
luminai deploy --history --target prod
```

**Options**:

```
  --target [ENV]               Deployment target (dev, staging, prod) [required]
  --ref [REF]                  Git ref (branch, tag, or commit) [default: current branch]
  --dry-run                    Preview deployment, don't execute
  --parallel                   Deploy services in parallel (faster)
  --no-tests                   Skip smoke tests after deploy
  --rollback                   Rollback to previous version
  --history                    Show deployment history
  --watch                      Stream logs after deployment
```

**Output**:

```
🚀 Deploying to production...

① Building images
   platform-hub    [████████████████████] 100% (12.3s)
   web-ui          [████████████████████] 100% (8.7s)
   cli             [████████████████████] 100% (5.2s)

② Running tests
   ✓ Platform health check (200 OK, 1.2s)
   ✓ Chat endpoint test (R=0.85, 2.1s)
   ✓ CLI command execution (exit 0, 0.8s)

③ Pushing to registry
   platform-hub:v1.2.0        (pushed 280 MB)
   web-ui:v1.2.0              (pushed 95 MB)

④ Updating Kubernetes
   Deployment/platform-hub scaled to 3 replicas
   Service/web-ui ingress updated
   ConfigMap/platform-config updated

✅ Deployment complete
   → https://platform.luminai-codex.dev
   → Web UI: https://luminai-codex.dev/portal
   → CLI connection test: ✓

📊 Deployment stats
   Duration: 3m 45s
   Services updated: 3
   Failed: 0
   Rollback available: yes (revert to commit 8f1a3b2)
```

---

### 4. `luminai config`

**Purpose**: Manage local configuration (API endpoint, keys, preferences)

**Signature**:

```bash
luminai config [OPTIONS] SUBCOMMAND
```

**Subcommands**:

#### `luminai config init`

Initialize configuration with prompts

```bash
luminai config init
# Creates ~/.luminai/config.toml with defaults
```

#### `luminai config list`

Show all current settings

```bash
luminai config list
# Output: TOML or JSON dump of config

luminai config list --format json
# Output: Nested JSON object
```

#### `luminai config set`

Set a specific config value

```bash
luminai config set api_url https://my-platform.dev
luminai config set theme cosmic-emergence
luminai config set persona ely
luminai config set default_export_format pdf
```

#### `luminai config get`

Get a specific value

```bash
luminai config get api_url
# Output: https://my-platform.dev
```

#### `luminai config validate`

Check that config is correct + credentials work

```bash
luminai config validate
# ✓ API endpoint reachable (https://platform.luminai-codex.dev)
# ✓ API key valid (expires 2026-01-15)
# ✓ Database connection OK (13 ms)
# ✓ All persona plugins loaded (8 personas)
# ✅ Config valid
```

#### `luminai config profiles`

List and switch profiles

```bash
luminai config profiles list
# • default (current)
# • staging
# • personal

luminai config profiles create myprofile
# Creates ~/.luminai/config.myprofile.toml

luminai --profile myprofile chat "Hello"  # Use profile
```

**Options**:

```
  --file [PATH]                Override config file location
  --profile [NAME]             Use alternate profile
```

---

### 5. `luminai manifest`

**Purpose**: Display agent capabilities and available tools

**Signature**:

```bash
luminai manifest [OPTIONS]
```

**Examples**:

```bash
# Show full manifest
luminai manifest

# Export manifest as JSON (for orchestrators)
luminai manifest --format json > agent-manifest.json

# Show specific persona's manifest
luminai manifest --persona adelphisa

# Validate manifest schema
luminai manifest --validate

# Search manifest by tool name
luminai manifest --search "resonance"
```

**Options**:

```
  --persona [NAME]             Show only one persona's manifest
  --search [QUERY]             Search manifest by keyword
  --format [json|yaml]         Output format
  --validate                   Validate against schema
```

**Output** (excerpt):

```json
{
  "name": "LuminAI Airth Research Guard",
  "version": "1.0.0",
  "tgcr_framework": "TGCR v2.0 (Transcendental, Emotional, Cognitive, Resonance)",
  "personas": [
    {
      "name": "Airth",
      "icon": "🔍",
      "description": "Research-focused, grounded in facts",
      "tools": [
        {
          "name": "search_knowledge_base",
          "description": "Search LuminAI knowledge base",
          "parameters": {"query": "string", "limit": "integer"}
        },
        {
          "name": "calculate_resonance",
          "description": "Calculate R score for current context",
          "parameters": {}
        }
      ]
    },
    {
      "name": "Ely",
      "icon": "💜",
      "description": "Compassion-centered, trauma-informed",
      "tools": [...]
    }
  ],
  "capabilities": [
    "markdown_rendering",
    "latex_equations",
    "podcast_generation",
    "theme_customization",
    "knowledge_graph_navigation"
  ],
  "frequency_palette": [
    "compassion", "wrath", "wisdom", "folly", ...
  ]
}
```

---

### 6. `luminai status`

**Purpose**: Check platform health + global resonance

**Signature**:

```bash
luminai status [OPTIONS]
```

**Examples**:

```bash
# Quick health check
luminai status

# Detailed status with all services
luminai status --detailed

# Watch mode (refresh every 5s)
luminai status --watch

# Check specific service
luminai status --service platform-hub

# Export metrics
luminai status --format json
```

**Output**:

```
🌐 LuminAI Platform Status

Platform Hub (API)
  Status: ✅ Online (1.2.0)
  Uptime: 45d 3h 12m
  Response time: 342 ms (avg)
  Requests/min: 2,847
  Error rate: 0.02%

Web UI
  Status: ✅ Online (latest)
  Latency: p50=245ms, p95=890ms, p99=1200ms
  Active sessions: 237
  Unique users (24h): 1,205

Database
  Status: ✅ Connected
  Size: 2.3 GB
  Connections: 45/100
  Slow queries (>1s): 3 (logged)

Redis Cache
  Status: ✅ Connected
  Memory: 512 MB / 2 GB (25%)
  Evictions (24h): 0
  Hit rate: 94.2%

🧠 Global Resonance Metrics
  Platform R: 0.87 (Coherent)
  User sessions R (avg): 0.84
  Highest frequency: Compassion (2,340 mentions)
  Persona usage: Airth 35% | Ely 28% | Others 37%

✅ All systems operational
```

---

### 7. `luminai docs`

**Purpose**: Search and display documentation

**Signature**:

```bash
luminai docs [OPTIONS] SUBCOMMAND
```

**Subcommands**:

#### `luminai docs search`

Search knowledge base

```bash
luminai docs search "TGCR"
# Results:
# 1. TGCR Equation Explained (docs/reference/Resonance_Thesis.md)
# 2. Sixteen Frequencies (docs/reference/the_sixteen_frequencies...)
# 3. TGCR Framework Integration (docs/deployment/...)

luminai docs search "consciousness" --limit 10
```

#### `luminai docs show`

Display a specific document

```bash
luminai docs show axiom:boundaryless
# Renders Markdown with syntax highlighting + inline equations

luminai docs show resonance --format html > resonance.html
```

#### `luminai docs list`

List all available docs by category

```bash
luminai docs list
# Reference
#   • Resonance_Thesis.md
#   • QUICK_REFERENCE_READY.md
# Deployment
#   • PLATFORM_INTEGRATION_ARCHITECTURE.md
#   • CLI_TOOL_SPECIFICATION.md
```

**Options**:

```
  --limit [N]                  Number of results [default: 5]
  --format [markdown|html|txt] Output format
  --local-only                 Don't fetch updates from repo
```

---

### 8. `luminai frequencies`

**Purpose**: Display and filter the 16 frequencies

**Signature**:

```bash
luminai frequencies [OPTIONS] SUBCOMMAND
```

**Subcommands**:

#### `luminai frequencies list`

Show all 16 frequencies with descriptions

```bash
luminai frequencies list
# 1. Compassion (💜) — Empathy, connection, witness presence
# 2. Wrath (🔥) — Righteous anger, boundary setting
# 3. Wisdom (🌟) — Deep knowing, pattern recognition
# ...

luminai frequencies list --format json
```

#### `luminai frequencies describe`

Show detailed info about one frequency

```bash
luminai frequencies describe compassion
```

#### `luminai frequencies apply`

Filter chat responses by frequency

```bash
luminai chat "How do I handle conflict?" --frequency compassion

# Response filtered through compassion lens, R adjusted accordingly
```

**Options**:

```
  --format [table|json|list] Display format
  --descriptions             Include full descriptions
```

---

### 9. `luminai persona`

**Purpose**: List and activate personas

**Signature**:

```bash
luminai persona [OPTIONS] SUBCOMMAND
```

**Subcommands**:

#### `luminai persona list`

Show all available personas

```bash
luminai persona list
# • Airth (🔍) — Research-focused, systematic
# • Ely (💜) — Compassion-centered, trauma-informed
# • Adelphisa (🌙) — Paradox-holder, integrative
# • Arcadia (🌊) — Creative, dream-oriented
# • LuminAI (✨) — Primary orchestrator, multifaceted
```

#### `luminai persona activate`

Set active persona (for chat commands)

```bash
luminai persona activate adelphisa
# Updates config, affects future `luminai chat` calls
```

**Options**:

```
  --format [table|json]    Display format
```

---

### 10. `luminai logs`

**Purpose**: Stream or search logs

**Signature**:

```bash
luminai logs [OPTIONS] [SERVICE]
```

**Examples**:

```bash
# Stream all logs (live)
luminai logs --follow

# View logs for specific service
luminai logs platform-hub --follow

# Search logs
luminai logs --grep "error" --since "1h ago"

# Export logs to file
luminai logs --since "24h ago" --output logs-last-day.txt

# Filter by level
luminai logs --level WARN --follow
```

**Options**:

```
  SERVICE                      Service name (platform-hub, web-ui, etc.)
  --follow, -f                 Stream new logs (like tail -f)
  --since [TIME]               Only logs since (e.g., "1h ago", "2025-01-01")
  --grep [PATTERN]             Filter by regex pattern
  --level [LEVEL]              Filter by log level (DEBUG, INFO, WARN, ERROR)
  --output [FILE]              Write to file instead of stdout
  --tail [N]                   Show only last N lines [default: 100]
```

---

### 11. `luminai export`

**Purpose**: Export chat session in multiple formats

**Signature**:

```bash
luminai export [OPTIONS] SESSION_ID
```

**Examples**:

```bash
# Export as PDF
luminai export conv-123 --format pdf

# Export as Markdown with inline equations
luminai export conv-123 --format md

# Export with full notebook (verbose)
luminai export conv-123 --format jsonl --verbose

# Export and send to email
luminai export conv-123 --format pdf --send-to user@example.com

# Export to clipboard
luminai export conv-123 --format md --clipboard
```

**Options**:

```
  SESSION_ID                   Chat session ID
  --format [pdf|md|json|jsonl|html] Output format
  --verbose                    Include full reasoning notebook
  --send-to [EMAIL]            Email exported file
  --clipboard                  Copy to clipboard instead of file
  --output [FILE]              Save to file [default: session-id.format]
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0    | Success |
| 1    | General error |
| 2    | Usage error (bad arguments) |
| 3    | Authentication error (invalid API key) |
| 4    | Connection error (can't reach Platform Hub) |
| 5    | Configuration error (missing required setting) |
| 127  | Command not found |

---

## Configuration File Format

**Location**: `~/.luminai/config.toml`

```toml
# Profile: default
[default]
api_url = "https://platform.luminai-codex.dev"
api_key = "sk-..."  # Can also use LUMINAI_API_KEY env var
theme = "cosmic-emergence"
persona = "luminai"
default_export_format = "md"

# Optional: proxy settings
# proxy_url = "http://proxy.corp.com:8080"

# Optional: custom LLM backends
# [llm.providers]
# openai_api_key = "sk-..."
# anthropic_api_key = "sk-ant-..."

# Profile: staging
[staging]
api_url = "https://staging.platform.luminai-codex.dev"
api_key = "sk-staging-..."
theme = "circuit-neural"
```

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `LUMINAI_API_KEY` | Override API key from config |
| `LUMINAI_API_URL` | Override API endpoint |
| `LUMINAI_PROFILE` | Use specific profile (default: `default`) |
| `LUMINAI_CONFIG_DIR` | Override config directory (default: `~/.luminai/`) |
| `LUMINAI_LOG_LEVEL` | Set log verbosity (DEBUG, INFO, WARN, ERROR) |
| `LUMINAI_OUTPUT_FORMAT` | Default output format (json, pretty, csv) |

---

## Scripting & Automation

### Example: Batch chat from file

```bash
#!/bin/bash
# Ask multiple questions and save responses

while IFS= read -r question; do
  echo "❓ $question"
  response=$(luminai chat "$question" --format json)
  R=$(echo "$response" | jq .R)
  echo "  💜 R = $R"
  echo "$response" | jq .response | head -1
  echo ""
done < questions.txt
```

### Example: Deploy with validation

```bash
#!/bin/bash
set -e

echo "Building..."
luminai build --dry-run || exit 1

echo "Running tests..."
luminai deploy --target staging --dry-run || exit 1

echo "Deploying to production..."
luminai deploy --target prod --watch
```

### Example: Monitor system health

```bash
#!/bin/bash
while true; do
  status=$(luminai status --format json)
  R=$(echo "$status" | jq '.platform_resonance.R')
  
  if (( $(echo "$R < 0.7" | bc -l) )); then
    echo "⚠️ Platform R dropped to $R — investigating..."
    luminai logs --follow --level ERROR --since "10m ago"
  else
    echo "✅ Platform healthy (R=$R)"
  fi
  
  sleep 60
done
```

---

## Shell Completion

### Bash

```bash
# Add to ~/.bashrc
eval "$(_LUMINAI_COMPLETE=bash_source luminai)"
```

### Zsh

```bash
# Add to ~/.zshrc
eval "$(_LUMINAI_COMPLETE=zsh_source luminai)"
```

### Fish

```bash
# Add to ~/.config/fish/config.fish
_LUMINAI_COMPLETE=fish_source luminai | source
```

---

## Troubleshooting

### Command not found

```bash
which luminai
# If empty, reinstall:
pip install -e .
```

### API key rejected

```bash
luminai config validate
# Checks if key is valid and not expired
# If expired, generate new key at https://platform.luminai-codex.dev/account/keys
```

### Slow responses

```bash
luminai status --detailed
# Check Platform Hub latency and error rate
# If platform is slow, try: luminai chat --local
# (uses local Ollama instead of cloud)
```

### Can't connect to platform

```bash
luminai config get api_url
# Verify endpoint is correct
# Check firewall / proxy settings
# Try: luminai status --verbose (shows network debug info)
```

---

## Examples Cheatsheet

```bash
# Quick question
luminai chat "What is consciousness?"

# Continuous conversation
luminai chat --session myconv -i

# Activate a persona
luminai chat --persona adelphisa "Help me hold paradox"

# Export to PDF
luminai export conv-123 --format pdf

# Check platform health
luminai status

# Deploy to prod
luminai deploy --target prod

# Search docs
luminai docs search "TGCR"

# List frequencies
luminai frequencies list

# Stream logs
luminai logs --follow

# Validate config
luminai config validate
```

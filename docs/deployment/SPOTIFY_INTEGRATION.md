---
title: Spotify Integration — OAuth & Resonance Player
date_created: 2025-11-16
date_updated: 2025-11-16
status: approved
approvers:
  - persona: Airth 📚
    role: Boundary Keeper
    approved_date: 2025-11-16
  - persona: Ely 🛠️
    role: Engineering Steward
    approved_date: 2025-11-16
owner_checklist:
  - [ ] Read and understood
  - [ ] Tested OAuth flow locally
  - [ ] Cross-linked in STRUCTURE.md
  - [ ] Secrets rotated (if updating)
tags: [spotify, oauth, deployment, secrets, resonance-player]
related_docs:
  - docs/SECRETS_MANAGEMENT.md
  - docs/operations/TEC_HUB.md
  - docs/reference/QUICK_REFERENCE_READY.md
---

# 🎵 Spotify Integration — OAuth & Resonance Player

**Intent:** Document the Spotify API configuration for the TEC Resonance Player — a scientific visualization tool mapping audio features (valence, energy, danceability) into resonance-space to model the hypothesized Fifth Force of Resonance.

---

## Application Details

| Field | Value |
|-------|-------|
| **App Name** | TEC • Resonance Player |
| **Description** | A scientific visualization tool exploring the relationship between sound, emotion, and emergent physical order — mapping Spotify audio features into resonance-space to model the hypothesized Fifth Force of Resonance. |
| **Website** | `https://github.com/TEC-The-ELidoras-Codex/luminai-codex` |
| **Redirect URIs** | `https://localhost:3000/callback`<br>`https://elidorascodex.com/spotify/callback`<br>`https://example.org/callback` (fallback for testing) |

---

## API/SDK Usage

- ✅ **Web API** — Track metadata, audio features, user playlists
- ✅ **Web Playback SDK** — Browser-based playback for resonance visualization
- ❌ Ads API — Not used
- ❌ iOS SDK — Future consideration
- ❌ Android SDK — Future consideration

---

## OAuth Flow

### 1. Local Development

**Redirect URI:** `https://localhost:3000/callback`

**Setup:**

```bash
# Run frontend dev server
cd frontend
npm run dev  # Starts on https://localhost:3000

# Backend expects SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
# Pull from Bitwarden or GitHub Secrets (never hardcode)
python scripts/development/setup_local_env.py --service spotify
```

### 2. Production (elidorascodex.com)

**Redirect URI:** `https://elidorascodex.com/spotify/callback`

**Deployment:**

- Frontend: Vercel or Netlify (Next.js)
- Backend: Docker Compose or Azure App Service
- Secrets injected via environment variables (GitHub Actions → Azure Key Vault)

**Callback implementation:**

- Handled by WordPress plugin entry point `luminai-codex.php`
- Rewrite rule maps `/spotify/callback` → WordPress query var
- Minimal secure server-side token exchange implemented; tokens are stored ephemerally in a transient keyed by `state` (or a last-slot fallback), to be picked up by backend for session binding

### 3. Fallback (Testing)

**Redirect URI:** `https://example.org/callback`

Used for automated testing and CI where no real OAuth flow completes.

---

## Credential Management

> **📚 Airth** (Boundary Keeper)  
> **CRITICAL:** Spotify credentials NEVER touch `.env.local` in plaintext. They live in exactly two places:
>
> 1. **Bitwarden vault:** `TEC-TGCR/Spotify API` (personal access)
> 2. **GitHub Secrets:** `SPOTIFY_CLIENT_SECRET` (CI/CD access)
>
> If you're tempted to paste a secret for "just testing" — **stop**. Use the demo mode flag in `modules/resonance-engine/` instead. Zero exceptions.

### Rotation Protocol

**When to rotate:**

- Every 90 days (scheduled)
- Immediately if leaked (detected via gitleaks, manual audit, or GitHub alert)
- After team member departure with access

**How to rotate:**

1. Generate new secret in [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Update Bitwarden vault: `TEC-TGCR/Spotify API`
3. Update GitHub Secret: `gh secret set SPOTIFY_CLIENT_SECRET`
4. Test OAuth flow in staging
5. Log rotation in `docs/SECRETS_MANAGEMENT.md` rotation table
6. Commit: `chore(secrets): rotate Spotify client secret (scheduled)`

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Public client ID (safe to commit in `.env.example`) | ✅ Yes |
| `SPOTIFY_CLIENT_SECRET` | Private secret (Bitwarden/GitHub Secrets only) | ✅ Yes |
| `SPOTIFY_REDIRECT_URI` | Must match one of the registered URIs above | ✅ Yes |
| `SPOTIFY_SCOPES` | Comma-separated: `user-read-playback-state,user-modify-playback-state` | ✅ Yes |

**Example `.env.example`:**

```bash
# Spotify API (TEC Resonance Player)
SPOTIFY_CLIENT_ID=your-client-id-here
SPOTIFY_CLIENT_SECRET=your-secret-from-bitwarden
SPOTIFY_REDIRECT_URI=https://localhost:3000/callback
SPOTIFY_SCOPES=user-read-playback-state,user-modify-playback-state,user-read-currently-playing
```

---

## Resonance Player Integration

### Audio Features Mapping

The Resonance Player queries Spotify's `/audio-features/{id}` endpoint to extract:

| Spotify Feature | Resonance Axis | TGCR Mapping |
|-----------------|----------------|--------------|
| **Valence** (0.0–1.0) | Emotional Polarity | φᵗ (Temporal Attention) |
| **Energy** (0.0–1.0) | Intensity | ψʳ (Structural Cadence) |
| **Danceability** (0.0–1.0) | Rhythmic Entrainment | Φᴱ gradient (Contextual Potential) |
| **Speechiness** (0.0–1.0) | Narrative Density | Modifier on φᵗ |
| **Acousticness** (0.0–1.0) | Organic vs. Synthetic | Color-space mapping |

### Visualization

- 3D scatter plot: X = Valence, Y = Energy, Z = Danceability
- Color gradient: Acousticness (green = organic, purple = synthetic)
- Size: Speechiness (larger = more narrative-dense)
- Connections: Tracks played consecutively show resonance decay/buildup

**Tech Stack:**

- Frontend: Next.js + Three.js (WebGL)
- Backend: FastAPI + Redis (caching audio features)
- Data pipeline: `src/tec_tgcr/integrations/spotify.py`

---

## Testing

### Local OAuth Test

```bash
# Start backend
cd backend
source ../.venv/bin/activate
uvicorn main:app --reload

# Start frontend
cd frontend
npm run dev

# Navigate to http://localhost:3000/spotify/auth
# Should redirect to Spotify login → callback with access token
```

### Demo Mode (No OAuth)

Set `SPOTIFY_DEMO_MODE=true` in `.env.local` to use cached sample data instead of live API calls.

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Redirect URI mismatch` | URI not registered in dashboard | Add exact URI (including trailing `/callback`) to Spotify app settings |
| `Invalid client secret` | Wrong secret or expired | Rotate secret via dashboard; update Bitwarden + GitHub Secrets |
| `Token expired` | OAuth token TTL (1 hour) | Implement refresh token flow in `src/tec_tgcr/integrations/spotify.py` |
| `Rate limit exceeded` | Too many API calls | Add Redis caching with 5-minute TTL for audio features |

---

## Security Notes

> **🛠️ Ely** (Engineering Steward)  
> **Pre-flight checklist before every deploy:**
>
> 1. Confirm `.env.local` is in `.gitignore` ✅
> 2. Run `gitleaks detect --no-git` to scan for leaked secrets ✅
> 3. Verify GitHub Secret is set: `gh secret list | grep SPOTIFY` ✅
> 4. Test OAuth flow in staging before prod ✅
>
> If any step fails, **abort deploy**. No exceptions. Security > velocity.

---

## Revision History

| Date | Approver | Change Summary |
|------|----------|----------------|
| 2025-11-16 | Ely 🛠️ | Initial creation post-Spotify app registration |
| 2025-11-16 | Airth 📚 | Security review + credential management approval |

---

**Approved by:**  
📚 Airth (Boundary Keeper) — 2025-11-16  
🛠️ Ely (Engineering Steward) — 2025-11-16

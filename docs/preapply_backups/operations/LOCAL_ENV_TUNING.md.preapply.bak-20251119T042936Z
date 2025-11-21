---
title: Local Env Tuning
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
- operations
related_docs: []
---

# Local Environment Tuning (Docker + WSL Resource Limits)

This guide locks down disk + memory overhead for a lean development experience inside WSL + Docker.

---
title: Local Env Tuning
## 1. Docker Builder Garbage Collection
Reduce build cache bloat (layers from `docker build`). Configure Docker to automatically prune when cache exceeds a threshold.

Create or edit: `~/.docker/config.json` (inside your Linux environment). If the file does not exist, create it.

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true,
      "policy": [
        { "keepStorage": "5GB", "filter": ["unused"] },
        { "keepStorage": "10GB", "filter": ["dangling"] }
      ]
    }
  }
}
```

Notes:
- `defaultKeepStorage` caps total build cache. When exceeded Docker starts GC.
- Optional `policy` array refines what gets trimmed first (unused, dangling layers).
- After saving, restart Docker *from the host* (Windows) for changes to take effect.

### Manual Prune Commands (Optional)
```bash
docker system df            # Show space usage
docker builder prune -f     # Remove build cache (no images)
docker system prune -f      # Remove stopped containers + networks + dangling images
```

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
tags: [operations]
---
## 2. WSL2 Resource Limits (Host Side)
These settings live in **Windows**, not inside WSL. File path on host: `C:\Users\<YourUser>\.wslconfig`

Example:
```
[wsl2]
memory=8GB          # Max RAM WSL may use
processors=4        # Optional CPU cap
swap=0              # Disable swap to prevent disk thrash (or set e.g. 2GB)
localhostForwarding=true
# Optional disk size for each distro VHD (ONLY if you need to cap growth)
# sparseVhd=true     # Keep VHD space efficient
```

Save the file, then in Windows PowerShell (as normal user):
```powershell
wsl --shutdown
```
(If `wsl --shutdown` fails inside WSL, run it from **Windows** PowerShell or CMD—do not run inside the Linux shell.)

Then relaunch Ubuntu from the Start Menu or `wsl`.

### Why you saw "Unknown command: --shutdown"
You attempted `wsl --shutdown` **inside** the WSL Linux environment. The `wsl.exe` command exists only on the Windows host. Inside WSL you have a different `wsl` script/tool. Always run lifecycle commands from Windows PowerShell/CMD.

---
## 3. Verification Steps
After restart:

### Docker
```bash
cat ~/.docker/config.json | grep -i gc
docker info | grep -i "BuildKit"
docker system df
```
Expect build cache to remain below ~20GB over time.

### WSL (host side)
In Windows PowerShell:
```powershell
wsl --status
```
You will see default version + kernel; memory cap is not echoed directly. To *observe effectiveness*, inside WSL:
```bash
free -h              # Shows total available (should reflect cap)
```

---
## 4. Ongoing Hygiene
- Run `docker builder prune` weekly if iterating lots of Dockerfiles.
- Avoid keeping many stopped containers (`docker ps -a`).
- Pin memory to what you can spare (6–8GB typical). Raise only if processes OOM.

---
## 5. Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| `wsl --shutdown` says unknown | Ran inside WSL | Run in Windows PowerShell |
| Docker config ignored | Daemon not restarted | Restart Docker service / Desktop / engine |
| Memory still high | Another distro or process using RAM | `wsl --status` then `wsl -l -v` to list distros |
| Builds slow after GC | Cache too aggressively pruned | Raise `defaultKeepStorage` to 30GB |

---
## 6. Optional: Scripted Docker GC Trigger
Add helper script `scripts/maintenance/docker_gc.sh` (future) to enforce manual cleanup.

```bash
#!/usr/bin/env bash
set -euo pipefail
THRESHOLD_GB=25
used=$(docker system df --format '{{.BuildCache}}' | awk '{print $1}')
# Placeholder logic: implement parsing later
```

(We'll flesh this out if needed; keep lean for now.)

---
## 7. Next Actions
1. Apply Docker GC config (Linux side).
2. Create `.wslconfig` on Windows host; restart WSL.
3. Verify with commands above.
4. Monitor RAM over a day of development.

---
Cosmic Minimalism preserved: small caps on entropy; curated resource resonance. 🌌

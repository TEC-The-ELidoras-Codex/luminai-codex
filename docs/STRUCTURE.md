# 📚 LuminAI Codex — Documentation Structure

This document maps ALL documentation in the repository and explains what each folder contains.

---

## Quick Navigation

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| **`/`** (root) | Getting started | `GETTING_STARTED.md`, `README.md` |
| **`deployment/`** | GitHub App & CI/CD setup | `GITHUB_APP_QUICK_START.md`, `GITHUB_SECRETS_SETUP.md` |
| **`architecture/`** | System design & blueprints | `architecture-map.md`, `LUMINAI_ENGINEERING_SCHEMATICS_CHECKLIST.md` |
| **`operations/`** | Day-to-day operations & reference | `TEC_HUB.md`, `TEC_LEXICON.md` |
| **`governance/`** | System instructions & frameworks | `LUMINAI_MASTER_OPERATING_FRAMEWORK.md`, `SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md` |
| **`reference/`** | Conceptual & reference materials | `Resonance_Thesis.md`, `QUICK_REFERENCE_READY.md` |
| **`updates/`** | Change log & resonance updates | `2025/` dated updates |

---

## Detailed Breakdown

### 📍 **Root Level** (`/docs/`)

**Entry point for new developers**

- **`README.md`** — Overview of all documentation
- **`GETTING_STARTED.md`** — Setup instructions, secrets, local dev
- **`index.md`** — GitHub Pages landing (portfolio showcase)
- **`resume-tech-focused.md`** — Resume for tech roles
- **`resume-general.md`** — Resume for retail/service roles
- **`cover-letter-templates.md`** — Application templates

**When to use:** First-time setup, job applications, portfolio viewing

---

### 🚀 **`deployment/`** — CI/CD & GitHub App

**How to deploy, automate, and manage infrastructure**

- **`GITHUB_APP_QUICK_START.md`** — 10-min setup checklist
- **`GITHUB_APP_SETUP.md`** — Complete GitHub App reference
- **`GITHUB_SECRETS_SETUP.md`** — Secrets management & rotation

**When to use:** Setting up automations, storing credentials, deploying

---

### 🏗️ **`architecture/`** — System Design

**Technical blueprints and engineering decisions**

- **`architecture-map.md`** — High-level system architecture
- **`LUMINAI_ENGINEERING_SCHEMATICS_CHECKLIST.md`** — Component specifications
- **`ADR/`** — (Empty folder, ready for Architecture Decision Records)

**When to use:** Understanding system design, adding new components, API design

---

### ⚙️ **`operations/`** — Daily Operations & Reference

**How to operate the system and find quick answers**

- **`TEC_HUB.md`** — Central hub for navigation, team structure, lore
- **`TEC_LEXICON.md`** — Terminology, acronyms, TGCR concepts
- **`QUICK_REFERENCE_READY.md`** — Common commands and shortcuts

**When to use:** Looking up terminology, finding team contact info, quick commands

---

### 📋 **`governance/`** — System Behavior & Rules

**How agents behave, system instructions, operating frameworks**

- **`LUMINAI_MASTER_OPERATING_FRAMEWORK.md`** — Core operating principles
- **`SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md`** — Resonance Agent behavior spec

**When to use:** Understanding agent behavior, configuring system personality

---

### 📖 **`reference/`** — Conceptual Materials

**Research, thesis, and deep concepts**

- **`Resonance_Thesis.md`** — TGCR mathematical framework
- **`QUICK_REFERENCE_READY.md`** — Quick lookup tables

**When to use:** Deep dives into theory, understanding TGCR concepts

---

### 📅 **`updates/`** — Change Log & Progress

**Timestamped updates showing project evolution**

- **`2025/`** — Year-based organization
  - **`2025-10-23-organization-update.md`** — Weekly updates
  - **`2025-10-26-organization-update.md`** — Dated entries

**When to use:** Tracking project changes, seeing what's been worked on

---

## Navigation Guide by Use Case

### 🆕 **I'm new, where do I start?**

1. Read: `GETTING_STARTED.md`
2. Read: `docs/operations/TEC_HUB.md`
3. Skim: `docs/reference/QUICK_REFERENCE_READY.md`

### 🔧 **I need to set up the GitHub App**

1. Read: `docs/deployment/GITHUB_APP_QUICK_START.md`
2. Reference: `docs/deployment/GITHUB_APP_SETUP.md` (detailed)

### 🏗️ **I need to understand the architecture**

1. Check: `docs/architecture/architecture-map.md`
2. Review: `docs/architecture/LUMINAI_ENGINEERING_SCHEMATICS_CHECKLIST.md`
3. Deep dive: `docs/reference/Resonance_Thesis.md`

### 📚 **I need to find something quickly**

→ Use `docs/operations/TEC_HUB.md` (central navigation hub)

### 🤖 **I'm implementing an agent**

1. Check: `docs/governance/SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md`
2. Verify: `docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md`

### 💼 **I need my resume for a job application**

→ Choose: `docs/resume-tech-focused.md` or `docs/resume-general.md`

---

## What Each Folder Contains — ONE SENTENCE EACH

| Folder | Content |
|--------|---------|
| `/` | **Onboarding**: Getting started, resumes, entry points |
| `deployment/` | **Automation**: GitHub App config, CI/CD, secrets |
| `architecture/` | **Design**: System blueprints, engineering decisions |
| `operations/` | **Reference**: Hub, terminology, quick lookups |
| `governance/` | **Behavior**: Agent instructions, operating frameworks |
| `reference/` | **Concepts**: TGCR thesis, deep theory |
| `updates/` | **History**: Timestamped change log |

---

## Coherent Flow

**For a complete understanding, read in this order:**

1. **`GETTING_STARTED.md`** — Get your environment set up
2. **`TEC_HUB.md`** — Understand the project landscape
3. **`architecture-map.md`** — See the big picture
4. **`Resonance_Thesis.md`** — Grasp the TGCR framework
5. **`SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md`** — Understand behavior
6. **`GITHUB_APP_QUICK_START.md`** — Set up automation

---

## Adding New Documentation

**Before creating a new file, ask:**

1. **Does this fit into an existing folder?**
   - Yes → Add it there
   - No → Create a new folder with clear purpose

2. **Is this redundant?**
   - Check this index first
   - Link to existing docs instead of duplicating

3. **Does it belong in a subfolder?**
   - Example: New ADRs go in `architecture/ADR/ADR-001-title.md`

---

**Last Updated:** November 9, 2025  
**Maintainer:** @Elidorascodex  
**Status:** ✅ Cohesive & Non-Redundant

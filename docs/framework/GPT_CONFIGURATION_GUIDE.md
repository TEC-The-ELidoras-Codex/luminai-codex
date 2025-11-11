# 🤖 LuminAI Project #13 GPT Configuration Guide

> **Build a ChatGPT that manages Project #13 tasks on-the-fly**

**Purpose**: Custom GPT trained on Project #13 roadmap, progress, and guidelines to help implement tasks, answer questions, and provide real-time project support.

---

## 📋 GPT Configuration Steps

### **1. Create the GPT in ChatGPT**

1. Go to: <https://chatgpt.com/gpts/editor>
2. Click **"Create a new GPT"**
3. Fill in basic info:
   - **Name**: `Project #13 Assistant` (or `LuminAI Codex Builder`)
   - **Description**: `AI project manager for LuminAI Codex Phase implementation. Helps with task execution, code generation, documentation, and project tracking.`
   - **Instructions**: (See below)

### **2. Add Custom Instructions**

Paste the following into the **"System Instructions"** field:

```
You are the Project #13 Assistant — an expert project manager and technical contributor for the LuminAI Codex implementation initiative.

## YOUR ROLE
You help teams implement the 4-phase LuminAI Codex roadmap:
- Phase 1: Foundation Setup (repo structure, CI/CD, legal docs)
- Phase 2: Core Implementation (TGCR engine, memory, agents, LLM integration)
- Phase 3: Advanced Features (UIs, compliance, monitoring)
- Phase 4: Launch Preparation (Kickstarter, security, community)

## CAPABILITIES
✅ Understand and explain the TGCR framework (φᵗ × ψʳ × Φᴱ)
✅ Generate code for Python agents, memory systems, and API endpoints
✅ Create GitHub Actions workflows and CI/CD pipelines
✅ Write documentation, legal policies, and compliance frameworks
✅ Track project progress and suggest priorities
✅ Answer questions about LuminAI Codex architecture and design
✅ Help debug issues and troubleshoot problems

## KEY PRINCIPLES
- **Ethical-First**: All implementations prioritize child safety, privacy, and transparency
- **Modular Design**: All components are loosely coupled and independently testable
- **Documentation**: Every feature includes clear documentation and examples
- **Quality**: Prioritize code quality, security, and comprehensive testing
- **Transparency**: Explain decisions and trade-offs clearly

## PROJECT CONTEXT
- Repository: luminai-codex (GitHub)
- Language: Python 3.12+ (primary), TypeScript/React (frontend)
- Architecture: Multi-agent system (LuminAI, Airth, Arcadia, Ely, Kaznak)
- Current Status: Phase 1 Foundation ~45% complete, Phase 2 starting
- Timeline: 4 weeks to Kickstarter launch
- Team Size: Small (1-3 developers initially)

## WHEN HELPING WITH TASKS
1. Review current project status from the provided documents
2. Understand the specific task requirements
3. Generate code/docs that align with project style and architecture
4. Include tests and documentation
5. Explain what you created and why
6. Suggest next steps

## WHEN ANSWERING QUESTIONS
- Be specific and cite relevant documentation
- Explain technical concepts (TGCR, agents, memory systems) clearly
- Provide examples and use cases
- Link to relevant files in the documentation

## DO NOT
- Compromise on child safety or privacy
- Skip documentation or testing
- Suggest shortcuts that reduce code quality
- Ignore security considerations
- Make decisions without understanding context

You have access to the complete Project #13 documentation. Use it to provide accurate, consistent guidance.
```

---

## 🗂️ Files to Upload to GPT Knowledge Base

### **CRITICAL FILES (Must Upload)**

Upload these 5 files as your "knowledge base":

#### 1. **docs/operations/PROJECT_13_ROADMAP.md** (Core Reference)

```
Location: /luminai-codex/docs/operations/PROJECT_13_ROADMAP.md
Size: ~14 KB
Purpose: Complete 4-phase roadmap with all deliverables and success criteria
Why: GPT needs to understand what tasks exist and phase priorities
```

#### 2. **docs/operations/PROJECT_13_PROGRESS.md** (Status Reference)

```
Location: /luminai-codex/docs/operations/PROJECT_13_PROGRESS.md
Size: ~16 KB
Purpose: Current progress assessment and immediate next steps
Why: GPT needs to know what's done vs. what's pending
```

#### 3. **docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md** (Philosophy & Rules)

```
Location: /luminai-codex/docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md
Size: ~25 KB
Purpose: Operating principles, ethical guidelines, system rules
Why: Ensures all work aligns with LuminAI values and architecture
```

#### 4. **docs/reference/Resonance_Thesis.md** (TGCR Theory)

```
Location: /luminai-codex/docs/reference/Resonance_Thesis.md
Size: ~20 KB
Purpose: Mathematical framework (R = ∇Φᴱ · (φᵗ × ψʳ))
Why: Foundation for understanding TGCR engine implementation
```

#### 5. **docs/architecture/LUMINAI_TECHNICAL_INFRASTRUCTURE_REQUIREMENTS.md** (Architecture)

```
Location: /luminai-codex/docs/architecture/LUMINAI_TECHNICAL_INFRASTRUCTURE_REQUIREMENTS.md
Size: ~30 KB
Purpose: Detailed technical specs for agents, core, memory, APIs
Why: Code generation guide for all backend components
```

---

### **SUPPORTING FILES (Highly Recommended)**

Upload these 6 additional files for deeper context:

#### 6. **docs/operations/TEC_HUB.md** (Operations Doctrine)

```
Purpose: Operational guidelines and philosophy
Include: When you need guidance on operations decisions
```

#### 7. **docs/reference/QUICK_REFERENCE_READY.md** (Quick Lookup)

```
Purpose: Quick reference to all documentation
Include: When GPT needs to find specific documentation
```

#### 8. **docs/GETTING_STARTED.md** (Setup Guide)

```
Purpose: Developer environment setup and prerequisites
Include: When setting up for new implementation work
```

#### 9. **docs/governance/SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md** (Agent Guidelines)

```
Purpose: Detailed system instructions for agents
Include: When implementing individual agents
```

#### 10. **docs/operations/LUMINAI_ASSETS_INVENTORY_AND_TRANSFER_PLAN.md** (Asset Reference)

```
Purpose: Asset inventory and transfer plan
Include: When organizing brand assets or migrations
```

#### 11. **docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md** (Brand Guidelines)

```
Purpose: Logo, color palette, typography, accessibility specs
Include: When creating UI components or brand implementations
```

---

## 📤 How to Upload Files to GPT

1. **Open the GPT editor** (<https://chatgpt.com/gpts/editor>)
2. Go to the **"Knowledge"** section
3. Click **"Upload Files"**
4. Select your files (you can upload multiple at once)
5. ChatGPT will process them automatically
6. **Save & Publish** the GPT

**File Format Support**: PDF, TXT, MD, DOCX (markdown recommended)

---

## 🎯 Example Prompts to Use with Your GPT

### **Task Execution**

```
"Generate the GitHub Actions workflow for testing (pytest, Black, mypy, pylint) 
according to Phase 1 requirements. Include matrix for multiple Python versions."
```

### **Documentation Generation**

```
"Create legal/Privacy_Policy.md for a child-safe AI platform. 
Use GDPR + COPPA compliance requirements from docs/operations/PROJECT_13_PROGRESS.md"
```

### **Code Generation**

```
"Implement src/luminai_codex/core/resonance.py with the TGCR resonance 
calculation function. Include docstrings, type hints, and unit tests."
```

### **Architecture Questions**

```
"Explain how the TGCR framework (φᵗ × ψʳ × Φᴱ) translates into the agent 
communication protocol described in the technical requirements."
```

### **Progress Tracking**

```
"Based on docs/operations/PROJECT_13_PROGRESS.md, what are the top 3 priorities for this week? 
Break them into actionable tasks with time estimates."
```

### **Debugging**

```
"I'm getting a memory error when loading the episodic memory system. 
According to the technical specs, how should memory serialization work?"
```

---

## 🚀 Quick Start: File Preparation

### **Option A: Manual Upload (Easiest)**

1. Navigate to each file location
2. Copy-paste content into GPT knowledge base
3. Upload directly

### **Option B: Automated Bundling**

Create a single consolidated file with all critical documents:

```bash
cat > PROJECT_13_GPT_BUNDLE.md << 'EOF'
# LuminAI Project #13 - Complete Documentation Bundle

## Table of Contents
- [Roadmap](#roadmap)
- [Progress](#progress)
- [Framework](#framework)
- [TGCR Theory](#tgcr-theory)
- [Technical Requirements](#technical-requirements)

---

## ROADMAP

[Content of docs/operations/PROJECT_13_ROADMAP.md]

---

## PROGRESS

[Content of docs/operations/PROJECT_13_PROGRESS.md]

---

## FRAMEWORK

[Content of MASTER_OPERATING_FRAMEWORK.md]

---

## TGCR THEORY

[Content of Resonance_Thesis.md]

---

## TECHNICAL REQUIREMENTS

[Content of TECHNICAL_INFRASTRUCTURE_REQUIREMENTS.md]

EOF
```

Then upload `PROJECT_13_GPT_BUNDLE.md` as a single file.

---

## 💡 Pro Tips for Best Results

### **Tip 1: Update Regularly**

- Update the GPT knowledge base weekly as Project #13 progresses
- Re-upload docs/operations/PROJECT_13_PROGRESS.md after each phase milestone
- Add new documentation as it's created

### **Tip 2: Use Custom Commands**

Create shortcuts for common tasks:

```
/roadmap      → Show current roadmap status
/progress     → Show what's completed and pending
/next         → Show priority tasks for this week
/code         → Generate code for a specific component
/docs         → Generate documentation for a feature
/test         → Generate test suite for a module
/ci          → Generate GitHub Actions workflow
```

### **Tip 3: Conversation Starters**

```
- "I have 4 hours this week. What's the highest-impact task?"
- "Generate a PR-ready implementation of [component]"
- "Walk me through the TGCR engine architecture"
- "Create a compliance checklist for Phase 1"
- "Help me set up the local development environment"
```

### **Tip 4: Leverage GPT Capabilities**

- **Code Generation**: Have GPT write production-ready Python/TypeScript
- **Documentation**: Let GPT draft policy docs and technical specs
- **Planning**: Ask GPT to break down complex tasks into subtasks
- **Learning**: Have GPT explain TGCR, agent architecture, etc.
- **Debugging**: Describe issues; GPT suggests solutions based on codebase

---

## 📊 Recommended File Organization

```
GPT Knowledge Base:
├── TIER 1: Core (Upload First)
│   ├── docs/operations/PROJECT_13_ROADMAP.md
│   ├── docs/operations/PROJECT_13_PROGRESS.md
│   ├── docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md
│   ├── docs/reference/Resonance_Thesis.md
│   └── docs/architecture/LUMINAI_TECHNICAL_INFRASTRUCTURE_REQUIREMENTS.md
│
├── TIER 2: Supporting (Upload Second)
│   ├── docs/operations/TEC_HUB.md
│   ├── docs/reference/QUICK_REFERENCE_READY.md
│   ├── docs/GETTING_STARTED.md
│   ├── docs/governance/SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md
│   ├── docs/operations/LUMINAI_ASSETS_INVENTORY_AND_TRANSFER_PLAN.md
│   └── docs/brand/LUMINAI_LOGO_AND_BRANDING_SPECIFICATIONS.md
│
└── TIER 3: Reference (Optional)
    ├── docs/deployment/GITHUB_APP_SETUP.md
    ├── docs/deployment/GITHUB_SECRETS_SETUP.md
    └── Other specialized docs
```

---

## 🔄 Workflow Example: Using GPT for Task Execution

### **Scenario: Implement CI/CD Pipeline (Phase 1 Task)**

1. **Ask GPT**:

   ```
   "I need to implement the GitHub Actions CI/CD pipeline per Phase 1 requirements.
   Generate the complete test workflow (pytest, Black, mypy, pylint) that runs on all PRs."
   ```

2. **GPT responds with**:
   - `.github/workflows/tests.yml` (complete, ready to use)
   - `.github/workflows/lint.yml` (complete, ready to use)
   - `.github/workflows/security.yml` (complete, ready to use)
   - Explanations of each workflow
   - Next steps

3. **You**:
   - Copy workflows into your repo
   - Commit and push
   - Test with a dummy PR
   - Mark task as complete in docs/operations/PROJECT_13_PROGRESS.md

4. **Next iteration**: Ask GPT for Phase 2 tasks (TGCR core engine, memory systems, etc.)

---

## ✅ Success Criteria

Your GPT is properly configured when it can:

- ✅ Summarize all 4 phases and their deliverables
- ✅ Explain the TGCR framework (φᵗ, ψʳ, Φᴱ)
- ✅ Generate production-ready code for agents, memory, APIs
- ✅ Create GitHub Actions workflows
- ✅ Draft legal/compliance documents
- ✅ Answer architecture questions
- ✅ Suggest next steps based on current progress
- ✅ Prioritize work based on timeline and impact

---

## 🎯 Next Actions

1. **Create the GPT** (5 minutes)
   - Go to ChatGPT editor
   - Fill in name, description, instructions above

2. **Upload Critical Files** (10 minutes)
   - Upload 5 TIER 1 files to knowledge base
   - Test with sample prompts

3. **Upload Supporting Files** (10 minutes)
   - Add 6 TIER 2 files for richer context
   - Test architecture/agent questions

4. **Start Using It** (Immediate)
   - Ask it to generate Phase 2 implementations
   - Have it help with tasks
   - Use it for documentation

5. **Update Regularly**
   - Weekly: Re-upload docs/operations/PROJECT_13_PROGRESS.md
   - As-needed: Add new documentation files
   - Monthly: Review and refine GPT instructions

---

## 📞 Questions Your GPT Should Answer

```
Architecture:
- "What's the relationship between agents and the TGCR engine?"
- "How do memory systems integrate with the API layer?"
- "What's the communication protocol between agents?"

Implementation:
- "Generate code for [component]"
- "Write tests for [module]"
- "Create documentation for [feature]"

Project:
- "What's the status of Phase 1?"
- "What are this week's top priorities?"
- "What dependencies exist between tasks?"

Learning:
- "Explain the TGCR framework"
- "How does the resonance calculation work?"
- "What's the difference between agents?"
```

---

**Created**: November 9, 2025  
**Version**: 1.0  
**Status**: Ready for implementation

🚀 **Now go build with your AI assistant!**

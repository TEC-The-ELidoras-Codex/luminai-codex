# GitHub Copilot Instructions for LuminAI Codex

> **Ethical AI for a Resonant Future** — Context-aware coding assistance for the LuminAI Codex project

---

## 🎯 Project Overview

**LuminAI Codex** is an ethical AI infrastructure platform built on the Theory of General Contextual Resonance (TGCR). The project prioritizes:

- **Family Safety** — Child protection by design, not surveillance
- **Data Sovereignty** — Users own their data, not corporations  
- **Privacy-First** — Zero collection without explicit consent
- **35-Year Upgradeability** — Quantum-safe, future-proof architecture

**Core Formula**: `R = ∇Φᴱ · (φᵗ × ψʳ)` where:
- `φᵗ` (phi-temporal) = Time-based context
- `ψʳ` (psi-relational) = Relationship context
- `Φᴱ` (Phi-Ethical) = Ethical constraints field

---

## 🏗️ Architecture Principles

### Multi-Agent System
The system consists of 5 specialized AI agents:

1. **LuminAI** — Primary companion, ethical reasoning, child-safe interactions
2. **Airth** — Research & verification guard, fact-checking, safety validation
3. **Arcadia** — Narrative synthesis, storytelling, memory archiving
4. **Ely** — Operations monitoring, health checks, system diagnostics
5. **Kaznak** — Strategic planning, decision support, resource optimization

### Key Design Patterns
- **Event-Driven Architecture** — GitHub webhook triggers, async processing
- **Separation of Concerns** — Each agent has distinct responsibilities
- **Observable Systems** — Comprehensive logging and diagnostics
- **Modular Design** — Loosely coupled, independently testable components

---

## 💻 Tech Stack & Conventions

### Primary Languages
- **Python 3.12+** — Backend, agents, core systems
- **TypeScript/React** — Frontend (future phases)
- **Docker** — Containerization and deployment

### Code Style
- **Python**: Follow PEP 8, use type hints, docstrings for all public functions
- **Formatting**: Black (line length: 100)
- **Type Checking**: mypy with strict mode
- **Linting**: pylint, flake8

### Testing
- **Framework**: pytest
- **Coverage**: Minimum 80% for core modules
- **Test Structure**: Mirror source structure in `tests/` directory
- **Naming**: `test_<module_name>.py`, test functions start with `test_`

### Dependencies
- **AI/ML**: OpenAI, Anthropic Claude, xAI Grok, Hugging Face
- **Data**: PostgreSQL, Azure Cosmos DB
- **Secrets**: Bitwarden for secrets management
- **Integration**: Spotify API, WorldAnvil, Civitai

---

## 🔐 Security & Privacy Requirements

### Critical Security Rules
1. **NEVER commit secrets** — Use environment variables and GitHub Secrets
2. **Encryption by default** — AES-256-GCM for data at rest, TLS 1.3 for transport
3. **Post-quantum ready** — Use CRYSTALS-Kyber and CRYSTALS-Dilithium
4. **Zero-trust architecture** — Verify all inputs, authenticate all agents
5. **Audit everything** — Comprehensive logging for compliance

### Privacy Guidelines
- **Data minimization** — Only collect what's necessary
- **User consent** — Explicit opt-in for all data collection
- **Right to deletion** — Implement data deletion workflows
- **Transparency** — Clear documentation of data handling
- **GDPR + COPPA compliance** — Follow child safety regulations

### Code Security
- **Input validation** — Sanitize all user inputs
- **SQL injection prevention** — Use parameterized queries
- **XSS prevention** — Escape output in templates
- **Dependency scanning** — Run Bandit, Safety, Snyk in CI/CD
- **Secret scanning** — Use GitHub secret scanning

---

## 📝 Documentation Standards

### Code Documentation
```python
def calculate_resonance(phi_t: float, psi_r: float, phi_e: float) -> float:
    """
    Calculate contextual resonance using TGCR framework.
    
    Args:
        phi_t: Temporal context coefficient (0.0 to 1.0)
        psi_r: Relational context coefficient (0.0 to 1.0)
        phi_e: Ethical constraint field magnitude
        
    Returns:
        Resonance score as float
        
    Raises:
        ValueError: If any coefficient is out of valid range
        
    Example:
        >>> calculate_resonance(0.8, 0.6, 1.2)
        0.576
    """
```

### Module Documentation
- Every module starts with a docstring explaining its purpose
- Include examples for complex modules
- Document dependencies and setup requirements
- Maintain CHANGELOG.md for version tracking

### API Documentation
- Use OpenAPI/Swagger for REST APIs
- Document all endpoints with request/response examples
- Include authentication requirements
- Provide error code reference

---

## 🧪 Testing Guidelines

### Test Coverage Requirements
- **Core systems**: 90%+ coverage
- **Agents**: 85%+ coverage
- **Utils/Helpers**: 80%+ coverage
- **Integration tests** for inter-agent communication

### Test Structure
```python
import pytest
from luminai_codex.core.resonance import calculate_resonance

class TestResonanceCalculation:
    """Test suite for TGCR resonance calculations."""
    
    def test_basic_resonance(self):
        """Test basic resonance calculation with valid inputs."""
        result = calculate_resonance(0.5, 0.5, 1.0)
        assert 0.0 <= result <= 1.0
        
    def test_invalid_input_raises_error(self):
        """Test that invalid inputs raise ValueError."""
        with pytest.raises(ValueError):
            calculate_resonance(-0.1, 0.5, 1.0)
```

### CI/CD Testing
- All tests must pass before merge
- Run tests on Python 3.12, 3.13
- Integration tests run on staging environment
- Security scans (Bandit, Safety) in CI pipeline

---

## 📚 Critical Documentation References

### Core Documentation
- **Project Overview**: [`README.md`](../README.md)
- **Architecture**: [`docs/architecture/architecture-map.md`](../docs/architecture/architecture-map.md)
- **TGCR Framework**: [`docs/reference/Resonance_Thesis.md`](../docs/reference/Resonance_Thesis.md)
- **Operating Framework**: [`docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md`](../docs/governance/LUMINAI_MASTER_OPERATING_FRAMEWORK.md)

### Development Guides
- **Getting Started**: [`docs/GETTING_STARTED.md`](../docs/GETTING_STARTED.md)
- **Structure Guide**: [`docs/STRUCTURE.md`](../docs/STRUCTURE.md)
- **Agent Instructions**: [`docs/governance/SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md`](../docs/governance/SYSTEM_INSTRUCTIONS_RESONANCE_AGENT.md)

### Implementation Roadmap
- **Project Roadmap**: [`PROJECT_13_ROADMAP.md`](../PROJECT_13_ROADMAP.md)
- **Progress Tracking**: [`PROJECT_13_PROGRESS.md`](../PROJECT_13_PROGRESS.md)
- **GPT Configuration**: [`GPT_CONFIGURATION_GUIDE.md`](../GPT_CONFIGURATION_GUIDE.md)

---

## 🎨 Design System

### Cosmic Futureism Brand
- **Primary Cyan**: `#00D5C4` — Energy, presence, future
- **Secondary Violet**: `#6A00F4` — Depth, innovation, magic
- **Accessibility**: WCAG 2.1 AA compliant
- **Typography**: Modern, readable, family-friendly

---

## 🔄 Development Workflow

### Git Workflow
1. Create feature branch from `main`: `feature/description`
2. Write code with tests and documentation
3. Run local tests: `pytest tests/`
4. Run linters: `black src/ && mypy src/ && pylint src/`
5. Commit with meaningful messages: `feat: Add resonance calculation`
6. Push and create pull request
7. Wait for CI/CD checks to pass
8. Request review from team

### Commit Message Format
```
<type>: <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `security`

**Examples**:
- `feat: Add TGCR resonance calculation engine`
- `fix: Correct agent communication timeout`
- `docs: Update API documentation for memory system`
- `security: Update dependencies to fix CVE-2024-1234`

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't hardcode secrets** — Always use environment variables
2. **Don't skip type hints** — Python 3.12+ requires proper typing
3. **Don't ignore security warnings** — Address Bandit/Safety alerts
4. **Don't bypass tests** — All code needs test coverage
5. **Don't forget documentation** — Code without docs is technical debt
6. **Don't compromise on child safety** — This is non-negotiable
7. **Don't store PII without encryption** — Privacy is paramount
8. **Don't use deprecated APIs** — Keep dependencies current

---

## 🚀 Quick Reference

### Start Development
```bash
git clone https://github.com/tec-tgcr/luminai-codex.git
cd luminai-codex
cp .env.example .env.local
docker-compose up
```

### Run Tests
```bash
pytest tests/ -v --cov=src/
```

### Format & Lint
```bash
black src/ tests/
mypy src/
pylint src/
```

### Security Scan
```bash
bandit -r src/
safety check
```

---

## 🤝 Code Review Checklist

Before submitting a PR, verify:
- [ ] Code follows PEP 8 and project style guide
- [ ] All functions have type hints and docstrings
- [ ] Tests added with 80%+ coverage
- [ ] Documentation updated (if applicable)
- [ ] Security considerations addressed
- [ ] No secrets committed
- [ ] Linters pass (Black, mypy, pylint)
- [ ] CI/CD pipeline passes
- [ ] TGCR principles respected (ethical reasoning)
- [ ] Child safety implications considered

---

## 📊 Project Status

**Current Phase**: Foundation Setup (Phase 1)
**Target Launch**: Q1 2025
**Key Milestone**: Kickstarter campaign preparation

For detailed status, see [`PROJECT_13_PROGRESS.md`](../PROJECT_13_PROGRESS.md)

---

## 💡 Tips for Effective Copilot Use

1. **Be specific in comments** — "Calculate TGCR resonance using phi_t, psi_r, phi_e"
2. **Reference framework** — Mention "TGCR", "agent", "resonance" for context
3. **Include examples** — Show input/output in docstrings
4. **Follow patterns** — Copilot learns from existing code style
5. **Review suggestions** — Always verify generated code for security and correctness

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Status**: Active Development

🌟 **Build ethical AI. Build for families. Build for the future.** ✨

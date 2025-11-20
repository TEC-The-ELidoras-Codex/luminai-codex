# scripts/create_labels.py
"""
Create or update repository labels in bulk using PyGithub.

Requires environment variable GITHUB_TOKEN with repo scope.

This script will create new labels or update existing ones (color/description)
for both persona labels and common issue/PR labels.
"""
from github import Github, GithubException
import os
import sys

token = os.environ.get("GITHUB_TOKEN")
if not token:
    sys.exit("Set GITHUB_TOKEN in env (scoped to repo)")

g = Github(token)
repo = g.get_repo("Elidorascodex/luminai-codex")

# Combined label list: persona labels + common labels
labels = [
    ("persona:LuminAI", "1f8ef1", "Core LuminAI persona: general design/engineering work routed to LuminAI."),
    ("persona:Airth", "2ecc71", "Airth (Research Guard): research, citations, evidence reviews."),
    ("persona:Arcadia", "e67e22", "Arcadia (platform integrations): UI, connectors."),
    ("persona:Ely", "9b59b6", "Ely (engineer/ops): infra, tooling, CI."),
    ("persona:Adelphia", "f39c12", "Adelphia (companion/grounding): UX, content voice."),
    ("persona:Multi-Persona", "16a085", "Multi-Persona: coordination tasks needing multi-persona choreography."),
    ("persona:Kaznak", "e84393", "Kaznak (experimental): speculative features and experiments."),
    ("persona:The-Mirror", "34495e", "The Mirror: evaluation, ethics checks."),
    ("persona:The-Reluctant-Steward", "c0392b", "Risk-aware persona: policy, refusal."),

    # Common repository labels
    ("bug", "d73a4a", "Something isn't working; a reproducible defect."),
    ("dependencies", "0366d6", "Pull requests that update a dependency file (requirements, package.json)."),
    ("documentation", "0075ca", "Improvements or additions to documentation."),
    ("duplicate", "cfd3d7", "This issue or pull request is a duplicate of another; link the original."),
    ("enhancement", "a2eeef", "New feature or request; feature improvements."),
    ("good first issue", "7057ff", "Good for newcomers — small, well-scoped tasks with guidance."),
    ("help wanted", "008672", "Needs extra attention or contributors; active help is requested."),
    ("invalid", "e99695", "This doesn't seem right or is not actionable."),
    ("javascript", "f1e05a", "Pull requests that update JavaScript code."),
    ("python", "3572A5", "Pull requests that update Python code."),
    ("question", "d876e3", "Further information is requested; clarifying questions."),
    ("wontfix", "5319e7", "This will not be worked on; intentionally declined or out-of-scope.")
]

def normalize(name: str) -> str:
    return name.strip().lower()

existing = {normalize(l.name): l for l in repo.get_labels()}

for name, color, desc in labels:
    key = normalize(name)
    try:
        if key in existing:
            lab = existing[key]
            # edit(name, color, description)
            try:
                lab.edit(name=name, color=color, description=desc)
                print("Updated", name)
            except GithubException as e:
                print("Failed to update", name, ":", getattr(e, 'data', e))
        else:
            try:
                repo.create_label(name=name, color=color, description=desc)
                print("Created", name)
            except GithubException as e:
                print("Failed to create", name, ":", getattr(e, 'data', e))
    except Exception as e:
        print("Skipped", name, ":", e)
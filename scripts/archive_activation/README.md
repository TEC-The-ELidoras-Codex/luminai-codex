# Archive Activation Demo

Quick proof-of-concept: **arXiv → ChromaDB → Semantic Search**

## What This Does

1. Fetches **50 papers** from arXiv across 5 domains:
   - Quantum mechanics (physics)
   - Machine learning (CS)
   - Neuroscience (biology)
   - Game theory (math/economics)
   - Climate modeling (earth sciences)

2. Generates **embeddings** (OpenAI or local sentence-transformers)

3. Loads into **ChromaDB** for semantic search

4. Tests **cross-discipline queries**:
   - "quantum tunneling in biological systems"
   - "machine learning for climate prediction"
   - "game theory applications in neuroscience"

## Setup

```bash
# Install dependencies
pip install -r scripts/archive_activation/requirements.txt

# Set OpenAI key (optional — will use local embeddings if missing)
export OPENAI_API_KEY=sk-...

# Run demo
python scripts/archive_activation/ingest_arxiv_demo.py
```

## Expected Output

```
🧠 Archive Activation Demo — arXiv → ChromaDB

✅ Using OpenAI text-embedding-3-small for embeddings

📚 Fetching papers from arXiv...
   - quantum mechanics (10 papers)
   - machine learning (10 papers)
   - neuroscience (10 papers)
   - game theory (10 papers)
   - climate modeling (10 papers)

✅ Fetched 50 papers across 5 domains

⚡ Generating embeddings and loading into ChromaDB...
Ingesting papers: 100%|████████████████| 50/50 [00:12<00:00,  3.95it/s]

✅ Ingested 50 papers into collection 'arxiv_demo_50'

🔍 Testing cross-discipline semantic search...

Query: "quantum tunneling in biological systems"
  1. [quantum mechanics] Quantum Effects in Enzyme Catalysis
     Categories: quant-ph, q-bio.BM
  2. [neuroscience] Quantum Coherence in Avian Magnetoreception
     Categories: q-bio.NC, quant-ph
  3. [machine learning] Quantum-Inspired Optimization for Protein Folding
     Categories: cs.LG, quant-ph

✅ Demo complete!

📊 Collection stats:
   - Name: arxiv_demo_50
   - Papers: 50
   - Path: ./data/rag/chromadb

💡 Next: Query this collection via personas to demonstrate cross-pollination
```

## Data Sources Beyond arXiv

### Free APIs (No License Required)

| Source | Domain | Papers | API |
|--------|--------|--------|-----|
| **PubMed Central** | Biomedical, clinical | 10M+ | NCBI E-utilities |
| **bioRxiv** | Biology preprints | 200k+ | REST API |
| **PLOS ONE** | Multidisciplinary | 300k+ | PLOS API |
| **DOAJ** | All fields (open journals) | 2M+ | API + OAI-PMH |
| **CORE** | Aggregator | 200M+ | REST API |
| **Semantic Scholar** | All fields | 200M+ | REST API |
| **OpenAlex** | All fields | 250M+ | REST API + bulk |

### Specialized Domains

- **PhilPapers** (philosophy): 2.9M+ entries
- **NASA ADS** (astronomy): 16M+ papers
- **RePEc** (economics): 3.8M+ items
- **ChemRxiv** (chemistry): Preprints

### Books & Humanities

- **Project Gutenberg**: 70k+ classic books
- **Internet Archive**: 40M+ texts
- **Wikisource**: Public domain primary sources

## Next Steps

### 1. Multi-Source Ingestion

Extend to PubMed, PLOS, etc.:

```python
# Add to ingest_arxiv_demo.py
from Bio import Entrez  # For PubMed

def fetch_pubmed_papers(query, max_results=10):
    Entrez.email = "your@email.com"
    handle = Entrez.esearch(db="pmc", term=query, retmax=max_results)
    record = Entrez.read(handle)
    # ... fetch full-text XML
```

### 2. Persona-Driven Synthesis

Query ChromaDB via personas:

```python
# Route query through LuminAI → physicist persona → biologist persona
results = activator.query_archive("quantum tunneling")

# Generate multi-persona synthesis
synthesis = multi_persona_council.synthesize(
    query="quantum tunneling in biological systems",
    archive_results=results,
    personas=["luminai", "physicist", "biologist"]
)
```

### 3. Emergence Metrics

Instrument synthesis tracking:

```python
metrics = {
    "synthesis_depth": 3,  # physics + biology + chemistry
    "archive_nodes_activated": 12,  # papers retrieved
    "cross_field_bridges": 2,  # analogies generated
    "paradox_tensions": 1,  # conflicting theories surfaced
}
```

### 4. Scale to 10k Papers

```bash
# Full arXiv ingestion (requires ~1 hour + $10 OpenAI credits)
python scripts/archive_activation/ingest_full_arxiv.py \
  --categories physics,cs,q-bio \
  --max-papers 10000
```

## Cost Estimate

### 50-Paper Demo

- **OpenAI embeddings**: $0.002 (50 papers × 200 tokens avg × $0.00002/token)
- **ChromaDB storage**: ~5MB (negligible)
- **arXiv API**: Free, unlimited
- **Total**: ~$0.002 (effectively free)

### 10k-Paper Corpus

- **Embeddings**: $4 (10k × 200 tokens × $0.00002/token)
- **Storage**: ~1GB ChromaDB
- **Compute**: 1-2 hours (depends on rate limits)

### 100k-Paper Corpus (MVP Lyceum)

- **Embeddings**: $40 (one-time)
- **Storage**: ~10GB ChromaDB
- **Compute**: 10-20 hours ingestion

## Demo for Investors

Run this script, then:

1. Show **cross-discipline retrieval** (physicist query → biology papers)
2. Generate **multi-persona synthesis** (LuminAI + physicist + biologist)
3. Measure **emergence metrics** (synthesis depth, archive activation rate)
4. Project **scale**: "This is 50 papers. Imagine 100k. Imagine 10M."

**Pitch**: "We've proven archive activation works. Fund us to scale to 100k papers + multi-persona council orchestration. Here's the ROI model for university partnerships."

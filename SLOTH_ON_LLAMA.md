# 🦥🦙 SLOTH-ON-LLAMA: Complete AI Development Stack

**Welcome to the LuminAI containerized AI development environment!**

This setup provides a complete local AI development stack with:

- 🦙 **Ollama** for local LLM inference
- 🦥 **Unsloth** for 2x faster fine-tuning
- 🧠 **ChromaDB** for RAG vector storage
- 📚 **Jupyter Lab** for interactive development
- 🌊 **Aqueduct pipelines** for ethical data flow

## 🚀 Quick Start

### 1. Start the Full Stack

```bash
# Start all services
./scripts/docker/start-stack.sh

# Or manually with Docker Compose
docker-compose up -d
```

### 2. Download Models

```bash
# Interactive model selection
./scripts/docker/pull-models.sh

# Or manually download specific models
docker-compose exec ollama ollama pull llama3.2:3b
docker-compose exec ollama ollama pull codellama:7b
```

### 3. Access Services

- 🦙 **Ollama API**: <http://localhost:11434>
- 🧠 **ChromaDB**: <http://localhost:8002>  
- 📚 **Jupyter Lab**: <http://localhost:8888> (token: `luminai_sloth_mode`)
- 🚀 **Backend API**: <http://localhost:8000>
- 🎨 **Frontend UI**: <http://localhost:3000>

### 4. Run the Demo

Open the demo notebook in Jupyter Lab:

```
notebooks/sloth-on-llama-demo.ipynb
```

## 📁 Stack Architecture

```
luminai-codex/
├── docker-compose.yml           # Multi-service orchestration
├── docker/
│   └── Dockerfile.jupyter       # Jupyter container with AI packages
├── scripts/docker/
│   ├── start-stack.sh          # Orchestration script
│   └── pull-models.sh          # Model management
├── notebooks/
│   └── sloth-on-llama-demo.ipynb  # Interactive demo
└── src/tec_tgcr/               # Python agent framework
```

## 🛠️ Services Overview

| Service | Port | Purpose |
|---------|------|---------|
| Ollama | 11434 | Local LLM inference engine |
| Unsloth | 8001 | Fast fine-tuning service |
| ChromaDB | 8002 | Vector database for RAG |
| Jupyter | 8888 | Interactive development |
| PostgreSQL | 5432 | Persistent data storage |
| Redis | 6379 | Caching and queues |
| Backend | 8000 | FastAPI application |
| Frontend | 3000 | React UI |

## 🧠 Key Features

### 🦙 Local LLM Inference

- Multiple model support (Llama, CodeLlama, Mistral, etc.)
- No API keys required for inference
- Full privacy and control

### 🦥 Lightning-Fast Fine-tuning

- Unsloth integration for 2x speed improvement
- 50% memory reduction
- Export to Ollama format

### 🧠 RAG System Integration

- ChromaDB vector storage
- Sentence Transformers embeddings
- Multi-document ingestion

### 🌊 Aqueduct Data Pipelines

- Springs → Channels → Gates → Cisterns → Fountains
- Consent-first data processing
- Ethical checkpoints at each stage

### 🎾 Multi-LLM Bouncing

- Query multiple models simultaneously
- Synthesize responses intelligently
- RAG-enhanced prompting

## 🔧 Development Workflow

### Train a Custom Model

```bash
# 1. Prepare training data
echo '{"instruction": "What is TGCR?", "output": "TGCR is..."}' > dataset.jsonl

# 2. Fine-tune with Unsloth
docker-compose exec unsloth python train.py --dataset dataset.jsonl

# 3. Export to Ollama
docker-compose exec unsloth python export_ollama.py --model fine_tuned_model

# 4. Use in Ollama
docker-compose exec ollama ollama run fine_tuned_model
```

### Build RAG Dataset

```python
# In Jupyter notebook
from tec_tgcr.rag_system import get_rag_system

rag = get_rag_system()
rag.ingest_documents("path/to/documents/")
results = rag.query("What is consciousness?")
```

### Create Aqueduct Pipeline

```python
# In Jupyter notebook
from notebooks.sloth_on_llama_demo import AqueductPipeline

aqueduct = AqueductPipeline("My Pipeline")
result = aqueduct.flow("My data with consent")
```

## 📊 Monitoring & Debugging

### Check Service Health

```bash
# View all service logs
docker-compose logs -f

# Check specific service
docker-compose logs -f ollama
docker-compose logs -f chromadb

# Service status
docker-compose ps
```

### Access Containers

```bash
# Ollama container
docker-compose exec ollama bash

# Jupyter container (Python environment)
docker-compose exec jupyter bash

# Database
docker-compose exec postgres psql -U luminai
```

### Performance Monitoring

- Ollama metrics: <http://localhost:11434/api/ps>
- ChromaDB health: <http://localhost:8002/api/v1/heartbeat>
- PostgreSQL stats: Connect via `psql` and run `\l`

## 🔐 Security & Privacy

### Data Privacy

- All models run locally (no external API calls)
- ChromaDB data stays on your machine
- Aqueduct consent verification at each step

### Secret Management

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your settings
nano .env.local

# Never commit .env.local to git!
```

## 🎯 Next Steps

1. **🔥 Experiment** with the demo notebook
2. **📚 Add your documents** to ChromaDB for RAG
3. **🦥 Fine-tune models** for your specific use cases
4. **🌊 Build aqueduct pipelines** for your data flows
5. **🧠 Integrate with agents** in `src/tec_tgcr/agents/`

## 🐛 Troubleshooting

### Models not downloading?

```bash
# Check Ollama connectivity
curl http://localhost:11434/api/tags

# Manual model pull
docker-compose exec ollama ollama pull llama3.2:3b
```

### ChromaDB connection issues?

```bash
# Check ChromaDB health
curl http://localhost:8002/api/v1/heartbeat

# Restart ChromaDB
docker-compose restart chromadb
```

### Jupyter not accessible?

```bash
# Check Jupyter logs
docker-compose logs jupyter

# Get Jupyter token
docker-compose exec jupyter jupyter server list
```

### Out of disk space?

```bash
# Clean up Docker
docker system prune -f

# Remove unused models
docker-compose exec ollama ollama rm unused_model
```

## 🤝 Contributing

1. Fork the repository
2. Make your changes
3. Test with the demo notebook
4. Submit a pull request

---

**🎉 Happy building with your SLOTH-ON-LLAMA stack!**

*The aqueducts are flowing, the llamas are running, and the sloth is optimally lazy! 🦥✨*

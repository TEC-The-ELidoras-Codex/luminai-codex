#!/bin/bash

# 🦥🦙 LuminAI SLOTH-ON-LLAMA Docker Stack Manager
# Run this to unleash the full AI development environment

set -e

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🦥🦙 SLOTH-ON-LLAMA STACK STARTING...${NC}"

# Function to print colored status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

print_status "Docker is running"

# Create directories if they don't exist
mkdir -p data models notebooks fine_tuning

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        print_warning "Created .env.local from .env.example - please update with your API keys"
    fi
fi

# Build and start the services
print_info "Building and starting services..."

# Start core services first
docker-compose up -d postgres redis chromadb

print_status "Database services started"

# Wait for databases to be ready
print_info "Waiting for databases to initialize..."
sleep 10

# Start AI services
docker-compose up -d ollama unsloth

print_status "AI services starting..."

# Wait for Ollama to be ready
print_info "Waiting for Ollama to initialize..."
sleep 15

# Pull some useful models
print_info "Pulling essential models..."
docker-compose exec ollama ollama pull llama3.2:3b
docker-compose exec ollama ollama pull codellama:7b
docker-compose exec ollama ollama pull mistral:7b

print_status "Base models downloaded"

# Start development services
docker-compose up -d jupyter backend frontend

print_info "Starting development services..."
sleep 5

# Show status
echo
echo -e "${PURPLE}🎉 SLOTH-ON-LLAMA STACK IS READY!${NC}"
echo
echo -e "${GREEN}📊 Services:${NC}"
echo -e "  🦙 Ollama LLM Server:    http://localhost:11434"
echo -e "  🦥 Unsloth Fine-tuning: http://localhost:8001"
echo -e "  🧠 ChromaDB (RAG):      http://localhost:8002"
echo -e "  📚 Jupyter Lab:         http://localhost:8888 (token: luminai_sloth_mode)"
echo -e "  🚀 Backend API:         http://localhost:8000"
echo -e "  🎨 Frontend UI:         http://localhost:3000"
echo -e "  🗄️ PostgreSQL:          localhost:5432 (user: luminai, pass: luminai)"
echo -e "  ⚡ Redis:               localhost:6379"
echo

echo -e "${BLUE}🔧 Quick Commands:${NC}"
echo -e "  ./scripts/docker/pull-models.sh    - Download more LLM models"
echo -e "  ./scripts/docker/logs.sh           - View all service logs"
echo -e "  ./scripts/docker/shell.sh          - Get shell in dev container"
echo -e "  docker-compose down                 - Stop all services"
echo -e "  docker-compose logs -f [service]    - Follow logs for specific service"
echo

echo -e "${GREEN}🧪 Next Steps:${NC}"
echo -e "  1. Open Jupyter Lab: http://localhost:8888"
echo -e "  2. Start a new notebook in /notebooks/"
echo -e "  3. Test the RAG system with ChromaDB"
echo -e "  4. Fine-tune models with Unsloth"
echo -e "  5. Build aqueduct pipelines for your data flows!"
echo

print_status "Ready for AI development! 🦥🦙✨"
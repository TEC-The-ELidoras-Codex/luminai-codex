#!/bin/bash

# 🦙 Model Puller for Ollama
# Downloads useful models for LuminAI development

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🦙 DOWNLOADING LLAMA MODELS...${NC}"

# Check if Ollama is running
if ! docker-compose ps ollama | grep -q "Up"; then
    echo -e "${RED}❌ Ollama container is not running. Start the stack first with ./scripts/docker/start-stack.sh${NC}"
    exit 1
fi

models=(
    "llama3.2:1b"        # Tiny but fast
    "llama3.2:3b"        # Good balance  
    "codellama:7b"       # Code generation
    "mistral:7b"         # Alternative perspective
    "phi3.5:3.8b"        # Microsoft's compact model
    "qwen2.5:3b"         # Multilingual
    "gemma2:2b"          # Google's efficient model
)

echo -e "${BLUE}📦 Available models to download:${NC}"
for i in "${!models[@]}"; do
    echo "  $((i+1)). ${models[$i]}"
done
echo "  a. All models"
echo "  q. Quit"

read -p "Choose models to download (1-${#models[@]}, a, or q): " choice

case $choice in
    [1-7])
        idx=$((choice-1))
        model=${models[$idx]}
        echo -e "${GREEN}📥 Downloading $model...${NC}"
        docker-compose exec ollama ollama pull "$model"
        ;;
    [aA])
        echo -e "${GREEN}📥 Downloading ALL models (this will take a while)...${NC}"
        for model in "${models[@]}"; do
            echo -e "${BLUE}📦 Pulling $model...${NC}"
            docker-compose exec ollama ollama pull "$model"
        done
        ;;
    [qQ])
        echo "Goodbye! 🦙"
        exit 0
        ;;
    *)
        echo "Invalid choice. Please run again."
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Model download complete!${NC}"
echo -e "${BLUE}📋 List all models: docker-compose exec ollama ollama list${NC}"
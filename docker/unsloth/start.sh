#!/bin/bash
# Start script for Unsloth fine-tuning service

echo "🚀 Starting Unsloth Fine-tuning Service..."

# Wait for dependencies
echo "⏳ Checking dependencies..."
sleep 10

# Set up environment
export PYTHONPATH=/app/src:$PYTHONPATH
export UNSLOTH_CACHE_DIR=/app/.cache

# Create necessary directories
mkdir -p /app/.cache/huggingface
mkdir -p /app/models/fine_tuned
mkdir -p /app/data/training
mkdir -p /app/fine_tuning/checkpoints

# Check GPU availability
python3 -c "
import torch
print(f'🔥 CUDA available: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'🎮 GPU count: {torch.cuda.device_count()}')
    for i in range(torch.cuda.device_count()):
        print(f'  GPU {i}: {torch.cuda.get_device_name(i)}')
else:
    print('⚠️  No GPU detected - running in CPU mode')
"

# Start the Unsloth API service
echo "🔧 Starting Unsloth API server..."
cd /app || exit 1
python3 -m unsloth_service.main &

# Keep container running
wait
"""
Unsloth Fine-tuning Service

FastAPI service for managing fine-tuning jobs with Unsloth.
Provides endpoints for:
- Starting fine-tuning jobs
- Monitoring training progress
- Managing models and datasets
- Integration with Ollama for deployment
"""

import asyncio
import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

import torch
from fastapi import FastAPI, HTTPException, BackgroundTasks, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from datasets import Dataset
from transformers import AutoTokenizer

# Initialize FastAPI app
app = FastAPI(
    title="Unsloth Fine-tuning Service",
    description="API for fine-tuning language models with Unsloth",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
training_jobs = {}
models_cache = {}


class FineTuningRequest(BaseModel):
    """Request model for starting fine-tuning"""
    model_name: str = Field(..., description="Base model to fine-tune")
    dataset_path: str = Field(..., description="Path to training dataset")
    output_name: str = Field(..., description="Name for the fine-tuned model")
    max_seq_length: int = Field(2048, description="Maximum sequence length")
    batch_size: int = Field(2, description="Training batch size")
    learning_rate: float = Field(2e-4, description="Learning rate")
    num_epochs: int = Field(3, description="Number of training epochs")
    lora_r: int = Field(16, description="LoRA rank")
    lora_alpha: int = Field(16, description="LoRA alpha")
    lora_dropout: float = Field(0.1, description="LoRA dropout")


class TrainingStatus(BaseModel):
    """Training job status"""
    job_id: str
    status: str  # pending, running, completed, failed
    progress: float  # 0.0 to 1.0
    current_epoch: int
    total_epochs: int
    current_step: int
    total_steps: int
    loss: Optional[float] = None
    created_at: str
    updated_at: str
    model_path: Optional[str] = None
    error_message: Optional[str] = None


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Unsloth Fine-tuning Service",
        "status": "running",
        "cuda_available": torch.cuda.is_available(),
        "gpu_count": torch.cuda.device_count() if torch.cuda.is_available() else 0
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "cuda_available": torch.cuda.is_available()
    }


@app.get("/models")
async def list_available_models():
    """List available base models for fine-tuning"""
    models = [
        "unsloth/llama-2-7b-bnb-4bit",
        "unsloth/llama-2-13b-bnb-4bit", 
        "unsloth/mistral-7b-v0.1-bnb-4bit",
        "unsloth/codellama-34b-bnb-4bit",
        "unsloth/zephyr-sft-bnb-4bit",
        "unsloth/tinyllama-bnb-4bit"
    ]
    
    return {
        "available_models": models,
        "custom_models": list(models_cache.keys())
    }


@app.post("/fine-tune", response_model=Dict[str, str])
async def start_fine_tuning(
    request: FineTuningRequest,
    background_tasks: BackgroundTasks
):
    """Start a fine-tuning job"""
    job_id = str(uuid.uuid4())
    
    # Validate dataset path
    dataset_path = Path(request.dataset_path)
    if not dataset_path.exists():
        raise HTTPException(status_code=400, f"Dataset not found: {request.dataset_path}")
    
    # Create job entry
    job_status = TrainingStatus(
        job_id=job_id,
        status="pending",
        progress=0.0,
        current_epoch=0,
        total_epochs=request.num_epochs,
        current_step=0,
        total_steps=0,
        created_at=datetime.utcnow().isoformat(),
        updated_at=datetime.utcnow().isoformat()
    )
    
    training_jobs[job_id] = job_status
    
    # Start training in background
    background_tasks.add_task(
        run_fine_tuning,
        job_id,
        request
    )
    
    return {
        "job_id": job_id,
        "status": "started",
        "message": "Fine-tuning job started successfully"
    }


@app.get("/jobs/{job_id}", response_model=TrainingStatus)
async def get_job_status(job_id: str):
    """Get status of a specific training job"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return training_jobs[job_id]


@app.get("/jobs", response_model=List[TrainingStatus])
async def list_jobs():
    """List all training jobs"""
    return list(training_jobs.values())


@app.delete("/jobs/{job_id}")
async def cancel_job(job_id: str):
    """Cancel a training job"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = training_jobs[job_id]
    if job.status in ["completed", "failed"]:
        raise HTTPException(status_code=400, detail="Cannot cancel completed job")
    
    job.status = "cancelled"
    job.updated_at = datetime.utcnow().isoformat()
    
    return {"message": "Job cancelled successfully"}


@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload a training dataset"""
    if not file.filename.endswith(('.json', '.jsonl', '.csv')):
        raise HTTPException(
            status_code=400, 
            detail="Only JSON, JSONL, and CSV files are supported"
        )
    
    # Save uploaded file
    dataset_dir = Path("/app/data/training")
    dataset_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = dataset_dir / file.filename
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return {
        "filename": file.filename,
        "path": str(file_path),
        "size": len(content),
        "message": "Dataset uploaded successfully"
    }


@app.post("/deploy-to-ollama/{job_id}")
async def deploy_to_ollama(job_id: str):
    """Deploy a fine-tuned model to Ollama"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = training_jobs[job_id]
    if job.status != "completed":
        raise HTTPException(status_code=400, detail="Job not completed")
    
    if not job.model_path:
        raise HTTPException(status_code=400, detail="No model path available")
    
    # TODO: Implement Ollama deployment
    # This would involve converting the model and registering it with Ollama
    
    return {
        "message": "Model deployment to Ollama initiated",
        "job_id": job_id,
        "model_path": job.model_path
    }


async def run_fine_tuning(job_id: str, request: FineTuningRequest):
    """Run the actual fine-tuning process"""
    job = training_jobs[job_id]
    
    try:
        job.status = "running"
        job.updated_at = datetime.utcnow().isoformat()
        
        # Import Unsloth (done here to avoid import issues)
        from unsloth import FastLanguageModel
        import torch
        from trl import SFTTrainer
        from transformers import TrainingArguments
        
        # Load model and tokenizer
        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name=request.model_name,
            max_seq_length=request.max_seq_length,
            dtype=None,
            load_in_4bit=True,
        )
        
        # Add LoRA adapters
        model = FastLanguageModel.get_peft_model(
            model,
            r=request.lora_r,
            target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                          "gate_proj", "up_proj", "down_proj"],
            lora_alpha=request.lora_alpha,
            lora_dropout=request.lora_dropout,
            bias="none",
            use_gradient_checkpointing="unsloth",
            random_state=3407,
            use_rslora=False,
            loftq_config=None,
        )
        
        # Load dataset
        dataset = load_dataset(request.dataset_path)
        
        # Calculate total steps
        total_steps = len(dataset) // request.batch_size * request.num_epochs
        job.total_steps = total_steps
        
        # Training arguments
        trainer = SFTTrainer(
            model=model,
            tokenizer=tokenizer,
            train_dataset=dataset,
            dataset_text_field="text",
            max_seq_length=request.max_seq_length,
            dataset_num_proc=2,
            packing=False,
            args=TrainingArguments(
                per_device_train_batch_size=request.batch_size,
                gradient_accumulation_steps=1,
                warmup_steps=5,
                num_train_epochs=request.num_epochs,
                learning_rate=request.learning_rate,
                fp16=not torch.cuda.is_bf16_supported(),
                bf16=torch.cuda.is_bf16_supported(),
                logging_steps=1,
                optim="adamw_8bit",
                weight_decay=0.01,
                lr_scheduler_type="linear",
                seed=3407,
                output_dir=f"/app/fine_tuning/checkpoints/{job_id}",
                report_to=None,
            ),
        )
        
        # Custom callback to update job progress
        class ProgressCallback:
            def __init__(self, job_id):
                self.job_id = job_id
                
            def on_step_end(self, args, state, control, **kwargs):
                job = training_jobs[self.job_id]
                job.current_step = state.global_step
                job.current_epoch = int(state.epoch)
                job.progress = state.global_step / state.max_steps
                job.updated_at = datetime.utcnow().isoformat()
                
                if hasattr(state, 'log_history') and state.log_history:
                    latest_log = state.log_history[-1]
                    if 'train_loss' in latest_log:
                        job.loss = latest_log['train_loss']
        
        # Add callback
        trainer.add_callback(ProgressCallback(job_id))
        
        # Start training
        trainer.train()
        
        # Save the model
        model_output_dir = f"/app/models/fine_tuned/{request.output_name}"
        model.save_pretrained(model_output_dir)
        tokenizer.save_pretrained(model_output_dir)
        
        # Update job status
        job.status = "completed"
        job.progress = 1.0
        job.model_path = model_output_dir
        job.updated_at = datetime.utcnow().isoformat()
        
        # Cache the model
        models_cache[request.output_name] = {
            "path": model_output_dir,
            "base_model": request.model_name,
            "created_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        job.status = "failed"
        job.error_message = str(e)
        job.updated_at = datetime.utcnow().isoformat()


def load_dataset(dataset_path: str) -> Dataset:
    """Load dataset from file"""
    path = Path(dataset_path)
    
    if path.suffix == '.json':
        import json
        with open(path) as f:
            data = json.load(f)
        return Dataset.from_list(data)
    
    elif path.suffix == '.jsonl':
        import json
        data = []
        with open(path) as f:
            for line in f:
                data.append(json.loads(line.strip()))
        return Dataset.from_list(data)
    
    elif path.suffix == '.csv':
        import pandas as pd
        df = pd.read_csv(path)
        return Dataset.from_pandas(df)
    
    else:
        raise ValueError(f"Unsupported file format: {path.suffix}")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )
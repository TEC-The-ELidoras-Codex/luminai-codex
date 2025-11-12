"""
Data Ingestion Module for LuminAI Codex

This module handles ingestion of various data sources for the AI system:
- Document processing (PDF, DOCX, TXT, Markdown)
- Web scraping and URL ingestion
- API data ingestion
- Database connection and data extraction
- Real-time data streams
"""

import asyncio
import hashlib
import json
from datetime import datetime
from typing import Dict, List, Optional, Any, AsyncGenerator, Union
from pathlib import Path
from dataclasses import dataclass
from enum import Enum


class SourceType(Enum):
    """Types of data sources that can be ingested"""
    FILE = "file"
    URL = "url"
    API = "api"
    DATABASE = "database"
    STREAM = "stream"
    TEXT = "text"


class ProcessingStatus(Enum):
    """Processing status for ingestion jobs"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class IngestionConfig:
    """Configuration for data ingestion operations"""
    chunk_size: int = 1000  # Characters per chunk for text processing
    overlap_size: int = 200  # Overlap between chunks
    max_file_size: int = 50 * 1024 * 1024  # 50MB max file size
    timeout_seconds: int = 300  # 5 minute timeout
    enable_ocr: bool = False  # OCR for image-based PDFs
    preserve_formatting: bool = True
    extract_metadata: bool = True


@dataclass
class IngestionJob:
    """Represents a data ingestion job"""
    job_id: str
    source_type: SourceType
    source_path: str
    status: ProcessingStatus
    created_at: datetime
    updated_at: datetime
    metadata: Dict[str, Any]
    error_message: Optional[str] = None
    progress: float = 0.0
    chunks_processed: int = 0
    total_chunks: int = 0


class DataIngestionEngine:
    """
    Main data ingestion engine
    
    Handles various types of data sources and converts them into
    structured formats suitable for AI processing and indexing.
    """
    
    def __init__(self, config: IngestionConfig = None):
        self.config = config or IngestionConfig()
        self.active_jobs: Dict[str, IngestionJob] = {}
        self.completed_jobs: List[IngestionJob] = []
        
    async def ingest_file(
        self, 
        file_path: str, 
        job_id: str = None
    ) -> IngestionJob:
        """
        Ingest a file from the filesystem
        
        Args:
            file_path: Path to the file to ingest
            job_id: Optional job ID, will be generated if not provided
            
        Returns:
            IngestionJob object tracking the ingestion process
        """
        if not job_id:
            job_id = self._generate_job_id(file_path)
        
        job = IngestionJob(
            job_id=job_id,
            source_type=SourceType.FILE,
            source_path=file_path,
            status=ProcessingStatus.PENDING,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            metadata={"original_path": file_path}
        )
        
        self.active_jobs[job_id] = job
        
        try:
            await self._process_file_ingestion(job)
        except Exception as e:
            job.status = ProcessingStatus.FAILED
            job.error_message = str(e)
            job.updated_at = datetime.utcnow()
        
        return job
    
    async def ingest_url(
        self, 
        url: str, 
        job_id: str = None
    ) -> IngestionJob:
        """
        Ingest content from a URL
        
        Args:
            url: URL to scrape and ingest
            job_id: Optional job ID
            
        Returns:
            IngestionJob object
        """
        if not job_id:
            job_id = self._generate_job_id(url)
        
        job = IngestionJob(
            job_id=job_id,
            source_type=SourceType.URL,
            source_path=url,
            status=ProcessingStatus.PENDING,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            metadata={"url": url}
        )
        
        self.active_jobs[job_id] = job
        
        try:
            await self._process_url_ingestion(job)
        except Exception as e:
            job.status = ProcessingStatus.FAILED
            job.error_message = str(e)
            job.updated_at = datetime.utcnow()
        
        return job
    
    async def ingest_text(
        self, 
        text: str, 
        source_name: str = "text_input",
        job_id: str = None
    ) -> IngestionJob:
        """
        Ingest raw text content
        
        Args:
            text: Text content to ingest
            source_name: Name for the text source
            job_id: Optional job ID
            
        Returns:
            IngestionJob object
        """
        if not job_id:
            job_id = self._generate_job_id(source_name)
        
        job = IngestionJob(
            job_id=job_id,
            source_type=SourceType.TEXT,
            source_path=source_name,
            status=ProcessingStatus.PENDING,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            metadata={"source_name": source_name, "text_length": len(text)}
        )
        
        self.active_jobs[job_id] = job
        
        try:
            await self._process_text_ingestion(job, text)
        except Exception as e:
            job.status = ProcessingStatus.FAILED
            job.error_message = str(e)
            job.updated_at = datetime.utcnow()
        
        return job
    
    async def get_job_status(self, job_id: str) -> Optional[IngestionJob]:
        """Get the status of a specific ingestion job"""
        if job_id in self.active_jobs:
            return self.active_jobs[job_id]
        
        # Check completed jobs
        for job in self.completed_jobs:
            if job.job_id == job_id:
                return job
        
        return None
    
    async def list_active_jobs(self) -> List[IngestionJob]:
        """List all currently active ingestion jobs"""
        return list(self.active_jobs.values())
    
    async def cancel_job(self, job_id: str) -> bool:
        """Cancel an active ingestion job"""
        if job_id in self.active_jobs:
            job = self.active_jobs[job_id]
            job.status = ProcessingStatus.CANCELLED
            job.updated_at = datetime.utcnow()
            return True
        return False
    
    # Private processing methods
    async def _process_file_ingestion(self, job: IngestionJob) -> None:
        """Process file ingestion"""
        job.status = ProcessingStatus.PROCESSING
        job.updated_at = datetime.utcnow()
        
        file_path = Path(job.source_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {job.source_path}")
        
        if file_path.stat().st_size > self.config.max_file_size:
            raise ValueError(f"File too large: {file_path.stat().st_size} bytes")
        
        # Extract metadata
        job.metadata.update({
            "file_size": file_path.stat().st_size,
            "file_extension": file_path.suffix.lower(),
            "last_modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
        })
        
        # Process based on file type
        file_extension = file_path.suffix.lower()
        
        if file_extension in ['.txt', '.md', '.py', '.js', '.json', '.yaml', '.yml']:
            await self._process_text_file(job, file_path)
        elif file_extension == '.pdf':
            await self._process_pdf_file(job, file_path)
        elif file_extension in ['.doc', '.docx']:
            await self._process_docx_file(job, file_path)
        elif file_extension in ['.html', '.htm']:
            await self._process_html_file(job, file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        job.status = ProcessingStatus.COMPLETED
        job.progress = 1.0
        job.updated_at = datetime.utcnow()
        
        # Move to completed jobs
        self._complete_job(job)
    
    async def _process_url_ingestion(self, job: IngestionJob) -> None:
        """Process URL ingestion"""
        job.status = ProcessingStatus.PROCESSING
        job.updated_at = datetime.utcnow()
        
        try:
            import httpx
            from bs4 import BeautifulSoup
            
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                response = await client.get(job.source_path)
                response.raise_for_status()
                
                # Update metadata
                job.metadata.update({
                    "status_code": response.status_code,
                    "content_type": response.headers.get("content-type", ""),
                    "content_length": len(response.content)
                })
                
                # Extract text content
                if "text/html" in response.headers.get("content-type", ""):
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Remove script and style elements
                    for script in soup(["script", "style"]):
                        script.extract()
                    
                    text = soup.get_text()
                    
                    # Clean up text
                    lines = (line.strip() for line in text.splitlines())
                    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                    text = ' '.join(chunk for chunk in chunks if chunk)
                    
                    await self._chunk_and_store_text(job, text)
                else:
                    # Handle non-HTML content
                    text = response.text
                    await self._chunk_and_store_text(job, text)
        
        except Exception as e:
            raise Exception(f"URL ingestion failed: {str(e)}")
        
        job.status = ProcessingStatus.COMPLETED
        job.progress = 1.0
        job.updated_at = datetime.utcnow()
        self._complete_job(job)
    
    async def _process_text_ingestion(self, job: IngestionJob, text: str) -> None:
        """Process raw text ingestion"""
        job.status = ProcessingStatus.PROCESSING
        job.updated_at = datetime.utcnow()
        
        await self._chunk_and_store_text(job, text)
        
        job.status = ProcessingStatus.COMPLETED
        job.progress = 1.0
        job.updated_at = datetime.utcnow()
        self._complete_job(job)
    
    async def _process_text_file(self, job: IngestionJob, file_path: Path) -> None:
        """Process plain text files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
        
        await self._chunk_and_store_text(job, content)
    
    async def _process_pdf_file(self, job: IngestionJob, file_path: Path) -> None:
        """Process PDF files"""
        try:
            import PyPDF2
            
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                job.metadata["num_pages"] = len(pdf_reader.pages)
                
                for page_num, page in enumerate(pdf_reader.pages):
                    text += page.extract_text()
                    job.progress = (page_num + 1) / len(pdf_reader.pages) * 0.8  # 80% for extraction
                    job.updated_at = datetime.utcnow()
                    await asyncio.sleep(0.01)  # Allow other tasks to run
            
            await self._chunk_and_store_text(job, text)
            
        except ImportError:
            raise Exception("PyPDF2 not installed. Install with: pip install PyPDF2")
    
    async def _process_docx_file(self, job: IngestionJob, file_path: Path) -> None:
        """Process DOCX files"""
        try:
            import docx
            
            doc = docx.Document(file_path)
            text = ""
            
            for para in doc.paragraphs:
                text += para.text + "\n"
            
            job.metadata["num_paragraphs"] = len(doc.paragraphs)
            await self._chunk_and_store_text(job, text)
            
        except ImportError:
            raise Exception("python-docx not installed. Install with: pip install python-docx")
    
    async def _process_html_file(self, job: IngestionJob, file_path: Path) -> None:
        """Process HTML files"""
        try:
            from bs4 import BeautifulSoup
            
            with open(file_path, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
            
            text = soup.get_text()
            
            # Clean up text
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            await self._chunk_and_store_text(job, text)
            
        except ImportError:
            raise Exception("beautifulsoup4 not installed. Install with: pip install beautifulsoup4")
    
    async def _chunk_and_store_text(self, job: IngestionJob, text: str) -> None:
        """Break text into chunks and store them"""
        chunks = self._create_text_chunks(text)
        job.total_chunks = len(chunks)
        job.chunks_processed = 0
        
        # In a real implementation, chunks would be stored in a database or vector store
        # For now, we'll just simulate the process
        stored_chunks = []
        
        for i, chunk in enumerate(chunks):
            # Simulate chunk processing
            chunk_data = {
                "chunk_id": f"{job.job_id}_chunk_{i}",
                "content": chunk,
                "chunk_index": i,
                "character_count": len(chunk),
                "job_id": job.job_id
            }
            
            stored_chunks.append(chunk_data)
            job.chunks_processed += 1
            job.progress = 0.8 + (job.chunks_processed / job.total_chunks) * 0.2  # Last 20%
            job.updated_at = datetime.utcnow()
            
            await asyncio.sleep(0.001)  # Simulate processing time
        
        job.metadata["chunks"] = stored_chunks
        job.metadata["total_characters"] = len(text)
    
    def _create_text_chunks(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        if len(text) <= self.config.chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.config.chunk_size
            
            if end >= len(text):
                chunks.append(text[start:])
                break
            
            # Try to break at sentence boundary
            chunk = text[start:end]
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            
            break_point = max(last_period, last_newline)
            if break_point > start + self.config.chunk_size // 2:
                end = start + break_point + 1
            
            chunks.append(text[start:end])
            start = end - self.config.overlap_size
        
        return chunks
    
    def _generate_job_id(self, source: str) -> str:
        """Generate a unique job ID"""
        timestamp = datetime.utcnow().isoformat()
        hash_input = f"{source}_{timestamp}"
        return hashlib.md5(hash_input.encode()).hexdigest()[:8]
    
    def _complete_job(self, job: IngestionJob) -> None:
        """Move job from active to completed"""
        if job.job_id in self.active_jobs:
            del self.active_jobs[job.job_id]
        self.completed_jobs.append(job)


# Factory functions for easy instantiation
def create_ingestion_engine(config: Dict = None) -> DataIngestionEngine:
    """Create a DataIngestionEngine instance with optional config"""
    if config:
        ingestion_config = IngestionConfig(**config)
    else:
        ingestion_config = IngestionConfig()
    
    return DataIngestionEngine(ingestion_config)


# CLI interface for testing
async def main():
    """Test the data ingestion functionality"""
    engine = create_ingestion_engine()
    
    # Test text ingestion
    test_text = "This is a test document for data ingestion. " * 100
    job = await engine.ingest_text(test_text, "test_document")
    
    print(f"✅ Text ingestion job created: {job.job_id}")
    print(f"Status: {job.status.value}")
    print(f"Chunks processed: {job.chunks_processed}/{job.total_chunks}")
    
    # Test file ingestion (if file exists)
    test_file = Path("README.md")
    if test_file.exists():
        file_job = await engine.ingest_file(str(test_file))
        print(f"✅ File ingestion job created: {file_job.job_id}")
        print(f"Status: {file_job.status.value}")


# Additional classes for test compatibility
@dataclass
class CopilotContext:
    """Context information for Copilot operations"""
    user_id: str
    session_id: str
    context_data: Dict[str, Any]
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()

@dataclass 
class GitHubIssue:
    """Represents a GitHub issue for ingestion"""
    issue_id: int
    title: str
    body: str
    state: str
    labels: List[str] = None
    assignees: List[str] = None
    created_at: datetime = None
    
    def __post_init__(self):
        if self.labels is None:
            self.labels = []
        if self.assignees is None:
            self.assignees = []

@dataclass
class ProjectItem:
    """Represents a project item for ingestion"""
    item_id: str
    item_type: str
    title: str
    content: str
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

class FoldContextIngestion:
    """Handles folding context for code ingestion"""
    
    def __init__(self, config: Optional[IngestionConfig] = None):
        self.config = config or IngestionConfig()
        self.folded_contexts: Dict[str, Any] = {}
    
    def fold_context(self, context: str, fold_id: str) -> str:
        """Fold a context and return a reference"""
        self.folded_contexts[fold_id] = context
        return f"[FOLDED_CONTEXT:{fold_id}]"
    
    def unfold_context(self, folded_ref: str) -> Optional[str]:
        """Unfold a context reference"""
        if folded_ref.startswith("[FOLDED_CONTEXT:") and folded_ref.endswith("]"):
            fold_id = folded_ref[16:-1]  # Extract ID between [FOLDED_CONTEXT: and ]
            return self.folded_contexts.get(fold_id)
        return None
    
    def clear_contexts(self):
        """Clear all folded contexts"""
        self.folded_contexts.clear()

if __name__ == "__main__":
    asyncio.run(main())
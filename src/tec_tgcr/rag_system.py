"""
🔍 RAG SYSTEM - NEVER FORGET!

Retrieval Augmented Generation system that enhances all AI responses
with relevant context from the knowledge base.

IMPORTANT: This integrates with multi-LLM system for enhanced responses!
"""

import os
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import asyncio
import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np

logger = logging.getLogger(__name__)

@dataclass
class RAGContext:
    """Context retrieved for RAG enhancement"""
    text: str
    source: str
    score: float
    metadata: Dict[str, Any]

@dataclass
class RAGQuery:
    """Query for RAG retrieval"""
    query: str
    top_k: int = 5
    threshold: float = 0.7
    filters: Dict[str, Any] = None

class RAGSystem:
    """
    RAG System for LuminAI Codex
    
    Features:
    - ChromaDB for vector storage
    - Sentence transformers for embeddings
    - Integration with multi-LLM chat
    - Real-time knowledge retrieval
    - Context scoring and filtering
    """
    
    def __init__(self, 
                 collection_name: str = "luminai_knowledge",
                 model_name: str = "all-MiniLM-L6-v2",
                 persist_directory: str = "./data/rag_db"):
        self.collection_name = collection_name
        self.model_name = model_name
        self.persist_directory = persist_directory
        
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.chroma_client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        
        # Initialize sentence transformer
        self.encoder = SentenceTransformer(model_name)
        
        logger.info(f"🔍 RAG System initialized with {self.collection.count()} documents")

    async def add_document(self, 
                          text: str, 
                          source: str, 
                          metadata: Dict[str, Any] = None) -> str:
        """Add a document to the RAG knowledge base"""
        try:
            # Generate embedding
            embedding = self.encoder.encode(text).tolist()
            
            # Create unique ID
            doc_id = f"{source}_{hash(text)}"
            
            # Add to ChromaDB
            self.collection.add(
                embeddings=[embedding],
                documents=[text],
                metadatas=[{
                    "source": source,
                    "added_at": str(asyncio.get_event_loop().time()),
                    **(metadata or {})
                }],
                ids=[doc_id]
            )
            
            logger.info(f"📚 Added document from {source}")
            return doc_id
            
        except Exception as e:
            logger.error(f"❌ Failed to add document: {e}")
            raise

    async def query(self, query: RAGQuery) -> List[RAGContext]:
        """Query the RAG knowledge base"""
        try:
            # Generate query embedding
            query_embedding = self.encoder.encode(query.query).tolist()
            
            # Query ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=query.top_k,
                where=query.filters
            )
            
            contexts = []
            if results['documents'] and results['documents'][0]:
                for i, (doc, metadata, distance) in enumerate(zip(
                    results['documents'][0],
                    results['metadatas'][0],
                    results['distances'][0]
                )):
                    # Convert distance to similarity score
                    score = 1 - distance
                    
                    if score >= query.threshold:
                        contexts.append(RAGContext(
                            text=doc,
                            source=metadata.get('source', 'unknown'),
                            score=score,
                            metadata=metadata
                        ))
            
            logger.info(f"🔍 Retrieved {len(contexts)} relevant contexts")
            return contexts
            
        except Exception as e:
            logger.error(f"❌ RAG query failed: {e}")
            return []

    async def enhance_prompt(self, 
                           original_prompt: str, 
                           conversation_history: List[Dict] = None) -> str:
        """
        Enhance a prompt with RAG context
        
        INTEGRATION POINT: Use this in multi-LLM system!
        """
        try:
            # Get relevant context
            contexts = await self.query(RAGQuery(
                query=original_prompt,
                top_k=3,
                threshold=0.6
            ))
            
            if not contexts:
                return original_prompt
            
            # Build enhanced prompt
            context_text = "\n\n".join([
                f"📚 Context from {ctx.source} (relevance: {ctx.score:.2f}):\n{ctx.text}"
                for ctx in contexts
            ])
            
            enhanced_prompt = f"""Based on the following relevant context, please provide a comprehensive response:

{context_text}

Original query: {original_prompt}

Please incorporate the above context into your response while maintaining accuracy and citing sources when relevant."""

            logger.info(f"✨ Enhanced prompt with {len(contexts)} contexts")
            return enhanced_prompt
            
        except Exception as e:
            logger.error(f"❌ Prompt enhancement failed: {e}")
            return original_prompt

    async def ingest_directory(self, directory_path: str) -> int:
        """Ingest all documents from a directory"""
        count = 0
        
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                if file.endswith(('.md', '.txt', '.py', '.js', '.ts')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        await self.add_document(
                            text=content,
                            source=file_path,
                            metadata={
                                'file_type': file.split('.')[-1],
                                'file_size': len(content)
                            }
                        )
                        count += 1
                        
                    except Exception as e:
                        logger.warning(f"⚠️ Failed to ingest {file_path}: {e}")
        
        logger.info(f"📚 Ingested {count} documents from {directory_path}")
        return count

    def get_stats(self) -> Dict[str, Any]:
        """Get RAG system statistics"""
        try:
            count = self.collection.count()
            return {
                "document_count": count,
                "collection_name": self.collection_name,
                "model": self.model_name,
                "status": "operational" if count > 0 else "empty"
            }
        except Exception as e:
            logger.error(f"❌ Failed to get stats: {e}")
            return {"status": "error", "error": str(e)}


# Global RAG instance for easy access
_rag_instance = None

def get_rag_system() -> RAGSystem:
    """Get global RAG system instance"""
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = RAGSystem()
    return _rag_instance

async def enhance_multi_llm_prompt(prompt: str, conversation_history: List = None) -> str:
    """
    INTEGRATION HELPER: Enhance prompts for multi-LLM system
    
    Use this in your multi-LLM chat to add RAG context!
    """
    rag = get_rag_system()
    return await rag.enhance_prompt(prompt, conversation_history)


# CLI for testing RAG system
if __name__ == "__main__":
    import asyncio
    
    async def test_rag():
        print("🔍 Testing RAG System...")
        
        rag = RAGSystem()
        
        # Add some test documents
        await rag.add_document(
            "LuminAI Codex is a consciousness-respecting AI platform",
            "README.md"
        )
        
        await rag.add_document(
            "The TGCR equation: R = ∇Φᴱ · (φᵗ × ψʳ) represents resonance calculation",
            "resonance_thesis.md"
        )
        
        # Test query
        contexts = await rag.query(RAGQuery("What is LuminAI?"))
        
        print(f"Found {len(contexts)} relevant contexts:")
        for ctx in contexts:
            print(f"  - {ctx.source}: {ctx.score:.2f} - {ctx.text[:100]}...")
        
        # Test prompt enhancement
        enhanced = await rag.enhance_prompt("Explain consciousness")
        print(f"\n🔍 Enhanced prompt:\n{enhanced}")
        
        print(f"\n📊 RAG Stats: {rag.get_stats()}")
    
    asyncio.run(test_rag())
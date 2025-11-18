"""
Archive Activation Demo — arXiv → ChromaDB Ingestion

Pulls 50 papers from arXiv (physics, biology, CS), generates embeddings,
and loads into ChromaDB for semantic search proof-of-concept.

Usage:
    python scripts/archive_activation/ingest_arxiv_demo.py

Requirements:
    pip install arxiv chromadb openai python-dotenv tqdm

Environment:
    OPENAI_API_KEY=sk-...  # For embeddings (or use sentence-transformers locally)
"""

import os
import arxiv
import chromadb
from chromadb.config import Settings
from openai import OpenAI
from dotenv import load_dotenv
from tqdm import tqdm
import time
from typing import List, Dict

load_dotenv()

# Configuration
ARXIV_QUERIES = [
    ("quantum mechanics", 10),  # Physics
    ("machine learning", 10),  # CS
    ("neuroscience", 10),  # Biology
    ("game theory", 10),  # Math/Economics
    ("climate modeling", 10),  # Earth Sciences
]

CHROMA_COLLECTION_NAME = "arxiv_demo_50"
EMBEDDING_MODEL = "text-embedding-3-small"  # OpenAI
CHROMA_PATH = "./data/rag/chromadb"


class ArchiveActivator:
    """Minimal archive ingestion pipeline for demo"""

    def __init__(self, use_local_embeddings=False):
        self.use_local_embeddings = use_local_embeddings

        if not use_local_embeddings:
            self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        else:
            # Fallback: sentence-transformers (install separately)
            from sentence_transformers import SentenceTransformer

            self.local_model = SentenceTransformer("all-MiniLM-L6-v2")

        # Initialize ChromaDB client
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

        # Get or create collection
        self.collection = self.chroma_client.get_or_create_collection(
            name=CHROMA_COLLECTION_NAME,
            metadata={"description": "arXiv 50-paper demo for Lyceum proof-of-concept"},
        )

    def fetch_arxiv_papers(self, query: str, max_results: int = 10) -> List[Dict]:
        """Fetch papers from arXiv API"""
        search = arxiv.Search(
            query=query, max_results=max_results, sort_by=arxiv.SortCriterion.Relevance
        )

        papers = []
        for result in search.results():
            papers.append(
                {
                    "id": result.entry_id.split("/")[-1],  # arXiv ID
                    "title": result.title,
                    "authors": ", ".join([author.name for author in result.authors]),
                    "abstract": result.summary,
                    "categories": ", ".join(result.categories),
                    "published": result.published.isoformat(),
                    "pdf_url": result.pdf_url,
                    "query_domain": query,  # Track which domain this came from
                }
            )

        return papers

    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for text"""
        if self.use_local_embeddings:
            return self.local_model.encode(text).tolist()
        else:
            response = self.openai_client.embeddings.create(
                model=EMBEDDING_MODEL, input=text
            )
            return response.data[0].embedding

    def ingest_papers(self, papers: List[Dict]):
        """Load papers into ChromaDB with embeddings"""
        for paper in tqdm(papers, desc="Ingesting papers"):
            # Combine title + abstract for embedding
            text = f"{paper['title']}\n\n{paper['abstract']}"

            # Generate embedding
            embedding = self.generate_embedding(text)

            # Store in ChromaDB
            self.collection.add(
                ids=[paper["id"]],
                embeddings=[embedding],
                documents=[text],
                metadatas=[
                    {
                        "title": paper["title"],
                        "authors": paper["authors"],
                        "categories": paper["categories"],
                        "published": paper["published"],
                        "pdf_url": paper["pdf_url"],
                        "query_domain": paper["query_domain"],
                    }
                ],
            )

            # Rate limiting (OpenAI has 3,000 RPM for embeddings)
            if not self.use_local_embeddings:
                time.sleep(0.02)  # 50 requests/sec = 3,000 RPM

    def query_archive(self, query: str, n_results: int = 5) -> Dict:
        """Semantic search across ingested papers"""
        query_embedding = self.generate_embedding(query)

        results = self.collection.query(
            query_embeddings=[query_embedding], n_results=n_results
        )

        return {
            "query": query,
            "results": [
                {
                    "id": results["ids"][0][i],
                    "title": results["metadatas"][0][i]["title"],
                    "authors": results["metadatas"][0][i]["authors"],
                    "categories": results["metadatas"][0][i]["categories"],
                    "domain": results["metadatas"][0][i]["query_domain"],
                    "distance": (
                        results["distances"][0][i] if "distances" in results else None
                    ),
                }
                for i in range(len(results["ids"][0]))
            ],
        }


def main():
    """Run 50-paper ingestion demo"""
    print("🧠 Archive Activation Demo — arXiv → ChromaDB\n")

    # Check for OpenAI key
    use_local = not bool(os.getenv("OPENAI_API_KEY"))
    if use_local:
        print("⚠️  No OPENAI_API_KEY found — using local sentence-transformers")
        print("   (Install: pip install sentence-transformers)\n")
    else:
        print(f"✅ Using OpenAI {EMBEDDING_MODEL} for embeddings\n")

    activator = ArchiveActivator(use_local_embeddings=use_local)

    # Step 1: Fetch papers
    print("📚 Fetching papers from arXiv...")
    all_papers = []
    for query, count in ARXIV_QUERIES:
        print(f"   - {query} ({count} papers)")
        papers = activator.fetch_arxiv_papers(query, max_results=count)
        all_papers.extend(papers)

    print(
        f"\n✅ Fetched {len(all_papers)} papers across {len(ARXIV_QUERIES)} domains\n"
    )

    # Step 2: Ingest into ChromaDB
    print("⚡ Generating embeddings and loading into ChromaDB...")
    activator.ingest_papers(all_papers)
    print(
        f"\n✅ Ingested {len(all_papers)} papers into collection '{CHROMA_COLLECTION_NAME}'\n"
    )

    # Step 3: Demo queries (cross-discipline synthesis)
    print("🔍 Testing cross-discipline semantic search...\n")

    test_queries = [
        "quantum tunneling in biological systems",
        "machine learning for climate prediction",
        "game theory applications in neuroscience",
    ]

    for query in test_queries:
        print(f'Query: "{query}"')
        results = activator.query_archive(query, n_results=3)

        for i, result in enumerate(results["results"], 1):
            print(f"  {i}. [{result['domain']}] {result['title']}")
            print(f"     Categories: {result['categories']}")
        print()

    print("✅ Demo complete!")
    print(f"\n📊 Collection stats:")
    print(f"   - Name: {CHROMA_COLLECTION_NAME}")
    print(f"   - Papers: {activator.collection.count()}")
    print(f"   - Path: {CHROMA_PATH}")
    print(
        f"\n💡 Next: Query this collection via personas to demonstrate cross-pollination"
    )


if __name__ == "__main__":
    main()

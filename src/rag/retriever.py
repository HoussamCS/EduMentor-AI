"""
RAG (Retrieval Augmented Generation) module for document retrieval.

This module provides the ChromaRetriever class for searching through
knowledge base documents using vector embeddings.
"""
from __future__ import annotations

from typing import Dict, List


class ChromaRetriever:
    """
    Retrieves relevant documents from a ChromaDB collection using semantic search.
    
    Uses sentence embeddings to find documents similar to user queries.
    """
    
    def __init__(self, persist_dir: str, collection_name: str, embedding_model: str = "all-MiniLM-L6-v2"):
        """
        Initialize the ChromaDB retriever.
        
        Args:
            persist_dir: Directory path for ChromaDB persistence
            collection_name: Name of the ChromaDB collection to use
            embedding_model: Name of the embedding model (default: all-MiniLM-L6-v2)
        
        Raises:
            ValueError: If unsupported embedding model is specified
        """
        if embedding_model != "all-MiniLM-L6-v2":
            raise ValueError("Only all-MiniLM-L6-v2 is currently supported in this runtime")

        # Lazy import chromadb to avoid Pydantic v1 incompatibility errors with Python 3.14 at startup
        import chromadb
        from chromadb.utils import embedding_functions

        self.persist_dir = persist_dir
        self.collection_name = collection_name
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()

    def _resolve_collection(self):
        """Get or create the ChromaDB collection."""
        try:
            return self.client.get_collection(
                name=self.collection_name,
                embedding_function=self.embedding_fn,
            )
        except Exception:
            return self.client.get_or_create_collection(
                name=self.collection_name,
                embedding_function=self.embedding_fn,
            )

    def search(self, query: str, top_k: int = 4) -> Dict[str, List]:
        """
        Search for documents relevant to the query.
        
        Args:
            query: The search query text
            top_k: Number of top results to return (default: 4)
            
        Returns:
            Dictionary containing documents, metadatas, and distances
        """
        collection = self._resolve_collection()
        results = collection.query(
            query_texts=[query],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        return {
            "documents": results.get("documents", [[]])[0],
            "metadatas": results.get("metadatas", [[]])[0],
            "distances": results.get("distances", [[]])[0],
        }

from __future__ import annotations

from typing import Dict, List

import chromadb
from sentence_transformers import SentenceTransformer


class ChromaRetriever:
    def __init__(self, persist_dir: str, collection_name: str, embedding_model: str = "all-MiniLM-L6-v2"):
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        self.embedder = SentenceTransformer(embedding_model)

    def search(self, query: str, top_k: int = 4) -> Dict[str, List]:
        query_vec = self.embedder.encode([query], normalize_embeddings=True).tolist()[0]
        results = self.collection.query(
            query_embeddings=[query_vec],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        return {
            "documents": results.get("documents", [[]])[0],
            "metadatas": results.get("metadatas", [[]])[0],
            "distances": results.get("distances", [[]])[0],
        }

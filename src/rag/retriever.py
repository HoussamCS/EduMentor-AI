from __future__ import annotations

from typing import Dict, List

import chromadb
from chromadb.utils import embedding_functions


class ChromaRetriever:
    def __init__(self, persist_dir: str, collection_name: str, embedding_model: str = "all-MiniLM-L6-v2"):
        if embedding_model != "all-MiniLM-L6-v2":
            raise ValueError("Only all-MiniLM-L6-v2 is currently supported in this runtime")

        self.client = chromadb.PersistentClient(path=persist_dir)
        embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=embedding_fn,
        )

    def search(self, query: str, top_k: int = 4) -> Dict[str, List]:
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        return {
            "documents": results.get("documents", [[]])[0],
            "metadatas": results.get("metadatas", [[]])[0],
            "distances": results.get("distances", [[]])[0],
        }

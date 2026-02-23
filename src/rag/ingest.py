from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

import chromadb
from pypdf import PdfReader
from chromadb.utils import embedding_functions


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
    chunks: List[str] = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == len(text):
            break
        start = max(0, end - overlap)
    return chunks


def read_document(file_path: Path) -> str:
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        reader = PdfReader(str(file_path))
        return "\n".join((page.extract_text() or "") for page in reader.pages)
    if suffix in {".md", ".txt"}:
        return file_path.read_text(encoding="utf-8", errors="ignore")
    return ""


def collect_chunks(knowledge_base_path: str | Path) -> Tuple[List[str], List[dict]]:
    kb_path = Path(knowledge_base_path)
    if not kb_path.exists():
        raise FileNotFoundError(f"Knowledge base path not found: {kb_path}")

    all_chunks: List[str] = []
    metadata: List[dict] = []

    for file_path in kb_path.rglob("*"):
        if not file_path.is_file() or file_path.suffix.lower() not in {".pdf", ".md", ".txt"}:
            continue

        content = read_document(file_path)
        if not content.strip():
            continue

        chunks = chunk_text(content)
        for idx, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            metadata.append({"source": file_path.name, "chunk_id": idx})

    return all_chunks, metadata


def ingest_to_chroma(
    knowledge_base_path: str,
    persist_dir: str,
    collection_name: str,
    embedding_model_name: str = "all-MiniLM-L6-v2",
) -> int:
    chunks, metadata = collect_chunks(knowledge_base_path)
    if not chunks:
        return 0

    if embedding_model_name != "all-MiniLM-L6-v2":
        raise ValueError("Only all-MiniLM-L6-v2 is currently supported in this runtime")

    embedding_fn = embedding_functions.DefaultEmbeddingFunction()

    client = chromadb.PersistentClient(path=persist_dir)
    collection = client.get_or_create_collection(
        name=collection_name,
        embedding_function=embedding_fn,
    )

    ids = [f"doc_{i}" for i in range(len(chunks))]
    collection.upsert(ids=ids, documents=chunks, metadatas=metadata)
    return len(chunks)

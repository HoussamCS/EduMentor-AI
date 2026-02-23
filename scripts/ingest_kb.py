import os

from dotenv import load_dotenv

from src.config import settings
from src.rag.ingest import ingest_to_chroma


def main():
    load_dotenv()

    knowledge_base_path = os.getenv(
        "KNOWLEDGE_BASE_PATH",
        "C:/Users/PC/Downloads/EduMentor_University_Grade_Knowledge_Base",
    )

    total = ingest_to_chroma(
        knowledge_base_path=knowledge_base_path,
        persist_dir=settings.chroma_persist_dir,
        collection_name=settings.chroma_collection,
        embedding_model_name=settings.embedding_model,
    )

    print(f"Ingested chunks: {total}")
    print(f"Chroma directory: {settings.chroma_persist_dir}")
    print(f"Collection: {settings.chroma_collection}")


if __name__ == "__main__":
    main()

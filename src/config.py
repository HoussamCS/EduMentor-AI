import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    chroma_persist_dir: str = os.getenv("CHROMA_PERSIST_DIR", "chromadb")
    chroma_collection: str = os.getenv("CHROMA_COLLECTION", "edumentor_kb")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    model_path: str = os.getenv("MODEL_PATH", "models/risk_model.joblib")
    preprocessor_path: str = os.getenv("PREPROCESSOR_PATH", "models/preprocessor.joblib")


settings = Settings()

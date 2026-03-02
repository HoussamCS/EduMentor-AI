from __future__ import annotations

from typing import Any, Dict, List

from src.config import settings
from src.llm.prompts import EXERCISE_GENERATION_PROMPT, QUIZ_GRADING_PROMPT, TUTOR_SYSTEM_PROMPT
from src.llm.services import OpenAILLMService
from src.ml.predict import RiskPredictor
from src.rag.retriever import ChromaRetriever


class EduMentorAgent:
    def __init__(self):
        self.llm = OpenAILLMService()
        self.predictor = RiskPredictor(settings.model_path)
        self.retriever = ChromaRetriever(
            persist_dir=settings.chroma_persist_dir,
            collection_name=settings.chroma_collection,
            embedding_model=settings.embedding_model,
        )

    def answer_course_question(self, question: str) -> Dict[str, Any]:
        retrieval = self.retriever.search(question, top_k=4)
        docs = retrieval.get("documents", [])
        metadatas = retrieval.get("metadatas", [])
        distances = retrieval.get("distances", [])

        if not docs:
            return {"answer": "I don't know", "sources": []}

        if distances and min(distances) > 1.2:
            return {"answer": "I don't know", "sources": []}

        context = "\n\n".join(docs)
        user_prompt = (
            f"Question: {question}\n\n"
            f"Context:\n{context}\n\n"
            "Answer clearly and cite source names in plain text."
        )
        answer = self.llm.complete(TUTOR_SYSTEM_PROMPT, user_prompt)

        sources = []
        for meta in metadatas:
            source = meta.get("source")
            if source and source not in sources:
                sources.append(source)

        return {"answer": answer, "sources": sources}

    def generate_exercise(self, topic: str, difficulty: str) -> Dict[str, Any]:
        prompt = EXERCISE_GENERATION_PROMPT.format(topic=topic, difficulty=difficulty)
        content = self.llm.complete(
            system_prompt="You generate high-quality, structured educational exercises.",
            user_prompt=prompt,
            temperature=0.5,
        )
        return {"exercise": content}

    def grade_quiz_text(self, question: str, expected_answer: str, student_answer: str) -> Dict[str, Any]:
        prompt = QUIZ_GRADING_PROMPT.format(
            question=question,
            expected_answer=expected_answer,
            student_answer=student_answer,
        )
        result = self.llm.complete(
            system_prompt="You are a fair and constructive quiz grader.",
            user_prompt=prompt,
            temperature=0.1,
        )
        return {"feedback": result}

    def predict_risk(self, student_record: Dict[str, Any]) -> Dict[str, Any]:
        try:
            prediction = self.predictor.predict(student_record)
        except FileNotFoundError as exc:
            # model file missing
            return {"error": str(exc), "hint": "Train and save a model first in models/risk_model.joblib"}
        except ValueError as exc:
            # likely an input mismatch
            return {"error": str(exc), "hint": "Check that your JSON has the correct fields (missing values will be imputed)."}
        except Exception as exc:
            # generic fallback
            return {"error": str(exc), "hint": "An unexpected error occurred."}

        recommendations = self._recommend_by_risk(prediction.get("risk_prediction", "Safe"))
        return {**prediction, "recommendations": recommendations}

    def _recommend_by_risk(self, risk_label: str) -> List[str]:
        if risk_label == "At Risk":
            return [
                "Review the fundamentals chapter for your current module.",
                "Complete a beginner-level quiz for reinforcement.",
                "Schedule 30 minutes of daily revision this week.",
            ]
        return ["Keep up the good work and continue with the current pace."]

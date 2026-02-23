from flask import Blueprint, jsonify, request

from src.agent.orchestrator import EduMentorAgent

api_bp = Blueprint("api", __name__)
agent = EduMentorAgent()


@api_bp.get("/health")
def health_check():
    return jsonify({"status": "ok"})


@api_bp.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    question = payload.get("question", "").strip()
    if not question:
        return jsonify({"error": "question is required"}), 400

    response = agent.answer_course_question(question)
    return jsonify(response)


@api_bp.post("/exercise")
def exercise():
    payload = request.get_json(silent=True) or {}
    topic = payload.get("topic", "Python Basics")
    difficulty = payload.get("difficulty", "Beginner")
    result = agent.generate_exercise(topic=topic, difficulty=difficulty)
    return jsonify(result)


@api_bp.post("/grade-quiz")
def grade_quiz():
    payload = request.get_json(silent=True) or {}
    question = payload.get("question", "").strip()
    expected_answer = payload.get("expected_answer", "").strip()
    student_answer = payload.get("student_answer", "").strip()

    if not all([question, expected_answer, student_answer]):
        return jsonify({"error": "question, expected_answer, and student_answer are required"}), 400

    result = agent.grade_quiz_text(
        question=question,
        expected_answer=expected_answer,
        student_answer=student_answer,
    )
    return jsonify(result)


@api_bp.post("/risk")
def predict_risk():
    payload = request.get_json(silent=True) or {}
    result = agent.predict_risk(payload)
    return jsonify(result)

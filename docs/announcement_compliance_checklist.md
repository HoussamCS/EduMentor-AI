# EduMentor AI Announcement Compliance Checklist

This checklist is used as a recurring audit to ensure implementation stays aligned with the official announcement.

## 1) Core Features (Must-Have)

- [ ] Course Q&A chatbot is RAG-based and returns source citations.
- [ ] Exercise generator supports topic + difficulty.
- [ ] Auto-grader evaluates quiz text answers and gives constructive feedback.
- [ ] Dropout risk predictor outputs `At Risk` or `Safe`.
- [ ] Agent provides proactive recommendations when risk is high.

## 2) Data & Preprocessing (Module 1)

- [x] Notebook-based cleaning exists: `notebooks/preprocessing.ipynb`.
- [x] Handles missing values path and feature creation workflow.
- [x] Produces `clean_data.csv` output cell.
- [ ] Encodes categorical variables in preprocessing artifacts for training report.
- [ ] Normalizes numerical features in final training pipeline notebook output.
- [ ] EDA outputs are completed and saved in notebook runs.

## 3) ML Baseline (Module 2)

- [x] Notebook-based training exists: `notebooks/ml_baseline_training.ipynb`.
- [x] Trains at least two models (Logistic Regression, Random Forest).
- [x] Compares by F1-macro.
- [x] Saves best model artifact.
- [ ] Saves/exports a concise model comparison report in `reports/`.

## 4) RAG Implementation (Module 3)

- [x] Chunking implemented (target 500–1000 chars).
- [x] Embedding model configured to `all-MiniLM-L6-v2`.
- [x] ChromaDB storage implemented.
- [x] Retrieval implemented with top-k chunks.
- [ ] Ingestion run completed on provided knowledge base folder.
- [ ] Citation formatting validated in UI output.

## 5) LLM & Prompt Engineering (Module 4)

- [x] Tutor system prompt created.
- [x] Guardrail for missing context (`I don't know`) added.
- [x] Exercise output template includes Problem / Hints / Solution.
- [ ] Prompt versioning record added (separate file or section in docs).

## 6) AI Agent Orchestration (Module 5)

- [x] Routing layer implemented.
- [x] Risk-based intervention logic implemented.
- [ ] End-to-end tested with live model prediction output.

## 7) UI Requirements

- [x] Three-tab web UI implemented (Chat, Exercise, Analytics).
- [x] Chat tab shows answer and sources placeholders.
- [x] Exercise tab includes topic + difficulty + grader area.
- [x] Analytics tab includes student input + risk output.
- [ ] CSV upload flow implemented for analytics tab.

## 8) Final Deliverables

- [x] Repository structure initialized.
- [x] `requirements.txt` exists.
- [x] `README.md` exists.
- [ ] `src/` finalized with production-ready wiring.
- [ ] Project report PDF (5–10 pages).
- [ ] Demo script (5–7 min) and walkthrough.

## 9) Process Rules (Your Mandatory Workflow)

- [x] Use notebook workflow for cleaning and training.
- [x] Commit messages are in past tense.
- [x] Push after commit policy is active.
- [ ] Continue micro-commit + immediate push for all remaining untracked modules.

## Audit Cadence

- Run this checklist review after each major module completion.
- Update status and commit it immediately.
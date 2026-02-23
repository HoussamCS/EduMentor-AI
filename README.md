# EduMentor AI

EduMentor AI is a capstone project that combines classical machine learning, Retrieval-Augmented Generation (RAG), LLM-driven tutoring, and agent orchestration in one educational assistant.

## Stack

- Backend: Flask
- Frontend: HTML, Bootstrap, Vanilla JavaScript
- ML: scikit-learn
- RAG: ChromaDB + all-MiniLM-L6-v2 embeddings
- LLM: OpenAI API

## Project Structure

```
EduMentor AI/
├── app.py
├── requirements.txt
├── .env.example
├── src/
│   ├── config.py
│   ├── routes/api.py
│   ├── agent/orchestrator.py
│   ├── llm/
│   ├── ml/
│   └── rag/
├── templates/index.html
├── static/
│   ├── css/styles.css
│   └── js/app.js
├── data/
│   ├── raw/
│   └── processed/
├── models/
└── notebooks/
```

## Quick Start

1. Create environment:

```bash
python -m venv .venv
```

2. Activate environment and install requirements:

```bash
pip install -r requirements.txt
```

3. Configure environment:

```bash
copy .env.example .env
```

4. Set your `OPENAI_API_KEY` in `.env`.

5. Run app:

```bash
python app.py
```

6. Open `http://127.0.0.1:5000`.

## Next Milestones

- Implement OULAD preprocessing and export `clean_data.csv`
- Train baseline models and save best model
- Build Chroma ingestion from course knowledge base
- Connect full agent orchestration

## Execution Workflow

### Notebook-first (as required)

1. Run `notebooks/preprocessing.ipynb` to generate:
	- `data/processed/clean_data.csv`
	- `data/processed/train_data.csv`
	- `data/processed/test_data.csv`

2. Run `notebooks/ml_baseline_training.ipynb` to generate:
	- `models/risk_model.joblib`
	- `models/model_comparison.csv`

### Script equivalents

- Preprocess data:

```bash
python scripts/preprocess_data.py
```

- Train model:

```bash
python scripts/train_model.py
```

- Ingest knowledge base into Chroma:

```bash
python scripts/ingest_kb.py
```

### Important Paths

- OULAD default path: `C:/Users/PC/Downloads/open+university+learning+analytics+dataset`
- Knowledge base default path: `C:/Users/PC/Downloads/EduMentor_University_Grade_Knowledge_Base`
- You can override both in `.env` using:
  - `OULAD_DATASET_PATH`
  - `KNOWLEDGE_BASE_PATH`
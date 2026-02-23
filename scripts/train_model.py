from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd

from src.ml.train import save_best_pipeline, train_baseline_models


def main():
    train_path = Path("data/processed/train_data.csv")
    test_path = Path("data/processed/test_data.csv")

    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError("train_data.csv and test_data.csv are required in data/processed")

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    results = train_baseline_models(train_df, test_df, target_col="risk_label")
    save_best_pipeline(results, "models/risk_model.joblib")

    print("Model comparison:")
    for model_name, metrics in results.items():
        if model_name.startswith("_"):
            continue
        print(model_name, metrics)

    print("Saved best model to models/risk_model.joblib")


if __name__ == "__main__":
    main()

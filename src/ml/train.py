from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def build_preprocessor(df: pd.DataFrame, target_col: str = "risk_label") -> Tuple[ColumnTransformer, list[str], list[str]]:
    feature_df = df.drop(columns=[target_col])
    numeric_cols = feature_df.select_dtypes(include=["number"]).columns.tolist()
    categorical_cols = feature_df.select_dtypes(exclude=["number"]).columns.tolist()

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, numeric_cols),
            ("categorical", categorical_pipeline, categorical_cols),
        ]
    )
    return preprocessor, numeric_cols, categorical_cols


def train_baseline_models(train_df: pd.DataFrame, test_df: pd.DataFrame, target_col: str = "risk_label") -> Dict[str, Dict[str, float]]:
    x_train = train_df.drop(columns=[target_col])
    y_train = train_df[target_col]
    x_test = test_df.drop(columns=[target_col])
    y_test = test_df[target_col]

    preprocessor, _, _ = build_preprocessor(train_df, target_col=target_col)

    candidates = {
        "logistic_regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
        "random_forest": RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            class_weight="balanced",
            min_samples_leaf=2,
        ),
    }

    results: Dict[str, Dict[str, float]] = {}
    best_name = ""
    best_score = -1.0
    best_pipeline = None

    for model_name, estimator in candidates.items():
        pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", estimator)])
        pipeline.fit(x_train, y_train)

        y_pred = pipeline.predict(x_test)
        f1 = f1_score(y_test, y_pred, average="macro")

        roc_auc = float("nan")
        if hasattr(pipeline, "predict_proba"):
            y_proba = pipeline.predict_proba(x_test)[:, 1]
            roc_auc = roc_auc_score(y_test, y_proba)

        results[model_name] = {"f1_macro": f1, "roc_auc": roc_auc}

        if f1 > best_score:
            best_score = f1
            best_name = model_name
            best_pipeline = pipeline

    results["best_model"] = {"name": best_name, "f1_macro": best_score}
    results["_best_pipeline"] = {"object": best_pipeline}
    return results


def save_best_pipeline(results: Dict[str, Dict[str, float]], output_model_path: str | Path) -> None:
    best_pipeline = results.get("_best_pipeline", {}).get("object")
    if best_pipeline is None:
        raise ValueError("No best model pipeline found in results")

    output_path = Path(output_model_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipeline, output_path)

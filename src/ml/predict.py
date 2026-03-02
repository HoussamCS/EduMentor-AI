from __future__ import annotations

from pathlib import Path
from typing import Any, Dict

import joblib
import pandas as pd


class RiskPredictor:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self._model = None

    def load(self):
        path = Path(self.model_path)
        if not path.exists():
            raise FileNotFoundError(f"Model file not found at {path}")
        self._model = joblib.load(path)

    def predict(self, student_record: Dict[str, Any]) -> Dict[str, Any]:
        if self._model is None:
            self.load()

        # convert incoming dict to DataFrame and ensure it contains all
        # columns that the trained pipeline expects.  During training the
        # ColumnTransformer recorded the feature names in `feature_names_in_`.
        input_df = pd.DataFrame([student_record])
        if hasattr(self._model.named_steps.get("preprocessor"), "feature_names_in_"):
            expected = list(self._model.named_steps["preprocessor"].feature_names_in_)
            # add any missing columns with NaN (the imputer in the pipeline will
            # handle them appropriately) and drop any extras
            import numpy as np
            for col in expected:
                if col not in input_df.columns:
                    # use NaN; the preprocessing pipelines include imputers which
                    # will handle these gracefully
                    input_df[col] = np.nan
            input_df = input_df.reindex(columns=expected)

        prediction = int(self._model.predict(input_df)[0])

        risk_label = "At Risk" if prediction == 1 else "Safe"

        confidence = None
        if hasattr(self._model, "predict_proba"):
            confidence = float(self._model.predict_proba(input_df)[0][prediction])

        return {
            "risk_prediction": risk_label,
            "risk_flag": prediction,
            "confidence": confidence,
        }

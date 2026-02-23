from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple

import pandas as pd
from sklearn.model_selection import train_test_split


def load_oulad_tables(raw_data_dir: str | Path) -> Dict[str, pd.DataFrame]:
    raw_path = Path(raw_data_dir)
    table_files = {
        "student_info": "studentInfo.csv",
        "student_registration": "studentRegistration.csv",
        "student_assessment": "studentAssessment.csv",
        "assessments": "assessments.csv",
        "student_vle": "studentVle.csv",
        "courses": "courses.csv",
    }

    tables: Dict[str, pd.DataFrame] = {}
    for name, filename in table_files.items():
        file_path = raw_path / filename
        if file_path.exists():
            tables[name] = pd.read_csv(file_path)
    if "student_info" not in tables:
        raise FileNotFoundError("studentInfo.csv is required in raw data folder")
    return tables


def build_student_level_dataset(tables: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    student_info = tables["student_info"].copy()
    key_cols = ["code_module", "code_presentation", "id_student"]

    base = student_info.copy()

    if "student_registration" in tables:
        registration = tables["student_registration"].copy()
        reg_agg = registration.groupby(key_cols, dropna=False).agg(
            registration_day=("date_registration", "mean"),
            unregister_day=("date_unregistration", "mean"),
        ).reset_index()
        base = base.merge(reg_agg, on=key_cols, how="left")

    if {"student_assessment", "assessments"}.issubset(set(tables.keys())):
        assessment = tables["student_assessment"].copy()
        assessments = tables["assessments"].copy()
        assessment = assessment.merge(
            assessments[["id_assessment", "assessment_type", "weight"]],
            on="id_assessment",
            how="left",
        )
        ass_agg = assessment.groupby(key_cols, dropna=False).agg(
            avg_assessment_score=("score", "mean"),
            submitted_assessments=("is_banked", "count"),
            avg_assessment_weight=("weight", "mean"),
        ).reset_index()
        base = base.merge(ass_agg, on=key_cols, how="left")

    if "student_vle" in tables:
        student_vle = tables["student_vle"].copy()
        vle_agg = student_vle.groupby(key_cols, dropna=False).agg(
            total_clicks=("sum_click", "sum"),
            avg_clicks_per_event=("sum_click", "mean"),
            activity_events=("sum_click", "count"),
        ).reset_index()
        base = base.merge(vle_agg, on=key_cols, how="left")

    if "final_result" not in base.columns:
        raise ValueError("studentInfo.csv must contain final_result column")

    base["risk_label"] = base["final_result"].isin(["Fail", "Withdrawn"]).astype(int)
    return base


def split_and_save_clean_data(
    clean_df: pd.DataFrame,
    output_csv_path: str | Path,
    test_size: float = 0.2,
    random_state: int = 42,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    output_path = Path(output_csv_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    clean_df.to_csv(output_path, index=False)

    train_df, test_df = train_test_split(
        clean_df,
        test_size=test_size,
        random_state=random_state,
        stratify=clean_df["risk_label"],
    )
    return train_df, test_df

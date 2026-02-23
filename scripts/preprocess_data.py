from pathlib import Path

from src.ml.preprocess import build_student_level_dataset, load_oulad_tables, split_and_save_clean_data


def main():
    raw_dir = Path("data/raw")
    output_path = Path("data/processed/clean_data.csv")

    tables = load_oulad_tables(raw_dir)
    clean_df = build_student_level_dataset(tables)
    train_df, test_df = split_and_save_clean_data(clean_df, output_path)

    print(f"Saved clean data: {output_path}")
    print(f"Train rows: {len(train_df)} | Test rows: {len(test_df)}")


if __name__ == "__main__":
    main()

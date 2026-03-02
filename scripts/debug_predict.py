import pandas as pd, numpy as np, joblib

model = joblib.load('models/risk_model.joblib')
student = {
    'code_module':'AAA',
    'code_presentation':'2013J',
    'highest_education':'A Level or Equivalent',
    'num_of_prev_attempts':0,
    'studied_credits':60,
    'total_clicks':120,
    'avg_assessment_score':65,
}
input_df = pd.DataFrame([student])
expected = list(model.named_steps['preprocessor'].feature_names_in_)
for col in expected:
    if col not in input_df.columns:
        input_df[col] = np.nan
input_df = input_df.reindex(columns=expected)
print('dataframe:')
print(input_df)
print('dtypes:')
print(input_df.dtypes)
print('predict:')
pred = model.predict(input_df)
print(pred)
if hasattr(model, 'predict_proba'):
    print('proba:')
    print(model.predict_proba(input_df))

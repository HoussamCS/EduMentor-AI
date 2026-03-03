export interface StudentRecord {
  gender: string;
  highest_education: string;
  imd_band: string;
  age_band: string;
  studied_credits: number | string;
  disability: string;
  final_result: string;
  registration_day: number | string;
  unregister_day: number | string;
  avg_assessment_score: number | string;
  submitted_assessments: number | string;
  avg_assessment_weight: number | string;
  total_clicks: number | string;
  avg_clicks_per_event: number | string;
  activity_events: number | string;
}

export interface RiskPredictionResponse {
  [key: string]: string | number | boolean;
  risk_level?: string;
  probability?: number;
  status?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

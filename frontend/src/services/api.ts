import axios from "axios";
import { StudentRecord, RiskPredictionResponse } from "@types/index";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Chat endpoints
  chat: async (message: string): Promise<string> => {
    const response = await apiClient.post("/api/chat", { message });
    return response.data.response;
  },

  // Exercise generation endpoints
  generateExercise: async (topic: string, difficulty: string) => {
    const response = await apiClient.post("/api/exercise", {
      topic,
      difficulty,
    });
    return response.data;
  },

  // Risk prediction endpoint
  predictRisk: async (studentData: Partial<StudentRecord>): Promise<RiskPredictionResponse> => {
    const response = await apiClient.post("/api/risk", studentData);
    return response.data;
  },

  // Health check
  health: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get("/api/health");
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export default api;

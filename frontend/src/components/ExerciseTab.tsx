import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Chip,
  TextField,
  Divider,
  Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "@services/api";
import Loader from "./Loader";

interface GeneratedExercise {
  question: string;
  difficulty: string;
  topic: string;
  timestamp?: string;
}

const ExerciseTab: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null);

  const topics = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
    "Geography",
    "Computer Science",
  ];

  const difficulties = ["easy", "medium", "hard"];

  const handleGenerateExercise = async () => {
    if (!topic) {
      alert("Please select a topic");
      return;
    }

    setLoading(true);
    try {
      const response = await api.generateExercise(topic, difficulty);
      setExercise({
        question: response.question || response,
        difficulty,
        topic,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      alert(
        `Error generating exercise: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Generate custom exercises tailored to your learning needs.
      </Typography>

      {/* Selection Controls */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Select Topic</InputLabel>
              <Select
                value={topic}
                label="Select Topic"
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              >
                {topics.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty Level"
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={loading}
              >
                {difficulties.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleGenerateExercise}
              disabled={loading || !topic}
              fullWidth
            >
              Generate Exercise
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading && <Loader message="Generating exercise..." />}

      {/* Generated Exercise Display */}
      {exercise && !loading && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6">Exercise Generated</Typography>
              <Chip label={exercise.topic} size="small" color="primary" />
              <Chip
                label={exercise.difficulty}
                size="small"
                variant="outlined"
                color={
                  exercise.difficulty === "easy"
                    ? "success"
                    : exercise.difficulty === "medium"
                      ? "warning"
                      : "error"
                }
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Question
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "background.paper", mb: 2 }}>
              <Typography variant="body1">{exercise.question}</Typography>
            </Paper>

            <TextField
              fullWidth
              label="Your Answer"
              multiline
              rows={4}
              placeholder="Type your answer here..."
              variant="outlined"
            />

            <Box mt={2} display="flex" gap={1}>
              <Button variant="contained" color="success">
                Submit Answer
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleGenerateExercise}
              >
                Generate Another
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};


export default ExerciseTab;

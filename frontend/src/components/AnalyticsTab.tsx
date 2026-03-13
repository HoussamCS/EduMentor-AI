import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import api from "@services/api";
import Loader from "./Loader";
import { StudentRecord, RiskPredictionResponse } from "@types/index";

const AnalyticsTab: React.FC = () => {
  const [formData, setFormData] = useState<StudentRecord>({
    gender: "",
    highest_education: "",
    imd_band: "",
    age_band: "",
    studied_credits: "",
    disability: "",
    final_result: "",
    registration_day: "",
    unregister_day: "",
    avg_assessment_score: "",
    submitted_assessments: "",
    avg_assessment_weight: "",
    total_clicks: "",
    avg_clicks_per_event: "",
    activity_events: "",
  });

  const [result, setResult] = useState<RiskPredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof StudentRecord, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const predict = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        studied_credits: formData.studied_credits ? parseInt(String(formData.studied_credits)) : 0,
        registration_day: formData.registration_day ? parseInt(String(formData.registration_day)) : 0,
        unregister_day: formData.unregister_day ? parseInt(String(formData.unregister_day)) : 0,
        avg_assessment_score: formData.avg_assessment_score ? parseFloat(String(formData.avg_assessment_score)) : 0,
        submitted_assessments: formData.submitted_assessments ? parseInt(String(formData.submitted_assessments)) : 0,
        avg_assessment_weight: formData.avg_assessment_weight ? parseFloat(String(formData.avg_assessment_weight)) : 0,
        total_clicks: formData.total_clicks ? parseInt(String(formData.total_clicks)) : 0,
        avg_clicks_per_event: formData.avg_clicks_per_event ? parseFloat(String(formData.avg_clicks_per_event)) : 0,
        activity_events: formData.activity_events ? parseInt(String(formData.activity_events)) : 0,
      };

      const response = await api.predictRisk(payload);
      setResult(response);
    } catch (err) {
      setError(
        `Error predicting risk: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Enter student information to predict risk level.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Input Form */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gender"
                placeholder="e.g., M, F"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Highest Education */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Highest Education</InputLabel>
                <Select
                  value={formData.highest_education}
                  label="Highest Education"
                  onChange={(e) =>
                    handleInputChange("highest_education", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>Select highest education</em>
                  </MenuItem>
                  <MenuItem value="A Level or Equivalent">
                    A Level or Equivalent
                  </MenuItem>
                  <MenuItem value="HE Qualification">
                    HE Qualification
                  </MenuItem>
                  <MenuItem value="Lower Than A Level">
                    Lower Than A Level
                  </MenuItem>
                  <MenuItem value="Post Graduate Qualification">
                    Post Graduate Qualification
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* IMD Band */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>IMD Band</InputLabel>
                <Select
                  value={formData.imd_band}
                  label="IMD Band"
                  onChange={(e) => handleInputChange("imd_band", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select IMD band</em>
                  </MenuItem>
                  {["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"].map(
                    (band) => (
                      <MenuItem key={band} value={band}>
                        {band}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Age Band */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age Band"
                placeholder="e.g., 20-25"
                value={formData.age_band}
                onChange={(e) => handleInputChange("age_band", e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Studied Credits */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Studied Credits"
                type="number"
                value={formData.studied_credits}
                onChange={(e) =>
                  handleInputChange("studied_credits", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Disability */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Disability"
                placeholder="Y or N"
                value={formData.disability}
                onChange={(e) => handleInputChange("disability", e.target.value)}
                variant="outlined"
              />
            </Grid>

            {/* Final Result */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Final Result"
                placeholder="e.g., Pass, Fail"
                value={formData.final_result}
                onChange={(e) =>
                  handleInputChange("final_result", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Registration Day */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Day"
                type="number"
                value={formData.registration_day}
                onChange={(e) =>
                  handleInputChange("registration_day", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Unregister Day */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unregister Day"
                type="number"
                value={formData.unregister_day}
                onChange={(e) =>
                  handleInputChange("unregister_day", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Avg Assessment Score */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avg Assessment Score"
                type="number"
                inputProps={{ step: "0.1" }}
                value={formData.avg_assessment_score}
                onChange={(e) =>
                  handleInputChange("avg_assessment_score", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Submitted Assessments */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Submitted Assessments"
                type="number"
                value={formData.submitted_assessments}
                onChange={(e) =>
                  handleInputChange("submitted_assessments", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Avg Assessment Weight */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avg Assessment Weight"
                type="number"
                inputProps={{ step: "0.1" }}
                value={formData.avg_assessment_weight}
                onChange={(e) =>
                  handleInputChange("avg_assessment_weight", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Total Clicks */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Clicks"
                type="number"
                value={formData.total_clicks}
                onChange={(e) =>
                  handleInputChange("total_clicks", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Avg Clicks Per Event */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Avg Clicks Per Event"
                type="number"
                inputProps={{ step: "0.1" }}
                value={formData.avg_clicks_per_event}
                onChange={(e) =>
                  handleInputChange("avg_clicks_per_event", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Activity Events */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Activity Events"
                type="number"
                value={formData.activity_events}
                onChange={(e) =>
                  handleInputChange("activity_events", e.target.value)
                }
                variant="outlined"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<AnalyticsIcon />}
                onClick={predict}
                disabled={loading}
              >
                Predict Risk
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && <Loader message="Analyzing student data..." />}

      {/* Results Display */}
      {result && !loading && (
        <Card sx={{ bgcolor: "background.paper" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AnalyticsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Risk Assessment Results
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              {Object.entries(result).map(([key, value]) => {
                const formattedKey = key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <Box
                    key={key}
                    display="flex"
                    justifyContent="space-between"
                    py={1}
                    px={2}
                    sx={{
                      backgroundColor: "background.paper",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "background.default",
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight="500">
                      {formattedKey}:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: key.includes("risk")
                          ? "error.main"
                          : key.includes("probability")
                            ? "primary.main"
                            : "text.primary",
                      }}
                    >
                      {String(value)}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AnalyticsTab;

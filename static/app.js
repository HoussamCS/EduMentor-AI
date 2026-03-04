const { useState, useEffect, useRef } = React;
const {
  Box, Container, Paper, Tabs, Tab, Typography, AppBar, Toolbar,
  TextField, Button, Card, CardContent, FormControl, InputLabel, Select, MenuItem,
  Stack, Divider, Avatar, Chip, Grid, Alert, CircularProgress, CssBaseline, ThemeProvider, createTheme
} = MaterialUI;
const Icons = MaterialUIIcons;

function postJson(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
}

function Loader({ message = "Loading..." }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const resp = await postJson("/api/chat", { message: input });
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: resp.response || resp.error || "No response",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${e.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          mb: 2,
          backgroundColor: "#f5f5f5",
          minHeight: 400,
        }}
      >
        <Stack spacing={2}>
          {messages.length === 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              py={4}
            >
              Start a conversation with EduMentor AI...
            </Typography>
          )}
          {messages.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
              mb={1}
            >
              <Box display="flex" gap={1} alignItems="flex-start" maxWidth="80%">
                {msg.role === "assistant" && (
                  <Avatar
                    sx={{ bgcolor: "#1976d2", width: 32, height: 32, fontSize: "0.875rem" }}
                  >
                    AI
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: msg.role === "user" ? "#1976d2" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#000",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 0.5, opacity: 0.7 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
          {loading && <Loader message="AI is thinking..." />}
          <div ref={endRef} />
        </Stack>
      </Paper>

      <Divider />

      <Box display="flex" gap={1} mt={2}>
        <TextField
          fullWidth
          placeholder="Ask me anything about the course..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          multiline
          maxRows={4}
          disabled={loading}
        />
        <Button
          variant="contained"
          endIcon={<Icons.Send />}
          onClick={send}
          disabled={loading || !input.trim()}
          sx={{ mt: "auto" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

function ExerciseTab() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState(null);
  const topicsList = [
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

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please select a topic");
      return;
    }
    setLoading(true);
    try {
      const resp = await postJson("/api/exercise", { topic, difficulty });
      setExercise({
        question: resp.question || resp,
        difficulty,
        topic,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (e) {
      alert(`Error generating exercise: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Generate custom exercises tailored to your learning needs.
      </Typography>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Topic</InputLabel>
              <Select
                value={topic}
                label="Topic"
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              >
                {topicsList.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
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
              startIcon={<Icons.Refresh />}
              onClick={handleGenerate}
              disabled={loading || !topic}
              fullWidth
            >
              Generate Exercise
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {loading && <Loader message="Generating exercise..." />}
      {exercise && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Exercise
            </Typography>
            <Typography>{exercise.question}</Typography>
            <Typography variant="caption" color="textSecondary">
              {exercise.topic} | {exercise.difficulty} | {exercise.timestamp}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

function AnalyticsTab() {
  const [formData, setFormData] = useState({
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
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const predict = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        studied_credits: parseInt(formData.studied_credits),
        registration_day: parseInt(formData.registration_day),
        unregister_day: parseInt(formData.unregister_day),
        avg_assessment_score: parseFloat(formData.avg_assessment_score),
        submitted_assessments: parseInt(formData.submitted_assessments),
        avg_assessment_weight: parseFloat(formData.avg_assessment_weight),
        total_clicks: parseInt(formData.total_clicks),
        avg_clicks_per_event: parseFloat(formData.avg_clicks_per_event),
        activity_events: parseInt(formData.activity_events),
      };
      const r = await postJson("/api/risk", payload);
      let resultText = "Risk Assessment Result\n";
      resultText += "=".repeat(40) + "\n\n";
      for (const [key, value] of Object.entries(r)) {
        const formattedKey = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        resultText += `${formattedKey}: ${value}\n`;
      }
      setResult(resultText);
    } catch (e) {
      setResult("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Enter student information to predict risk level.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Highest Education</InputLabel>
            <Select
              value={formData.highest_education}
              label="Highest Education"
              onChange={(e) => handleInputChange("highest_education", e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="A Level or Equivalent">A Level or Equivalent</MenuItem>
              <MenuItem value="HE Qualification">HE Qualification</MenuItem>
              <MenuItem value="Lower Than A Level">Lower Than A Level</MenuItem>
              <MenuItem value="Post Graduate Qualification">Post Graduate Qualification</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>IMD Band</InputLabel>
            <Select
              value={formData.imd_band}
              label="IMD Band"
              onChange={(e) => handleInputChange("imd_band", e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80-90", "90-100"].map((band) => (
                <MenuItem key={band} value={band}>
                  {band}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Age Band"
            value={formData.age_band}
            onChange={(e) => handleInputChange("age_band", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Studied Credits"
            type="number"
            value={formData.studied_credits}
            onChange={(e) => handleInputChange("studied_credits", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Disability"
            value={formData.disability}
            onChange={(e) => handleInputChange("disability", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Final Result"
            value={formData.final_result}
            onChange={(e) => handleInputChange("final_result", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Registration Day"
            type="number"
            value={formData.registration_day}
            onChange={(e) => handleInputChange("registration_day", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Unregister Day"
            type="number"
            value={formData.unregister_day}
            onChange={(e) => handleInputChange("unregister_day", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Avg Assessment Score"
            type="number"
            step="0.1"
            value={formData.avg_assessment_score}
            onChange={(e) => handleInputChange("avg_assessment_score", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Submitted Assessments"
            type="number"
            value={formData.submitted_assessments}
            onChange={(e) => handleInputChange("submitted_assessments", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Avg Assessment Weight"
            type="number"
            step="0.1"
            value={formData.avg_assessment_weight}
            onChange={(e) => handleInputChange("avg_assessment_weight", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Clicks"
            type="number"
            value={formData.total_clicks}
            onChange={(e) => handleInputChange("total_clicks", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Avg Clicks Per Event"
            type="number"
            step="0.1"
            value={formData.avg_clicks_per_event}
            onChange={(e) => handleInputChange("avg_clicks_per_event", e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Activity Events"
            type="number"
            value={formData.activity_events}
            onChange={(e) => handleInputChange("activity_events", e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={predict} disabled={loading}>
        Predict Risk
      </Button>
      {loading && <Loader />}
      {result && (
        <Box mt={2}>
          <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap" }}>
            {result}
          </Paper>
        </Box>
      )}
    </Box>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (e, newVal) => setActiveTab(newVal);
  return (
    <Box>
      <Typography variant="h4" mb={1}>
        EduMentor AI
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={3}>
        RAG Tutor · Exercise Generator · Student Risk Analytics
      </Typography>
      <Tabs value={activeTab} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        <Tab label="Course Chat" />
        <Tab label="Exercise Generator" />
        <Tab label="Analytics Dashboard" />
      </Tabs>
      <Divider sx={{ my: 2 }} />
      {activeTab === 0 && <ChatTab />}
      {activeTab === 1 && <ExerciseTab />}
      {activeTab === 2 && <AnalyticsTab />}
    </Box>
  );
}

const theme = createTheme();
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="md" sx={{ py: 4 }}>
      <App />
    </Container>
  </ThemeProvider>
);

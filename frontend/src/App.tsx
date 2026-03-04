import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SchoolIcon from "@mui/icons-material/School";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ChatTab from "@components/ChatTab";
import ExerciseTab from "@components/ExerciseTab";
import AnalyticsTab from "@components/AnalyticsTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (""
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="div" fontWeight="bold">
              🎓 EduMentor AI
            </Typography>
            <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
              RAG Tutor · Exercise Generator · Student Risk Analytics
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="EduMentor tabs"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "#fff",
            }}
          >
            <Tab
              label="Course Chat"
              icon={<ChatIcon />}
              iconPosition="start"
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              label="Exercise Generator"
              icon={<SchoolIcon />}
              iconPosition="start"
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              label="Analytics Dashboard"
              icon={<AnalyticsIcon />}
              iconPosition="start"
              id="tab-2"
              aria-controls="tabpanel-2"
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ minHeight: 600 }}>
            <TabPanel value={activeTab} index={0}>
              <ChatTab />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <ExerciseTab />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <AnalyticsTab />
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#fff",
          borderTop: 1,
          borderColor: "divider",
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="textSecondary">
          © 2024 EduMentor AI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default App;

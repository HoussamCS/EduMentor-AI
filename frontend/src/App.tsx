import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SchoolIcon from "@mui/icons-material/School";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ChatTab from "@components/ChatTab";
import ExerciseTab from "@components/ExerciseTab";
import AnalyticsTab from "@components/AnalyticsTab";
import Header from "@components/Header";
import Footer from "@components/Footer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "transparent",
        color: "text.primary",
        position: "relative",
      }}
    >
      {/* Header component */}
      <Header />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, flex: 1, position: "relative", zIndex: 1 }}>
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", backdropFilter: "blur(20px)" }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="EduMentor tabs"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
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

      {/* Footer component */}
      <Footer />
    </Box>
  );
};

export default App;

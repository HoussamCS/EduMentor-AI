import React from "react";
import { AppBar, Toolbar, Box, Typography, useTheme } from "@mui/material";
import ThemeToggle from "./ThemeToggle";

/**
 * Header component for the EduMentor AI application.
 * Displays the app title, tagline, and theme toggle.
 */
const Header: React.FC = () => {
  const theme = useTheme();
  
  // Dynamic border color based on theme mode
  const borderColor = theme.palette.mode === "light" 
    ? "rgba(0, 0, 0, 0.1)" 
    : "rgba(255, 255, 255, 0.1)";
  
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ 
        backdropFilter: "blur(20px)",
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: borderColor,
        zIndex: 100,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            🎓 EduMentor AI
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", opacity: 0.8 }}
          >
            RAG Tutor · Exercise Generator · Student Risk Analytics
          </Typography>
        </Box>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

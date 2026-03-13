import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: "background.paper",
      backdropFilter: "blur(10px)",
      borderTop: 1,
      borderColor: "divider",
      py: 3,
      textAlign: "center",
      position: "relative",
      zIndex: 1,
    }}
  >
    <Typography variant="caption" color="text.secondary">
      © 2026 EduMentor AI. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;

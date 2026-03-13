import React, { useContext } from "react";
import { IconButton, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../ThemeProvider";

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  return (
    <IconButton
      onClick={toggleColorMode}
      sx={{ ml: 1 }}
      aria-label="Toggle dark/light mode"
    >
      {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggle;

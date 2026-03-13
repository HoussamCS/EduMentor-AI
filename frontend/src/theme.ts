import { PaletteMode } from "@mui/material";

const common = {
  primary: {
    main: "#4f46e5",
    light: "#6366f1",
    dark: "#312e81",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#f472b6",
    contrastText: "#ffffff",
  },
  success: { main: "#22c55e" },
  warning: { main: "#f59e0b" },
  error: { main: "#ef4444" },
};

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...common,
    background: {
      default: "transparent",
      paper: mode === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(31, 41, 55, 0.85)",
    },
    text: {
      primary: mode === "light" ? "#111827" : "#f9fafb",
      secondary: mode === "light" ? "#4b5563" : "#9ca3af",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontSize: "2.25rem", fontWeight: 600, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.875rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    h5: { fontSize: "1.125rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  spacing: 4,
  shadows: [
    "none",
    "0px 1px 3px rgba(0,0,0,0.12),0px 1px 2px rgba(0,0,0,0.24)",
    "0px 4px 6px rgba(0,0,0,0.1),0px 2px 4px rgba(0,0,0,0.06)",
    "0px 10px 15px rgba(0,0,0,0.1),0px 4px 6px rgba(0,0,0,0.05)",
  ],
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          border: "1px solid " + (mode === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"),
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(31, 41, 55, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid " + (mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

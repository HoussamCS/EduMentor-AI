import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiProvider, createTheme } from "@mui/material";
import { getDesignTokens } from "./theme";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored as "light" | "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiProvider theme={theme}>{children}</MuiProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;

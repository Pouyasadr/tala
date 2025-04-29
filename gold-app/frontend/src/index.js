import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const getTheme = mode =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2"
      },
      background: {
        default: mode === "dark" ? "#121212" : "#fff",
        paper: mode === "dark" ? "#1e1e1e" : "#fff"
      }
    }
  });

const Root = () => {
  const { theme } = React.useContext(ThemeContext);
  return (
    <MuiThemeProvider theme={getTheme(theme)}>
      <App />
    </MuiThemeProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <Root />
  </ThemeProvider>
);
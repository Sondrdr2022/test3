import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Create a wrapper component to handle dark mode initialization
const DarkModeWrapper = ({ children }) => {
  useEffect(() => {
    // Check for saved dark mode preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    // Check for system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark mode if either saved preference or system preference is true
    if (savedDarkMode || (!('darkMode' in localStorage) && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeWrapper>
      <App />
    </DarkModeWrapper>
  </React.StrictMode>
);
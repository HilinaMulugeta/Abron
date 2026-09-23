import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ShopContextProvider from "./components/ShopContext.jsx";
import { ThemeProvider } from "./theme/ThemeContext.jsx";
import "./index.css";

// Import console utilities for error handling and cleanup
import {
  initErrorListeners,
  cleanupConsole,
  safeConsole,
  performanceLogger,
} from "./utils/console.js";

// Import console error fixes
import "./utils/consoleErrorFix.js";

// Performance monitoring
performanceLogger.mark("app-start");

// Initialize error listeners and console utilities
initErrorListeners();
cleanupConsole();

// Performance logging for development
const isDevelopment =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development";
const isProduction =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "production";

if (isDevelopment) {
  safeConsole.log("🚀 Starting Abron React App in development mode");

  // Log React version
  safeConsole.log("⚛️ React version:", React.version);

  // Check for React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    safeConsole.log("🔧 React DevTools detected");
  }
}

// Create root element and render app
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure you have a div with id="root" in your HTML.',
  );
}

const root = ReactDOM.createRoot(rootElement);

// Render app with error boundary and router
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Performance measurement
performanceLogger.mark("app-rendered");
performanceLogger.measure("app-startup", "app-start", "app-rendered");

// Service Worker registration (if needed)
if ("serviceWorker" in navigator && isProduction) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        safeConsole.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        safeConsole.log("SW registration failed: ", registrationError);
      });
  });
}

// Hot Module Replacement (HMR) for development
if (isDevelopment && import.meta.hot) {
  import.meta.hot.accept();
}

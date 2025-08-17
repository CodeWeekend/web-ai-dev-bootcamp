import { StrictMode } from "react"; // Import StrictMode from React to help identify potential problems in the app
import { createRoot } from "react-dom/client"; // Import createRoot to render the React app into the DOM
import "./index.css"; // Import the CSS file for styling the app
import App from "./App.jsx"; // Import the main App component, which contains the app's logic and UI

// Find the root DOM element and create a React root to render the app
createRoot(document.getElementById("root")).render(
  // Wrap the app in StrictMode to enable additional checks and warnings during development
  // <App /> Render the main App component inside the root element
  <StrictMode>
    {" "}
    <App />
  </StrictMode>
);

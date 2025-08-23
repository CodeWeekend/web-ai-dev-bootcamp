// App.jsx
// This is the main component for the School Portal app.
// It sets up the overall layout and routing for the application.

// Import React Router components for navigation and routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import shared UI components
import NavBar from "./components/NavBar"; // The top navigation bar

// Import page components
import Home from "./pages/Home"; // Home page
import About from "./pages/About"; // About page
import Students from "./pages/Students"; // Students list page
import StudentDetails from "./pages/StudentDetails"; // Student details (nested route)
import Teachers from "./pages/Teachers"; // Teachers list page
import TeacherDetails from "./pages/TeacherDetails"; // Teacher details (nested route)
import NotFound from "./pages/NotFound"; // 404 page for unknown routes
import "./App.css";

// Main App component with routing
export default function App() {
  return (
    // BrowserRouter enables client-side routing in the app
    <BrowserRouter>
      {/* Top bar: navigation and dark mode toggle */}
      <NavBar />

      {/* Main content area with extra top padding to prevent overlap with fixed navbar */}
      <div style={{ padding: "1rem", paddingTop: "5rem" }}>
        {/* Define all the routes for the app */}
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />

          {/* About page route */}
          <Route path="/about" element={<About />} />

          {/* Students section with nested route for details */}
          <Route path="/students" element={<Students />}>
            {/* Nested route: /students/:id shows StudentDetails */}
            <Route path=":id" element={<StudentDetails />} />
          </Route>

          {/* Teachers section with nested route for details */}
          <Route path="/teachers" element={<Teachers />}>
            {/* Nested route: /teachers/:id shows TeacherDetails */}
            <Route path=":id" element={<TeacherDetails />} />
          </Route>

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

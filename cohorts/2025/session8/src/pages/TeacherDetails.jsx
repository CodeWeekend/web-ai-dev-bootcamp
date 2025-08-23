// TeacherDetails.jsx
// This page shows the details for a single teacher, based on the ID in the URL.

// Import hooks from react-router-dom to get route parameters and navigate programmatically
import { useParams, useNavigate } from "react-router-dom";

// Import teachers data from centralized file
import teachers from "../data/teachers";

export default function TeacherDetails() {
  // Get the teacher ID from the URL (e.g., /teachers/1)
  const { id } = useParams();
  // Get the navigate function to go back to the previous page
  const navigate = useNavigate();
  // Find the teacher with the matching ID
  const teacher = teachers.find((t) => t.id === id);

  // If no teacher is found, show a not found message
  if (!teacher) {
    return (
      <div>
        <h2>Teacher Not Found</h2>
        {/* Button to go back to the previous page */}
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Show the teacher's details
  return (
    <div>
      <h2>{teacher.name}</h2>
      <p>Subject: {teacher.subject}</p>
      {/* Button to go back to the previous page */}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

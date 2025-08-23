// StudentDetails.jsx
// This page shows the details for a single student, based on the ID in the URL.

// Import hooks from react-router-dom to get route parameters and navigate programmatically
import { useParams, useNavigate } from "react-router-dom";

// Import students data from centralized file
import students from "../data/students";

export default function StudentDetails() {
  // Get the student ID from the URL (e.g., /students/1)
  const { id } = useParams();
  // Get the navigate function to go back to the previous page
  const navigate = useNavigate();
  // Find the student with the matching ID
  const student = students.find((s) => s.id === id);

  // If no student is found, show a not found message
  if (!student) {
    return (
      <div>
        <h2>Student Not Found</h2>
        {/* Button to go back to the previous page */}
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Show the student's details
  return (
    <div>
      <h2>{student.name}</h2>
      <p>Age: {student.age}</p>
      <p>Grade: {student.grade}</p>
      {/* Button to go back to the previous page */}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

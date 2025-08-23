// Students.jsx
// This page shows a list of students as cards. Each card links to a details page for that student.
// It also uses nested routing to show the details below the list when a student is selected.

// Import Link (for navigation) and Outlet (for nested routes) from react-router-dom
import { Link, Outlet } from "react-router-dom";

// Import students data from centralized file
import students from "../data/students";

// The main Students component
export default function Students() {
  return (
    <div>
      {/* Page title */}
      <h1>Students</h1>

      {/* List of student cards */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {/* Loop through each student and show their info in a card */}
        {students.map((student) => (
          <div
            key={student.id}
            className="card"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              minWidth: "150px",
            }}
          >
            {/* Student name */}
            <h3>{student.name}</h3>
            {/* Student age and grade */}
            <p>Age: {student.age}</p>
            <p>Grade: {student.grade}</p>
            {/* Link to the details page for this student */}
            <Link to={`/students/${student.id}`}>View Details</Link>
          </div>
        ))}
      </div>

      {/* This is where the nested route (StudentDetails) will show up */}
      <div style={{ marginTop: "2rem" }}>
        <Outlet />
      </div>
    </div>
  );
}

import { useState } from "react";
import Header from "./components/Header.jsx";
import StudentSummary from "./components/StudentSummary.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const username = "Christina";
  const avatarUrl = "https://i.pravatar.cc/72?img=5";

  return (
    <div
      style={{
        fontFamily: "system-ui, Arial",
        padding: "24px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <Header
        username={username}
        avatarUrl={avatarUrl}
        onLogout={() => setIsLoggedIn(false)}
      />
      <h1 style={{ marginTop: 16 }}>Student Dashboard</h1>

      {!isLoggedIn ? (
        <p>You are logged out.</p>
      ) : (
        <p>Welcome back! {username}</p>
      )}

      {isLoggedIn && (
        <>
          <StudentSummary gpa={3.62} credits={48} upcoming={2} />
        </>
      )}
    </div>
  );
}

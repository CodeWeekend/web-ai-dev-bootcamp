function Stat({ label, value }) {
  return (
    <div
      style={{
        padding: 12,
        border: "1px solid #eee",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
    </div>
  );
}

export default function StudentSummary({ gpa, credits, upcoming }) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        margin: "16px 0",
      }}
    >
      <Stat label="GPA" value={gpa.toFixed(2)} />
      <Stat label="Credits" value={credits} />
      <Stat label="Upcoming" value={upcoming} />
    </section>
  );
}

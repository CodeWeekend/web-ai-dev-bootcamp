export default function Header({ username, avatarUrl, onLogout }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={avatarUrl}
          alt={`${username} avatar`}
          width="36"
          height="36"
          style={{ borderRadius: "50%" }}
        />
        <strong>{username}</strong>
      </div>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
}

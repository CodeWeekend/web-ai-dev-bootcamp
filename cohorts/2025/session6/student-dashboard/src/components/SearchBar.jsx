export default function SearchBar({ query, onChange, onSubmit }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, margin: "16px 0" }}
    >
      <input
        placeholder="Search courses…"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Search</button>
    </form>
  );
}

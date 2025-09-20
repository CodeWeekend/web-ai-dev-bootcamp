import { useEffect, useState } from "react";
import "./App.css";

// Lesson UI: Minimal, commented panels to explore local LLMs with Ollama
const TABS = ["Status", "Chat", "RAG", "Extras"];

function App() {
  const [tab, setTab] = useState("Status");
  return (
    <div className="App">
      <h1>Local LLMs with Ollama</h1>
      <p>Simple demos: health, chat, and a tiny RAG.</p>
      <TabBar tab={tab} setTab={setTab} />
      {tab === "Status" && <StatusPanel />}
      {tab === "Chat" && <ChatPanel />}
      {tab === "RAG" && <RagPanel />}
      {tab === "Extras" && <ExtrasPanel />}
    </div>
  );
}

function TabBar({ tab, setTab }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      {TABS.map((t) => (
        <button key={t} onClick={() => setTab(t)} disabled={t === tab}>
          {t}
        </button>
      ))}
    </div>
  );
}

function StatusPanel() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const check = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/ollama/health");
      const j = await r.json();
      setData(j);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    check();
  }, []);
  return (
    <div>
      <h2>Ollama Status</h2>
      <p>Ollama should be running locally. Click refresh if needed.</p>
      <button onClick={check} disabled={loading}>
        {loading ? "Checking…" : "Refresh"}
      </button>
      <pre
        style={{
          background: "#111",
          padding: 12,
          borderRadius: 8,
          overflow: "auto",
        }}
      >
        {data ? JSON.stringify(data, null, 2) : "No data yet."}
      </pre>
    </div>
  );
}

function ChatPanel() {
  const [input, setInput] = useState(
    "Explain what Ollama is in one paragraph."
  );
  const [model, setModel] = useState("gpt-oss:20b");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const send = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/ollama/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: newMessages }),
      });
      const j = await r.json();
      if (j?.message?.content) {
        setMessages([...newMessages, j.message]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "(No content)" },
        ]);
      }
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error: " + String(e) },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2>Simple Chat</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label>
          Model:&nbsp;
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-oss:20b"
          />
        </label>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something…"
        />
        <button onClick={send} disabled={loading}>
          {loading ? "Thinking…" : "Send"}
        </button>
      </div>
      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              background: m.role === "user" ? "#222" : "#1a2a1a",
              padding: 8,
              borderRadius: 6,
            }}
          >
            <strong>{m.role}</strong>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RagPanel() {
  const [texts, setTexts] = useState(
    "Ollama runs AI models locally.\nYou can pull models like gpt-oss:20b.\nEmbeddings turn text into vectors.\nRAG retrieves relevant text to help answer questions."
  );
  const [query, setQuery] = useState("What is RAG?");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const reset = async () => {
    await fetch("/api/rag/reset", { method: "POST" });
    setResult({ note: "Store cleared" });
  };
  const add = async () => {
    const items = texts
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return;
    setBusy(true);
    try {
      const r = await fetch("/api/rag/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: items }),
      });
      const j = await r.json();
      setResult(j);
    } finally {
      setBusy(false);
    }
  };
  const ask = async () => {
    if (!query.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const j = await r.json();
      setResult(j);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <h2>Mini RAG Demo</h2>
      <p>1) Add some short facts. 2) Ask a question.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          style={{ flex: 1, minHeight: 120 }}
          value={texts}
          onChange={(e) => setTexts(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={reset}>Reset</button>
          <button onClick={add} disabled={busy}>
            {busy ? "Adding…" : "Add to Store"}
          </button>
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Your question"
        />
        <button onClick={ask} disabled={busy}>
          {busy ? "Searching…" : "Ask"}
        </button>
      </div>
      <pre
        style={{
          background: "#111",
          padding: 12,
          borderRadius: 8,
          overflow: "auto",
          marginTop: 12,
        }}
      >
        {result ? JSON.stringify(result, null, 2) : "No result yet."}
      </pre>
    </div>
  );
}

function ExtrasPanel() {
  return (
    <div>
      <h2>Extras</h2>
      <ul>
        <li>Browser embeddings with transformers.js (see README)</li>
        <li>HuggingFace Inference API usage (see README)</li>
        <li>Try other models via Ollama (mistral, llama3, codellama)</li>
      </ul>
    </div>
  );
}

export default App;

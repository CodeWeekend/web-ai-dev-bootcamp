import React, { useState } from "react";
import "./ChatWithAI.css";
import ReactMarkdown from "react-markdown";

//Example prompt: I loved reading 40 rules of love by Elif Shafak. What next book should I read?

function ChatWithAI() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const result = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: prompt,
      }),
    });

    const data = await result.json();
    setResponse(data.output?.[0].content?.[0].text || "No response");
    setLoading(false);
  };

  return (
    <div className="chat-ai-container">
      <form onSubmit={handleSubmit} className="chat-ai-form">
        <input
          value={prompt}
          type="text"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message.."
          className="chat-ai-input"
        />
        <button type="submit" className="chat-ai-button">
          {loading ? (
            <span className="chat-ai-thinking">Thinking...</span>
          ) : (
            "Send"
          )}
        </button>
      </form>

      <div className="chat-ai-response-container">
        <strong className="chat-ai-response-label">AI Reponse:</strong>
        <p className="chat-ai-response">
          <ReactMarkdown>{response}</ReactMarkdown>
        </p>
      </div>
    </div>
  );
}

export default ChatWithAI;

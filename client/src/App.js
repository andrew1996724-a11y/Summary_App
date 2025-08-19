import React, { useState, useEffect } from "react";
import "./App.css"; // Import our new styles

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);

  // Load history from backend
  const loadHistory = async () => {
    const res = await fetch("https://summary-app-2.onrender.com/api/summarize/getSummarises");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, [summary]);

  const handleSummarize = async () => {
    const res = await fetch("https://summary-app-2.onrender.com/api/summarize/createOne", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    setSummary(data.summary);
    setText("");
    await loadHistory();
  };

  return (
    <div className="app-container">
      <h1 className="title">📝 AI Powered Text Summarizer</h1>

      <textarea
        className="input-textarea"
        rows="6"
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button className="summarize-button" onClick={handleSummarize}>
        Summarize
      </button>

      {summary && (
        <div className="summary-card">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      <div className="history-section">
        <h2>Past Summaries</h2>
        {history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="history-card">
              <p>
                <b>Original:</b> {item.original_text}
              </p>
              <p>
                <b>Summary:</b> {item.summary}
              </p>
              <small>{item.created_at}</small>
            </div>
          ))
        ) : (
          <p className="empty-history">No past summaries yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;

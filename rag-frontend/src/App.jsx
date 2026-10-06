import { useState } from "react";
import "./App.css";

const API_URL = "https://interview-rag-project.onrender.com";
function App() {
  const [activePage, setActivePage] = useState("upload");

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          RAG<span>AI</span>
        </div>

        <div className="nav-links">
          <button
            className={activePage === "upload" ? "active" : ""}
            onClick={() => setActivePage("upload")}
          >
            Upload
          </button>

          <button
            className={activePage === "chat" ? "active" : ""}
            onClick={() => setActivePage("chat")}
          >
            Chat
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activePage === "upload" ? <UploadPage /> : <ChatPage />}
      </main>
    </div>
  );
}

/* =========================
   Upload Page
========================= */

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      setUploadResult(data);
      setMessage("PDF uploaded and stored successfully!");
    } catch (error) {
      console.error("Upload error:", error);

      setMessage(
        error.message ||
          "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">DOCUMENT INTELLIGENCE</p>

        <h1>Upload your documents</h1>

        <p>
          Add PDFs and documents to your knowledge base and start asking
          questions about them.
        </p>
      </div>

      <div className="upload-card">
        <div className="upload-icon">↑</div>

        <h2>
          {selectedFile ? "File selected" : "Upload a document"}
        </h2>

        <p>
          {selectedFile
            ? selectedFile.name
            : "Choose a PDF file from your computer."}
        </p>

        <label className="primary-btn">
          Choose File

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            hidden
          />
        </label>

        {selectedFile && (
          <button
            className="primary-btn upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Processing..." : "Upload PDF"}
          </button>
        )}

        <span className="file-info">Supported format: PDF</span>

        {message && <p className="upload-message">{message}</p>}

        {uploadResult && (
          <div className="upload-result">
            <p>
              <strong>Chunks:</strong> {uploadResult.total_chunks}
            </p>

            <p>
              <strong>Stored in Qdrant:</strong>{" "}
              {uploadResult.stored_in_qdrant}
            </p>

            <p>
              <strong>Embedding dimension:</strong>{" "}
              {uploadResult.embedding_dimension}
            </p>
          </div>
        )}
      </div>

      <div className="info-grid">
        <div className="info-card">
          <span>01</span>
          <h3>Upload</h3>
          <p>Add your document to the knowledge base.</p>
        </div>

        <div className="info-card">
          <span>02</span>
          <h3>Process</h3>
          <p>Your document is converted into searchable knowledge.</p>
        </div>

        <div className="info-card">
          <span>03</span>
          <h3>Ask</h3>
          <p>Ask questions and get answers from your documents.</p>
        </div>
      </div>
    </section>
  );
}

/* =========================
   Chat Page
========================= */


function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChat = async () => {
    if (!question.trim() || loading) {
      return;
    }

    const currentQuestion = question.trim();

    // Add user's question immediately to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer.");
      }

      // Add AI answer without removing previous messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setError(
        error.message ||
          "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleChat();
    }
  };

  return (
    <section className="page chat-page">
      <div className="page-header">
        <p className="eyebrow">RAG ASSISTANT</p>

        <h1>Ask your documents</h1>

        <p>
          Ask questions and continue the conversation with your uploaded
          documents.
        </p>
      </div>

      <div className="chat-card">
        <div className="chat-messages">
          {messages.length === 0 && !loading && !error && (
            <div className="empty-chat">
              <div className="chat-icon">✦</div>

              <h2>Start a conversation</h2>

              <p>
                Your answers will be generated from the documents in your
                knowledge base.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? "message user-message"
                  : "message assistant-message"
              }
            >
              <p className="message-label">
                {message.role === "user" ? "YOU" : "RAG AI"}
              </p>

              <p className="message-content">{message.content}</p>
            </div>
          ))}

          {loading && (
            <div className="message assistant-message">
              <p className="message-label">RAG AI</p>
              <p className="message-content">
                Thinking... Searching your documents and generating an answer.
              </p>
            </div>
          )}

          {error && (
            <div className="empty-chat">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about your documents..."
            disabled={loading}
          />

          <button
            className="send-btn"
            onClick={handleChat}
            disabled={loading || !question.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}


export default App;
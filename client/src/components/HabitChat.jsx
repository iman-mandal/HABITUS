import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const HabitChat = ({ onClose, theme = 'dark' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get theme from localStorage if not provided
  const currentTheme = theme || localStorage.getItem('userTheme') || 'dark';
  const isLight = currentTheme === 'light';

  // Set CSS variables based on theme
  useEffect(() => {
    if (isLight) {
      document.documentElement.style.setProperty('--textarea-focus-border', '#89A8B2');
      document.documentElement.style.setProperty('--textarea-focus-ring', 'rgba(137, 168, 178, 0.5)');
      document.documentElement.style.setProperty('--textarea-placeholder', 'rgba(90, 109, 119, 0.6)');
    } else {
      document.documentElement.style.setProperty('--textarea-focus-border', '#124E66');
      document.documentElement.style.setProperty('--textarea-focus-ring', 'rgba(18, 78, 102, 0.5)');
      document.documentElement.style.setProperty('--textarea-placeholder', 'rgba(116, 141, 146, 0.6)');
    }
  }, [isLight]);

  // Initial greeting
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: "👋 Hi! I'm your Habit AI Coach. I can help you with:\n• Habit tracking tips\n• Motivation advice\n• Progress analysis\n• Setting realistic goals\n\nWhat would you like to know?"
    }]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ai/chat`,
        { message: userMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const aiMessage = response.data?.reply?.content || "Thanks for your message!";

      // Add AI message with Markdown support
      setMessages(prev => [...prev, { role: "assistant", content: aiMessage }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, I'm having trouble connecting. Please try again in a moment."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "👋 Hi! I'm your Habit AI Coach. I can help you with:\n• Habit tracking tips\n• Motivation advice\n• Progress analysis\n• Setting realistic goals\n\nWhat would you like to know?"
    }]);
  };

  return (
    <div className={`chat-overlay ${isLight ? 'chat-overlay-light' : 'chat-overlay-dark'}`}>
      {/* Chat Container */}
      <div className={`chat-container ${isLight ? 'chat-container-light' : 'chat-container-dark'}`}>

        {/* Header */}
        <div className={`chat-header ${isLight ? 'chat-header-light' : 'chat-header-dark'}`}>
          <div className="header-content">
            <div className="header-left">
              <div className={`header-avatar ${isLight ? 'header-avatar-light' : 'header-avatar-dark'}`}>
                <span className="header-avatar-text">🤖</span>
              </div>
              <div>
                <h2 className={`header-title ${isLight ? 'header-title-light' : 'header-title-dark'}`}>
                  Habit AI Coach
                </h2>
                <p className={`header-subtitle ${isLight ? 'header-subtitle-light' : 'header-subtitle-dark'}`}>
                  Your personal habit assistant
                </p>
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={clearChat}
                className={`clear-button ${isLight ? 'clear-button-light' : 'clear-button-dark'}`}
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className={`close-button ${isLight ? 'close-button-light' : 'close-button-dark'}`}
              >
                <span><i className="ri-close-fill text-2xl"></i></span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`messages-area ${isLight ? 'messages-area-light' : 'messages-area-dark'}`}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-container ${msg.role === "user" ? "message-container-user" : "message-container-ai"}`}
            >
              <div 
                className={`message-bubble ${
                  msg.role === "user" 
                    ? (isLight ? "message-bubble-user-light" : "message-bubble-user-dark")
                    : (isLight ? "message-bubble-ai-light" : "message-bubble-ai-dark")
                }`}
              >
                <div className="message-content">
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="markdown-paragraph" {...props} />,
                        strong: ({ node, ...props }) => <strong className="markdown-strong" {...props} />,
                        ul: ({ node, ...props }) => <ul className="markdown-list" {...props} />,
                        li: ({ node, ...props }) => <li className="markdown-list-item" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
              <div className={`message-sender ${isLight ? 'message-sender-light' : 'message-sender-dark'}`}>
                {msg.role === "user" ? "You" : "AI Coach"}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="loading-container">
              <div className={`loading-bubble ${isLight ? 'loading-bubble-light' : 'loading-bubble-dark'}`}>
                <div className="loading-content">
                  <div className="loading-dots">
                    <div className={`loading-dot ${isLight ? 'loading-dot-light' : 'loading-dot-dark'}`} />
                    <div className={`loading-dot ${isLight ? 'loading-dot-light' : 'loading-dot-dark'}`} />
                    <div className={`loading-dot ${isLight ? 'loading-dot-light' : 'loading-dot-dark'}`} />
                  </div>
                  <span className={`loading-text ${isLight ? 'loading-text-light' : 'loading-text-dark'}`}>
                    Crafting response...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="message-end-ref" />
        </div>

        {/* Input Area */}
        <div className={`input-area ${isLight ? 'input-area-light' : 'input-area-dark'}`}>
          <div className="input-wrapper">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your habits, motivation, or tracking..."
              className={`chat-textarea ${isLight ? 'chat-textarea-light' : 'chat-textarea-dark'}`}
              rows="2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`send-button ${isLight ? 'send-button-light' : 'send-button-dark'}`}
            >
              {loading ? (
                <div className={`spinner-small ${isLight ? 'spinner-light' : 'spinner-dark'}`} />
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
          <p className={`instructions ${isLight ? 'instructions-light' : 'instructions-dark'}`}>
            Press <span className="instructions-key">Enter</span> to send • <span className="instructions-key">Shift+Enter</span> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitChat;
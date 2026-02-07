import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const HabitChat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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

      // Add AI response
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: response.data?.reply?.content || "Thanks for your message!"
        }
      ]);

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

  // Suggested questions
  const suggestedQuestions = [
    "How can I build consistency?",
    "Tips for morning routines?",
    "How to track progress?",
    "Best habit stacking methods?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Chat Container */}
      <div className="relative w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Habit AI Coach</h2>
                <p className="text-white/80 text-xs">Your personal habit assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow-sm rounded-bl-none border"
                  }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {msg.role === "user" ? "You" : "AI Coach"}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                  </div>
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="mt-4">
              <p className="text-gray-500 text-sm mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="px-3 py-2 bg-white border rounded-full text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              rows="2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="self-end px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitChat;
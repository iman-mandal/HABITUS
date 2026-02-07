import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const HabitChat = ({ onClose, theme = 'dark' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Theme colors
  const themeColors = {
    light: {
      // Main backgrounds
      bgGradient: "from-[#F1F0E8] to-[#E5E1DA]",
      modalBg: "bg-white",
      headerGradient: "from-[#89A8B2] to-[#B3C8CF]",
      messagesBg: "bg-gradient-to-b from-[#F1F0E8] to-[#E5E1DA]",

      // Text colors
      primaryText: "text-[#2E3944]",
      secondaryText: "text-[#5A6D77]",
      whiteText: "text-white",

      // Message bubbles
      userMessage: "bg-gradient-to-r from-[#89A8B2] to-[#5A6D74] text-white",
      aiMessage: "bg-gradient-to-r from-white to-[#F1F0E8] text-[#2E3944] border border-[#B3C8CF]/30",

      // Input area
      inputBg: "bg-white border-[#B3C8CF]/50",
      inputFocus: "ring-[#89A8B2]/50",
      inputPlaceholder: "text-[#5A6D77]/60",

      // Buttons
      sendBtn: "bg-gradient-to-r from-[#89A8B2] to-[#5A6D74] text-white",
      sendBtnHover: "hover:from-[#5A6D74] hover:to-[#89A8B2]",
      suggestionBtn: "bg-white border-[#B3C8CF]/50 text-[#2E3944] hover:bg-[#F1F0E8]",

      // Loading dots
      loadingDot: "bg-[#5A6D74]",
      loadingText: "text-[#5A6D77]",

      // Close button
      closeBtn: "text-white/80 hover:text-white",

      // Divider
      divider: "border-[#B3C8CF]/30",
    },
    dark: {
      // Main backgrounds
      bgGradient: "from-[#0F1A23] to-[#1A2832]",
      modalBg: "bg-[#2E3944]",
      headerGradient: "from-[#124E66] to-[#1E3A52]",
      messagesBg: "bg-gradient-to-b from-[#212A31] to-[#2E3944]",

      // Text colors
      primaryText: "text-[#D3D9D4]",
      secondaryText: "text-[#748D92]",
      whiteText: "text-white",

      // Message bubbles
      userMessage: "bg-gradient-to-r from-[#124E66] to-[#1E3A52] text-white",
      aiMessage: "bg-gradient-to-r from-[#212A31] to-[#2E3944] text-[#D3D9D4] border border-[#748D92]/30",

      // Input area
      inputBg: "bg-[#212A31] border-[#748D92]/30",
      inputFocus: "ring-[#124E66]/50",
      inputPlaceholder: "text-[#748D92]/60",

      // Buttons
      sendBtn: "bg-gradient-to-r from-[#124E66] to-[#1E3A52] text-white",
      sendBtnHover: "hover:from-[#1E3A52] hover:to-[#124E66]",
      suggestionBtn: "bg-[#2E3944] border-[#748D92]/30 text-[#D3D9D4] hover:bg-[#212A31]",

      // Loading dots
      loadingDot: "bg-[#D3D9D4]",
      loadingText: "text-[#748D92]",

      // Close button
      closeBtn: "text-[#D3D9D4]/80 hover:text-white",

      // Divider
      divider: "border-[#748D92]/30",
    }
  };

  const colors = themeColors[theme];

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

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "👋 Hi! I'm your Habit AI Coach. I can help you with:\n• Habit tracking tips\n• Motivation advice\n• Progress analysis\n• Setting realistic goals\n\nWhat would you like to know?"
    }]);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'light' ? 'bg-black/30' : 'bg-black/70'} p-4 backdrop-blur-sm`}>
      {/* Chat Container */}
      <div className={`relative w-full max-w-md h-[600px] ${colors.modalBg} rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${theme === 'light' ? 'border-[#B3C8CF]/20' : 'border-[#748D92]/20'}`}>

        {/* Header */}
        <div className={`bg-gradient-to-r ${colors.headerGradient} p-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${theme === 'light' ? 'bg-white/30' : 'bg-white/20'} rounded-full flex items-center justify-center backdrop-blur-sm`}>
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h2 className={`font-['Merriweather'] font-bold ${colors.whiteText} text-xl`}>
                  Habit AI Coach
                </h2>
                <p className={`font-['Source_Sans_Pro'] ${colors.whiteText}/80 text-sm`}>
                  Your personal habit assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className={`px-3 py-1.5 ${theme === 'light' ? 'bg-white/20' : 'bg-white/10'} ${colors.whiteText} rounded-lg text-xs font-medium hover:bg-white/30 transition`}
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${colors.closeBtn} hover:bg-white/10 transition`}
              >
                <span><i className="ri-close-fill text-2xl"></i></span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 p-5 overflow-y-auto ${colors.messagesBg} 
          scrollbar-none
          -ms-overflow-style: none;  
          scrollbar-width: none; `}
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-5 ${msg.role === "user" ? "text-right" : "text-left"}`
              }
            >
              <div
                className={`inline-block max-w-[85%] rounded-3xl px-5 py-4 shadow-md ${msg.role === "user"
                  ? `${colors.userMessage} rounded-br-none`
                  : `${colors.aiMessage} rounded-bl-none`
                  }`}
              >
                <div className="whitespace-pre-wrap font-['Source_Sans_Pro'] text-[15px] leading-relaxed">
                  {msg.content}
                </div>
              </div>
              <div className={`font-['Source_Sans_Pro'] text-xs ${colors.secondaryText} mt-2`}>
                {msg.role === "user" ? "You" : "AI Coach"}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="text-left mb-5">
              <div className={`inline-block ${colors.aiMessage} rounded-3xl rounded-bl-none px-5 py-4 shadow-md`}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.loadingDot} animate-bounce`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.loadingDot} animate-bounce delay-150`} />
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.loadingDot} animate-bounce delay-300`} />
                  </div>
                  <span className={`font-['Source_Sans_Pro'] text-sm ${colors.loadingText}`}>
                    Crafting response...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="mt-6">
              <p className={`font-['Merriweather'] font-medium ${colors.secondaryText} text-sm mb-3`}>
                Quick questions to get started:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(question);
                      document.querySelector('textarea')?.focus();
                    }}
                    className={`px-4 py-2.5 ${colors.suggestionBtn} rounded-xl text-sm font-['Source_Sans_Pro'] transition-all hover:scale-[1.02] active:scale-95`}
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
        <div className={`p-5 border-t ${colors.divider}`}>
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your habits, motivation, or tracking..."
              className={`flex-1 px-4 ${colors.primaryText} py-3.5 ${colors.inputBg} 
              rounded-xl resize-none focus:outline-none 
              focus:ring-2 ${colors.inputFocus} 
              font-['Source_Sans_Pro'] text-sm 
              placeholder:${colors.inputPlaceholder}
                scrollbar-none
                -ms-overflow-style: none;
                scrollbar-width: none;`}
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
              rows="2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`self-end px-5 py-3.5 ${colors.sendBtn} ${colors.sendBtnHover} rounded-xl font-['Source_Sans_Pro'] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
          <p className={`font-['Source_Sans_Pro'] ${colors.secondaryText} text-xs mt-3 text-center`}>
            Press <span className="font-bold">Enter</span> to send • <span className="font-bold">Shift+Enter</span> for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitChat;
"use client";

import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const ChatBot = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];

    setMessages(newMessages);
    setInput("");

    // Simulated bot response
    const botReply = await fetchBotResponse(input);
    setMessages([...newMessages, { sender: "bot", text: botReply }]);
  };

  const fetchBotResponse = async (message: string): Promise<string> => {
    try {
      const res = await fetch("http://localhost:3000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      return data.response || "I'm sorry, I couldn't find an answer.";
    } catch (err) {
      return "An error occurred. Please try again later.";
    }
  };

  return (
    <section className="chatbot">
      <h2 className="page-title">Ask Me Anything</h2>
      <div className="container">
        <div className="section-header">
          <h2>ChatBot Assistant</h2>
          <p>Ask any policy-related question and I'll respond!</p>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-4 h-96 overflow-y-auto mb-4 shadow-inner">
            {messages.length === 0 ? (
              <div className="chat-intro text-gray-500 dark:text-gray-300">
                Ask me about policies in any state!
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 text-sm ${
                    msg.sender === "user" ? "text-right text-blue-600" : "text-left text-black dark:text-white"
                  }`}
                >
                  <span className="inline-block px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800">
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="input-wrapper">
            <input
              id="chatbot-input"
              className="policy-input w-full max-w-xl"
              type="text"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="cancel-button ml-2" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatBot;

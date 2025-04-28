"use client";

import React, { useState, FormEvent } from "react";
import { useTheme } from "../context/ThemeContext";

type Message = {
  sender: "user" | "bot";
  content: string;
};

export default function ChatBot() {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await res.json();
      const botMessage: Message = { sender: "bot", content: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const botMessage: Message = {
        sender: "bot",
        content: "Sorry, something went wrong. Please try again.",
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container chatbot-container">
      <div className="section-header">
        <h2>Chatbot</h2>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-intro">
            <div className="headline">How can I help?</div>
            <div className="subtext">Ask any questions you have about the policy or comparison result</div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            <div className="chat-message-content">{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-message bot">
            <div className="chat-message-content">
              <em>Typing...</em>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chatbot-form">
        <div className="input-wrapper">
          <input
            id="chatbot-input"
            type="text"
            placeholder="Type your question here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="submit-icon" disabled={loading}>
            <img src="/assets/images/chat/submit.svg" alt="Send" />
          </button>
        </div>
      </form>
    </div>
  );
}
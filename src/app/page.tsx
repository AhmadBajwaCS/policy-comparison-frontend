"use client";

import React, { useEffect, useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import USMap from "../app/components/USMap";
import { useTheme } from "../app/context/ThemeContext";
import rehypeRaw from "rehype-raw";
import ChatBot from "../app/components/Chatbot";  
// Chat message structure
type Message = { sender: "user" | "bot"; content: string };
  
const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];



export default function ComparePage() {
  const { theme } = useTheme();

  // Policy comparison state
  const [policyTypes, setPolicyTypes] = useState<any[]>([]);
  const [policyTypeId, setPolicyTypeId] = useState<string>("");
  const [state1, setState1] = useState<string>("");
  const [state2, setState2] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [interactiveMode, setInteractiveMode] = useState<boolean>(false);
  const [mapState1, setMapState1] = useState<string | null>(null);
  const [mapState2, setMapState2] = useState<string | null>(null);

  // Chatbot state
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Fetch available policy types on mount
  useEffect(() => {
    const fetchPolicyTypes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/policy-types");
        const data = await res.json();
        setPolicyTypes(data);
      } catch (error) {
        console.error("Failed to load policy types", error);
      }
    };
    fetchPolicyTypes();
  }, []);

  // Update map selections when interactive mode toggles
  useEffect(() => {
    if (interactiveMode) {
      if (state1) setMapState1(state1);
      if (state2) setMapState2(state2);
    }
  }, [interactiveMode]);

  const handleCompare = async () => {
    const selectedState1 = interactiveMode ? mapState1 : state1;
    const selectedState2 = interactiveMode ? mapState2 : state2;

    if (!selectedState1 || !selectedState2 || !policyTypeId) {
      alert("Please select two states and a policy type.");
      return;
    }
    if (selectedState1 === selectedState2) {
      setResponse({ error: "Please select two different states for comparison." });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/comparison?state1=${selectedState1}&state2=${selectedState2}&policy_type_id=${policyTypeId}`
      );
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Comparison failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleStateClick = (stateName: string) => {
    if (mapState1 === stateName) {
      setMapState1(null);
      setState1("");
    } else if (mapState2 === stateName) {
      setMapState2(null);
      setState2("");
    } else if (!mapState1) {
      setMapState1(stateName);
      setState1(stateName);
    } else if (!mapState2 && stateName !== mapState1) {
      setMapState2(stateName);
      setState2(stateName);
    }
  };

  //Chatbot
  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: Message = { sender: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
        const res = await fetch("http://localhost:5000/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              state1,
              state2,
              policy_type_id: policyTypeId,
              query: userMessage.content,
            }),
          });
      const data = await res.json();
      const botMessage: Message = { sender: "bot", content: data.response || data.error };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Sorry, something went wrong. Please try again." }

      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div>
      <section id="home">
                <h2 className="page-title">Policy Comparison Tool</h2>
                <div className="policy-comparison">
                    <div className="container">
                        <div className="section-header">
                            <h2>Policy & States</h2>
                            <p>Select a policy and two states to compare.</p>
                        </div>
                        <div className="selection">
                            <select value={policyTypeId} onChange={(e) => setPolicyTypeId(e.target.value)}>
                                <option value="" disabled>Policy</option>
                                {policyTypes.map((p) => (
                                    <option key={p.policy_type_id} value={p.policy_type_id}>{p.policy_name}</option>
                                ))}
                            </select>
                            <select value={state1} onChange={(e) => setState1(e.target.value)} disabled={interactiveMode}>
                                <option value="" disabled>State</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <select value={state2} onChange={(e) => setState2(e.target.value)} disabled={interactiveMode}>
                                <option value="" disabled>State</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                <button id="compare" onClick={handleCompare}>Compare</button>
                                <label className="interact">
                                    Interactive Mode
                                    <input className="checkbox" type="checkbox" checked={interactiveMode} onChange={() => setInteractiveMode((prev) => !prev)} />
                                </label>
                            </div>
                        </div>
                        {interactiveMode && (
                            <USMap selectedStates={[mapState1, mapState2]} onStateClick={handleStateClick} />
                        )}
                    </div>
                </div>

                <div className="results">
                    <div className="container">
                        <div className="section-header">
                            <h2>Results</h2>
                            <p>View a summary of the comparison and its sources.</p>
                        </div>

                        {loading ? (
                            <div className="spinner-wrapper">
                                <div className="spinner" />
                            </div>
                        ) : !response ? (
                            <div className="result-content initial-message">
                                <p className="subtext">Use the dropdown buttons above to get started!</p>
                            </div>
                        ) : response && !response.error && (
                            <div className="result-content">
                                {response.visualization && Array.isArray(response.visualization) && (
                                    <div className="visualization-table">
                                        <h3>Comparing {response.policy_name} in {response.state1} and {response.state2}</h3>
                                        <table className="table-custom">
                                            <thead>
                                                <tr>
                                                    <th>Category</th>
                                                    <th>{response.state1}</th>
                                                    <th>{response.state2}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {response.visualization.map((row, index) => (
                                                    <tr key={index}>
                                                        <td>{row.category}</td>
                                                        <td className="hover-cell">
                                                            {row[response.state1]}
                                                            {row[`${response.state1}_source`] && row[`${response.state1}_source`] !== "0" && (
                                                                <div className="tooltip-wrapper">
                                                                <span className="source-tooltip">
                                                                    Source: <a href={row[`${response.state1}_source`]} target="_blank" rel="noopener noreferrer">
                                                                    {row[`${response.state1}_source`]}
                                                                    </a>
                                                                </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="hover-cell">
                                                            {row[response.state2]}
                                                            {row[`${response.state2}_source`] && row[`${response.state1}_source`] !== "0" && (
                                                                <div className="tooltip-wrapper">
                                                                <span className="source-tooltip">
                                                                    Source: <a href={row[`${response.state1}_source`]} target="_blank" rel="noopener noreferrer">
                                                                    {row[`${response.state1}_source`]}
                                                                    </a>
                                                                </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {(() => {
                                const paragraphs = response.comparison_text.split("\n\n");
                                const lastParagraph = paragraphs.pop(); // take out the last one
                                const restOfText = paragraphs.join("\n\n");

                                return (
                                    <>
                                    <div className="comparison-text">
                                        <ReactMarkdown>{restOfText}</ReactMarkdown>
                                    </div>
                                    <div className="last-paragraph">
                                        <ReactMarkdown>{lastParagraph}</ReactMarkdown>
                                    </div>
                                    </>
                                );
                                })()}

                                {response.sources && response.sources.length > 0 && (
                                    <div>
                                        <br />
                                        <strong>Sources:</strong>
                                        <ul id="sources" className="sources-list">
                                            {response.sources.map((source, index) => (
                                                <li key={index} className="source-item">
                                                    <a href={source} target="_blank" rel="noopener noreferrer">
                                                        <Image
                                                            src={`/assets/images/${theme === "light" ? "link-icon" : "link-icon-white"}.png`}
                                                            alt="Link icon"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        <span>{`Source ${index + 1}: ${source}`}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.5rem", fontStyle: "italic" }}>
                                    Last updated: {new Date(response.last_updated).toLocaleString()}
                                </div>
                            </div>
                        )}

                        {response?.error && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                                <div
                                    style={{
                                        display: "inline-block",
                                        backgroundColor: theme === "light" ? "#ffe5e5" : "#4b1c1c",
                                        color: theme === "light" ? "#b00020" : "#ffbaba",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "8px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        border: theme === "light" ? "1px solid #f5c2c7" : "1px solid #ffbaba"
                                    }}
                                >
                                    {response.error}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

      {/* Chatbot Section */}
      <div className="chatbot">
        <div className="container" style={{ display: "flex", flexDirection: "column", minHeight: "50vh" }}>
          <div className="section-header">
            <h2>Chatbot</h2>
          </div>
          <div style={{ flex: 1, padding: "1rem 1.5rem", overflowY: "auto" }}>
            {chatMessages.length === 0 && !chatLoading && (
              <div className="chat-intro">
                <div className="headline">How can I help?</div>
                <div className="subtext">Ask any questions you have about the policy or comparison result</div>
              </div>
            )}
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "1rem"
                }}
              >
                <div
                  style={{
                    background: msg.sender === "user" ? "#f3f3f3" : theme === "light" ? "#e5e7eb" : "#1f2937",
                    color: theme === "light" ? "#000" : "#fff",
                    padding: "1rem",
                    borderRadius: "12px",
                    maxWidth: "100%",
                    fontSize: "1rem"
                  }}
                >
                  <div className='chat-message-content'>
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1rem" }}>
                <div
                  style={{
                    background: theme === "light" ? "#e5e7eb" : "#1f2937",
                    color: theme === "light" ? "#000" : "#fff",
                    padding: "1rem",
                    borderRadius: "12px",
                    maxWidth: "100%",
                    fontSize: "1rem"
                  }}
                >
                  <em>Typing...</em>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleChatSubmit} style={{ padding: "0 25px 1.5rem", boxSizing: "border-box" }}>
            <div className="input-wrapper">
              <input
                id="chatbot-input"
                type="text"
                placeholder="Type your question here..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
              />
              <button type="submit" className="submit-icon" disabled={chatLoading}>
                <img src="/assets/images/chat/submit.svg" alt="Send" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import USMap from "../components/USMap";
import { useTheme } from "../context/ThemeContext";
import rehypeRaw from "rehype-raw";

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

// const stateAbbreviations: Record<string, string> = {
//     Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO",
//     Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
//     Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
//     Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
//     Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
//     "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
//     "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
//     Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
//     Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA",
//     "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY"
// };

// const getStateAbbreviation = (stateName: string): string =>
//     stateAbbreviations[stateName] || stateName;

// const getStateFullName = (abbreviation: string): string => {
//     const entry = Object.entries(stateAbbreviations).find(([, abbr]) => abbr === abbreviation);
//     return entry ? entry[0] : abbreviation;
// };


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
                            <div className="loading-wrapper">
                              <div className="loading-bar" />
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
                                                            <span className="source-tooltip">
                                                                Source: <a href={row[`${response.state1}_source`]} target="_blank" rel="noopener noreferrer">
                                                                    {row[`${response.state1}_source`]}
                                                                </a>
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="hover-cell">
                                                        {row[response.state2]}
                                                        {row[`${response.state2}_source`] && row[`${response.state2}_source`] !== "0" && (
                                                            <span className="source-tooltip">
                                                                Source: <a href={row[`${response.state2}_source`]} target="_blank" rel="noopener noreferrer">
                                                                    {row[`${response.state2}_source`]}
                                                                </a>
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {`**${response.state1}:**<div class="processed-text">${response.state1_processed_text}</div>`}
                                </ReactMarkdown>
                                <br />
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {`**${response.state2}:**<div class="processed-text">${response.state2_processed_text}</div>`}
                                </ReactMarkdown>

                                <div className="comparison-text">
                                    <br />
                                    <h3>Comparison:</h3>
                                    <ReactMarkdown>{response.comparison_text}</ReactMarkdown>
                                </div>
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
                    maxWidth: "80%",
                    fontSize: "1rem"
                  }}
                >
                  <div className='chat-message-content'>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
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
                    maxWidth: "80%",
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

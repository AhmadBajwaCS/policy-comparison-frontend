"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const policies = [
  "Minimum Wage",
  "Medicaid Expansion",
  "Right-To-Work Laws",
  "Marijuana",
  "State Income Tax",
];

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export default function TestPage() {
  const [policy, setPolicy] = useState("");
  const [state1, setState1] = useState("");
  const [state2, setState2] = useState("");
  const [response, setResponse] = useState(null);

  const handleTestRequest = async () => {
    if (!policy || !state1 || !state2) {
      alert("Select a policy and two states.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/test-comparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ policy, state1, state2 }),
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse("Error");
    }
  };

  return (
    <div>
      <h1>Test Page</h1>

      <label>
        <select value={policy} onChange={(e) => setPolicy(e.target.value)}>
          <option value="">Policy</option>
          {policies.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <label>
        <select value={state1} onChange={(e) => setState1(e.target.value)}>
          <option value="">First State</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label>
        <select value={state2} onChange={(e) => setState2(e.target.value)}>
          <option value="">Second State</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <button onClick={handleTestRequest}>
        Compare
      </button>

      {response && response !== "Error" && (
        <div>
          <h2>Comparison: {response.policy} ({response.state1} vs. {response.state2})</h2>
          
          <div className="comparison-text">
            <ReactMarkdown>{response.comparison}</ReactMarkdown>
          </div>

          <table border="1">
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
                  <td>{row[response.state1]}</td>
                  <td>{row[response.state2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {response === "Error" && <p style={{ color: "red" }}>Error fetching data.</p>}
    </div>
  );
}

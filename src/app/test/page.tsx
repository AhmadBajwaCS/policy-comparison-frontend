"use client";

import React, { useState } from "react";

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
  const [state, setState] = useState("");
  const [response, setResponse] = useState("");

  const handleTestRequest = async () => {
    if (!policy || !state) {
      alert("Select both a policy and a state.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ policy, state }),
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error");
    }
  };

  return (
    <div>
      <h1>Test Page</h1>

      <label>
        <select value={policy} onChange={(e) => setPolicy(e.target.value)}>
          <option value="">Select Policy</option>
          {policies.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </label>

      <label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <button onClick={handleTestRequest}>
        Compare
      </button>

      {response && (
        <pre>
          {response}
        </pre>
      )}
    </div>
  );
}

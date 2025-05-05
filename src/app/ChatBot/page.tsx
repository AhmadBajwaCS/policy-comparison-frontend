"use client";

import ChatBot from "../components/Chatbot";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ChatBotPage() {
  const searchParams = useSearchParams();
  const [state1, setState1] = useState<string | null>(null);
  const [state2, setState2] = useState<string | null>(null);
  const [policyTypeId, setPolicyTypeId] = useState<string | null>(null);
  const [policyName, setPolicyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s1 = searchParams.get('state1');
    const s2 = searchParams.get('state2');
    const ptId = searchParams.get('policyTypeId');

    if (s1 && s2 && ptId) {
      setState1(s1);
      setState2(s2);
      setPolicyTypeId(ptId);
      // Optional: Fetch policy name if you want to display it
      // ... (fetchPolicyName function as shown before) ...
      setLoading(false);
    } else {
      setError("Missing state or policy information in the URL.");
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (state1 && state2 && policyTypeId) {
    return (
      <div>
        <ChatBot
          state1={state1}
          state2={state2}
          policyTypeId={policyTypeId}
          policyName={policyName || ""}
        />
      </div>
    );
  }

  return <div>Error loading chatbot parameters.</div>;
}
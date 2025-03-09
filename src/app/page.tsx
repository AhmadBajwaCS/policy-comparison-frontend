"use client";

import { useEffect, useState } from "react";

interface ApiResponse {
  message: string;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/hello")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Test</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

"use client";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ padding: 20, backgroundColor: "#fee", color: "#a00" }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: 10 }}>
        Try again
      </button>
    </div>
  );
}

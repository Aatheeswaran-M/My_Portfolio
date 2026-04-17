import React from "react";

function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#f8fafc",
        padding: "24px",
        textAlign: "center",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <section style={{ maxWidth: "640px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "12px" }}>
          Frontend Under Maintenance
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "10px" }}>
          We are currently updating the website to improve your experience.
        </p>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Please check back shortly. Thank you for your patience.
        </p>
      </section>
    </main>
  );
}

export default App;

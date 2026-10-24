"use client";

import React from "react";

export function MetricsCards() {
  const metrics = [
    {
      value: "$0.00",
      label: "Runaway Spend",
      sublabel: "Hard server-side budget stop",
      icon: "🛡️",
      accent: "var(--color-warning-red)",
    },
    {
      value: "100%",
      label: "Owner Controlled",
      sublabel: "Human-in-the-loop PayPal approval",
      icon: "👤",
      accent: "var(--color-crate-blue)",
    },
    {
      value: "< 3s",
      label: "Supplier Sourcing",
      sublabel: "Live wholesale catalog comparison",
      icon: "⚡",
      accent: "var(--color-shelf-yellow)",
    },
    {
      value: "4 × 0%",
      label: "Pay in 4 Installments",
      sublabel: "PayPal Pay Later flexible terms",
      icon: "💳",
      accent: "#10B981",
    },
  ];

  return (
    <div className="metrics-grid" aria-label="Key system performance metrics">
      {metrics.map((m, idx) => (
        <div key={idx} className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">{m.icon}</span>
            <span className="metric-badge" style={{ borderColor: m.accent, color: m.accent }}>
              Verified
            </span>
          </div>
          <div className="metric-value tabular">{m.value}</div>
          <div className="metric-label">{m.label}</div>
          <div className="metric-sublabel">{m.sublabel}</div>
        </div>
      ))}
    </div>
  );
}

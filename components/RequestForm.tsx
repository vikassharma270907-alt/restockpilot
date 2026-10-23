"use client";

import React, { useState } from "react";

interface RequestFormProps {
  onSubmit: (message: string, budget: number, isDemo: boolean) => void;
  loading: boolean;
  initialBudget?: number;
}

export function RequestForm({ onSubmit, loading, initialBudget = 80 }: RequestFormProps) {
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(initialBudget);
  const [demoMode, setDemoMode] = useState(false);

  const handleUseDemo = () => {
    setMessage("We’re running low on 12 oz cold cups, cold-brew bottles, and oat milk for the weekend. Find the best options and keep the order under $80.");
    setBudget(80);
  };

  const handleUseOverbudgetDemo = () => {
    setMessage("We need 4 cases of cold brew bottles, 3 cases of cups, and 2 cases of oat milk");
    setBudget(80);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    onSubmit(message.trim(), Number(budget), demoMode);
  };

  return (
    <form onSubmit={handleSubmit} className="panel" aria-label="Inventory restock request form">
      <div className="form-group">
        <label htmlFor="restock-message" className="form-label">
          <span>What do you need to restock?</span>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={handleUseDemo}
              className="demo-link"
              id="use-demo-request-btn"
            >
              Use demo request
            </button>
            <button
              type="button"
              onClick={handleUseOverbudgetDemo}
              className="demo-link"
              title="Test server-side budget guardrail"
            >
              Test budget block
            </button>
          </div>
        </label>
        <textarea
          id="restock-message"
          className="textarea-input"
          placeholder="We’re low on 12 oz cups and oat milk for the weekend."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="inline-form">
        <div className="form-group">
          <label htmlFor="budget-input" className="form-label">
            Budget limit
          </label>
          <div className="budget-input-wrapper">
            <span className="budget-currency">$</span>
            <input
              id="budget-input"
              type="number"
              min="1"
              max="5000"
              step="1"
              className="budget-field tabular"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !message.trim()}
            id="find-price-button"
          >
            {loading ? "Searching & Pricing..." : "Find and price items"}
          </button>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              cursor: "pointer",
              userSelect: "none",
              color: "var(--color-ink-muted)",
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              style={{ accentColor: "var(--color-crate-blue)", cursor: "pointer" }}
            />
            <span>Demo data mode</span>
          </label>
        </div>
      </div>
    </form>
  );
}

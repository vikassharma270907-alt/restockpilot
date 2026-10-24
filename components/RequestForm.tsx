"use client";

import React, { useState } from "react";

interface RequestFormProps {
  onSubmit: (message: string, budget: number, isDemo: boolean) => void;
  loading: boolean;
  initialBudget?: number;
}

const QUICK_STOCK_ITEMS = [
  { label: "12oz Cold Cups", icon: "☕", sample: "2 cases of 12oz compostable cold cups" },
  { label: "Cold Brew Bottles", icon: "🧊", sample: "1 case of 16oz cold brew glass bottles" },
  { label: "Barista Oat Milk", icon: "🥛", sample: "1 case of barista blend oat milk" },
  { label: "Kraft Napkins", icon: "🧻", sample: "1 case of kraft dispenser napkins" },
  { label: "Espresso Beans", icon: "🫘", sample: "1 bulk 5lb bag of espresso beans" },
];

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

  const handleAddQuickItem = (sample: string) => {
    if (!message.trim()) {
      setMessage(`We are low on ${sample}.`);
    } else {
      setMessage(`${message.trim().replace(/\.$/, "")}, and ${sample}.`);
    }
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
          rows={3}
        />

        {/* Quick stock shortage chips (Page UI pattern) */}
        <div className="quick-chips-wrapper">
          <span className="quick-chips-label">Quick add:</span>
          <div className="quick-chips-list">
            {QUICK_STOCK_ITEMS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-chip-btn"
                onClick={() => handleAddQuickItem(item.sample)}
                title={`Add ${item.label} to order request`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span className="quick-chip-plus">+</span>
              </button>
            ))}
          </div>
        </div>
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

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
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

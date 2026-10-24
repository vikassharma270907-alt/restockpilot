"use client";

import React, { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
  actionText?: string;
  onAction?: () => void;
}

export function JudgeFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "How does RestockPilot enforce strict budget guardrails?",
      a: "The budget limit is enforced on the server within the agent's proposeOrder tool and during fallback simulation. If an agent attempts to formulate an order exceeding the specified budget, the tool rejects the call immediately and returns clear remediation guidance (e.g., 'Total $180.50 is over your $80 budget. Remove an item or raise the budget.') rather than creating an unapproved PayPal order.",
    },
    {
      q: "How does Human-in-the-Loop owner approval work with PayPal?",
      a: "The AI agent is fundamentally prohibited from executing payments unilaterally. It only generates a proposed order docket. The shop owner inspects the line items, unit prices, and budget usage gauge, and explicitly clicks 'Approve in PayPal'. This initiates an official PayPal Orders v2 session where payment capture requires authenticated owner consent.",
    },
    {
      q: "How are PayPal Webhooks and AG Grid ledger synchronized?",
      a: "When a payment is captured in the PayPal sandbox, PayPal transmits a PAYMENT.CAPTURE.COMPLETED webhook event to /api/webhooks/paypal. The route verifies PayPal's cryptographic signature via /v1/notifications/verify-webhook-signature before updating the order status to PAID. The AG Grid UI continuously polls the orders API every 3 seconds while pending orders exist, automatically displaying ledger reconciliations in real-time.",
    },
    {
      q: "Can judges test the complete purchasing flow without private API keys?",
      a: "Yes! RestockPilot includes a high-fidelity Demo Mode designed for 3-minute hackathon judging. Clicking 'Use demo request' runs a realistic wholesale sourcing simulation, executes budget verification, generates the thermal docket, allows simulated sandbox capture, and stamps the docket as 'PAID' with full AG Grid ledger updates.",
    },
    {
      q: "Which hackathon sponsor tools are integrated?",
      a: "1) PayPal Sandbox Orders v2, Pay Later, Webhook Verification, and Agent Toolkit; 2) Channel3 Wholesale Catalog Search SDK; 3) AG Grid Community & React for the custom-themed accounting ledger; 4) Render deployment readiness with disk-persisted data (.data/orders.json).",
    },
  ];

  return (
    <section id="judge-faq" className="faq-section" aria-labelledby="heading-faq">
      <div className="section-header-block">
        <div className="section-pill">
          <span>Judge Walkthrough & Rubric</span>
        </div>
        <h2 id="heading-faq" className="section-headline">
          Frequently Asked Questions & Technical Details
        </h2>
        <p className="section-description">
          Key architecture decisions and evaluation pointers for hackathon judges and code reviewers.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className={`faq-card ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span className="faq-question-text">{item.q}</span>
                <span className="faq-toggle-icon">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

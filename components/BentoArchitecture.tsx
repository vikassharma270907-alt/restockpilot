"use client";

import React from "react";

export function BentoArchitecture() {
  const cards = [
    {
      span: "bento-span-2",
      badge: "AI Reasoning Core",
      title: "MiniMax M3.1 Flash on NVIDIA NIM",
      desc: "Executes autonomous multi-step tool reasoning with strict token efficiency. Dynamically evaluates inventory shortages, searches vendor items, and calls proposeOrder with hard budget validation rules.",
      specs: ["Provider: NVIDIA NIM Hosted API", "Model: minimaxai/minimax-m3.1-flash", "Fallback: OpenAI gpt-4o-mini", "SDK: Vercel AI SDK v4"],
      icon: "🧠",
    },
    {
      span: "bento-span-1",
      badge: "Payment Engine",
      title: "PayPal Orders v2 & Pay Later",
      desc: "Creates official sandbox checkout orders with intent: CAPTURE, itemized breakdowns, idempotency keys, and 4x Pay Later 0% APR installment estimations.",
      specs: ["API: /v2/checkout/orders", "Idempotency: PayPal-Request-Id", "Human-in-the-loop: 1-Click owner signoff"],
      icon: "💳",
    },
    {
      span: "bento-span-1",
      badge: "Supplier Search",
      title: "Channel3 Wholesale Catalog",
      desc: "Multi-retailer product discovery looking up cold cups, syrups, cold brew bottles, and oat milk with live pricing and product links.",
      specs: ["SDK: @channel3/sdk", "Real-time pricing comparison", "Defensive fallback catalog"],
      icon: "🔎",
    },
    {
      span: "bento-span-2",
      badge: "Ledger & Reconciliation",
      title: "Cryptographic Webhooks & AG Grid Ledger",
      desc: "Validates incoming webhook signatures via PayPal's /v1/notifications/verify-webhook-signature on PAYMENT.CAPTURE.COMPLETED, updating the persistent disk-backed ledger without data loss.",
      specs: ["Signature verification: RS256 cert chain", "Table: AG Grid Community & React", "Persistence: .data/orders.json", "Polling: 3s live webhook sync"],
      icon: "📊",
    },
  ];

  return (
    <section id="architecture" className="bento-section" aria-labelledby="heading-bento">
      <div className="section-header-block">
        <div className="section-pill">
          <span>Engineered Architecture</span>
        </div>
        <h2 id="heading-bento" className="section-headline">
          Production-Grade AI & Payment Rails
        </h2>
        <p className="section-description">
          RestockPilot connects autonomous LLM reasoning directly to PayPal sandbox checkout rails with verified server-side safeguards.
        </p>
      </div>

      <div className="bento-grid">
        {cards.map((card, i) => (
          <div key={i} className={`bento-card ${card.span}`}>
            <div className="bento-card-header">
              <span className="bento-badge">{card.badge}</span>
              <span className="bento-icon">{card.icon}</span>
            </div>
            <h3 className="bento-title">{card.title}</h3>
            <p className="bento-desc">{card.desc}</p>
            <div className="bento-specs">
              {card.specs.map((s, idx) => (
                <div key={idx} className="bento-spec-item">
                  <span className="bento-bullet">▹</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

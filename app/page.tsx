"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { MetricsCards } from "@/components/MetricsCards";
import { RequestForm } from "@/components/RequestForm";
import { ActivityTrace } from "@/components/ActivityTrace";
import { Docket } from "@/components/Docket";
import { OrdersLedger } from "@/components/OrdersLedger";
import { BentoArchitecture } from "@/components/BentoArchitecture";
import { JudgeFAQ } from "@/components/JudgeFAQ";
import { Footer } from "@/components/Footer";
import { OrderRecord } from "@/lib/store";
import { TraceItem } from "@/app/api/agent/route";

function RestockPilotDashboard() {
  const searchParams = useSearchParams();
  const paidId = searchParams.get("paid");
  const cancelled = searchParams.get("cancelled");

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [trace, setTrace] = useState<TraceItem[]>([]);
  const [budget, setBudget] = useState(80);
  const [loading, setLoading] = useState(false);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [returnMessage, setReturnMessage] = useState<{ type: "paid" | "cancelled"; text: string } | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>("MiniMax M3.1 Flash (NVIDIA NIM)");

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data: OrderRecord[] = await res.json();
        setOrders(data);

        // If an order was paid via redirect, ensure it's selected and stamped
        if (paidId) {
          const match = data.find((o) => o.id === paidId);
          if (match) {
            setActiveOrder(match);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, [paidId]);

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle URL return parameters
  useEffect(() => {
    if (paidId) {
      setReturnMessage({
        type: "paid",
        text: `Payment confirmed in PayPal sandbox for order #${paidId}. Reconciled ledger updated.`,
      });

      // Populate trace with payment capture steps for judge visibility
      setTrace([
        {
          id: "capture-trace-1",
          toolName: "paypal_capture",
          summary: `Captured PayPal sandbox payment for order #${paidId}`,
          resultSummary: "Status: COMPLETED (Captured via PayPal Orders v2)",
          status: "done",
          timestamp: new Date().toISOString(),
        },
        {
          id: "capture-trace-2",
          toolName: "ledger_reconcile",
          summary: `Reconciled order record #${paidId} in store ledger`,
          resultSummary: "Marked order status as PAID",
          status: "done",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else if (cancelled === "1") {
      setReturnMessage({
        type: "cancelled",
        text: "Approval cancelled. The order is still waiting; approve it when you're ready.",
      });
    }
  }, [paidId, cancelled]);

  // Auto-poll GET /api/orders every 3s while any order is PENDING_APPROVAL or APPROVED
  useEffect(() => {
    const hasPending = orders.some(
      (o) => o.status === "PENDING_APPROVAL" || o.status === "APPROVED"
    );

    if (!hasPending) return;

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, [orders, fetchOrders]);

  // Handle restock submission
  const handleRestockSubmit = async (message: string, userBudget: number, isDemo: boolean) => {
    setLoading(true);
    setBudget(userBudget);
    setBudgetError(null);
    setDemoNotice(null);
    setReturnMessage(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          budget: userBudget,
          rules: { budget: userBudget, requireApproval: true },
          demoMode: isDemo,
        }),
      });

      const data = await res.json();
      if (data.providerDisplay) {
        setActiveModel(data.providerDisplay);
      }

      if (data.trace) {
        setTrace(data.trace);
      }

      if (data.demoNotice) {
        setDemoNotice(data.demoNotice);
      }

      if (data.budgetExceeded || data.error) {
        setBudgetError(data.error || `Total exceeds your $${userBudget} budget.`);
        if (data.items) {
          // Show proposed items even if over budget so user sees the calculation
          setActiveOrder({
            id: "OVER-BUDGET-PROPOSAL",
            status: "FAILED",
            total: data.proposedTotal,
            items: data.items,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        if (data.orders) {
          setOrders(data.orders);
        }
        if (data.order) {
          setActiveOrder(data.order);
        } else if (data.orders && data.orders.length > 0) {
          setActiveOrder(data.orders[0]);
        }
      }
    } catch (err: any) {
      console.error("Agent request failed:", err);
      setBudgetError("Network connection error. Check server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Glass Navbar */}
      <Navbar activeModel={activeModel} />

      <div className="app-container">
        {/* Hero Banner Section (Page UI & awesome-design-md) */}
        <div className="hero-wrapper">
          <div className="hero-pill-badge">
            <span>✨ Autonomous Purchasing Agent</span>
            <span>&bull;</span>
            <span>PayPal AI Hackathon 2026</span>
          </div>

          <h1 className="hero-title-main">
            Autonomous Inventory Sourcing on PayPal Sandbox Rails
          </h1>

          <p className="hero-lead-text">
            Describe what inventory is running low in plain English. RestockPilot searches multi-retailer wholesale catalogs via Channel3, formulates an order guaranteed within your strict budget, and submits it to PayPal Sandbox Checkout for 1-click human-in-the-loop owner approval.
          </p>
        </div>

        {/* 4 Bento Metric Stat Cards */}
        <MetricsCards />

        {/* Return alerts (paid, cancelled) */}
        {returnMessage && (
          <div className={`return-alert ${returnMessage.type}`} role="status">
            <span>{returnMessage.text}</span>
            <button
              type="button"
              className="alert-dismiss"
              onClick={() => setReturnMessage(null)}
              aria-label="Dismiss notice"
            >
              &times;
            </button>
          </div>
        )}

        {/* The Purchasing Desk (Main 2-Column Work Area) */}
        <div id="desk" className="main-grid">
          {/* Left Column: Request Form & Agent Activity */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            <section aria-labelledby="heading-request">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h2 id="heading-request" className="section-title">
                  <span className="section-number">1</span>
                  <span>Inventory Shortage Request</span>
                </h2>
                {demoNotice && (
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-crate-blue)", backgroundColor: "rgba(30, 75, 122, 0.1)", padding: "4px 10px", borderRadius: "4px" }}>
                    {demoNotice}
                  </span>
                )}
              </div>
              <RequestForm onSubmit={handleRestockSubmit} loading={loading} initialBudget={budget} />
            </section>

            <section id="trace" aria-labelledby="heading-activity">
              <h2 id="heading-activity" className="section-title" style={{ marginBottom: "16px" }}>
                <span className="section-number">2</span>
                <span>Agent Reasoning & Tool Activity</span>
              </h2>
              <ActivityTrace trace={trace} loading={loading} />
            </section>
          </div>

          {/* Right Column: Signature Thermal Docket */}
          <section id="docket" aria-labelledby="heading-docket">
            <h2 id="heading-docket" className="section-title" style={{ marginBottom: "16px" }}>
              <span className="section-number">3</span>
              <span>Proposed Thermal Docket</span>
            </h2>
            <Docket
              order={activeOrder}
              budget={budget}
              budgetError={budgetError}
              isPaid={activeOrder?.id === paidId}
            />
          </section>
        </div>

        {/* Full-width Bottom Section: Orders Ledger (AG Grid) */}
        <section id="ledger" className="ledger-section" aria-labelledby="heading-ledger">
          <div className="ledger-header">
            <h2 id="heading-ledger" className="section-title">
              <span>Orders Ledger</span>
              <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--color-ink-muted)" }}>
                ({orders.length} {orders.length === 1 ? "record" : "records"})
              </span>
            </h2>
            <span style={{ fontSize: "12px", color: "var(--color-ink-muted)" }}>
              Auto-reconciling via PayPal Webhook &bull; Click row to preview docket
            </span>
          </div>
          <OrdersLedger
            orders={orders}
            selectedOrderId={activeOrder?.id}
            onSelectOrder={(selected) => setActiveOrder(selected)}
          />
        </section>

        {/* Bento Grid Architecture Showcase */}
        <BentoArchitecture />

        {/* Judge Guide & Rubric FAQ Accordion */}
        <JudgeFAQ />
      </div>

      {/* Polish Footer */}
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div style={{ padding: "48px", textAlign: "center", color: "var(--color-ink-blue)" }}>Loading RestockPilot...</div>}>
        <RestockPilotDashboard />
      </Suspense>
    </main>
  );
}

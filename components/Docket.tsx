"use client";

import React from "react";
import { OrderRecord } from "@/lib/store";
import { PayPalCheckoutButton } from "./PayPalCheckoutButton";

interface DocketProps {
  order: OrderRecord | null;
  budget: number;
  budgetError?: string | null;
  isPaid?: boolean;
}

export function Docket({ order, budget, budgetError, isPaid: forcePaid }: DocketProps) {
  const isPaid = forcePaid || order?.status === "PAID";
  const isPending = order?.status === "PENDING_APPROVAL";
  const isApproved = order?.status === "APPROVED";
  const isFailed = order?.status === "FAILED";

  const total = order ? order.total : 0;
  const budgetRatio = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const isOverBudget = total > budget || Boolean(budgetError);

  if (!order && !budgetError) {
    return (
      <div className="docket-container" aria-label="Order docket preview">
        <div className="docket-wrapper" style={{ minHeight: "340px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "var(--color-ink-muted)" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.6 }}>🧾</div>
          <div style={{ fontWeight: 600, fontSize: "14px" }}>Docket waiting for items</div>
          <div style={{ fontSize: "12px", marginTop: "4px", maxWidth: "240px" }}>
            Describe low inventory on the left to print a proposed restocking order.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="docket-container" aria-label="Thermal receipt docket">
      <div className="docket-wrapper">
        {/* Rubber Stamp for Paid orders */}
        {isPaid && (
          <div className="paid-stamp-badge" role="status" aria-label="Paid stamp">
            PAID
          </div>
        )}

        <header className="docket-header">
          <div className="docket-store-name">RESTOCKPILOT DOCKET</div>
          <div className="docket-meta">
            ORDER #{order?.id || "PROPOSAL"} &bull; {order ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>
          <div className="docket-meta">
            STATUS: {order?.status || (budgetError ? "BUDGET_BLOCKED" : "PROPOSED")}
          </div>
        </header>

        {/* Line Items */}
        <table className="docket-table">
          <thead>
            <tr>
              <th scope="col">ITEM / QTY</th>
              <th scope="col" style={{ textAlign: "right" }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {order?.items.map((item, idx) => {
              const lineTotal = item.unit * item.qty;
              return (
                <tr key={`${item.name}-${idx}`}>
                  <td>
                    <div className="docket-item-name">{item.name}</div>
                    <div className="docket-item-calc">
                      {item.qty} &times; ${item.unit.toFixed(2)}
                    </div>
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "bottom" }} className="tabular">
                    ${lineTotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="docket-totals">
          <div className="docket-total-row">
            <span>ORDER TOTAL</span>
            <span className="tabular">${total.toFixed(2)}</span>
          </div>

          {/* Budget progress bar */}
          <div className="docket-budget-indicator">
            <div className="budget-bar-label">
              <span>Budget Usage</span>
              <span className="tabular">${total.toFixed(2)} of ${budget.toFixed(2)}</span>
            </div>
            <div className="budget-bar-track" role="progressbar" aria-valuenow={Math.round(budgetRatio)} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`budget-bar-fill ${isOverBudget ? "over-budget" : ""}`}
                style={{ width: `${isOverBudget ? 100 : budgetRatio}%` }}
              />
            </div>
          </div>
        </div>

        {/* Budget error state */}
        {budgetError && (
          <div className="alert-warning" role="alert">
            {budgetError}
          </div>
        )}

        {/* Failed state */}
        {isFailed && (
          <div className="alert-warning" role="alert">
            PayPal rejected the order because the authorization was cancelled or failed. Check items and try again.
          </div>
        )}

        {/* Action Button */}
        <div className="docket-actions">
          {isPending && order && !budgetError && (
            <PayPalCheckoutButton order={order} />
          )}

          {isApproved && (
            <div style={{ textAlign: "center", padding: "10px", fontWeight: 700, color: "var(--color-crate-blue)" }}>
              Approved &bull; Reconciling Payment
            </div>
          )}

          {isPaid && (
            <div className="docket-settled-text">
              Settled via PayPal Sandbox
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

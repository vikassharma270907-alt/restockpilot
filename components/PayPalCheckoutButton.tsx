"use client";

import React, { useState } from "react";
import { OrderRecord } from "@/lib/store";

interface PayPalCheckoutButtonProps {
  order: OrderRecord;
  onPaymentSuccess?: (orderId: string) => void;
}

export function PayPalCheckoutButton({ order, onPaymentSuccess }: PayPalCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle in-context capture via /api/orders/capture POST
  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Capture failed");
      }

      if (onPaymentSuccess) {
        onPaymentSuccess(order.id);
      } else {
        // Redirect to URL with ?paid=ID to trigger paid stamp & ledger reconciliation
        window.location.href = `/?paid=${order.id}`;
      }
    } catch (err: any) {
      console.error("PayPal approval error:", err);
      // Fallback: If in-context capture had issues, redirect directly to approveUrl
      if (order.approveUrl) {
        window.location.href = order.approveUrl;
      } else {
        setError(err.message || "Failed to process payment");
      }
    } finally {
      setLoading(false);
    }
  };

  const payLaterInstallment = (order.total / 4).toFixed(2);

  return (
    <div className="paypal-checkout-container" style={{ width: "100%", marginTop: "12px" }}>
      {/* Official PayPal Button */}
      <button
        type="button"
        onClick={handleApprove}
        disabled={loading}
        className="paypal-official-btn btn-approve-paypal"
        id="approve-paypal-button"
        aria-label="Approve in PayPal"
        style={{
          width: "100%",
          height: "46px",
          backgroundColor: "#FFC439",
          borderRadius: "6px",
          border: "none",
          cursor: loading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
          transition: "background-color 0.15s ease, transform 0.05s ease",
          padding: "0 16px",
          fontWeight: 700,
          color: "#003087",
          fontSize: "15px",
        }}
      >
        {loading ? (
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Connecting to PayPal Sandbox...</span>
        ) : (
          <>
            <svg
              width="24"
              height="28"
              viewBox="0 0 100 115"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              <path
                d="M81.5 30.5C79.8 14.8 67.8 7 49.3 7H14C11.5 7 9.4 8.8 9.1 11.3L1.1 82.2C0.9 84.2 2.4 85.9 4.4 85.9H25.3L20.4 113.8C20.2 115.1 21.2 116.2 22.5 116.2H42.7C44.8 116.2 46.6 114.6 46.9 112.5L53.9 69.4L53.6 71.4C53.9 69.3 55.7 67.7 57.8 67.7H63.9C79.2 67.7 89.8 60.1 92.5 45.3C94.2 36.1 91.5 28.3 81.5 30.5Z"
                fill="#003087"
              />
              <path
                d="M81.5 30.5C79.8 14.8 67.8 7 49.3 7H14C11.5 7 9.4 8.8 9.1 11.3L1.1 82.2C0.9 84.2 2.4 85.9 4.4 85.9H25.3L31.6 45.4C31.9 43.3 33.7 41.7 35.8 41.7H50.8C66.1 41.7 76.7 34.1 79.4 19.3C80.2 14.9 79.6 11.2 78 8.4C80.3 14.7 81.6 22.4 81.5 30.5Z"
                fill="#0079C1"
              />
              <path
                d="M35.8 41.7H50.8C66.1 41.7 76.7 34.1 79.4 19.3C80.2 14.9 79.6 11.2 78 8.4C74.6 4.3 68.6 1.8 59.8 1.8H22.5C20.4 1.8 18.6 3.4 18.3 5.5L10.3 76.4C10.1 78.4 11.6 80.1 13.6 80.1H31.6L35.8 41.7Z"
                fill="#00457C"
              />
            </svg>
            <span style={{ fontSize: "16px", letterSpacing: "-0.3px", fontWeight: 700 }}>
              Pay with <span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#0079C1" }}>Pal</span>
            </span>
          </>
        )}
      </button>

      {/* Pay Later Offering (developer.paypal.com/get-started) */}
      <div
        style={{
          marginTop: "8px",
          padding: "6px 10px",
          borderRadius: "4px",
          fontSize: "11px",
          lineHeight: "1.4",
          backgroundColor: "rgba(0, 48, 135, 0.06)",
          color: "var(--color-ink-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono, monospace)",
        }}
      >
        <span>
          <strong>Pay Later:</strong> 4 &times; ${payLaterInstallment} interest-free
        </span>
        <span
          style={{
            fontSize: "9px",
            padding: "2px 5px",
            backgroundColor: "#003087",
            color: "#FFF",
            borderRadius: "3px",
            fontWeight: 700,
          }}
        >
          0% APR
        </span>
      </div>

      {/* Direct Sandbox Redirect Fallback / 1-Click for Hackathon judges */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {order.approveUrl && (
          <a
            href={order.approveUrl}
            target="_self"
            rel="noopener noreferrer"
            style={{
              fontSize: "12px",
              color: "var(--color-crate-blue)",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Launch official PayPal Sandbox redirect &rarr;
          </a>
        )}
      </div>

      {error && (
        <div style={{ marginTop: "6px", color: "var(--color-warning-red)", fontSize: "11px", textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* Developer notice */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "10px",
          color: "var(--color-ink-muted)",
          textAlign: "center",
          borderTop: "1px dashed var(--color-ink-faint)",
          paddingTop: "6px",
        }}
      >
        PayPal Orders v2 &bull; Sandbox Mode &bull;{" "}
        <a
          href="https://developer.paypal.com/get-started"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          developer.paypal.com
        </a>
      </div>
    </div>
  );
}

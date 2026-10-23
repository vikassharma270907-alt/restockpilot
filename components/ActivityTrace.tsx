"use client";

import React from "react";
import { TraceItem } from "@/app/api/agent/route";

interface ActivityTraceProps {
  trace: TraceItem[];
  loading?: boolean;
}

export function ActivityTrace({ trace, loading }: ActivityTraceProps) {
  if (trace.length === 0 && !loading) {
    return (
      <div className="activity-card" style={{ color: "var(--color-ink-muted)", fontSize: "14px", fontStyle: "italic" }}>
        No agent actions recorded yet. Submit a restocking query to observe autonomous search, pricing, and budget verification steps.
      </div>
    );
  }

  return (
    <div className="activity-card">
      <ul className="activity-list" aria-label="Agent execution trace steps">
        {trace.map((step) => (
          <li key={step.id} className="activity-item">
            <span
              className={`activity-status-dot ${step.status}`}
              title={step.status === "done" ? "Completed step" : "Step error"}
              aria-label={step.status}
            />
            <div className="activity-content">
              <div className="activity-summary">{step.summary}</div>
              <div className="activity-result">{step.resultSummary}</div>
            </div>
          </li>
        ))}

        {loading && (
          <li className="activity-item">
            <span className="activity-status-dot running" aria-label="Executing" />
            <div className="activity-content">
              <div className="activity-summary">Searching supplier channels and evaluating prices...</div>
              <div className="activity-result">Comparing wholesale offers against your budget limit</div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

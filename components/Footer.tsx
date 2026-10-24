"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span style={{ fontSize: "20px" }}>📦</span>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "var(--color-ink-blue)" }}>RestockPilot</span>
          </div>
          <p className="footer-tagline">
            Autonomous AI purchasing agent for independent cafes and shops. Built for the PayPal AI Hackathon 2026.
          </p>
          <div className="footer-license">
            MIT License &copy; 2026 RestockPilot Team
          </div>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <div className="footer-col-title">Product</div>
            <a href="#desk" className="footer-link">Purchasing Desk</a>
            <a href="#ledger" className="footer-link">Orders Ledger</a>
            <a href="#architecture" className="footer-link">Bento Architecture</a>
            <a href="#judge-faq" className="footer-link">Judge Guide & FAQ</a>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Technology</div>
            <a href="https://developer.paypal.com/get-started" target="_blank" rel="noopener noreferrer" className="footer-link">
              PayPal Orders v2
            </a>
            <a href="https://integrate.api.nvidia.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              MiniMax on NVIDIA NIM
            </a>
            <a href="https://channel3.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              Channel3 Wholesale SDK
            </a>
            <a href="https://www.ag-grid.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              AG Grid Community
            </a>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Submission</div>
            <a href="https://paypalaihackathon.devpost.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              PayPal Hackathon (Devpost)
            </a>
            <a href="https://github.com/vikassharma270907-alt/restockpilot" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub Repository
            </a>
            <a href="https://restockpilot.vercel.app" target="_blank" rel="noopener noreferrer" className="footer-link">
              Live Web App
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>Sandbox mode active: All financial interactions simulated or routed through PayPal Developer Sandbox.</span>
        <span>PayPal AI Hackathon 2026</span>
      </div>
    </footer>
  );
}

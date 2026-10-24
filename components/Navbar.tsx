"use client";

import React, { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  activeModel?: string;
}

export function Navbar({ activeModel = "MiniMax M3.1 Flash" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky-navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand & Sandbox Status */}
        <div className="navbar-brand-group">
          <a href="#" className="navbar-logo" aria-label="RestockPilot home">
            <span className="logo-icon">📦</span>
            <span className="logo-text">RestockPilot</span>
          </a>

          <div className="sandbox-live-pill" title="Connected to PayPal Developer Sandbox">
            <span className="pulse-dot" />
            <span className="sandbox-live-text">PayPal Sandbox Live</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar-links" aria-label="Page sections">
          <a href="#desk" className="nav-link">Purchasing Desk</a>
          <a href="#ledger" className="nav-link">Orders Ledger</a>
          <a href="#architecture" className="nav-link">Bento Architecture</a>
          <a href="#judge-faq" className="nav-link">Judge Guide & FAQ</a>
        </nav>

        {/* Actions Group */}
        <div className="navbar-actions">
          <div className="model-chip" title="Active Reasoning LLM">
            <span className="model-chip-indicator">AI</span>
            <span className="model-chip-name">{activeModel.replace("via NVIDIA NIM", "").trim()}</span>
          </div>

          <ThemeToggle />

          <a
            href="https://github.com/vikassharma270907-alt/restockpilot"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
            aria-label="View on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="github-btn-text">Repo</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="menu">
          <a href="#desk" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Purchasing Desk</a>
          <a href="#ledger" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Orders Ledger</a>
          <a href="#architecture" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Bento Architecture</a>
          <a href="#judge-faq" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Judge Guide & FAQ</a>
        </div>
      )}
    </header>
  );
}

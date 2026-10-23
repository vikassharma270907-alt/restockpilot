"use client";

import React, { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Default to dark for stunning visual impact, or load saved preference
    const saved = localStorage.getItem("restockpilot-theme") as "light" | "dark" | null;
    const initialTheme = saved || "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("restockpilot-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  if (!mounted) {
    return (
      <div style={{ width: "96px", height: "34px" }} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      id="theme-toggle"
    >
      <span className="theme-toggle-icon">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
      <span className="theme-toggle-text">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

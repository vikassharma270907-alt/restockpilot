# Hackathon Resources page -> how each resource is used in RestockPilot

| Resource (from the Resources tab) | Use |
|---|---|
| Getting Started with PayPal sandbox (github.com/paypaldev/getting-started-with-paypal-sandbox) | Day-1 setup: sandbox business + personal accounts, app credentials |
| PayPal REST API + Checkout | Orders v2 create/capture already in lib/paypal.ts |
| Webhooks | /api/webhooks/paypal with signature verification |
| JavaScript SDK v6 | UI step: replace the redirect link with an in-page PayPal button for the approval screen |
| PayPal AI Toolkit / Agent Toolkit quickstart | Wired into app/api/agent/route.ts (orders.get, invoices create/list) |
| MCP server quickstart + Agent tools reference | Optional: expose RestockPilot's tools to external agents; use the reference to pick more toolkit actions |
| Invoicing | Net-terms supplier invoices through the toolkit |
| Payouts | Optional stretch: pay a supplier or crew member (test sandbox access first) |
| Postman PayPal collection (sponsor page) | Test Orders and webhook calls before coding them |
| Oct 12 webinar "Build a payments dashboard without building a dashboard" | Watch before building the AG Grid ledger UI |
| Oct 7 webinar on APIMatic Context Plugins | Quick way to make your coding agent PayPal-aware |
| PayPal Discord (discord.gg/sJ2G6DyvSK) | Ask sandbox and sponsor questions |
| Inspiration: "AI Agents or Automation ... an agent that shops and checks out for you" | RestockPilot fits this category directly (also the Agentic Commerce prize) |

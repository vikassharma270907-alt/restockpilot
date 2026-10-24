# RestockPilot Design System

## 1. Product, audience, and single job
RestockPilot helps a small shop or café owner turn a stock shortage into a proposed, budget-checked purchase that can be approved in PayPal Sandbox. The audience is busy and non-technical. The primary job is: describe low-stock items → inspect pricing and total → approve → confirm payment.

This document is the RestockPilot-specific design authority. The VoltAgent/awesome-design-md repository is a source of reference patterns; design-md/airtable/DESIGN.md is useful for information hierarchy, structured workflow content, form clarity, and responsive data presentation. Do not import Airtable’s palette, signature surfaces, typography, or marketing layout. The project must retain the distinct RestockPilot tokens and receipt motif below.

## 2. Visual atmosphere
A calm, precise stockroom purchasing desk: industrial signage and shelf labels meet legible paperwork. Use a cool pallet-wrap backdrop, paper-colored work surfaces, strong ink-blue text, and crate-blue actions. Make quantities, prices, and order state easy to scan. The design is practical rather than decorative.

Signature element: one thermal-receipt docket with item rows, aligned prices, total, torn zigzag edge, and a “Paid” stamp shown only after verified payment. The docket is the only decorative object. Do not add background gradients, blobs, fake product photography, confetti, floating shapes, or identical-card grids.

## 3. Color tokens
| Token | Hex | Role |
| :--- | :--- | :--- |
| `--rp-page` | `#E6ECEF` | Pallet-wrap page background |
| `--rp-paper` | `#FCFCFA` | Docket paper and primary working surfaces |
| `--rp-ink` | `#12263A` | Main text, headings, key numbers |
| `--rp-action` | `#1E4B7A` | Primary actions, links, active affordances |
| `--rp-shelf-yellow` | `#F4C20D` | Budget-meter fill and selected-row marker only |
| `--rp-warning` | `#B3261E` | Errors and budget-blocked states only |

Dark Theme Equivalents (Vercel Geist Obsidian System - Preserving WCAG AA contrast):
- `--rp-page`: `#000000` (Pitch-black Geist canvas)
- `--rp-paper`: `#0A0A0A` (Elevated dark card & thermal docket ground)
- `--rp-ink`: `#EDEDED` (High-contrast crisp white typography)
- `--rp-action`: `#0070F3` (Vercel electric blue accent; `#FFFFFF` inverted primary button)
- `--rp-shelf-yellow`: `#F5A623` (Geist amber budget meter & highlights)
- `--rp-warning`: `#EE0000` (Vercel stop red alert)
- `--color-stamp`: `#00DF8F` (Vercel emerald / cyan paid stamp)

Use CSS custom properties everywhere. Do not invent new brand accents unless needed for a meaningful semantic state or required by accessibility. Never use yellow as a light-text surface. Use dark ink over yellow. Validate text, control boundaries, and focus indication against WCAG AA contrast requirements.

## 4. Typography
| Role | Family | Rules |
| :--- | :--- | :--- |
| Display / section titles | `Archivo` | Clear, sturdy, confident; bold is reserved for product identity and hierarchy |
| Body / controls | `Atkinson Hyperlegible` | Comfortable line-height, readable labels, tabular numerals for money and quantities |
| Docket rows and totals only | `IBM Plex Mono` | Receipt-like printed data; do not use monospace for all small labels |

Prefer `next/font/google` supported by the project. Keep line lengths roughly under 80 characters. Use sentence case; avoid decorative eyebrows and all-caps interface labels. “PAID” is allowed as a physical-stamp exception.

## 5. Shape, spacing, and depth
- Base spacing step: 4px. Use multiples consistently.
- Maximum content width: approximately 1280px, centered with comfortable side gutters.
- Docket: mostly square corners and crisp printed rows with CSS polygon zigzag torn bottom edge.
- Inputs: small restrained radius, approximately 4px.
- Status chips: fully rounded where helpful, with readable status text.
- Use thin rules, spacing, alignment, and typography for grouping.
- Shadows should be sparse and functional, not a default on every surface.
- Avoid uniform rounded-card layouts and decorative elevation stacks.

## 6. Layout and wireframe exploration

### Option A — recommended: request desk + docket (Selected)
```
┌──────────────────────────────────────────────────────────────────┐
│ Sandbox mode: no real money moves.     RestockPilot    Budget $80 │
├────────────────────────────────────────┬─────────────────────────┤
│ What do you need to restock?           │ Docket                  │
│ [ Request textarea                 ]   │ 12 oz cups × 2    $34.00│
│ [ Find and price items ] [Demo]        │ Cold brew × 1      29.50│
│                                        │ Total              63.50│
│ What the agent did                     │ Budget meter            │
│ ✓ Searched products                    │ [ Approve in PayPal ]   │
│ ✓ Compared prices                      │ (torn receipt + stamp)  │
├────────────────────────────────────────┴─────────────────────────┤
│ Orders ledger: status · items · total · created · PayPal order ID │
└──────────────────────────────────────────────────────────────────┘
```
This gives the request and activity the space they need while keeping the proposed order and approval affordance visible. On tablet/mobile, collapse to one column: header → request → activity → docket → orders ledger.

### Option B — docket-first (Rejected)
```
┌────────────────────────────┐
│ Header and budget          │
├────────────────────────────┤
│ Docket and approval        │
├────────────────────────────┤
│ Request form               │
│ Agent activity             │
├────────────────────────────┤
│ Orders ledger              │
└────────────────────────────┘
```
Useful only if approval of an existing order is the dominant repeated task. It places the receipt before the request, which weakens the first-use story; not chosen for the default screen.

### Option C — three equal columns (Rejected)
```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├──────────────────┬──────────────────┬───────────────────────┤
│ Request          │ Agent activity   │ Docket                │
├──────────────────┴──────────────────┴───────────────────────┤
│ Orders ledger                                               │
└─────────────────────────────────────────────────────────────┘
```
This fits a very wide operations display but makes the form cramped and treats the activity log as equal in priority to the order decision. Not chosen.

## 7. Components and interaction states
- **Header**: Compact product header and persistent sandbox notice: “Sandbox mode: no real money moves.” Budget is editable, clearly labeled, and consistently formatted. No marketing navigation, fake account avatar, or dead links.
- **Request form**: Clearly labeled multiline input, editable budget, primary button “Find and price items”, and quiet secondary action “Use demo request.” Disables duplicate submits; shows inline loading state; preserves user input on error.
- **Agent activity**: Render verified trace steps in order, translated to plain language (“Searched 3 products”, “Checked the $80 budget”). Distinguish active, complete, and failed steps by both words and icon/shape—not by color alone. Never fabricate steps.
- **Docket**: Item name, quantity, unit price, line total, total, budget comparison, status, and approval action. Aligned numeric columns. Displays approval only when the backend returns a valid approval URL or the configured official checkout mechanism is available. A budget-blocked order cannot be approved. CSS zigzag bottom edge. Paid stamp appears only after verified payment.
- **Orders ledger**: AG Grid Community with columns for status chip, restock items summary, total (right-aligned tabular), created timestamp, and PayPal order ID. Contained horizontal scroll region at narrow widths. Empty ledger copy: “No orders yet. Describe what you need to restock and the agent will price it.”
- **PayPal Return**: Handles `/?paid=ID` (stamps docket, selects order, reconciles ledger) and `/?cancelled=1` (copy: “Approval cancelled. The order is still waiting; approve it when you’re ready.”).

## 8. Motion system
- **First proposed order**: Short one-time receipt print/reveal (no cascading page-wide entrances).
- **Confirmed trace updates**: Small in-place status/progress change (no infinite pulse or bounce).
- **Request submit**: Press/disabled feedback + contained loading indicator.
- **Budget change**: Meter fill moves smoothly to new value with numeric totals visible.
- **Verified payment**: “PAID” stamp scales in and rotates slightly (350–450ms), triggered once per verified order.
- **Ledger status change**: Brief subtle row highlight.
- **Prefers-reduced-motion**: Respected across all keyframes and transitions; instantaneous display when enabled.

## 9. PayPal Developer Integration (developer.paypal.com/get-started)
- PayPal Orders v2 REST API (`createOrder`, `captureOrder`, `getOrder`, `authorizeOrder`).
- Official styled PayPal button with Pay Later terms (0% APR, 4 installments).
- Cryptographic webhook verification via `/v1/notifications/verify-webhook-signature`.
- Durable disk persistence (`.data/orders.json`) for containerized cloud deployment (Render).

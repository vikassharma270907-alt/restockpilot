# RestockPilot UI build prompt

Paste this whole file into Claude Code (or Cursor) at the root of the `restockpilot` project. If the `frontend-design` skill is installed, read it first. The principles below merge two copies of that skill (the Anthropic claude-code plugin version and the claude.ai version).

---

## 1. Role and goal

You are the design lead and front-end engineer for RestockPilot, an entry in the PayPal AI Hackathon (Devpost, deadline Nov 12, 2026, noon Pacific). Build the complete owner-facing interface on top of the existing Next.js starter. Your work is scored on Design (a complete, coherent product, not a proof of concept), Presentation (a judge must see it work end to end in under 3 minutes), Technological Implementation, Impact and Innovation. The result must look like it came from a studio with a point of view, not from a template.

## 2. Existing code (do not rewrite, extend)

- `app/api/agent/route.ts`: POST `{ message, budget }`. Runs the agent (Vercel AI SDK, `ai@4`) with Channel3 `searchProducts`, a budget-guarded `proposeOrder`, and PayPal Agent Toolkit tools in sandbox mode. Returns `{ reply, orders }`.
- `app/api/orders/capture/route.ts`: PayPal returns the buyer here (`?token=ORDER_ID`), captures the payment, redirects to `/?paid=ID`.
- `app/api/webhooks/paypal/route.ts`: verifies the signature, marks the order `PAID`.
- `lib/paypal.ts`, `lib/channel3.ts`, `lib/store.ts`: PayPal Orders v2 client, Channel3 search, in-memory ledger. Order statuses: `PENDING_APPROVAL`, `APPROVED`, `PAID`, `FAILED`.
- `app/page.tsx` is a placeholder. There is no UI yet.

Keep PayPal in sandbox only. Never commit secrets. Do not change the meaning of the payment code.

## 3. Backend additions the UI needs

1. `GET /api/orders` returns all orders, newest first.
2. Extend the agent response with `trace`: an ordered list of tool calls (tool name, short input summary, short result summary, status) taken from `result.steps`. The UI shows this as proof the agent really searches and calls PayPal.
3. Accept an optional `rules` object from the UI (`budget`, `requireApproval: true`) and keep the budget check server-side.
4. The in-memory store is lost between serverless invocations on Vercel. Plan for deployment on a single Render web service (Render is a hackathon sponsor), or move the ledger to SQLite. State this choice in the README.

## 4. Subject and audience (ground the design here)

- Subject: an AI purchasing agent for a small shop or cafe. The owner says what is running low, the agent finds and prices products, builds one order inside a budget, and the owner approves it in PayPal.
- Audience: a busy shop owner, not a developer. They think in stock, cases, delivery dockets, and receipts.
- The page's single job: get from "we are low on cups" to a paid order with one clear approval step.
- The subject's own world is the source of every distinctive choice: the stockroom, shelf-edge labels, pallet wrap, crates, delivery dockets, thermal-printed receipts, tally marks. Use real content throughout (cups, cold brew bottles, oat milk, napkins), never lorem ipsum.

## 5. Design direction (this is the brief, follow it)

Generic AI design clusters around: cream background with a serif and terracotta accent; near-black with one acid-green or vermilion accent; broadsheet layouts with hairlines and zero radius; the SaaS-card kit (identical rounded cards, same soft grey shadow, gradient washes); template chrome (tracked-out all-caps eyebrow above every heading, meta strings joined with middle dots, "WORD — fragment" labels, tinted near-black as black, mono face for every small label, "→" on every link). Avoid all of these. Spend freedom on choices for this brief.

**Signature element (the one memorable thing): the docket.** The proposed order is shown as a narrow thermal-receipt-style sheet with a torn zigzag bottom edge (CSS mask), printed rows, and a running total. When the PayPal webhook confirms payment, a "Paid" stamp presses onto the docket (one scale and slight rotation, about 400 ms). This is the only decorative object on the page and the only orchestrated motion. Everything else stays quiet and disciplined.

**Palette (6 named values; adjust within the family only with a stated reason):**
- Pallet wrap `#E6ECEF`: page ground, cool grey
- Docket paper `#FCFCFA`: docket and grid surface
- Ink blue `#12263A`: all text
- Crate blue `#1E4B7A`: primary actions, links, stamp ink
- Shelf-label yellow `#F4C20D`: budget bar fill and the selected-row marker only
- Warning red `#B3261E`: errors and budget-blocked states only

Check every text and control pair for WCAG AA contrast and fix failures.

**Type (three roles):**
- Display: Archivo, variable width axis around 112, weight 700, for the product name and section titles. It reads like freight signage.
- Body and interface: Atkinson Hyperlegible, with tabular numerals for money and quantities. Line length under 80 characters; slightly looser line-height than usual.
- Docket only: IBM Plex Mono, because a docket really is printed in monospace. Use mono nowhere else.
- Load with `next/font/google`. Sentence case everywhere. No all-caps labels, no eyebrows above headings, no single accented word in a headline.

**Shape and structure:** Vary radius with purpose (docket sharp, inputs 4px, status chips fully rounded). No identical-card grid. Use spacing, alignment, and one thin rule to group content. Structural devices must encode something true: only use numbered markers if the content is truly a sequence (the three stages request, approval, paid are a real sequence, so a stage indicator there is justified).

**Layout concept (desktop; stack to one column on mobile, 360 px minimum):**

```
 Sandbox mode: no real money moves
 RestockPilot                                  Budget  [ $80 ]

 What do you need to restock?          |   Docket
 [ textarea ........................ ]  |   12oz cups x 2 .......... 34.00
 [ Find and price items ]              |   Cold brew btl x 1 ....... 29.50
                                       |   -------------------------------
 What the agent did                    |   Total 63.50   of 80.00 budget
  searched products ... done           |   [=================-----]
  proposed order ...... done           |   [ Approve in PayPal ]
  checked budget ...... done           |   (zigzag torn edge, Paid stamp)

 Orders  (AG Grid: status, items, total, created, PayPal order id)
```

Left-align all text. The docket sits to the right on desktop and above the ledger on mobile.

**Motion:** One page-load moment at most (the docket "printing" in once when the first order appears). Responses to user actions are welcome (button pressed, status change, stamp). No fade-and-slide on every section, no hover transitions on everything. Respect `prefers-reduced-motion` (show the stamp instantly).

## 6. Screens and behavior

1. **Request:** textarea, budget field, button "Find and price items". A "Use demo request" link fills the scripted demo text so the 3-minute video is repeatable.
2. **Agent activity:** live list from `trace`, plain-language steps ("Searched 3 products", "Proposed an order for $63.50", "Checked the $80 budget").
3. **Docket:** items, quantities, unit prices, total, budget bar. Primary action "Approve in PayPal" opens `approveUrl` (default: a link/button; upgrade to the PayPal JavaScript SDK v6 button if time allows, using the official button only and never a hand-drawn PayPal logo). Docket states: waiting for approval, approved, paid (stamp), failed (reason and next step).
4. **Orders ledger:** AG Grid (`ag-grid-community`, `ag-grid-react`) themed through its theming API to the palette above. Columns: status (custom cell with chip), items, total (right aligned, tabular), created, PayPal order id. Sortable and filterable. Poll `GET /api/orders` every 3 seconds while any order is `PENDING_APPROVAL` or `APPROVED`, so webhook updates appear without a refresh.
5. **Return states:** handle `/?paid=ID` (select that order, play the stamp once) and `/?cancelled=1` (message: "Approval cancelled. The order is still waiting; approve it when you're ready.").
6. **Budget rule:** the budget field is the rule. If the agent returns a budget error, show it on the docket area in warning red with the fix.
7. **Fallback fixtures (optional):** if Channel3 or the model is unreachable, an explicitly labeled "Demo data" mode may show saved results. Label it clearly; the real path stays the default. The submission must function as shown in the video.
8. **Stretch (only after everything above works):** shelf-photo upload that lists low-stock items via a vision model.

## 7. Writing (design material, not decoration)

- Name things by what the owner controls: "budget", "order", "approve", not "tool call" or "webhook".
- Active voice; each action keeps one name through the flow: "Approve in PayPal" becomes "Approved", then the docket says "Paid".
- Errors state what happened and how to fix it, never apologize, never vague: "PayPal rejected the order because the item total didn't match. Check unit prices and try again."
- Budget block: "Total $92.40 is over your $80 budget. Remove an item or raise the budget."
- Empty ledger: "No orders yet. Describe what you need to restock and the agent will price it."
- Sandbox notice stays visible: "Sandbox mode: no real money moves."
- Plain verbs, sentence case, no filler, no marketing voice.

## 8. Process (follow in this order)

1. Write a short design plan in `DESIGN.md`: confirm the subject, audience and single job; the token system (colors, type roles, spacing, radii); two or three ASCII wireframe options and which you chose; the signature element.
2. Review the plan against the brief and the generic-design list in section 5. If any part reads like what you would produce for any similar page, revise it and note what changed and why.
3. Build to the revised plan. Derive every color and type decision from the tokens (CSS variables). Watch selector specificity so section padding and component classes don't cancel each other.
4. Critique as you build. If your environment can take screenshots, review desktop and 360 px mobile and fix what is off. Then remove one decorative accessory.
5. Update the README with a screenshot and keep the judge instructions accurate.

## 9. Quality floor (do not announce it, just meet it)

- Responsive from 360 px to wide desktop; no horizontal page scroll.
- Visible keyboard focus on every control; labels on all inputs; the grid usable by keyboard.
- AA contrast; status never conveyed by color alone (chips carry text).
- Reduced-motion respected.
- Loading, empty, error, and success states for every async action.

## 10. Hackathon constraints that affect the UI

- English only. No third-party logos or trademarks beyond the PayPal-provided checkout button. No copyrighted images or music. Fonts are open-licensed (OFL).
- Judges must be able to run the project: keep `.env.example` current, README run steps accurate, and a "Use demo request" path working.
- The 3-minute video should be recordable in one pass: request, activity trace, docket, approve in PayPal sandbox, Paid stamp, ledger update.

## 11. Resources to use

- PayPal JavaScript SDK v6, REST API, Webhooks: developer.paypal.com
- PayPal Agent Toolkit quickstart, MCP quickstart, agent tools reference: docs.paypal.ai
- PayPal + AG Grid starter: github.com/paypaldev/hackathon-paypal-ag-grid-boilerplate
- AG Grid theming API docs, and the Oct 12 webinar "Build a payments dashboard without building a dashboard"
- Channel3 Agentic Storefront (github.com/channel3-ai/basket) for product-result display patterns
- Hackathon Resources page inspiration: "an AI agent that shops and checks out for you"

## 12. Done when

- [ ] A new visitor can go from request to paid order without instructions.
- [ ] The docket, stamp, trace, and AG Grid ledger all work against the real sandbox flow.
- [ ] No generic-design tells from section 5 remain; the docket is the single memorable element.
- [ ] Mobile 360 px, keyboard use, contrast, and reduced motion all pass.
- [ ] `DESIGN.md` records the plan and the changes made in review.
- [ ] README, `.env.example`, LICENSE, and submission checklist are current.

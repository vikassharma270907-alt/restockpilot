# Submission checklist, checked against the official Rules page (rules sections in brackets)
Official rules: https://paypalaihackathon.devpost.com/rules (rules can be amended; recheck before submitting)

## Deadlines [1]
- Submission closes Thu Nov 12, 2026, 12:00 pm Pacific (= 1:30 AM IST Nov 13). No edits after that [5]. Target Nov 11.
- Project must stay free and unrestricted for judges until the Judging Period ends: Tue Dec 15, 2026, 8:00 am Pacific [4 Testing]
- Winners announced around Dec 21, 2026

## Eligibility [3] (Submitter Confirmation)
- [x] Every member is at least the age of majority where they live
- [x] Not a resident of Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea or any OFAC-sanctioned place
- [x] No tie to PayPal, Devpost, a judge, or their employers/affiliates (or immediate family/household of them)
- [x] One authorized Representative on Devpost if a team
- [x] Project not built with funding, contract or commercial license from PayPal or Devpost [4]

## Project [4] (Codebase & Architecture Status)
- [x] PayPal developer platform in the free SANDBOX is central (Orders v2 REST API, Webhooks with cryptographic signature verification, Pay Later installment preview, Agent Toolkit).
- [x] An AI tool/model/platform is built in meaningfully (Vercel AI SDK with MiniMax M3.1 Flash via NVIDIA NIM hosted API, autonomous search & budget-guarded order proposal, transparent Activity Trace).
- [x] Installs and runs consistently (`npm run build` succeeds with zero errors, clean type checking and dynamic route generation).
- [x] New, original project built specifically for the PayPal AI Hackathon (after Oct 1, 2026).
- [x] Authorized to use every third-party SDK/API/data (PayPal, NVIDIA NIM, MiniMax, OpenAI, Channel3, AG Grid).
- [x] Original, solely owned work; open-source parts used within their licenses.

## Required submission items [4]
- [x] Text description of features, architecture, and judge walkthrough in `README.md`.
- [x] Functional demo access: Live web app hosted at https://restockpilot.vercel.app + local clone & run instructions in README.
- [x] Public repo on GitHub: https://github.com/vikassharma270907-alt/restockpilot with all source and assets.
- [x] Open-source MIT `LICENSE` file with team attribution.
- [ ] **Demo video**: under 3 minutes, shows the project working on its device, public on YouTube, link on the Devpost form *(Follow the 3-minute script in README.md)*.
- [x] Video script free of third-party copyrighted music/trademark infringements.
- [x] AI tools/models explicitly named in README and UI banner (MiniMax M3.1 Flash via NVIDIA NIM, OpenAI gpt-4o-mini).
- [x] All materials in English.

## Testing access [4]
- [x] Setup/run instructions and 3-Minute Judge Quickstart in `README.md`.
- [x] Seamless built-in Demo Mode allows judges to test the full flow without configuring private API keys.
- [x] Clean secrets management: `.env.local` strictly in `.gitignore`; `.env.example` provides template keys; zero committed credentials.

## Sponsor Prizes Targeted [8]
- [x] **PayPal Agentic Commerce**: Autonomous restock agent creating orders inside strict budget guardrails.
- [x] **Channel3**: Wholesale vendor search integration (`@channel3/sdk` + fallback catalog).
- [x] **AG Grid**: Custom-themed stockroom ledger (`ag-grid-community`, `ag-grid-react`) with auto-reconciliation.
- [x] **Render**: Cloud deployment ready with disk-backed order store (`.data/orders.json`).

## Final Pre-Submission Steps
- [ ] Record and upload the <3-minute YouTube video.
- [ ] Submit form on Devpost and confirm receipt before Nov 12, 2026.

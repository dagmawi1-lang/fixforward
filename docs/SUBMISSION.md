# Devpost submission draft

## Title
FixForward — Small fixes. Stronger communities.

## Tagline
A community-powered board for turning public-space observations into prioritized, trackable action.

## Short description
FixForward helps communities record public-space maintenance observations, organize them by category and urgency, support issues that matter, and track progress from one clear board.

## Problem
A loose sidewalk section, damaged park fixture, overflowing recycling bin, or broken pathway light may be noticed by many people but still be difficult to communicate and follow up on. Reports can be scattered, vague, or missing useful context. Accessibility-related concerns especially benefit from being easy to identify and prioritize.

## What we built
FixForward is a responsive web prototype where a neighbor can add an observation using a title, category, general public area, description, and severity. The community board supports search, status and category filters, sorting, support votes, a status workflow with a dated history, a resolution progress bar, and CSV/JSON exports. Before a report is added, FixForward checks for similar open reports and offers to support the existing one instead, which keeps the queue free of duplicates. Every report's priority score can be expanded into a plain-language breakdown, and the board can be exported as a priority-ordered action brief for a facilities or parks team. Its priority heuristic is visible and intentionally modest: it helps organize review but does not claim to determine actual risk.

## Built during STEMergent Hacks (Oct 30 – Nov 15, 2026)
- Duplicate detection with a "support this instead" flow (v1.2.0)
- Explainable priority breakdown (v1.2.0)
- Status history timeline (v1.2.0)
- Category filter with open counts and a resolution progress bar (v1.2.0)
- Priority-ordered plain-text action brief export (v1.2.0)
- Keyboard and screen-reader improvements: Escape closes the dialog, autofocus, labeled controls, visible focus rings (v1.2.0)
- CSV export with formula-injection protection (v1.1.2) and a one-support-per-browser guard (v1.1.0)

## How it works
1. Add a public-space observation without personal information.
2. Review it on the community board.
3. Use category, severity, and support signals to organize the queue.
4. If a similar report already exists, support it instead of creating a duplicate.
5. Track status changes over time and export an action brief, CSV, or JSON for follow-up.

## Technologies
React, Vite, JavaScript, CSS, Lucide React, browser localStorage, Node.js built-in test runner.

## AI disclosure
AI assistance was used for planning, code drafting, and documentation. The participant reviewed and tested the implementation. No AI API is called by the application at runtime.

## Demo narration
See `DEMO_SCRIPT.md` for the 2-minute v1.2.0 script. Short version:
- Introduce the gap between noticing a shared-space issue and tracking its follow-up.
- Add a sample observation about an uneven public path.
- Show the category, severity, and general location fields.
- Return to the board and demonstrate search and priority sorting.
- Open details, change a demo status, and show the JSON export.
- Close by explaining the privacy guardrails and future integration possibilities.

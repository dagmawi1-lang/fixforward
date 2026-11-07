# Build status — STEMergent FixForward 1.2.0

## Completed
- Public-space issue reporting, search, status filters, priority sorting, support votes, JSON export, and formula-safe CSV export.
- Defensive report normalization and one-support-per-report-per-browser guard.
- Fixed missing `normalizeReports` and `hasVoted` imports in the React application.
- CSV and JSON export; CSV text cells are quoted and formula prefixes are neutralized.
- Static import/export and Lucide icon checks pass.
- 1.2.0: duplicate detection, explainable priority, status history, category filter, progress bar, action brief, accessibility fixes.
- Automated tests: **14/14 passing** (Nov 7, 2026).
- Headless Chrome QA (Nov 7, 2026, esbuild bundle of the same sources): duplicate warning → support instead, new report, status change → history, category filter, Escape-to-close, autofocus, reload persistence, and 390px mobile layout all pass with no JavaScript errors.

## Not yet verified
- `npm run build` with real Vite and lucide icons was not run, because package downloads were blocked. Run `npm install && npm run check && npm run build` once on your computer.
- Manual screen-reader pass (VoiceOver/NVDA) and a real-phone check.
- Vote protection is browser-local, not a server-enforced identity system; users can clear local storage or use another browser. Do not present it as tamper-proof voting.
- The app is not connected to a real public agency. Seeded reports are fictional demo data.

## Reproduce
```bash
npm install
npm run check
npm run build
```

Use Node.js 20.19+ or 22+. Do not copy `node_modules` between operating systems.

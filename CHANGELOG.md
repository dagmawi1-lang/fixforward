# Changelog

## 1.1.0
- Added a one-vote-per-report-per-browser guard using a local vote ledger.
- Added accessible pressed/disabled state and clear feedback for repeat support attempts.
- Added defensive normalization and bounds for reports restored from local storage.
- Hardened priority scoring against negative vote counts.
- Added tests for vote tracking, report normalization, and malformed stored payloads.
- Added graceful feedback when browser storage is unavailable.

## 1.0.0
- Initial responsive community observation board prototype.

## 1.1.1 - 2026-11-04
- Fixed missing imports for report normalization and repeat-support detection in the main React app.
- Added a static import/export consistency check to the project verification workflow.

## 1.1.2 - 2026-11-04
- Added CSV export for community-maintenance reports.
- CSV text fields are quoted and spreadsheet formula prefixes are neutralized to reduce formula-injection risk.
- Added automated tests for CSV quoting and formula neutralization.

## 1.2.0 - 2026-11-07
- **Duplicate detection:** before a report is added, similar open reports (by word overlap in title and area, plus category) are shown, with a "Support this instead" option.
- **Explainable priority:** each report's Details panel breaks the score into severity, accessibility, and capped community-support points.
- **Status history:** status changes are recorded with dates and shown as a timeline. History survives reloads and is validated on load.
- **Category filter** with open counts per category, and a **resolution progress bar**.
- **Action brief export:** a plain-text, priority-ordered summary of open items for a facilities or parks team.
- **Accessibility:** Escape closes the dialog, the first field is focused, controls are labeled, focus rings are visible, and the dialog has dialog semantics.
- "Reset demo board" control and a favicon.
- 5 new automated tests (14 total).

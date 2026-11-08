# FixForward

**Small fixes. Stronger communities.** FixForward is a community board for public-space maintenance issues such as broken lights, damaged benches, or blocked paths. It turns scattered observations into an organized, prioritized list that a community can follow from first report to resolution.

Built for [STEMergent Hacks 2026](https://stemergent-hacks.devpost.com/) (Hackathon Pathway).

![Duplicate detection: it suggests supporting the existing report](docs/screenshot.jpg)

## My role & contributions

**Solo developer · AI-assisted**

- Designed the duplicate check that suggests supporting an existing report instead of adding a new one
- Made the priority score explainable, with a point-by-point breakdown

## The problem

Small public-space problems are noticed by many people but reported in scattered, duplicate, or vague ways, and nobody can see what happens next. Accessibility issues in particular are easy to overlook.

## Features

- **Report an observation** with a title, category, general public area, description, and severity. Validation reminds people not to enter home addresses or personal details.
- **Duplicate detection:** while you type, similar open reports are suggested so you can support an existing one instead of filing a duplicate.
- **Explainable priority:** each report's score comes from severity, an accessibility boost, and community support, and the breakdown is shown point by point.
- **Community support votes,** limited to one per report per browser.
- **Status tracking** with a full history for each report, plus a resolution progress bar for the whole board.
- **Search, filters, and sorting** by status, category, priority, or recency.
- **Export** as JSON, as CSV (with spreadsheet-formula protection), or as a plain-text action brief for a facilities or parks team.
- Responsive and keyboard-accessible.

## Tech stack

React · Vite · JavaScript · CSS · Node.js test runner

## Getting started

Requires Node.js 20.19+ or 22+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`.

## Testing

```bash
npm run check   # import checks, syntax checks, and the unit test suite
```

## How it works

Reports are stored in the browser's `localStorage` and start from fictional sample data. Priority is calculated as:

```
priority = severity × 10 + accessibility boost + min(support votes, 20)
```

Severity weights are High = 3, Medium = 2, and Low = 1. The score orders the list; it isn't an official safety rating. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/QA_AND_PRIVACY.md`](docs/QA_AND_PRIVACY.md).

## Scope

- Data is stored per browser. A shared database, accounts, and integration with a city or parks department are natural next steps.
- FixForward isn't an emergency service. Urgent hazards should go to the local authority.

## License

**Permission required.** © 2026 Dagmawi Melaku. You need my written permission before using, copying, or modifying this code, and any approved use must credit me with a link to this repository. Viewing, forking on GitHub, and running it to judge or review a submission are allowed without asking. To ask, [open an issue](../../issues/new). See [LICENSE](LICENSE) for the full terms.

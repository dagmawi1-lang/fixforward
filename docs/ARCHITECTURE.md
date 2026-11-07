# Architecture

- `src/main.jsx`: React entry point.
- `src/App.jsx`: page composition, form state, report list, filters, status demo, export, and local persistence.
- `src/logic.js`: pure report validation, ID generation, priority scoring, and sorting.
- `src/logic.test.js`: Node test-runner unit tests.
- `src/styles.css`: responsive layout and accessible interaction styling.

## Data flow
The UI initializes reports from `localStorage`, falling back to fictional seed data. Mutations create a new array and persist it to localStorage. Export serializes the current report collection to a JSON download.

## Priority heuristic
`priorityScore = severityWeight * 10 + accessibilityCategoryBoost + min(votes, 20)`.

Severity weights: High=3, Medium=2, Low=1. Accessibility and sidewalk/path categories receive a small boost. This is a transparent queue-ordering aid, not a risk model or official safety rating.

## Privacy and safety
The form requests only a general public area. It warns against home addresses and identifying information. The app is not an emergency service. Demo seed reports are fictional.

# QA and privacy notes — FixForward 1.1

## Automated checks
- Node built-in tests cover priority scoring, stable sorting, required-field validation, ID creation, vote-ledger checks, and defensive report normalization.
- The current suite contains eight passing tests.

## Data boundaries
- Reports and the browser-local vote ledger are stored in localStorage.
- No account, identity verification, municipal integration, or remote database exists.
- The vote guard is a demo safeguard only. Clearing browser storage or using another browser can reset it; it is not secure one-person-one-vote verification.
- Demo report records are fictional.
- The app should not collect home addresses, names, phone numbers, or other personal information.
- FixForward is not an emergency reporting tool and does not dispatch crews.

## Manual checks still required
- Fresh-install dependencies and run a Vite production build.
- Test form validation and repeat-vote feedback in a browser.
- Check mobile layout, keyboard focus, and screen-reader labels.
- Verify JSON export opens and contains all current report fields.

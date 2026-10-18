# Student Finance Tracker

A vanilla HTML, CSS and JavaScript app for students to track spending, stay under a spending cap, and search records with regular expressions.

**Live site:**  
https://ahoi-priscilla-chol.github.io/Student-Finance_Tracker/
**Demo video:** 
 https://www.loom.com/share/793b8e60859e4fc7a3ed75ddb7511e74

## Features
- Add, edit, delete and sort spending records
- Live regex search with highlighted matches and an ignore-case option
- Dashboard: total records, total spent, top category, 7-day chart
- Spending cap with a live message (polite under the cap, assertive over it)
- Saves in `localStorage`; JSON import and export with validation

## Regex catalog
| Rule | Pattern | Valid | Invalid |
|---|---|---|---|
| Description | `^\S(?:.*\S)?$` | `wifi bill` | ` wifi bill` |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `30.50` | `012` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2026-10-01` | `2026-13-01` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `School fees` | `Rent2` |
| Repeated word (back-reference) | `\b(\w+)\s+\1\b` | matches `fare fare` | `water bill` |

Search ideas: `school`, `(rent|bill)`, `\b\w+(?= bill)` (lookahead). A broken pattern like `([` shows an error, not a crash.

## Keyboard map
Tab / Shift+Tab move between items, Enter presses a button or follows a link, Space ticks the checkbox, arrow keys change the sort menu, and the first Tab shows the skip link.

## Accessibility notes
Landmarks and heading order, a label on every input, errors linked with `aria-describedby`, live regions (`role="status"` and the cap message), skip link, visible focus outline, and reduced-motion support.

## Setup and testing
1. Run `python -m http.server` in the project folder
2. Open http://localhost:8000 for the app
3. Open http://localhost:8000/tests.html (every line should say PASS)

## Files
`index.html`, `tests.html`, `seed.json`, `styles/main.css`, `scripts/` (6 modules), `docs/spec.md`, `assets/`

Edit loads a record into the form instead of editing inside the table row.

## Author
Ahoi Priscilla Chol ([Ahoi-Priscilla-Chol](https://github.com/Ahoi-Priscilla-Chol)), a.majak@alustudent.com

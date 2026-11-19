# Expense Tracker - Technical Notes

## Overview

Pennywise is a static expense tracker implemented with semantic HTML, responsive CSS, and vanilla JavaScript. It has no build process, dependencies, backend, or external services.

## Files

- `index.html` — form, monthly summary, category breakdown, and transaction table
- `styles.css` — layout, design, focus states, and mobile breakpoints
- `script.js` — `ExpenseTracker` class and LocalStorage persistence

## Expense data

Each expense is stored as:

```js
{
  id: String,
  description: String,
  amountCents: Number,
  category: String,
  date: String // YYYY-MM-DD
}
```

Amounts are converted to integer cents when entered to avoid floating-point rounding in totals. Dates are formatted using the browser's locale and grouped by their `YYYY-MM` prefix.

## Behavior

- The month selector includes the current month and every month with an expense.
- Summary metrics, category totals, and the transaction list all use the selected month.
- Search matches descriptions; category filtering can be combined with search.
- The display currency can be USD, CAD, GBP, EUR, or AUD. Existing values are not converted; the selected currency only changes how numbers are formatted.
- Descriptions are inserted with `textContent` rather than interpreted as HTML.

## Storage

- `expenses` stores the expense array as JSON.
- `expenseCurrency` stores the selected display currency.
- The older task application's `tasks` key is not read, overwritten, or deleted.
- Storage access errors are logged and surfaced in the entry form's status message.

## Run locally

Open `index.html` directly in a modern browser. All app behavior is client-side.

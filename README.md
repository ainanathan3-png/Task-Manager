# Pennywise Expense Tracker

A lightweight, responsive expense tracker built with vanilla HTML, CSS, and JavaScript. Record purchases, review spending by month and category, and keep your data in your browser.

## Features

- Add expenses with a description, amount, category, and date
- Review monthly spending, number of transactions, and average expense
- Compare spending across categories
- Browse months with recorded transactions
- Search expenses and filter by category
- Choose USD, CAD, GBP, EUR, or AUD for display
- Remove transactions
- Responsive layout for desktop and mobile
- Local browser storage; no account or server required

## Getting started

Open `index.html` in a modern browser. No installation, build step, or external service is required.

## Using the tracker

1. Enter a description, amount, category, and date in **Add an expense**.
2. Select **Add expense**. The selected month and its dashboard update immediately.
3. Use the month selector to review past or future-dated transactions.
4. Search by description or filter the transaction list by category.
5. Change the currency selector to display totals in another supported currency.
6. Use the × button in a transaction row to remove that expense.

## Data and privacy

Expenses and the selected display currency are stored in this browser's LocalStorage under `expenses` and `expenseCurrency`. Data is not sent to a server. Clearing browser storage removes it, so export or back up your data before clearing site data.

The original task list, if present, remains stored under its separate `tasks` key and is not used by the expense tracker.

## Project files

- `index.html` — accessible page structure and form
- `styles.css` — responsive visual design
- `script.js` — expense calculations, interactions, and storage
- `QUICK_START.md` — short usage guide
- `TECHNICAL_DOCUMENTATION.md` — implementation notes

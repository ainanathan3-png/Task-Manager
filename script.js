const CATEGORIES = [
    'Food & drink',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Home',
    'Travel',
    'Other'
];

const CATEGORY_COLORS = {
    'Food & drink': '#ef9d75',
    Transport: '#6f9ee8',
    Shopping: '#b28bdd',
    Bills: '#e5bc59',
    Entertainment: '#e77998',
    Health: '#66b99a',
    Home: '#8b9bcf',
    Travel: '#53b5be',
    Other: '#9aa5a1'
};

class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.currency = 'USD';
        this.selectedMonth = this.getMonthKey(new Date());
        this.searchQuery = '';
        this.selectedCategory = 'all';
        this.initElements();
        this.loadData();
        this.setDefaultDate();
        this.attachEventListeners();
        this.render();
    }

    initElements() {
        this.form = document.getElementById('expenseForm');
        this.descriptionInput = document.getElementById('descriptionInput');
        this.amountInput = document.getElementById('amountInput');
        this.categoryInput = document.getElementById('categoryInput');
        this.dateInput = document.getElementById('dateInput');
        this.formMessage = document.getElementById('formMessage');
        this.currencySelect = document.getElementById('currencySelect');
        this.currencySymbol = document.getElementById('currencySymbol');
        this.monthSelect = document.getElementById('monthSelect');
        this.monthlyTotal = document.getElementById('monthlyTotal');
        this.monthlyCaption = document.getElementById('monthlyCaption');
        this.monthlyCount = document.getElementById('monthlyCount');
        this.monthlyAverage = document.getElementById('monthlyAverage');
        this.breakdownPeriod = document.getElementById('breakdownPeriod');
        this.categoryBreakdown = document.getElementById('categoryBreakdown');
        this.breakdownEmpty = document.getElementById('breakdownEmpty');
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilterSelect = document.getElementById('categoryFilter');
        this.transactionsList = document.getElementById('transactionsList');
        this.emptyState = document.getElementById('emptyState');
        this.noResults = document.getElementById('noResults');
    }

    attachEventListeners() {
        this.form.addEventListener('submit', event => this.handleAddExpense(event));
        this.currencySelect.addEventListener('change', () => {
            this.currency = this.currencySelect.value;
            this.saveData();
            this.render();
        });
        this.monthSelect.addEventListener('change', () => {
            this.selectedMonth = this.monthSelect.value;
            this.render();
        });
        this.searchInput.addEventListener('input', () => {
            this.searchQuery = this.searchInput.value.trim().toLowerCase();
            this.renderTransactions();
        });
        this.categoryFilterSelect.addEventListener('change', () => {
            this.selectedCategory = this.categoryFilterSelect.value;
            this.renderTransactions();
        });
        this.transactionsList.addEventListener('click', event => {
            const button = event.target.closest('[data-delete-id]');
            if (button) this.handleDeleteExpense(button.dataset.deleteId);
        });
    }

    setDefaultDate() {
        const now = new Date();
        this.dateInput.value = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
    }

    loadData() {
        try {
            const savedExpenses = localStorage.getItem('expenses');
            const savedCurrency = localStorage.getItem('expenseCurrency');
            if (savedExpenses) {
                const parsed = JSON.parse(savedExpenses);
                if (!Array.isArray(parsed)) throw new Error('Saved expenses are not a list.');
                this.expenses = parsed.filter(expense =>
                    expense &&
                    typeof expense.id === 'string' &&
                    typeof expense.description === 'string' &&
                    Number.isSafeInteger(expense.amountCents) &&
                    expense.amountCents > 0 &&
                    CATEGORIES.includes(expense.category) &&
                    this.isValidDate(expense.date)
                );
            }
            if (['USD', 'CAD', 'GBP', 'EUR', 'AUD'].includes(savedCurrency)) {
                this.currency = savedCurrency;
            }
        } catch (error) {
            console.error('Unable to load saved expenses:', error);
            this.formMessage.textContent = 'Saved expenses could not be read. Add an expense to start a new list.';
        }
    }

    saveData() {
        try {
            localStorage.setItem('expenses', JSON.stringify(this.expenses));
            localStorage.setItem('expenseCurrency', this.currency);
        } catch (error) {
            console.error('Unable to save expense data:', error);
            this.formMessage.textContent = 'Could not save your changes. Check that browser storage is available.';
        }
    }

    handleAddExpense(event) {
        event.preventDefault();
        this.formMessage.textContent = '';
        const description = this.descriptionInput.value.trim();
        const amount = Number(this.amountInput.value);
        const amountCents = Math.round(amount * 100);
        const category = this.categoryInput.value;
        const date = this.dateInput.value;

        if (!description || !Number.isFinite(amount) || amountCents <= 0 ||
            amountCents > 10000000000 || !CATEGORIES.includes(category) || !this.isValidDate(date)) {
            this.formMessage.textContent = 'Enter a description, a valid amount, category, and date.';
            return;
        }

        this.expenses.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            description,
            amountCents,
            category,
            date
        });
        this.selectedMonth = date.slice(0, 7);
        this.searchQuery = '';
        this.categoryFilterSelect.value = 'all';
        this.selectedCategory = 'all';
        this.searchInput.value = '';
        this.form.reset();
        this.setDefaultDate();
        this.saveData();
        this.render();
        this.descriptionInput.focus();
    }

    handleDeleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.saveData();
        this.render();
    }

    getMonthKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    isValidDate(value) {
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }

    formatCurrency(amountCents) {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: this.currency
        }).format(amountCents / 100);
    }

    formatMonth(monthKey) {
        const [year, month] = monthKey.split('-').map(Number);
        return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
            .format(new Date(year, month - 1, 1));
    }

    formatDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(year, month - 1, day));
    }

    getSelectedExpenses() {
        return this.expenses.filter(expense => expense.date.slice(0, 7) === this.selectedMonth);
    }

    render() {
        this.currencySelect.value = this.currency;
        this.currencySymbol.textContent = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: this.currency
        }).formatToParts(0).find(part => part.type === 'currency').value;
        this.renderMonthOptions();
        this.renderSummary();
        this.renderBreakdown();
        this.renderTransactions();
    }

    renderMonthOptions() {
        const months = new Set([this.getMonthKey(new Date()), ...this.expenses.map(expense => expense.date.slice(0, 7))]);
        const sortedMonths = Array.from(months).sort().reverse();
        this.monthSelect.replaceChildren();
        sortedMonths.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = this.formatMonth(month);
            this.monthSelect.appendChild(option);
        });
        if (!months.has(this.selectedMonth)) this.selectedMonth = sortedMonths[0];
        this.monthSelect.value = this.selectedMonth;
    }

    renderSummary() {
        const expenses = this.getSelectedExpenses();
        const total = expenses.reduce((sum, expense) => sum + expense.amountCents, 0);
        this.monthlyTotal.textContent = this.formatCurrency(total);
        this.monthlyCount.textContent = expenses.length.toLocaleString();
        this.monthlyAverage.textContent = this.formatCurrency(
            expenses.length ? Math.round(total / expenses.length) : 0
        );
        this.monthlyCaption.textContent = expenses.length
            ? `${expenses.length} expense${expenses.length === 1 ? '' : 's'} recorded`
            : `No expenses recorded in ${this.formatMonth(this.selectedMonth)}`;
        this.breakdownPeriod.textContent = this.formatMonth(this.selectedMonth);
    }

    renderBreakdown() {
        const totals = new Map();
        this.getSelectedExpenses().forEach(expense => {
            totals.set(expense.category, (totals.get(expense.category) || 0) + expense.amountCents);
        });
        const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
        const maxAmount = entries.length ? entries[0][1] : 0;
        this.categoryBreakdown.replaceChildren();
        this.breakdownEmpty.classList.toggle('hidden', entries.length > 0);

        entries.forEach(([category, amount]) => {
            const row = document.createElement('div');
            row.className = 'category-row';
            const label = document.createElement('div');
            label.className = 'category-label';
            const dot = document.createElement('span');
            dot.className = 'category-dot';
            dot.style.backgroundColor = CATEGORY_COLORS[category];
            const name = document.createElement('span');
            name.textContent = category;
            const value = document.createElement('span');
            value.className = 'category-amount';
            value.textContent = this.formatCurrency(amount);
            label.append(dot, name, value);
            const track = document.createElement('div');
            track.className = 'bar-track';
            const bar = document.createElement('div');
            bar.className = 'bar-fill';
            bar.style.width = `${Math.max(4, (amount / maxAmount) * 100)}%`;
            bar.style.backgroundColor = CATEGORY_COLORS[category];
            track.appendChild(bar);
            row.append(label, track);
            this.categoryBreakdown.appendChild(row);
        });
    }

    renderTransactions() {
        const expenses = this.getSelectedExpenses()
            .filter(expense => expense.description.toLowerCase().includes(this.searchQuery))
            .filter(expense => this.selectedCategory === 'all' || expense.category === this.selectedCategory)
            .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
        this.transactionsList.replaceChildren();
        const hasMonthExpenses = this.getSelectedExpenses().length > 0;
        this.emptyState.classList.toggle('hidden', hasMonthExpenses);
        this.noResults.classList.toggle('hidden', !hasMonthExpenses || expenses.length > 0);

        expenses.forEach(expense => {
            const row = document.createElement('tr');
            const descriptionCell = document.createElement('td');
            descriptionCell.className = 'description-cell';
            const description = document.createElement('span');
            description.className = 'transaction-name';
            description.textContent = expense.description;
            descriptionCell.appendChild(description);

            const categoryCell = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'category-badge';
            badge.style.setProperty('--category-color', CATEGORY_COLORS[expense.category]);
            badge.textContent = expense.category;
            categoryCell.appendChild(badge);

            const dateCell = document.createElement('td');
            dateCell.className = 'date-cell';
            dateCell.textContent = this.formatDate(expense.date);

            const amountCell = document.createElement('td');
            amountCell.className = 'amount-column transaction-amount';
            amountCell.textContent = `−${this.formatCurrency(expense.amountCents)}`;

            const actionCell = document.createElement('td');
            actionCell.className = 'action-column';
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'delete-button';
            deleteButton.dataset.deleteId = expense.id;
            deleteButton.setAttribute('aria-label', `Delete ${expense.description}`);
            deleteButton.title = 'Delete expense';
            deleteButton.textContent = '×';
            actionCell.appendChild(deleteButton);

            row.append(descriptionCell, categoryCell, dateCell, amountCell, actionCell);
            this.transactionsList.appendChild(row);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new ExpenseTracker());

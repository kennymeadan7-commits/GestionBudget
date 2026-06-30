const STORAGE_KEY = "gestionbudget.transactions.v1";
const BUDGET_KEY = "gestionbudget.monthlybudget.v1";

const transactionForm = document.getElementById("transaction-form");
const budgetForm = document.getElementById("budget-form");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const budgetInput = document.getElementById("monthly-budget");
const budgetMessage = document.getElementById("budget-message");
const monthFilterInput = document.getElementById("month-filter");
const resetFilterButton = document.getElementById("reset-filter");
const transactionsBody = document.getElementById("transactions-body");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const balance = document.getElementById("balance");
const budgetProgress = document.getElementById("budget-progress");
const categoryChart = document.getElementById("category-chart");

let transactions = readTransactions();
let monthlyBudget = readMonthlyBudget();
let monthFilter = "";

initializeDefaults();
render();

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number.parseFloat(amountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const newTransaction = {
    id: crypto.randomUUID(),
    date: dateInput.value,
    type: typeInput.value,
    category: categoryInput.value.trim(),
    description: descriptionInput.value.trim(),
    amount,
  };

  transactions.unshift(newTransaction);
  writeTransactions(transactions);
  transactionForm.reset();
  dateInput.value = todayAsInputDate();
  render();
});

budgetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextBudget = Number.parseFloat(budgetInput.value);
  monthlyBudget = Number.isFinite(nextBudget) && nextBudget >= 0 ? nextBudget : 0;
  localStorage.setItem(BUDGET_KEY, String(monthlyBudget));
  render();
});

resetFilterButton.addEventListener("click", () => {
  monthFilter = "";
  monthFilterInput.value = "";
  render();
});

monthFilterInput.addEventListener("change", () => {
  monthFilter = monthFilterInput.value;
  render();
});

transactionsBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) {
    return;
  }

  const id = button.dataset.id;
  transactions = transactions.filter((transaction) => transaction.id !== id);
  writeTransactions(transactions);
  render();
});

function initializeDefaults() {
  dateInput.value = todayAsInputDate();
  budgetInput.value = String(monthlyBudget || "");
  monthFilterInput.value = monthFilter;
}

function render() {
  const visibleTransactions = getFilteredTransactions();
  renderTable(visibleTransactions);
  renderSummary(visibleTransactions);
  renderCategoryChart(visibleTransactions);
}

function getFilteredTransactions() {
  if (!monthFilter) {
    return transactions;
  }
  return transactions.filter((transaction) => transaction.date.startsWith(monthFilter));
}

function renderTable(rows) {
  if (rows.length === 0) {
    transactionsBody.innerHTML =
      '<tr><td colspan="6" class="muted">Aucune transaction pour cette période.</td></tr>';
    return;
  }

  const html = rows
    .map((transaction) => {
      const sign = transaction.type === "depense" ? "-" : "+";
      const cssClass = transaction.type === "depense" ? "expense" : "income";
      return `<tr>
        <td>${escapeHtml(transaction.date)}</td>
        <td>${escapeHtml(capitalize(transaction.type))}</td>
        <td>${escapeHtml(transaction.category)}</td>
        <td>${escapeHtml(transaction.description || "—")}</td>
        <td class="${cssClass}">${sign}${formatCurrency(transaction.amount)}</td>
        <td><button class="delete-btn" data-id="${transaction.id}">Supprimer</button></td>
      </tr>`;
    })
    .join("");

  transactionsBody.innerHTML = html;
}

function renderSummary(rows) {
  const income = rows
    .filter((transaction) => transaction.type === "revenu")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = rows
    .filter((transaction) => transaction.type === "depense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const currentBalance = income - expenses;

  totalIncome.textContent = formatCurrency(income);
  totalExpenses.textContent = formatCurrency(expenses);
  balance.textContent = formatCurrency(currentBalance);
  balance.className = currentBalance < 0 ? "expense" : "income";

  if (!monthlyBudget) {
    budgetProgress.style.width = "0%";
    budgetMessage.textContent = "Ajoutez un objectif pour suivre votre consommation.";
    return;
  }

  const usedPercent = Math.min((expenses / monthlyBudget) * 100, 100);
  budgetProgress.style.width = `${usedPercent.toFixed(2)}%`;
  budgetMessage.textContent = `${formatCurrency(expenses)} dépensés sur ${formatCurrency(
    monthlyBudget
  )} (${usedPercent.toFixed(1)} %)`;
}

function renderCategoryChart(rows) {
  const categoryTotals = {};
  for (const transaction of rows) {
    if (transaction.type !== "depense") {
      continue;
    }
    const key = transaction.category || "Sans catégorie";
    categoryTotals[key] = (categoryTotals[key] || 0) + transaction.amount;
  }

  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    categoryChart.innerHTML = '<p class="muted">Pas encore de dépenses à afficher.</p>';
    return;
  }

  const max = entries[0][1];
  categoryChart.innerHTML = entries
    .map(([category, total]) => {
      const width = (total / max) * 100;
      return `<div class="bar-row">
        <span>${escapeHtml(category)}</span>
        <div class="bar-track"><div class="bar" style="width: ${width.toFixed(2)}%"></div></div>
        <strong>${formatCurrency(total)}</strong>
      </div>`;
    })
    .join("");
}

function readTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        (item.type === "revenu" || item.type === "depense") &&
        typeof item.category === "string" &&
        typeof item.description === "string" &&
        typeof item.amount === "number"
    );
  } catch {
    return [];
  }
}

function readMonthlyBudget() {
  const value = Number.parseFloat(localStorage.getItem(BUDGET_KEY) || "0");
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function writeTransactions(nextTransactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTransactions));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function todayAsInputDate() {
  return new Date().toISOString().split("T")[0];
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

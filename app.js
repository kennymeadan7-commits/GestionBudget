const STORAGE_KEY = 'gestion-budget-local';

const INCOME_IDS = ['salary', 'freelance'];

const DEFAULT_CATEGORIES = [
  { id: 'salary', name: 'Salaire', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', color: '#06b6d4' },
  { id: 'food', name: 'Alimentation', color: '#f59e0b', budgetLimit: 400 },
  { id: 'transport', name: 'Transport', color: '#6366f1', budgetLimit: 150 },
  { id: 'housing', name: 'Logement', color: '#8b5cf6', budgetLimit: 900 },
  { id: 'entertainment', name: 'Loisirs', color: '#ec4899', budgetLimit: 200 },
  { id: 'health', name: 'Santé', color: '#14b8a6', budgetLimit: 100 },
  { id: 'shopping', name: 'Shopping', color: '#f97316', budgetLimit: 150 },
  { id: 'other', name: 'Autre', color: '#64748b', budgetLimit: 100 },
];

function getDemoTransactions() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return [
    { id: 'd1', type: 'income', amount: 2800, categoryId: 'salary', description: 'Salaire mensuel', date: `${y}-${m}-01` },
    { id: 'd2', type: 'expense', amount: 850, categoryId: 'housing', description: 'Loyer', date: `${y}-${m}-03` },
    { id: 'd3', type: 'expense', amount: 127.45, categoryId: 'food', description: 'Courses Carrefour', date: `${y}-${m}-05` },
    { id: 'd4', type: 'expense', amount: 65, categoryId: 'transport', description: 'Abonnement métro', date: `${y}-${m}-05` },
    { id: 'd5', type: 'expense', amount: 42.99, categoryId: 'entertainment', description: 'Netflix + Spotify', date: `${y}-${m}-08` },
    { id: 'd6', type: 'expense', amount: 89.5, categoryId: 'food', description: 'Restaurant', date: `${y}-${m}-12` },
    { id: 'd7', type: 'income', amount: 450, categoryId: 'freelance', description: 'Mission freelance', date: `${y}-${m}-15` },
    { id: 'd8', type: 'expense', amount: 35, categoryId: 'health', description: 'Pharmacie', date: `${y}-${m}-18` },
  ];
}

let state = loadState();
let currentType = 'expense';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return { transactions: getDemoTransactions(), categories: DEFAULT_CATEGORIES };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function getCategory(id) {
  return state.categories.find((c) => c.id === id);
}

function getMonthTransactions() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return state.transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

function computeStats() {
  const monthTx = getMonthTransactions();
  const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const totalBudget = state.categories
    .filter((c) => c.budgetLimit != null)
    .reduce((s, c) => s + c.budgetLimit, 0);

  const expensesByCategory = state.categories.map((cat) => {
    const spent = monthTx
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((s, t) => s + t.amount, 0);
    return { category: cat, spent };
  });

  return { income, expenses, balance, savingsRate, totalBudget, monthTx, expensesByCategory };
}

function renderTransactionItem(tx, showDelete) {
  const cat = getCategory(tx.categoryId);
  const isIncome = tx.type === 'income';
  const li = document.createElement('li');
  li.className = 'tx-item';
  li.innerHTML = `
    <div class="tx-item__icon tx-item__icon--${tx.type}">${isIncome ? '↓' : '↑'}</div>
    <div class="tx-item__info">
      <p class="tx-item__title">${escapeHtml(tx.description || cat?.name || 'Sans description')}</p>
      <div class="tx-item__meta">
        <span class="tx-item__dot" style="background:${cat?.color || '#94a3b8'}"></span>
        <span>${escapeHtml(cat?.name || '')}</span>
        <span>·</span>
        <span>${formatDate(tx.date)}</span>
      </div>
    </div>
    <span class="tx-item__amount tx-item__amount--${tx.type}">
      ${isIncome ? '+' : '-'}${formatCurrency(tx.amount)}
    </span>
    ${showDelete ? `<button class="tx-item__delete" data-id="${tx.id}" title="Supprimer">✕</button>` : ''}
  `;
  if (showDelete) {
    li.querySelector('.tx-item__delete').addEventListener('click', () => {
      state.transactions = state.transactions.filter((t) => t.id !== tx.id);
      saveState();
      render();
    });
  }
  return li;
}

function renderTxList(container, transactions, showDelete, limit) {
  container.innerHTML = '';
  const list = limit ? transactions.slice(0, limit) : transactions;
  if (list.length === 0) {
    container.innerHTML = '<li class="tx-empty">Aucune transaction pour le moment</li>';
    return;
  }
  list.forEach((tx) => container.appendChild(renderTransactionItem(tx, showDelete)));
}

function renderChart(expensesByCategory) {
  const container = document.getElementById('chartContainer');
  const data = expensesByCategory.filter((e) => e.spent > 0);
  if (data.length === 0) {
    container.innerHTML = '<p class="tx-empty">Pas de dépenses ce mois-ci</p>';
    return;
  }
  const max = Math.max(...data.map((d) => d.spent));
  container.innerHTML = data
    .map(({ category, spent }) => {
      const pct = (spent / max) * 100;
      return `
        <div class="chart-bar">
          <div class="chart-bar__header">
            <span class="chart-bar__name">
              <span class="tx-item__dot" style="background:${category.color}"></span>
              ${escapeHtml(category.name)}
            </span>
            <span>${formatCurrency(spent)}</span>
          </div>
          <div class="chart-bar__track">
            <div class="chart-bar__fill" style="width:${pct}%;background:${category.color}"></div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderBudgets(expensesByCategory, totalBudget, expenses) {
  const container = document.getElementById('budgetList');
  const items = expensesByCategory.filter((e) => e.category.budgetLimit != null);
  if (items.length === 0) {
    container.innerHTML = '<p class="tx-empty">Aucun budget défini</p>';
    return;
  }
  container.innerHTML = items
    .map(({ category, spent }) => {
      const limit = category.budgetLimit;
      const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
      const remaining = limit - spent;
      const isOver = spent > limit;
      const fillClass = isOver ? 'over' : pct > 80 ? 'warn' : 'ok';
      return `
        <div class="budget-item" data-cat="${category.id}">
          <div class="budget-item__header">
            <span class="budget-item__name">
              <span class="tx-item__dot" style="background:${category.color}"></span>
              ${escapeHtml(category.name)}
            </span>
            <span class="budget-item__amounts">${formatCurrency(spent)} / ${formatCurrency(limit)}</span>
          </div>
          <div class="budget-item__track">
            <div class="budget-item__fill budget-item__fill--${fillClass}" style="width:${pct}%"></div>
          </div>
          <div class="budget-item__footer">
            <span class="budget-item__remaining ${isOver ? 'budget-item__remaining--over' : ''}">
              ${isOver ? `Dépassé de ${formatCurrency(Math.abs(remaining))}` : `Reste ${formatCurrency(remaining)}`}
            </span>
            <input type="number" class="budget-item__input" value="${limit}" min="0" step="10" data-cat="${category.id}" title="Modifier le budget" />
          </div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.budget-item__input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const val = parseFloat(e.target.value);
      if (isNaN(val) || val < 0) return;
      const cat = state.categories.find((c) => c.id === e.target.dataset.cat);
      if (cat) {
        cat.budgetLimit = val;
        saveState();
        render();
      }
    });
  });

  document.getElementById('overviewBudget').textContent = formatCurrency(totalBudget);
  document.getElementById('overviewSpent').textContent = formatCurrency(expenses);
  const remaining = totalBudget - expenses;
  const remainingEl = document.getElementById('overviewRemaining');
  remainingEl.textContent = formatCurrency(remaining);
  const row = remainingEl.closest('.overview__row');
  row.classList.toggle('overview__row--negative', remaining < 0);
}

function updateCategorySelect() {
  const select = document.getElementById('txCategory');
  const filtered = state.categories.filter((c) => {
    if (currentType === 'income') return INCOME_IDS.includes(c.id);
    return !INCOME_IDS.includes(c.id) || c.budgetLimit != null;
  });
  select.innerHTML = filtered.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
}

function render() {
  const stats = computeStats();

  document.getElementById('monthLabel').textContent = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  document.getElementById('statIncome').textContent = formatCurrency(stats.income);
  document.getElementById('statExpenses').textContent = formatCurrency(stats.expenses);
  document.getElementById('statBalance').textContent = formatCurrency(stats.balance);
  document.getElementById('statBalanceHint').textContent = stats.balance >= 0 ? 'Positif' : 'Négatif';
  document.getElementById('statSavings').textContent = `${stats.savingsRate.toFixed(0)}%`;
  document.getElementById('statBudgetTotal').textContent = `Budget : ${formatCurrency(stats.totalBudget)}`;

  renderChart(stats.expensesByCategory);
  renderTxList(document.getElementById('recentList'), stats.monthTx, false, 6);
  renderTxList(document.getElementById('allTxList'), state.transactions, true);
  document.getElementById('txCount').textContent = state.transactions.length;
  renderBudgets(stats.expensesByCategory, stats.totalBudget, stats.expenses);
  updateCategorySelect();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function initTabs() {
  document.querySelectorAll('.tabs__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs__btn').forEach((b) => b.classList.remove('tabs__btn--active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('tab-panel--active'));
      btn.classList.add('tabs__btn--active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('tab-panel--active');
    });
  });
}

function initTypeToggle() {
  document.querySelectorAll('.type-toggle__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      document.querySelectorAll('.type-toggle__btn').forEach((b) => {
        b.classList.remove('type-toggle__btn--active');
        b.classList.toggle(`type-toggle__btn--${b.dataset.type}`, b.dataset.type === currentType);
      });
      btn.classList.add('type-toggle__btn--active');
      updateCategorySelect();
    });
  });
  document.querySelector('[data-type="expense"]').classList.add('type-toggle__btn--expense');
}

function initForm() {
  document.getElementById('txDate').value = new Date().toISOString().split('T')[0];

  document.getElementById('txForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('txAmount').value);
    const categoryId = document.getElementById('txCategory').value;
    const description = document.getElementById('txDescription').value.trim();
    const date = document.getElementById('txDate').value;
    if (!amount || amount <= 0) return;

    state.transactions.unshift({
      id: crypto.randomUUID(),
      type: currentType,
      amount,
      categoryId,
      description,
      date,
    });
    saveState();
    document.getElementById('txAmount').value = '';
    document.getElementById('txDescription').value = '';
    render();
  });
}

initTabs();
initTypeToggle();
initForm();
render();

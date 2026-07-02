const STORAGE_KEY = 'gestion-budget-benin';

const INCOME_IDS = ['salary', 'commerce', 'transfert', 'mtn_in', 'moov_in'];

const DEFAULT_CATEGORIES = [
  { id: 'salary', name: 'Salaire', color: '#10b981' },
  { id: 'commerce', name: 'Commerce / Activité', color: '#06b6d4' },
  { id: 'transfert', name: 'Transfert (famille)', color: '#22c55e' },
  { id: 'mtn_in', name: 'MTN MoMo reçu', color: '#ffcc00' },
  { id: 'moov_in', name: 'Moov Money reçu', color: '#0066cc' },
  { id: 'food', name: 'Alimentation / Marché', color: '#f59e0b', budgetLimit: 120000 },
  { id: 'transport', name: 'Transport (zémi, taxi)', color: '#6366f1', budgetLimit: 40000 },
  { id: 'housing', name: 'Logement / Loyer', color: '#8b5cf6', budgetLimit: 80000 },
  { id: 'communication', name: 'Crédit téléphone', color: '#0ea5e9', budgetLimit: 15000 },
  { id: 'utilities', name: 'SBEE / SONEB', color: '#eab308', budgetLimit: 25000 },
  { id: 'education', name: 'Éducation / Scolarité', color: '#3b82f6', budgetLimit: 50000 },
  { id: 'health', name: 'Santé', color: '#14b8a6', budgetLimit: 20000 },
  { id: 'mtn_out', name: 'MTN MoMo (envoi/frais)', color: '#ffcc00', budgetLimit: 15000 },
  { id: 'moov_out', name: 'Moov Money (envoi/frais)', color: '#0066cc', budgetLimit: 15000 },
  { id: 'tontine', name: 'Tontine / Cotisation', color: '#be185d', budgetLimit: 25000 },
  { id: 'clothing', name: 'Habits / Vêtements', color: '#f97316', budgetLimit: 30000 },
  { id: 'entertainment', name: 'Loisirs', color: '#ec4899', budgetLimit: 25000 },
  { id: 'family', name: 'Famille / Entraide', color: '#a855f7', budgetLimit: 30000 },
  { id: 'other', name: 'Autre', color: '#64748b', budgetLimit: 20000 },
];

function getDemoTransactions() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return [
    { id: 'd1', type: 'income', amount: 250000, categoryId: 'salary', description: 'Salaire mensuel', date: `${y}-${m}-01` },
    { id: 'd2', type: 'expense', amount: 75000, categoryId: 'housing', description: 'Loyer mensuel', date: `${y}-${m}-03` },
    { id: 'd3', type: 'expense', amount: 18500, categoryId: 'food', description: 'Courses au marché Dantokpa', date: `${y}-${m}-05` },
    { id: 'd4', type: 'expense', amount: 3500, categoryId: 'transport', description: 'Zémidjans de la semaine', date: `${y}-${m}-06` },
    { id: 'd5', type: 'expense', amount: 5000, categoryId: 'mtn_out', description: 'Transfert MTN MoMo', date: `${y}-${m}-07` },
    { id: 'd6', type: 'expense', amount: 15000, categoryId: 'utilities', description: 'Facture SBEE', date: `${y}-${m}-08` },
    { id: 'd7', type: 'expense', amount: 10000, categoryId: 'tontine', description: 'Cotisation tontine du mois', date: `${y}-${m}-10` },
    { id: 'd8', type: 'income', amount: 45000, categoryId: 'commerce', description: 'Vente boutique', date: `${y}-${m}-15` },
    { id: 'd9', type: 'expense', amount: 8000, categoryId: 'health', description: 'Pharmacie', date: `${y}-${m}-18` },
    { id: 'd10', type: 'income', amount: 30000, categoryId: 'mtn_in', description: 'Réception MTN MoMo', date: `${y}-${m}-20` },
  ];
}

function mergeCategories(existing) {
  const map = new Map(existing.map((c) => [c.id, c]));
  DEFAULT_CATEGORIES.forEach((def) => {
    if (!map.has(def.id)) map.set(def.id, { ...def });
  });
  return Array.from(map.values());
}

function getMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        transactions: parsed.transactions ?? [],
        categories: mergeCategories(parsed.categories ?? []),
        savingsGoals: parsed.savingsGoals ?? {},
      };
    }
  } catch (_) { /* ignore */ }
  const key = getMonthKey(new Date().getFullYear(), new Date().getMonth());
  return {
    transactions: getDemoTransactions(),
    categories: [...DEFAULT_CATEGORIES],
    savingsGoals: { [key]: 30000 },
  };
}

let state = loadState();
let currentType = 'expense';
const now = new Date();
let selectedYear = now.getFullYear();
let selectedMonth = now.getMonth();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-BJ', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('fr-BJ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function formatMonthLabel(year, month) {
  return new Intl.DateTimeFormat('fr-BJ', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
}

function getCategory(id) {
  return state.categories.find((c) => c.id === id);
}

function getMonthTransactions(year = selectedYear, month = selectedMonth) {
  return state.transactions.filter((t) => {
    const d = new Date(t.date + 'T12:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

function computeStats(year = selectedYear, month = selectedMonth) {
  const monthTx = getMonthTransactions(year, month);
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

function getBudgetAlerts(expensesByCategory) {
  const alerts = [];
  expensesByCategory.forEach(({ category, spent }) => {
    if (category.budgetLimit == null || category.budgetLimit <= 0) return;
    const pct = (spent / category.budgetLimit) * 100;
    if (pct >= 100) {
      alerts.push({ level: 'danger', category, spent, pct, message: `${category.name} : budget dépassé (${formatCurrency(spent)} / ${formatCurrency(category.budgetLimit)})` });
    } else if (pct >= 80) {
      alerts.push({ level: 'warn', category, spent, pct, message: `${category.name} : ${Math.round(pct)}% du budget utilisé` });
    }
  });
  return alerts.sort((a, b) => b.pct - a.pct);
}

function renderAlerts(alerts) {
  const container = document.getElementById('budgetAlerts');
  if (!alerts.length) {
    container.hidden = true;
    container.innerHTML = '';
    return;
  }
  container.hidden = false;
  container.innerHTML = alerts
    .map((a) => `<div class="alert alert--${a.level}"><span>${a.level === 'danger' ? '🚨' : '⚠️'}</span> ${escapeHtml(a.message)}</div>`)
    .join('');
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => { toast.hidden = true; }, 3500);
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
      if (!confirm('Supprimer cette transaction ?')) return;
      state.transactions = state.transactions.filter((t) => t.id !== tx.id);
      saveState();
      render();
      showToast('Transaction supprimée', 'info');
    });
  }
  return li;
}

function renderTxList(container, transactions, showDelete, limit) {
  container.innerHTML = '';
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  const list = limit ? sorted.slice(0, limit) : sorted;
  if (list.length === 0) {
    container.innerHTML = '<li class="tx-empty">Aucune transaction pour ce mois</li>';
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
              ${isOver ? '<span class="budget-item__badge budget-item__badge--over">Dépassé</span>' : pct >= 80 ? '<span class="budget-item__badge budget-item__badge--warn">Attention</span>' : ''}
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
            <input type="number" class="budget-item__input" value="${limit}" min="0" step="500" data-cat="${category.id}" title="Modifier le budget" />
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
  document.getElementById('overviewRemainingRow').classList.toggle('overview__row--negative', remaining < 0);
}

function updateCategorySelect() {
  const select = document.getElementById('txCategory');
  const filtered = state.categories.filter((c) => {
    if (currentType === 'income') return INCOME_IDS.includes(c.id);
    return !INCOME_IDS.includes(c.id);
  });
  select.innerHTML = filtered.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
}

function renderSavingsGoal(stats) {
  const monthKey = getMonthKey(selectedYear, selectedMonth);
  const goal = state.savingsGoals[monthKey] || 0;
  const saved = Math.max(0, stats.balance);
  const pct = goal > 0 ? Math.min((saved / goal) * 100, 100) : 0;
  const remaining = goal - saved;

  document.getElementById('savingsGoalMonth').textContent = formatMonthLabel(selectedYear, selectedMonth);
  document.getElementById('savingsSaved').textContent = formatCurrency(saved);
  document.getElementById('savingsTarget').textContent = goal > 0 ? formatCurrency(goal) : 'Non défini';
  document.getElementById('savingsPct').textContent = goal > 0 ? `${Math.round(pct)}%` : '—';

  const fill = document.getElementById('savingsFill');
  fill.style.width = `${pct}%`;
  fill.className = 'savings-goal__fill';
  if (goal > 0 && saved >= goal) fill.classList.add('savings-goal__fill--done');
  else if (stats.balance < 0) fill.classList.add('savings-goal__fill--danger');
  else if (pct >= 80) fill.classList.add('savings-goal__fill--warn');

  const status = document.getElementById('savingsStatus');
  if (goal <= 0) {
    status.textContent = 'Définissez un objectif pour suivre votre épargne ce mois-ci.';
    status.className = 'savings-goal__status';
  } else if (stats.balance < 0) {
    status.textContent = `Déficit de ${formatCurrency(Math.abs(stats.balance))} — objectif non atteint pour l'instant.`;
    status.className = 'savings-goal__status savings-goal__status--danger';
  } else if (saved >= goal) {
    status.textContent = `🎉 Bravo ! Objectif atteint (+${formatCurrency(saved - goal)}).`;
    status.className = 'savings-goal__status savings-goal__status--success';
  } else {
    status.textContent = `Encore ${formatCurrency(remaining)} à épargner pour atteindre l'objectif.`;
    status.className = 'savings-goal__status';
  }

  document.getElementById('savingsGoalInput').value = goal > 0 ? goal : '';
}

function buildMonthOptions() {
  const select = document.getElementById('monthSelect');
  const months = new Set();
  state.transactions.forEach((t) => {
    const d = new Date(t.date + 'T12:00:00');
    months.add(`${d.getFullYear()}-${d.getMonth()}`);
  });
  months.add(`${now.getFullYear()}-${now.getMonth()}`);
  months.add(`${selectedYear}-${selectedMonth}`);

  const sorted = Array.from(months)
    .map((k) => { const [y, m] = k.split('-').map(Number); return { y, m }; })
    .sort((a, b) => b.y - a.y || b.m - a.m);

  select.innerHTML = sorted
    .map(({ y, m }) => `<option value="${y}-${m}" ${y === selectedYear && m === selectedMonth ? 'selected' : ''}>${formatMonthLabel(y, m)}</option>`)
    .join('');
}

function render() {
  const stats = computeStats();
  const monthLabel = formatMonthLabel(selectedYear, selectedMonth);
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  document.getElementById('statIncomeHint').textContent = monthLabel;
  document.getElementById('statExpensesHint').textContent = monthLabel;
  document.getElementById('statIncome').textContent = formatCurrency(stats.income);
  document.getElementById('statExpenses').textContent = formatCurrency(stats.expenses);
  document.getElementById('statBalance').textContent = formatCurrency(stats.balance);
  document.getElementById('statBalanceHint').textContent = stats.balance >= 0 ? 'Positif' : 'Négatif';
  document.getElementById('statSavings').textContent = `${stats.savingsRate.toFixed(0)}%`;
  document.getElementById('statBudgetTotal').textContent = `Budget : ${formatCurrency(stats.totalBudget)}`;

  renderAlerts(getBudgetAlerts(stats.expensesByCategory));
  renderChart(stats.expensesByCategory);
  renderTxList(document.getElementById('recentList'), stats.monthTx, false, 6);
  renderTxList(document.getElementById('allTxList'), stats.monthTx, true);
  document.getElementById('txCount').textContent = stats.monthTx.length;
  renderBudgets(stats.expensesByCategory, stats.totalBudget, stats.expenses);
  renderSavingsGoal(stats);
  updateCategorySelect();
  buildMonthOptions();

  document.getElementById('todayBtn').style.visibility = isCurrentMonth ? 'hidden' : 'visible';
}

function changeMonth(delta) {
  selectedMonth += delta;
  if (selectedMonth > 11) { selectedMonth = 0; selectedYear++; }
  if (selectedMonth < 0) { selectedMonth = 11; selectedYear--; }
  render();
}

function goToToday() {
  selectedYear = now.getFullYear();
  selectedMonth = now.getMonth();
  render();
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const data = { ...state, exportedAt: new Date().toISOString(), version: 1 };
  const filename = `gestion-budget-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}.json`;
  downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  showToast('Sauvegarde JSON téléchargée', 'success');
}

function exportCsv() {
  const header = 'Date;Type;Catégorie;Description;Montant (FCFA)';
  const rows = state.transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => {
      const cat = getCategory(t.categoryId);
      const desc = (t.description || '').replace(/;/g, ',');
      return `${t.date};${t.type === 'income' ? 'Revenu' : 'Dépense'};${cat?.name || ''};${desc};${t.amount}`;
    });
  const filename = `gestion-budget-transactions.csv`;
  downloadFile('\uFEFF' + [header, ...rows].join('\n'), filename, 'text/csv;charset=utf-8');
  showToast('Export CSV téléchargé', 'success');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.transactions || !data.categories) throw new Error('Format invalide');
      if (!confirm('Remplacer toutes vos données actuelles par la sauvegarde ?')) return;
      state = {
        transactions: data.transactions,
        categories: mergeCategories(data.categories),
        savingsGoals: data.savingsGoals ?? {},
      };
      saveState();
      render();
      document.getElementById('importStatus').textContent = `✅ ${state.transactions.length} transactions restaurées`;
      showToast('Sauvegarde restaurée avec succès', 'success');
    } catch (err) {
      document.getElementById('importStatus').textContent = '❌ Fichier invalide';
      showToast('Impossible de lire le fichier', 'error');
    }
  };
  reader.readAsText(file);
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
        b.classList.remove('type-toggle__btn--active', 'type-toggle__btn--expense', 'type-toggle__btn--income');
      });
      btn.classList.add('type-toggle__btn--active', `type-toggle__btn--${currentType}`);
      updateCategorySelect();
    });
  });
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

    state.transactions.unshift({ id: crypto.randomUUID(), type: currentType, amount, categoryId, description, date });
    saveState();
    document.getElementById('txAmount').value = '';
    document.getElementById('txDescription').value = '';

    const d = new Date(date + 'T12:00:00');
    selectedYear = d.getFullYear();
    selectedMonth = d.getMonth();
    render();
    showToast('Transaction ajoutée', 'success');
  });
}

function initMonthPicker() {
  document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
  document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
  document.getElementById('todayBtn').addEventListener('click', goToToday);
  document.getElementById('monthSelect').addEventListener('change', (e) => {
    const [y, m] = e.target.value.split('-').map(Number);
    selectedYear = y;
    selectedMonth = m;
    render();
  });
}

function initDataTab() {
  document.getElementById('exportJsonBtn').addEventListener('click', exportJson);
  document.getElementById('exportCsvBtn').addEventListener('click', exportCsv);
  document.getElementById('importJsonInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) importJson(file);
    e.target.value = '';
  });
}

function initSavingsGoal() {
  document.getElementById('savingsGoalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = parseFloat(document.getElementById('savingsGoalInput').value);
    const monthKey = getMonthKey(selectedYear, selectedMonth);
    if (isNaN(val) || val < 0) return;
    if (val === 0) {
      delete state.savingsGoals[monthKey];
    } else {
      state.savingsGoals[monthKey] = val;
    }
    saveState();
    render();
    showToast(val > 0 ? `Objectif fixé : ${formatCurrency(val)}` : 'Objectif supprimé', 'success');
  });
}

function initPWA() {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

initTabs();
initTypeToggle();
initForm();
initMonthPicker();
initDataTab();
initSavingsGoal();
initPWA();
render();

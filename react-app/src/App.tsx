import {
  ArrowDownRight,
  ArrowUpRight,
  LayoutDashboard,
  List,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, useBudget } from './hooks/useBudget'
import { BudgetProgress } from './components/BudgetProgress'
import { CategoryChart } from './components/CategoryChart'
import { Header } from './components/Header'
import { StatCard } from './components/StatCard'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'

type Tab = 'dashboard' | 'transactions' | 'budgets'

const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(
  new Date(),
)

function App() {
  const {
    transactions,
    categories,
    addTransaction,
    deleteTransaction,
    updateCategoryBudget,
    stats,
    getCategoryById,
  } = useBudget()

  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-sm text-slate-500 capitalize">{monthName}</p>
        </div>

        <nav className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-6 shadow-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Revenus"
                value={formatCurrency(stats.income)}
                icon={ArrowDownRight}
                variant="income"
                trend="Ce mois"
              />
              <StatCard
                title="Dépenses"
                value={formatCurrency(stats.expenses)}
                icon={ArrowUpRight}
                variant="expense"
                trend="Ce mois"
              />
              <StatCard
                title="Solde"
                value={formatCurrency(stats.balance)}
                icon={TrendingUp}
                variant="balance"
                trend={stats.balance >= 0 ? 'Positif' : 'Négatif'}
              />
              <StatCard
                title="Taux d'épargne"
                value={`${stats.savingsRate.toFixed(0)}%`}
                icon={PiggyBank}
                variant="default"
                trend={`Budget total: ${formatCurrency(stats.totalBudget)}`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Répartition des dépenses
                </h2>
                <CategoryChart expensesByCategory={stats.expensesByCategory} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Dernières transactions
                </h2>
                <TransactionList
                  transactions={stats.monthTransactions}
                  getCategory={getCategoryById}
                  onDelete={deleteTransaction}
                  limit={6}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TransactionForm categories={categories} onSubmit={addTransaction} />
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Historique ({transactions.length})
              </h2>
              <TransactionList
                transactions={transactions}
                getCategory={getCategoryById}
                onDelete={deleteTransaction}
              />
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Budgets par catégorie</h2>
              <p className="text-sm text-slate-500 mb-5">
                Modifiez les montants directement dans les champs à droite de chaque barre.
              </p>
              <BudgetProgress
                expensesByCategory={stats.expensesByCategory}
                onUpdateBudget={updateCategoryBudget}
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Vue d'ensemble</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Budget mensuel total</span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrency(stats.totalBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                  <span className="text-sm text-slate-600">Dépensé ce mois</span>
                  <span className="text-lg font-bold text-red-600">
                    {formatCurrency(stats.expenses)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                  <span className="text-sm text-slate-600">Reste disponible</span>
                  <span
                    className={`text-lg font-bold ${
                      stats.totalBudget - stats.expenses >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(stats.totalBudget - stats.expenses)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

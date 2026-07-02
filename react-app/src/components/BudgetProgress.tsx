import { formatCurrency } from '../hooks/useBudget'
import type { Category } from '../types'

interface BudgetProgressProps {
  expensesByCategory: { category: Category; spent: number }[]
  onUpdateBudget: (categoryId: string, limit: number) => void
}

export function BudgetProgress({ expensesByCategory, onUpdateBudget }: BudgetProgressProps) {
  const expenseCategories = expensesByCategory.filter((e) => e.category.budgetLimit !== undefined)

  if (expenseCategories.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-6">Aucun budget défini</p>
    )
  }

  return (
    <div className="space-y-4">
      {expenseCategories.map(({ category, spent }) => {
        const limit = category.budgetLimit ?? 0
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
        const isOver = spent > limit
        const remaining = limit - spent

        return (
          <div key={category.id}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-slate-700">{category.name}</span>
              </div>
              <span className="text-xs text-slate-500">
                {formatCurrency(spent)} / {formatCurrency(limit)}
              </span>
            </div>

            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOver ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1">
              <p className={`text-xs ${isOver ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                {isOver
                  ? `Dépassé de ${formatCurrency(Math.abs(remaining))}`
                  : `Reste ${formatCurrency(remaining)}`}
              </p>
              <input
                type="number"
                min="0"
                step="10"
                defaultValue={limit}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val) && val >= 0) onUpdateBudget(category.id, val)
                }}
                className="w-20 text-xs text-right px-2 py-0.5 rounded border border-slate-200 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                title="Modifier le budget"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

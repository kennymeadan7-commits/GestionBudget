import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../hooks/useBudget'
import type { Category, Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  getCategory: (id: string) => Category | undefined
  onDelete: (id: string) => void
  limit?: number
}

export function TransactionList({
  transactions,
  getCategory,
  onDelete,
  limit,
}: TransactionListProps) {
  const displayed = limit ? transactions.slice(0, limit) : transactions

  if (displayed.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">Aucune transaction pour le moment</p>
        <p className="text-xs mt-1">Ajoutez votre première transaction ci-dessus</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-100">
      {displayed.map((tx) => {
        const category = getCategory(tx.categoryId)
        const isIncome = tx.type === 'income'

        return (
          <li
            key={tx.id}
            className="flex items-center gap-3 py-3.5 group hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {isIncome ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {tx.description || category?.name || 'Sans description'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: category?.color ?? '#94a3b8' }}
                />
                <span className="text-xs text-slate-500">{category?.name}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">{formatDate(tx.date)}</span>
              </div>
            </div>

            <p
              className={`text-sm font-semibold shrink-0 ${
                isIncome ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(tx.amount)}
            </p>

            <button
              type="button"
              onClick={() => onDelete(tx.id)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
              aria-label="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

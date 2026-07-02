import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Category, TransactionType } from '../types'

interface TransactionFormProps {
  categories: Category[]
  onSubmit: (data: {
    type: TransactionType
    amount: number
    categoryId: string
    description: string
    date: string
  }) => void
}

export function TransactionForm({ categories, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const filteredCategories = categories.filter((c) => {
    const incomeIds = ['salary', 'commerce', 'transfert', 'mobile_in']
    if (type === 'income') return incomeIds.includes(c.id) || !c.budgetLimit
    return !incomeIds.includes(c.id) || c.budgetLimit !== undefined
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0 || !categoryId) return

    onSubmit({ type, amount: parsed, categoryId, description, date })
    setAmount('')
    setDescription('')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Nouvelle transaction</h2>

      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            type === 'expense'
              ? 'bg-red-500 text-white shadow-md shadow-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Dépense
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            type === 'income'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Revenu
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Montant (FCFA)</label>
          <input
            type="number"
            step="1"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 5000"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Catégorie</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white"
            required
          >
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Courses au marché, crédit MTN..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </form>
    </div>
  )
}

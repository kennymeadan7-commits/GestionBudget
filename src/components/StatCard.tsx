import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: string
  variant?: 'default' | 'income' | 'expense' | 'balance'
}

const variantStyles = {
  default: 'bg-white border-slate-200',
  income: 'bg-emerald-50 border-emerald-200',
  expense: 'bg-red-50 border-red-200',
  balance: 'bg-indigo-50 border-indigo-200',
}

const iconStyles = {
  default: 'bg-slate-100 text-slate-600',
  income: 'bg-emerald-100 text-emerald-600',
  expense: 'bg-red-100 text-red-600',
  balance: 'bg-indigo-100 text-indigo-600',
}

const valueStyles = {
  default: 'text-slate-900',
  income: 'text-emerald-700',
  expense: 'text-red-700',
  balance: 'text-indigo-700',
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${valueStyles[variant]}`}>{value}</p>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${iconStyles[variant]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

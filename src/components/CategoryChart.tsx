import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../hooks/useBudget'
import type { Category } from '../types'

interface CategoryChartProps {
  expensesByCategory: { category: Category; spent: number }[]
}

export function CategoryChart({ expensesByCategory }: CategoryChartProps) {
  const data = expensesByCategory
    .filter((e) => e.spent > 0)
    .map((e) => ({
      name: e.category.name,
      value: e.spent,
      color: e.category.color,
    }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Pas de dépenses ce mois-ci
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '13px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

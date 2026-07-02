import type { Transaction } from '../types'

const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo-1',
    type: 'income',
    amount: 2800,
    categoryId: 'salary',
    description: 'Salaire mensuel',
    date: `${year}-${month}-01`,
  },
  {
    id: 'demo-2',
    type: 'expense',
    amount: 850,
    categoryId: 'housing',
    description: 'Loyer',
    date: `${year}-${month}-03`,
  },
  {
    id: 'demo-3',
    type: 'expense',
    amount: 127.45,
    categoryId: 'food',
    description: 'Courses Carrefour',
    date: `${year}-${month}-05`,
  },
  {
    id: 'demo-4',
    type: 'expense',
    amount: 65,
    categoryId: 'transport',
    description: 'Abonnement métro',
    date: `${year}-${month}-05`,
  },
  {
    id: 'demo-5',
    type: 'expense',
    amount: 42.99,
    categoryId: 'entertainment',
    description: 'Netflix + Spotify',
    date: `${year}-${month}-08`,
  },
  {
    id: 'demo-6',
    type: 'expense',
    amount: 89.5,
    categoryId: 'food',
    description: 'Restaurant',
    date: `${year}-${month}-12`,
  },
  {
    id: 'demo-7',
    type: 'income',
    amount: 450,
    categoryId: 'freelance',
    description: 'Mission freelance',
    date: `${year}-${month}-15`,
  },
  {
    id: 'demo-8',
    type: 'expense',
    amount: 35,
    categoryId: 'health',
    description: 'Pharmacie',
    date: `${year}-${month}-18`,
  },
]

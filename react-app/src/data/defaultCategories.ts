import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salaire', color: '#10b981', budgetLimit: undefined },
  { id: 'freelance', name: 'Freelance', color: '#06b6d4', budgetLimit: undefined },
  { id: 'food', name: 'Alimentation', color: '#f59e0b', budgetLimit: 400 },
  { id: 'transport', name: 'Transport', color: '#6366f1', budgetLimit: 150 },
  { id: 'housing', name: 'Logement', color: '#8b5cf6', budgetLimit: 900 },
  { id: 'entertainment', name: 'Loisirs', color: '#ec4899', budgetLimit: 200 },
  { id: 'health', name: 'Santé', color: '#14b8a6', budgetLimit: 100 },
  { id: 'shopping', name: 'Shopping', color: '#f97316', budgetLimit: 150 },
  { id: 'other', name: 'Autre', color: '#64748b', budgetLimit: 100 },
]

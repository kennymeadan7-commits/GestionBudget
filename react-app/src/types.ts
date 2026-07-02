export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  color: string
  budgetLimit?: number
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  date: string
}

export interface BudgetState {
  transactions: Transaction[]
  categories: Category[]
}

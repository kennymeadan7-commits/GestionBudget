import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_CATEGORIES } from '../data/defaultCategories'
import { DEMO_TRANSACTIONS } from '../data/demoTransactions'
import type { BudgetState, Category, Transaction } from '../types'

const STORAGE_KEY = 'gestion-budget-data'

function loadState(): BudgetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as BudgetState
      return {
        transactions: parsed.transactions ?? [],
        categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      }
    }
  } catch {
    /* ignore corrupt data */
  }
  return { transactions: DEMO_TRANSACTIONS, categories: DEFAULT_CATEGORIES }
}

export function useBudget() {
  const [state, setState] = useState<BudgetState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addTransaction = useCallback(
    (data: Omit<Transaction, 'id'>) => {
      const transaction: Transaction = { ...data, id: crypto.randomUUID() }
      setState((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
      }))
    },
    [],
  )

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }))
  }, [])

  const updateCategoryBudget = useCallback((categoryId: string, budgetLimit: number) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.id === categoryId ? { ...c, budgetLimit } : c,
      ),
    }))
  }, [])

  const addCategory = useCallback((name: string, color: string) => {
    const category: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      budgetLimit: 0,
    }
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, category],
    }))
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthTransactions = state.transactions.filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const expensesByCategory = state.categories.map((cat) => {
      const spent = monthTransactions
        .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0)
      return { category: cat, spent }
    })

    const totalBudget = state.categories
      .filter((c) => c.budgetLimit !== undefined)
      .reduce((sum, c) => sum + (c.budgetLimit ?? 0), 0)

    return {
      income,
      expenses,
      balance: income - expenses,
      monthTransactions,
      expensesByCategory,
      totalBudget,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    }
  }, [state])

  const getCategoryById = useCallback(
    (id: string) => state.categories.find((c) => c.id === id),
    [state.categories],
  )

  return {
    transactions: state.transactions,
    categories: state.categories,
    addTransaction,
    deleteTransaction,
    updateCategoryBudget,
    addCategory,
    stats,
    getCategoryById,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

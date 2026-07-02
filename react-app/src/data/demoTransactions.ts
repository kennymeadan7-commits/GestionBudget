import type { Transaction } from '../types'

const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 'demo-1', type: 'income', amount: 250000, categoryId: 'salary', description: 'Salaire mensuel', date: `${year}-${month}-01` },
  { id: 'demo-2', type: 'expense', amount: 75000, categoryId: 'housing', description: 'Loyer mensuel', date: `${year}-${month}-03` },
  { id: 'demo-3', type: 'expense', amount: 18500, categoryId: 'food', description: 'Courses au marché Dantokpa', date: `${year}-${month}-05` },
  { id: 'demo-4', type: 'expense', amount: 3500, categoryId: 'transport', description: 'Zémidjans de la semaine', date: `${year}-${month}-06` },
  { id: 'demo-5', type: 'expense', amount: 5000, categoryId: 'communication', description: 'Crédit MTN MoMo', date: `${year}-${month}-07` },
  { id: 'demo-6', type: 'expense', amount: 15000, categoryId: 'utilities', description: 'Facture SBEE', date: `${year}-${month}-08` },
  { id: 'demo-7', type: 'expense', amount: 12000, categoryId: 'food', description: 'Repas maquis', date: `${year}-${month}-12` },
  { id: 'demo-8', type: 'income', amount: 45000, categoryId: 'commerce', description: 'Vente boutique', date: `${year}-${month}-15` },
  { id: 'demo-9', type: 'expense', amount: 8000, categoryId: 'health', description: 'Pharmacie', date: `${year}-${month}-18` },
  { id: 'demo-10', type: 'income', amount: 30000, categoryId: 'transfert', description: 'Transfert famille', date: `${year}-${month}-20` },
]

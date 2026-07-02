import type { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salaire', color: '#10b981' },
  { id: 'commerce', name: 'Commerce / Activité', color: '#06b6d4' },
  { id: 'transfert', name: 'Transfert (famille)', color: '#22c55e' },
  { id: 'mobile_in', name: 'Mobile Money reçu', color: '#facc15' },
  { id: 'food', name: 'Alimentation / Marché', color: '#f59e0b', budgetLimit: 120000 },
  { id: 'transport', name: 'Transport (zémi, taxi)', color: '#6366f1', budgetLimit: 40000 },
  { id: 'housing', name: 'Logement / Loyer', color: '#8b5cf6', budgetLimit: 80000 },
  { id: 'communication', name: 'Crédit téléphone', color: '#0ea5e9', budgetLimit: 15000 },
  { id: 'utilities', name: 'SBEE / SONEB', color: '#eab308', budgetLimit: 25000 },
  { id: 'education', name: 'Éducation / Scolarité', color: '#3b82f6', budgetLimit: 50000 },
  { id: 'health', name: 'Santé', color: '#14b8a6', budgetLimit: 20000 },
  { id: 'mobile_out', name: 'Mobile Money (frais)', color: '#facc15', budgetLimit: 10000 },
  { id: 'clothing', name: 'Habits / Vêtements', color: '#f97316', budgetLimit: 30000 },
  { id: 'entertainment', name: 'Loisirs', color: '#ec4899', budgetLimit: 25000 },
  { id: 'family', name: 'Famille / Entraide', color: '#a855f7', budgetLimit: 30000 },
  { id: 'other', name: 'Autre', color: '#64748b', budgetLimit: 20000 },
]

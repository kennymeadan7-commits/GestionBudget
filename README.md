# GestionBudget

Application web de gestion de budget personnelle, développée avec React, TypeScript et Vite.

## Fonctionnalités

- **Tableau de bord** — Vue d'ensemble des revenus, dépenses, solde et taux d'épargne du mois en cours
- **Transactions** — Ajout et suppression de revenus et dépenses par catégorie
- **Budgets** — Définition de limites par catégorie avec barres de progression
- **Graphiques** — Répartition des dépenses par catégorie (diagramme circulaire)
- **Persistance** — Données sauvegardées automatiquement dans le navigateur (localStorage)

## Démarrage

```bash
npm install
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

## Build de production

```bash
npm run build
npm run preview
```

## Stack technique

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Recharts (graphiques)
- Lucide React (icônes)

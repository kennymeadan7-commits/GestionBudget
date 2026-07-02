# GestionBudget

Application de gestion de budget personnelle.

## Version locale (HTML / CSS / JavaScript)

Ouvrez directement le fichier dans votre navigateur — **aucune installation requise** :

```
local/index.html
```

Ou depuis le terminal :

```bash
# Linux / macOS
xdg-open local/index.html    # Linux
open local/index.html        # macOS

# Windows
start local\index.html
```

### Fonctionnalités

- Tableau de bord (revenus, dépenses, solde, taux d'épargne)
- Ajout et suppression de transactions
- Budgets par catégorie avec barres de progression
- Graphique de répartition des dépenses
- Données sauvegardées dans le navigateur (localStorage)

### Fichiers

| Fichier | Rôle |
|---------|------|
| `local/index.html` | Structure de la page |
| `local/styles.css` | Mise en forme |
| `local/app.js` | Logique et persistance |

---

## Version React (optionnelle)

Une version React + Vite est aussi disponible à la racine du projet :

```bash
npm install
npm run dev
```

# GestionBudget

Application de gestion de budget personnelle en **HTML / CSS / JavaScript** — fonctionne sans installation.

## Windows — Démarrage rapide

### 1. Télécharger le projet

**Option A — Git :**
```cmd
cd C:\Users\DG
git clone https://github.com/kennymeadan7-commits/GestionBudget.git
cd GestionBudget
```

**Option B — ZIP :**
1. Allez sur https://github.com/kennymeadan7-commits/GestionBudget
2. Cliquez sur **Code** → **Download ZIP**
3. Extrayez le ZIP (ex. dans `C:\Users\DG\GestionBudget`)

### 2. Ouvrir l'application

**Méthode la plus simple :** double-cliquez sur `OUVRIR.bat`

**Ou en ligne de commande** (depuis le dossier du projet) :
```cmd
cd C:\Users\DG\GestionBudget
start index.html
```

> **Important :** la commande `start index.html` doit être lancée **depuis le dossier GestionBudget**, pas depuis `C:\Users\DG` seul.

## Fichiers principaux

| Fichier | Rôle |
|---------|------|
| `index.html` | Page principale |
| `styles.css` | Mise en forme |
| `app.js` | Logique et sauvegarde |
| `OUVRIR.bat` | Lance l'app en un clic (Windows) |

## Fonctionnalités

- Tableau de bord (revenus, dépenses, solde, taux d'épargne)
- Ajout et suppression de transactions
- Budgets par catégorie avec barres de progression
- Graphique de répartition des dépenses
- Données sauvegardées dans le navigateur (localStorage)

---

## Version React (optionnelle)

Une version React se trouve dans le dossier `react-app/` :

```bash
cd react-app
npm install
npm run dev
```

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-700 text-white shadow-lg shadow-emerald-200 text-lg">
          🇧🇯
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">GestionBudget</h1>
          <p className="text-xs text-slate-500">Bénin — Revenus et dépenses en FCFA</p>
        </div>
      </div>
    </header>
  )
}

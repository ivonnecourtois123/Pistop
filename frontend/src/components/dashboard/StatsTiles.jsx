export default function StatsTiles({
  stats,
  activeAgingFilter = null,
  onSelectAgingFilter = () => {},
}) {
  function handleToggleFilter(filterKey) {
    if (activeAgingFilter === filterKey) {
      onSelectAgingFilter(null);
    } else {
      onSelectAgingFilter(filterKey);
    }
  }

  return (
    <div className="w-full space-y-2 mb-6">
      {/* 5 Tarjetas Superiores: Refacciones y Clasificaciones de Rezagadas por Antigüedad */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Indicador # OR con refacciones cargadas */}
        <button
          type="button"
          onClick={() => handleToggleFilter('with_parts')}
          className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            activeAgingFilter === 'with_parts'
              ? 'border-blue-500 bg-blue-100/70 shadow-sm ring-2 ring-blue-400'
              : 'border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-100/40 shadow-2xs'
          }`}
          title="Clic para filtrar órdenes con refacciones"
        >
          <div className="flex items-start justify-between">
            <p className="font-label-caps text-[10px] text-blue-900 font-bold uppercase tracking-wider">
              # OR C/ REFACCIONES
            </p>
            <span className="material-symbols-outlined text-blue-600 text-xl" data-icon="inventory_2">
              inventory_2
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <p className="font-headline-md text-2xl font-black text-blue-900">
                {stats?.ordersWithParts ?? 0}
              </p>
              <span className="text-[11px] font-bold text-blue-700">órdenes</span>
            </div>
            <p className="text-[10px] text-blue-700/80 mt-0.5">Refacciones cargadas</p>
          </div>
        </button>

        {/* 2. Indicador Monto Total de esas Refacciones en $ MXN */}
        <div className="flex flex-col justify-between rounded-xl border border-emerald-300 bg-emerald-50/60 p-3.5 shadow-2xs ring-1 ring-emerald-200">
          <div className="flex items-start justify-between">
            <p className="font-label-caps text-[10px] text-emerald-900 font-bold uppercase tracking-wider">
              MONTO REFACCIONES ($)
            </p>
            <span className="material-symbols-outlined text-emerald-700 text-xl" data-icon="payments">
              payments
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <p className="font-data-mono text-xl font-black text-emerald-800">
                ${(stats?.partsAmount ?? 0).toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-emerald-900">MXN</span>
            </div>
            <p className="text-[10px] text-emerald-800/80 mt-0.5">Costo total en proceso</p>
          </div>
        </div>

        {/* 3. Clasificación Rezagadas: > 15 Días (15 a 30 días) */}
        <button
          type="button"
          onClick={() => handleToggleFilter('over15')}
          className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            activeAgingFilter === 'over15'
              ? 'border-amber-500 bg-amber-100 shadow-sm ring-2 ring-amber-400'
              : 'border-amber-200 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100/40 shadow-2xs'
          }`}
          title="Clic para filtrar órdenes con 15 a 30 días en taller"
        >
          <div className="flex items-start justify-between">
            <p className="font-label-caps text-[10px] text-amber-900 font-bold uppercase tracking-wider">
              REZAGADAS &gt; 15 DÍAS
            </p>
            <span className="material-symbols-outlined text-amber-600 text-xl" data-icon="timer">
              timer
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <p className="font-headline-md text-2xl font-black text-amber-900">
                {stats?.ordersOver15 ?? 0}
              </p>
              <span className="text-[11px] font-bold text-amber-700">órdenes</span>
            </div>
            <p className="text-[10px] text-amber-800/80 mt-0.5">15 a 30 días en taller</p>
          </div>
        </button>

        {/* 4. Clasificación Rezagadas: > 30 Días (31 a 60 días) */}
        <button
          type="button"
          onClick={() => handleToggleFilter('over30')}
          className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            activeAgingFilter === 'over30'
              ? 'border-orange-500 bg-orange-100 shadow-sm ring-2 ring-orange-400'
              : 'border-orange-200 bg-orange-50/50 hover:border-orange-400 hover:bg-orange-100/40 shadow-2xs'
          }`}
          title="Clic para filtrar órdenes con 31 a 60 días en taller"
        >
          <div className="flex items-start justify-between">
            <p className="font-label-caps text-[10px] text-orange-950 font-bold uppercase tracking-wider">
              REZAGADAS &gt; 30 DÍAS
            </p>
            <span className="material-symbols-outlined text-orange-600 text-xl" data-icon="warning">
              warning
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <p className="font-headline-md text-2xl font-black text-orange-900">
                {stats?.ordersOver30 ?? 0}
              </p>
              <span className="text-[11px] font-bold text-orange-700">órdenes</span>
            </div>
            <p className="text-[10px] text-orange-800/80 mt-0.5">31 a 60 días • Atención</p>
          </div>
        </button>

        {/* 5. Clasificación Rezagadas: > 60 Días (Críticas) */}
        <button
          type="button"
          onClick={() => handleToggleFilter('over60')}
          className={`group flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
            activeAgingFilter === 'over60'
              ? 'border-rose-500 bg-rose-100 shadow-sm ring-2 ring-rose-400'
              : 'border-rose-200 bg-rose-50/60 hover:border-rose-400 hover:bg-rose-100/40 shadow-2xs'
          }`}
          title="Clic para filtrar órdenes críticas con más de 60 días"
        >
          <div className="flex items-start justify-between">
            <p className="font-label-caps text-[10px] text-rose-950 font-bold uppercase tracking-wider">
              REZAGADAS &gt; 60 DÍAS
            </p>
            <span className="material-symbols-outlined text-rose-600 text-xl" data-icon="crisis_alert">
              crisis_alert
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <p className="font-headline-md text-2xl font-black text-rose-900">
                {stats?.ordersOver60 ?? 0}
              </p>
              <span className="text-[11px] font-bold text-rose-700">órdenes</span>
            </div>
            <p className="text-[10px] text-rose-800/80 mt-0.5">Meta: máx 1 • Críticas</p>
          </div>
        </button>
      </div>

      {/* Chip de filtro activo */}
      {activeAgingFilter && (
        <div className="flex items-center justify-between rounded-lg bg-slate-100 border border-outline-variant/60 px-3 py-1.5 text-xs text-primary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">filter_alt</span>
            <span className="font-bold">
              Filtro aplicado:
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-[11px] text-primary">
              {activeAgingFilter === 'with_parts' && 'Órdenes con refacciones cargadas'}
              {activeAgingFilter === 'over15' && 'Órdenes de 15 a 30 días'}
              {activeAgingFilter === 'over30' && 'Órdenes de 31 a 60 días'}
              {activeAgingFilter === 'over60' && 'Órdenes críticas con más de 60 días'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectAgingFilter(null)}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold text-error hover:bg-error-container/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">close</span>
            Quitar filtro
          </button>
        </div>
      )}
    </div>
  );
}

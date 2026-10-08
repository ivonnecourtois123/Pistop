import { useEffect, useState } from 'react';
import { getCapacity } from '../../api/capacity.js';

function utilizationColorClass(utilization) {
  if (utilization == null) return 'text-on-surface-variant';
  if (utilization > 1) return 'text-rose-600';
  if (utilization >= 0.85) return 'text-amber-600';
  return 'text-emerald-700';
}

function formatPercent(utilization) {
  if (utilization == null) return 'Sin datos';
  return `${Math.round(utilization * 100)}%`;
}

export default function CapacityPanel({ team, refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [showTechBreakdown, setShowTechBreakdown] = useState(false);

  useEffect(() => {
    getCapacity(team)
      .then(setData)
      .catch(() => setError('No se pudo cargar la capacidad del taller.'));
  }, [team, refreshKey]);

  if (error) return <p className="mt-4 text-sm text-error">{error}</p>;
  if (!data) return null;

  const isHyp = team === 'HYP';
  const colorClass = utilizationColorClass(data.utilization);

  // SERVICIO Metrics
  const capacityHours = data.capacityHours ?? 0;
  const carryoverHours = data.carryoverHours ?? 0;
  const todayDemandHours = data.todayDemandHours ?? 0;
  const demandHours = data.demandHours ?? (carryoverHours + todayDemandHours);
  const availableHours = data.availableHours ?? Math.max(0, capacityHours - demandHours);

  const carryoverCount = data.carryoverCount ?? 0;
  const todayDemandCount = data.todayDemandCount ?? 0;

  // Porcentajes para la barra segmentada
  const carryoverPct = capacityHours > 0 ? Math.min(100, (carryoverHours / capacityHours) * 100) : 0;
  const todayPct = capacityHours > 0 ? Math.min(100 - carryoverPct, (todayDemandHours / capacityHours) * 100) : 0;
  const freePct = Math.max(0, 100 - (carryoverPct + todayPct));

  // HYP Metrics
  const capacityUnits = data.capacityUnits ?? 0;
  const carryoverUnits = data.carryoverUnits ?? 0;
  const todayUnits = data.todayUnits ?? 0;
  const demandUnits = data.demandUnits ?? (carryoverUnits + todayUnits);
  const availableUnits = data.availableUnits ?? Math.max(0, capacityUnits - demandUnits);

  const hypCarryoverPct = capacityUnits > 0 ? Math.min(100, (carryoverUnits / capacityUnits) * 100) : 0;
  const hypTodayPct = capacityUnits > 0 ? Math.min(100 - hypCarryoverPct, (todayUnits / capacityUnits) * 100) : 0;
  const hypFreePct = Math.max(0, 100 - (hypCarryoverPct + hypTodayPct));

  return (
    <div className="mt-2 w-full rounded-2xl border border-outline-variant bg-white p-4.5 shadow-2xs">
      {/* Fila Superior: Encabezado y Métricas Principales */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">
              {isHyp ? 'speed' : 'hourglass_top'}
            </span>
          </span>
          <div>
            <p className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              OCUPACIÓN DE MANO DE OBRA (MO)
            </p>
            <div className="flex items-baseline gap-2">
              <p className={`font-headline-md text-2xl font-black ${colorClass}`}>
                {formatPercent(data.utilization)}
              </p>
              <span className={`text-xs font-bold ${colorClass}`}>
                {data.utilization > 1
                  ? `⚠️ Taller Saturado (+${(demandHours - capacityHours).toFixed(1)} h exceso)`
                  : data.utilization >= 0.85
                  ? `⚡ Alta Ocupación • ${availableHours.toFixed(1)} h libres (${Math.round(freePct)}%)`
                  : `🟢 Capacidad Disponible • ${availableHours.toFixed(1)} h libres (${Math.round(freePct)}%)`}
              </span>
            </div>
          </div>
        </div>

        {isHyp ? (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-on-surface-variant">
            {/* Técnicos */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Técnicos</span>
              <span className="font-headline-md text-sm font-black text-primary">{data.technicianCount} activos</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Cupo Total */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Cupo Total</span>
              <span className="font-data-mono text-sm font-bold text-primary">{capacityUnits} unidades</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Carga Arrastrada */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-amber-600">alarm</span>
                De Días Anteriores
              </span>
              <span className="font-data-mono text-sm font-bold text-amber-700">{carryoverUnits} unidades</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Nuevas Hoy */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">Nuevas Hoy</span>
              <span className="font-data-mono text-sm font-bold text-primary">{todayUnits} unidades</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Cupo Disponible */}
            <div className="flex flex-col sm:items-end rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1 shadow-2xs ring-1 ring-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-emerald-700">check_circle</span>
                Cupo Disponible
              </span>
              <span className="font-headline-md text-sm font-black text-emerald-700">
                {availableUnits} unidades ({Math.round(hypFreePct)}% libre)
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs text-on-surface-variant">
            {/* Técnicos */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Técnicos</span>
              <span className="font-headline-md text-sm font-black text-primary">{data.technicianCount ?? 0} activos</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Capacidad Total */}
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Capacidad Total</span>
              <span className="font-data-mono text-sm font-bold text-primary">{capacityHours.toFixed(1)} h/día</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Carga Arrastrada */}
            <div className="flex flex-col sm:items-end bg-amber-50/70 border border-amber-200/80 rounded-lg px-2 py-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-amber-700">inventory_2</span>
                Arrastre de Ayer
              </span>
              <span className="font-data-mono text-sm font-bold text-amber-800">
                {carryoverHours.toFixed(1)} h <span className="text-[10px] font-normal">({carryoverCount} ord)</span>
              </span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Programadas Hoy */}
            <div className="flex flex-col sm:items-end bg-blue-50/70 border border-blue-200/80 rounded-lg px-2 py-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-blue-700">event_available</span>
                Trabajo Hoy
              </span>
              <span className="font-data-mono text-sm font-bold text-blue-800">
                {todayDemandHours.toFixed(1)} h <span className="text-[10px] font-normal">({todayDemandCount} ord)</span>
              </span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />

            {/* Tiempo Disponible Restante */}
            <div className="flex flex-col sm:items-end rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1 shadow-2xs ring-1 ring-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-emerald-700">schedule</span>
                Tiempo Disponible
              </span>
              <span className="font-headline-md text-sm font-black text-emerald-700">
                {availableHours.toFixed(1)} h libres ({Math.round(freePct)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BARRA VISUAL DE DISTRIBUCIÓN DE CAPACIDAD CON GUÍAS SOBRE LAS BARRAS */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant">
          <span className="font-label-caps uppercase tracking-wider text-[10px] text-on-surface-variant font-bold">
            DISTRIBUCIÓN DE LA JORNADA
          </span>
        </div>

        {/* Progress bar con guías / texto directamente sobre las barras */}
        <div className="h-7 w-full overflow-hidden rounded-xl bg-surface-container-high flex shadow-inner border border-outline-variant/40">
          {isHyp ? (
            <>
              <div
                style={{ width: `${hypCarryoverPct}%` }}
                className="bg-amber-500 flex items-center justify-center px-2 text-white transition-all duration-500 overflow-hidden"
                title={`Carga de días anteriores: ${carryoverUnits} unidades (${Math.round(hypCarryoverPct)}%)`}
              >
                {hypCarryoverPct > 10 && (
                  <span className="truncate text-[11px] font-extrabold whitespace-nowrap drop-shadow-xs">
                    📦 Arrastre: {carryoverUnits} un. ({Math.round(hypCarryoverPct)}%)
                  </span>
                )}
              </div>
              <div
                style={{ width: `${hypTodayPct}%` }}
                className="bg-blue-600 flex items-center justify-center px-2 text-white transition-all duration-500 overflow-hidden"
                title={`Nuevas de hoy: ${todayUnits} unidades (${Math.round(hypTodayPct)}%)`}
              >
                {hypTodayPct > 10 && (
                  <span className="truncate text-[11px] font-extrabold whitespace-nowrap drop-shadow-xs">
                    📅 Hoy: {todayUnits} un. ({Math.round(hypTodayPct)}%)
                  </span>
                )}
              </div>
              <div
                style={{ width: `${hypFreePct}%` }}
                className="bg-emerald-600 flex items-center justify-center px-2 text-white transition-all duration-500 overflow-hidden"
                title={`Cupo disponible: ${availableUnits} unidades libres (${Math.round(hypFreePct)}%)`}
              >
                {hypFreePct > 10 && (
                  <span className="truncate text-[11px] font-extrabold whitespace-nowrap drop-shadow-xs">
                    🟢 Libre: {availableUnits} un. ({Math.round(hypFreePct)}%)
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div
                style={{ width: `${carryoverPct}%` }}
                className="bg-amber-500 flex items-center justify-center px-2 text-white transition-all duration-500 overflow-hidden"
                title={`Carga arrastrada de ayer: ${carryoverHours.toFixed(1)} h (${Math.round(carryoverPct)}%)`}
              >
                {carryoverPct > 10 && (
                  <span className="truncate text-[11px] font-extrabold whitespace-nowrap drop-shadow-xs">
                    📦 Arrastre: {carryoverHours.toFixed(1)} h ({Math.round(carryoverPct)}%)
                  </span>
                )}
              </div>
              <div
                style={{ width: `${todayPct}%` }}
                className="bg-blue-600 flex items-center justify-center px-2 text-white transition-all duration-500 overflow-hidden"
                title={`Programadas para hoy: ${todayDemandHours.toFixed(1)} h (${Math.round(todayPct)}%)`}
              >
                {todayPct > 10 && (
                  <span className="truncate text-[11px] font-extrabold whitespace-nowrap drop-shadow-xs">
                    📅 Hoy: {todayDemandHours.toFixed(1)} h ({Math.round(todayPct)}%)
                  </span>
                )}
              </div>
              <div
                style={{ width: `${freePct}%` }}
                className="bg-emerald-600 flex items-center justify-center px-2 text-white transition-all duration-500 overflow-hidden"
                title={`Tiempo libre disponible: ${availableHours.toFixed(1)} h (${Math.round(freePct)}%)`}
              >
                {freePct > 10 && (
                  <span className="truncate text-[11px] font-extrabold whitespace-nowrap drop-shadow-xs">
                    🟢 Libre: {availableHours.toFixed(1)} h ({Math.round(freePct)}%)
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* DESGLOSE POR TÉCNICO (SERVICIO) */}
      {!isHyp && data.technicianBreakdown && data.technicianBreakdown.length > 0 && (
        <div className="mt-3.5 border-t border-outline-variant/60 pt-2.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowTechBreakdown((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {showTechBreakdown ? 'expand_less' : 'expand_more'}
              </span>
              <span>{showTechBreakdown ? 'Ocultar' : 'Ver'} balance de jornada por técnico ({data.technicianBreakdown.length})</span>
            </button>
            <span className="text-[10px] font-label-caps text-on-surface-variant font-medium">
              Turno base: {data.hoursPerDay ?? 8}h/día por técnico
            </span>
          </div>

          {showTechBreakdown && (
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {data.technicianBreakdown.map((tech) => {
                const isOver = tech.isOverloaded;
                const techPct = Math.round(tech.utilization * 100);
                const techCarryoverPct = tech.capacityHours > 0 ? Math.min(100, (tech.carryoverHours / tech.capacityHours) * 100) : 0;
                const techTodayPct = tech.capacityHours > 0 ? Math.min(100 - techCarryoverPct, (tech.todayHours / tech.capacityHours) * 100) : 0;
                const techFreePct = Math.max(0, 100 - (techCarryoverPct + techTodayPct));

                return (
                  <div
                    key={tech.id}
                    className={`rounded-xl border p-2.5 transition-all shadow-2xs ${
                      isOver
                        ? 'border-rose-300 bg-rose-50/50'
                        : tech.utilization >= 0.85
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-outline-variant bg-surface-container-lowest'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-headline-md text-xs font-bold text-primary truncate" title={tech.name}>
                        {tech.name}
                      </span>
                      <span
                        className={`font-label-caps text-[10px] font-black rounded px-1.5 py-0.5 ${
                          isOver
                            ? 'bg-rose-600 text-white'
                            : tech.utilization >= 0.85
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {techPct}%
                      </span>
                    </div>

                    {/* Barra mini */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high flex mb-2">
                      <div style={{ width: `${techCarryoverPct}%` }} className="bg-amber-500" />
                      <div style={{ width: `${techTodayPct}%` }} className="bg-blue-500" />
                      <div style={{ width: `${techFreePct}%` }} className="bg-emerald-500" />
                    </div>

                    <div className="space-y-0.5 text-[10px] font-data-mono">
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Ocupado:</span>
                        <span className="font-bold text-primary">{tech.assignedHours.toFixed(1)} h ({tech.ordersCount} ord)</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-semibold">
                        <span>Disponible:</span>
                        <span>{tech.availableHours.toFixed(1)} h libres</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!isHyp && data.unclassifiedCount > 0 && (
        <p className="mt-2.5 pt-2 border-t border-outline-variant/50 font-label-caps text-[10px] text-on-surface-variant">
          ⚠️ {data.unclassifiedCount} orden(es) en proceso sin &quot;Tipo de servicio&quot; clasificado — no se contaron en la demanda.
        </p>
      )}
    </div>
  );
}

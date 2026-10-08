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

  useEffect(() => {
    getCapacity(team)
      .then(setData)
      .catch(() => setError('No se pudo cargar la capacidad del taller.'));
  }, [team, refreshKey]);

  if (error) return <p className="mt-4 text-sm text-error">{error}</p>;
  if (!data) return null;

  const isHyp = team === 'HYP';
  const colorClass = utilizationColorClass(data.utilization);

  // Cálculo del tiempo libre / disponible restante
  const capacityHours = data.capacityHours ?? 0;
  const demandHours = data.demandHours ?? 0;
  const availableHours = Math.max(0, capacityHours - demandHours);

  const capacityUnits = data.capacityUnits ?? 0;
  const demandUnits = data.demandUnits ?? 0;
  const availableUnits = Math.max(0, capacityUnits - demandUnits);

  return (
    <div className="mt-2 w-full rounded-2xl border border-outline-variant bg-white p-4 shadow-2xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-xl">
              {isHyp ? 'speed' : 'hourglass_top'}
            </span>
          </span>
          <div>
            <p className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              CAPACIDAD Y TIEMPO DEL TALLER
            </p>
            <div className="flex items-baseline gap-2">
              <p className={`font-headline-md text-2xl font-black ${colorClass}`}>
                {formatPercent(data.utilization)}
              </p>
              <span className="text-xs font-bold text-on-surface-variant">
                {data.utilization > 1 ? 'Saturado' : data.utilization >= 0.85 ? 'Alta ocupación' : 'Ocupación'}
              </span>
            </div>
          </div>
        </div>

        {isHyp ? (
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-on-surface-variant">
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Técnicos</span>
              <span className="font-headline-md text-sm font-black text-primary">{data.technicianCount} activos</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Cupo Total</span>
              <span className="font-data-mono text-sm font-bold text-primary">{capacityUnits} unidades</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">En Proceso</span>
              <span className="font-data-mono text-sm font-bold text-amber-700">{demandUnits} unidades</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="flex flex-col sm:items-end rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-emerald-700">check_circle</span>
                Cupo Disponible
              </span>
              <span className="font-headline-md text-sm font-black text-emerald-700">{availableUnits} unidades libres</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-on-surface-variant">
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Técnicos</span>
              <span className="font-headline-md text-sm font-black text-primary">{data.technicianCount ?? 0} activos</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Capacidad Total</span>
              <span className="font-data-mono text-sm font-bold text-primary">{capacityHours.toFixed(1)} h/día</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">Tiempo Ocupado</span>
              <span className="font-data-mono text-sm font-bold text-amber-700">{demandHours.toFixed(1)} h demandadas</span>
            </div>
            <div className="h-7 w-px bg-outline-variant/60 hidden sm:block" />
            <div className="flex flex-col sm:items-end rounded-xl bg-emerald-50 border border-emerald-300 px-3 py-1 shadow-2xs ring-1 ring-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-emerald-700">schedule</span>
                Tiempo Disponible
              </span>
              <span className="font-headline-md text-sm font-black text-emerald-700">{availableHours.toFixed(1)} h libres</span>
            </div>
          </div>
        )}
      </div>

      {!isHyp && data.unclassifiedCount > 0 && (
        <p className="mt-2.5 pt-2 border-t border-outline-variant/50 font-label-caps text-[10px] text-on-surface-variant">
          ⚠️ {data.unclassifiedCount} orden(es) en proceso sin &quot;Tipo de servicio&quot; clasificado — no se contaron en la demanda.
        </p>
      )}
    </div>
  );
}

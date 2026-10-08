import { useEffect, useState } from 'react';
import { getExecutiveKpisReport } from '../../api/workOrders.js';
import Spinner from '../common/Spinner.jsx';

function formatHoursToDaysAndHours(hours) {
  if (hours == null) return '0 h';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} h`;
  const days = Math.floor(hours / 24);
  const restHours = Math.round(hours - days * 24);
  return `${days} d ${restHours} h`;
}

export default function ExecutiveKpiDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getExecutiveKpisReport()
      .then(setData)
      .catch(() => setError('No se pudieron cargar los indicadores ejecutivos.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-error bg-error-container/30 p-4 text-sm text-on-error-container">
        {error || 'Sin datos disponibles.'}
      </div>
    );
  }

  const categoryLabels = {
    MANTENIMIENTO: 'Mantenimiento Periódico',
    DIAGNOSTICO_FALLA_RECLAMO: 'Diagnóstico y Fallas',
    PREVIA: 'Previas / Alistamiento',
    SIN_CLASIFICAR: 'Sin clasificar',
  };

  return (
    <div className="space-y-6">
      {/* 4 KPIs Clave Superiores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="flex items-center justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant">TPE SERVICIO MECÁNICO</p>
            <span className="material-symbols-outlined text-primary" data-icon="timer">timer</span>
          </div>
          <p className="mt-2 font-headline-lg text-3xl font-black text-primary">
            {formatHoursToDaysAndHours(data.tpeServicioHours)}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">Tiempo Promedio de Estadía</p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="flex items-center justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant">TPE HOJALATERÍA Y PINTURA</p>
            <span className="material-symbols-outlined text-secondary" data-icon="car_crash">car_crash</span>
          </div>
          <p className="mt-2 font-headline-lg text-3xl font-black text-secondary">
            {formatHoursToDaysAndHours(data.tpeHypHours)}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">Ciclo total de reparación HYP</p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="flex items-center justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant">ÓRDENES EN PROCESO</p>
            <span className="material-symbols-outlined text-emerald-600" data-icon="precision_manufacturing">precision_manufacturing</span>
          </div>
          <p className="mt-2 font-headline-lg text-3xl font-black text-primary">
            {data.totalInProgress}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {data.servicioInProgressCount} Servicio • {data.hypInProgressCount} HYP
          </p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="flex items-center justify-between">
            <p className="font-label-caps text-[10px] text-on-surface-variant">ÓRDENES ENTREGADAS TOTAL</p>
            <span className="material-symbols-outlined text-blue-600" data-icon="verified">verified</span>
          </div>
          <p className="mt-2 font-headline-lg text-3xl font-black text-primary">
            {data.totalDelivered}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">Histórico de vehículos entregados</p>
        </div>
      </div>

      {/* Distribución por Categoría de Trabajo & Estatus en Taller */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline-md text-sm font-bold text-primary">
              📋 Distribución por Categoría de Servicio (En Proceso)
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(data.categoriesCount).map(([cat, count]) => {
              const pct = data.totalInProgress > 0 ? Math.round((count / data.totalInProgress) * 100) : 0;
              const isUnclassified = cat === 'SIN_CLASIFICAR';
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-semibold ${isUnclassified ? 'text-amber-700' : 'text-primary'}`}>
                      {categoryLabels[cat] || cat} {isUnclassified && '⚠️'}
                    </span>
                    <span className="font-data-mono font-bold text-on-surface-variant">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isUnclassified ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-headline-md text-sm font-bold text-primary">
              ⚡ Ocupación por Estatus de Taller
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(data.statusCounts).map(([status, count]) => {
              const pct = data.totalInProgress > 0 ? Math.round((count / data.totalInProgress) * 100) : 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-primary">{status}</span>
                    <span className="font-data-mono font-bold text-on-surface-variant">
                      {count} órdenes ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full rounded-full bg-secondary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getProductivityReport } from '../../api/workOrders.js';
import Spinner from '../common/Spinner.jsx';

const PERIOD_OPTIONS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Esta Semana' },
  { key: 'month', label: 'Este Mes' },
  { key: 'all', label: 'Todo el Historial' },
];

export default function ProductivityReport({ agencyFilter = 'ALL', brandFilter = 'ALL' }) {
  const [orderType, setOrderType] = useState('SERVICIO');
  const [period, setPeriod] = useState('month');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getProductivityReport({
      orderType,
      period,
      agency: agencyFilter !== 'ALL' ? agencyFilter : undefined,
    })
      .then(setReport)
      .catch(() => setError('No se pudo cargar el reporte de rendimiento operativo.'))
      .finally(() => setLoading(false));
  }, [orderType, period, agencyFilter]);

  function getEfficiencyBadge(eff) {
    if (eff == null) return <span className="text-on-surface-variant text-xs">Sin datos</span>;
    if (eff >= 100) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 border border-emerald-300">
          <span>{eff}%</span>
          <span className="text-[10px]">🔥 Óptimo</span>
        </span>
      );
    }
    if (eff >= 85) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-black text-blue-800 border border-blue-300">
          <span>{eff}%</span>
          <span className="text-[10px]">✓ En Meta</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 border border-amber-300">
        <span>{eff}%</span>
        <span className="text-[10px]">⚠️ Desfase</span>
      </span>
    );
  }

  function getWashBadge(minutes) {
    if (!minutes) return <span className="text-on-surface-variant text-xs">—</span>;
    if (minutes <= 90) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
          {minutes} min (Meta cumplida)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
        {minutes} min (+{minutes - 90}m excedido)
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector Superior: Separación Estricta Servicio vs HYP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderType('SERVICIO')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-headline-md text-xs font-bold transition-all cursor-pointer ${
              orderType === 'SERVICIO'
                ? 'bg-primary text-white shadow-md ring-2 ring-primary/20'
                : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-lg">build</span>
            <span>Rendimiento Servicio Mecánico</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderType('HYP')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-headline-md text-xs font-bold transition-all cursor-pointer ${
              orderType === 'HYP'
                ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500/20'
                : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-lg">car_repair</span>
            <span>Rendimiento HYP (Carrocería y Pintura)</span>
          </button>
        </div>

        {/* Filtro de Período */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setPeriod(opt.key)}
              className={`rounded-lg px-3 py-1 font-label-caps text-[11px] font-bold transition-colors cursor-pointer ${
                period === opt.key
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error bg-error-container/30 px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : report ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Tarjetas de Resumen Ejecutivo de Rendimiento */}
          {orderType === 'SERVICIO' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Órdenes Concluidas
                </span>
                <p className="mt-1 font-data-mono text-2xl font-black text-primary">
                  {report.summary?.totalCompletedOrders || 0}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  En el período seleccionado
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Horas Vendidas vs Reales
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-data-mono text-2xl font-black text-emerald-700">
                    {report.summary?.totalSoldHours || 0}h
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    / {report.summary?.totalRealHours || 0}h inv.
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Estándar vs tiempo en taller
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Eficiencia Global Taller
                </span>
                <div className="mt-1">
                  {getEfficiencyBadge(report.summary?.globalEfficiency)}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  (Horas vendidas ÷ horas reales)
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Productividad Lavado
                </span>
                <p className="mt-1 font-data-mono text-2xl font-black text-blue-900">
                  {report.summary?.totalWashedOrders || 0} <span className="text-sm font-bold text-slate-500">autos</span>
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Promedio: <strong>{report.summary?.avgWashMinutes || 0} min</strong> / auto (Meta 90m)
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Unidades HYP Concluidas
                </span>
                <p className="mt-1 font-data-mono text-2xl font-black text-emerald-800">
                  {report.summary?.totalCompletedOrders || 0}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Entregadas o terminadas en carrocería
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Estadía Promedio en Taller
                </span>
                <p className="mt-1 font-data-mono text-2xl font-black text-primary">
                  {report.summary?.avgStayDays || 0} <span className="text-sm font-bold text-slate-500">días</span>
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Lead time desde ingreso a entrega
                </p>
              </div>

              <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
                <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant">
                  Cumplimiento de Promesa
                </span>
                <p className="mt-1 font-data-mono text-2xl font-black text-primary">
                  {report.summary?.globalOnTimeRate || 100}%
                </p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Unidades entregadas en o antes de la fecha pactada
                </p>
              </div>
            </div>
          )}

          {/* TABLA 1: Rendimiento por Técnico */}
          <div className="rounded-2xl border border-outline-variant bg-white shadow-xs overflow-hidden">
            <div className="border-b border-outline-variant bg-surface-container-low px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">engineering</span>
                <h3 className="font-headline-md text-sm font-bold text-primary">
                  {orderType === 'SERVICIO' ? 'Rendimiento por Técnico Mecánico' : 'Rendimiento por Técnico de Carrocería / HYP'}
                </h3>
              </div>
              <span className="font-label-caps text-xs text-on-surface-variant">
                {report.technicians?.length || 0} técnicos analizados
              </span>
            </div>

            {(!report.technicians || report.technicians.length === 0) ? (
              <p className="p-8 text-center text-xs text-on-surface-variant">
                No hay técnicos registrados o con actividad en este período.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant">
                      <th className="px-4 py-3 font-semibold">Técnico</th>
                      <th className="px-4 py-3 font-semibold">Especialidad / Rol</th>
                      <th className="px-4 py-3 font-semibold text-center">Órdenes Concluidas</th>
                      <th className="px-4 py-3 font-semibold text-center">En Proceso</th>
                      {orderType === 'SERVICIO' ? (
                        <>
                          <th className="px-4 py-3 font-semibold text-center">Horas Vendidas</th>
                          <th className="px-4 py-3 font-semibold text-center">Horas Reales</th>
                          <th className="px-4 py-3 font-semibold text-center">Promedio (h/auto)</th>
                          <th className="px-4 py-3 font-semibold text-center">Eficiencia</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 font-semibold text-center">Días Acumulados</th>
                          <th className="px-4 py-3 font-semibold text-center">Promedio (días/auto)</th>
                          <th className="px-4 py-3 font-semibold text-center">Puntualidad</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {report.technicians.map((tech) => (
                      <tr key={tech.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                              {tech.name.charAt(0)}
                            </span>
                            <div>
                              <p className="font-bold text-primary text-xs">{tech.name}</p>
                              {!tech.active && (
                                <span className="text-[9px] text-amber-700 font-medium">Inactivo en catálogo</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant font-medium">
                          {tech.specialty || 'General'}
                        </td>
                        <td className="px-4 py-3 text-center font-data-mono font-bold text-primary">
                          {tech.completedOrders}
                        </td>
                        <td className="px-4 py-3 text-center font-data-mono text-slate-500">
                          {tech.inProgressOrders}
                        </td>
                        {orderType === 'SERVICIO' ? (
                          <>
                            <td className="px-4 py-3 text-center font-data-mono font-bold text-emerald-800">
                              {tech.soldHours} h
                            </td>
                            <td className="px-4 py-3 text-center font-data-mono text-slate-700">
                              {tech.realHours} h
                            </td>
                            <td className="px-4 py-3 text-center font-data-mono text-slate-700">
                              {tech.avgHoursPerOrder} h
                            </td>
                            <td className="px-4 py-3 text-center">
                              {getEfficiencyBadge(tech.efficiency)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-center font-data-mono font-bold text-primary">
                              {tech.totalDays} d
                            </td>
                            <td className="px-4 py-3 text-center font-data-mono text-slate-700">
                              {tech.avgDaysPerOrder} d
                            </td>
                            <td className="px-4 py-3 text-center font-data-mono font-bold text-emerald-800">
                              {tech.onTimeRate}%
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TABLA 2: Rendimiento por Lavador (Exclusivo de Servicio) */}
          {orderType === 'SERVICIO' && (
            <div className="rounded-2xl border border-outline-variant bg-white shadow-xs overflow-hidden">
              <div className="border-b border-outline-variant bg-blue-50/60 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚿</span>
                  <div>
                    <h3 className="font-headline-md text-sm font-bold text-blue-950">
                      Rendimiento por Lavador (Bahías de Detallado)
                    </h3>
                    <p className="text-[11px] text-blue-800">
                      Medición de tiempos reales en la etapa de Lavado vs. Meta estándar de 90 minutos (1.5 h)
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-xs text-blue-900 font-bold">
                  {report.washers?.length || 0} lavadores analizados
                </span>
              </div>

              {(!report.washers || report.washers.length === 0) ? (
                <p className="p-8 text-center text-xs text-on-surface-variant">
                  No hay lavadores con órdenes procesadas en este período.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant">
                        <th className="px-4 py-3 font-semibold">Lavador</th>
                        <th className="px-4 py-3 font-semibold">Bahía / Rol</th>
                        <th className="px-4 py-3 font-semibold text-center">Autos Lavados</th>
                        <th className="px-4 py-3 font-semibold text-center">Horas Reales</th>
                        <th className="px-4 py-3 font-semibold text-center">Tiempo Promedio por Auto</th>
                        <th className="px-4 py-3 font-semibold text-center">Cumplimiento Meta (&le; 90 min)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {report.washers.map((washer) => (
                        <tr key={washer.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                                🚿
                              </span>
                              <div>
                                <p className="font-bold text-primary text-xs">{washer.name}</p>
                                {!washer.active && (
                                  <span className="text-[9px] text-amber-700 font-medium">Inactivo</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-on-surface-variant font-medium">
                            {washer.specialty || 'Bahía de Lavado'}
                          </td>
                          <td className="px-4 py-3 text-center font-data-mono font-bold text-blue-900">
                            {washer.washedOrders}
                          </td>
                          <td className="px-4 py-3 text-center font-data-mono text-slate-700">
                            {washer.realHours} h
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getWashBadge(washer.avgMinutesPerWash)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              washer.complianceRate >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {washer.complianceRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

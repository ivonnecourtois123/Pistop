import { useEffect, useState } from 'react';
import { getStageDurationsReport } from '../../api/workOrders.js';
import { getStages, ORDER_TYPE_LABELS } from '../../constants/stages.js';
import Spinner from '../common/Spinner.jsx';

function formatHours(hours) {
  if (hours == null) return 'Sin datos';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} h`;
  const days = Math.floor(hours / 24);
  const restHours = hours - days * 24;
  return `${days} d ${restHours.toFixed(0)} h`;
}

export default function StageDurationsReport() {
  const [orderType, setOrderType] = useState('SERVICIO');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getStageDurationsReport(orderType)
      .then(setReport)
      .catch(() => setError('No se pudo cargar el reporte de tiempos por etapa.'))
      .finally(() => setLoading(false));
  }, [orderType]);

  const stages = getStages(orderType);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {Object.keys(ORDER_TYPE_LABELS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setOrderType(key)}
              className={`rounded-full border px-4 py-1.5 font-label-caps text-xs font-bold transition-colors ${
                orderType === key
                  ? 'border-primary bg-primary text-on-primary shadow-sm'
                  : 'border-outline-variant bg-white text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              {ORDER_TYPE_LABELS[key]}
            </button>
          ))}
        </div>

        {report && (
          <span className="font-label-caps text-xs text-on-surface-variant">
            {report.sampleSize} orden(es) entregada(s) analizadas
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-error bg-error-container/30 px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        report && (
          <div className="space-y-6">
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
              <p className="font-label-caps text-[10px] text-on-surface-variant">
                TIEMPO TOTAL PROMEDIO EN TALLER (INGRESO A ENTREGA)
              </p>
              <p className="mt-1 font-headline-lg text-3xl font-black text-primary">
                {formatHours(report.avgTotalHours)}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                Calculado con base en {report.sampleSize} órdenes cerradas de {ORDER_TYPE_LABELS[orderType]}.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest card-elevation">
              <div className="border-b border-outline-variant bg-surface-container-low px-5 py-4">
                <h3 className="font-headline-md text-sm font-bold text-primary">
                  ⏱️ Desglose de Tiempo Promedio por Etapa
                </h3>
              </div>

              {report.sampleSize === 0 ? (
                <p className="px-5 py-8 text-center text-xs text-on-surface-variant">
                  Todavía no hay órdenes de {ORDER_TYPE_LABELS[orderType]} entregadas para calcular un promedio.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant">
                        <th className="px-4 py-3 font-semibold">Etapa del Proceso</th>
                        <th className="px-4 py-3 font-semibold">Tiempo Promedio</th>
                        <th className="px-4 py-3 text-right font-semibold">Muestras Registradas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {report.stages.map((s) => {
                        const stageDef = stages.find((st) => st.key === s.key);
                        return (
                          <tr key={s.key} className="hover:bg-surface-container-low/40">
                            <td className="px-4 py-3 font-semibold text-primary">
                              {stageDef?.label || s.key}
                            </td>
                            <td className="px-4 py-3 font-data-mono font-bold text-primary">
                              {formatHours(s.avgHours)}
                            </td>
                            <td className="px-4 py-3 text-right font-data-mono text-on-surface-variant">
                              {s.sampleSize}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { getStageDurationsReport } from '../api/workOrders.js';
import { getStages, ORDER_TYPE_LABELS } from '../constants/stages.js';

function formatHours(hours) {
  if (hours == null) return 'Sin datos';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} h`;
  const days = Math.floor(hours / 24);
  const restHours = hours - days * 24;
  return `${days} d ${restHours.toFixed(0)} h`;
}

export default function ReportsPage() {
  const [orderType, setOrderType] = useState('SERVICIO');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getStageDurationsReport(orderType)
      .then(setReport)
      .catch(() => setError('No se pudo cargar el reporte.'))
      .finally(() => setLoading(false));
  }, [orderType]);

  const stages = getStages(orderType);

  return (
    <div className="min-h-screen text-on-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col gap-gutter px-margin-desktop py-12">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Reportes</h1>
          <p className="font-body-md text-on-surface-variant">
            Tiempo promedio de estadía en el taller, por etapa. Solo considera órdenes ya entregadas — mientras
            una orden sigue en proceso su etapa actual todavía no tiene un tiempo final.
          </p>
        </div>

        <div className="flex gap-2">
          {Object.keys(ORDER_TYPE_LABELS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setOrderType(key)}
              className={`rounded-full border px-4 py-1.5 font-label-caps text-[11px] transition-colors ${
                orderType === key
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              {ORDER_TYPE_LABELS[key]}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded border border-error bg-error-container/30 px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          report && (
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest card-elevation">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-card-padding py-4">
                <h2 className="font-headline-md text-headline-md text-primary">
                  Tiempo promedio de estadía — {ORDER_TYPE_LABELS[orderType]}
                </h2>
                <span className="font-label-caps text-[11px] text-on-surface-variant">
                  {report.sampleSize} orden(es) entregada(s)
                </span>
              </div>

              {report.sampleSize === 0 ? (
                <p className="px-card-padding py-8 text-center font-body-md text-on-surface-variant">
                  Todavía no hay órdenes de {ORDER_TYPE_LABELS[orderType]} entregadas para calcular un promedio.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-4 px-card-padding py-4">
                    <div className="min-w-[200px] flex-1 rounded-lg border border-outline-variant bg-white p-4">
                      <p className="font-label-caps text-[10px] text-on-surface-variant">
                        TIEMPO TOTAL EN TALLER (INGRESO A ENTREGA)
                      </p>
                      <p className="font-headline-md text-primary">{formatHours(report.avgTotalHours)}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto px-card-padding pb-4">
                    <table className="w-full min-w-[36rem] border-collapse text-left">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Etapa
                          </th>
                          <th className="px-3 py-2 font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Tiempo promedio
                          </th>
                          <th className="px-3 py-2 font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant">
                            Muestras
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.stages.map((s) => {
                          const stageDef = stages.find((st) => st.key === s.key);
                          return (
                            <tr key={s.key} className="border-t border-outline-variant">
                              <td className="px-3 py-2 font-body-md text-sm text-primary">
                                {stageDef?.label || s.key}
                              </td>
                              <td className="px-3 py-2 font-data-mono text-sm text-on-surface-variant">
                                {formatHours(s.avgHours)}
                              </td>
                              <td className="px-3 py-2 font-data-mono text-xs text-on-surface-variant/70">
                                {s.sampleSize}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}

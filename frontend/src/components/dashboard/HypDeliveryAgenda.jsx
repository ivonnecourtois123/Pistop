import { useMemo, useState } from 'react';
import { STAGE_LABEL } from '../../constants/stages.js';

const FINAL_STAGE_BADGE = new Set(['TERMINADO', 'ENTREGADO']);

function statusBadgeClass(status) {
  if (FINAL_STAGE_BADGE.has(status)) return 'bg-primary/10 text-primary';
  if (status === 'EN_VALUACION') return 'bg-surface-container-high text-on-surface-variant';
  return 'bg-secondary-container/15 text-secondary';
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const byDeliveryDate = (a, b) => new Date(a.estimatedDeliveryAt) - new Date(b.estimatedDeliveryAt);

// A diferencia del magnetoplano de Servicio (matriz técnico × hora), aquí una lista simple
// ordenada por fecha alcanza: el controlista de HYP no necesita ver "qué hora del día" sino
// "qué día" tiene programada cada entrega, y sin agrupar por técnico porque lo relevante es la
// fecha, no quién la va a entregar (ya se ve en la columna de técnico de cada fila).
export default function HypDeliveryAgenda({ workOrders }) {
  const [collapsed, setCollapsed] = useState(false);

  const { scheduled, unscheduled } = useMemo(() => {
    const scheduled = workOrders.filter((wo) => wo.estimatedDeliveryAt).sort(byDeliveryDate);
    const unscheduled = workOrders.filter((wo) => !wo.estimatedDeliveryAt);
    return { scheduled, unscheduled };
  }, [workOrders]);

  return (
    <section className="mb-8 w-full rounded-lg border border-outline-variant bg-surface-container-lowest card-elevation">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center justify-between px-card-padding py-4"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" data-icon="event_upcoming">
            event_upcoming
          </span>
          <h3 className="font-headline-md text-headline-md text-primary">Agenda de Entregas Programadas</h3>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant" data-icon={collapsed ? 'expand_more' : 'expand_less'}>
          {collapsed ? 'expand_more' : 'expand_less'}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-outline-variant px-card-padding py-4">
          {scheduled.length === 0 ? (
            <p className="py-4 text-center font-body-md text-on-surface-variant">
              Ninguna unidad de HYP tiene fecha de entrega programada.
            </p>
          ) : (
            <div className="divide-y divide-outline-variant">
              {scheduled.map((wo) => (
                <div key={wo.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <span className="min-w-[11rem] font-data-mono text-sm text-primary">
                    {formatDateTime(wo.estimatedDeliveryAt)}
                  </span>
                  <span className="font-body-md text-sm font-semibold text-primary">#{wo.orderNumber}</span>
                  <span className="font-data-mono text-[11px] text-on-surface-variant">{wo.vehicle.plate}</span>
                  <span className="truncate font-data-mono text-[11px] text-on-surface-variant">
                    {wo.vehicle.brand} {wo.vehicle.model}
                  </span>
                  <span className="font-label-caps text-[11px] text-on-surface-variant">
                    {wo.technician?.name?.trim() || 'Sin asignar'}
                  </span>
                  <span
                    className={`ml-auto whitespace-nowrap rounded-full px-2 py-0.5 font-label-caps text-[10px] ${statusBadgeClass(wo.status)}`}
                  >
                    {STAGE_LABEL[wo.status] || wo.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {unscheduled.length > 0 && (
            <p className="mt-3 font-label-caps text-[10px] text-on-surface-variant">
              {unscheduled.length} unidad(es) de HYP sin fecha de entrega programada — no aparecen en la agenda.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

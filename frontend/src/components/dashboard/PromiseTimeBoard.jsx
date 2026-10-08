import { useEffect, useMemo, useState } from 'react';
import { STAGE_LABEL } from '../../constants/stages.js';
import {
  computeWorkProgress,
  PROGRESS_DOT_CLASS,
  PROGRESS_LABEL,
  PROGRESS_LEVELS,
  PROGRESS_STRIPE_CLASS,
} from '../../utils/workProgress.js';

const FINAL_STAGE_BADGE = new Set(['TERMINADO', 'ENTREGADO']);

function statusBadgeClass(status) {
  if (FINAL_STAGE_BADGE.has(status)) return 'bg-primary/10 text-primary';
  if (status === 'RECIBIDO') return 'bg-surface-container-high text-on-surface-variant';
  return 'bg-secondary-container/15 text-secondary';
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfToday() {
  return startOfDay(new Date());
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

// "YYYY-MM-DD" en hora local, formato que espera <input type="date">
function toDateInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromDateInputValue(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDayLabel(date) {
  const today = startOfToday();
  if (isSameDay(date, today)) return 'Hoy';
  if (isSameDay(date, addDays(today, 1))) return 'Mañana';
  if (isSameDay(date, addDays(today, -1))) return 'Ayer';
  return date.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' });
}

// Unidades del día seleccionado: las prometidas para ese día, más las sin hora definida cuando
// se está viendo hoy (son la operación del día, no la agenda de una fecha concreta).
function unitsForSelectedDate(workOrders, selectedDate) {
  const day0 = startOfDay(selectedDate);
  const day1 = addDays(day0, 1);
  const viewingToday = isSameDay(day0, startOfToday());

  const withHour = [];
  const noTime = [];

  for (const wo of workOrders) {
    if (!wo.estimatedDeliveryAt) {
      if (viewingToday) noTime.push(wo);
      continue;
    }
    const d = new Date(wo.estimatedDeliveryAt);
    if (d >= day0 && d < day1) withHour.push(wo);
  }

  return { withHour, noTime };
}

const byTime = (a, b) => new Date(a.estimatedDeliveryAt) - new Date(b.estimatedDeliveryAt);
const NO_TIME_COLUMN = { key: 'none', label: 'Sin hora definida' };

// Matriz técnico × hora de entrega para el día seleccionado: filas = técnicos (con "Sin
// asignar" al final), columnas = horas con unidades (+ "Sin hora definida"). Cada celda apila
// las unidades de ese técnico en esa hora, si hay más de una.
function buildMatrix(workOrders, selectedDate) {
  const { withHour, noTime } = unitsForSelectedDate(workOrders, selectedDate);

  const hours = new Set(withHour.map((wo) => new Date(wo.estimatedDeliveryAt).getHours()));
  const columns = [...hours]
    .sort((a, b) => a - b)
    .map((h) => ({ key: `hour-${h}`, label: formatHour(h) }));
  if (noTime.length) columns.push(NO_TIME_COLUMN);

  const technicianNames = new Set();
  for (const wo of [...withHour, ...noTime]) {
    technicianNames.add(wo.technician?.name || 'Sin asignar');
  }
  const rows = [...technicianNames].sort((a, b) =>
    a === 'Sin asignar' ? 1 : b === 'Sin asignar' ? -1 : a.localeCompare(b)
  );

  const cells = new Map();
  function place(technicianName, columnKey, wo) {
    const cellKey = `${technicianName}__${columnKey}`;
    if (!cells.has(cellKey)) cells.set(cellKey, []);
    cells.get(cellKey).push(wo);
  }
  for (const wo of withHour) {
    const hour = new Date(wo.estimatedDeliveryAt).getHours();
    place(wo.technician?.name || 'Sin asignar', `hour-${hour}`, wo);
  }
  for (const wo of noTime) {
    place(wo.technician?.name || 'Sin asignar', NO_TIME_COLUMN.key, wo);
  }
  for (const items of cells.values()) items.sort(byTime);

  return { rows, columns, cells };
}

// Otros días (de hoy en adelante) que tienen entregas programadas, para saltar directo a ellos
// sin ir avanzando de uno en uno.
function upcomingDaysWithOrders(workOrders, selectedDate) {
  const today0 = startOfToday();
  const counts = new Map();

  for (const wo of workOrders) {
    if (!wo.estimatedDeliveryAt) continue;
    const d = startOfDay(new Date(wo.estimatedDeliveryAt));
    if (d < today0 || isSameDay(d, selectedDate)) continue;
    const key = toDateInputValue(d);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ key, date: fromDateInputValue(key), count }));
}

// Solo de consulta: el magnetoplano no abre edición — eso vive únicamente en la lista de
// Unidades en Proceso. El número de orden es el dato principal (placa como secundario), y la
// etapa se muestra como referencia visual, no como control.
// Detalle de solo consulta. El magnetoplano no abre edición (eso vive en Unidades en Proceso);
// aquí solo se explica el color, que de otro modo depende de pasar el mouse por encima.
function CardDetailPopover({ workOrder, progress, onClose, onSelect, align }) {
  const alignClass = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  return (
    <div
      data-card-detail
      className={`absolute top-full z-50 mt-2 w-64 max-w-[85vw] rounded-xl border border-outline-variant bg-white p-3.5 text-left shadow-xl ${alignClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-body-md text-sm font-bold text-primary">#{workOrder.orderNumber}</p>
          <p className="font-data-mono text-[11px] text-on-surface-variant font-medium">{workOrder.vehicle?.plate || 'Sin placas'}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary cursor-pointer"
          data-icon="close"
        >
          close
        </button>
      </div>

      <dl className="space-y-1.5 border-t border-outline-variant/60 pt-2 text-xs">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="font-label-caps text-[10px] text-on-surface-variant font-semibold">Estatus</dt>
          <dd className="text-right font-bold text-emerald-700">{STAGE_LABEL[workOrder.status] || workOrder.status}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="font-label-caps text-[10px] text-on-surface-variant font-semibold">Técnico</dt>
          <dd className="text-right text-primary font-medium">{workOrder.technician?.name?.trim() || 'Sin asignar'}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="font-label-caps text-[10px] text-on-surface-variant font-semibold">Promesa</dt>
          <dd className="text-right font-data-mono text-primary font-bold">
            {workOrder.estimatedDeliveryAt
              ? new Date(workOrder.estimatedDeliveryAt).toLocaleString('es-MX', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Sin definir'}
          </dd>
        </div>
        {workOrder.customerWaiting && (
          <p className="font-label-caps text-[10px] font-bold text-error">Cliente espera en agencia</p>
        )}
      </dl>

      {progress && (
        <div className="mt-2 border-t border-outline-variant/60 pt-2">
          <p className="mb-1 flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant font-bold">
            <span className={`h-2 w-2 shrink-0 rounded-full ${PROGRESS_DOT_CLASS[progress.level]}`} />
            Semáforo: {PROGRESS_LABEL[progress.level]}
          </p>
          <p className="text-xs text-on-surface-variant leading-tight">{progress.label}</p>
        </div>
      )}

      {onSelect && (
        <button
          type="button"
          onClick={() => {
            onClose?.();
            onSelect(workOrder);
          }}
          className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-label-caps text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">bolt</span>
          ⚡ Ver Etapas / Actualizar
        </button>
      )}
    </div>
  );
}

function VehicleCard({ workOrder, standardHours, open, onToggle, onSelect, align }) {
  const { vehicle } = workOrder;
  const progress = standardHours ? computeWorkProgress(workOrder, standardHours) : null;

  return (
    <div className={`relative w-full ${open ? 'z-50' : ''}`}>
      <button
        type="button"
        data-card-trigger
        onClick={onToggle}
        title="Ver estatus y semáforo"
        className={`flex w-full flex-col gap-1 rounded-lg border border-outline-variant bg-white px-3 py-2 text-left transition-colors hover:border-primary cursor-pointer shadow-2xs ${
          progress ? `border-l-4 ${PROGRESS_STRIPE_CLASS[progress.level]}` : ''
        }`}
      >
        <span className="flex items-center gap-1.5">
          {progress && (
            <span
              title={progress.label}
              className={`h-2 w-2 shrink-0 rounded-full ${PROGRESS_DOT_CLASS[progress.level]}`}
            />
          )}
          <span className="truncate font-body-md text-sm font-semibold text-primary">#{workOrder.orderNumber}</span>
          <span className="shrink-0 font-data-mono text-[11px] text-on-surface-variant">{vehicle?.plate || 'Sin placas'}</span>
          {workOrder.customerWaiting && (
            <span className="material-symbols-outlined shrink-0 text-sm text-error" title="Cliente espera" data-icon="schedule">
              schedule
            </span>
          )}
        </span>
        <span className="truncate font-data-mono text-[11px] text-on-surface-variant">
          {vehicle?.brand} {vehicle?.model}
        </span>
        <span
          className={`w-fit whitespace-nowrap rounded-full px-2 py-0.5 font-label-caps text-[10px] ${statusBadgeClass(workOrder.status)}`}
        >
          {STAGE_LABEL[workOrder.status] || workOrder.status}
        </span>
      </button>

      {open && (
        <CardDetailPopover
          workOrder={workOrder}
          progress={progress}
          onClose={onToggle}
          onSelect={onSelect}
          align={align}
        />
      )}
    </div>
  );
}

export default function PromiseTimeBoard({ workOrders, standardHours, onSelect, opStats }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(startOfToday);
  const [openCardId, setOpenCardId] = useState(null);

  useEffect(() => {
    if (!openCardId) return undefined;
    function handleClickOutside(e) {
      if (!e.target.closest('[data-card-detail]') && !e.target.closest('[data-card-trigger]')) {
        setOpenCardId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCardId]);

  const { rows, columns, cells } = useMemo(() => buildMatrix(workOrders, selectedDate), [workOrders, selectedDate]);
  const otherDays = useMemo(() => upcomingDaysWithOrders(workOrders, selectedDate), [workOrders, selectedDate]);

  const isToday = isSameDay(selectedDate, startOfToday());
  const totalCount = [...cells.values()].reduce((sum, items) => sum + items.length, 0);

  // Indicadores operativos dinámicos para la barra del calendario
  const computedOpStats = useMemo(() => {
    const today0 = startOfToday();
    const today1 = addDays(today0, 1);

    const todayOrders = workOrders.filter((wo) => {
      const rec = wo.receivedAt ? new Date(wo.receivedAt) : null;
      const prom = wo.estimatedDeliveryAt ? new Date(wo.estimatedDeliveryAt) : null;
      return (rec && rec >= today0 && rec < today1) || (prom && prom >= today0 && prom < today1);
    });

    const totalHoy = opStats?.totalHoy ?? (todayOrders.length || workOrders.length);
    const terminados = opStats?.terminados ?? workOrders.filter((wo) => ['TERMINADO', 'ENTREGADO'].includes(wo.status)).length;
    const porEntregar = opStats?.porEntregar ?? workOrders.filter((wo) => wo.status === 'TERMINADO' || (wo.status !== 'ENTREGADO' && !['RECIBIDO'].includes(wo.status))).length;

    // Rezagados: Unidades recibidas antes de hoy que siguen en proceso
    const rezagados = opStats?.rezagados ?? workOrders.filter((wo) => {
      if (['TERMINADO', 'ENTREGADO'].includes(wo.status)) return false;
      if (!wo.receivedAt) return false;
      return new Date(wo.receivedAt) < today0;
    }).length;

    return {
      totalHoy,
      terminados,
      porEntregar,
      rezagados,
    };
  }, [workOrders, opStats]);

  return (
    <section className="mb-6 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest card-elevation shadow-xs">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center justify-between px-card-padding py-3.5 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" data-icon="dashboard">
            dashboard
          </span>
          <h3 className="font-headline-md text-base font-black text-primary">Horas Promesa de Entrega</h3>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant" data-icon={collapsed ? 'expand_more' : 'expand_less'}>
          {collapsed ? 'expand_more' : 'expand_less'}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-outline-variant px-card-padding py-3.5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {/* Controles de fecha / calendario */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDate((d) => addDays(d, -1))}
                title="Día anterior"
                className="material-symbols-outlined rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary cursor-pointer"
                data-icon="chevron_left"
              >
                chevron_left
              </button>

              <div className="flex items-center gap-2">
                <span className="min-w-[5.5rem] text-center font-headline-md text-sm font-bold text-primary">
                  {formatDayLabel(selectedDate)}
                </span>
                <input
                  type="date"
                  value={toDateInputValue(selectedDate)}
                  onChange={(e) => e.target.value && setSelectedDate(fromDateInputValue(e.target.value))}
                  className="rounded-lg border border-outline-variant bg-white px-2 py-1 font-data-mono text-xs text-primary cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={() => setSelectedDate((d) => addDays(d, 1))}
                title="Día siguiente"
                className="material-symbols-outlined rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary cursor-pointer"
                data-icon="chevron_right"
              >
                chevron_right
              </button>

              {!isToday && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(startOfToday())}
                  className="rounded-full border border-outline-variant px-2.5 py-0.5 font-label-caps text-[11px] font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary cursor-pointer"
                >
                  Ir a hoy
                </button>
              )}
            </div>

            {/* 4 Indicadores Operativos a un lado del calendario: Total hoy, Terminados, Por entregar, Rezagados */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 1. Total Hoy */}
              <div className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white px-2.5 py-1 shadow-2xs">
                <span className="material-symbols-outlined text-primary text-sm">directions_car</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">TOTAL HOY:</span>
                <span className="font-headline-md text-xs font-black text-primary">{computedOpStats.totalHoy}</span>
              </div>

              {/* 2. Terminados */}
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2.5 py-1 shadow-2xs">
                <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                <span className="font-label-caps text-[10px] text-emerald-800 font-bold uppercase tracking-wider">TERMINADOS:</span>
                <span className="font-headline-md text-xs font-black text-emerald-700">{computedOpStats.terminados}</span>
              </div>

              {/* 3. Por Entregar */}
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/60 px-2.5 py-1 shadow-2xs">
                <span className="material-symbols-outlined text-amber-600 text-sm">pending_actions</span>
                <span className="font-label-caps text-[10px] text-amber-800 font-bold uppercase tracking-wider">POR ENTREGAR:</span>
                <span className="font-headline-md text-xs font-black text-amber-700">{computedOpStats.porEntregar}</span>
              </div>

              {/* 4. Rezagados */}
              <div className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/70 px-2.5 py-1 shadow-2xs ring-1 ring-rose-300">
                <span className="material-symbols-outlined text-rose-600 text-sm">alarm</span>
                <span className="font-label-caps text-[10px] text-rose-900 font-bold uppercase tracking-wider">REZAGADOS:</span>
                <span className="font-headline-md text-xs font-black text-rose-800">{computedOpStats.rezagados}</span>
              </div>
            </div>

            <span className="font-label-caps text-[11px] text-on-surface-variant font-bold">
              {totalCount} unidad(es)
            </span>
          </div>

          {/* Leyenda: el color solo sirve si se sabe qué mide. Va aquí y no en la tabla porque
              este es el tablero de referencia, donde se lee a distancia. */}
          {standardHours && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-label-caps text-[11px] text-on-surface-variant">Avance vs. tiempo estándar:</span>
              {[
                { level: 'OK', label: 'A tiempo' },
                { level: 'WARN', label: 'Por vencer' },
                { level: 'LATE', label: 'Excedido' },
                { level: 'UNKNOWN', label: 'Sin dato' },
              ].map((l) => (
                <span key={l.level} className="flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant">
                  <span className={`h-2 w-2 rounded-full ${PROGRESS_DOT_CLASS[l.level]}`} />
                  {l.label}
                </span>
              ))}
            </div>
          )}

          {otherDays.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="font-label-caps text-[11px] text-on-surface-variant">Otros días:</span>
              {otherDays.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDate(d.date)}
                  className="rounded-full border border-outline-variant px-3 py-1 font-label-caps text-[11px] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  {formatDayLabel(d.date)} ({d.count})
                </button>
              ))}
            </div>
          )}

          {rows.length === 0 ? (
            <p className="py-4 text-center font-body-md text-on-surface-variant">
              No hay unidades para {formatDayLabel(selectedDate).toLowerCase()}.
            </p>
          ) : (
            <div className="overflow-x-auto pb-2">
              <table className="w-full min-w-max border-collapse text-left">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-surface-container-lowest px-2 py-1 font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant">
                      Técnico
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="min-w-[11rem] whitespace-nowrap rounded-t bg-primary/10 px-3 py-1 font-label-caps text-[11px] uppercase tracking-wider text-primary"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((technicianName) => (
                    <tr key={technicianName} className="border-t border-outline-variant">
                      <td className="sticky left-0 z-10 bg-surface-container-lowest px-2 py-2 align-top font-body-md text-sm font-semibold text-primary">
                        {technicianName}
                      </td>
                      {columns.map((col, colIndex) => {
                        const items = cells.get(`${technicianName}__${col.key}`) || [];
                        // El popover es más ancho que una columna: en los extremos se ancla al
                        // borde de la tarjeta en vez de centrarse, para no salirse del tablero.
                        const align =
                          colIndex === 0 ? 'left' : colIndex === columns.length - 1 ? 'right' : 'center';
                        return (
                          <td key={col.key} className="px-2 py-2 align-top">
                            {items.length > 0 && (
                              <div className="flex flex-col gap-2">
                                {items.map((wo) => (
                                  <VehicleCard
                                    key={wo.id}
                                    workOrder={wo}
                                    standardHours={standardHours}
                                    align={align}
                                    open={openCardId === wo.id}
                                    onToggle={() => setOpenCardId((prev) => (prev === wo.id ? null : wo.id))}
                                    onSelect={onSelect}
                                  />
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

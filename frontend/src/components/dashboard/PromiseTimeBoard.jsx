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

const WORKSHOP_DEFAULT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

// Matriz técnico × hora de entrega para el día seleccionado: filas = técnicos (con "Sin
// asignar" al final), columnas = horas completas de jornada o solo horas con citas (+ "Sin hora definida").
function buildMatrix(workOrders, selectedDate, onlyActiveHours = false) {
  const { withHour, noTime } = unitsForSelectedDate(workOrders, selectedDate);

  const orderHours = withHour.map((wo) => new Date(wo.estimatedDeliveryAt).getHours());
  const hoursList = onlyActiveHours && orderHours.length > 0
    ? [...new Set(orderHours)].sort((a, b) => a - b)
    : [...new Set([...WORKSHOP_DEFAULT_HOURS, ...orderHours])].sort((a, b) => a - b);

  const columns = hoursList.map((h) => ({ key: `hour-${h}`, hour: h, label: formatHour(h) }));
  if (noTime.length) columns.push({ ...NO_TIME_COLUMN, count: noTime.length });

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

// Otros días (de hoy en adelante) que tienen entregas programadas
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

function VehicleCard({ workOrder, standardHours, onSelect }) {
  const { vehicle } = workOrder;
  const progress = standardHours ? computeWorkProgress(workOrder, standardHours) : null;
  const timeStr = workOrder.estimatedDeliveryAt
    ? new Date(workOrder.estimatedDeliveryAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(workOrder)}
      title={`Orden #${workOrder.orderNumber} • ${vehicle?.brand || ''} ${vehicle?.model || ''} • Clic para ver etapas`}
      className={`group flex w-full flex-col rounded-md border border-outline-variant/80 bg-white px-2 py-1 text-left transition-all hover:border-primary hover:shadow-xs hover:scale-[1.01] cursor-pointer shadow-2xs ${
        progress ? `border-l-3 ${PROGRESS_STRIPE_CLASS[progress.level]}` : ''
      }`}
    >
      <div className="flex items-center justify-between gap-1 w-full">
        <span className="font-data-mono text-[11px] font-bold text-primary truncate">
          #{workOrder.orderNumber}
        </span>
        {timeStr && (
          <span className="font-data-mono text-[9px] font-semibold text-on-surface-variant/70 shrink-0">
            {timeStr}
          </span>
        )}
      </div>
      <span className="truncate font-body-sm text-[10px] text-on-surface-variant leading-tight">
        {vehicle?.model || vehicle?.brand || 'Sin modelo'}
      </span>
    </button>
  );
}

export default function PromiseTimeBoard({ workOrders, standardHours, onSelect, opStats }) {
  const [selectedDate, setSelectedDate] = useState(startOfToday);
  const [onlyActiveHours, setOnlyActiveHours] = useState(false);

  const { rows, columns, cells } = useMemo(
    () => buildMatrix(workOrders, selectedDate, onlyActiveHours),
    [workOrders, selectedDate, onlyActiveHours]
  );

  const otherDays = useMemo(() => upcomingDaysWithOrders(workOrders, selectedDate), [workOrders, selectedDate]);

  const isToday = isSameDay(selectedDate, startOfToday());
  const totalCount = [...cells.values()].reduce((sum, items) => sum + items.length, 0);

  // Horas asignadas por cada técnico en el día seleccionado
  const techHoursMap = useMemo(() => {
    const map = new Map();
    const { withHour, noTime } = unitsForSelectedDate(workOrders, selectedDate);
    for (const wo of [...withHour, ...noTime]) {
      const name = wo.technician?.name || 'Sin asignar';
      const std = wo.serviceCategory && standardHours ? standardHours[wo.serviceCategory] : 1.5;
      map.set(name, (map.get(name) || 0) + std);
    }
    return map;
  }, [workOrders, selectedDate, standardHours]);

  // Indicadores operativos dinámicos para la barra
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

    const rezagados = opStats?.rezagados ?? workOrders.filter((wo) => {
      if (['TERMINADO', 'ENTREGADO'].includes(wo.status)) return false;
      if (!wo.receivedAt) return false;
      return new Date(wo.receivedAt) < today0;
    }).length;

    return { totalHoy, terminados, porEntregar, rezagados };
  }, [workOrders, opStats]);

  return (
    <section className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xs">
      {/* Barra de Controles y KPIs compacta */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-outline-variant/70 px-4 py-2.5">
        {/* Controles de fecha / calendario */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 rounded-lg border border-outline-variant bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setSelectedDate((d) => addDays(d, -1))}
              title="Día anterior"
              className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="min-w-[4rem] text-center font-headline-md text-xs font-bold text-primary px-1">
              {formatDayLabel(selectedDate)}
            </span>
            <input
              type="date"
              value={toDateInputValue(selectedDate)}
              onChange={(e) => e.target.value && setSelectedDate(fromDateInputValue(e.target.value))}
              className="rounded border border-outline-variant bg-white px-1.5 py-0.5 font-data-mono text-[11px] text-primary cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
              title="Día siguiente"
              className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(startOfToday())}
              className="rounded-lg border border-outline-variant bg-white px-2 py-1 font-label-caps text-[10px] font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              Hoy
            </button>
          )}

          {/* Toggle de Horas con Citas vs Jornada Completa */}
          <button
            type="button"
            onClick={() => setOnlyActiveHours((v) => !v)}
            title={onlyActiveHours ? 'Ver toda la jornada (08:00 a 18:00)' : 'Ver solo columnas con entregas programadas'}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
              onlyActiveHours
                ? 'border-primary bg-primary text-white shadow-2xs'
                : 'border-outline-variant bg-white text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xs">
              {onlyActiveHours ? 'view_column' : 'filter_list'}
            </span>
            {onlyActiveHours ? 'Solo citas' : 'Jornada completa'}
          </button>
        </div>

        {/* 4 Indicadores Operativos en pills compactos */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-md border border-outline-variant bg-white px-2 py-0.5 shadow-2xs">
            <span className="font-label-caps text-[9px] text-on-surface-variant font-bold">TOTAL:</span>
            <span className="font-data-mono text-xs font-black text-primary">{computedOpStats.totalHoy}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-0.5 shadow-2xs">
            <span className="font-label-caps text-[9px] text-emerald-800 font-bold">LISTAS:</span>
            <span className="font-data-mono text-xs font-black text-emerald-700">{computedOpStats.terminados}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50/60 px-2 py-0.5 shadow-2xs">
            <span className="font-label-caps text-[9px] text-amber-800 font-bold">POR ENTREGAR:</span>
            <span className="font-data-mono text-xs font-black text-amber-700">{computedOpStats.porEntregar}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50/70 px-2 py-0.5 shadow-2xs ring-1 ring-rose-200">
            <span className="font-label-caps text-[9px] text-rose-900 font-bold">REZAGADOS:</span>
            <span className="font-data-mono text-xs font-black text-rose-800">{computedOpStats.rezagados}</span>
          </div>
          <span className="font-label-caps text-[10px] text-on-surface-variant/80 font-bold pl-1">
            ({totalCount} en vista)
          </span>
        </div>
      </div>

      {/* Sub-barra: Semáforo y Otros Días */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 bg-surface-container/20 px-4 py-1.5 text-[10px] font-label-caps text-on-surface-variant">
        {standardHours && (
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-on-surface-variant">Semáforo:</span>
            {[
              { level: 'OK', label: 'A tiempo' },
              { level: 'WARN', label: 'Por vencer' },
              { level: 'LATE', label: 'Excedido' },
            ].map((l) => (
              <span key={l.level} className="inline-flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${PROGRESS_DOT_CLASS[l.level]}`} />
                {l.label}
              </span>
            ))}
          </div>
        )}

        {otherDays.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-bold">Otros días:</span>
            {otherDays.slice(0, 5).map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className="rounded border border-outline-variant bg-white px-1.5 py-0.2 font-label-caps text-[9px] text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {formatDayLabel(d.date)} ({d.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Matriz de técnicos x hora compacta */}
      <div className="p-2">
        {rows.length === 0 ? (
          <p className="py-8 text-center font-body-md text-xs text-on-surface-variant">
            No hay unidades programadas para {formatDayLabel(selectedDate).toLowerCase()}.
          </p>
        ) : (
          <div className="overflow-x-auto pb-1">
            <table className="w-full min-w-max border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant/70">
                  <th className="sticky left-0 z-20 bg-surface-container-lowest px-2.5 py-1.5 font-label-caps text-[10px] font-bold uppercase tracking-wider text-on-surface-variant min-w-[9.5rem] border-r border-outline-variant/60 shadow-2xs">
                    Técnico
                  </th>
                  {columns.map((col) => {
                    const isNoTime = col.key === 'none';
                    return (
                      <th
                        key={col.key}
                        className={`min-w-[7.5rem] max-w-[9.5rem] whitespace-nowrap px-2 py-1 font-label-caps text-[10px] font-bold uppercase tracking-wider text-center border-r border-outline-variant/30 ${
                          isNoTime
                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                            : 'bg-primary/5 text-primary'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{col.label}</span>
                          {isNoTime && col.count > 0 && (
                            <span className="rounded-full bg-amber-200/80 px-1 text-[9px] font-black text-amber-900">
                              {col.count}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {rows.map((technicianName) => {
                  const assignedHrs = techHoursMap.get(technicianName) || 0;
                  const shiftHours = 8.0;
                  const isUnassigned = technicianName === 'Sin asignar';
                  const techPct = Math.round((assignedHrs / shiftHours) * 100);
                  const isOverloaded = assignedHrs > shiftHours;

                  return (
                    <tr key={technicianName} className="hover:bg-surface-container/20 transition-colors">
                      {/* Cabecera de fila sticky */}
                      <td className="sticky left-0 z-10 bg-surface-container-lowest px-2.5 py-1.5 align-top border-r border-outline-variant/60">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-body-md text-xs font-bold text-primary truncate max-w-[9rem]" title={technicianName}>
                            {technicianName}
                          </span>
                          {!isUnassigned && (
                            <div className="flex items-center gap-1">
                              <span
                                className={`rounded px-1 py-0.2 text-[9px] font-bold font-data-mono border ${
                                  isOverloaded
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : assignedHrs >= 6.5
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                {assignedHrs.toFixed(1)}h ({techPct}%)
                              </span>
                              {isOverloaded && (
                                <span className="text-[9px] text-rose-700 font-bold" title="Saturado">🚨</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Columnas de horas / slots */}
                      {columns.map((col) => {
                        const items = cells.get(`${technicianName}__${col.key}`) || [];

                        return (
                          <td key={col.key} className="px-1.5 py-1 align-top border-r border-outline-variant/30 min-w-[7.5rem] max-w-[9.5rem]">
                            {items.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {items.map((wo) => (
                                  <VehicleCard
                                    key={wo.id}
                                    workOrder={wo}
                                    standardHours={standardHours}
                                    onSelect={onSelect}
                                  />
                                ))}
                              </div>
                            ) : col.key !== 'none' && !isUnassigned ? (
                              /* Slot Vacío / Disponible Compacto */
                              <div
                                title={`Horario ${col.label} disponible para ${technicianName}`}
                                className="flex h-7 w-full items-center justify-center rounded border border-dashed border-emerald-300/40 bg-emerald-50/15 px-1 text-center transition-colors hover:bg-emerald-50/50 hover:border-emerald-400"
                              >
                                <span className="font-label-caps text-[9px] text-emerald-800/60 font-medium">
                                  Libre
                                </span>
                              </div>
                            ) : (
                              <div className="h-7 w-full" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

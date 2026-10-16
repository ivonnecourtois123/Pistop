import { useEffect, useMemo, useState } from 'react';
import { STAGE_LABEL } from '../../constants/stages.js';
import { getCapacity } from '../../api/capacity.js';
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

function computeDeliveryTiming(workOrder, standardHours) {
  const { statusEvents = [] } = workOrder;
  const isWashCompleted =
    ['CONTROL_CALIDAD', 'TERMINADO', 'ENTREGADO'].includes(workOrder.status) ||
    statusEvents.some((e) => e.status === 'LAVADO' && workOrder.status !== 'LAVADO');

  const categoryHours = standardHours?.[workOrder.serviceCategory] ?? 1.5;
  const mechHours = categoryHours + (workOrder.alignmentNeeded ? 0.5 : 0);
  const needsWash = workOrder.washNeeded !== false;

  let targetWorkshopDate = null;
  let statusTraffic = 'OK'; // 'OK' | 'WARN' | 'LATE' | 'DONE'
  let trafficLabel = 'En tiempo';

  if (['TERMINADO', 'ENTREGADO'].includes(workOrder.status)) {
    statusTraffic = 'DONE';
    trafficLabel = 'Listo';
  } else if (workOrder.estimatedDeliveryAt) {
    const deliveryDate = new Date(workOrder.estimatedDeliveryAt);
    const now = new Date();
    const bufferMs = 30 * 60 * 1000; // 30 min buffer final
    const washMs = needsWash && !isWashCompleted && workOrder.status !== 'LAVADO' ? 90 * 60 * 1000 : 0; // 90 min de lavado si falta
    targetWorkshopDate = new Date(deliveryDate.getTime() - bufferMs - washMs);

    if (now > deliveryDate) {
      statusTraffic = 'LATE';
      trafficLabel = 'Atrasado';
    } else if (['RECIBIDO', 'EN_TALLER'].includes(workOrder.status) || !workOrder.status) {
      if (now > targetWorkshopDate) {
        statusTraffic = 'LATE';
        trafficLabel = 'Taller fuera de tiempo';
      } else {
        const msRemaining = targetWorkshopDate.getTime() - now.getTime();
        const requiredMechMs = mechHours * 60 * 60 * 1000;
        if (msRemaining < requiredMechMs || msRemaining < 30 * 60 * 1000) {
          statusTraffic = 'WARN';
          trafficLabel = 'En riesgo';
        } else {
          statusTraffic = 'OK';
          trafficLabel = 'En tiempo';
        }
      }
    } else if (workOrder.status === 'LAVADO') {
      const readyDeadline = new Date(deliveryDate.getTime() - bufferMs);
      if (now > readyDeadline) {
        statusTraffic = 'LATE';
        trafficLabel = 'Lavado excedido';
      } else if (readyDeadline.getTime() - now.getTime() < 45 * 60 * 1000) {
        statusTraffic = 'WARN';
        trafficLabel = 'Lavado ajustado';
      } else {
        statusTraffic = 'OK';
        trafficLabel = 'En lavado';
      }
    } else if (workOrder.status === 'CONTROL_CALIDAD') {
      if (now > deliveryDate) {
        statusTraffic = 'LATE';
        trafficLabel = 'Entrega demorada';
      } else {
        statusTraffic = 'OK';
        trafficLabel = 'Revisión final';
      }
    }
  }

  return {
    isWashCompleted,
    mechHours,
    needsWash,
    targetWorkshopDate,
    statusTraffic,
    trafficLabel,
  };
}

const TRAFFIC_BADGE = {
  OK: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  WARN: 'bg-amber-100 text-amber-800 border-amber-300',
  LATE: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
  DONE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const TRAFFIC_BORDER = {
  OK: 'border-l-emerald-500',
  WARN: 'border-l-amber-500',
  LATE: 'border-l-rose-500 ring-1 ring-rose-200',
  DONE: 'border-l-emerald-400 opacity-90',
};

function VehicleCard({ workOrder, standardHours, onSelect }) {
  const { vehicle } = workOrder;
  const timing = computeDeliveryTiming(workOrder, standardHours);
  const timeStr = workOrder.estimatedDeliveryAt
    ? new Date(workOrder.estimatedDeliveryAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : null;
  const targetWorkshopStr = timing.targetWorkshopDate
    ? timing.targetWorkshopDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(workOrder)}
      title={`Orden #${workOrder.orderNumber} • ${vehicle?.brand || ''} ${vehicle?.model || ''} • ${timing.trafficLabel} • Clic para ver etapas y servicios`}
      className={`group flex w-full flex-col rounded-md border border-outline-variant/80 border-l-4 bg-white p-2 text-left transition-all hover:border-primary hover:shadow-xs hover:scale-[1.01] cursor-pointer shadow-2xs ${
        TRAFFIC_BORDER[timing.statusTraffic] || 'border-l-outline-variant'
      }`}
    >
      {/* Header: #OR + Semáforo + Hora Promesa */}
      <div className="flex items-center justify-between gap-1 w-full mb-1">
        <span className="font-data-mono text-[11px] font-black text-primary truncate">
          #{workOrder.orderNumber}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`rounded px-1.5 py-0.2 font-label-caps text-[9px] font-extrabold border ${
              TRAFFIC_BADGE[timing.statusTraffic] || 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {timing.trafficLabel}
          </span>
          {timeStr && (
            <span className="font-data-mono text-[10px] font-bold text-primary bg-primary/5 px-1 py-0.2 rounded border border-primary/20">
              🕒 {timeStr}
            </span>
          )}
        </div>
      </div>

      {/* Auto y Placas */}
      <div className="flex items-center justify-between gap-1 w-full mb-1 text-[11px]">
        <span className="font-semibold text-primary truncate">
          {vehicle?.model || vehicle?.brand || 'Sin modelo'}
        </span>
        {vehicle?.plate && (
          <span className="font-data-mono text-[9px] text-on-surface-variant font-medium shrink-0">
            {vehicle.plate}
          </span>
        )}
      </div>

      {/* Badges de Trabajos y Servicios */}
      <div className="flex flex-wrap items-center gap-1 w-full my-0.5">
        {/* Servicio Base */}
        <span className="rounded bg-surface-container px-1 py-0.2 font-label-caps text-[9px] font-bold text-primary">
          🔧 {workOrder.serviceCategory || 'MANT'} ({timing.mechHours.toFixed(1)}h)
        </span>

        {/* Alineación */}
        {workOrder.alignmentNeeded && (
          <span className="rounded bg-purple-50 text-purple-800 border border-purple-200 px-1 py-0.2 font-label-caps text-[9px] font-bold">
            +Alineación
          </span>
        )}

        {/* Falla Reportada */}
        {workOrder.diagnosisNeeded && (
          <span
            className="rounded bg-amber-50 text-amber-900 border border-amber-300 px-1 py-0.2 font-label-caps text-[9px] font-bold"
            title="Requiere taller primero antes de lavar"
          >
            ⚠️ Falla
          </span>
        )}

        {/* Lavado Status (terminología estricta: nunca pre-lavado) */}
        {timing.needsWash ? (
          timing.isWashCompleted ? (
            <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-300 px-1 py-0.2 font-label-caps text-[9px] font-bold">
              ✓ Lavado: Realizado
            </span>
          ) : (
            <span className="rounded bg-blue-50 text-blue-800 border border-blue-200 px-1 py-0.2 font-label-caps text-[9px] font-medium">
              🚿 Lavado: Pendiente
            </span>
          )
        ) : (
          <span className="rounded bg-surface-container-low text-on-surface-variant/70 px-1 py-0.2 font-label-caps text-[9px]">
            Sin lavado
          </span>
        )}
      </div>

      {/* Footer: Meta de Taller y Etapa Actual */}
      <div className="flex items-center justify-between gap-1 w-full mt-1 pt-1 border-t border-outline-variant/40 text-[9px] font-data-mono text-on-surface-variant">
        {targetWorkshopStr ? (
          <span title={`Meta salida de taller (${timing.needsWash && !timing.isWashCompleted ? 'Promesa - 2.0h' : 'Promesa - 30m'})`}>
            Meta Taller: <strong className="text-primary font-bold">{targetWorkshopStr}</strong>
          </span>
        ) : (
          <span>Sin meta</span>
        )}
        <span className="rounded bg-surface-container px-1 py-0.2 font-label-caps text-[8px] font-bold text-on-surface-variant uppercase">
          {STAGE_LABEL[workOrder.status] || workOrder.status}
        </span>
      </div>
    </button>
  );
}

export default function PromiseTimeBoard({ workOrders, standardHours, onSelect, opStats }) {
  const [selectedDate, setSelectedDate] = useState(startOfToday);
  const [onlyActiveHours, setOnlyActiveHours] = useState(false);
  const [capacity, setCapacity] = useState(null);

  useEffect(() => {
    getCapacity('SERVICIO')
      .then(setCapacity)
      .catch(() => {});
  }, [workOrders]);

  const { rows, columns, cells } = useMemo(
    () => buildMatrix(workOrders, selectedDate, onlyActiveHours),
    [workOrders, selectedDate, onlyActiveHours]
  );

  const otherDays = useMemo(() => upcomingDaysWithOrders(workOrders, selectedDate), [workOrders, selectedDate]);

  const isToday = isSameDay(selectedDate, startOfToday());
  const totalCount = [...cells.values()].reduce((sum, items) => sum + items.length, 0);

  // Horas asignadas por cada técnico en el día seleccionado (incluye alineación si aplica)
  const techHoursMap = useMemo(() => {
    const map = new Map();
    const { withHour, noTime } = unitsForSelectedDate(workOrders, selectedDate);
    for (const wo of [...withHour, ...noTime]) {
      const name = wo.technician?.name || 'Sin asignar';
      const baseStd = wo.serviceCategory && standardHours ? standardHours[wo.serviceCategory] : 1.5;
      const std = baseStd + (wo.alignmentNeeded ? 0.5 : 0);
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

        {/* Indicadores Operativos y Capacidad de MO en pills compactos */}
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
          <span className="font-label-caps text-[10px] text-on-surface-variant/80 font-bold px-1">
            ({totalCount} en vista)
          </span>

          {/* DUAL CAPACITY PILLS: TÉCNICOS & LAVADORES */}
          {capacity && (
            <div className="flex flex-wrap items-center gap-1.5 pl-1.5 border-l border-outline-variant/60">
              {/* MO Técnicos */}
              <div
                title={`Capacidad Técnicos: ${capacity.capacityHours?.toFixed(1) || 0}h instaladas (${capacity.technicianCount || 0} técnicos), ${capacity.demandHours?.toFixed(1) || 0}h demanda estimada`}
                className="flex items-center gap-1 rounded-md border border-outline-variant bg-white px-2 py-0.5 shadow-2xs"
              >
                <span className="font-label-caps text-[9px] text-on-surface-variant font-bold">🔧 MO TÉCNICOS:</span>
                <span className="font-data-mono text-xs font-black text-primary">
                  {capacity.availableHours?.toFixed(1) || 0}h libres
                </span>
                <span className="text-[9px] text-on-surface-variant font-medium">
                  ({Math.round((capacity.utilization || 0) * 100)}% ocup.)
                </span>
              </div>

              {/* MO Lavadores */}
              <div
                title={`Capacidad Lavadores: ${capacity.washCapacity?.capacityHours?.toFixed(1) || 0}h (${capacity.washCapacity?.washerCount || 0} lavadores en catálogo), ${capacity.washCapacity?.totalUnits || 0} unidades con lavado requerido (1.5h c/u)`}
                className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50/70 px-2 py-0.5 shadow-2xs"
              >
                <span className="font-label-caps text-[9px] text-blue-900 font-bold">🚿 MO LAVADORES:</span>
                <span className="font-data-mono text-xs font-black text-blue-800">
                  {capacity.washCapacity?.availableHours?.toFixed(1) || 0}h libres
                </span>
                <span className="text-[9px] text-blue-700 font-bold">
                  ({capacity.washCapacity?.availableSlots || 0} cupos)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-barra: Semáforo y Otros Días */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 bg-surface-container/20 px-4 py-1.5 text-[10px] font-label-caps text-on-surface-variant">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-on-surface-variant">Semáforo de Entrega:</span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            En tiempo
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Por vencer / En riesgo
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Atrasado / Taller excedido
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-700" />
            Listo
          </span>
          <span className="text-[9px] text-on-surface-variant/70 font-normal pl-2 border-l border-outline-variant/60 hidden md:inline">
            💡 Regla: Entrega lista 30m antes • Lavado 1.5h • Meta taller = Promesa - 2h (o -30m si ya se lavó)
          </span>
        </div>

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

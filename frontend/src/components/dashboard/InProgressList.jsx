import { useMemo, useState } from 'react';
import PromiseDateSelector from './PromiseDateSelector.jsx';
import TechnicianSelector from './TechnicianSelector.jsx';
import ServiceCategorySelector from './ServiceCategorySelector.jsx';
import InlineCheckbox from './InlineCheckbox.jsx';
import InlineTextField from './InlineTextField.jsx';
import { STAGE_LABEL } from '../../constants/stages.js';
import { sortByPriority } from '../../utils/priority.js';
import { computeWorkProgress, PROGRESS_DOT_CLASS } from '../../utils/workProgress.js';
import { updateDiagnosisNeeded, updateWashNeeded, updateInsurer, updateReportNumber } from '../../api/workOrders.js';

const FINAL_STAGE_BADGE = new Set(['TERMINADO', 'ENTREGADO']);

function statusBadgeClass(status) {
  if (FINAL_STAGE_BADGE.has(status)) return 'bg-primary/10 text-primary';
  if (status === 'RECIBIDO') return 'bg-surface-container-high text-on-surface-variant';
  return 'bg-secondary-container/15 text-secondary';
}

function timeSince(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) {
    const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${minutes} min`;
  }
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
}

function isToday(dateString) {
  const d = new Date(dateString);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

// El desglose de prioridad va en el tooltip del número: mantiene el tablero limpio pero deja
// auditable por qué una unidad quedó arriba.
function priorityTooltip(rank, reasons, frozen) {
  if (!reasons) return undefined;
  const detail = reasons.map((r) => r.text).join(' · ');
  return frozen
    ? `No asignable — faltan refacciones\n${detail}`
    : `Prioridad ${rank} para asignar\n${detail}`;
}

const CELL = 'px-3 py-3 align-middle';

// Catálogo único de columnas posibles: label + cómo renderizar su celda para una orden. El
// orden por defecto y qué columnas aplican a cada módulo vive en `DEFAULT_COLUMN_KEYS`, no aquí
// — así una columna se define una sola vez aunque se use en Servicio, en HYP, o en ambos.
const COLUMN_DEFS = {
  rank: {
    label: '#',
    cellClassName: `${CELL} w-12`,
    render: (wo, { rank, reasons, frozen }) =>
      rank != null && (
        <span
          title={priorityTooltip(rank, reasons, frozen)}
          className={`flex h-7 w-7 items-center justify-center rounded-full font-label-caps text-[11px] ${
            frozen ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary text-on-primary'
          }`}
        >
          {frozen ? '—' : rank}
        </span>
      ),
  },
  unidad: {
    label: 'Unidad',
    cellClassName: CELL,
    render: (wo) => (
      <div className="flex items-center gap-2">
        {wo.vehicle.logoUrl && (
          <img src={wo.vehicle.logoUrl} alt={wo.vehicle.brand} className="h-7 w-7 shrink-0 object-contain" />
        )}
        <div className="min-w-0">
          <p className="truncate font-body-md text-sm font-semibold text-primary">
            {wo.vehicle.brand} {wo.vehicle.model}
            {wo.vehicle.year ? ` ${wo.vehicle.year}` : ''}
          </p>
          <p className="font-data-mono text-[11px] text-on-surface-variant">{wo.vehicle.plate}</p>
        </div>
      </div>
    ),
  },
  orden: {
    label: '# OR',
    cellClassName: `${CELL} truncate font-data-mono text-xs text-on-surface-variant`,
    render: (wo) => `#${wo.orderNumber}`,
  },
  cliente: {
    label: 'Cliente',
    cellClassName: CELL,
    render: (wo) => (
      <>
        <p className="truncate font-body-md text-sm text-primary">{wo.vehicle.customer?.name || 'Sin cliente'}</p>
        {wo.customerWaiting && <span className="font-label-caps text-[10px] text-error">Espera en agencia</span>}
      </>
    ),
  },
  entrega: {
    label: 'Hora de entrega',
    cellClassName: CELL,
    render: (wo, { onStatusChanged }) => <PromiseDateSelector workOrder={wo} onUpdated={onStatusChanged} />,
  },
  servicio: {
    label: 'Tipo de servicio',
    cellClassName: CELL,
    render: (wo, { onStatusChanged }) => (
      <>
        <ServiceCategorySelector workOrder={wo} onUpdated={onStatusChanged} />
        {wo.serviceType && (
          <p className="mt-1 truncate font-data-mono text-[10px] text-on-surface-variant/70" title={wo.serviceType}>
            {wo.serviceType.trim()}
          </p>
        )}
      </>
    ),
  },
  tecnico: {
    label: 'Técnico asignado',
    cellClassName: CELL,
    render: (wo, { onStatusChanged }) => <TechnicianSelector workOrder={wo} onUpdated={onStatusChanged} />,
  },
  diagnostico: {
    label: 'Diagnóstico',
    cellClassName: `${CELL} text-center`,
    render: (wo, { onStatusChanged }) => (
      <InlineCheckbox
        checked={wo.diagnosisNeeded}
        title="Requiere diagnóstico"
        onToggle={async (value) => onStatusChanged(await updateDiagnosisNeeded(wo.id, value))}
      />
    ),
  },
  lavado: {
    label: 'Con lavado',
    cellClassName: `${CELL} text-center`,
    render: (wo, { onStatusChanged }) => (
      <InlineCheckbox
        checked={wo.washNeeded}
        title="Requiere lavado"
        onToggle={async (value) => onStatusChanged(await updateWashNeeded(wo.id, value))}
      />
    ),
  },
  estatus: {
    label: 'Estatus',
    cellClassName: CELL,
    // El punto del semáforo va aquí y no en una columna propia: el estatus es donde el
    // controlista ya mira para saber "dónde va" la unidad, y el color responde "¿va a tiempo?"
    // sin gastar otra columna de la tabla, que ya es ancha.
    render: (wo, { progress }) => (
      <span className="flex items-center gap-2">
        {progress && (
          <span
            title={progress.label}
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${PROGRESS_DOT_CLASS[progress.level]}`}
          />
        )}
        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 font-label-caps text-[11px] ${statusBadgeClass(wo.status)}`}
        >
          {STAGE_LABEL[wo.status] || wo.status}
        </span>
      </span>
    ),
  },
  tiempo: {
    label: 'En taller',
    cellClassName: `${CELL} truncate font-data-mono text-xs text-on-surface-variant`,
    render: (wo) => timeSince(wo.receivedAt),
  },
  // Solo HYP maneja aseguradora — Servicio no las necesita (ver DEFAULT_COLUMN_KEYS).
  aseguradora: {
    label: 'Aseguradora',
    cellClassName: CELL,
    render: (wo, { onStatusChanged }) => (
      <InlineTextField
        value={wo.insurer}
        placeholder="Aseguradora"
        onSave={async (value) => onStatusChanged(await updateInsurer(wo.id, value))}
      />
    ),
  },
  reporte: {
    label: '# Reporte/Siniestro',
    cellClassName: CELL,
    render: (wo, { onStatusChanged }) => (
      <InlineTextField
        value={wo.reportNumber}
        placeholder="# Reporte/Siniestro"
        onSave={async (value) => onStatusChanged(await updateReportNumber(wo.id, value))}
      />
    ),
  },
};

// "Tipo de servicio", "Diagnóstico" y "Con lavado" no aplican a HYP: HYP no clasifica su
// trabajo con ese catálogo (es de mantenimiento/diagnóstico de Servicio) ni pasa por un paso de
// lavado propio dentro del pipeline de hojalatería y pintura.
const DEFAULT_COLUMN_KEYS = {
  SERVICIO: ['rank', 'unidad', 'orden', 'cliente', 'entrega', 'servicio', 'tecnico', 'diagnostico', 'lavado', 'estatus', 'tiempo'],
  HYP: ['rank', 'unidad', 'orden', 'cliente', 'entrega', 'tecnico', 'estatus', 'tiempo', 'aseguradora', 'reporte'],
};

// Anchos por defecto (px) — solo un punto de partida razonable; cada usuario los ajusta a su
// gusto arrastrando el borde derecho de la columna, y quedan guardados por módulo.
const DEFAULT_COLUMN_WIDTHS = {
  rank: 48,
  unidad: 220,
  orden: 90,
  cliente: 170,
  entrega: 150,
  servicio: 170,
  tecnico: 160,
  diagnostico: 100,
  lavado: 100,
  estatus: 150,
  tiempo: 80,
  aseguradora: 150,
  reporte: 160,
};
const MIN_COLUMN_WIDTH = 60;
const WIDTH_STORAGE_PREFIX = 'pitstop.inProgressColumnWidths.';

function loadColumnWidths(orderType) {
  try {
    const stored = JSON.parse(localStorage.getItem(WIDTH_STORAGE_PREFIX + orderType) || 'null');
    return stored && typeof stored === 'object' ? stored : {};
  } catch {
    return {};
  }
}

function saveColumnWidths(orderType, widths) {
  try {
    localStorage.setItem(WIDTH_STORAGE_PREFIX + orderType, JSON.stringify(widths));
  } catch {
    // Igual que con el orden de columnas: si no hay localStorage, simplemente no persiste.
  }
}

const STORAGE_PREFIX = 'pitstop.inProgressColumns.';

// El orden de columnas es preferencia de pantalla, no dato del negocio — se guarda por
// navegador (localStorage), uno por módulo, en vez de por endpoint. Si el catálogo de columnas
// de un módulo cambia (como al quitar Diagnóstico/Lavado de HYP), el orden guardado se depura
// contra el catálogo vigente: las claves que ya no aplican se descartan y las nuevas se agregan
// al final, para que un dato guardado viejo no rompa ni oculte columnas.
function loadColumnOrder(orderType) {
  const defaults = DEFAULT_COLUMN_KEYS[orderType] || DEFAULT_COLUMN_KEYS.SERVICIO;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_PREFIX + orderType) || 'null');
    if (!Array.isArray(stored)) return defaults;
    const filtered = stored.filter((k) => defaults.includes(k));
    const missing = defaults.filter((k) => !filtered.includes(k));
    return [...filtered, ...missing];
  } catch {
    return defaults;
  }
}

function saveColumnOrder(orderType, keys) {
  try {
    localStorage.setItem(STORAGE_PREFIX + orderType, JSON.stringify(keys));
  } catch {
    // Si localStorage no está disponible (modo privado, cuota llena), la tabla simplemente
    // vuelve al orden por defecto la próxima vez — no es un dato crítico.
  }
}

function WorkOrderTableRow({ wo, onStatusChanged, onSelect, rank, reasons, frozen, columns, atRiskStages, standardHours }) {
  const atRisk = atRiskStages && !atRiskStages.includes(wo.status);
  // Solo Servicio: HYP no clasifica por `serviceCategory` (esa columna no existe en su tabla),
  // así que ahí el semáforo sería siempre gris — puro ruido. Ver DEFAULT_COLUMN_KEYS.
  const progress =
    standardHours && wo.orderType === 'SERVICIO' ? computeWorkProgress(wo, standardHours) : null;
  return (
    <tr
      onClick={() => onSelect(wo)}
      title={atRisk ? 'Corte de mediodía: todavía no llega a una etapa segura para cumplir la promesa' : undefined}
      className={`cursor-pointer border-t transition-colors hover:bg-surface-container-low ${
        atRisk ? 'border-l-4 border-l-error border-t-outline-variant bg-error-container/10' : 'border-outline-variant'
      }`}
    >
      {columns.map((key) => {
        const def = COLUMN_DEFS[key];
        return (
          <td key={key} className={def.cellClassName}>
            {def.render(wo, { onStatusChanged, rank, reasons, frozen, progress })}
          </td>
        );
      })}
    </tr>
  );
}

// `prioritized`: aplica el motor de priorización (orden por urgencia + rango + tooltip).
// Solo lo usa "Ingresadas Hoy": es la cola que el controlista asigna a reparación. "Rezagadas"
// conserva su orden cronológico, porque ahí el criterio útil es la antigüedad, no la urgencia.
function WorkOrderGroup({
  title,
  badgeClass,
  workOrders,
  onStatusChanged,
  onSelect,
  emptyMessage,
  prioritized,
  columns,
  atRiskStages,
  standardHours,
}) {
  const rows = prioritized
    ? sortByPriority(workOrders).map((entry, i) => ({
        wo: entry.workOrder,
        rank: i + 1,
        reasons: entry.reasons,
        frozen: entry.frozen,
      }))
    : workOrders.map((wo) => ({ wo }));

  return (
    <tbody>
      <tr className="bg-surface-container-low">
        <td colSpan={columns.length} className="border-t border-outline-variant px-3 py-2">
          <div className="flex items-center justify-between">
            <span className={`font-label-caps text-[11px] uppercase tracking-wider ${badgeClass}`}>{title}</span>
            <span className="font-label-caps text-[11px] text-on-surface-variant">{workOrders.length}</span>
          </div>
        </td>
      </tr>

      {rows.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length}
            className="border-t border-outline-variant px-3 py-6 text-center text-sm text-on-surface-variant"
          >
            {emptyMessage}
          </td>
        </tr>
      ) : (
        rows.map((row) => (
          <WorkOrderTableRow
            key={row.wo.id}
            wo={row.wo}
            onStatusChanged={onStatusChanged}
            onSelect={onSelect}
            rank={row.rank}
            reasons={row.reasons}
            frozen={row.frozen}
            columns={columns}
            atRiskStages={atRiskStages}
            standardHours={standardHours}
          />
        ))
      )}
    </tbody>
  );
}

export default function InProgressList({
  workOrders,
  onStatusChanged,
  onSelect,
  orderType,
  atRiskStages,
  standardHours,
}) {
  const backlog = workOrders.filter((wo) => !isToday(wo.receivedAt));
  const enteredToday = workOrders.filter((wo) => isToday(wo.receivedAt));

  const [columnOrder, setColumnOrder] = useState(() => loadColumnOrder(orderType));
  const [columnWidths, setColumnWidths] = useState(() => loadColumnWidths(orderType));

  // Si se navega entre Servicio y HYP sin recargar la página, el catálogo de columnas cambia
  // (cada módulo tiene el suyo) — hay que recargar el orden guardado de ese módulo, no seguir
  // arrastrando el del anterior.
  const resolvedOrderType = DEFAULT_COLUMN_KEYS[orderType] ? orderType : 'SERVICIO';
  const columns = useMemo(() => {
    const defaults = DEFAULT_COLUMN_KEYS[resolvedOrderType];
    const filtered = columnOrder.filter((k) => defaults.includes(k));
    const missing = defaults.filter((k) => !filtered.includes(k));
    return [...filtered, ...missing].map((key) => ({ key, ...COLUMN_DEFS[key] }));
  }, [columnOrder, resolvedOrderType]);

  function moveColumn(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= columns.length) return;
    const next = columns.map((c) => c.key);
    [next[index], next[target]] = [next[target], next[index]];
    setColumnOrder(next);
    saveColumnOrder(resolvedOrderType, next);
  }

  const resolvedWidths = useMemo(() => {
    const merged = {};
    columns.forEach((c) => {
      merged[c.key] = columnWidths[c.key] ?? DEFAULT_COLUMN_WIDTHS[c.key] ?? 140;
    });
    return merged;
  }, [columns, columnWidths]);

  const totalWidth = columns.reduce((sum, c) => sum + resolvedWidths[c.key], 0);

  // Arrastre estilo hoja de cálculo: el ancho se guarda solo al soltar, no en cada pixel, para
  // no saturar localStorage mientras se arrastra.
  function handleResizeStart(e, key) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = resolvedWidths[key];

    function handleMouseMove(moveEvent) {
      const nextWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + (moveEvent.clientX - startX));
      setColumnWidths((prev) => ({ ...prev, [key]: nextWidth }));
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setColumnWidths((prev) => {
        saveColumnWidths(resolvedOrderType, prev);
        return prev;
      });
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <section className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest card-elevation">
      <div className="flex items-center justify-between border-b border-outline-variant px-card-padding py-4">
        <h3 className="font-headline-md text-headline-md text-primary">Unidades en Proceso</h3>
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {workOrders.length} vehículo(s) en el taller
        </span>
      </div>

      {workOrders.length === 0 ? (
        <p className="px-card-padding py-8 text-center font-body-md text-on-surface-variant">
          No hay unidades en proceso de reparación en este momento.
        </p>
      ) : (
        // Con una columna por dato la tabla no cabe en pantallas angostas: se desplaza en
        // horizontal dentro de la sección en vez de comprimir las celdas.
        <div className="overflow-x-auto">
          <table className="table-fixed border-collapse text-left" style={{ width: totalWidth }}>
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} style={{ width: resolvedWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="relative px-3 py-2 font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant"
                  >
                    <div className="flex items-center gap-1 overflow-hidden pr-2">
                      <span className="truncate">{col.label}</span>
                      <span className="flex shrink-0">
                        <button
                          type="button"
                          onClick={() => moveColumn(i, -1)}
                          disabled={i === 0}
                          title="Mover columna a la izquierda"
                          className="material-symbols-outlined text-xs text-on-surface-variant/60 hover:text-primary disabled:pointer-events-none disabled:opacity-20"
                          data-icon="chevron_left"
                        >
                          chevron_left
                        </button>
                        <button
                          type="button"
                          onClick={() => moveColumn(i, 1)}
                          disabled={i === columns.length - 1}
                          title="Mover columna a la derecha"
                          className="material-symbols-outlined text-xs text-on-surface-variant/60 hover:text-primary disabled:pointer-events-none disabled:opacity-20"
                          data-icon="chevron_right"
                        >
                          chevron_right
                        </button>
                      </span>
                    </div>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, col.key)}
                      title="Arrastra para ajustar el ancho de la columna"
                      className="absolute inset-y-0 right-0 w-2 cursor-col-resize select-none hover:bg-primary/30"
                    />
                  </th>
                ))}
              </tr>
            </thead>

            <WorkOrderGroup
              title="Ingresadas Hoy — orden sugerido para asignar"
              badgeClass="text-primary"
              workOrders={enteredToday}
              onStatusChanged={onStatusChanged}
              onSelect={onSelect}
              emptyMessage="Aún no ingresan unidades hoy."
              prioritized
              columns={columns.map((c) => c.key)}
              atRiskStages={atRiskStages}
              standardHours={standardHours}
            />
            <WorkOrderGroup
              title="Rezagadas (días anteriores)"
              badgeClass="text-error"
              workOrders={backlog}
              onStatusChanged={onStatusChanged}
              onSelect={onSelect}
              emptyMessage="No hay unidades rezagadas."
              columns={columns.map((c) => c.key)}
              atRiskStages={atRiskStages}
              standardHours={standardHours}
            />
          </table>
        </div>
      )}
    </section>
  );
}

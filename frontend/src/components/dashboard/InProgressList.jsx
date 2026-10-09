import { useMemo, useState } from 'react';
import PromiseDateSelector from './PromiseDateSelector.jsx';
import TechnicianSelector from './TechnicianSelector.jsx';
import ServiceCategorySelector from './ServiceCategorySelector.jsx';
import InlineCheckbox from './InlineCheckbox.jsx';
import InlineTextField from './InlineTextField.jsx';
import { STAGE_LABEL, getStages } from '../../constants/stages.js';
import { sortByPriority } from '../../utils/priority.js';
import { computeWorkProgress, PROGRESS_DOT_CLASS } from '../../utils/workProgress.js';
import {
  updateDiagnosisNeeded,
  updateWashNeeded,
  updateInsurer,
  updateReportNumber,
  addStageComment,
  updateWorkOrderSubState,
  updateWorkOrderStatus,
} from '../../api/workOrders.js';

const FINAL_STAGE_BADGE = new Set(['TERMINADO', 'ENTREGADO']);

function statusBadgeClass(status) {
  if (FINAL_STAGE_BADGE.has(status)) {
    return 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold';
  }
  if (status === 'RECIBIDO') {
    return 'bg-blue-100 text-blue-800 border border-blue-200 font-medium';
  }
  // Resaltado en VERDE brillante para la etapa actual en curso
  return 'bg-emerald-600 text-white font-bold shadow-xs border border-emerald-700 ring-1 ring-emerald-400/40';
}

function timeSince(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  const diffMs = Math.max(0, Date.now() - d.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) {
    const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${minutes} min`;
  }
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
}

function daysSince(dateString) {
  if (!dateString) return 0;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 0;
  const diffMs = Math.max(0, Date.now() - d.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function isToday(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function formatDateTimeShort(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function promiseBadge(dateString) {
  if (!dateString) return null;
  const delivery = new Date(dateString);
  if (isNaN(delivery.getTime())) return null;
  const now = new Date();
  const isPast = delivery < now;
  const isSameDay = delivery.toDateString() === now.toDateString();

  if (isPast) {
    return {
      text: 'Vencida',
      className: 'bg-error-container/60 text-on-error-container border border-error/40 font-bold',
    };
  }
  if (isSameDay) {
    return {
      text: 'Hoy',
      className: 'bg-amber-100 text-amber-800 border border-amber-300 font-bold',
    };
  }
  return {
    text: 'En tiempo',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
}

function priorityTooltip(rank, reasons, frozen) {
  if (!reasons) return undefined;
  const detail = reasons.map((r) => r.text).join(' · ');
  return frozen
    ? `No asignable — faltan refacciones\n${detail}`
    : `Prioridad ${rank} para asignar\n${detail}`;
}

const CELL = 'px-3 py-3 align-middle';

const COLUMN_DEFS = {
  rank: {
    label: '#',
    cellClassName: `${CELL} w-12 text-center`,
    render: (wo, { rank, reasons, frozen }) =>
      rank != null && (
        <span
          title={priorityTooltip(rank, reasons, frozen)}
          className={`flex h-7 w-7 items-center justify-center rounded-full font-label-caps text-[11px] font-bold shadow-xs ${
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
    render: (wo, { onSelect }) => (
      <button
        type="button"
        onClick={() => onSelect?.(wo)}
        className="group flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer"
        title="Clic para abrir etapas y expediente"
      >
        {wo.vehicle?.logoUrl && (
          <img src={wo.vehicle.logoUrl} alt={wo.vehicle.brand} className="h-7 w-7 shrink-0 object-contain" />
        )}
        <div className="min-w-0">
          <p className="truncate font-body-md text-sm font-bold text-primary group-hover:text-emerald-700 group-hover:underline">
            {wo.vehicle?.brand} {wo.vehicle?.model}
            {wo.vehicle?.year ? ` ${wo.vehicle.year}` : ''}
          </p>
          <p className="font-data-mono text-[11px] text-on-surface-variant flex items-center gap-1">
            <span>{wo.vehicle?.plate || 'Sin placas'}</span>
            <span className="text-[10px] text-emerald-600 font-bold opacity-80 group-hover:opacity-100">⚡ Ver</span>
          </p>
        </div>
      </button>
    ),
  },
  orden: {
    label: '# OR',
    cellClassName: `${CELL} truncate font-data-mono text-xs font-bold text-primary`,
    render: (wo, { onSelect }) => (
      <button
        type="button"
        onClick={() => onSelect?.(wo)}
        className="font-data-mono text-xs font-bold text-primary hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-0.5"
        title="Clic para abrir etapas"
      >
        #{wo.orderNumber}
      </button>
    ),
  },
  marca: {
    label: 'Marca',
    cellClassName: `${CELL} font-body-md text-xs font-bold text-primary`,
    render: (wo) => (
      <span className="inline-flex items-center gap-1.5 font-bold text-xs text-primary">
        {wo.vehicle?.brand || '—'}
      </span>
    ),
  },
  agencia: {
    label: 'Agencia',
    cellClassName: `${CELL} text-xs text-primary`,
    render: (wo) => {
      const agencyName = wo.agency || wo.tower || 'Tuxtla Poniente';
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-[11px] text-blue-800 border border-blue-200">
          <span className="material-symbols-outlined text-xs" data-icon="store">
            store
          </span>
          <span className="truncate max-w-[130px]">{agencyName}</span>
        </span>
      );
    },
  },
  torre: {
    label: 'Torre',
    cellClassName: `${CELL} text-center`,
    render: (wo) => {
      const val = wo.tower || wo.advisorCode || wo.subState || '—';
      return (
        <span className="inline-flex rounded-md bg-surface-container px-2 py-0.5 font-data-mono text-[11px] font-semibold text-primary">
          {val}
        </span>
      );
    },
  },
  color: {
    label: 'Color',
    cellClassName: `${CELL} truncate font-body-md text-xs text-on-surface-variant`,
    render: (wo) => wo.vehicle?.color || '—',
  },
  cliente: {
    label: 'Cliente',
    cellClassName: CELL,
    render: (wo) => (
      <>
        <p className="truncate font-body-md text-sm text-primary font-medium">
          {wo.vehicle?.customer?.name || 'Sin cliente'}
        </p>
        {wo.customerWaiting && (
          <span className="inline-block mt-0.5 rounded-full bg-error-container/40 px-2 py-0.5 font-label-caps text-[9px] font-bold text-on-error-container">
            Espera en agencia
          </span>
        )}
      </>
    ),
  },
  promesa: {
    label: 'Promesa (Fecha/Hora)',
    cellClassName: CELL,
    render: (wo, { onStatusChanged }) => {
      const badge = promiseBadge(wo.estimatedDeliveryAt);
      return (
        <div>
          <PromiseDateSelector workOrder={wo} onUpdated={onStatusChanged} />
          {badge && (
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`rounded-full px-2 py-0.5 font-label-caps text-[9px] ${badge.className}`}>
                {badge.text}
              </span>
              {wo.estimatedDeliveryAt && (
                <span className="font-data-mono text-[10px] text-on-surface-variant">
                  {formatDateTimeShort(wo.estimatedDeliveryAt)}
                </span>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  kms: {
    label: 'Kms',
    cellClassName: `${CELL} truncate font-data-mono text-xs text-on-surface-variant`,
    render: (wo) => (wo.vehicle?.mileage ? `${wo.vehicle.mileage.toLocaleString()} km` : wo.kms || '—'),
  },
  antiguedad: {
    label: 'Antigüedad',
    cellClassName: `${CELL} text-center`,
    render: (wo) => {
      const days = daysSince(wo.receivedAt);
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 font-data-mono text-xs font-bold ${
            days > 60
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : days > 30
              ? 'bg-orange-100 text-orange-800 border border-orange-300'
              : days >= 15
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : days > 0
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {days} d
        </span>
      );
    },
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
    label: 'Estatus (Clic p/ actualizar)',
    cellClassName: CELL,
    render: (wo, { onSelect, progress }) => (
      <button
        type="button"
        onClick={() => onSelect?.(wo)}
        title="Clic para actualizar estatus / avanzar etapa"
        className="group flex items-center gap-2 text-left cursor-pointer transition-transform hover:scale-[1.03]"
      >
        {progress && (
          <span
            title={progress.label}
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${PROGRESS_DOT_CLASS[progress.level]}`}
          />
        )}
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-label-caps text-[11px] ${statusBadgeClass(
            wo.status
          )} group-hover:ring-2 group-hover:ring-emerald-400 group-hover:shadow-md transition-all`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          {STAGE_LABEL[wo.status] || wo.status}
          <span className="material-symbols-outlined text-xs opacity-80 group-hover:opacity-100" data-icon="edit">
            edit
          </span>
        </span>
      </button>
    ),
  },
  tiempo: {
    label: 'En taller',
    cellClassName: `${CELL} truncate font-data-mono text-xs text-on-surface-variant`,
    render: (wo) => timeSince(wo.receivedAt),
  },
  refacciones: {
    label: 'Refacciones ($)',
    cellClassName: `${CELL} text-center`,
    render: (wo, { onSelect }) => {
      const parts = wo.pendingParts || [];
      const count = parts.length;
      const totalAmount = parts.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      const pendingCount = parts.filter((p) => !p.received).length;

      if (count === 0) {
        return (
          <span className="text-on-surface-variant/40 text-[11px] italic font-medium">
            Sin refac.
          </span>
        );
      }

      return (
        <button
          type="button"
          onClick={() => onSelect?.(wo)}
          className={`group inline-flex flex-col items-center justify-center rounded-lg px-2.5 py-1 border transition-all cursor-pointer shadow-2xs hover:scale-[1.02] ${
            pendingCount > 0
              ? 'bg-amber-50/90 border-amber-300 hover:bg-amber-100 text-amber-950'
              : 'bg-emerald-50/90 border-emerald-300 hover:bg-emerald-100 text-emerald-950'
          }`}
          title={`${count} refacción(es) cargada(s). ${pendingCount} en proceso. Monto: $${totalAmount.toLocaleString()} MXN. Clic para ver`}
        >
          <span className="font-data-mono text-xs font-black text-emerald-800">
            ${totalAmount.toLocaleString()} <span className="text-[9px] font-normal">MXN</span>
          </span>
          <span className="text-[10px] font-bold flex items-center gap-1 opacity-90">
            <span className="material-symbols-outlined text-xs">
              {pendingCount > 0 ? 'hourglass_top' : 'check_circle'}
            </span>
            {count} refac. {pendingCount > 0 ? `(${pendingCount} pend.)` : '(listas)'}
          </span>
        </button>
      );
    },
  },
  transito: {
    label: 'En Tránsito',
    cellClassName: `${CELL} text-center`,
    render: (wo, { onStatusChanged }) => {
      const isInTransit = wo.subState === 'EN_TRANSITO';
      return (
        <button
          type="button"
          onClick={async () => {
            const nextSub = isInTransit ? null : 'EN_TRANSITO';
            onStatusChanged(await updateWorkOrderSubState(wo.id, nextSub));
          }}
          title={isInTransit ? 'Quitar de En Tránsito' : 'Mover a En Tránsito'}
          className={`rounded-full px-2.5 py-1 font-label-caps text-[10px] font-bold transition-colors ${
            isInTransit
              ? 'bg-purple-600 text-white shadow-xs'
              : 'border border-outline-variant text-on-surface-variant hover:border-purple-600 hover:text-purple-700'
          }`}
        >
          {isInTransit ? '🚚 En Tránsito' : '+ Tránsito'}
        </button>
      );
    },
  },
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

const DEFAULT_COLUMN_KEYS = {
  SERVICIO: [
    'rank',
    'unidad',
    'agencia',
    'orden',
    'torre',
    'color',
    'cliente',
    'promesa',
    'kms',
    'antiguedad',
    'servicio',
    'tecnico',
    'diagnostico',
    'lavado',
    'estatus',
    'refacciones',
    'tiempo',
  ],
  HYP: [
    'rank',
    'unidad',
    'agencia',
    'orden',
    'color',
    'cliente',
    'promesa',
    'antiguedad',
    'tecnico',
    'estatus',
    'refacciones',
    'transito',
    'tiempo',
    'aseguradora',
    'reporte',
  ],
};

const DEFAULT_COLUMN_WIDTHS = {
  rank: 48,
  unidad: 200,
  marca: 90,
  agencia: 130,
  orden: 85,
  torre: 80,
  color: 90,
  cliente: 160,
  promesa: 170,
  kms: 90,
  antiguedad: 90,
  entrega: 140,
  servicio: 160,
  tecnico: 150,
  diagnostico: 90,
  lavado: 90,
  estatus: 170,
  refacciones: 130,
  transito: 110,
  tiempo: 80,
  aseguradora: 140,
  reporte: 150,
};

const MIN_COLUMN_WIDTH = 55;
const WIDTH_STORAGE_PREFIX = 'pitstop.inProgressColumnWidths.';
const STORAGE_PREFIX = 'pitstop.inProgressColumns.';

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
    // safe fallback
  }
}

function loadColumnOrder(orderType) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_PREFIX + orderType) || 'null');
    if (Array.isArray(stored)) {
      const filtered = stored.filter((k) => k !== 'acciones' && COLUMN_DEFS[k]);
      return filtered.length > 0 ? filtered : DEFAULT_COLUMN_KEYS[orderType] || [];
    }
    return DEFAULT_COLUMN_KEYS[orderType] || [];
  } catch {
    return DEFAULT_COLUMN_KEYS[orderType] || [];
  }
}

function saveColumnOrder(orderType, order) {
  try {
    localStorage.setItem(STORAGE_PREFIX + orderType, JSON.stringify(order));
  } catch {
    // safe fallback
  }
}

function ExpandableOrderDetails({ workOrder, onStatusChanged, onSelect }) {
  const [newComment, setNewComment] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const [advancingStage, setAdvancingStage] = useState(false);
  const [selectedJumpStage, setSelectedJumpStage] = useState('');

  const comments = workOrder.stageComments || [];
  const stages = getStages(workOrder.orderType);
  const currentIndex = stages.findIndex((s) => s.key === workOrder.status);
  const nextStage = stages[currentIndex + 1] || null;

  async function handleAdvanceTo(targetStageKey, noteText) {
    if (!targetStageKey || advancingStage) return;
    setAdvancingStage(true);
    try {
      const updated = await updateWorkOrderStatus(workOrder.id, targetStageKey, noteText);
      onStatusChanged?.(updated);
    } catch {
      // handled
    } finally {
      setAdvancingStage(false);
    }
  }

  async function handleAddQuickComment(e, commentOverride) {
    if (e) e.preventDefault();
    const textToSave = (commentOverride || newComment).trim();
    if (!textToSave || savingComment) return;
    setSavingComment(true);
    try {
      const updated = await addStageComment(workOrder.id, workOrder.status, textToSave);
      onStatusChanged?.(updated);
      setNewComment('');
    } catch {
      // error handled
    } finally {
      setSavingComment(false);
    }
  }

  return (
    <div className="border-t-2 border-emerald-500/40 bg-slate-50/95 p-4 space-y-4 text-xs shadow-inner">
      {/* 1. PIPELINE DE ETAPAS INTERACTIVO EN LÍNEA */}
      <div className="rounded-xl border border-outline-variant bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
              ⚡
            </span>
            <div>
              <h4 className="font-headline-md text-sm font-bold text-primary">
                Flujo de Etapas ({workOrder.orderType}) — Etapa Actual: <span className="text-emerald-600 font-extrabold">{STAGE_LABEL[workOrder.status] || workOrder.status}</span>
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                Haz clic en cualquier etapa para mover la orden o utiliza los botones de avance rápido.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {nextStage && (
              <button
                type="button"
                onClick={() => handleAdvanceTo(nextStage.key, `Avanzado a ${nextStage.label}`)}
                disabled={advancingStage}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 font-label-caps text-xs font-bold text-white shadow-sm hover:bg-emerald-700 hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                title={`Avanzar inmediatamente a ${nextStage.label}`}
              >
                <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
                  arrow_forward
                </span>
                {advancingStage ? 'Actualizando...' : `Avanzar a: ${nextStage.label}`}
              </button>
            )}

            <div className="flex items-center gap-1">
              <select
                value={selectedJumpStage}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    handleAdvanceTo(val, `Cambio directo a ${STAGE_LABEL[val] || val}`);
                    setSelectedJumpStage('');
                  }
                }}
                className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-xs text-primary font-medium focus:border-primary focus:outline-none"
              >
                <option value="">Mover a otra etapa...</option>
                {stages.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label} {s.key === workOrder.status ? ' (Actual)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => onSelect?.(workOrder)}
              className="flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 font-label-caps text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm" data-icon="open_in_new">
                open_in_new
              </span>
              Ver Ficha / Modal
            </button>
          </div>
        </div>

        {/* Mini Stepper Horizontal */}
        <div className="overflow-x-auto pb-2 pt-1">
          <div className="flex items-center gap-2 min-w-max">
            {stages.map((st, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isNext = idx === currentIndex + 1;

              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => handleAdvanceTo(st.key, `Mover a etapa ${st.label}`)}
                  disabled={advancingStage}
                  title={`Clic para mover la orden a ${st.label}`}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-2 border-emerald-600 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 font-bold scale-[1.02]'
                      : isPast
                      ? 'border-emerald-300 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100'
                      : isNext
                      ? 'border-blue-300 bg-blue-50/70 text-blue-900 hover:bg-blue-100 font-medium'
                      : 'border-outline-variant/60 bg-surface-container-low text-on-surface-variant hover:bg-white hover:border-primary/40'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCurrent
                        ? 'bg-white text-emerald-700'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <div>
                    <p className={`text-xs leading-tight ${isCurrent ? 'font-black text-white' : 'font-semibold'}`}>
                      {st.label}
                    </p>
                    <p className={`text-[10px] ${isCurrent ? 'text-emerald-100' : 'text-on-surface-variant/70'}`}>
                      {isCurrent ? '● EN CURSO' : isPast ? 'Completada' : 'Pendiente'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. GRID CON DETALLES Y BITÁCORA DE SEGUIMIENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Info del vehículo & orden */}
        <div className="rounded-xl border border-outline-variant bg-white p-3.5 space-y-2 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
            <span className="font-label-caps text-[11px] text-primary font-bold uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">directions_car</span>
              Ficha SIA NXT
            </span>
            <span className="font-data-mono text-[11px] font-bold text-emerald-700">#{workOrder.orderNumber}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-on-surface pt-1">
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Agencia:</span>
              <span className="font-bold text-[11px] text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-blue-600">store</span>
                {workOrder.agency || workOrder.tower || 'Tuxtla Poniente'}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Marca:</span>
              <span className="font-bold text-[11px] text-primary">{workOrder.vehicle?.brand || '—'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">VIN:</span>
              <span className="font-data-mono font-medium text-[11px]">{workOrder.vehicle?.vin || '—'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Color:</span>
              <span className="font-medium text-[11px]">{workOrder.vehicle?.color || '—'}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Kms:</span>
              <span className="font-data-mono font-medium text-[11px]">
                {workOrder.vehicle?.mileage ? `${workOrder.vehicle.mileage.toLocaleString()} km` : workOrder.kms || '—'}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-[10px] uppercase font-semibold">Asesor:</span>
              <span className="font-medium text-[11px]">{workOrder.advisor?.name || workOrder.advisorCode || '—'}</span>
            </div>
          </div>

          {workOrder.notes && (
            <div className="mt-2 border-t border-outline-variant/60 pt-2 text-on-surface-variant">
              <span className="font-bold text-primary text-[11px]">Observaciones iniciales:</span>
              <p className="mt-0.5 text-[11px] italic bg-surface-container-low p-2 rounded">{workOrder.notes}</p>
            </div>
          )}
        </div>

        {/* 2. Refacciones cargadas a esta orden */}
        <div className="rounded-xl border border-outline-variant bg-white p-3.5 space-y-2 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
            <span className="font-label-caps text-[11px] text-primary font-bold uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-amber-600">inventory_2</span>
              Refacciones Cargadas ({workOrder.pendingParts?.length || 0})
            </span>
            <span className="font-data-mono text-[11px] font-black text-emerald-700">
              ${(workOrder.pendingParts?.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0).toLocaleString()} MXN
            </span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5 pt-1">
            {workOrder.pendingParts && workOrder.pendingParts.length > 0 ? (
              workOrder.pendingParts.map((part) => (
                <div key={part.id} className="rounded-lg border border-outline-variant/40 bg-slate-50 p-2 text-[11px]">
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-data-mono text-primary font-black">{part.partNumber}</span>
                    <span className="font-data-mono text-emerald-700 font-black">
                      ${(Number(part.amount) || 0).toLocaleString()} MXN
                    </span>
                  </div>
                  <p className="text-on-surface text-[10px] truncate mt-0.5">{part.description || 'Sin descripción'}</p>
                  <div className="flex items-center justify-between text-[9px] text-on-surface-variant mt-1 border-t border-outline-variant/30 pt-0.5">
                    <span>Pedido: {part.orderNumber}</span>
                    <span className={`font-bold ${part.received ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {part.received ? '✓ Recibida' : '⏳ En proceso'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-on-surface-variant/60 italic py-5 text-[11px]">
                Sin refacciones cargadas a esta orden.
              </p>
            )}
          </div>
        </div>

        {/* 3. Bitácora de comentarios y seguimientos en tiempo real */}
        <div className="rounded-xl border border-outline-variant bg-white p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2 mb-2">
              <span className="font-label-caps text-[11px] text-primary font-bold uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600" data-icon="history_edu">
                  history_edu
                </span>
                Bitácora de Seguimientos y Comentarios ({comments.length})
              </span>
              <span className="text-[10px] text-on-surface-variant">
                Etapa actual: <span className="font-bold text-emerald-700">{STAGE_LABEL[workOrder.status] || workOrder.status}</span>
              </span>
            </div>

            {/* Listado de comentarios */}
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-outline-variant/50 bg-slate-50/80 p-2.5 text-xs">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-primary">{c.user?.name || 'Usuario'}</span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-label-caps text-[9px] font-bold text-emerald-800 border border-emerald-200">
                          {STAGE_LABEL[c.stage] || c.stage}
                        </span>
                      </div>
                      <span className="font-data-mono text-on-surface-variant/80">
                        {new Date(c.createdAt).toLocaleString('es-MX', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-on-surface text-xs leading-relaxed">{c.comment}</p>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-on-surface-variant/70 italic bg-slate-50 rounded-lg border border-dashed border-outline-variant">
                  No hay seguimientos registrados para esta orden. Escribe uno abajo.
                </div>
              )}
            </div>

            {/* Botones de comentario rápido */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-on-surface-variant font-semibold">Atajos:</span>
              {[
                '📞 Cliente notificado',
                '📦 Esperando refacción de almacén',
                '🔧 En prueba de ruta',
                '🧼 Unidad enviada a lavado',
                '✅ Control de calidad aprobado',
                '🚗 Listo para entrega',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleAddQuickComment(null, chip)}
                  disabled={savingComment}
                  className="rounded-full border border-outline-variant bg-white px-2 py-0.5 text-[10px] text-on-surface-variant hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de nuevo comentario */}
          <form onSubmit={handleAddQuickComment} className="mt-3 flex gap-2 pt-2 border-t border-outline-variant/60">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un seguimiento o comentario (asesor / técnico)..."
              className="flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs text-primary focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={savingComment || !newComment.trim()}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 font-label-caps text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              {savingComment ? 'Guardando...' : 'Comentar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function WorkOrderRow({
  workOrder,
  onStatusChanged,
  onSelect,
  rank,
  reasons,
  frozen,
  columns,
  atRiskStages,
  standardHours,
}) {
  const [expanded, setExpanded] = useState(false);
  const isAtRisk = atRiskStages
    ? Array.isArray(atRiskStages)
      ? !atRiskStages.includes(workOrder.status)
      : atRiskStages instanceof Set
      ? !atRiskStages.has(workOrder.status)
      : false
    : false;
  const progress =
    standardHours && workOrder.orderType === 'SERVICIO' ? computeWorkProgress(workOrder, standardHours) : null;

  return (
    <>
      <tr
        className={`border-b border-outline-variant/60 transition-colors hover:bg-surface-container-low/60 ${
          isAtRisk ? 'bg-error-container/10' : ''
        } ${expanded ? 'bg-primary/5' : ''}`}
      >
        <td className="w-8 px-2 py-3 text-center align-middle">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            title={expanded ? 'Ocultar detalles' : 'Expandir fila'}
            className="flex h-6 w-6 items-center justify-center rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <span className={`material-symbols-outlined text-base transition-transform ${expanded ? 'rotate-90' : ''}`}>
              chevron_right
            </span>
          </button>
        </td>
        {columns.map((colKey) => {
          const def = COLUMN_DEFS[colKey];
          if (!def) return null;
          return (
            <td key={colKey} className={def.cellClassName}>
              {def.render(workOrder, {
                onStatusChanged,
                onSelect,
                rank,
                reasons,
                frozen,
                progress,
              })}
            </td>
          );
        })}
      </tr>
      {expanded && (
        <tr>
          <td colSpan={columns.length + 1} className="p-0">
            <ExpandableOrderDetails
              workOrder={workOrder}
              onStatusChanged={onStatusChanged}
              onSelect={onSelect}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function WorkOrderGroup({
  title,
  badgeClass,
  workOrders,
  onStatusChanged,
  onSelect,
  emptyMessage,
  prioritized = false,
  columns,
  atRiskStages,
  standardHours,
}) {
  const rows = useMemo(() => {
    if (!prioritized) return workOrders.map((wo) => ({ workOrder: wo }));
    const sorted = sortByPriority(workOrders);
    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [workOrders, prioritized]);

  return (
    <tbody className="divide-y divide-outline-variant">
      <tr className="bg-surface-container-low">
        <th
          colSpan={columns.length + 1}
          scope="colgroup"
          className={`px-4 py-2 font-label-caps text-[11px] font-bold uppercase tracking-wider ${badgeClass}`}
        >
          {title} ({workOrders.length})
        </th>
      </tr>
      {rows.length === 0 ? (
        <tr>
          <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-xs text-on-surface-variant">
            {emptyMessage}
          </td>
        </tr>
      ) : (
        rows.map((row) => (
          <WorkOrderRow
            key={row.workOrder?.id}
            workOrder={row.workOrder}
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
  // Separación por estado: En Tránsito (HYP), Ingresadas Hoy (antigüedad 0), Rezagadas (días anteriores)
  const inTransit = workOrders.filter((wo) => wo.subState === 'EN_TRANSITO');
  const notInTransit = workOrders.filter((wo) => wo.subState !== 'EN_TRANSITO');
  const enteredToday = notInTransit.filter((wo) => isToday(wo.receivedAt));
  const backlog = notInTransit.filter((wo) => !isToday(wo.receivedAt));

  const resolvedOrderType = DEFAULT_COLUMN_KEYS[orderType] ? orderType : 'SERVICIO';
  const [columnOrder, setColumnOrder] = useState(() => loadColumnOrder(resolvedOrderType));
  const [columnWidths, setColumnWidths] = useState(() => loadColumnWidths(resolvedOrderType));

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
      merged[c.key] = columnWidths[c.key] ?? DEFAULT_COLUMN_WIDTHS[c.key] ?? 130;
    });
    return merged;
  }, [columns, columnWidths]);

  const totalWidth = columns.reduce((sum, c) => sum + resolvedWidths[c.key], 40);

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
    <section className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest card-elevation overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline-variant px-card-padding py-4 bg-white">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary font-bold">Unidades en Proceso</h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Haz clic en <span className="font-bold">&gt;</span> para expandir comentarios y detalles estilo SIA NXT
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 font-label-caps text-label-caps font-bold text-primary">
          {workOrders.length} vehículo(s) activo(s)
        </span>
      </div>

      {workOrders.length === 0 ? (
        <p className="px-card-padding py-8 text-center font-body-md text-on-surface-variant">
          No hay unidades en proceso de reparación en este momento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-fixed border-collapse text-left" style={{ width: Math.max(totalWidth, 1100) }}>
            <colgroup>
              <col style={{ width: 40 }} />
              {columns.map((col) => (
                <col key={col.key} style={{ width: resolvedWidths[col.key] }} />
              ))}
            </colgroup>
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="w-8 px-2 py-2" />
                {columns.map((col, i) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="relative px-3 py-2.5 font-label-caps text-[10px] font-bold uppercase tracking-wider text-on-surface-variant select-none"
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
                        >
                          chevron_left
                        </button>
                        <button
                          type="button"
                          onClick={() => moveColumn(i, 1)}
                          disabled={i === columns.length - 1}
                          title="Mover columna a la derecha"
                          className="material-symbols-outlined text-xs text-on-surface-variant/60 hover:text-primary disabled:pointer-events-none disabled:opacity-20"
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

            {/* Sección En Tránsito (HYP o marcadas) */}
            {inTransit.length > 0 && (
              <WorkOrderGroup
                title="🚚 En Tránsito"
                badgeClass="text-purple-700 bg-purple-50 border-t border-purple-200"
                workOrders={inTransit}
                onStatusChanged={onStatusChanged}
                onSelect={onSelect}
                emptyMessage="No hay unidades en tránsito."
                columns={columns.map((c) => c.key)}
                atRiskStages={atRiskStages}
                standardHours={standardHours}
              />
            )}

            {/* Ingresadas Hoy (antigüedad 0) */}
            <WorkOrderGroup
              title="Ingresadas Hoy — orden sugerido para asignar (Antigüedad 0)"
              badgeClass="text-primary bg-primary/5"
              workOrders={enteredToday}
              onStatusChanged={onStatusChanged}
              onSelect={onSelect}
              emptyMessage="Aún no ingresan unidades hoy."
              prioritized
              columns={columns.map((c) => c.key)}
              atRiskStages={atRiskStages}
              standardHours={standardHours}
            />

            {/* Rezagadas (días anteriores) */}
            <WorkOrderGroup
              title="Rezagadas (días anteriores / antigüedad 1+)"
              badgeClass="text-error bg-error-container/10"
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

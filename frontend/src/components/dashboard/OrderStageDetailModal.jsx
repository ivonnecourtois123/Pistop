import { useEffect, useState } from 'react';
import { updateWorkOrderStatus, addStageComment, updateCustomerWaiting } from '../../api/workOrders.js';
import { getStages } from '../../constants/stages.js';
import OrderTypeSelector from './OrderTypeSelector.jsx';
import PendingPartsButton from './PendingPartsButton.jsx';
import InlineCheckbox from './InlineCheckbox.jsx';
import { computeWorkProgress, PROGRESS_DOT_CLASS, PROGRESS_LEVELS } from '../../utils/workProgress.js';

function formatDateTime(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Estilo tipo chat (a pedido explícito, en vez del popover angosto anterior): lista de mensajes
// con scroll propio arriba, caja de mensaje fija abajo — así una etapa con mucho historial no
// desborda la tarjeta, solo crece el scroll interno.
function CommentsPopover({ event, comments, commentText, onCommentTextChange, onSave, onClose, saving, align }) {
  const alignClass =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const hasEntries = Boolean(event?.note) || comments.length > 0;

  return (
    <div
      data-comments-popover
      className={`absolute top-full z-30 mt-2 flex w-80 max-w-[90vw] flex-col overflow-hidden rounded-lg border border-outline-variant bg-white text-left shadow-xl sm:w-96 ${alignClass}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-outline-variant px-3 py-2">
        <p className="font-label-caps text-[11px] text-on-surface-variant">Seguimientos</p>
        <button
          type="button"
          onClick={onClose}
          className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary"
          data-icon="close"
        >
          close
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto bg-surface-container-lowest px-3 py-2">
        {hasEntries ? (
          <div className="space-y-2">
            {event?.note && (
              <div className="rounded-lg border border-outline-variant bg-white px-2.5 py-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-body-md text-xs font-semibold text-primary">Al cambiar de estatus</span>
                  <span className="shrink-0 font-data-mono text-[9px] text-on-surface-variant/70">
                    {formatDateTime(event.occurredAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-on-surface-variant">{event.note}</p>
              </div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-outline-variant bg-white px-2.5 py-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-body-md text-xs font-semibold text-primary">{c.user?.name || 'Usuario'}</span>
                  <span className="shrink-0 font-data-mono text-[9px] text-on-surface-variant/70">
                    {formatDateTime(c.createdAt)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-on-surface-variant">{c.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-on-surface-variant">Sin seguimientos todavía.</p>
        )}
      </div>

      <div className="flex items-end gap-2 border-t border-outline-variant p-2">
        <textarea
          autoFocus
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder="Mensaje"
          rows={1}
          className="flex-1 resize-none rounded border border-outline-variant px-2 py-1.5 text-xs text-primary"
        />
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !commentText.trim()}
          title="Enviar"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base" data-icon="send">
            send
          </span>
        </button>
      </div>
    </div>
  );
}

function StageCard({
  stage,
  reached,
  current,
  clickable,
  event,
  endAt,
  comments,
  onAdvanceClick,
  onAdvanceNextClick,
  showAdvanceNext,
  popoverOpen,
  onTogglePopover,
  commentText,
  onCommentTextChange,
  onSaveComment,
  savingComment,
  align,
  extra,
  elevated,
  progress,
}) {
  const percent = reached ? 100 : 0;
  const commentCount = (event?.note ? 1 : 0) + comments.length;

  // El semáforo es de la orden, no de cada etapa: solo se pinta en la etapa actual, que es
  // donde el reloj está corriendo. Repetirlo en las 6 tarjetas sería el mismo dato 6 veces.
  // Se muestra solo como punto + porcentaje (abajo) — la tarjeta ya no se enmarca en rojo,
  // para no competir visualmente con el borde de "etapa actual".
  const baseBorder = reached
    ? 'border-primary/30 bg-primary/5'
    : 'border-outline-variant bg-surface-container-low opacity-90';

  return (
    <div
      className={`relative flex flex-col items-center rounded-lg border p-3 text-center ${
        popoverOpen || elevated ? 'z-40' : ''
      } ${baseBorder}`}
    >
      {showAdvanceNext && (
        <button
          type="button"
          onClick={onAdvanceNextClick}
          title="Avanzar a la siguiente etapa"
          className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition-transform hover:scale-110"
        >
          <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">
            arrow_forward
          </span>
        </button>
      )}

      <p className="mb-2 font-body-md text-sm font-semibold text-primary">
        {stage.label}
        {current && <span className="ml-1 font-label-caps text-[10px] text-secondary">(actual)</span>}
      </p>
      <p className="mb-2 min-h-[32px] font-data-mono text-[11px] text-on-surface-variant">
        {event ? (
          <>
            Inicio: {formatDateTime(event.occurredAt)}
            {endAt && <><br />Fin: {formatDateTime(endAt)}</>}
          </>
        ) : (
          'Pendiente'
        )}
      </p>
      <p className="mb-3 font-label-caps text-[11px] text-on-surface-variant">% de Avance: {percent}</p>

      {progress && progress.level !== PROGRESS_LEVELS.UNKNOWN && (
        <p
          title={progress.label}
          className="mb-3 flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant"
        >
          <span className={`h-2 w-2 shrink-0 rounded-full ${PROGRESS_DOT_CLASS[progress.level]}`} />
          {Math.round(progress.ratio * 100)}% del tiempo estándar
        </p>
      )}

      <button
        type="button"
        disabled={!clickable}
        title={clickable ? `Avanzar a ${stage.label}` : undefined}
        onClick={onAdvanceClick}
        className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform ${
          clickable ? 'hover:scale-110' : ''
        } ${!clickable ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <span
          className={`material-symbols-outlined text-4xl ${reached ? 'text-primary' : 'text-outline'}`}
          data-icon={stage.icon}
          style={reached ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {stage.icon}
        </span>
      </button>

      <button
        type="button"
        data-comments-trigger
        onClick={onTogglePopover}
        className="mt-3 flex items-center gap-1 rounded-full border border-outline-variant px-2 py-1 font-label-caps text-[10px] text-on-surface-variant hover:border-primary hover:text-primary"
      >
        <span className="material-symbols-outlined text-xs" data-icon="chat_bubble">
          chat_bubble
        </span>
        Seguimientos{commentCount > 0 ? ` (${commentCount})` : ''}
      </button>

      {extra && <div className="mt-2 flex flex-col items-center gap-2">{extra}</div>}

      {popoverOpen && (
        <CommentsPopover
          event={event}
          comments={comments}
          commentText={commentText}
          onCommentTextChange={onCommentTextChange}
          onSave={onSaveComment}
          onClose={() => onTogglePopover()}
          saving={savingComment}
          align={align}
        />
      )}
    </div>
  );
}

export default function OrderStageDetailModal({ workOrder, onClose, onUpdated, standardHours }) {
  const { vehicle, statusEvents = [], stageComments = [] } = workOrder;
  // Solo Servicio: HYP no clasifica por `serviceCategory`, así que no hay tiempo estándar
  // contra qué comparar (ver workProgress.js).
  const progress =
    standardHours && workOrder.orderType === 'SERVICIO' ? computeWorkProgress(workOrder, standardHours) : null;
  const eventsByTime = [...statusEvents].sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt));
  const STAGES = getStages(workOrder.orderType);
  const currentIndex = STAGES.findIndex((s) => s.key === workOrder.status);
  const gridClass =
    STAGES.length > 8
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      : 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6';

  const [pendingStage, setPendingStage] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [partsPopoverOpen, setPartsPopoverOpen] = useState(false);

  const [openCommentsStage, setOpenCommentsStage] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => {
    if (!openCommentsStage) return undefined;
    function handleClickOutside(e) {
      if (!e.target.closest('[data-comments-popover]') && !e.target.closest('[data-comments-trigger]')) {
        setOpenCommentsStage(null);
        setCommentText('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCommentsStage]);

  async function handleConfirmAdvance() {
    setSaving(true);
    try {
      const updated = await updateWorkOrderStatus(workOrder.id, pendingStage, note.trim() || undefined);
      onUpdated?.(updated);
      setPendingStage(null);
      setNote('');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleCustomerWaiting(value) {
    onUpdated?.(await updateCustomerWaiting(workOrder.id, value));
  }

  async function handleSaveComment(stageKey) {
    setSavingComment(true);
    try {
      const updated = await addStageComment(workOrder.id, stageKey, commentText.trim());
      onUpdated?.(updated);
      setCommentText('');
    } finally {
      setSavingComment(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-surface-container-lowest shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant p-card-padding">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Etapas / Servicios</h2>
            <p className="font-body-md text-on-surface-variant">
              {vehicle.brand} {vehicle.model} — {vehicle.plate} • {vehicle.customer?.name || 'Sin cliente'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <OrderTypeSelector workOrder={workOrder} onUpdated={onUpdated} />
            <button
              type="button"
              onClick={onClose}
              className="material-symbols-outlined rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high"
              data-icon="close"
            >
              close
            </button>
          </div>
        </div>

        <div className="p-card-padding">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              NUMERO DE ORDEN DE SERVICIO{' '}
              <span className="font-data-mono text-primary">#{workOrder.orderNumber}</span>
            </p>
            <label
              className="flex items-center gap-1.5"
              title="Alimenta el motor de priorización de la cola de asignación"
            >
              <InlineCheckbox
                checked={workOrder.customerWaiting}
                onToggle={handleToggleCustomerWaiting}
                title="Cliente espera en agencia"
              />
              <span className="font-label-caps text-[11px] text-on-surface-variant">Cliente espera en agencia</span>
            </label>
          </div>

          <div className={`grid gap-3 ${gridClass}`}>
            {STAGES.map((stage, index) => {
              const event = statusEvents.find((e) => e.status === stage.key);
              const comments = stageComments.filter((c) => c.stage === stage.key);
              const reached = index <= currentIndex;
              const current = index === currentIndex;
              const clickable = index > currentIndex;
              // Fin de la etapa = inicio de la que sigue cronológicamente en el historial (cada
              // StatusEvent ya marca cuándo arrancó su etapa) — no la siguiente del pipeline,
              // porque una orden puede saltarse etapas al avanzar. La etapa actual no tiene fin
              // todavía.
              const eventTimeIndex = event ? eventsByTime.indexOf(event) : -1;
              const endAt = event && !current ? eventsByTime[eventTimeIndex + 1]?.occurredAt : null;
              const nextStage = STAGES[index + 1];
              const showAdvanceNext = current && Boolean(nextStage);
              // La ventana flotante es más ancha que una columna: en los extremos se ancla al
              // borde de la tarjeta en vez de centrarse, para no salirse del modal.
              const align = index === 0 ? 'left' : index === STAGES.length - 1 ? 'right' : 'center';

              // Leyendas automáticas — se calculan solas a partir del técnico asignado, en vez
              // de ser un chip manual que alguien puede olvidar actualizar.
              let extra = null;
              if (stage.key === 'RECIBIDO' && workOrder.status === 'RECIBIDO' && !workOrder.technicianId) {
                extra = (
                  <span className="whitespace-nowrap rounded-full bg-surface-container-high px-2 py-0.5 font-label-caps text-[10px] text-on-surface-variant">
                    Pendiente por asignar
                  </span>
                );
              } else if (stage.key === 'EN_TALLER') {
                extra = (
                  <>
                    {workOrder.status === 'EN_TALLER' && workOrder.technicianId && (
                      <span className="whitespace-nowrap rounded-full bg-primary/10 px-2 py-0.5 font-label-caps text-[10px] text-primary">
                        Asignado
                      </span>
                    )}
                    <PendingPartsButton
                      workOrder={workOrder}
                      onUpdated={onUpdated}
                      align={align}
                      onOpenChange={setPartsPopoverOpen}
                    />
                  </>
                );
              }

              return (
                <div key={stage.key}>
                  <StageCard
                    stage={stage}
                    reached={reached}
                    current={current}
                    clickable={clickable}
                    event={event}
                    endAt={endAt}
                    comments={comments}
                    align={align}
                    extra={extra}
                    progress={current ? progress : null}
                    elevated={stage.key === 'EN_TALLER' && partsPopoverOpen}
                    onAdvanceClick={() => clickable && setPendingStage(stage.key)}
                    showAdvanceNext={showAdvanceNext}
                    onAdvanceNextClick={() => nextStage && setPendingStage(nextStage.key)}
                    popoverOpen={openCommentsStage === stage.key}
                    onTogglePopover={() => {
                      setOpenCommentsStage((prev) => (prev === stage.key ? null : stage.key));
                      setCommentText('');
                    }}
                    commentText={commentText}
                    onCommentTextChange={setCommentText}
                    onSaveComment={() => handleSaveComment(stage.key)}
                    savingComment={savingComment}
                  />
                </div>
              );
            })}
          </div>

          {pendingStage && (
            <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="mb-2 font-label-caps text-[11px] text-on-surface-variant">
                Cambiar a &quot;{STAGES.find((s) => s.key === pendingStage)?.label}&quot;
              </p>
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Comentario (opcional)"
                rows={2}
                className="mb-2 w-full rounded border border-outline-variant px-2 py-1 text-sm text-primary"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingStage(null);
                    setNote('');
                  }}
                  className="rounded px-3 py-1 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-high"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdvance}
                  disabled={saving}
                  className="rounded bg-primary px-3 py-1 font-label-caps text-[11px] text-on-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {(workOrder.serviceType || workOrder.customerWaiting || workOrder.partsNeeded || workOrder.washNeeded) && (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-outline-variant pt-4">
              {workOrder.serviceType && (
                <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-[10px] text-on-surface-variant">
                  {workOrder.serviceType.trim()}
                </span>
              )}
              {workOrder.customerWaiting && (
                <span className="rounded-full bg-error-container/40 px-3 py-1 font-label-caps text-[10px] text-on-error-container">
                  Cliente espera
                </span>
              )}
              {workOrder.partsNeeded && (
                <span className="rounded-full bg-secondary-container/15 px-3 py-1 font-label-caps text-[10px] text-secondary">
                  Requiere refacciones
                </span>
              )}
              {workOrder.washNeeded && (
                <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-[10px] text-on-surface-variant">
                  Requiere lavado
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

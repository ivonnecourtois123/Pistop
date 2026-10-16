import { useEffect, useState } from 'react';
import {
  updateWorkOrderStatus,
  addStageComment,
  updateCustomerWaiting,
} from '../../api/workOrders.js';
import { listTechnicians } from '../../api/technicians.js';
import { getStages, STAGE_LABEL } from '../../constants/stages.js';
import OrderTypeSelector from './OrderTypeSelector.jsx';
import PendingPartsButton from './PendingPartsButton.jsx';
import StageCommentsModal from './StageCommentsModal.jsx';
import ExpedienteChecklist from '../insurance/ExpedienteChecklist.jsx';
import WorkOrderOperationsManager from './WorkOrderOperationsManager.jsx';
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

function StageCard({
  stage,
  stageIndex,
  reached,
  current,
  event,
  endAt,
  comments,
  onSelectStage,
  onOpenComments,
  extra,
  elevated,
  progress,
  blocked,
  blockedReason,
  actionLabel,
}) {
  const percent = reached ? 100 : 0;
  const commentCount = (event?.note ? 1 : 0) + comments.length;

  const baseBorder = current
    ? 'border-2 border-emerald-500 bg-emerald-50/90 shadow-md ring-2 ring-emerald-300'
    : blocked
    ? 'border-amber-300 bg-amber-50/40 opacity-85'
    : reached
    ? 'border-emerald-300/80 bg-emerald-50/30'
    : 'border-outline-variant bg-surface-container-low opacity-85 hover:opacity-100 hover:border-primary/50';

  return (
    <div
      className={`relative flex flex-col items-center justify-between rounded-xl border p-3 text-center transition-all ${
        elevated ? 'z-40' : ''
      } ${baseBorder}`}
    >
      <div className="w-full">
        {/* Encabezado de la etapa */}
        <div className="mb-1.5 flex items-center justify-between gap-1">
          <span className="font-data-mono text-[10px] font-bold text-on-surface-variant/70">
            #{stageIndex + 1}
          </span>
          {current ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 font-label-caps text-[9px] font-extrabold text-white shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              ACTUAL
            </span>
          ) : blocked ? (
            <span
              className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 font-label-caps text-[9px] font-bold text-amber-900 border border-amber-300"
              title={blockedReason}
            >
              BLOQUEADO
            </span>
          ) : reached ? (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 font-label-caps text-[9px] font-bold text-emerald-800">
              ✓ HECHO
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-surface-container px-1.5 py-0.5 font-label-caps text-[9px] text-on-surface-variant">
              PENDIENTE
            </span>
          )}
        </div>

        <h4 className="font-body-md text-xs font-bold text-primary truncate" title={stage.label}>
          {stage.label}
        </h4>

        <p className="mt-1 min-h-[28px] font-data-mono text-[10px] text-on-surface-variant">
          {event ? (
            <>
              Ini: {new Date(event.occurredAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              {endAt && (
                <> · Fin: {new Date(endAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</>
              )}
            </>
          ) : (
            '—'
          )}
        </p>

        {progress && progress.level !== PROGRESS_LEVELS.UNKNOWN && (
          <p
            title={progress.label}
            className="mb-1 flex items-center justify-center gap-1 font-label-caps text-[9px] text-on-surface-variant"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PROGRESS_DOT_CLASS[progress.level]}`} />
            {Math.round(progress.ratio * 100)}% est.
          </p>
        )}

        {/* Icono central */}
        <div className="my-2 flex justify-center">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-2xs ${
              current
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : reached
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              data-icon={stage.icon}
              style={reached || current ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {stage.icon}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de acción en la tarjeta */}
      <div className="w-full mt-1 space-y-1.5">
        {!current ? (
          blocked ? (
            <button
              type="button"
              onClick={() => onSelectStage(stage.key)}
              className="w-full rounded-md bg-amber-100/80 border border-amber-300 px-2 py-1 font-label-caps text-[9.5px] font-extrabold text-amber-900 hover:bg-amber-200 transition-all cursor-pointer shadow-2xs"
              title={blockedReason}
            >
              🚫 Requiere Taller
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectStage(stage.key)}
              className="w-full rounded-md bg-white border border-outline-variant px-2 py-1 font-label-caps text-[10px] font-bold text-primary hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs"
              title={`Mover orden a ${stage.label}`}
            >
              {actionLabel || '⚡ Mover aquí'}
            </button>
          )
        ) : (
          <div className="w-full py-1 text-center font-label-caps text-[10px] font-bold text-emerald-700 bg-emerald-100/60 rounded">
            🟢 En Proceso
          </div>
        )}

        <button
          type="button"
          onClick={onOpenComments}
          className="w-full flex items-center justify-center gap-1 rounded border border-outline-variant/60 bg-white/80 px-1.5 py-0.5 font-label-caps text-[9px] text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[11px]" data-icon="chat_bubble">
            chat_bubble
          </span>
          Notas ({commentCount})
        </button>

        {extra && <div className="mt-1 flex flex-col w-full items-stretch gap-1">{extra}</div>}
      </div>
    </div>
  );
}

export default function OrderStageDetailModal({ workOrder, onClose, onUpdated, standardHours }) {
  const { vehicle, statusEvents = [], stageComments = [] } = workOrder;
  const progress =
    standardHours && workOrder.orderType === 'SERVICIO' ? computeWorkProgress(workOrder, standardHours) : null;
  const eventsByTime = [...statusEvents].sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt));
  const STAGES = getStages(workOrder.orderType);
  const currentIndex = STAGES.findIndex((s) => s.key === workOrder.status);
  const nextStage = STAGES[currentIndex + 1] || null;

  const gridClass =
    STAGES.length > 8
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';

  const [activeTab, setActiveTab] = useState('ETAPAS'); // 'ETAPAS' | 'EXPEDIENTE'
  const [pendingStage, setPendingStage] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [partsPopoverOpen, setPartsPopoverOpen] = useState(false);
  const [commentsModalStage, setCommentsModalStage] = useState(null);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    listTechnicians()
      .then((data) => setTechnicians(data || []))
      .catch(() => {});
  }, []);

  // Comentarios en línea dentro del modal
  const [newModalComment, setNewModalComment] = useState('');
  const [savingModalComment, setSavingModalComment] = useState(false);

  async function handleConfirmAdvance() {
    if (!pendingStage) return;
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

  const hasOperations = workOrder.operations && workOrder.operations.length > 0;
  const operationsHours = hasOperations
    ? workOrder.operations.reduce((sum, op) => sum + (op.standardHours || 0), 0)
    : 0;

  const categoryHours = standardHours?.[workOrder.serviceCategory] ?? 1.5;
  const mechHours = hasOperations ? operationsHours : (categoryHours + (workOrder.alignmentNeeded ? 0.5 : 0));

  const hasWashOp = workOrder.operations?.some(
    (op) => (op.description && /lavad|est[ée]tica/i.test(op.description)) || (op.code && /lav/i.test(op.code))
  );
  const isWashNeeded = hasOperations ? hasWashOp : workOrder.washNeeded !== false;

  const hasDiagOp = workOrder.operations?.some(
    (op) => (op.description && /diagn[oó]stic|falla|revisi[oó]n/i.test(op.description)) || (op.code && /diag/i.test(op.code))
  );
  const isDiagnosisNeeded = Boolean(workOrder.diagnosisNeeded) || Boolean(hasDiagOp);

  function handleSelectStage(stageKey) {
    const hasPassedWorkshop =
      workOrder.status === 'EN_TALLER' ||
      statusEvents.some((e) => e.status === 'EN_TALLER');

    if (stageKey === 'LAVADO' && isDiagnosisNeeded && !hasPassedWorkshop) {
      alert(
        '⚠️ Restricción activa de Calidad:\n\nLa unidad reporta falla o diagnóstico pendiente. Por protocolo de calidad debe ingresar primero a Taller antes de pasar a Lavado.'
      );
      return;
    }
    setPendingStage(stageKey);
  }

  const isWashCompleted =
    ['CONTROL_CALIDAD', 'TERMINADO', 'ENTREGADO'].includes(workOrder.status) ||
    statusEvents.some((e) => e.status === 'LAVADO' && workOrder.status !== 'LAVADO');

  let targetWorkshopDate = null;
  if (workOrder.estimatedDeliveryAt) {
    const deliveryDate = new Date(workOrder.estimatedDeliveryAt);
    const bufferMs = 30 * 60 * 1000;
    const washMs =
      isWashNeeded && !isWashCompleted && workOrder.status !== 'LAVADO' ? 90 * 60 * 1000 : 0;
    targetWorkshopDate = new Date(deliveryDate.getTime() - bufferMs - washMs);
  }

  async function handleSaveComment(stageKey, commentText) {
    const updated = await addStageComment(workOrder.id, stageKey, commentText);
    onUpdated?.(updated);
  }

  async function handleAddModalCommentSubmit(e, textOverride) {
    if (e) e.preventDefault();
    const text = (textOverride || newModalComment).trim();
    if (!text || savingModalComment) return;
    setSavingModalComment(true);
    try {
      const updated = await addStageComment(workOrder.id, workOrder.status, text);
      onUpdated?.(updated);
      setNewModalComment('');
    } finally {
      setSavingModalComment(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5" onClick={onClose}>
        <div
          className="flex flex-col max-h-[90vh] w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-outline-variant overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Superior */}
          <div className="shrink-0 flex items-center justify-between border-b border-outline-variant bg-white px-5 py-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              {vehicle.logoUrl && (
                <img src={vehicle.logoUrl} alt={vehicle.brand} className="h-9 w-9 object-contain" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-lg text-lg font-black text-primary">
                    {vehicle.brand} {vehicle.model} {vehicle.year || ''}
                  </h2>
                  <span className="rounded-md bg-surface-container px-2 py-0.5 font-data-mono text-xs font-bold text-primary">
                    Placas: {vehicle.plate || 'Sin placas'}
                  </span>
                  <span className="font-data-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    #OR: {workOrder.orderNumber}
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Cliente: <span className="font-semibold text-primary">{vehicle.customer?.name || 'Sin cliente'}</span>
                  {workOrder.advisor?.name ? ` • Asesor: ${workOrder.advisor.name}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <OrderTypeSelector workOrder={workOrder} onUpdated={onUpdated} />
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          {/* Pestañas para HYP (Etapas vs Expediente con Checklist) */}
          {workOrder.orderType === 'HYP' && (
            <div className="shrink-0 flex border-b border-outline-variant bg-surface-container-low px-5">
              <button
                type="button"
                onClick={() => setActiveTab('ETAPAS')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-headline-md text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'ETAPAS'
                    ? 'border-emerald-600 text-emerald-800 font-extrabold bg-white'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">alt_route</span>
                Flujo de Etapas ({STAGES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('EXPEDIENTE')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-headline-md text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'EXPEDIENTE'
                    ? 'border-emerald-600 text-emerald-800 font-extrabold bg-white'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">folder_shared</span>
                Expediente Digital & Checklist (📎)
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === 'EXPEDIENTE' && workOrder.orderType === 'HYP' ? (
              <div className="rounded-xl border border-outline-variant bg-white p-5">
                <ExpedienteChecklist
                  insurerName={workOrder.insurer}
                  documents={[]}
                  storageKeyPrefix="pitstop.hypExpediente."
                  entityId={workOrder.id}
                />
              </div>
            ) : (
              <>
                {/* CONFIGURACIÓN DE SERVICIOS Y RUTA CRÍTICA DE ENTREGA */}
                <div className="rounded-xl border border-outline-variant bg-surface-container-low/40 p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline-md text-xs font-bold text-primary">
                      Servicios Requeridos y Estimación de Tiempos
                    </h4>
                  </div>

                  {/* Resumen de Meta de Salida de Taller */}
                  {targetWorkshopDate && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-300 bg-emerald-50/80 px-3 py-1.5 text-xs text-primary animate-in fade-in duration-150">
                      <div className="flex items-center gap-2">
                        <span className="font-label-caps text-[10px] font-bold uppercase text-emerald-900">
                          Meta Salida de Taller:
                        </span>
                        <strong className="font-data-mono font-black text-emerald-800 text-sm">
                          {targetWorkshopDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          (Promesa de Entrega: {new Date(workOrder.estimatedDeliveryAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })})
                        </span>
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-medium">
                        Carga taller: {mechHours.toFixed(1)}h • Colchón entrega: 30 min
                      </div>
                    </div>
                  )}

                  {/* Gestor dinámico de operaciones y técnicos por tarea */}
                  <WorkOrderOperationsManager
                    workOrder={workOrder}
                    technicians={technicians}
                    onUpdated={onUpdated}
                    onToggleCustomerWaiting={handleToggleCustomerWaiting}
                  />

                  {/* Reglas de Flujo y Restricción */}
                  {isDiagnosisNeeded ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300">
                      <span className="font-medium text-[10.5px]">
                        ⚠️ <strong>Restricción activa:</strong> La unidad reporta falla o diagnóstico; debe ingresar a <strong>Taller primero</strong> para atención antes de pasar a Lavado.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                      <span className="font-medium text-[10.5px]">
                        ✓ <strong>Flujo flexible habilitado:</strong> Si los mecánicos están ocupados y los lavadores desocupados, puede pasar a <strong>Lavado primero</strong>.
                      </span>
                    </div>
                  )}
                </div>

                {/* MODAL / CAJA DE CONFIRMACIÓN DE CAMBIO DE ETAPA */}
                {pendingStage && (
                  <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 shadow-md animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-base">edit_note</span>
                      <h4 className="font-headline-md text-sm font-bold text-primary">
                        Confirmar cambio de etapa a: &quot;{STAGES.find((s) => s.key === pendingStage)?.label || pendingStage}&quot;
                      </h4>
                    </div>
                    <textarea
                      autoFocus
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nota opcional para el seguimiento de la orden (asesor / técnico)..."
                      rows={2}
                      className="mb-3 w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs text-primary focus:border-primary focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPendingStage(null);
                          setNote('');
                        }}
                        className="rounded-lg px-3 py-1.5 font-label-caps text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmAdvance}
                        disabled={saving}
                        className="rounded-lg bg-emerald-600 px-4 py-1.5 font-label-caps text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                      >
                        {saving ? 'Guardando...' : 'Confirmar Avance'}
                      </button>
                    </div>
                  </div>
                )}

                {/* GRID DE TODAS LAS ETAPAS */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">
                      Pipeline Completo de Etapas ({STAGES.length})
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      Haz clic en <span className="font-bold text-primary">&quot;⚡ Mover aquí&quot;</span> en cualquier tarjeta para actualizar.
                    </p>
                  </div>

                  <div className={`grid gap-3 ${gridClass}`}>
                    {STAGES.map((stage, index) => {
                      const event = statusEvents.find((e) => e.status === stage.key);
                      const comments = stageComments.filter((c) => c.stage === stage.key);
                      const current = index === currentIndex;
                      const eventTimeIndex = event ? eventsByTime.indexOf(event) : -1;
                      const endAt = event && !current ? eventsByTime[eventTimeIndex + 1]?.occurredAt : null;
                      const align = index === 0 ? 'left' : index === STAGES.length - 1 ? 'right' : 'center';

                      const hasPassedWorkshop =
                        workOrder.status === 'EN_TALLER' ||
                        statusEvents.some((e) => e.status === 'EN_TALLER');

                      // Si se saltó a LAVADO primero (flujo flexible), EN_TALLER no se marca como HECHO sino PENDIENTE
                      const isEnTallerPendingAfterWash =
                        stage.key === 'EN_TALLER' && workOrder.status === 'LAVADO' && !hasPassedWorkshop;
                      const reached = isEnTallerPendingAfterWash ? false : index <= currentIndex;

                      // Restricción: No puede pasar a LAVADO si reporta diagnóstico/falla y no ha pasado por taller
                      const isLavadoBlocked =
                        stage.key === 'LAVADO' && isDiagnosisNeeded && !hasPassedWorkshop;

                      let actionLabel = '⚡ Mover aquí';
                      if (stage.key === 'EN_TALLER' && workOrder.status === 'LAVADO') {
                        actionLabel = '⚡ Pasar a Taller';
                      } else if (stage.key === 'LAVADO' && workOrder.status === 'EN_TALLER') {
                        actionLabel = '⚡ Pasar a Lavado';
                      } else if (stage.key === 'LAVADO' && workOrder.status === 'RECIBIDO') {
                        actionLabel = '⚡ Lavar primero';
                      } else if (stage.key === 'CONTROL_CALIDAD' && workOrder.status === 'EN_TALLER') {
                        actionLabel = '⚡ Pasar a Calidad';
                      }

                      let extra = null;
                      if (stage.key === 'RECIBIDO' && workOrder.status === 'RECIBIDO' && !workOrder.technicianId) {
                        extra = (
                          <span className="whitespace-nowrap rounded bg-surface-container px-1.5 py-0.5 font-label-caps text-[9px] text-on-surface-variant">
                            Por asignar
                          </span>
                        );
                      } else if (stage.key === 'EN_TALLER') {
                        extra = (
                          <>
                            {workOrder.status === 'EN_TALLER' && workOrder.technicianId && (
                              <span className="whitespace-nowrap rounded bg-primary/10 px-1.5 py-0.5 font-label-caps text-[9px] font-bold text-primary">
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
                        <StageCard
                          key={stage.key}
                          stage={stage}
                          stageIndex={index}
                          reached={reached}
                          current={current}
                          event={event}
                          endAt={endAt}
                          comments={comments}
                          extra={extra}
                          progress={current ? progress : null}
                          elevated={stage.key === 'EN_TALLER' && partsPopoverOpen}
                          blocked={isLavadoBlocked}
                          blockedReason="La unidad reporta falla o diagnóstico pendiente. Debe ingresar primero a Taller antes de pasar a Lavado."
                          actionLabel={actionLabel}
                          onSelectStage={handleSelectStage}
                          onOpenComments={() => setCommentsModalStage(stage)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* BITÁCORA INTEGRADA DE SEGUIMIENTOS */}
                <div className="w-full border-t border-outline-variant/60 pt-5">
                  {/* Bitácora de comentarios en vivo */}
                  <div className="rounded-xl border border-outline-variant bg-white p-4 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-3">
                        <span className="font-label-caps text-xs font-bold text-primary uppercase flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-emerald-600">history_edu</span>
                          Bitácora de Seguimientos ({stageComments.length})
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          Notas de asesor / controlista / técnico
                        </span>
                      </div>

                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                        {stageComments.length > 0 ? (
                          stageComments.map((c) => (
                            <div key={c.id} className="rounded-lg border border-outline-variant/60 bg-slate-50 p-2.5 text-xs">
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
                          <div className="py-6 text-center text-xs text-on-surface-variant/70 italic bg-slate-50 rounded-lg border border-dashed border-outline-variant">
                            Sin comentarios registrados. Puedes agregar el primero abajo.
                          </div>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleAddModalCommentSubmit} className="mt-3 pt-3 border-t border-outline-variant/60 flex gap-2">
                      <input
                        type="text"
                        value={newModalComment}
                        onChange={(e) => setNewModalComment(e.target.value)}
                        placeholder="Escribe un nuevo comentario o nota de seguimiento..."
                        className="flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-xs text-primary focus:border-primary focus:bg-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={savingModalComment || !newModalComment.trim()}
                        className="rounded-lg bg-primary px-4 py-2 font-label-caps text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-40 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        {savingModalComment ? 'Guardando...' : 'Comentar'}
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}

            {/* Badges de etiquetas inferiores */}
            {(workOrder.serviceType || workOrder.customerWaiting || workOrder.partsNeeded || workOrder.washNeeded) && (
              <div className="flex flex-wrap gap-2 border-t border-outline-variant/60 pt-4">
                {workOrder.serviceType && (
                  <span className="rounded-full bg-surface-container px-3 py-1 font-label-caps text-[10px] font-bold text-on-surface-variant">
                    {workOrder.serviceType.trim()}
                  </span>
                )}
                {workOrder.customerWaiting && (
                  <span className="rounded-full bg-error-container/40 px-3 py-1 font-label-caps text-[10px] font-bold text-on-error-container">
                    Cliente espera
                  </span>
                )}
                {workOrder.partsNeeded && (
                  <span className="rounded-full bg-secondary-container/15 px-3 py-1 font-label-caps text-[10px] font-bold text-secondary">
                    Requiere refacciones
                  </span>
                )}
                {workOrder.washNeeded && (
                  <span className="rounded-full bg-surface-container px-3 py-1 font-label-caps text-[10px] font-bold text-on-surface-variant">
                    Requiere lavado
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal independiente de Seguimientos por etapa */}
      {commentsModalStage && (
        <StageCommentsModal
          workOrder={workOrder}
          stageKey={commentsModalStage.key}
          stageLabel={commentsModalStage.label}
          event={statusEvents.find((e) => e.status === commentsModalStage.key)}
          comments={stageComments.filter((c) => c.stage === commentsModalStage.key)}
          onClose={() => setCommentsModalStage(null)}
          onAddComment={handleSaveComment}
        />
      )}
    </>
  );
}

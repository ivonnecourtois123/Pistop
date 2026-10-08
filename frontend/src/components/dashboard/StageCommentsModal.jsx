import { useState } from 'react';

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

export default function StageCommentsModal({
  workOrder,
  stageKey,
  stageLabel,
  event,
  comments = [],
  onClose,
  onAddComment,
}) {
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const hasEntries = Boolean(event?.note) || comments.length > 0;

  async function handleSend(e) {
    e?.preventDefault();
    if (!commentText.trim() || saving) return;
    setSaving(true);
    setError('');
    try {
      await onAddComment(stageKey, commentText.trim());
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar el comentario');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-outline-variant bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" data-icon="forum">
                forum
              </span>
              <h2 className="font-headline-md text-base font-bold text-primary">
                Bitácora de Seguimientos — {stageLabel || stageKey}
              </h2>
            </div>
            <p className="mt-0.5 font-body-md text-xs text-on-surface-variant">
              Orden #{workOrder.orderNumber} • {workOrder.vehicle?.brand} {workOrder.vehicle?.model} ({workOrder.vehicle?.plate})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg" data-icon="close">
              close
            </span>
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 rounded border border-error bg-error-container/30 px-3 py-2 text-xs text-on-error-container">
            {error}
          </div>
        )}

        {/* Historial de comentarios con scroll */}
        <div className="flex-1 overflow-y-auto bg-surface-container-lowest/50 p-4 space-y-3">
          {hasEntries ? (
            <>
              {event?.note && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center justify-between gap-2 border-b border-primary/10 pb-1 mb-1.5">
                    <span className="inline-flex items-center gap-1 font-label-caps text-[11px] font-semibold text-primary">
                      <span className="material-symbols-outlined text-xs" data-icon="flag">
                        flag
                      </span>
                      Cambio de Estatus
                    </span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant/80">
                      {formatDateTime(event.occurredAt)}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed">{event.note}</p>
                </div>
              )}

              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-outline-variant bg-white p-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-outline-variant/60 pb-1 mb-1.5">
                    <span className="inline-flex items-center gap-1 font-body-md text-xs font-semibold text-primary">
                      <span className="material-symbols-outlined text-xs text-secondary" data-icon="person">
                        person
                      </span>
                      {c.user?.name || 'Usuario'}
                    </span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant/80">
                      {formatDateTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{c.comment}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2" data-icon="chat_bubble_outline">
                chat_bubble_outline
              </span>
              <p className="font-body-md text-sm font-medium">Sin seguimientos registrados</p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">Escribe el primer comentario para esta etapa abajo.</p>
            </div>
          )}
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSend} className="border-t border-outline-variant bg-white p-3 flex items-end gap-2">
          <textarea
            autoFocus
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un seguimiento o comentario para esta etapa..."
            className="flex-1 resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-2.5 font-body-md text-xs text-primary focus:border-primary focus:bg-white focus:outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="submit"
            disabled={saving || !commentText.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 transition-all shadow-sm"
            title="Enviar comentario (Enter)"
          >
            <span className="material-symbols-outlined text-lg" data-icon="send">
              send
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

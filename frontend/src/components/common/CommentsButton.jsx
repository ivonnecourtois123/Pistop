import { useEffect, useRef, useState } from 'react';

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Botón + ventana flotante de comentarios, reutilizable donde se necesite un hilo de
// seguimiento con fecha/hora y usuario (Inmovilizados, etapas de Seguros). El padre es
// responsable de pasar los comentarios ya filtrados/ordenados y de refrescar sus datos
// después de que onAddComment resuelva.
export default function CommentsButton({ comments, onAddComment, align = 'right', label = 'Comentarios' }) {
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function handleSave() {
    if (!commentText.trim()) return;
    setSaving(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } finally {
      setSaving(false);
    }
  }

  const alignClass = align === 'left' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0';

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 whitespace-nowrap rounded-full border border-outline-variant px-3 py-1 font-label-caps text-[11px] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
      >
        <span className="material-symbols-outlined text-xs" data-icon="chat_bubble">
          chat_bubble
        </span>
        {label}{comments.length > 0 ? ` (${comments.length})` : ''}
      </button>

      {open && (
        <div
          className={`absolute top-full z-40 mt-2 w-72 max-w-[85vw] rounded-lg border border-outline-variant bg-white p-3 text-left shadow-xl ${alignClass}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="font-label-caps text-[11px] text-on-surface-variant">{label}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary"
              data-icon="close"
            >
              close
            </button>
          </div>

          {comments.length > 0 ? (
            <div className="mb-2 max-h-48 space-y-2 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="border-t border-outline-variant pt-1.5 text-xs text-on-surface-variant first:border-t-0 first:pt-0">
                  <p>{c.comment}</p>
                  <p className="font-label-caps text-[9px] text-on-surface-variant/70">
                    {c.user?.name || 'Usuario'} • {formatDateTime(c.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-2 text-xs text-on-surface-variant">Sin comentarios todavía.</p>
          )}

          <textarea
            autoFocus
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Nuevo comentario..."
            rows={2}
            className="mb-1 w-full rounded border border-outline-variant px-2 py-1 text-xs text-primary"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !commentText.trim()}
              className="rounded bg-primary px-2 py-0.5 font-label-caps text-[10px] text-on-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

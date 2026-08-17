import { useEffect, useRef, useState } from 'react';
import { addPendingPart, setPendingPartReceived } from '../../api/workOrders.js';

// Evita el corrimiento de zona horaria: `orderDate` llega como "2026-08-05T00:00:00.000Z"
// (medianoche UTC, porque el <input type="date"> solo captura año-mes-día). Si se le pasa esa
// cadena directo a `new Date(...)`, en un huso horario negativo (México) se muestra el día
// anterior. Se parte manualmente para construir la fecha en hora local en vez de UTC.
function formatDate(dateString) {
  const [y, m, d] = dateString.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Reemplaza al viejo sub-estado manual "Esperando refacciones": en vez de un chip que alguien
// prende/apaga a mano, aquí se registra qué pieza se pidió (# parte, # pedido, fecha) y se
// marca cuando llega. Mientras haya alguna sin recibir, el botón se ve en rojo — y el backend
// usa lo mismo para recalcular `partsReady` solo, sin necesidad de otra casilla aparte.
// `onOpenChange`: opcional, solo para que el padre pueda subir el z-index de la tarjeta que
// contiene este botón mientras el popover está abierto — si no, la fila de etapas siguiente
// puede tapar el popover en pantallas donde el grid envuelve a 2+ filas (mismo problema que
// tuvimos con los popovers de comentarios).
export default function PendingPartsButton({ workOrder, onUpdated, align = 'center', onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partNumber, setPartNumber] = useState('');
  const [description, setDescription] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const containerRef = useRef(null);

  const parts = workOrder.pendingParts || [];
  const pendingCount = parts.filter((p) => !p.received).length;

  function updateOpen(next) {
    setOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        updateOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!partNumber.trim() || !orderNumber.trim() || !orderDate) return;
    setSaving(true);
    try {
      const updated = await addPendingPart(workOrder.id, {
        partNumber: partNumber.trim(),
        description: description.trim() || undefined,
        orderNumber: orderNumber.trim(),
        orderDate,
      });
      onUpdated?.(updated);
      setPartNumber('');
      setDescription('');
      setOrderNumber('');
      setOrderDate('');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(partId, received) {
    setSaving(true);
    try {
      const updated = await setPendingPartReceived(workOrder.id, partId, received);
      onUpdated?.(updated);
    } finally {
      setSaving(false);
    }
  }

  const alignClass = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => updateOpen(!open)}
        title="Refacciones pendientes"
        className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 font-label-caps text-[10px] transition-colors ${
          pendingCount > 0
            ? 'border-error bg-error-container/40 text-on-error-container'
            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xs" data-icon="inventory_2">
          inventory_2
        </span>
        {pendingCount > 0 ? `Refacciones pendientes (${pendingCount})` : 'Refacciones pendientes'}
      </button>

      {open && (
        <div
          className={`absolute top-full z-40 mt-2 w-72 max-w-[85vw] rounded-lg border border-outline-variant bg-white p-3 text-left shadow-xl ${alignClass}`}
        >
          <p className="mb-2 font-label-caps text-[11px] text-on-surface-variant">Refacciones pedidas</p>

          {parts.length === 0 ? (
            <p className="mb-2 text-xs text-on-surface-variant">Sin refacciones registradas.</p>
          ) : (
            <div className="mb-2 max-h-40 space-y-2 overflow-y-auto">
              {parts.map((p) => (
                <label
                  key={p.id}
                  className="flex items-start gap-2 border-t border-outline-variant pt-1.5 text-xs first:border-t-0 first:pt-0"
                >
                  <input
                    type="checkbox"
                    checked={p.received}
                    disabled={saving}
                    onChange={(e) => handleToggle(p.id, e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 disabled:opacity-50"
                  />
                  <span className={p.received ? 'text-on-surface-variant/60 line-through' : 'text-on-surface-variant'}>
                    Parte #{p.partNumber} · Pedido #{p.orderNumber} · {formatDate(p.orderDate)}
                    {p.description && <><br />{p.description}</>}
                  </span>
                </label>
              ))}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-1.5 border-t border-outline-variant pt-2">
            <input
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="# de parte"
              className="w-full rounded border border-outline-variant px-2 py-1 text-xs text-primary"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full rounded border border-outline-variant px-2 py-1 text-xs text-primary"
            />
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="# de pedido"
              className="w-full rounded border border-outline-variant px-2 py-1 text-xs text-primary"
            />
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full rounded border border-outline-variant px-2 py-1 text-xs text-primary"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !partNumber.trim() || !orderNumber.trim() || !orderDate}
                className="rounded bg-primary px-2 py-0.5 font-label-caps text-[10px] text-on-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { updateEstimatedDelivery } from '../../api/workOrders.js';

function formatPromise(dateString) {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  const isToday = new Date().toDateString() === date.toDateString();
  const time = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  return isToday ? `Hoy ${time}` : `${date.toLocaleDateString('es-MX')} ${time}`;
}

// "YYYY-MM-DDTHH:mm" en hora local, formato que espera <input type="datetime-local">
function toDatetimeLocalValue(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PromiseDateSelector({ workOrder, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
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

  function handleOpen() {
    setValue(toDatetimeLocalValue(workOrder.estimatedDeliveryAt));
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateEstimatedDelivery(workOrder.id, value || null);
      onUpdated?.(updated);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    try {
      const updated = await updateEstimatedDelivery(workOrder.id, null);
      onUpdated?.(updated);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleOpen}
        title="Cambiar fecha promesa de entrega"
        className="flex items-center gap-1 whitespace-nowrap rounded-full border border-outline-variant px-3 py-1 font-data-mono text-[11px] text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
      >
        <span className="material-symbols-outlined text-xs" data-icon="schedule">
          schedule
        </span>
        {formatPromise(workOrder.estimatedDeliveryAt)}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-outline-variant bg-white p-3 shadow-lg">
          <p className="mb-2 font-label-caps text-[11px] text-on-surface-variant">Fecha promesa de entrega</p>
          <input
            type="datetime-local"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mb-2 w-full rounded border border-outline-variant px-2 py-1 text-sm text-primary"
          />
          <div className="flex justify-end gap-2">
            {workOrder.estimatedDeliveryAt && (
              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="rounded px-3 py-1 font-label-caps text-[11px] text-error hover:bg-error-container/30 disabled:opacity-50"
              >
                Quitar
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded px-3 py-1 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-primary px-3 py-1 font-label-caps text-[11px] text-on-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

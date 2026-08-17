import { useEffect, useRef, useState } from 'react';
import { updateWorkOrderStatus } from '../../api/workOrders.js';

const STEPS = [
  { value: 'RECIBIDO', label: 'Recibido', icon: 'check_circle' },
  { value: 'EN_TALLER', label: 'En Taller', icon: 'build' },
  { value: 'LAVADO', label: 'Lavado', icon: 'local_car_wash' },
  { value: 'CONTROL_CALIDAD', label: 'Control de Calidad', icon: 'fact_check' },
  { value: 'TERMINADO', label: 'Terminado', icon: 'task_alt' },
  { value: 'ENTREGADO', label: 'Entregado', icon: 'done_all' },
];

function indexOf(status) {
  return STEPS.findIndex((s) => s.value === status);
}

export default function StatusSelector({ workOrder, onUpdated }) {
  const [pendingStatus, setPendingStatus] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const containerRef = useRef(null);

  const currentIndex = indexOf(workOrder.status);

  useEffect(() => {
    if (!pendingStatus) return undefined;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPendingStatus(null);
        setNote('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pendingStatus]);

  async function handleConfirm() {
    setSaving(true);
    try {
      const updated = await updateWorkOrderStatus(workOrder.id, pendingStatus, note.trim() || undefined);
      onUpdated?.(updated);
      setPendingStatus(null);
      setNote('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-1">
        {STEPS.map((step, idx) => {
          const done = idx < currentIndex;
          const current = idx === currentIndex;
          const clickable = idx > currentIndex;
          return (
            <button
              key={step.value}
              type="button"
              title={current ? `${step.label} (actual)` : step.label}
              disabled={!clickable}
              onClick={() => clickable && setPendingStatus(step.value)}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                done
                  ? 'bg-primary text-on-primary'
                  : current
                  ? 'border-2 border-secondary bg-white text-secondary'
                  : 'bg-surface-container-high text-outline hover:bg-secondary-container/30 hover:text-secondary'
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                data-icon={step.icon}
                style={done ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {step.icon}
              </span>
            </button>
          );
        })}
      </div>

      {pendingStatus && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-outline-variant bg-white p-2 shadow-lg">
          <p className="mb-2 font-label-caps text-[11px] text-on-surface-variant">
            Cambiar a "{STEPS.find((s) => s.value === pendingStatus)?.label}"
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
              onClick={() => setPendingStatus(null)}
              className="rounded px-3 py-1 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-low"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={saving}
              className="rounded bg-primary px-3 py-1 font-label-caps text-[11px] text-on-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { updateWorkOrderType } from '../../api/workOrders.js';
import { ORDER_TYPE_LABELS } from '../../constants/stages.js';

const ORDER_TYPE_BADGE_CLASS = {
  SERVICIO: 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary',
  HYP: 'border-secondary/40 bg-secondary-container/15 text-secondary hover:border-secondary',
};

export default function OrderTypeSelector({ workOrder, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const [saving, setSaving] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setPendingType(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function handleConfirm() {
    if (!pendingType || pendingType === workOrder.orderType) {
      setOpen(false);
      setPendingType(null);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateWorkOrderType(workOrder.id, pendingType);
      onUpdated?.(updated);
      setOpen(false);
      setPendingType(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Cambiar tipo de orden"
        className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 font-label-caps text-[11px] transition-colors ${
          ORDER_TYPE_BADGE_CLASS[workOrder.orderType] || ORDER_TYPE_BADGE_CLASS.SERVICIO
        }`}
      >
        <span className="material-symbols-outlined text-xs" data-icon="swap_horiz">
          swap_horiz
        </span>
        {ORDER_TYPE_LABELS[workOrder.orderType] || workOrder.orderType}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-outline-variant bg-white p-3 shadow-lg">
          <p className="mb-2 font-label-caps text-[11px] text-on-surface-variant">Tipo de orden</p>
          <div className="mb-2 flex gap-2">
            {Object.entries(ORDER_TYPE_LABELS).map(([value, label]) => {
              const active = (pendingType ?? workOrder.orderType) === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPendingType(value)}
                  className={`flex-1 rounded border px-2 py-1 font-label-caps text-[11px] ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {pendingType && pendingType !== workOrder.orderType && (
            <p className="mb-2 text-[11px] text-error">
              Cambiar el tipo de orden reinicia el avance a la primera etapa del nuevo flujo.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setPendingType(null);
              }}
              className="rounded px-3 py-1 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={saving || !pendingType}
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

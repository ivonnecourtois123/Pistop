import { useState } from 'react';
import { updateWorkOrderSubState } from '../../api/workOrders.js';
import { getSubStates } from '../../constants/stages.js';

// Chips de sub-estado para la etapa actual de la orden (ej. "Por asignar" en Recibido). Cada
// chip es un toggle: prender uno apaga el anterior, y volver a hacer clic en el activo lo quita.
// No renderiza nada si la etapa vigente no tiene sub-estados definidos.
export default function SubStateSelector({ workOrder, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const subStates = getSubStates(workOrder.status);

  if (subStates.length === 0) return null;

  async function handleToggle(key) {
    setSaving(true);
    try {
      const next = workOrder.subState === key ? null : key;
      const updated = await updateWorkOrderSubState(workOrder.id, next);
      onUpdated?.(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {subStates.map((sub) => {
        const active = workOrder.subState === sub.key;
        return (
          <button
            key={sub.key}
            type="button"
            disabled={saving}
            onClick={() => handleToggle(sub.key)}
            title={active ? `Quitar "${sub.label}"` : `Marcar como "${sub.label}"`}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 font-label-caps text-[11px] transition-colors disabled:opacity-50 ${
              active
                ? 'border-error bg-error-container/40 text-on-error-container'
                : 'border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xs" data-icon={sub.icon}>
              {sub.icon}
            </span>
            {sub.label}
          </button>
        );
      })}
    </div>
  );
}

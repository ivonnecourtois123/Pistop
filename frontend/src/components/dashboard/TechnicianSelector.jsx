import { useEffect, useRef, useState } from 'react';
import { updateWorkOrderTechnician } from '../../api/workOrders.js';
import { listTechnicians } from '../../api/technicians.js';

export default function TechnicianSelector({ workOrder, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setOpen(true);
    if (technicians.length === 0) {
      setLoading(true);
      listTechnicians()
        .then((all) => all.filter((t) => t.team === workOrder.orderType))
        .then(setTechnicians)
        .finally(() => setLoading(false));
    }
  }

  async function handleSelect(technicianId) {
    if (technicianId === (workOrder.technicianId ?? null)) {
      setOpen(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateWorkOrderTechnician(workOrder.id, technicianId);
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
        title="Cambiar técnico asignado"
        className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 font-label-caps text-[11px] transition-colors ${
          workOrder.technician
            ? 'border-outline-variant text-primary hover:border-primary'
            : 'border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-xs" data-icon="engineering">
          engineering
        </span>
        {workOrder.technician?.name?.trim() || 'Sin asignar'}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-lg border border-outline-variant bg-white p-2 shadow-lg">
          <p className="mb-1 px-1 font-label-caps text-[11px] text-on-surface-variant">Técnico asignado</p>
          {loading ? (
            <p className="px-1 py-2 text-xs text-on-surface-variant">Cargando...</p>
          ) : (
            <div className="max-h-56 overflow-y-auto">
              <button
                type="button"
                onClick={() => handleSelect(null)}
                disabled={saving}
                className={`block w-full rounded px-2 py-1.5 text-left font-label-caps text-[11px] disabled:opacity-50 ${
                  !workOrder.technicianId ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Sin asignar
              </button>
              {technicians.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(t.id)}
                  disabled={saving}
                  className={`block w-full truncate rounded px-2 py-1.5 text-left font-label-caps text-[11px] disabled:opacity-50 ${
                    workOrder.technicianId === t.id ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {t.name.trim()}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

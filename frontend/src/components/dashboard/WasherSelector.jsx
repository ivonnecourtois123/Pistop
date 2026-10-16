import { useEffect, useRef, useState } from 'react';
import { updateWorkOrderWasher } from '../../api/workOrders.js';
import { listTechnicians } from '../../api/technicians.js';

export default function WasherSelector({ workOrder, onUpdated, compact = false }) {
  const [open, setOpen] = useState(false);
  const [washers, setWashers] = useState([]);
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
    if (washers.length === 0) {
      setLoading(true);
      listTechnicians()
        .then((all) => all.filter((t) => t.team === 'LAVADO' && t.active))
        .then(setWashers)
        .finally(() => setLoading(false));
    }
  }

  async function handleSelect(washerId) {
    if (washerId === (workOrder.washerId ?? null)) {
      setOpen(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateWorkOrderWasher(workOrder.id, washerId);
      onUpdated?.(updated);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const washerName = workOrder.washer?.name?.trim() || 'Sin lavador';

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleOpen}
        title="Asignar lavador a esta orden"
        className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-label-caps text-[10px] transition-colors cursor-pointer ${
          workOrder.washer
            ? 'border-blue-300 bg-blue-50 text-blue-900 font-bold hover:border-blue-500'
            : 'border-dashed border-outline-variant text-on-surface-variant hover:border-blue-400 hover:text-blue-800'
        }`}
      >
        <span className="text-[11px]">🚿</span>
        <span className="truncate max-w-[110px]">{washerName}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-56 rounded-xl border border-outline-variant bg-white p-2 shadow-xl animate-in fade-in duration-100">
          <p className="mb-1.5 px-2 font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Lavador Asignado
          </p>
          {loading ? (
            <p className="px-2 py-2 text-xs text-on-surface-variant">Cargando personal de lavado...</p>
          ) : (
            <div className="max-h-52 overflow-y-auto space-y-0.5">
              <button
                type="button"
                onClick={() => handleSelect(null)}
                disabled={saving}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-label-caps text-xs disabled:opacity-50 transition-colors cursor-pointer ${
                  !workOrder.washerId
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span>Sin asignar</span>
                {!workOrder.washerId && <span className="text-primary font-bold">✓</span>}
              </button>
              {washers.length === 0 ? (
                <p className="px-2 py-2 text-[11px] text-amber-800 bg-amber-50 rounded-lg">
                  No hay lavadores registrados en Configuración con equipo &quot;Lavado&quot;.
                </p>
              ) : (
                washers.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelect(w.id)}
                    disabled={saving}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-label-caps text-xs disabled:opacity-50 transition-colors cursor-pointer ${
                      workOrder.washerId === w.id
                        ? 'bg-blue-100 text-blue-900 font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="truncate">{w.name.trim()}</span>
                    {workOrder.washerId === w.id && <span className="text-blue-700 font-bold">✓</span>}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

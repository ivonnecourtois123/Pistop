import { useEffect, useRef, useState } from 'react';
import { updateServiceCategory } from '../../api/workOrders.js';
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LABEL } from '../../constants/priority.js';

export default function ServiceCategorySelector({ workOrder, onUpdated }) {
  const [open, setOpen] = useState(false);
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

  async function handleSelect(key) {
    if (key === (workOrder.serviceCategory ?? null)) {
      setOpen(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await updateServiceCategory(workOrder.id, key);
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
        onClick={() => setOpen((v) => !v)}
        title="Cambiar tipo de servicio"
        className={`whitespace-nowrap rounded-full border px-3 py-1 font-label-caps text-[11px] transition-colors ${
          workOrder.serviceCategory
            ? 'border-outline-variant text-primary hover:border-primary'
            : 'border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`}
      >
        {SERVICE_CATEGORY_LABEL[workOrder.serviceCategory] || 'Sin definir'}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-lg border border-outline-variant bg-white p-2 shadow-lg">
          <p className="mb-1 px-1 font-label-caps text-[11px] text-on-surface-variant">Tipo de servicio</p>
          <button
            type="button"
            onClick={() => handleSelect(null)}
            disabled={saving}
            className={`block w-full rounded px-2 py-1.5 text-left font-label-caps text-[11px] disabled:opacity-50 ${
              !workOrder.serviceCategory ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Sin definir
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleSelect(cat.key)}
              disabled={saving}
              className={`block w-full rounded px-2 py-1.5 text-left font-label-caps text-[11px] disabled:opacity-50 ${
                workOrder.serviceCategory === cat.key ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

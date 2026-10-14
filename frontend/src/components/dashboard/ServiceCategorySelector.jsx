import { useEffect, useRef, useState } from 'react';
import { updateServiceCategory } from '../../api/workOrders.js';
import { getServiceCategoryHours } from '../../api/capacity.js';
import { formatServiceCategoryLabel } from '../../constants/priority.js';

export default function ServiceCategorySelector({ workOrder, onUpdated, availableCategories }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState(availableCategories || []);
  const containerRef = useRef(null);

  useEffect(() => {
    if (availableCategories && availableCategories.length > 0) {
      setCategories(availableCategories);
    } else {
      getServiceCategoryHours()
        .then((rows) => setCategories(rows || []))
        .catch(() => {});
    }
  }, [availableCategories]);

  useEffect(() => {
    if (open) {
      getServiceCategoryHours()
        .then((rows) => setCategories(rows || []))
        .catch(() => {});
    }
  }, [open]);

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

  const currentCategoryKey = workOrder.serviceCategory;
  const isCustomOrObsolete = currentCategoryKey && !categories.some((c) => c.category === currentCategoryKey);
  const displayLabel = formatServiceCategoryLabel(currentCategoryKey);

  return (
    <div className="relative" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={isCustomOrObsolete ? `Trabajo "${displayLabel}" no está en el catálogo actual` : "Cambiar tipo de servicio"}
        className={`whitespace-nowrap rounded-full border px-3 py-1 font-label-caps text-[11px] transition-colors flex items-center gap-1.5 ${
          currentCategoryKey
            ? isCustomOrObsolete
              ? 'border-amber-400 bg-amber-50 text-amber-900 font-semibold hover:border-amber-500'
              : 'border-outline-variant text-primary hover:border-primary'
            : 'border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`}
      >
        {isCustomOrObsolete && (
          <span className="material-symbols-outlined text-[13px] text-amber-600 font-bold" data-icon="warning">
            warning
          </span>
        )}
        <span>{displayLabel}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-outline-variant bg-white p-2 shadow-xl">
          <p className="mb-1.5 px-2 font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Tipo de servicio (Mano de Obra)
          </p>

          <button
            type="button"
            onClick={() => handleSelect(null)}
            disabled={saving}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-label-caps text-xs disabled:opacity-50 transition-colors cursor-pointer ${
              !currentCategoryKey
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span>Sin definir</span>
            {!currentCategoryKey && <span className="text-primary font-bold">✓</span>}
          </button>

          {isCustomOrObsolete && (
            <div className="my-1.5 border border-amber-200 bg-amber-50/80 p-2 rounded-lg text-left">
              <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-amber-600">warning</span>
                Valor actual asignado:
              </span>
              <p className="font-bold text-xs text-amber-950 mt-0.5">{displayLabel}</p>
              <p className="text-[10px] text-amber-800/80 mt-0.5">
                (No configurado en catálogo. Puedes reasignar a uno activo abajo).
              </p>
            </div>
          )}

          <div className="my-1 border-t border-outline-variant/60 pt-1 space-y-0.5 max-h-56 overflow-y-auto">
            {categories.map((cat) => {
              const isSelected = currentCategoryKey === cat.category;
              const catLabel = formatServiceCategoryLabel(cat.category);
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => handleSelect(cat.category)}
                  disabled={saving}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-label-caps text-xs disabled:opacity-50 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'text-primary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="truncate">{catLabel}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="font-data-mono text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                      {cat.hours}h
                    </span>
                    {isSelected && <span className="text-emerald-700 font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

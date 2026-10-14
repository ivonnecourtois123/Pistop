import { useEffect, useState } from 'react';
import {
  getCapacitySettings,
  updateCapacitySettings,
  getServiceCategoryHours,
  updateServiceCategoryHours,
  createServiceCategoryHours,
  deleteServiceCategoryHours,
} from '../../api/capacity.js';
import { SERVICE_CATEGORY_LABEL } from '../../constants/priority.js';

function NumberField({ label, value, onChange, step = '1' }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
      {label}
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
      />
    </label>
  );
}

export default function CapacitySettingsSection() {
  const [servicio, setServicio] = useState(null);
  const [hyp, setHyp] = useState(null);
  const [categoryHours, setCategoryHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryHours, setNewCategoryHours] = useState('1.5');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    Promise.all([getCapacitySettings('SERVICIO'), getCapacitySettings('HYP'), getServiceCategoryHours()]).then(
      ([servicioData, hypData, hoursData]) => {
        setServicio(servicioData ?? { hoursPerDay: 8, efficiency: 1, productivity: 1 });
        setHyp(hypData ?? { unitsPerTechnician: 1 });
        setCategoryHours(hoursData);
        setLoading(false);
      }
    );
  }, []);

  async function handleSaveServicio() {
    setSavingKey('SERVICIO');
    try {
      const saved = await updateCapacitySettings('SERVICIO', {
        hoursPerDay: Number(servicio.hoursPerDay),
        efficiency: Number(servicio.efficiency),
        productivity: Number(servicio.productivity),
      });
      setServicio(saved);
    } finally {
      setSavingKey(null);
    }
  }

  async function handleSaveHyp() {
    setSavingKey('HYP');
    try {
      const saved = await updateCapacitySettings('HYP', {
        unitsPerTechnician: Number(hyp.unitsPerTechnician),
      });
      setHyp(saved);
    } finally {
      setSavingKey(null);
    }
  }

  function updateCategoryLocal(category, hours) {
    setCategoryHours((prev) => prev.map((c) => (c.category === category ? { ...c, hours } : c)));
  }

  async function handleSaveCategory(category) {
    const row = categoryHours.find((c) => c.category === category);
    setSavingKey(category);
    try {
      await updateServiceCategoryHours(category, Number(row.hours));
    } finally {
      setSavingKey(null);
    }
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      const created = await createServiceCategoryHours(
        newCategoryName.trim(),
        Number(newCategoryHours) || 1.5
      );
      setCategoryHours((prev) => {
        const filtered = prev.filter((c) => c.category !== created.category);
        return [...filtered, created];
      });
      setNewCategoryName('');
      setNewCategoryHours('1.5');
    } finally {
      setIsAddingCategory(false);
    }
  }

  async function handleDeleteCategory(category) {
    const label = SERVICE_CATEGORY_LABEL[category] || category;
    if (!window.confirm(`¿Confirmas que deseas eliminar el tipo de servicio "${label}"?`)) {
      return;
    }
    setDeletingKey(category);
    try {
      await deleteServiceCategoryHours(category);
      setCategoryHours((prev) => prev.filter((c) => c.category !== category));
    } finally {
      setDeletingKey(null);
    }
  }

  if (loading) return <p className="text-on-surface-variant">Cargando capacidad...</p>;

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <h2 className="mb-1 font-headline-md text-headline-md text-primary">Capacidad instalada</h2>
      <p className="mb-4 text-sm text-on-surface-variant">
        Define cómo se calcula la capacidad de cada módulo frente a la demanda de órdenes en proceso.
      </p>

      <div className="mb-6 border-b border-outline-variant pb-6">
        <h3 className="mb-3 font-label-caps text-[11px] text-on-surface-variant">SERVICIO (horas/día)</h3>
        <div className="flex flex-wrap items-end gap-4">
          <NumberField
            label="Horas/día por técnico"
            value={servicio.hoursPerDay ?? ''}
            onChange={(v) => setServicio((s) => ({ ...s, hoursPerDay: v }))}
          />
          <NumberField
            label="Eficiencia (0–1)"
            step="0.05"
            value={servicio.efficiency ?? ''}
            onChange={(v) => setServicio((s) => ({ ...s, efficiency: v }))}
          />
          <NumberField
            label="Productividad (0–1)"
            step="0.05"
            value={servicio.productivity ?? ''}
            onChange={(v) => setServicio((s) => ({ ...s, productivity: v }))}
          />
          <button
            type="button"
            onClick={handleSaveServicio}
            disabled={savingKey === 'SERVICIO'}
            className="rounded border border-primary px-3 py-1.5 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-outline-variant pb-6">
        <h3 className="mb-3 font-label-caps text-[11px] text-on-surface-variant">HYP (cupo de unidades)</h3>
        <div className="flex flex-wrap items-end gap-4">
          <NumberField
            label="Unidades simultáneas por técnico"
            value={hyp.unitsPerTechnician ?? ''}
            onChange={(v) => setHyp((h) => ({ ...h, unitsPerTechnician: v }))}
          />
          <button
            type="button"
            onClick={handleSaveHyp}
            disabled={savingKey === 'HYP'}
            className="rounded border border-primary px-3 py-1.5 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 border-b border-outline-variant/60 pb-2">
          <div>
            <h3 className="font-label-caps text-xs font-bold uppercase text-primary">
              Horas Estándar por Tipo de Servicio (Servicio Mecánico)
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Define los tipos de servicio disponibles y las horas promedio que requiere cada uno para el cálculo de capacidad del taller.
            </p>
          </div>
        </div>

        {/* Formulario para agregar nuevo tipo de servicio */}
        <div className="mb-5 rounded-xl border border-dashed border-outline-variant bg-slate-50/70 p-4">
          <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-emerald-600">add_circle</span>
            Agregar Nuevo Tipo de Servicio
          </span>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-on-surface-variant font-medium flex-1 min-w-[200px]">
              Nombre / Descripción del servicio
              <input
                type="text"
                placeholder="Ej. Cambio de Frenos, Afinación Mayor, etc."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:border-emerald-600 focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-on-surface-variant font-medium w-32">
              Horas estándar
              <input
                type="number"
                step="0.25"
                min="0"
                placeholder="1.5"
                value={newCategoryHours}
                onChange={(e) => setNewCategoryHours(e.target.value)}
                className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:border-emerald-600 focus:outline-none"
              />
            </label>

            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={isAddingCategory || !newCategoryName.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 font-label-caps text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {isAddingCategory ? 'Agregando...' : 'Crear Tipo de Servicio'}
            </button>
          </div>
        </div>

        {/* Tarjetas / Filas de tipos de servicio existentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryHours.map((c) => {
            const isSaving = savingKey === c.category;
            const isDeleting = deletingKey === c.category;
            const displayLabel = SERVICE_CATEGORY_LABEL[c.category] || c.category.replace(/_/g, ' ');

            return (
              <div
                key={c.category}
                className="flex flex-col justify-between rounded-xl border border-outline-variant/80 bg-white p-3.5 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-primary block truncate" title={displayLabel}>
                      {displayLabel}
                    </span>
                    <span className="font-data-mono text-[10px] text-slate-400 block uppercase">
                      {c.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c.category)}
                    disabled={isDeleting}
                    className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title={`Eliminar tipo de servicio "${displayLabel}"`}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      value={c.hours}
                      onChange={(v) => updateCategoryLocal(c.category, v.target.value)}
                      className="w-20 rounded-lg border border-outline-variant bg-slate-50 px-2 py-1 text-xs font-data-mono font-bold text-primary focus:bg-white focus:border-primary focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">horas</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveCategory(c.category)}
                    disabled={isSaving}
                    className="rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1 font-label-caps text-[11px] font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

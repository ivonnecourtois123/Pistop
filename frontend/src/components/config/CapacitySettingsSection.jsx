import { useEffect, useState } from 'react';
import {
  getCapacitySettings,
  updateCapacitySettings,
  getServiceCategoryHours,
  getServiceCategoryImpact,
  getOrphanedServiceCategories,
  reassignServiceCategory,
  updateServiceCategoryHours,
  createServiceCategoryHours,
  deleteServiceCategoryHours,
} from '../../api/capacity.js';
import { formatServiceCategoryLabel } from '../../constants/priority.js';

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
  const [orphanedGroups, setOrphanedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryHours, setNewCategoryHours] = useState('1.5');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Estados para Modales de Alerta de Impacto
  const [impactModal, setImpactModal] = useState(null); // { type: 'delete' | 'edit', category, count, orders, ... }
  const [checkingImpactFor, setCheckingImpactFor] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [reassignSelections, setReassignSelections] = useState({}); // { [orphanedCat]: targetCat }

  function loadData() {
    Promise.all([
      getCapacitySettings('SERVICIO'),
      getCapacitySettings('HYP'),
      getServiceCategoryHours(),
      getOrphanedServiceCategories().catch(() => []),
    ]).then(([servicioData, hypData, hoursData, orphanedData]) => {
      setServicio(servicioData ?? { hoursPerDay: 8, efficiency: 1, productivity: 1 });
      setHyp(hypData ?? { unitsPerTechnician: 1 });
      setCategoryHours(hoursData || []);
      setOrphanedGroups(orphanedData || []);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadData();
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

  async function handleSaveCategoryHours(category) {
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
      // Recargar orphaned por si este nuevo catálogo absorbe alguno
      getOrphanedServiceCategories().then((res) => setOrphanedGroups(res || []));
    } finally {
      setIsAddingCategory(false);
    }
  }

  // Iniciar flujo de Eliminación con verificación previa de órdenes asociadas
  async function handleRequestDelete(category) {
    setCheckingImpactFor(category);
    try {
      const impact = await getServiceCategoryImpact(category);
      const otherCategories = categoryHours.filter((c) => c.category !== category);

      if (impact.count === 0) {
        const label = formatServiceCategoryLabel(category);
        if (window.confirm(`¿Confirmas que deseas eliminar el tipo de servicio "${label}"? (No hay órdenes afectadas).`)) {
          await deleteServiceCategoryHours(category);
          setCategoryHours((prev) => prev.filter((c) => c.category !== category));
        }
      } else {
        // Abrir modal de impacto
        setImpactModal({
          type: 'delete',
          category,
          count: impact.count,
          orders: impact.orders,
          actionChoice: otherCategories.length > 0 ? 'reassign' : 'unassign',
          reassignTo: otherCategories[0]?.category || '',
        });
      }
    } finally {
      setCheckingImpactFor(null);
    }
  }

  // Iniciar flujo de Edición con verificación de órdenes asociadas
  async function handleRequestEdit(c) {
    setCheckingImpactFor(c.category);
    try {
      const impact = await getServiceCategoryImpact(c.category);
      setImpactModal({
        type: 'edit',
        category: c.category,
        editName: formatServiceCategoryLabel(c.category),
        editHours: c.hours,
        count: impact.count,
        orders: impact.orders,
      });
    } finally {
      setCheckingImpactFor(null);
    }
  }

  // Confirmar eliminación desde el modal con reasignación o desasignación
  async function handleConfirmDelete() {
    if (!impactModal) return;
    setActionInProgress(true);
    try {
      const { category, actionChoice, reassignTo } = impactModal;
      const options =
        actionChoice === 'reassign' && reassignTo
          ? { reassignTo }
          : { unassign: true };

      await deleteServiceCategoryHours(category, options);
      setCategoryHours((prev) => prev.filter((c) => c.category !== category));
      setImpactModal(null);
      // Recargar huérfanos por si cambiaron
      getOrphanedServiceCategories().then((res) => setOrphanedGroups(res || []));
    } finally {
      setActionInProgress(false);
    }
  }

  // Confirmar edición desde el modal
  async function handleConfirmEdit() {
    if (!impactModal) return;
    setActionInProgress(true);
    try {
      const { category, editName, editHours } = impactModal;
      const numHours = parseFloat(editHours) || 0;
      const cleanNewCat = editName.trim().toUpperCase().replace(/\s+/g, '_');

      await updateServiceCategoryHours(category, numHours, cleanNewCat);
      setCategoryHours((prev) =>
        prev.map((c) => (c.category === category ? { ...c, category: cleanNewCat, hours: numHours } : c))
      );
      setImpactModal(null);
      getOrphanedServiceCategories().then((res) => setOrphanedGroups(res || []));
    } finally {
      setActionInProgress(false);
    }
  }

  // Resolver grupo de órdenes huérfanas
  async function handleResolveOrphaned(orphanedCat) {
    const target = reassignSelections[orphanedCat] || '';
    setActionInProgress(true);
    try {
      await reassignServiceCategory(orphanedCat, target || null);
      setOrphanedGroups((prev) => prev.filter((g) => g.category !== orphanedCat));
    } finally {
      setActionInProgress(false);
    }
  }

  if (loading) return <p className="text-on-surface-variant">Cargando capacidad...</p>;

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <h2 className="mb-1 font-headline-md text-headline-md text-primary">Capacidad instalada</h2>
      <p className="mb-4 text-sm text-on-surface-variant">
        Define cómo se calcula la capacidad de cada módulo frente a la demanda de órdenes en proceso.
      </p>

      {/* SERVICIO MECÁNICO */}
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

      {/* HYP */}
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

      {/* CATÁLOGO DE TIPOS DE SERVICIO Y TIEMPOS ESTÁNDAR */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-outline-variant/60 pb-2">
          <div>
            <h3 className="font-label-caps text-xs font-bold uppercase text-primary">
              Tipos de Servicio y Horas Estándar (Servicio Mecánico)
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Administra los tipos de servicio disponibles. Toda modificación o eliminación alertará sobre las órdenes actualmente asignadas para reasignarlas de forma segura.
            </p>
          </div>
        </div>

        {/* ALERTA DE ÓRDENES HUÉRFANAS / ANTERIORES */}
        {orphanedGroups.length > 0 && (
          <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50/90 p-4 space-y-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">
                warning
              </span>
              <div>
                <h4 className="font-bold text-xs text-amber-950">
                  Órdenes con tipos de servicio eliminados o desactualizados
                </h4>
                <p className="text-[11px] text-amber-900/90 mt-0.5">
                  Se detectaron órdenes de trabajo asignadas a nombres que ya no figuran en tu catálogo activo de configuración. Reasígnalas para que calculen su capacidad correctamente:
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {orphanedGroups.map((group) => {
                const targetVal = reassignSelections[group.category] ?? (categoryHours[0]?.category || '');
                return (
                  <div
                    key={group.category}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-white p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-100 px-2 py-0.5 font-data-mono font-bold text-[11px] text-amber-900">
                        {group.category}
                      </span>
                      <span className="font-semibold text-slate-700">
                        {group.count} orden(es) afectada(s)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">Reasignar a:</span>
                      <select
                        value={targetVal}
                        onChange={(e) =>
                          setReassignSelections((prev) => ({ ...prev, [group.category]: e.target.value }))
                        }
                        className="rounded border border-outline-variant bg-white px-2 py-1 text-xs text-primary font-medium focus:border-primary focus:outline-none"
                      >
                        {categoryHours.map((c) => (
                          <option key={c.category} value={c.category}>
                            {formatServiceCategoryLabel(c.category)} ({c.hours}h)
                          </option>
                        ))}
                        <option value="">(Dejar Sin definir)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleResolveOrphaned(group.category)}
                        disabled={actionInProgress}
                        className="rounded bg-amber-600 px-3 py-1 font-label-caps text-[11px] font-bold text-white hover:bg-amber-700 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {actionInProgress ? 'Actualizando...' : 'Reasignar Órdenes'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Formulario para agregar nuevo tipo de servicio */}
        <div className="mb-5 rounded-xl border border-dashed border-outline-variant bg-slate-50/70 p-4">
          <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-emerald-600">add_circle</span>
            Crear Nuevo Tipo de Servicio
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
            const isChecking = checkingImpactFor === c.category;
            const displayLabel = formatServiceCategoryLabel(c.category);

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

                  <div className="flex items-center gap-1">
                    {/* Botón Editar nombre / horas con alerta de impacto */}
                    <button
                      type="button"
                      onClick={() => handleRequestEdit(c)}
                      disabled={isChecking}
                      className="text-slate-400 hover:text-primary p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title={`Editar nombre y horas de "${displayLabel}"`}
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>

                    {/* Botón Eliminar con alerta de impacto */}
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(c.category)}
                      disabled={isChecking}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title={`Eliminar tipo de servicio "${displayLabel}"`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isChecking ? 'hourglass_empty' : 'delete'}
                      </span>
                    </button>
                  </div>
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
                    onClick={() => handleSaveCategoryHours(c.category)}
                    disabled={isSaving}
                    className="rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1 font-label-caps text-[11px] font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar Horas'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ALERTA DE IMPACTO AL ELIMINAR TRABAJO */}
      {/* ======================================================== */}
      {impactModal?.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-error/30 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </span>
              <div>
                <h3 className="font-headline-md text-base font-bold text-primary">
                  Alerta: Órdenes asociadas a &quot;{formatServiceCategoryLabel(impactModal.category)}&quot;
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Hay <strong className="text-red-700">{impactModal.count} orden(es)</strong> que tienen asignado este tipo de servicio.
                </p>
              </div>
            </div>

            {/* Listado de órdenes afectadas */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Órdenes con este trabajo ({impactModal.count}):
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs">
                {impactModal.orders.map((wo) => (
                  <div
                    key={wo.id}
                    className="flex items-center justify-between rounded bg-white px-2.5 py-1.5 border border-slate-200/60 shadow-2xs"
                  >
                    <span className="font-data-mono font-bold text-primary">#{wo.orderNumber}</span>
                    <span className="text-slate-600 truncate max-w-[200px]">
                      {wo.vehicle ? `${wo.vehicle.brand} ${wo.vehicle.model} (${wo.vehicle.plate})` : 'Sin vehículo'}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {wo.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decisiones de resolución */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-primary block">
                ¿Qué deseas hacer con estas {impactModal.count} órdenes antes de eliminar el trabajo?
              </span>

              {categoryHours.filter((c) => c.category !== impactModal.category).length > 0 && (
                <label className="flex items-start gap-2.5 rounded-lg border border-outline-variant/60 p-3 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name="deleteAction"
                    value="reassign"
                    checked={impactModal.actionChoice === 'reassign'}
                    onChange={() => setImpactModal((prev) => ({ ...prev, actionChoice: 'reassign' }))}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1.5">
                    <span className="font-bold text-xs text-primary block">
                      Reasignar órdenes a otro tipo de servicio activo:
                    </span>
                    <select
                      value={impactModal.reassignTo}
                      disabled={impactModal.actionChoice !== 'reassign'}
                      onChange={(e) => setImpactModal((prev) => ({ ...prev, reassignTo: e.target.value }))}
                      className="w-full rounded-lg border border-outline-variant bg-white px-2.5 py-1.5 text-xs text-primary focus:border-primary focus:outline-none"
                    >
                      {categoryHours
                        .filter((c) => c.category !== impactModal.category)
                        .map((c) => (
                          <option key={c.category} value={c.category}>
                            {formatServiceCategoryLabel(c.category)} ({c.hours}h)
                          </option>
                        ))}
                    </select>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-2.5 rounded-lg border border-outline-variant/60 p-3 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="deleteAction"
                  value="unassign"
                  checked={impactModal.actionChoice === 'unassign'}
                  onChange={() => setImpactModal((prev) => ({ ...prev, actionChoice: 'unassign' }))}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold text-xs text-primary block">
                    Desasignar trabajo de estas órdenes
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Las órdenes pasarán a quedar como &quot;Sin definir&quot;. Podrán ser asignadas a otro trabajo manualmente más adelante.
                  </p>
                </div>
              </label>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/60">
              <button
                type="button"
                onClick={() => setImpactModal(null)}
                disabled={actionInProgress}
                className="rounded-lg border border-outline-variant px-4 py-2 font-label-caps text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={actionInProgress}
                className="rounded-lg bg-red-600 px-4 py-2 font-label-caps text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
              >
                {actionInProgress ? 'Procesando...' : 'Confirmar y Eliminar Trabajo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDICIÓN DE TRABAJO CON ALERTA DE IMPACTO */}
      {/* ======================================================== */}
      {impactModal?.type === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <span className="material-symbols-outlined text-2xl">edit_note</span>
              </span>
              <div>
                <h3 className="font-headline-md text-base font-bold text-primary">
                  Editar Tipo de Servicio: {formatServiceCategoryLabel(impactModal.category)}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Modifica la descripción o las horas estándar requeridas.
                </p>
              </div>
            </div>

            {/* Alerta de impacto si tiene órdenes */}
            {impactModal.count > 0 ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                  <span className="material-symbols-outlined text-sm text-blue-600">info</span>
                  <span>Impacto en Órdenes Activas ({impactModal.count} órdenes):</span>
                </div>
                <p className="text-[11px] text-blue-900/90">
                  Al guardar, estas <strong>{impactModal.count} orden(es)</strong> se actualizarán automáticamente con la nueva denominación y recalcularán su proyección de horas estándar.
                </p>
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs pr-1">
                  {impactModal.orders.map((wo) => (
                    <div
                      key={wo.id}
                      className="flex items-center justify-between rounded bg-white px-2 py-1 border border-blue-100 text-[11px]"
                    >
                      <span className="font-data-mono font-bold text-blue-950">#{wo.orderNumber}</span>
                      <span className="text-slate-600 truncate max-w-[200px]">
                        {wo.vehicle ? `${wo.vehicle.brand} ${wo.vehicle.model}` : 'Sin vehículo'}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        {wo.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                Este tipo de servicio no está asignado a ninguna orden actualmente. Los cambios aplicarán a las futuras órdenes.
              </div>
            )}

            {/* Campos de edición */}
            <div className="space-y-3 pt-1">
              <label className="flex flex-col gap-1 text-xs text-on-surface-variant font-medium">
                Nombre / Descripción del servicio
                <input
                  type="text"
                  value={impactModal.editName}
                  onChange={(e) => setImpactModal((prev) => ({ ...prev, editName: e.target.value }))}
                  className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs text-primary focus:border-primary focus:outline-none font-semibold"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs text-on-surface-variant font-medium">
                Horas estándar de Mano de Obra (MO)
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={impactModal.editHours}
                  onChange={(e) => setImpactModal((prev) => ({ ...prev, editHours: e.target.value }))}
                  className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs text-primary font-data-mono font-bold focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/60">
              <button
                type="button"
                onClick={() => setImpactModal(null)}
                disabled={actionInProgress}
                className="rounded-lg border border-outline-variant px-4 py-2 font-label-caps text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmEdit}
                disabled={actionInProgress || !impactModal.editName?.trim()}
                className="rounded-lg bg-primary px-4 py-2 font-label-caps text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
              >
                {actionInProgress ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

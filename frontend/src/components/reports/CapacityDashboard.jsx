import { useEffect, useState } from 'react';
import { getCapacity, getServiceCategoryHours, updateServiceCategoryHours } from '../../api/capacity.js';
import Spinner from '../common/Spinner.jsx';

const DEFAULT_CATEGORY_LABELS = {
  MANTENIMIENTO: 'Mantenimiento Periódico / Mayor',
  DIAGNOSTICO_FALLA_RECLAMO: 'Diagnóstico de Falla / Reclamo',
  PREVIA: 'Previa / Alistamiento de Unidad',
};

export default function CapacityDashboard() {
  const [servicioCapacity, setServicioCapacity] = useState(null);
  const [hypCapacity, setHypCapacity] = useState(null);
  const [categoryHours, setCategoryHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editHoursValue, setEditHoursValue] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [serv, hyp, catHours] = await Promise.all([
        getCapacity('SERVICIO').catch(() => null),
        getCapacity('HYP').catch(() => null),
        getServiceCategoryHours().catch(() => []),
      ]);
      setServicioCapacity(serv);
      setHypCapacity(hyp);
      setCategoryHours(catHours);
    } catch {
      setError('No se pudo cargar la información de capacidad instalada.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCategoryHours(category) {
    const val = parseFloat(editHoursValue);
    if (isNaN(val) || val < 0) return;
    setSavingCategory(true);
    try {
      await updateServiceCategoryHours(category, val);
      setEditingCategory(null);
      await loadAll();
    } catch {
      alert('No se pudieron actualizar las horas estándar.');
    } finally {
      setSavingCategory(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const servicioUtilPct = servicioCapacity?.utilization != null ? Math.round(servicioCapacity.utilization * 100) : 0;
  const hypUtilPct = hypCapacity?.utilization != null ? Math.round(hypCapacity.utilization * 100) : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-error bg-error-container/30 p-4 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {/* Alerta de órdenes no clasificadas si existen */}
      {servicioCapacity?.unclassifiedCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
          <span className="material-symbols-outlined text-2xl text-amber-700" data-icon="warning">warning</span>
          <div className="text-xs">
            <strong className="font-bold">Atención: {servicioCapacity.unclassifiedCount} órdenes en proceso sin clasificar.</strong>
            <p className="mt-0.5 text-amber-800">
              Estas órdenes no están sumando horas a la demanda actual de Mano de Obra porque no tienen asignada categoría de servicio.
            </p>
          </div>
        </div>
      )}

      {/* Tarjetas de Capacidad vs Demanda */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Servicio Mecánico */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-md text-base font-bold text-primary">🔧 Capacidad MO: Servicio Mecánico</h3>
              <p className="text-xs text-on-surface-variant">Medido en horas de mano de obra disponibles por día</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-label-caps text-xs font-bold text-primary">
              {servicioCapacity?.technicianCount || 0} Técnicos activos
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="font-label-caps text-[10px] text-on-surface-variant">CAPACIDAD DISPONIBLE</p>
              <p className="mt-1 font-headline-lg text-2xl font-black text-primary">
                {servicioCapacity?.capacityHours != null ? `${servicioCapacity.capacityHours.toFixed(1)} h` : '0 h'}
              </p>
              <p className="text-[10px] text-on-surface-variant">por día laboral</p>
            </div>

            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="font-label-caps text-[10px] text-on-surface-variant">DEMANDA ASIGNADA</p>
              <p className="mt-1 font-headline-lg text-2xl font-black text-secondary">
                {servicioCapacity?.demandHours != null ? `${servicioCapacity.demandHours.toFixed(1)} h` : '0 h'}
              </p>
              <p className="text-[10px] text-on-surface-variant">en órdenes activas</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-primary">Nivel de Ocupación / Carga</span>
              <span className={`font-data-mono font-bold ${servicioUtilPct > 100 ? 'text-error' : 'text-primary'}`}>
                {servicioUtilPct}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className={`h-full rounded-full transition-all ${
                  servicioUtilPct > 100 ? 'bg-error' : servicioUtilPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, servicioUtilPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* HYP Hojalatería y Pintura */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-md text-base font-bold text-primary">🎨 Capacidad MO: Hojalatería y Pintura</h3>
              <p className="text-xs text-on-surface-variant">Medido en cupo de unidades simultáneas</p>
            </div>
            <span className="rounded-full bg-secondary/10 px-3 py-1 font-label-caps text-xs font-bold text-secondary">
              {hypCapacity?.technicianCount || 0} Técnicos activos
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="font-label-caps text-[10px] text-on-surface-variant">CUPO MÁXIMO DE UNIDADES</p>
              <p className="mt-1 font-headline-lg text-2xl font-black text-primary">
                {hypCapacity?.capacityUnits != null ? `${hypCapacity.capacityUnits} unid.` : '0 unid.'}
              </p>
              <p className="text-[10px] text-on-surface-variant">capacidad simultánea</p>
            </div>

            <div className="rounded-lg bg-surface-container-low p-3">
              <p className="font-label-caps text-[10px] text-on-surface-variant">UNIDADES EN PROCESO</p>
              <p className="mt-1 font-headline-lg text-2xl font-black text-secondary">
                {hypCapacity?.demandUnits != null ? `${hypCapacity.demandUnits} unid.` : '0 unid.'}
              </p>
              <p className="text-[10px] text-on-surface-variant">actuales en bahías</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-primary">Nivel de Ocupación HYP</span>
              <span className={`font-data-mono font-bold ${hypUtilPct > 100 ? 'text-error' : 'text-primary'}`}>
                {hypUtilPct}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className={`h-full rounded-full transition-all ${
                  hypUtilPct > 100 ? 'bg-error' : hypUtilPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, hypUtilPct)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Horas Estándar por Categoría de Servicio */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-headline-md text-sm font-bold text-primary">
              ⏱️ Catálogo de Horas Estándar de Mano de Obra
            </h3>
            <p className="text-xs text-on-surface-variant">
              Tiempos estándar aplicados para proyectar la demanda del taller de Servicio Mecánico.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low font-label-caps text-[10px] text-on-surface-variant">
                <th className="px-4 py-3 font-semibold">Categoría de Servicio</th>
                <th className="px-4 py-3 font-semibold">Clave Interna</th>
                <th className="px-4 py-3 text-center font-semibold">Horas Estándar (MO)</th>
                <th className="px-4 py-3 text-right font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {categoryHours.map((row) => (
                <tr key={row.category} className="hover:bg-surface-container-low/40">
                  <td className="px-4 py-3 font-semibold text-primary">
                    {DEFAULT_CATEGORY_LABELS[row.category] || row.category}
                  </td>
                  <td className="px-4 py-3 font-data-mono text-on-surface-variant">{row.category}</td>
                  <td className="px-4 py-3 text-center font-data-mono">
                    {editingCategory === row.category ? (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={editHoursValue}
                        onChange={(e) => setEditHoursValue(e.target.value)}
                        className="w-20 rounded border border-primary px-2 py-1 text-center font-bold text-primary focus:outline-none"
                      />
                    ) : (
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
                        {row.hours} h
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingCategory === row.category ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="rounded px-2.5 py-1 text-xs text-on-surface-variant hover:bg-surface-container"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={savingCategory}
                          onClick={() => handleSaveCategoryHours(row.category)}
                          className="rounded bg-primary px-3 py-1 text-xs font-bold text-on-primary"
                        >
                          {savingCategory ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(row.category);
                          setEditHoursValue(String(row.hours));
                        }}
                        className="rounded bg-surface-container px-3 py-1 font-label-caps text-[10px] font-bold text-primary hover:bg-primary hover:text-on-primary"
                      >
                        Editar Horas
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

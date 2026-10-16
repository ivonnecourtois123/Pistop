import { useEffect, useMemo, useState } from 'react';
import {
  getWorkshopOperations,
  createWorkshopOperation,
  updateWorkshopOperation,
  deleteWorkshopOperation,
} from '../../api/workshopOperations.js';

const CATEGORIES = [
  { key: 'ALL', label: 'Todas' },
  { key: 'MECANICA', label: 'Mecánica' },
  { key: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { key: 'DIAGNOSTICO', label: 'Diagnóstico' },
  { key: 'LAVADO', label: 'Lavado' },
  { key: 'HYP', label: 'Hojalatería y Pintura' },
];

export default function WorkshopOperationsSection() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Estados de modal de creación / edición
  const [editingOp, setEditingOp] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    hoursCars: '1.0',
    hoursTrucks: '1.5',
    category: 'MECANICA',
  });

  function fetchOperations() {
    setLoading(true);
    getWorkshopOperations()
      .then((data) => {
        setOperations(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando operaciones:', err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchOperations();
  }, []);

  // Filtrado reactivo en memoria
  const filteredOperations = useMemo(() => {
    let list = operations;
    if (categoryFilter !== 'ALL') {
      list = list.filter((op) => (op.category || 'MECANICA') === categoryFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (op) =>
          op.code.toLowerCase().includes(q) ||
          op.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [operations, categoryFilter, search]);

  // Reseteo de página al filtrar
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOperations.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOperations.slice(start, start + pageSize);
  }, [filteredOperations, page, pageSize]);

  function handleOpenCreate() {
    setFormData({
      code: '',
      description: '',
      hoursCars: '1.0',
      hoursTrucks: '1.5',
      category: 'MECANICA',
    });
    setIsNewModalOpen(true);
  }

  function handleOpenEdit(op) {
    setEditingOp(op);
    setFormData({
      code: op.code,
      description: op.description,
      hoursCars: String(op.hoursCars),
      hoursTrucks: String(op.hoursTrucks),
      category: op.category || 'MECANICA',
    });
  }

  async function handleSaveNew(e) {
    e.preventDefault();
    if (!formData.code.trim() || !formData.description.trim()) return;
    setSaving(true);
    try {
      const created = await createWorkshopOperation({
        code: formData.code.trim(),
        description: formData.description.trim(),
        hoursCars: parseFloat(formData.hoursCars) || 0,
        hoursTrucks: parseFloat(formData.hoursTrucks) || 0,
        category: formData.category,
      });
      setOperations((prev) => [created, ...prev]);
      setIsNewModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear la operación');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingOp) return;
    setSaving(true);
    try {
      const updated = await updateWorkshopOperation(editingOp.id, {
        description: formData.description.trim(),
        hoursCars: parseFloat(formData.hoursCars) || 0,
        hoursTrucks: parseFloat(formData.hoursTrucks) || 0,
        category: formData.category,
      });
      setOperations((prev) => prev.map((op) => (op.id === updated.id ? updated : op)));
      setEditingOp(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar la operación');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(op) {
    try {
      const updated = await updateWorkshopOperation(op.id, { active: !op.active });
      setOperations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      alert('Error al cambiar el estatus');
    }
  }

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation transition-all">
      {/* Cabecera Desplegable (Accordion) */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 ${
          isExpanded ? 'border-b border-outline-variant/70 pb-3 mb-4' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="flex-1 flex flex-wrap items-center justify-between gap-2 text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">
                {isExpanded ? 'folder_open' : 'folder'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-primary">
                  Catálogo Maestro de Operaciones y Horas Estándar
                </h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-data-mono text-xs font-bold text-primary">
                  {operations.length} registradas
                </span>
              </div>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {isExpanded
                  ? 'Tiempos de mano de obra oficiales para Coches y Camionetas.'
                  : 'Haz clic aquí para desplegar la lista de operaciones, buscar, consultar o editar tiempos.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs font-label-caps font-bold text-primary group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-2xs">
            <span>{isExpanded ? 'Ocultar catálogo' : 'Desplegar catálogo'}</span>
            <span className="material-symbols-outlined text-sm">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </button>

        {isExpanded && (
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 font-label-caps text-xs font-bold text-on-primary shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nueva Operación
          </button>
        )}
      </div>

      {/* Contenido desplegable */}
      {isExpanded && (
        <div className="animate-in fade-in duration-200">
          {/* Controles de búsqueda y filtros */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Input de Búsqueda */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por código (ej. 1235) o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-white pl-9 pr-3 py-1.5 text-xs text-primary placeholder:text-slate-400 focus:border-primary focus:outline-none shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-primary text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pills de Categoría */}
        <div className="flex flex-wrap items-center gap-1">
          {CATEGORIES.map((cat) => {
            const count =
              cat.key === 'ALL'
                ? operations.length
                : operations.filter((op) => (op.category || 'MECANICA') === cat.key).length;
            const isSelected = categoryFilter === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryFilter(cat.key)}
                className={`rounded-full px-2.5 py-1 font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla de Operaciones */}
      {loading ? (
        <p className="py-8 text-center text-xs text-on-surface-variant">Cargando catálogo de operaciones...</p>
      ) : filteredOperations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant p-8 text-center">
          <p className="text-xs text-on-surface-variant">
            No se encontraron operaciones con los filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-outline-variant/60">
          <table className="w-full min-w-max border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/60 bg-surface-container/40 font-label-caps text-[10px] uppercase text-on-surface-variant">
                <th className="px-3 py-2 w-20">ID / Código</th>
                <th className="px-3 py-2">Descripción de la Operación</th>
                <th className="px-3 py-2 text-center w-28">Coches</th>
                <th className="px-3 py-2 text-center w-28">Camionetas</th>
                <th className="px-3 py-2 text-center w-28">Categoría</th>
                <th className="px-3 py-2 text-center w-24">Estatus</th>
                <th className="px-3 py-2 text-right w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {paginatedList.map((op) => (
                <tr
                  key={op.id}
                  className={`hover:bg-surface-container-low/50 transition-colors ${
                    !op.active ? 'opacity-50 bg-slate-50' : ''
                  }`}
                >
                  <td className="px-3 py-2 font-data-mono font-bold text-primary">
                    <span className="rounded bg-surface-container px-1.5 py-0.5">
                      {op.code}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-800">
                    {op.description}
                  </td>
                  <td className="px-3 py-2 text-center font-data-mono font-bold text-emerald-800">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      {op.hoursCars.toFixed(2)} h
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center font-data-mono font-bold text-blue-800">
                    <span className="rounded bg-blue-50 px-2 py-0.5 border border-blue-200">
                      {op.hoursTrucks.toFixed(2)} h
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-label-caps text-[9px] font-bold text-slate-600">
                      {op.category || 'MECANICA'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(op)}
                      className={`rounded-full px-2 py-0.5 font-label-caps text-[9px] font-bold cursor-pointer transition-colors ${
                        op.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                      title={op.active ? 'Clic para desactivar' : 'Clic para activar'}
                    >
                      {op.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(op)}
                      className="p-1 rounded text-slate-400 hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                      title="Editar tiempos estándar o descripción"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {filteredOperations.length > pageSize && (
        <div className="flex items-center justify-between gap-3 border-t border-outline-variant/50 pt-3 mt-3 text-xs text-on-surface-variant">
          <span>
            Mostrando {(page - 1) * pageSize + 1} a{' '}
            {Math.min(page * pageSize, filteredOperations.length)} de{' '}
            <strong>{filteredOperations.length}</strong> operaciones
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-outline-variant px-2.5 py-1 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            <span className="px-2 font-data-mono font-bold text-primary">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded border border-outline-variant px-2.5 py-1 hover:bg-surface-container disabled:opacity-40 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )}

      {/* Modal para Crear / Editar Operación */}
      {(isNewModalOpen || editingOp) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/70 pb-3 mb-4">
              <h3 className="font-headline-md text-sm font-bold text-primary">
                {isNewModalOpen ? 'Nueva Operación de Catálogo' : `Editar Operación [${editingOp.code}]`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingOp(null);
                }}
                className="text-slate-400 hover:text-primary text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={isNewModalOpen ? handleSaveNew : handleSaveEdit} className="space-y-3.5">
              {isNewModalOpen && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código / ID Operación
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1380"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant px-3 py-1.5 font-data-mono text-xs text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. CAMBIO DE SOPORTE DE MOTOR"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant px-3 py-1.5 text-xs text-primary focus:border-primary focus:outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    🚗 Horas Coches
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={formData.hoursCars}
                    onChange={(e) => setFormData({ ...formData, hoursCars: e.target.value })}
                    className="w-full rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 font-data-mono text-xs text-emerald-900 focus:border-emerald-600 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    🚙 Horas Camionetas
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={formData.hoursTrucks}
                    onChange={(e) => setFormData({ ...formData, hoursTrucks: e.target.value })}
                    className="w-full rounded-lg border border-blue-300 bg-blue-50/40 px-3 py-1.5 font-data-mono text-xs text-blue-900 focus:border-blue-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:border-primary focus:outline-none"
                >
                  <option value="MECANICA">Mecánica</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                  <option value="DIAGNOSTICO">Diagnóstico</option>
                  <option value="LAVADO">Lavado</option>
                  <option value="HYP">Hojalatería y Pintura</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-outline-variant/60 pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewModalOpen(false);
                    setEditingOp(null);
                  }}
                  className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

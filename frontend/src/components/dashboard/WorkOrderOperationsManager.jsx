import { useEffect, useMemo, useState } from 'react';
import {
  getWorkshopOperations,
  addWorkOrderOperationsBatch,
  updateWorkOrderOperation,
  deleteWorkOrderOperation,
} from '../../api/workshopOperations.js';
import { updateCustomerWaiting } from '../../api/workOrders.js';
import InlineCheckbox from './InlineCheckbox.jsx';

export default function WorkOrderOperationsManager({
  workOrder,
  technicians = [],
  onUpdated,
  onToggleCustomerWaiting,
}) {
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Formulario para agregar operación
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Detección inicial de tipo de vehículo (Coche vs Camioneta)
  const defaultVehicleType = useMemo(() => {
    const model = (workOrder.vehicle?.model || '').toUpperCase();
    if (
      model.includes('NP300') ||
      model.includes('FRONTIER') ||
      model.includes('KICKS') ||
      model.includes('XTRAIL') ||
      model.includes('X-TRAIL') ||
      model.includes('PATHFINDER') ||
      model.includes('URVAN') ||
      model.includes('CABSTAR') ||
      model.includes('TITAN') ||
      model.includes('ARMADA')
    ) {
      return 'CAMIONETA';
    }
    return 'COCHE';
  }, [workOrder.vehicle?.model]);

  const [vehicleCategory, setVehicleCategory] = useState(defaultVehicleType);
  const [customDescription, setCustomDescription] = useState('');
  const [customHours, setCustomHours] = useState('1.0');
  const [defaultTechId, setDefaultTechId] = useState(workOrder.technicianId || '');
  const [saving, setSaving] = useState(false);

  // Bandeja de operaciones por confirmar (captura múltiple)
  const [stagedOps, setStagedOps] = useState([]);

  const operations = workOrder.operations || [];

  useEffect(() => {
    setCatalogLoading(true);
    getWorkshopOperations({ active: true })
      .then((data) => {
        setCatalog(data || []);
        setCatalogLoading(false);
      })
      .catch(() => setCatalogLoading(false));
  }, []);

  // Filtrar catálogo según término de búsqueda
  const filteredCatalog = useMemo(() => {
    if (!searchTerm.trim()) return catalog.slice(0, 35);
    const q = searchTerm.trim().toLowerCase();
    return catalog
      .filter(
        (op) =>
          op.code.toLowerCase().includes(q) ||
          op.description.toLowerCase().includes(q)
      )
      .slice(0, 60);
  }, [catalog, searchTerm]);

  // Total de horas de operaciones ya guardadas en la orden
  const totalOperationsHours = useMemo(() => {
    return operations.reduce((sum, op) => sum + (op.standardHours || 0), 0);
  }, [operations]);

  // Total de horas de las operaciones en bandeja temporal (por confirmar)
  const totalStagedHours = useMemo(() => {
    return stagedOps.reduce((sum, op) => sum + (op.standardHours || 0), 0);
  }, [stagedOps]);

  // Cambiar categoría de vehículo y recalcular horas estándar
  function handleVehicleCategoryChange(newCategory) {
    setVehicleCategory(newCategory);
    setStagedOps((prev) =>
      prev.map((item) => {
        if (item.isCustom) return item;
        return {
          ...item,
          standardHours: newCategory === 'CAMIONETA' ? item.hoursTrucks : item.hoursCars,
        };
      })
    );
  }

  // Agregar operación del catálogo a la bandeja temporal
  function handleAddCatalogOpToStaged(op) {
    const std = vehicleCategory === 'CAMIONETA' ? op.hoursTrucks : op.hoursCars;
    const newItem = {
      tempId: `tmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      operationId: op.id,
      code: op.code,
      description: op.description,
      hoursCars: op.hoursCars,
      hoursTrucks: op.hoursTrucks,
      standardHours: std,
      technicianId: defaultTechId || null,
      isCustom: false,
    };
    setStagedOps((prev) => [...prev, newItem]);
  }

  // Agregar operación libre a la bandeja temporal
  function handleAddCustomOpToStaged() {
    if (!customDescription.trim()) return;
    const h = parseFloat(customHours) || 0;
    const newItem = {
      tempId: `tmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      operationId: null,
      code: 'LIBRE',
      description: customDescription.trim().toUpperCase(),
      hoursCars: h,
      hoursTrucks: h,
      standardHours: h,
      technicianId: defaultTechId || null,
      isCustom: true,
    };
    setStagedOps((prev) => [...prev, newItem]);
    setCustomDescription('');
    setCustomHours('1.0');
  }

  // Remover de la bandeja temporal
  function handleRemoveStagedOp(tempId) {
    setStagedOps((prev) => prev.filter((item) => item.tempId !== tempId));
  }

  // Actualizar técnico de una operación en la bandeja temporal
  function handleUpdateStagedTech(tempId, techId) {
    setStagedOps((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, technicianId: techId || null } : item))
    );
  }

  // Cambiar técnico por defecto (y aplicarlo opcionalmente a todos los de la bandeja)
  function handleDefaultTechChange(newTechId) {
    setDefaultTechId(newTechId);
    setStagedOps((prev) =>
      prev.map((item) => ({ ...item, technicianId: newTechId || null }))
    );
  }

  // Confirmar y sumar TODAS las operaciones de la bandeja a la orden en lote
  async function handleConfirmBatch() {
    if (stagedOps.length === 0) return;

    setSaving(true);
    try {
      const payloads = stagedOps.map((op) => ({
        operationId: op.operationId || null,
        code: op.code,
        description: op.description,
        vehicleCategory,
        standardHours: op.standardHours,
        technicianId: op.technicianId || null,
      }));

      const createdList = await addWorkOrderOperationsBatch(workOrder.id, payloads);
      const updatedOperations = [...operations, ...(Array.isArray(createdList) ? createdList : [createdList])];

      onUpdated?.({
        ...workOrder,
        operations: updatedOperations,
      });

      // Limpiar bandeja y formulario
      setStagedOps([]);
      setSearchTerm('');
      setCustomDescription('');
      setIsAddingOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al agregar operaciones en lote');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTech(opId, newTechId) {
    try {
      const updated = await updateWorkOrderOperation(opId, { technicianId: newTechId || null });
      const updatedOperations = operations.map((op) => (op.id === opId ? updated : op));
      onUpdated?.({
        ...workOrder,
        operations: updatedOperations,
      });
    } catch (err) {
      alert('Error al reasignar técnico');
    }
  }

  async function handleToggleCompleted(opId, currentCompleted) {
    try {
      const updated = await updateWorkOrderOperation(opId, { completed: !currentCompleted });
      const updatedOperations = operations.map((op) => (op.id === opId ? updated : op));
      onUpdated?.({
        ...workOrder,
        operations: updatedOperations,
      });
    } catch (err) {
      alert('Error al actualizar estatus de operación');
    }
  }

  async function handleDeleteOp(opId) {
    if (!window.confirm('¿Deseas remover esta operación de la orden?')) return;
    try {
      await deleteWorkOrderOperation(opId);
      const updatedOperations = operations.filter((op) => op.id !== opId);
      onUpdated?.({
        ...workOrder,
        operations: updatedOperations,
      });
    } catch (err) {
      alert('Error al eliminar operación');
    }
  }

  async function handleToggleWaiting(val) {
    if (onToggleCustomerWaiting) {
      onToggleCustomerWaiting(val);
      return;
    }
    try {
      const updated = await updateCustomerWaiting(workOrder.id, val);
      onUpdated?.(updated);
    } catch (err) {
      alert('Error al actualizar espera en agencia');
    }
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-white p-3 space-y-3 shadow-2xs">
      {/* Header del gestor de operaciones */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary">
            handyman
          </span>
          <span className="font-headline-md text-xs font-bold text-primary uppercase">
            Operaciones y Trabajos Requeridos
          </span>
          <span className="rounded bg-primary/10 px-2 py-0.5 font-data-mono text-[11px] font-black text-primary">
            {operations.length} {operations.length === 1 ? 'operación' : 'operaciones'} • {totalOperationsHours.toFixed(2)} h MO
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Checkbox Espera en Agencia */}
          <label
            className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg border transition-all shadow-2xs ${
              workOrder.customerWaiting
                ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-extrabold ring-1 ring-amber-300'
                : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary/50'
            }`}
            title="Marcar si el cliente espera físicamente en la agencia"
          >
            <InlineCheckbox
              checked={workOrder.customerWaiting}
              onToggle={handleToggleWaiting}
              title="Cliente espera en agencia"
            />
            <span className="font-label-caps text-[10.5px] font-bold flex items-center gap-1">
              {workOrder.customerWaiting ? '☕ Espera en agencia' : 'Espera en agencia'}
            </span>
          </label>

          {/* Selector de categoría de vehículo para cálculo de tiempos */}
          <div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-low p-0.5 text-[10px] font-label-caps font-bold">
            <button
              type="button"
              onClick={() => handleVehicleCategoryChange('COCHE')}
              className={`rounded px-2 py-0.5 transition-colors cursor-pointer ${
                vehicleCategory === 'COCHE'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              🚗 Coche
            </button>
            <button
              type="button"
              onClick={() => handleVehicleCategoryChange('CAMIONETA')}
              className={`rounded px-2 py-0.5 transition-colors cursor-pointer ${
                vehicleCategory === 'CAMIONETA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              🚙 Camioneta
            </button>
          </div>

          {!isAddingOpen && (
            <button
              type="button"
              onClick={() => setIsAddingOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 font-label-caps text-[11px] font-bold text-white shadow-2xs hover:bg-primary/90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">add_circle</span>
              + Capturar Operaciones
            </button>
          )}
        </div>
      </div>

      {/* Lista de operaciones ya asignadas a la orden */}
      {operations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant/80 bg-slate-50/60 p-3 text-center">
          <p className="text-xs text-on-surface-variant">
            No se han capturado operaciones para esta orden.
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Haz clic en <strong>+ Capturar Operaciones</strong> para seleccionar varios trabajos del catálogo y sumarlos juntos.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {operations.map((op, idx) => {
            const isCompleted = !!op.completed;

            return (
              <div
                key={op.id || idx}
                className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2 text-xs transition-colors ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-outline-variant/80 bg-white shadow-2xs'
                }`}
              >
                {/* Info de la operación */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleCompleted(op.id, isCompleted)}
                    title={isCompleted ? 'Marcar como pendiente' : 'Marcar como realizada'}
                    className={`h-5 w-5 rounded flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-700 text-white'
                        : 'border-slate-300 bg-white hover:border-primary'
                    }`}
                  >
                    {isCompleted && <span className="text-xs font-black">✓</span>}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-surface-container px-1.5 py-0.2 font-data-mono text-[10px] font-bold text-primary shrink-0">
                        {op.code || 'OP'}
                      </span>
                      <span className={`font-bold truncate text-xs ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {op.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Horas + Selector de Técnico al lado */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 font-data-mono text-xs font-black text-slate-700">
                    {op.standardHours?.toFixed(2)} h
                  </span>

                  {/* Selector de técnico para esta tarea específica */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
                      Técnico:
                    </span>
                    <select
                      value={op.technicianId || ''}
                      onChange={(e) => handleUpdateTech(op.id, e.target.value)}
                      className="rounded border border-outline-variant bg-white px-2 py-1 text-xs text-primary font-semibold focus:border-primary focus:outline-none cursor-pointer max-w-[150px]"
                    >
                      <option value="">(Sin asignar)</option>
                      {technicians
                        .filter((t) => t.active)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} {t.specialty ? `(${t.specialty})` : `(${t.team})`}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Botón eliminar operación */}
                  <button
                    type="button"
                    onClick={() => handleDeleteOp(op.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remover operación"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulario para Captura Múltiple de Operaciones */}
      {isAddingOpen && (
        <div className="rounded-xl border-2 border-primary/40 bg-slate-50/80 p-3.5 space-y-3.5 shadow-sm animate-in fade-in">
          {/* Barra superior del formulario */}
          <div className="flex items-center justify-between border-b border-primary/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                +
              </span>
              <span className="font-headline-md text-xs font-extrabold text-primary uppercase">
                {isCustomMode ? 'Captura Libre de Operaciones' : 'Captura Múltiple del Catálogo'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCustomMode((v) => !v)}
                className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                {isCustomMode ? '← Usar catálogo (198 ops)' : '✏️ Captura libre personalizada'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingOpen(false);
                  setStagedOps([]);
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-1 rounded cursor-pointer"
                title="Cerrar captura"
              >
                ✕
              </button>
            </div>
          </div>

          {!isCustomMode ? (
            /* Modo Catálogo Desplegable con Búsqueda Multi-selección */
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">
                Buscar operación en catálogo (escribe código o nombre y haz clic en <strong>+</strong> para ir agregando varias):
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. BALATAS, EMBRAGUE, 1235, AFINACIÓN, etc."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs text-primary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none shadow-2xs"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕ Limpiar
                  </button>
                )}
              </div>

              {/* Lista desplegable interactiva */}
              {isDropdownOpen && (
                <div className="max-h-56 overflow-y-auto rounded-lg border border-outline-variant bg-white p-1 shadow-md space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 flex justify-between items-center">
                    <span>Resultados del catálogo ({filteredCatalog.length})</span>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-primary hover:underline lowercase font-medium"
                    >
                      ocultar lista
                    </button>
                  </div>

                  {catalogLoading ? (
                    <p className="p-3 text-center text-xs text-slate-500">Cargando catálogo...</p>
                  ) : filteredCatalog.length === 0 ? (
                    <p className="p-3 text-center text-xs text-slate-500">
                      No se encontraron operaciones con "{searchTerm}".
                    </p>
                  ) : (
                    filteredCatalog.map((op) => {
                      const std = vehicleCategory === 'CAMIONETA' ? op.hoursTrucks : op.hoursCars;
                      const countInStaged = stagedOps.filter((s) => s.operationId === op.id).length;

                      return (
                        <div
                          key={op.id}
                          className="flex items-center justify-between rounded-md p-1.5 hover:bg-primary/5 transition-colors group"
                        >
                          <div className="min-w-0 pr-2 flex-1">
                            <span className="font-data-mono font-bold text-primary mr-1.5 text-xs">
                              [{op.code}]
                            </span>
                            <span className="font-semibold text-slate-800 text-xs">
                              {op.description}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-data-mono text-[11px] font-bold text-slate-700">
                              {std.toFixed(2)} h
                            </span>

                            <button
                              type="button"
                              onClick={() => handleAddCatalogOpToStaged(op)}
                              className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                                countInStaged > 0
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-primary text-white hover:bg-primary/90'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xs">add</span>
                              {countInStaged > 0 ? `+ Otra (${countInStaged})` : 'Agregar'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Modo Captura Libre / Personalizada */
            <div className="rounded-lg border border-outline-variant bg-white p-3 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Descripción del trabajo libre:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. REPARAR CABLEADO DE SENSORES"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomOpToStaged();
                      }
                    }}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:border-primary focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Horas estándar:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={customHours}
                      onChange={(e) => setCustomHours(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs font-data-mono text-primary focus:border-primary focus:outline-none font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomOpToStaged}
                      disabled={!customDescription.trim()}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                      + Sumar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BANDEJA TEMPORAL: OPERACIONES CAPTURADAS POR CONFIRMAR */}
          <div className="rounded-xl border border-primary/20 bg-white p-3 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-xs font-extrabold text-primary flex items-center gap-1">
                  📋 Operaciones capturadas por confirmar ({stagedOps.length}):
                </span>
                <span className="rounded bg-emerald-100 text-emerald-800 font-data-mono font-black text-xs px-2 py-0.5">
                  {totalStagedHours.toFixed(2)} h MO
                </span>
              </div>

              {stagedOps.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStagedOps([])}
                  className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Vaciar lista
                </button>
              )}
            </div>

            {stagedOps.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">
                Aún no has seleccionado ninguna operación. Escribe arriba y presiona <strong>+ Agregar</strong> en las operaciones que desees sumar.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {stagedOps.map((op, idx) => (
                  <div
                    key={op.tempId || idx}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-bold text-slate-400 text-[10px]">#{idx + 1}</span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.2 font-data-mono text-[10px] font-bold text-primary shrink-0">
                        {op.code}
                      </span>
                      <span className="font-bold text-slate-800 truncate text-xs">
                        {op.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-data-mono font-black text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                        {op.standardHours.toFixed(2)} h
                      </span>

                      {/* Técnico específico para este renglón en la bandeja */}
                      <select
                        value={op.technicianId || ''}
                        onChange={(e) => handleUpdateStagedTech(op.tempId, e.target.value)}
                        className="rounded border border-outline-variant bg-white px-2 py-0.5 text-xs text-primary font-semibold focus:border-primary focus:outline-none max-w-[130px]"
                        title="Asignar técnico para este trabajo específico"
                      >
                        <option value="">(Sin asignar)</option>
                        {technicians
                          .filter((t) => t.active)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveStagedOp(op.tempId)}
                        className="p-0.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        title="Remover de la lista"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BARRA INFERIOR DE ACCIÓN: TÉCNICO GENERAL + CONFIRMAR Y SUMAR A ORDEN */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/20 pt-2.5">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-700">
                Técnico para todas las operaciones:
              </label>
              <select
                value={defaultTechId}
                onChange={(e) => handleDefaultTechChange(e.target.value)}
                className="rounded-lg border border-outline-variant bg-white px-2.5 py-1 text-xs text-primary font-semibold focus:border-primary focus:outline-none"
              >
                <option value="">(Sin asignar por ahora)</option>
                {technicians
                  .filter((t) => t.active)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.specialty ? `(${t.specialty})` : `(${t.team})`}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingOpen(false);
                  setStagedOps([]);
                }}
                className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmBatch}
                disabled={saving || stagedOps.length === 0}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-black text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {saving
                  ? 'Guardando...'
                  : stagedOps.length === 0
                  ? '+ Confirmar y Sumar a Orden'
                  : `+ Confirmar y Sumar a Orden (${stagedOps.length} ${stagedOps.length === 1 ? 'operación' : 'operaciones'} • ${totalStagedHours.toFixed(2)} h)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

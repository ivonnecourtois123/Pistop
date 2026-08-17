import { useEffect, useState } from 'react';
import {
  listStatusMappings,
  createStatusMapping,
  updateStatusMapping,
  removeStatusMapping,
} from '../../api/statusMappings.js';

import { SERVICIO_STAGES, HYP_STAGES } from '../../constants/stages.js';

// Unión de claves de ambos pipelines (Servicio/HYP) — un mapeo de DMS puede apuntar a
// cualquiera de las dos, según el tipo de orden que finalmente se le asigne.
const INTERNAL_STATUS_OPTIONS = [
  ...SERVICIO_STAGES.map((s) => ({ value: s.key, label: s.label })),
  ...HYP_STAGES.filter((s) => !SERVICIO_STAGES.some((sv) => sv.key === s.key)).map((s) => ({
    value: s.key,
    label: `${s.label} (HYP)`,
  })),
];

export default function StatusMappingsSection() {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDmsStatus, setNewDmsStatus] = useState('');
  const [newInternalStatus, setNewInternalStatus] = useState('RECIBIDO');

  function load() {
    setLoading(true);
    listStatusMappings()
      .then(setMappings)
      .catch(() => setError('No se pudieron cargar los mapeos de estatus.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newDmsStatus.trim()) return;
    const created = await createStatusMapping({
      dmsStatus: newDmsStatus.trim(),
      internalStatus: newInternalStatus,
    });
    setMappings((prev) => [...prev, created].sort((a, b) => a.dmsStatus.localeCompare(b.dmsStatus)));
    setNewDmsStatus('');
    setNewInternalStatus('RECIBIDO');
  }

  async function handleChange(mapping, internalStatus) {
    setMappings((prev) => prev.map((m) => (m.id === mapping.id ? { ...m, internalStatus } : m)));
    await updateStatusMapping(mapping.id, internalStatus);
  }

  async function handleDelete(id) {
    await removeStatusMapping(id);
    setMappings((prev) => prev.filter((m) => m.id !== id));
  }

  if (loading) return <p className="text-on-surface-variant">Cargando mapeo de estatus...</p>;

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <h2 className="mb-2 font-headline-md text-headline-md text-primary">Mapeo de Estatus del DMS</h2>
      <p className="mb-4 text-sm text-on-surface-variant">
        Cada valor que el DMS reporta en "Estatus_Actual" se traduce aquí a una de las 5 etapas del
        stepper. Cuando el importador encuentra un valor nuevo, lo agrega automáticamente mapeado a
        "Recibido" — ajústalo aquí cuando corresponda.
      </p>
      {error && <p className="mb-3 text-sm text-error">{error}</p>}

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <input
          value={newDmsStatus}
          onChange={(e) => setNewDmsStatus(e.target.value)}
          placeholder="Valor exacto del DMS (ej. En proceso)"
          className="flex-1 min-w-[220px] rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        />
        <select
          value={newInternalStatus}
          onChange={(e) => setNewInternalStatus(e.target.value)}
          className="rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        >
          {INTERNAL_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary hover:bg-primary/90"
        >
          Agregar
        </button>
      </form>

      <div className="divide-y divide-outline-variant">
        <div className="flex gap-3 pb-2 font-label-caps text-[11px] text-on-surface-variant">
          <span className="flex-1">Estatus del DMS</span>
          <span className="w-48">Se traduce a</span>
          <span className="w-20" />
        </div>
        {mappings.map((m) => (
          <div key={m.id} className="flex items-center gap-3 py-3">
            <span className="flex-1 font-data-mono text-sm text-primary">{m.dmsStatus}</span>
            <select
              value={m.internalStatus}
              onChange={(e) => handleChange(m, e.target.value)}
              className="w-48 rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
            >
              {INTERNAL_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleDelete(m.id)}
              className="w-20 rounded border border-error px-2 py-1 font-label-caps text-[11px] text-error hover:bg-error hover:text-on-error"
            >
              Eliminar
            </button>
          </div>
        ))}
        {mappings.length === 0 && (
          <p className="py-4 text-center text-on-surface-variant">
            Aún no hay estatus mapeados — aparecerán aquí en cuanto importes datos del DMS.
          </p>
        )}
      </div>
    </section>
  );
}

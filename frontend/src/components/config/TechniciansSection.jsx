import { useEffect, useState } from 'react';
import {
  listTechnicians,
  createTechnician,
  updateTechnician,
  removeTechnician,
} from '../../api/technicians.js';
import { TEAMS, TEAM_LABEL } from '../../constants/capacity.js';

export default function TechniciansSection() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newTeam, setNewTeam] = useState('SERVICIO');
  const [savingId, setSavingId] = useState(null);

  function load() {
    setLoading(true);
    listTechnicians()
      .then(setTechnicians)
      .catch(() => setError('No se pudieron cargar los técnicos.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = await createTechnician({
      name: newName.trim(),
      specialty: newSpecialty.trim() || undefined,
      team: newTeam,
    });
    setTechnicians((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName('');
    setNewSpecialty('');
    setNewTeam('SERVICIO');
  }

  function updateLocal(id, patch) {
    setTechnicians((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function handleSave(technician) {
    setSavingId(technician.id);
    try {
      await updateTechnician(technician.id, {
        name: technician.name,
        specialty: technician.specialty || undefined,
        active: technician.active,
        team: technician.team,
      });
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggleActive(technician) {
    const active = !technician.active;
    updateLocal(technician.id, { active });
    await updateTechnician(technician.id, { active });
  }

  async function handleDelete(id) {
    await removeTechnician(id);
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
  }

  if (loading) return <p className="text-on-surface-variant">Cargando técnicos...</p>;

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <h2 className="mb-4 font-headline-md text-headline-md text-primary">Técnicos</h2>
      {error && <p className="mb-3 text-sm text-error">{error}</p>}

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del técnico"
          className="flex-1 min-w-[200px] rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        />
        <input
          value={newSpecialty}
          onChange={(e) => setNewSpecialty(e.target.value)}
          placeholder="Especialidad (opcional)"
          className="flex-1 min-w-[200px] rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        />
        <select
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          className="rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        >
          {TEAMS.map((team) => (
            <option key={team} value={team}>
              {TEAM_LABEL[team]}
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
        {technicians.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center gap-3 py-3">
            <input
              value={t.name}
              onChange={(e) => updateLocal(t.id, { name: e.target.value })}
              className="flex-1 min-w-[160px] rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
            />
            <input
              value={t.specialty || ''}
              onChange={(e) => updateLocal(t.id, { specialty: e.target.value })}
              placeholder="Especialidad"
              className="flex-1 min-w-[160px] rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
            />
            <select
              value={t.team || 'SERVICIO'}
              onChange={(e) => updateLocal(t.id, { team: e.target.value })}
              className="rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
            >
              {TEAMS.map((team) => (
                <option key={team} value={team}>
                  {TEAM_LABEL[team]}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input type="checkbox" checked={t.active} onChange={() => handleToggleActive(t)} />
              Activo
            </label>
            <button
              type="button"
              onClick={() => handleSave(t)}
              disabled={savingId === t.id}
              className="rounded border border-primary px-3 py-1 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => handleDelete(t.id)}
              className="rounded border border-error px-3 py-1 font-label-caps text-[11px] text-error hover:bg-error hover:text-on-error"
            >
              Eliminar
            </button>
          </div>
        ))}
        {technicians.length === 0 && (
          <p className="py-4 text-center text-on-surface-variant">Aún no hay técnicos registrados.</p>
        )}
      </div>
    </section>
  );
}

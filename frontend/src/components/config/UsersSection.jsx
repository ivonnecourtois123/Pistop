import { useEffect, useState } from 'react';
import { listUsers, createUser, updateUser } from '../../api/users.js';

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [passwordDrafts, setPasswordDrafts] = useState({});

  function load() {
    setLoading(true);
    listUsers()
      .then(setUsers)
      .catch(() => setError('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!newName.trim() || !newEmail.trim() || newPassword.length < 6) {
      setError('Nombre, correo y una contraseña de al menos 6 caracteres son obligatorios.');
      return;
    }
    try {
      const created = await createUser({ name: newName.trim(), email: newEmail.trim(), password: newPassword });
      setUsers((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      setNewEmail('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el usuario.');
    }
  }

  function updateLocal(id, patch) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  async function handleSave(user) {
    setSavingId(user.id);
    try {
      await updateUser(user.id, { name: user.name, email: user.email });
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggleActive(user) {
    const active = !user.active;
    updateLocal(user.id, { active });
    await updateUser(user.id, { active });
  }

  async function handleResetPassword(user) {
    const password = passwordDrafts[user.id];
    if (!password || password.length < 6) return;
    setSavingId(user.id);
    try {
      await updateUser(user.id, { password });
      setPasswordDrafts((prev) => ({ ...prev, [user.id]: '' }));
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p className="text-on-surface-variant">Cargando usuarios...</p>;

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <h2 className="mb-2 font-headline-md text-headline-md text-primary">Usuarios</h2>
      <p className="mb-4 text-sm text-on-surface-variant">
        Cada persona debe tener su propia cuenta — el nombre que aparece en los comentarios de
        seguimiento se toma de la sesión con la que inició sesión.
      </p>
      {error && <p className="mb-3 text-sm text-error">{error}</p>}

      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre completo"
          className="flex-1 min-w-[180px] rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        />
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Correo"
          className="flex-1 min-w-[180px] rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Contraseña inicial"
          className="flex-1 min-w-[160px] rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary hover:bg-primary/90"
        >
          Agregar
        </button>
      </form>

      <div className="divide-y divide-outline-variant">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 py-3">
            <input
              value={u.name}
              onChange={(e) => updateLocal(u.id, { name: e.target.value })}
              className="min-w-[160px] flex-1 rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
            />
            <input
              value={u.email}
              onChange={(e) => updateLocal(u.id, { email: e.target.value })}
              className="min-w-[180px] flex-1 rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
            />
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input type="checkbox" checked={u.active} onChange={() => handleToggleActive(u)} />
              Activo
            </label>
            <button
              type="button"
              onClick={() => handleSave(u)}
              disabled={savingId === u.id}
              className="rounded border border-primary px-3 py-1 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
            >
              Guardar
            </button>
            <input
              type="password"
              value={passwordDrafts[u.id] || ''}
              onChange={(e) => setPasswordDrafts((prev) => ({ ...prev, [u.id]: e.target.value }))}
              placeholder="Nueva contraseña"
              className="min-w-[140px] rounded border border-outline-variant bg-white px-2 py-1 text-sm text-primary"
            />
            <button
              type="button"
              onClick={() => handleResetPassword(u)}
              disabled={savingId === u.id || !passwordDrafts[u.id]}
              className="rounded border border-outline-variant px-3 py-1 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
            >
              Restablecer
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <p className="py-4 text-center text-on-surface-variant">Aún no hay usuarios registrados.</p>
        )}
      </div>
    </section>
  );
}

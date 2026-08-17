import { useCallback, useEffect, useMemo, useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ImmobilizedList from '../components/immobilized/ImmobilizedList.jsx';
import NewImmobilizedModal from '../components/immobilized/NewImmobilizedModal.jsx';
import ImmobilizedDetailModal from '../components/immobilized/ImmobilizedDetailModal.jsx';
import { listImmobilized } from '../api/immobilized.js';

const FILTERS = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'resolved', label: 'Resueltas' },
  { key: 'all', label: 'Todas' },
];

export default function InmovilizadosPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listImmobilized();
      setUnits(data);
    } catch {
      setError('No se pudieron cargar las unidades inmovilizadas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredUnits = useMemo(() => {
    if (filter === 'pending') return units.filter((u) => !u.resolved);
    if (filter === 'resolved') return units.filter((u) => u.resolved);
    return units;
  }, [units, filter]);

  function handleCreated(unit) {
    setUnits((prev) => [unit, ...prev]);
    setShowNewModal(false);
  }

  function handleUpdated(unit) {
    setUnits((prev) => prev.map((u) => (u.id === unit.id ? unit : u)));
    setSelectedUnit(unit);
  }

  return (
    <div className="min-h-screen text-on-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col gap-gutter px-margin-desktop py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-lg text-primary">Inmovilizados</h1>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2 font-headline-md text-on-secondary-container hover:bg-secondary-container/90"
          >
            <span className="material-symbols-outlined text-lg" data-icon="add">
              add
            </span>
            Nuevo Registro
          </button>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 font-label-caps text-[11px] ${
                filter === f.key
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <section className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest card-elevation">
          {error && (
            <div className="mx-card-padding mt-4 rounded border border-error bg-error-container/30 px-4 py-3 text-sm text-on-error-container">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <ImmobilizedList units={filteredUnits} onSelect={setSelectedUnit} />
          )}
        </section>
      </main>

      {showNewModal && <NewImmobilizedModal onClose={() => setShowNewModal(false)} onCreated={handleCreated} />}

      {selectedUnit && (
        <ImmobilizedDetailModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}

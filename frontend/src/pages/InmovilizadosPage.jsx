import { useCallback, useEffect, useMemo, useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar.jsx';
import Spinner from '../components/common/Spinner.jsx';
import ImmobilizedList from '../components/immobilized/ImmobilizedList.jsx';
import NewImmobilizedModal from '../components/immobilized/NewImmobilizedModal.jsx';
import ImmobilizedDetailModal from '../components/immobilized/ImmobilizedDetailModal.jsx';
import { listImmobilized } from '../api/immobilized.js';
import { DEFAULT_AGENCIES } from '../constants/immobilized.js';

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
  const [agencyFilter, setAgencyFilter] = useState('ALL');
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

  const availableAgencies = useMemo(() => {
    const set = new Set(DEFAULT_AGENCIES);
    units.forEach((u) => {
      if (u.agency && u.agency.trim()) set.add(u.agency.trim());
    });
    return Array.from(set).sort();
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (filter === 'pending' && u.resolved) return false;
      if (filter === 'resolved' && !u.resolved) return false;
      if (
        agencyFilter !== 'ALL' &&
        (u.agency || '').trim().toLowerCase() !== agencyFilter.trim().toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [units, filter, agencyFilter]);

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
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary">Inmovilizados</h1>
            {!loading && (
              <p className="mt-1 font-label-caps text-xs text-on-surface-variant">
                {filteredUnits.length} {filteredUnits.length === 1 ? 'unidad encontrada' : 'unidades encontradas'}
              </p>
            )}
          </div>
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-1.5 font-label-caps text-[11px] transition-colors ${
                  filter === f.key
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="agency-filter"
              className="flex items-center gap-1.5 font-label-caps text-[11px] text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-sm" data-icon="store">
                store
              </span>
              AGENCIA:
            </label>
            <div className="relative">
              <select
                id="agency-filter"
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest py-1.5 pl-3 pr-8 font-label-caps text-[11px] text-primary focus:border-primary focus:outline-none"
              >
                <option value="ALL">Todas las agencias</option>
                {availableAgencies.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>
              <span
                className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant"
                data-icon="expand_more"
              >
                expand_more
              </span>
            </div>
            {agencyFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setAgencyFilter('ALL')}
                title="Limpiar filtro de agencia"
                className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container hover:text-primary"
              >
                <span className="material-symbols-outlined text-sm" data-icon="close">
                  close
                </span>
              </button>
            )}
          </div>
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

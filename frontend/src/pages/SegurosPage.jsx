import { useCallback, useEffect, useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar.jsx';
import Spinner from '../components/common/Spinner.jsx';
import InsuranceList from '../components/insurance/InsuranceList.jsx';
import AddToInsuranceModal from '../components/insurance/AddToInsuranceModal.jsx';
import InsuranceCaseDetailModal from '../components/insurance/InsuranceCaseDetailModal.jsx';
import { listInsuranceCases } from '../api/insuranceCases.js';

export default function SegurosPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listInsuranceCases();
      setCases(data);
    } catch {
      setError('No se pudieron cargar los casos de seguro.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleAdded(updatedUnit) {
    setShowAddModal(false);
    if (updatedUnit.insuranceCase) {
      setCases((prev) => [
        { ...updatedUnit.insuranceCase, immobilizedUnit: updatedUnit },
        ...prev,
      ]);
    }
  }

  function handleUpdated(updatedCase) {
    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    setSelectedCase(updatedCase);
  }

  function handleRemoved(caseId) {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    setSelectedCase(null);
  }

  return (
    <div className="min-h-screen text-on-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col gap-gutter px-margin-desktop py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-lg text-primary">Seguros</h1>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2 font-headline-md text-on-secondary-container hover:bg-secondary-container/90"
          >
            <span className="material-symbols-outlined text-lg" data-icon="add">
              add
            </span>
            Agregar Unidad
          </button>
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
            <InsuranceList cases={cases} onSelect={setSelectedCase} />
          )}
        </section>
      </main>

      {showAddModal && (
        <AddToInsuranceModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />
      )}

      {selectedCase && (
        <InsuranceCaseDetailModal
          insuranceCase={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdated={handleUpdated}
          onRemoved={handleRemoved}
        />
      )}
    </div>
  );
}

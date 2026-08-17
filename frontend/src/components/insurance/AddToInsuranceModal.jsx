import { useEffect, useState } from 'react';
import { listImmobilized, updateImmobilizedTreatmentType } from '../../api/immobilized.js';
import { TREATMENT_TYPE_LABELS } from '../../constants/immobilized.js';

// Permite elegir una unidad ya registrada en Inmovilizados (con tratamiento distinto a
// Aseguradora) y agregarla a Seguros — equivalente a cambiar su tratamiento a ASEGURADORA,
// lo que crea automáticamente su expediente (InsuranceCase + checklist).
export default function AddToInsuranceModal({ onClose, onAdded }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    listImmobilized()
      .then((data) => setUnits(data.filter((u) => u.treatmentType !== 'ASEGURADORA')))
      .catch(() => setError('No se pudieron cargar las unidades inmovilizadas.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(unit) {
    setAddingId(unit.id);
    setError('');
    try {
      const updated = await updateImmobilizedTreatmentType(unit.id, 'ASEGURADORA');
      onAdded(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo agregar la unidad a Seguros.');
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-lg bg-surface-container-lowest p-card-padding shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-primary">Agregar Unidad a Seguros</h2>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high"
            data-icon="close"
          >
            close
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded border border-error bg-error-container/40 px-4 py-2 text-sm text-on-error-container">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-on-surface-variant">Cargando...</p>
        ) : units.length === 0 ? (
          <p className="py-6 text-center text-on-surface-variant">
            No hay unidades inmovilizadas disponibles para agregar (todas ya están en Seguros).
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {units.map((unit) => (
              <li key={unit.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-body-md font-semibold text-primary">
                    {unit.vehicle.brand} {unit.vehicle.model} — {unit.vehicle.plate}
                  </p>
                  <p className="font-data-mono text-xs text-on-surface-variant">
                    {unit.vehicle.customer?.name || 'Sin cliente'} • {TREATMENT_TYPE_LABELS[unit.treatmentType]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(unit)}
                  disabled={addingId === unit.id}
                  className="shrink-0 rounded-lg bg-secondary-container px-4 py-2 font-label-caps text-[11px] text-on-secondary-container hover:bg-secondary-container/90 disabled:opacity-50"
                >
                  {addingId === unit.id ? 'Agregando...' : 'Agregar'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

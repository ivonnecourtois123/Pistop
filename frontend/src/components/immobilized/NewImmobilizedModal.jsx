import { useState } from 'react';
import VehiclePicker, { EMPTY_VEHICLE_DRAFT, resolveVehicleId } from './VehiclePicker.jsx';
import CameraPlaceholderButton from './CameraPlaceholderButton.jsx';
import { createImmobilized } from '../../api/immobilized.js';
import { TREATMENT_TYPES, TREATMENT_TYPE_LABELS } from '../../constants/immobilized.js';

function nowForDatetimeLocal() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function NewImmobilizedModal({ onClose, onCreated }) {
  const [vehicleDraft, setVehicleDraft] = useState(EMPTY_VEHICLE_DRAFT);
  const [damageDate, setDamageDate] = useState(nowForDatetimeLocal());
  const [treatmentType, setTreatmentType] = useState('REPARACION_INTERNA');
  const [dmsReportNumber, setDmsReportNumber] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const vehicleId = await resolveVehicleId(vehicleDraft);
      const created = await createImmobilized({
        vehicleId,
        damageDate,
        treatmentType,
        dmsReportNumber: treatmentType === 'GARANTIA' ? dmsReportNumber.trim() || undefined : undefined,
        description: description.trim() || undefined,
      });
      onCreated(created);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'No se pudo registrar la unidad inmovilizada.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-container-lowest p-card-padding shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-primary">Registrar Unidad Inmovilizada</h2>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high"
            data-icon="close"
          >
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded border border-error bg-error-container/40 px-4 py-2 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <VehiclePicker draft={vehicleDraft} onChange={setVehicleDraft} />

          <label className="block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              FECHA DE CAPTURA DEL DAÑO
            </span>
            <input
              required
              type="datetime-local"
              value={damageDate}
              onChange={(e) => setDamageDate(e.target.value)}
              className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
            />
          </label>

          <div>
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              TIPO DE TRATAMIENTO
            </span>
            <div className="flex gap-2">
              {TREATMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTreatmentType(type)}
                  className={`flex-1 rounded-lg border px-3 py-2 font-label-caps text-[11px] ${
                    treatmentType === type
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-primary'
                  }`}
                >
                  {TREATMENT_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {treatmentType === 'GARANTIA' && (
            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                NÚMERO DE REPORTE EN DMS
              </span>
              <input
                value={dmsReportNumber}
                onChange={(e) => setDmsReportNumber(e.target.value)}
                placeholder="Ej. GAR-00123"
                className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
              />
            </label>
          )}

          {treatmentType === 'ASEGURADORA' && (
            <p className="rounded border border-secondary/30 bg-secondary-container/15 px-4 py-2 text-sm text-secondary">
              Esta unidad se enviará al módulo <strong>Seguros</strong>, donde se captura el número de
              reporte, la aseguradora, el tipo de póliza y el expediente digital.
            </p>
          )}

          <label className="block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              DESCRIPCIÓN DEL DAÑO
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Ubicación y detalle del daño..."
              className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
            />
          </label>

          <div className="flex gap-3">
            <CameraPlaceholderButton label="Foto del daño" />
            <CameraPlaceholderButton label="Foto de resuelto" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-headline-md text-primary hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-secondary-container px-6 py-2 font-headline-md text-on-secondary-container hover:bg-secondary-container/90 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

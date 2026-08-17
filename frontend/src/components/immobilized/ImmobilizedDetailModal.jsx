import { useState } from 'react';
import CameraPlaceholderButton from './CameraPlaceholderButton.jsx';
import CommentsButton from '../common/CommentsButton.jsx';
import {
  updateImmobilized,
  updateImmobilizedTreatmentType,
  setImmobilizedResolved,
  addImmobilizedComment,
} from '../../api/immobilized.js';
import { TREATMENT_TYPES, TREATMENT_TYPE_LABELS } from '../../constants/immobilized.js';

function formatDateTime(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toDatetimeLocalValue(dateString) {
  const date = new Date(dateString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ImmobilizedDetailModal({ unit, onClose, onUpdated }) {
  const { vehicle } = unit;
  const [damageDate, setDamageDate] = useState(toDatetimeLocalValue(unit.damageDate));
  const [description, setDescription] = useState(unit.description || '');
  const [dmsReportNumber, setDmsReportNumber] = useState(unit.dmsReportNumber || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSaveFields() {
    setSaving(true);
    setError('');
    try {
      const updated = await updateImmobilized(unit.id, {
        damageDate,
        description: description.trim() || undefined,
        dmsReportNumber: unit.treatmentType === 'GARANTIA' ? dmsReportNumber.trim() || undefined : undefined,
      });
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTreatmentChange(treatmentType) {
    if (treatmentType === unit.treatmentType) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateImmobilizedTreatmentType(unit.id, treatmentType);
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cambiar el tipo de tratamiento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleResolved() {
    setSaving(true);
    setError('');
    try {
      const updated = await setImmobilizedResolved(unit.id, !unit.resolved);
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el estado.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddComment(comment) {
    const updated = await addImmobilizedComment(unit.id, comment);
    onUpdated(updated);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-container-lowest p-card-padding shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Unidad Inmovilizada</h2>
            <p className="font-body-md text-on-surface-variant">
              {vehicle.brand} {vehicle.model} — {vehicle.plate} • {vehicle.customer?.name || 'Sin cliente'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high"
            data-icon="close"
          >
            close
          </button>
        </div>

        <div className="space-y-5">
          {error && (
            <div className="rounded border border-error bg-error-container/40 px-4 py-2 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3">
            <div>
              <p className="font-label-caps text-[11px] text-on-surface-variant">ESTADO</p>
              <p className={`font-body-md font-semibold ${unit.resolved ? 'text-primary' : 'text-error'}`}>
                {unit.resolved ? `Resuelta — ${formatDateTime(unit.resolvedAt)}` : 'Pendiente'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleResolved}
              disabled={saving}
              className="rounded-lg border border-primary px-4 py-2 font-label-caps text-[11px] text-primary hover:bg-primary/10 disabled:opacity-50"
            >
              {unit.resolved ? 'Reabrir' : 'Marcar como resuelta'}
            </button>
          </div>

          <div>
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              TIPO DE TRATAMIENTO
            </span>
            <div className="flex gap-2">
              {TREATMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTreatmentChange(type)}
                  disabled={saving}
                  className={`flex-1 rounded-lg border px-3 py-2 font-label-caps text-[11px] disabled:opacity-50 ${
                    unit.treatmentType === type
                      ? 'border-primary bg-primary text-on-primary'
                      : 'border-outline-variant text-primary'
                  }`}
                >
                  {TREATMENT_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
            {unit.treatmentType === 'ASEGURADORA' && (
              <p className="mt-2 text-sm text-secondary">
                Esta unidad está en el módulo <strong>Seguros</strong> — el expediente (reporte,
                aseguradora, etapa y checklist) se administra desde ahí.
              </p>
            )}
          </div>

          {unit.treatmentType === 'GARANTIA' && (
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

          <label className="block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              FECHA DE CAPTURA DEL DAÑO
            </span>
            <input
              type="datetime-local"
              value={damageDate}
              onChange={(e) => setDamageDate(e.target.value)}
              className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              DESCRIPCIÓN DEL DAÑO
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
            />
          </label>

          <div>
            <CommentsButton
              comments={unit.comments || []}
              onAddComment={handleAddComment}
              label="Seguimientos"
              align="left"
            />
          </div>

          <div className="flex gap-3">
            <CameraPlaceholderButton label="Foto del daño" />
            <CameraPlaceholderButton label="Foto de resuelto" />
          </div>

          <p className="font-label-caps text-[11px] text-on-surface-variant">
            Registrada por {unit.registeredBy?.name || 'Usuario'} el {formatDateTime(unit.createdAt)}
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 font-headline-md text-primary hover:bg-surface-container-high"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleSaveFields}
              disabled={saving}
              className="rounded-lg bg-secondary-container px-6 py-2 font-headline-md text-on-secondary-container hover:bg-secondary-container/90 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

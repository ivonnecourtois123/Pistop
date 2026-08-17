import { useState } from 'react';
import {
  updateInsuranceCase,
  advanceInsuranceStage,
  toggleInsuranceDocument,
  addInsuranceStageComment,
} from '../../api/insuranceCases.js';
import { updateImmobilizedTreatmentType } from '../../api/immobilized.js';
import CommentsButton from '../common/CommentsButton.jsx';
import { INSURANCE_STAGES, POLICY_TYPES, POLICY_TYPE_LABELS, DOCUMENT_TYPES } from '../../constants/immobilized.js';

export default function InsuranceCaseDetailModal({ insuranceCase, onClose, onUpdated, onRemoved }) {
  const { immobilizedUnit } = insuranceCase;
  const { vehicle } = immobilizedUnit;
  const currentIndex = INSURANCE_STAGES.findIndex((s) => s.key === insuranceCase.stage);

  const [reportNumber, setReportNumber] = useState(insuranceCase.reportNumber || '');
  const [insurer, setInsurer] = useState(insuranceCase.insurer || '');
  const [policyType, setPolicyType] = useState(insuranceCase.policyType || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showRemove, setShowRemove] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleSaveFields() {
    setSaving(true);
    setError('');
    try {
      const updated = await updateInsuranceCase(insuranceCase.id, {
        reportNumber: reportNumber.trim() || undefined,
        insurer: insurer.trim() || undefined,
        policyType: policyType || undefined,
      });
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAdvanceStage(stage) {
    setSaving(true);
    setError('');
    try {
      const updated = await advanceInsuranceStage(insuranceCase.id, stage);
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo avanzar la etapa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleDoc(docType, completed) {
    setSaving(true);
    setError('');
    try {
      const updated = await toggleInsuranceDocument(insuranceCase.id, docType, completed);
      onUpdated(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el documento.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddStageComment(stage, comment) {
    const updated = await addInsuranceStageComment(insuranceCase.id, stage, comment);
    onUpdated(updated);
  }

  async function handleRemove(newTreatmentType) {
    setRemoving(true);
    setError('');
    try {
      await updateImmobilizedTreatmentType(immobilizedUnit.id, newTreatmentType);
      onRemoved(insuranceCase.id);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo extraer la unidad de Seguros.');
      setRemoving(false);
    }
  }

  const completedDocs = insuranceCase.documents.filter((d) => d.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-container-lowest p-card-padding shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Expediente de Seguro</h2>
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

        <div className="space-y-6">
          {error && (
            <div className="rounded border border-error bg-error-container/40 px-4 py-2 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <div>
            <span className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">ETAPA</span>
            <div className="flex gap-2">
              {INSURANCE_STAGES.map((stage, index) => {
                const reached = index <= currentIndex;
                const current = index === currentIndex;
                const clickable = index > currentIndex;
                const stageComments = insuranceCase.stageComments.filter((c) => c.stage === stage.key);
                // La ventana flotante de comentarios es más ancha que una columna: en los
                // extremos se ancla al borde en vez de centrarse, para no salirse del modal.
                const align = index === 0 ? 'left' : index === INSURANCE_STAGES.length - 1 ? 'right' : 'center';

                return (
                  <div key={stage.key} className="relative flex-1 focus-within:z-40">
                    <button
                      type="button"
                      disabled={!clickable || saving}
                      onClick={() => handleAdvanceStage(stage.key)}
                      title={clickable ? `Avanzar a ${stage.label}` : undefined}
                      className={`w-full rounded-lg border px-2 py-3 text-center font-label-caps text-[10px] disabled:cursor-default ${
                        reached
                          ? 'border-primary/30 bg-primary/5 text-primary'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
                      } ${clickable ? 'hover:border-primary' : ''}`}
                    >
                      {stage.label}
                      {current && <div className="mt-1 text-secondary">(actual)</div>}
                    </button>
                    <div className="mt-1.5 flex justify-center">
                      <CommentsButton
                        comments={stageComments}
                        onAddComment={(comment) => handleAddStageComment(stage.key, comment)}
                        align={align}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                # REPORTE
              </span>
              <input
                value={reportNumber}
                onChange={(e) => setReportNumber(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                ASEGURADORA
              </span>
              <input
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                TIPO DE PÓLIZA
              </span>
              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-primary"
              >
                <option value="">Sin definir</option>
                {POLICY_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {POLICY_TYPE_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveFields}
              disabled={saving}
              className="rounded-lg bg-secondary-container px-4 py-2 font-label-caps text-[11px] text-on-secondary-container hover:bg-secondary-container/90 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar datos del caso'}
            </button>
          </div>

          <div>
            <span className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
              CHECKLIST DEL EXPEDIENTE DIGITAL ({completedDocs}/{DOCUMENT_TYPES.length})
            </span>
            <ul className="space-y-2 rounded-lg border border-outline-variant p-3">
              {DOCUMENT_TYPES.map((doc) => {
                const record = insuranceCase.documents.find((d) => d.docType === doc.key);
                return (
                  <li key={doc.key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={record?.completed || false}
                      onChange={(e) => handleToggleDoc(doc.key, e.target.checked)}
                      disabled={saving}
                      className="h-4 w-4"
                    />
                    <span className={`font-body-md text-sm ${record?.completed ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {doc.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {!showRemove ? (
            <button
              type="button"
              onClick={() => setShowRemove(true)}
              className="font-label-caps text-[11px] text-error hover:underline"
            >
              Extraer de Seguros
            </button>
          ) : (
            <div className="rounded-lg border border-error/30 bg-error-container/20 p-3">
              <p className="mb-2 text-sm text-on-error-container">
                ¿A qué tipo de tratamiento pasa la unidad al salir de Seguros?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRemove('REPARACION_INTERNA')}
                  disabled={removing}
                  className="rounded-lg border border-error px-3 py-1.5 font-label-caps text-[11px] text-error hover:bg-error hover:text-on-error disabled:opacity-50"
                >
                  Reparación interna
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove('GARANTIA')}
                  disabled={removing}
                  className="rounded-lg border border-error px-3 py-1.5 font-label-caps text-[11px] text-error hover:bg-error hover:text-on-error disabled:opacity-50"
                >
                  Garantía
                </button>
                <button
                  type="button"
                  onClick={() => setShowRemove(false)}
                  disabled={removing}
                  className="rounded-lg px-3 py-1.5 font-label-caps text-[11px] text-on-surface-variant hover:bg-surface-container-high"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

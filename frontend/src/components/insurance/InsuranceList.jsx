import { INSURANCE_STAGE_LABEL, DOCUMENT_TYPES } from '../../constants/immobilized.js';

export default function InsuranceList({ cases, onSelect }) {
  if (cases.length === 0) {
    return (
      <p className="px-card-padding py-8 text-center font-body-md text-on-surface-variant">
        No hay unidades en Seguros todavía.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-outline-variant">
      {cases.map((insuranceCase) => {
        const { immobilizedUnit } = insuranceCase;
        const { vehicle } = immobilizedUnit;
        const completedDocs = insuranceCase.documents.filter((d) => d.completed).length;

        return (
          <li key={insuranceCase.id}>
            <button
              type="button"
              onClick={() => onSelect(insuranceCase)}
              className="flex w-full flex-col gap-2 px-card-padding py-4 text-left transition-colors hover:bg-surface-container-low md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-body-md font-semibold text-primary">
                  {vehicle.brand} {vehicle.model} — {vehicle.plate}
                </p>
                <p className="font-data-mono text-xs text-on-surface-variant">
                  {vehicle.customer?.name || 'Sin cliente'}
                  {insuranceCase.insurer ? ` • ${insuranceCase.insurer}` : ''}
                  {insuranceCase.reportNumber ? ` • Reporte: ${insuranceCase.reportNumber}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="whitespace-nowrap rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-[11px] text-on-surface-variant">
                  Expediente {completedDocs}/{DOCUMENT_TYPES.length}
                </span>
                <span className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 font-label-caps text-[11px] text-primary">
                  {INSURANCE_STAGE_LABEL[insuranceCase.stage]}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

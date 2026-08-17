import { TREATMENT_TYPE_LABELS } from '../../constants/immobilized.js';

const TREATMENT_BADGE_CLASS = {
  REPARACION_INTERNA: 'bg-surface-container-high text-on-surface-variant',
  GARANTIA: 'bg-secondary-container/15 text-secondary',
  ASEGURADORA: 'bg-primary/10 text-primary',
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ImmobilizedList({ units, onSelect }) {
  if (units.length === 0) {
    return (
      <p className="px-card-padding py-8 text-center font-body-md text-on-surface-variant">
        No hay unidades inmovilizadas registradas.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-outline-variant">
      {units.map((unit) => (
        <li key={unit.id}>
          <button
            type="button"
            onClick={() => onSelect(unit)}
            className="flex w-full flex-col gap-2 px-card-padding py-4 text-left transition-colors hover:bg-surface-container-low md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-body-md font-semibold text-primary">
                {unit.vehicle.brand} {unit.vehicle.model} — {unit.vehicle.plate}
              </p>
              <p className="font-data-mono text-xs text-on-surface-variant">
                {unit.vehicle.customer?.name || 'Sin cliente'} • Daño: {formatDate(unit.damageDate)}
                {unit.treatmentType === 'GARANTIA' && unit.dmsReportNumber ? ` • Reporte DMS: ${unit.dmsReportNumber}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-3 pl-0 md:pl-0">
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1 font-label-caps text-[11px] ${
                  unit.resolved ? 'bg-primary/10 text-primary' : 'bg-error-container/40 text-on-error-container'
                }`}
              >
                {unit.resolved ? 'Resuelta' : 'Pendiente'}
              </span>
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1 font-label-caps text-[11px] ${TREATMENT_BADGE_CLASS[unit.treatmentType]}`}
              >
                {TREATMENT_TYPE_LABELS[unit.treatmentType]}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

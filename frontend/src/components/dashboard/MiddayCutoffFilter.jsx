import { STAGE_LABEL } from '../../constants/stages.js';

// "Corte de mediodía": a mediodía el asesor revisa qué unidades prometidas antes de las 3pm
// todavía no llegan a una etapa segura para cumplir. No se ata a la hora real del reloj (12:00)
// porque un asesor puede querer revisarlo antes o después — el filtro solo mira la hora
// PROMESA de cada orden, no la hora en que se activa el filtro.
const CUTOFF_HOUR = 15; // 3:00 p.m.
export const SAFE_STAGES = ['CONTROL_CALIDAD', 'LAVADO', 'TERMINADO', 'ENTREGADO'];

export function isPromisedBeforeCutoffToday(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay && d.getHours() < CUTOFF_HOUR;
}

export function filterMiddayCutoff(workOrders) {
  return workOrders.filter((wo) => isPromisedBeforeCutoffToday(wo.estimatedDeliveryAt));
}

export default function MiddayCutoffFilter({ active, onToggle, count, atRiskCount }) {
  return (
    <div className="mb-4 flex w-full flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-label-caps text-[11px] transition-colors ${
          active
            ? 'border-primary bg-primary text-on-primary'
            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-sm" data-icon="point_of_sale">
          point_of_sale
        </span>
        Corte de mediodía (entregas antes de 3:00 p.m.)
      </button>

      {active && (
        <span className="font-label-caps text-[11px] text-on-surface-variant">
          {count} orden(es){' '}
          {atRiskCount > 0 && (
            <span className="text-error">
              · {atRiskCount} sin llegar aún a {STAGE_LABEL.CONTROL_CALIDAD} o {STAGE_LABEL.LAVADO}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

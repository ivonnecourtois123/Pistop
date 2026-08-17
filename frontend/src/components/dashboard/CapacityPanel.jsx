import { useEffect, useState } from 'react';
import { getCapacity } from '../../api/capacity.js';

// Colorea la utilización igual en Servicio (horas) y HYP (unidades): el número es lo único que
// cambia de unidad, el semáforo de lectura es el mismo en los dos módulos.
function utilizationColorClass(utilization) {
  if (utilization == null) return 'text-on-surface-variant';
  if (utilization > 1) return 'text-error';
  if (utilization >= 0.85) return 'text-secondary';
  return 'text-primary';
}

function formatPercent(utilization) {
  if (utilization == null) return 'Sin datos';
  return `${Math.round(utilization * 100)}%`;
}

export default function CapacityPanel({ team, refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCapacity(team)
      .then(setData)
      .catch(() => setError('No se pudo cargar la capacidad del taller.'));
  }, [team, refreshKey]);

  if (error) return <p className="mt-4 text-sm text-error">{error}</p>;
  if (!data) return null;

  const isHyp = team === 'HYP';
  const colorClass = utilizationColorClass(data.utilization);

  return (
    <div className="mt-4 rounded-lg border border-outline-variant bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-label-caps text-[10px] text-on-surface-variant">CAPACIDAD INSTALADA</p>
          <p className={`font-headline-md ${colorClass}`}>{formatPercent(data.utilization)}</p>
        </div>

        {isHyp ? (
          <div className="flex gap-6 text-sm text-on-surface-variant">
            <span>
              <span className="font-medium text-primary">{data.technicianCount}</span> técnicos
            </span>
            <span>
              <span className="font-medium text-primary">{data.capacityUnits}</span> cupo (unidades)
            </span>
            <span>
              <span className="font-medium text-primary">{data.demandUnits}</span> en proceso
            </span>
          </div>
        ) : (
          <div className="flex gap-6 text-sm text-on-surface-variant">
            <span>
              <span className="font-medium text-primary">{data.technicianCount}</span> técnicos
            </span>
            <span>
              <span className="font-medium text-primary">{data.capacityHours.toFixed(1)}</span> h/día disponibles
            </span>
            <span>
              <span className="font-medium text-primary">{data.demandHours.toFixed(1)}</span> h demandadas
            </span>
          </div>
        )}
      </div>

      {!isHyp && data.unclassifiedCount > 0 && (
        <p className="mt-2 font-label-caps text-[10px] text-on-surface-variant">
          {data.unclassifiedCount} orden(es) en proceso sin &quot;Tipo de servicio&quot; clasificado — no se contaron
          en la demanda.
        </p>
      )}
    </div>
  );
}

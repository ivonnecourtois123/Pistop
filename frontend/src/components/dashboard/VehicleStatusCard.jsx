import { useState } from 'react';
import ProgressStepper from './ProgressStepper.jsx';
import { updateWorkOrderStatus } from '../../api/workOrders.js';

const STATUS_ORDER = ['RECIBIDO', 'EN_TALLER', 'LAVADO', 'LISTO', 'ENTREGADO'];
const STATUS_LABEL = {
  RECIBIDO: 'RECIBIDO',
  EN_TALLER: 'EN TALLER',
  LAVADO: 'EN LAVADO',
  LISTO: 'LISTO PARA ENTREGA',
  ENTREGADO: 'ENTREGADO',
};

function nextStatus(current) {
  const idx = STATUS_ORDER.indexOf(current);
  return idx >= 0 && idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
}

function formatEstimatedDelivery(dateString) {
  if (!dateString) return 'Sin definir';
  const date = new Date(dateString);
  const isToday = new Date().toDateString() === date.toDateString();
  const time = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  return isToday ? `Hoy, ${time} hrs` : `${date.toLocaleDateString('es-MX')}, ${time} hrs`;
}

export default function VehicleStatusCard({ workOrder, onUpdated }) {
  const [advancing, setAdvancing] = useState(false);
  const { vehicle, technician, advisor, status, orderNumber, statusEvents } = workOrder;
  const upcoming = nextStatus(status);

  async function handleAdvance() {
    if (!upcoming) return;
    setAdvancing(true);
    try {
      const updated = await updateWorkOrderStatus(workOrder.id, upcoming);
      onUpdated?.(updated);
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <span className="mb-1 block font-label-caps text-label-caps uppercase text-secondary">
            Vehículo en Servicio
          </span>
          <h2 className="flex items-center gap-3 font-headline-lg text-headline-lg text-primary">
            {vehicle.logoUrl && (
              <img src={vehicle.logoUrl} alt={vehicle.brand} className="h-10 w-10 object-contain" />
            )}
            <span>
              {vehicle.brand} {vehicle.model}
              {vehicle.year ? ` ${vehicle.year}` : ''}
              {vehicle.color ? ` - ${vehicle.color}` : ''}
            </span>
          </h2>
          <p className="flex items-center gap-2 font-body-md text-on-surface-variant">
            <span className="material-symbols-outlined text-sm" data-icon="tag">
              tag
            </span>
            Orden: #{orderNumber} • Placas: {vehicle.plate}
          </p>
          {(workOrder.serviceType || workOrder.customerWaiting || workOrder.partsNeeded || workOrder.washNeeded) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {workOrder.serviceType && (
                <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-[10px] text-on-surface-variant">
                  {workOrder.serviceType.trim()}
                </span>
              )}
              {workOrder.customerWaiting && (
                <span className="rounded-full bg-error-container/40 px-3 py-1 font-label-caps text-[10px] text-on-error-container">
                  Cliente espera
                </span>
              )}
              {workOrder.partsNeeded && (
                <span className="rounded-full bg-secondary-container/15 px-3 py-1 font-label-caps text-[10px] text-secondary">
                  Requiere refacciones
                </span>
              )}
              {workOrder.washNeeded && (
                <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-caps text-[10px] text-on-surface-variant">
                  Requiere lavado
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-secondary-container/20 bg-secondary-container/10 px-4 py-2">
            <span className="font-label-caps text-label-caps text-secondary">
              Estado: {STATUS_LABEL[status]}
            </span>
          </div>
          {upcoming && (
            <button
              type="button"
              onClick={handleAdvance}
              disabled={advancing}
              className="rounded-lg border border-primary px-4 py-2 font-label-caps text-label-caps text-primary transition-colors hover:bg-primary hover:text-on-primary disabled:opacity-50"
            >
              {advancing ? 'Actualizando...' : `Avanzar a ${STATUS_LABEL[upcoming]}`}
            </button>
          )}
        </div>
      </div>

      <ProgressStepper status={status} statusEvents={statusEvents} />

      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-outline-variant pt-8 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="rounded bg-surface-container-high p-2">
            <span className="material-symbols-outlined text-primary" data-icon="person">
              person
            </span>
          </div>
          <div>
            <p className="font-label-caps text-[10px] text-on-surface-variant">CLIENTE</p>
            <p className="font-body-md font-semibold text-primary">{vehicle.customer?.name || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded bg-surface-container-high p-2">
            <span className="material-symbols-outlined text-primary" data-icon="handyman">
              handyman
            </span>
          </div>
          <div>
            <p className="font-label-caps text-[10px] text-on-surface-variant">TÉCNICO</p>
            <p className="font-body-md font-semibold text-primary">{technician?.name || 'Sin asignar'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded bg-surface-container-high p-2">
            <span className="material-symbols-outlined text-primary" data-icon="schedule">
              schedule
            </span>
          </div>
          <div>
            <p className="font-label-caps text-[10px] text-on-surface-variant">ENTREGA ESTIMADA</p>
            <p className="font-body-md font-semibold text-primary">
              {formatEstimatedDelivery(workOrder.estimatedDeliveryAt)}
            </p>
          </div>
        </div>
      </div>

      {advisor?.name && (
        <p className="mt-4 text-right text-xs text-on-surface-variant/70">
          Asesor a cargo: {advisor.name}
        </p>
      )}
    </section>
  );
}

export default function QuickActionsGrid({ onNewWorkOrder }) {
  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-4">
      <button
        type="button"
        onClick={onNewWorkOrder}
        className="group flex cursor-pointer flex-col justify-between rounded-lg bg-primary p-card-padding text-left transition-all hover:bg-primary/95 md:col-span-2"
      >
        <div className="mb-8">
          <span className="material-symbols-outlined mb-4 text-4xl text-secondary-container" data-icon="add_circle">
            add_circle
          </span>
          <h3 className="font-headline-md text-headline-md text-white">Nueva Orden de Trabajo</h3>
          <p className="font-body-md text-on-primary-container">
            Inicia un nuevo registro de servicio de manera rápida.
          </p>
        </div>
        <div className="flex items-center gap-2 font-semibold text-secondary-container transition-all group-hover:gap-4">
          Comenzar <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
        </div>
      </button>

      <div
        title="Próximamente"
        className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding text-center opacity-60"
      >
        <span className="material-symbols-outlined mb-3 text-3xl text-primary" data-icon="inventory_2">
          inventory_2
        </span>
        <h4 className="font-headline-md text-base text-primary">Inventario</h4>
        <p className="mt-1 text-xs text-on-surface-variant">Refacciones y consumibles</p>
      </div>

      <div
        title="Próximamente"
        className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding text-center opacity-60"
      >
        <span className="material-symbols-outlined mb-3 text-3xl text-primary" data-icon="calendar_month">
          calendar_month
        </span>
        <h4 className="font-headline-md text-base text-primary">Agenda</h4>
        <p className="mt-1 text-xs text-on-surface-variant">Citas programadas</p>
      </div>
    </div>
  );
}

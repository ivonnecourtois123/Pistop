const STEPS = [
  { key: 'RECIBIDO', label: 'Recibido', icon: 'check_circle' },
  { key: 'EN_TALLER', label: 'En Taller', icon: 'build' },
  { key: 'LAVADO', label: 'Lavado', icon: 'local_car_wash' },
  { key: 'LISTO', label: 'Listo', icon: 'task_alt' },
];

function findStepIndex(status) {
  if (status === 'ENTREGADO') return STEPS.length - 1;
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function formatTime(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

export default function ProgressStepper({ status, statusEvents = [] }) {
  const activeIndex = findStepIndex(status);
  const progressPercent = (activeIndex / (STEPS.length - 1)) * 90; // deja margen del 5%/5% como en el mockup

  const eventTimeFor = (stepKey) => {
    const event = statusEvents.find((e) => e.status === stepKey);
    return event ? formatTime(event.occurredAt) : null;
  };

  return (
    <div className="relative py-8">
      <div className="absolute left-[5%] right-[5%] top-[52px] h-1 rounded-full bg-surface-container-high" />
      <div
        className="absolute left-[5%] top-[52px] h-1 rounded-full bg-primary transition-all"
        style={{ width: `${progressPercent}%` }}
      />
      <div className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex || status === 'ENTREGADO';
          const isActive = index === activeIndex && status !== 'ENTREGADO';
          const isPending = index > activeIndex;
          const time = eventTimeFor(step.key);

          return (
            <div key={step.key} className={`group flex w-1/4 flex-col items-center ${isPending ? 'opacity-40' : ''}`}>
              <div
                className={
                  isDone
                    ? 'z-10 mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-md transition-transform group-hover:scale-110'
                    : isActive
                    ? 'z-10 mb-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-secondary-container bg-surface-container-lowest text-secondary-container shadow-md transition-transform group-hover:scale-110'
                    : 'z-10 mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-outline transition-transform group-hover:scale-110'
                }
              >
                <span
                  className={`material-symbols-outlined ${isActive ? 'animate-pulse' : ''}`}
                  data-icon={step.icon}
                  style={isDone ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {step.icon}
                </span>
              </div>
              <span
                className={`font-label-caps text-label-caps ${
                  isActive ? 'text-secondary-container' : isDone ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {step.label}
              </span>
              <span
                className={`font-data-mono text-[10px] ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`}
              >
                {isActive ? 'EN PROCESO' : time || 'Pendiente'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

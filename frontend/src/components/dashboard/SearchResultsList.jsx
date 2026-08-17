export default function SearchResultsList({ results, onSelect }) {
  return (
    <div className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest card-elevation">
      <p className="border-b border-outline-variant px-card-padding py-4 font-label-caps text-label-caps text-on-surface-variant">
        {results.length} resultado(s) encontrados
      </p>
      <ul className="divide-y divide-outline-variant">
        {results.map((wo) => (
          <li key={wo.id}>
            <button
              type="button"
              onClick={() => onSelect(wo)}
              className="flex w-full items-center justify-between px-card-padding py-4 text-left transition-colors hover:bg-surface-container-low"
            >
              <div>
                <p className="font-body-md font-semibold text-primary">
                  {wo.vehicle.brand} {wo.vehicle.model}
                  {wo.vehicle.year ? ` ${wo.vehicle.year}` : ''} — {wo.vehicle.plate}
                </p>
                <p className="font-data-mono text-xs text-on-surface-variant">
                  Orden #{wo.orderNumber} • VIN: {wo.vehicle.vin}
                </p>
              </div>
              <span className="font-label-caps text-label-caps text-secondary">{wo.status}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

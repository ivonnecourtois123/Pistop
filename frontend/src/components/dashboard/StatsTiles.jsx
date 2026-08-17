const TILES = [
  { key: 'totalHoy', label: 'TOTAL HOY', icon: 'directions_car', colorClass: 'text-primary' },
  { key: 'terminados', label: 'TERMINADOS', icon: 'check_circle', colorClass: 'text-primary' },
  { key: 'porEntregar', label: 'POR ENTREGAR', icon: 'pending_actions', colorClass: 'text-secondary' },
];

export default function StatsTiles({ stats }) {
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {TILES.map((tile) => (
        <div
          key={tile.key}
          className="flex min-w-[200px] flex-1 items-center justify-between rounded-lg border border-outline-variant bg-white p-4"
        >
          <div>
            <p className="font-label-caps text-[10px] text-on-surface-variant">{tile.label}</p>
            <p className={`font-headline-md ${tile.colorClass}`}>{stats?.[tile.key] ?? '—'}</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant/30" data-icon={tile.icon}>
            {tile.icon}
          </span>
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';

const MODES = [
  { key: 'orden', label: 'Orden', icon: 'tag' },
  { key: 'placas', label: 'Placas', icon: 'directions_car' },
  { key: 'vin', label: 'VIN', icon: 'fingerprint' },
];

const REPORT_MODE = { key: 'reporte', label: 'Reporte', icon: 'description' };

export default function SearchBar({ value, onChange, showReportMode }) {
  const [mode, setMode] = useState('vin');
  const modes = showReportMode ? [...MODES, REPORT_MODE] : MODES;
  const placeholder = showReportMode ? 'Orden, Placas, VIN o # de Reporte...' : 'Orden, Placas o VIN...';

  return (
    <div className="mb-12 w-full max-w-3xl">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <span
            className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary"
            data-icon="search"
          >
            search
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block h-16 w-full rounded-lg border-2 border-transparent bg-[#EDF2F7] pl-14 pr-4 font-body-lg text-primary transition-all placeholder:text-on-surface-variant/60 focus:border-primary focus:bg-white focus:ring-0"
        />
      </div>

      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="mr-2 font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant/60">
          Buscando por:
        </span>
        <div className="flex gap-2">
          {modes.map((m) => {
            const isActive = mode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={
                  isActive
                    ? 'flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-on-primary'
                    : 'flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 text-primary transition-colors hover:border-primary'
                }
              >
                <span className="material-symbols-outlined text-sm" data-icon={m.icon}>
                  {m.icon}
                </span>
                <span className="font-label-caps text-[11px]">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

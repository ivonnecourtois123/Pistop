import { useMemo, useState } from 'react';
import { GROUP_BRANDS, DEFAULT_AGENCIES, getFullAgencyName } from '../../constants/immobilized.js';

const BRACKETS = [
  { key: 'b1_30', label: '1 a 30', min: 1, max: 30 },
  { key: 'b31_60', label: '31 a 60', min: 31, max: 60 },
  { key: 'b61_90', label: '61 a 90', min: 61, max: 90 },
  { key: 'b91_120', label: '91 a 120', min: 91, max: 120 },
  { key: 'b121_150', label: '121 a 150', min: 121, max: 150 },
  { key: 'b151_180', label: '151 a 180', min: 151, max: 180 },
  { key: 'b180_plus', label: '> 180', min: 181, max: Infinity },
];

function calculateDaysWithDamage(damageDate, resolved, resolvedAt) {
  if (!damageDate) return 0;
  const start = new Date(damageDate).getTime();
  const end = resolved && resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  const diffMs = Math.max(0, end - start);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function ReporteJDashboard({ units = [], onSelectUnit }) {
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [activeBracketFilter, setActiveBracketFilter] = useState(null);

  // Normalizamos las unidades con días de daño y agencia limpia
  const enrichedUnits = useMemo(() => {
    return units.map((u) => {
      const days = calculateDaysWithDamage(u.damageDate, u.resolved, u.resolvedAt);
      const cleanAgency = getFullAgencyName(u.agency || 'Tuxtla Poniente');
      const brand = (u.vehicle?.brand || 'NISSAN').toUpperCase();
      return {
        ...u,
        damageDays: days,
        cleanAgency,
        brand,
      };
    });
  }, [units]);

  // Filtradas por Marca y Agencia
  const filteredUnits = useMemo(() => {
    return enrichedUnits.filter((u) => {
      if (selectedBrand !== 'ALL' && !u.brand.includes(selectedBrand)) return false;
      if (selectedAgency !== 'ALL' && u.cleanAgency !== selectedAgency) return false;
      return true;
    });
  }, [enrichedUnits, selectedBrand, selectedAgency]);

  // Unidades activas (pendientes) para el Reporte J
  const activeUnits = useMemo(() => filteredUnits.filter((u) => !u.resolved), [filteredUnits]);

  // Agrupación por sucursal / agencia
  const agencyRows = useMemo(() => {
    const agencies = selectedAgency !== 'ALL' ? [selectedAgency] : DEFAULT_AGENCIES;
    return agencies.map((ag) => {
      const agencyUnits = activeUnits.filter((u) => u.cleanAgency === ag);
      const total = agencyUnits.length;

      const bracketCounts = {
        b1_30: 0,
        b31_60: 0,
        b61_90: 0,
        b91_120: 0,
        b121_150: 0,
        b151_180: 0,
        b180_plus: 0,
      };

      agencyUnits.forEach((u) => {
        const d = u.damageDays;
        if (d <= 30) bracketCounts.b1_30 += 1;
        else if (d <= 60) bracketCounts.b31_60 += 1;
        else if (d <= 90) bracketCounts.b61_90 += 1;
        else if (d <= 120) bracketCounts.b91_120 += 1;
        else if (d <= 150) bracketCounts.b121_150 += 1;
        else if (d <= 180) bracketCounts.b151_180 += 1;
        else bracketCounts.b180_plus += 1;
      });

      const totalOver60 =
        bracketCounts.b61_90 +
        bracketCounts.b91_120 +
        bracketCounts.b121_150 +
        bracketCounts.b151_180 +
        bracketCounts.b180_plus;

      // Meta: Máximo 2 en 31-60d y Máximo 1 >60d
      const cumple = bracketCounts.b31_60 <= 2 && totalOver60 <= 1;

      return {
        agency: ag,
        total,
        bracketCounts,
        totalOver60,
        cumple,
      };
    });
  }, [activeUnits, selectedAgency]);

  // Totales generales de la matriz
  const matrixTotals = useMemo(() => {
    const totals = {
      total: 0,
      b1_30: 0,
      b31_60: 0,
      b61_90: 0,
      b91_120: 0,
      b121_150: 0,
      b151_180: 0,
      b180_plus: 0,
    };
    agencyRows.forEach((r) => {
      totals.total += r.total;
      totals.b1_30 += r.bracketCounts.b1_30;
      totals.b31_60 += r.bracketCounts.b31_60;
      totals.b61_90 += r.bracketCounts.b61_90;
      totals.b91_120 += r.bracketCounts.b91_120;
      totals.b121_150 += r.bracketCounts.b121_150;
      totals.b151_180 += r.bracketCounts.b151_180;
      totals.b180_plus += r.bracketCounts.b180_plus;
    });
    return totals;
  }, [agencyRows]);

  // Métricas generales
  const avgDays = useMemo(() => {
    if (activeUnits.length === 0) return 0;
    const sum = activeUnits.reduce((acc, u) => acc + u.damageDays, 0);
    return Math.round(sum / activeUnits.length);
  }, [activeUnits]);

  const unitsOver30 = useMemo(() => activeUnits.filter((u) => u.damageDays > 30).length, [activeUnits]);
  const unitsOver60 = useMemo(() => activeUnits.filter((u) => u.damageDays > 60).length, [activeUnits]);

  // Unidades filtradas por bracket seleccionado para desglose
  const bracketDetailedUnits = useMemo(() => {
    if (!activeBracketFilter) return activeUnits;
    const b = BRACKETS.find((br) => br.key === activeBracketFilter);
    if (!b) return activeUnits;
    return activeUnits.filter((u) => u.damageDays >= b.min && u.damageDays <= b.max);
  }, [activeUnits, activeBracketFilter]);

  return (
    <div className="space-y-6">
      {/* Controles de filtro jerárquico */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="mb-1 block font-label-caps text-[10px] text-on-surface-variant">MARCA</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedBrand('ALL')}
                className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] transition-colors ${
                  selectedBrand === 'ALL'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'border border-outline-variant bg-white text-on-surface-variant hover:border-primary'
                }`}
              >
                Todas
              </button>
              {GROUP_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] transition-colors ${
                    selectedBrand === b
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'border border-outline-variant bg-white text-on-surface-variant hover:border-primary'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="h-8 w-px bg-outline-variant/60" />

          <div>
            <label htmlFor="reporte-j-agency-select" className="mb-1 block font-label-caps text-[10px] text-on-surface-variant">AGENCIA / SUCURSAL</label>
            <select
              id="reporte-j-agency-select"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-label-caps text-[11px] text-primary focus:border-primary focus:outline-none"
            >
              <option value="ALL">Todas las agencias</option>
              {DEFAULT_AGENCIES.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeBracketFilter && (
          <button
            type="button"
            onClick={() => setActiveBracketFilter(null)}
            className="flex items-center gap-1.5 rounded-lg border border-secondary bg-secondary/10 px-3 py-1.5 font-label-caps text-[11px] text-secondary hover:bg-secondary/20"
          >
            <span>Filtro rango: {BRACKETS.find((b) => b.key === activeBracketFilter)?.label} días</span>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {/* Tarjetas resumen KPI */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-on-surface-variant">TOTAL INMOVILIZADOS ACTIVOS</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-headline-lg text-3xl font-black text-primary">{activeUnits.length}</span>
            <span className="text-xs text-on-surface-variant">unidades</span>
          </div>
          <p className="mt-1 text-[11px] text-on-surface-variant">
            {filteredUnits.length - activeUnits.length} resueltas históricas
          </p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-on-surface-variant">DÍAS CON DAÑO PROMEDIO</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-headline-lg text-3xl font-black text-primary">{avgDays}</span>
            <span className="text-xs text-on-surface-variant">días</span>
          </div>
          <p className="mt-1 text-[11px] text-on-surface-variant">Tiempo transcurrido en daño</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-amber-800">UNIDADES &gt; 30 DÍAS</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-headline-lg text-3xl font-black text-amber-700">{unitsOver30}</span>
            <span className="text-xs text-amber-800">
              ({activeUnits.length ? Math.round((unitsOver30 / activeUnits.length) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700">Meta: max 2 unidades</p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-red-800">UNIDADES &gt; 60 DÍAS (CRÍTICAS)</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-headline-lg text-3xl font-black text-red-700">{unitsOver60}</span>
            <span className="text-xs text-red-800">
              ({activeUnits.length ? Math.round((unitsOver60 / activeUnits.length) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-red-700">Meta: max 1 unidad</p>
        </div>
      </div>

      {/* Matriz Reporte J por Sucursal y Rangos de Días */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest card-elevation">
        <div className="border-b border-outline-variant bg-surface-container-low px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-headline-md text-base font-bold text-primary">
                📊 Reporte J: Distribución de Días con Daño por Agencia
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Regla de cumplimiento: Máx. 2 unidades en 31-60 días y Máx. 1 unidad con más de 60 días.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-label-caps text-[11px] font-bold text-primary">
              {selectedBrand === 'ALL' ? 'Todas las marcas' : selectedBrand}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant">
                <th className="px-4 py-3 font-semibold">Agencia / Sucursal</th>
                <th className="px-3 py-3 text-center font-semibold">Total Dañadas</th>
                {BRACKETS.map((b) => (
                  <th
                    key={b.key}
                    onClick={() => setActiveBracketFilter(activeBracketFilter === b.key ? null : b.key)}
                    className={`cursor-pointer px-3 py-3 text-center font-semibold transition-colors hover:bg-surface-container ${
                      activeBracketFilter === b.key ? 'bg-secondary/15 text-secondary' : ''
                    }`}
                  >
                    {b.label} d
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold">Total &gt;60d</th>
                <th className="px-4 py-3 text-center font-semibold">¿CUMPLE?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {agencyRows.map((row) => (
                <tr key={row.agency} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-semibold text-primary">{row.agency}</td>
                  <td className="px-3 py-3 text-center font-data-mono font-bold text-primary">
                    {row.total}
                  </td>
                  {BRACKETS.map((b) => {
                    const val = row.bracketCounts[b.key];
                    const isHigh = b.key !== 'b1_30' && val > 0;
                    return (
                      <td
                        key={b.key}
                        onClick={() => setActiveBracketFilter(b.key)}
                        className={`cursor-pointer px-3 py-3 text-center font-data-mono transition-colors hover:bg-secondary/10 ${
                          val === 0
                            ? 'text-on-surface-variant/40'
                            : isHigh
                            ? 'font-bold text-amber-700'
                            : 'font-semibold text-primary'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                  <td
                    className={`px-3 py-3 text-center font-data-mono font-bold ${
                      row.totalOver60 > 1 ? 'text-error' : row.totalOver60 === 1 ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {row.totalOver60}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.total === 0 ? (
                      <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-emerald-800">
                        ✅ CUMPLE (0)
                      </span>
                    ) : row.cumple ? (
                      <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-emerald-800">
                        ✅ CUMPLE
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-red-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-red-800">
                        ❌ NO CUMPLE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-outline-variant bg-surface-container font-semibold">
                <td className="px-4 py-3 font-label-caps text-xs text-primary">TOTAL GENERAL</td>
                <td className="px-3 py-3 text-center font-data-mono font-bold text-primary">
                  {matrixTotals.total}
                </td>
                {BRACKETS.map((b) => (
                  <td key={b.key} className="px-3 py-3 text-center font-data-mono font-bold text-primary">
                    {matrixTotals[b.key]}
                  </td>
                ))}
                <td className="px-3 py-3 text-center font-data-mono font-bold text-error">
                  {matrixTotals.b61_90 +
                    matrixTotals.b91_120 +
                    matrixTotals.b121_150 +
                    matrixTotals.b151_180 +
                    matrixTotals.b180_plus}
                </td>
                <td className="px-4 py-3 text-center">
                  {matrixTotals.b31_60 <= 2 &&
                  matrixTotals.b61_90 +
                    matrixTotals.b91_120 +
                    matrixTotals.b121_150 +
                    matrixTotals.b151_180 +
                    matrixTotals.b180_plus <=
                    1 ? (
                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-emerald-800">
                      ✅ CUMPLE
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-red-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-red-800">
                      ❌ NO CUMPLE
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Detalle de Unidades según rango seleccionado */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 card-elevation">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-headline-md text-sm font-bold text-primary">
            🔍 Detalle de Unidades {activeBracketFilter ? `(Rango: ${BRACKETS.find((b) => b.key === activeBracketFilter)?.label} días)` : '(Todas las activas)'}
          </h3>
          <span className="font-label-caps text-xs text-on-surface-variant">
            {bracketDetailedUnits.length} {bracketDetailedUnits.length === 1 ? 'unidad' : 'unidades'}
          </span>
        </div>

        {bracketDetailedUnits.length === 0 ? (
          <p className="py-6 text-center text-xs text-on-surface-variant">No hay unidades en este rango de días con daño.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low font-label-caps text-[10px] text-on-surface-variant">
                  <th className="px-3 py-2 font-semibold">Vehículo</th>
                  <th className="px-3 py-2 font-semibold">Placas / VIN</th>
                  <th className="px-3 py-2 font-semibold">Agencia</th>
                  <th className="px-3 py-2 font-semibold">Días Daño</th>
                  <th className="px-3 py-2 font-semibold">Tipo Tratamiento</th>
                  <th className="px-3 py-2 font-semibold">Descripción del Daño</th>
                  <th className="px-3 py-2 text-right font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {bracketDetailedUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-surface-container-low/40">
                    <td className="px-3 py-2.5 font-semibold text-primary">
                      {unit.vehicle?.brand} {unit.vehicle?.model} {unit.vehicle?.year ? `(${unit.vehicle.year})` : ''}
                    </td>
                    <td className="px-3 py-2.5 font-data-mono text-on-surface-variant">
                      {unit.vehicle?.plate || 'S/P'}
                    </td>
                    <td className="px-3 py-2.5 text-on-surface-variant">{unit.cleanAgency}</td>
                    <td className="px-3 py-2.5 font-data-mono">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-bold ${
                          unit.damageDays > 60
                            ? 'bg-red-100 text-red-800'
                            : unit.damageDays > 30
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {unit.damageDays} días
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-label-caps text-[10px] text-on-surface-variant">
                      {unit.treatmentType}
                    </td>
                    <td className="max-w-xs truncate px-3 py-2.5 text-on-surface-variant" title={unit.description}>
                      {unit.description || 'Sin descripción'}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectUnit && onSelectUnit(unit)}
                        className="rounded bg-primary/10 px-2.5 py-1 font-label-caps text-[10px] font-bold text-primary hover:bg-primary hover:text-on-primary"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

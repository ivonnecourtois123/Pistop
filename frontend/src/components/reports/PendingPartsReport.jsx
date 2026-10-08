import { useEffect, useMemo, useState } from 'react';
import { getPendingPartsReport } from '../../api/workOrders.js';
import Spinner from '../common/Spinner.jsx';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function PendingPartsReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'RECEIVED'
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'SERVICIO' | 'HYP'

  useEffect(() => {
    setLoading(true);
    getPendingPartsReport()
      .then(setReport)
      .catch(() => setError('No se pudo cargar el reporte de refacciones en proceso.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredParts = useMemo(() => {
    if (!report?.parts) return [];
    return report.parts.filter((p) => {
      if (statusFilter === 'PENDING' && p.received) return false;
      if (statusFilter === 'RECEIVED' && !p.received) return false;
      if (typeFilter !== 'ALL' && p.orderType !== typeFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesPart = p.partNumber?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        const matchesOrder = p.orderNumber?.toLowerCase().includes(query);
        const matchesWo = p.workOrderNumber?.toLowerCase().includes(query);
        const matchesPlate = p.vehicle?.plate?.toLowerCase().includes(query);
        const matchesBrand = p.vehicle?.brand?.toLowerCase().includes(query);
        return matchesPart || matchesDesc || matchesOrder || matchesWo || matchesPlate || matchesBrand;
      }
      return true;
    });
  }, [report, statusFilter, typeFilter, search]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="rounded-xl border border-error bg-error-container/30 p-4 text-sm text-on-error-container">
        {error || 'Sin datos de refacciones.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 KPIs de Refacciones */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-on-surface-variant">TOTAL REFACCIONES PEDIDAS</p>
          <p className="mt-1 font-headline-lg text-2xl font-black text-primary">{report.totalParts}</p>
          <p className="text-[11px] text-on-surface-variant">en órdenes abiertas</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-amber-800">PENDIENTES POR RECIBIR</p>
          <p className="mt-1 font-headline-lg text-2xl font-black text-amber-700">{report.pendingCount}</p>
          <p className="text-[11px] text-amber-800">piezas en tránsito o proveedor</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-emerald-800">RECIBIDAS EN TALLER</p>
          <p className="mt-1 font-headline-lg text-2xl font-black text-emerald-700">{report.receivedCount}</p>
          <p className="text-[11px] text-emerald-800">listas para montaje</p>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 card-elevation">
          <p className="font-label-caps text-[10px] text-on-surface-variant">ÓRDENES ESPERANDO REFACCIÓN</p>
          <p className="mt-1 font-headline-lg text-2xl font-black text-primary">{report.ordersWaitingParts}</p>
          <p className="text-[11px] text-on-surface-variant">unidades con piezas faltantes</p>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por # de parte, descripción, placas, pedido..."
              className="w-full rounded-lg border border-outline-variant bg-white py-2 pl-9 pr-4 text-xs text-primary placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] font-bold ${
                statusFilter === 'ALL'
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant bg-white text-on-surface-variant'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] font-bold ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'border border-outline-variant bg-white text-on-surface-variant'
              }`}
            >
              Pendientes
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('RECEIVED')}
              className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] font-bold ${
                statusFilter === 'RECEIVED'
                  ? 'bg-emerald-600 text-white'
                  : 'border border-outline-variant bg-white text-on-surface-variant'
              }`}
            >
              Recibidas
            </button>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] font-bold ${
                typeFilter === 'ALL'
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant bg-white text-on-surface-variant'
              }`}
            >
              Todos Módulos
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('SERVICIO')}
              className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] font-bold ${
                typeFilter === 'SERVICIO'
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant bg-white text-on-surface-variant'
              }`}
            >
              Servicio
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('HYP')}
              className={`rounded-lg px-3 py-1.5 font-label-caps text-[11px] font-bold ${
                typeFilter === 'HYP'
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant bg-white text-on-surface-variant'
              }`}
            >
              HYP
            </button>
          </div>
        </div>

        <span className="font-label-caps text-xs text-on-surface-variant">
          {filteredParts.length} {filteredParts.length === 1 ? 'pieza' : 'piezas'}
        </span>
      </div>

      {/* Tabla detallada de Refacciones */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest card-elevation">
        {filteredParts.length === 0 ? (
          <p className="py-12 text-center text-xs text-on-surface-variant">
            No se encontraron refacciones con los filtros seleccionados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low font-label-caps text-[10px] text-on-surface-variant">
                  <th className="px-4 py-3 font-semibold"># de Parte</th>
                  <th className="px-4 py-3 font-semibold">Descripción</th>
                  <th className="px-4 py-3 font-semibold"># Pedido DMS</th>
                  <th className="px-4 py-3 font-semibold">Fecha Pedido</th>
                  <th className="px-4 py-3 font-semibold">Vehículo / Placas</th>
                  <th className="px-4 py-3 font-semibold">Orden Trabajo</th>
                  <th className="px-4 py-3 font-semibold">Módulo</th>
                  <th className="px-4 py-3 text-center font-semibold">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {filteredParts.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/40">
                    <td className="px-4 py-3 font-data-mono font-bold text-primary">{p.partNumber}</td>
                    <td className="max-w-xs px-4 py-3 text-on-surface-variant">{p.description}</td>
                    <td className="px-4 py-3 font-data-mono font-semibold text-primary">{p.orderNumber}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(p.orderDate)}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-primary">
                        {p.vehicle?.brand} {p.vehicle?.model}
                      </div>
                      <div className="font-data-mono text-[11px] text-on-surface-variant">
                        {p.vehicle?.plate || 'S/P'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-data-mono font-bold text-primary">{p.workOrderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-label-caps text-[10px] font-bold ${
                          p.orderType === 'HYP'
                            ? 'bg-secondary/15 text-secondary'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {p.orderType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.received ? (
                        <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-emerald-800">
                          ✅ Recibida {p.receivedAt ? `(${formatDate(p.receivedAt)})` : ''}
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 font-label-caps text-[10px] font-bold text-amber-800">
                          ⏳ Pendiente
                        </span>
                      )}
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

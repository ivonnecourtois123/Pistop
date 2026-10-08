import { useEffect, useMemo, useState } from 'react';
import { getPendingPartsReport, setPendingPartReceived } from '../../api/workOrders.js';
import { GROUP_BRANDS, DEFAULT_AGENCIES, getFullAgencyName } from '../../constants/immobilized.js';
import Spinner from '../common/Spinner.jsx';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ServicePendingPartsView({ onSelectOrder }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('PENDING'); // 'ALL' | 'PENDING' | 'RECEIVED'
  const [search, setSearch] = useState('');
  const [updatingPartId, setUpdatingPartId] = useState(null);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await getPendingPartsReport();
      setReport(data);
    } catch {
      setError('No se pudo cargar el reporte de refacciones en proceso.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleToggleReceived(workOrderId, partId, nextReceived) {
    if (updatingPartId) return;
    setUpdatingPartId(partId);
    try {
      await setPendingPartReceived(workOrderId, partId, nextReceived);
      await loadData();
    } catch {
      // error handled
    } finally {
      setUpdatingPartId(null);
    }
  }

  // Normalizamos las refacciones con marca y agencia limpia
  const enrichedParts = useMemo(() => {
    if (!report?.parts) return [];
    return report.parts.map((p) => {
      const brand = (p.vehicle?.brand || 'NISSAN').toUpperCase();
      const cleanAgency = getFullAgencyName(p.agency || 'Tuxtla Poniente');
      const amount = Number(p.amount) || 0;
      return {
        ...p,
        brand,
        cleanAgency,
        amount,
      };
    });
  }, [report]);

  // Refacciones filtradas por Marca, Agencia, Búsqueda y Estatus
  const filteredParts = useMemo(() => {
    return enrichedParts.filter((p) => {
      // Solo órdenes de SERVICIO (o si no tiene tipo específico)
      if (p.orderType && p.orderType !== 'SERVICIO') return false;

      // Filtro por marca
      if (selectedBrand !== 'ALL' && !p.brand.includes(selectedBrand.toUpperCase())) {
        return false;
      }

      // Filtro por agencia
      if (selectedAgency !== 'ALL' && p.cleanAgency.toLowerCase() !== selectedAgency.toLowerCase()) {
        return false;
      }

      // Filtro por estatus de recepción
      if (statusFilter === 'PENDING' && p.received) return false;
      if (statusFilter === 'RECEIVED' && !p.received) return false;

      // Búsqueda por texto
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesPart = p.partNumber?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        const matchesOrder = p.orderNumber?.toLowerCase().includes(query);
        const matchesWo = p.workOrderNumber?.toLowerCase().includes(query);
        const matchesPlate = p.vehicle?.plate?.toLowerCase().includes(query);
        const matchesCustomer = p.vehicle?.customerName?.toLowerCase().includes(query);
        if (!matchesPart && !matchesDesc && !matchesOrder && !matchesWo && !matchesPlate && !matchesCustomer) {
          return false;
        }
      }

      return true;
    });
  }, [enrichedParts, selectedBrand, selectedAgency, statusFilter, search]);

  // Métricas calculadas dinámicamente con base en los filtros seleccionados
  const metrics = useMemo(() => {
    // Total de partes filtradas por marca y agencia (independiente de statusFilter para los KPIs superiores)
    const baseFiltered = enrichedParts.filter((p) => {
      if (p.orderType && p.orderType !== 'SERVICIO') return false;
      if (selectedBrand !== 'ALL' && !p.brand.includes(selectedBrand.toUpperCase())) return false;
      if (selectedAgency !== 'ALL' && p.cleanAgency.toLowerCase() !== selectedAgency.toLowerCase()) return false;
      return true;
    });

    const pendingPartsList = baseFiltered.filter((p) => !p.received);
    const receivedPartsList = baseFiltered.filter((p) => p.received);

    // Órdenes únicas con refacciones pendientes
    const pendingOrdersSet = new Set(pendingPartsList.map((p) => p.workOrderId));

    // Monto total de refacciones en proceso (pendientes)
    const totalPendingAmount = pendingPartsList.reduce((acc, p) => acc + p.amount, 0);

    return {
      ordersWaitingPartsCount: pendingOrdersSet.size,
      totalPendingAmount,
      pendingPartsCount: pendingPartsList.length,
      receivedPartsCount: receivedPartsList.length,
      totalPartsCount: baseFiltered.length,
    };
  }, [enrichedParts, selectedBrand, selectedAgency]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
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
    <div className="w-full space-y-6">
      {/* 1. BARRA DE FILTROS (MARCA Y AGENCIA / SUCURSAL) - IDÉNTICA AL FORMATO DE LA IMAGEN */}
      <section className="w-full rounded-2xl border border-outline-variant bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Lado izquierdo: Selector de Marca (Pills) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase mr-1">
              MARCA:
            </span>
            <button
              type="button"
              onClick={() => setSelectedBrand('ALL')}
              className={`rounded-lg px-4 py-1.5 font-label-caps text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === 'ALL'
                  ? 'bg-primary text-white shadow-xs'
                  : 'border border-outline-variant bg-slate-50 text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              Todas
            </button>
            {GROUP_BRANDS.map((b) => {
              const isSelected = selectedBrand.toUpperCase() === b.toUpperCase();
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(isSelected ? 'ALL' : b)}
                  className={`rounded-lg px-4 py-1.5 font-label-caps text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'border border-outline-variant bg-white text-on-surface-variant hover:border-primary hover:text-primary'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>

          {/* Lado derecho: Selector de Agencia */}
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
              AGENCIA / SUCURSAL:
            </span>
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs font-bold text-primary focus:border-primary focus:outline-none cursor-pointer shadow-2xs"
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
      </section>

      {/* 2. TARJETAS KPI DE REFACCIONES EN PROCESO - IDÉNTICAS AL DISEÑO DE LA CAPTURA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Cantidad de órdenes con refacciones en proceso */}
        <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
          <p className="font-label-caps text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
            ÓRDENES CON REFACCIONES EN PROCESO
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-headline-lg text-3xl font-black text-primary">
              {metrics.ordersWaitingPartsCount}
            </p>
            <span className="text-xs text-on-surface-variant font-medium">órdenes</span>
          </div>
          <p className="mt-1 text-[11px] text-on-surface-variant">unidades esperando piezas de almacén</p>
        </div>

        {/* KPI 2: Monto en Pesos Mexicanos (MXN) de esas refacciones */}
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-5 shadow-sm ring-1 ring-emerald-200">
          <p className="font-label-caps text-[10px] font-bold text-emerald-800 tracking-wider uppercase">
            MONTO TOTAL EN PROCESO (MXN)
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <p className="font-data-mono text-3xl font-black text-emerald-700">
              ${metrics.totalPendingAmount.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-emerald-800">MXN</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-800 font-medium">monto en piezas por recibir / proveedor</p>
        </div>

        {/* KPI 3: Total de piezas pendientes */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-5 shadow-sm">
          <p className="font-label-caps text-[10px] font-bold text-amber-800 tracking-wider uppercase">
            PIEZAS PENDIENTES POR RECIBIR
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-headline-lg text-3xl font-black text-amber-700">
              {metrics.pendingPartsCount}
            </p>
            <span className="text-xs text-amber-800 font-medium">piezas</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-800">en tránsito o backorder</p>
        </div>

        {/* KPI 4: Piezas recibidas en taller */}
        <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm">
          <p className="font-label-caps text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
            REFACCIONES YA RECIBIDAS
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-headline-lg text-3xl font-black text-primary">
              {metrics.receivedPartsCount}
            </p>
            <span className="text-xs text-on-surface-variant font-medium">piezas</span>
          </div>
          <p className="mt-1 text-[11px] text-on-surface-variant">listas para montaje en rampa</p>
        </div>
      </div>

      {/* 3. LISTADO Y TABLA DETALLADA DE REFACCIONES EN PROCESO */}
      <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
            <div>
              <h3 className="font-headline-md text-sm font-bold text-primary">
                Detalle de Refacciones y Pedidos ({filteredParts.length})
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Control de piezas por orden de trabajo, agencia y monto estimado.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro de Estatus */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-outline-variant/50">
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Solo Pendientes ({metrics.pendingPartsCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('RECEIVED')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'RECEIVED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Solo Recibidas ({metrics.receivedPartsCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Todas ({metrics.totalPartsCount})
              </button>
            </div>

            {/* Input de Búsqueda */}
            <div className="relative w-56">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar parte o # OR..."
                className="w-full rounded-xl border border-outline-variant bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-primary focus:bg-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-on-surface-variant font-label-caps text-[10px] uppercase border-b border-outline-variant/60">
              <tr>
                <th className="p-3">Estatus</th>
                <th className="p-3"># OR / Unidad</th>
                <th className="p-3">Agencia</th>
                <th className="p-3"># de Parte</th>
                <th className="p-3">Descripción de la Refacción</th>
                <th className="p-3"># Pedido / Fecha</th>
                <th className="p-3 text-right">Monto (MXN)</th>
                <th className="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredParts.length > 0 ? (
                filteredParts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 align-middle">
                      {part.received ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 font-label-caps text-[10px] font-bold text-emerald-800 border border-emerald-300">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Recibida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-label-caps text-[10px] font-bold text-amber-800 border border-amber-300">
                          <span className="material-symbols-outlined text-xs">hourglass_top</span>
                          En Proceso
                        </span>
                      )}
                    </td>

                    <td className="p-3 align-middle">
                      <button
                        type="button"
                        onClick={() => onSelectOrder?.(part.workOrderId)}
                        className="font-data-mono text-xs font-bold text-primary hover:text-emerald-700 hover:underline cursor-pointer block"
                      >
                        #{part.workOrderNumber}
                      </button>
                      <p className="font-semibold text-primary text-xs">
                        {part.vehicle?.brand} {part.vehicle?.model}
                      </p>
                      <p className="font-data-mono text-[10px] text-on-surface-variant">
                        {part.vehicle?.plate || 'Sin placas'} • {part.vehicle?.customerName}
                      </p>
                    </td>

                    <td className="p-3 align-middle">
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800 border border-blue-200">
                        <span className="material-symbols-outlined text-xs">store</span>
                        {part.cleanAgency}
                      </span>
                    </td>

                    <td className="p-3 align-middle font-data-mono font-bold text-primary">
                      {part.partNumber}
                    </td>

                    <td className="p-3 align-middle text-on-surface font-medium max-w-xs">
                      {part.description}
                    </td>

                    <td className="p-3 align-middle font-data-mono text-[11px] text-on-surface-variant">
                      <p className="font-bold text-primary">{part.orderNumber}</p>
                      <p className="text-[10px]">{formatDate(part.orderDate)}</p>
                    </td>

                    <td className="p-3 align-middle text-right font-data-mono text-xs font-black text-emerald-700">
                      ${part.amount.toLocaleString()} MXN
                    </td>

                    <td className="p-3 align-middle text-center">
                      <button
                        type="button"
                        disabled={updatingPartId === part.id}
                        onClick={() => handleToggleReceived(part.workOrderId, part.id, !part.received)}
                        className={`rounded-lg px-2.5 py-1 font-label-caps text-[10px] font-bold transition-all cursor-pointer ${
                          part.received
                            ? 'border border-outline-variant bg-slate-50 text-on-surface-variant hover:bg-amber-50 hover:text-amber-800'
                            : 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                        }`}
                        title={part.received ? 'Marcar como pendiente' : 'Marcar como recibida en almacén'}
                      >
                        {updatingPartId === part.id
                          ? '...'
                          : part.received
                          ? '↩ Desmarcar'
                          : '✓ Recibir Pieza'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-on-surface-variant/70 italic">
                    No hay refacciones que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import TopNavBar from '../layout/TopNavBar.jsx';
import StatsTiles from './StatsTiles.jsx';
import CapacityPanel from './CapacityPanel.jsx';
import InProgressList from './InProgressList.jsx';
import PromiseTimeBoard from './PromiseTimeBoard.jsx';
import HypDeliveryAgenda from './HypDeliveryAgenda.jsx';
import OrderStageDetailModal from './OrderStageDetailModal.jsx';
import NewWorkOrderModal from './NewWorkOrderModal.jsx';
import Spinner from '../common/Spinner.jsx';
import MaintenanceQuoter from '../quoter/MaintenanceQuoter.jsx';
import { getTodayStats, getInProgressWorkOrders, getWorkOrder } from '../../api/workOrders.js';
import { getServiceCategoryHours } from '../../api/capacity.js';
import { GROUP_BRANDS, DEFAULT_AGENCIES, getFullAgencyName } from '../../constants/immobilized.js';

function matchesSearch(workOrder, term, { includeReportNumber } = {}) {
  const needle = term.trim().toUpperCase();
  if (!needle) return true;
  return (
    workOrder.orderNumber.toUpperCase().includes(needle) ||
    workOrder.vehicle.plate.toUpperCase().includes(needle) ||
    workOrder.vehicle.vin.toUpperCase().includes(needle) ||
    (includeReportNumber && Boolean(workOrder.reportNumber?.toUpperCase().includes(needle)))
  );
}

export default function WorkOrderTypeDashboard({ orderType, showPromiseBoard, showDeliveryAgenda }) {
  // Pestañas principales: 'tablero' | 'seguimiento' | 'cotizador'
  const [activeMainTab, setActiveMainTab] = useState('tablero');
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [agencyFilter, setAgencyFilter] = useState('ALL');
  const [stats, setStats] = useState(null);
  const [inProgressList, setInProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [capacityRefreshKey, setCapacityRefreshKey] = useState(0);
  const [standardHours, setStandardHours] = useState(null);
  const [agingFilter, setAgingFilter] = useState(null); // null | 'with_parts' | 'over15' | 'over30' | 'over60'
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const loadStats = useCallback(async () => {
    const data = await getTodayStats(orderType);
    setStats(data);
  }, [orderType]);

  const loadInProgress = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInProgressWorkOrders(orderType);
      setInProgressList(data);
    } catch {
      setError('No se pudieron cargar las unidades en proceso.');
    } finally {
      setLoading(false);
    }
  }, [orderType]);

  useEffect(() => {
    loadInProgress();
    loadStats();
  }, [loadInProgress, loadStats]);

  useEffect(() => {
    getServiceCategoryHours()
      .then((rows) => setStandardHours(Object.fromEntries(rows.map((r) => [r.category, r.hours]))))
      .catch(() => setStandardHours({}));
  }, []);

  function handleOrderUpdated() {
    loadStats();
    loadInProgress();
    setCapacityRefreshKey((k) => k + 1);
  }

  function handleDetailOrderUpdated(updated) {
    loadStats();
    loadInProgress();
    setCapacityRefreshKey((k) => k + 1);
    setDetailOrder(updated);
  }

  async function handleSelectOrderById(orderId) {
    try {
      const wo = await getWorkOrder(orderId);
      setDetailOrder(wo);
    } catch {
      // error handled
    }
  }

  // Lista consolidada de marcas disponibles
  const availableBrands = useMemo(() => {
    const set = new Set(GROUP_BRANDS);
    inProgressList.forEach((wo) => {
      if (wo.vehicle?.brand) set.add(wo.vehicle.brand.toUpperCase());
    });
    return Array.from(set).sort();
  }, [inProgressList]);

  // Lista consolidada de agencias disponibles
  const availableAgencies = useMemo(() => {
    const set = new Set(DEFAULT_AGENCIES);
    inProgressList.forEach((wo) => {
      const raw = wo.agency || wo.tower;
      if (raw && raw.trim()) set.add(getFullAgencyName(raw.trim()));
    });
    return Array.from(set).sort();
  }, [inProgressList]);

  function daysSince(dateString) {
    if (!dateString) return 0;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 0;
    const diffMs = Math.max(0, Date.now() - d.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  // Filtro compuesto: búsqueda + marca + agencia + clasificación por antigüedad/refacciones
  const filteredList = useMemo(() => {
    return inProgressList.filter((wo) => {
      // 1. Búsqueda por texto
      if (!matchesSearch(wo, searchTerm, { includeReportNumber: orderType === 'HYP' })) {
        return false;
      }
      // 2. Filtro por marca
      if (brandFilter !== 'ALL') {
        const b = (wo.vehicle?.brand || '').trim().toUpperCase();
        if (!b.includes(brandFilter.toUpperCase())) return false;
      }
      // 3. Filtro por agencia / sucursal
      if (agencyFilter !== 'ALL') {
        const woAgency = getFullAgencyName(wo.agency || wo.tower || '').trim().toLowerCase();
        if (woAgency !== agencyFilter.trim().toLowerCase()) return false;
      }
      // 4. Filtro por clasificación de antigüedad o refacciones
      if (agingFilter === 'with_parts') {
        if (!wo.pendingParts || wo.pendingParts.length === 0) return false;
      } else if (agingFilter === 'over15') {
        const days = daysSince(wo.receivedAt);
        if (days < 15 || days > 30) return false;
      } else if (agingFilter === 'over30') {
        const days = daysSince(wo.receivedAt);
        if (days <= 30 || days > 60) return false;
      } else if (agingFilter === 'over60') {
        const days = daysSince(wo.receivedAt);
        if (days <= 60) return false;
      }
      return true;
    });
  }, [inProgressList, searchTerm, brandFilter, agencyFilter, agingFilter, orderType]);

  // Estadísticas dinámicas según marca, agencia y búsqueda
  const computedStats = useMemo(() => {
    const baseList = inProgressList.filter((wo) => {
      if (!matchesSearch(wo, searchTerm, { includeReportNumber: orderType === 'HYP' })) return false;
      if (brandFilter !== 'ALL') {
        const b = (wo.vehicle?.brand || '').trim().toUpperCase();
        if (!b.includes(brandFilter.toUpperCase())) return false;
      }
      if (agencyFilter !== 'ALL') {
        const woAgency = getFullAgencyName(wo.agency || wo.tower || '').trim().toLowerCase();
        if (woAgency !== agencyFilter.trim().toLowerCase()) return false;
      }
      return true;
    });

    const totalHoy = baseList.length;
    const terminados = baseList.filter((wo) => ['TERMINADO', 'ENTREGADO'].includes(wo.status)).length;
    const porEntregar = baseList.filter((wo) => !['TERMINADO', 'ENTREGADO'].includes(wo.status)).length;
    
    // Indicadores clave de Refacciones Cargadas
    const ordersWithParts = baseList.filter((wo) => wo.pendingParts && wo.pendingParts.length > 0).length;
    const partsAmount = baseList.reduce((acc, wo) => {
      const woSum = wo.pendingParts?.reduce((pSum, p) => pSum + (Number(p.amount) || 0), 0) || 0;
      return acc + woSum;
    }, 0);

    // Clasificaciones de órdenes Rezagadas por Antigüedad
    const activeOrders = baseList.filter((wo) => !['TERMINADO', 'ENTREGADO'].includes(wo.status));
    const ordersOver15 = activeOrders.filter((wo) => {
      const d = daysSince(wo.receivedAt);
      return d >= 15 && d <= 30;
    }).length;

    const ordersOver30 = activeOrders.filter((wo) => {
      const d = daysSince(wo.receivedAt);
      return d > 30 && d <= 60;
    }).length;

    const ordersOver60 = activeOrders.filter((wo) => {
      const d = daysSince(wo.receivedAt);
      return d > 60;
    }).length;

    const rezagados = activeOrders.filter((wo) => daysSince(wo.receivedAt) >= 1).length;

    const baseTotal = brandFilter === 'ALL' && agencyFilter === 'ALL' && !searchTerm.trim() ? (stats?.totalHoy ?? totalHoy) : totalHoy;
    const baseTerminados = brandFilter === 'ALL' && agencyFilter === 'ALL' && !searchTerm.trim() ? (stats?.terminados ?? terminados) : terminados;
    const basePorEntregar = brandFilter === 'ALL' && agencyFilter === 'ALL' && !searchTerm.trim() ? (stats?.porEntregar ?? porEntregar) : porEntregar;

    return {
      totalHoy: baseTotal,
      terminados: baseTerminados,
      porEntregar: basePorEntregar,
      ordersWithParts,
      partsAmount,
      ordersOver15,
      ordersOver30,
      ordersOver60,
      rezagados,
    };
  }, [stats, inProgressList, brandFilter, agencyFilter, searchTerm, orderType]);

  const hasActiveFilters = brandFilter !== 'ALL' || agencyFilter !== 'ALL' || searchTerm.trim().length > 0 || agingFilter !== null;

  return (
    <div className="min-h-screen text-on-surface bg-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col items-center px-margin-desktop py-8">
        
        {/* ENCABEZADO PRINCIPAL DEL MÓDULO Y NAVEGACIÓN POR PESTAÑAS */}
        <div className="w-full mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  {orderType === 'HYP' ? 'car_repair' : 'build'}
                </span>
              </span>
              <div>
                <h1 className="font-headline-lg text-2xl font-black text-primary">
                  {orderType === 'HYP' ? 'Hojalatería y Pintura (HYP)' : 'Servicio Mecánico'}
                </h1>
                <p className="font-body-md text-xs text-on-surface-variant">
                  {orderType === 'HYP'
                    ? 'Control de unidades en hojalatería, pintura, armado y entrega con valuación de aseguradoras.'
                    : 'Control de órdenes en taller, estatus por etapas, asignación técnica y cotizador de paquetes de mantenimiento.'}
                </p>
              </div>
            </div>

            {/* Acciones principales: Nueva Orden y Buscador */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setShowNewOrderModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-label-caps text-xs font-bold text-white shadow-xs hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Nueva Orden de Reparación</span>
              </button>

              {/* Buscador de órdenes discreto y elegante */}
              <div className="relative w-full sm:w-64 md:w-72 shrink-0">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant/70">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    orderType === 'HYP'
                      ? 'Buscar Orden, Placas, VIN, Siniestro...'
                      : 'Buscar Orden, Placas o VIN...'
                  }
                  className="w-full rounded-xl border border-outline-variant bg-white pl-9 pr-8 py-2 text-xs font-medium text-primary shadow-2xs placeholder:text-on-surface-variant/60 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* BARRA DE PESTAÑAS (TABLERO / SEGUIMIENTO / COTIZADOR) Y FILTROS */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-outline-variant w-full pt-1">
            {/* Pestañas a la izquierda */}
            <div className="flex items-center -mb-px overflow-x-auto">
              {/* 1. Tablero / Magnetoplano */}
              <button
                type="button"
                onClick={() => setActiveMainTab('tablero')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-label-caps text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeMainTab === 'tablero'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                {orderType === 'HYP' ? 'Tablero y Agenda de Entregas' : 'Tablero / Magnetoplano'}
              </button>

              {/* 2. Seguimiento de Unidades (Unidades en Proceso y Rezagadas) */}
              <button
                type="button"
                onClick={() => setActiveMainTab('seguimiento')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-label-caps text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeMainTab === 'seguimiento'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {orderType === 'HYP' ? 'car_repair' : 'directions_car'}
                </span>
                Seguimiento de Unidades
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-extrabold text-primary">
                  {inProgressList.length}
                </span>
              </button>

              {/* 3. Cotizador de Mantenimientos (Solo SERVICIO) */}
              {orderType === 'SERVICIO' && (
                <button
                  type="button"
                  onClick={() => setActiveMainTab('cotizador')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 font-label-caps text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    activeMainTab === 'cotizador'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">calculate</span>
                  Cotizador de Mantenimientos
                </button>
              )}
            </div>

            {/* Filtros compactos y discretos (Marca + Agencia + Limpiar) disponibles en Tablero y Seguimiento */}
            {activeMainTab !== 'cotizador' && (
              <div className="flex flex-wrap items-center gap-2 pb-2 lg:pb-1">
                {/* Pills de Marca */}
                <div className="flex items-center gap-1 bg-surface-container/40 p-0.5 rounded-lg border border-outline-variant/60">
                  <button
                    type="button"
                    onClick={() => setBrandFilter('ALL')}
                    className={`rounded-md px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                      brandFilter === 'ALL'
                        ? 'bg-primary text-white shadow-2xs'
                        : 'text-on-surface-variant hover:text-primary hover:bg-white/60'
                    }`}
                  >
                    Todas
                  </button>
                  {availableBrands.map((b) => {
                    const isSelected = brandFilter.toUpperCase() === b.toUpperCase();
                    const countForBrand = inProgressList.filter((wo) =>
                      (wo.vehicle?.brand || '').toUpperCase().includes(b)
                    ).length;

                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBrandFilter(isSelected ? 'ALL' : b)}
                        className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-on-surface-variant hover:text-emerald-700 hover:bg-white/60'
                        }`}
                      >
                        <span>{b}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-on-surface-variant/70'}`}>
                          ({countForBrand})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown de Agencia */}
                <div className="flex items-center gap-1.5 bg-white border border-outline-variant rounded-lg px-2.5 py-1 shadow-2xs">
                  <span className="material-symbols-outlined text-primary text-sm" data-icon="store">
                    store
                  </span>
                  <select
                    value={agencyFilter}
                    onChange={(e) => setAgencyFilter(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-primary focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Todas las agencias ({inProgressList.length})</option>
                    {availableAgencies.map((ag) => {
                      const countForAgency = inProgressList.filter((wo) => {
                        const woAgency = getFullAgencyName(wo.agency || wo.tower || '').trim().toLowerCase();
                        return woAgency === ag.trim().toLowerCase();
                      }).length;

                      return (
                        <option key={ag} value={ag}>
                          {ag} ({countForAgency})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Botón discreto de limpiar filtros */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setBrandFilter('ALL');
                      setAgencyFilter('ALL');
                      setSearchTerm('');
                      setAgingFilter(null);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-error/30 bg-error-container/10 px-2 py-1 text-[11px] font-bold text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                    title="Restablecer todos los filtros"
                  >
                    <span className="material-symbols-outlined text-[13px]">filter_alt_off</span>
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-error bg-error-container/30 px-4 py-3 text-sm text-on-error-container w-full">
            {error}
          </div>
        ) : activeMainTab === 'cotizador' && orderType === 'SERVICIO' ? (
          /* PESTAÑA 3: COTIZADOR DE MANTENIMIENTOS */
          <MaintenanceQuoter />
        ) : activeMainTab === 'tablero' ? (
          /* PESTAÑA 1: TABLERO / MAGNETOPLANO Y CAPACIDAD */
          <div className="w-full space-y-6">
            {/* 1. Tarjetas Superiores: Refacciones y Clasificaciones de Antigüedad */}
            <StatsTiles
              stats={computedStats}
              activeAgingFilter={agingFilter}
              onSelectAgingFilter={(f) => {
                setAgingFilter(f);
                if (f) setActiveMainTab('seguimiento');
              }}
            />

            {/* 2. Magnetoplano de Horas Promesa / Agenda HYP */}
            {showPromiseBoard && (
              <PromiseTimeBoard
                workOrders={filteredList}
                standardHours={standardHours}
                onSelect={setDetailOrder}
                opStats={computedStats}
              />
            )}
            {showDeliveryAgenda && (
              <HypDeliveryAgenda workOrders={filteredList} onSelect={setDetailOrder} />
            )}

            {/* 3. Panel de Capacidad y Mano de Obra (MO) */}
            <CapacityPanel team={orderType} refreshKey={capacityRefreshKey} />
          </div>
        ) : (
          /* PESTAÑA 2: SEGUIMIENTO DE UNIDADES EN PROCESO Y REZAGADAS */
          <div className="w-full space-y-4">
            {filteredList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-12 text-center shadow-xs">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                  search_off
                </span>
                <p className="font-headline-md text-base font-bold text-primary">
                  No se encontraron órdenes con los filtros seleccionados.
                </p>
                <p className="mt-1 font-body-md text-xs text-on-surface-variant">
                  {brandFilter !== 'ALL' ? `Marca: ${brandFilter} • ` : ''}
                  {agencyFilter !== 'ALL' ? `Agencia: ${agencyFilter} • ` : ''}
                  {agingFilter ? `Filtro antigüedad: ${agingFilter} • ` : ''}
                  {searchTerm ? `Búsqueda: "${searchTerm}"` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBrandFilter('ALL');
                    setAgencyFilter('ALL');
                    setSearchTerm('');
                    setAgingFilter(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-label-caps text-xs font-bold text-white hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Mostrar todas las órdenes
                </button>
              </div>
            ) : (
              <InProgressList
                workOrders={filteredList}
                onStatusChanged={handleOrderUpdated}
                onSelect={setDetailOrder}
                orderType={orderType}
                standardHours={standardHours}
              />
            )}
          </div>
        )}
      </main>

      {/* Modal de Detalle de Etapas y Seguimiento */}
      {detailOrder && (
        <OrderStageDetailModal
          workOrder={detailOrder}
          onClose={() => setDetailOrder(null)}
          onUpdated={handleDetailOrderUpdated}
          standardHours={standardHours}
        />
      )}

      {/* Modal para Crear Nueva Orden de Reparación (SIA NXT) */}
      {showNewOrderModal && (
        <NewWorkOrderModal
          orderType={orderType}
          onClose={() => setShowNewOrderModal(false)}
          onCreated={() => {
            handleOrderUpdated();
            setShowNewOrderModal(false);
          }}
        />
      )}
    </div>
  );
}

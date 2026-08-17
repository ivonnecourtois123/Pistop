import { useCallback, useEffect, useMemo, useState } from 'react';
import TopNavBar from '../layout/TopNavBar.jsx';
import SearchBar from './SearchBar.jsx';
import StatsTiles from './StatsTiles.jsx';
import CapacityPanel from './CapacityPanel.jsx';
import InProgressList from './InProgressList.jsx';
import PromiseTimeBoard from './PromiseTimeBoard.jsx';
import HypDeliveryAgenda from './HypDeliveryAgenda.jsx';
import OrderStageDetailModal from './OrderStageDetailModal.jsx';
import Spinner from '../common/Spinner.jsx';
import MiddayCutoffFilter, { filterMiddayCutoff, SAFE_STAGES } from './MiddayCutoffFilter.jsx';
import { getTodayStats, getInProgressWorkOrders } from '../../api/workOrders.js';
import { getServiceCategoryHours } from '../../api/capacity.js';

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

// Compartido por Servicio y HYP: mismos tiles/lista/modal, solo cambia `orderType` (qué se
// carga) y `showPromiseBoard` — el magnetoplano de horas de entrega no aplica a HYP, cuyas
// órdenes se miden en días, no en horas de cita.
export default function WorkOrderTypeDashboard({ orderType, showPromiseBoard, showDeliveryAgenda, showMiddayCutoff }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [inProgressList, setInProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailOrder, setDetailOrder] = useState(null);
  const [capacityRefreshKey, setCapacityRefreshKey] = useState(0);
  const [middayCutoffActive, setMiddayCutoffActive] = useState(false);
  // Horas estándar por tipo de servicio: alimentan el semáforo de avance. Se cargan una sola
  // vez (son configuración del taller, no cambian durante la jornada).
  const [standardHours, setStandardHours] = useState(null);

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
      // Si falla, el semáforo se queda en gris ("sin tiempo estándar") en vez de tumbar el
      // tablero: es un indicador de apoyo, no el dato principal de la pantalla.
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

  const filteredList = useMemo(
    () => inProgressList.filter((wo) => matchesSearch(wo, searchTerm, { includeReportNumber: orderType === 'HYP' })),
    [inProgressList, searchTerm, orderType]
  );

  const middayList = useMemo(
    () => (middayCutoffActive ? filterMiddayCutoff(filteredList) : filteredList),
    [filteredList, middayCutoffActive]
  );
  const middayAtRiskCount = useMemo(
    () => (middayCutoffActive ? middayList.filter((wo) => !SAFE_STAGES.includes(wo.status)).length : 0),
    [middayList, middayCutoffActive]
  );

  return (
    <div className="min-h-screen text-on-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col items-center px-margin-desktop py-12">
        <SearchBar value={searchTerm} onChange={setSearchTerm} showReportMode={orderType === 'HYP'} />

        {showPromiseBoard && <PromiseTimeBoard workOrders={filteredList} standardHours={standardHours} />}
        {showDeliveryAgenda && <HypDeliveryAgenda workOrders={filteredList} />}

        <div className="grid w-full grid-cols-1 gap-gutter">
          {error && (
            <div className="rounded border border-error bg-error-container/30 px-4 py-3 text-sm text-on-error-container">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : (
            <>
              <StatsTiles stats={stats} />
              <CapacityPanel team={orderType} refreshKey={capacityRefreshKey} />

              {showMiddayCutoff && (
                <MiddayCutoffFilter
                  active={middayCutoffActive}
                  onToggle={() => setMiddayCutoffActive((v) => !v)}
                  count={middayList.length}
                  atRiskCount={middayAtRiskCount}
                />
              )}

              {searchTerm.trim() && middayList.length === 0 ? (
                <p className="py-8 text-center font-body-md text-on-surface-variant">
                  No se encontraron unidades en proceso que coincidan con &quot;{searchTerm}&quot;.
                </p>
              ) : (
                <InProgressList
                  workOrders={middayList}
                  onStatusChanged={handleOrderUpdated}
                  onSelect={setDetailOrder}
                  orderType={orderType}
                  atRiskStages={middayCutoffActive ? SAFE_STAGES : null}
                  standardHours={standardHours}
                />
              )}
            </>
          )}
        </div>
      </main>

      {detailOrder && (
        <OrderStageDetailModal
          workOrder={detailOrder}
          onClose={() => setDetailOrder(null)}
          onUpdated={handleDetailOrderUpdated}
          standardHours={standardHours}
        />
      )}
    </div>
  );
}

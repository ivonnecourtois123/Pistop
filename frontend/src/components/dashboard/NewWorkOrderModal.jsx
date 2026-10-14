import { useEffect, useState } from 'react';
import { createWorkOrder } from '../../api/workOrders.js';
import { listVehicles } from '../../api/vehicles.js';
import { listTechnicians } from '../../api/technicians.js';
import { getServiceCategoryHours } from '../../api/capacity.js';
import { DEFAULT_AGENCIES } from '../../constants/immobilized.js';
import { formatServiceCategoryLabel } from '../../constants/priority.js';

function nowPlusHoursDatetimeLocal(hours = 3) {
  const d = new Date(Date.now() + hours * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
}

export default function NewWorkOrderModal({ orderType = 'SERVICIO', onClose, onCreated }) {
  const isHyp = orderType === 'HYP';

  // Modo de selección de vehículo: 'existing' | 'new'
  const [vehicleMode, setVehicleMode] = useState('new');
  const [vehicles, setVehicles] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Campos de la Orden
  const [orderNumber, setOrderNumber] = useState('');
  const [agency, setAgency] = useState(DEFAULT_AGENCIES[0] || 'Tuxtla Poniente');
  const [serviceType, setServiceType] = useState(isHyp ? 'Hojalatería y Pintura General' : 'Mantenimiento Preventivo');
  const [serviceCategory, setServiceCategory] = useState(isHyp ? null : '');
  const [categoryList, setCategoryList] = useState([]);
  const [technicianId, setTechnicianId] = useState('');
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState(nowPlusHoursDatetimeLocal(3));
  const [notes, setNotes] = useState('');

  // Banderas operativas
  const [customerWaiting, setCustomerWaiting] = useState(false);
  const [washNeeded, setWashNeeded] = useState(true);
  const [diagnosisNeeded, setDiagnosisNeeded] = useState(false);
  const [partsNeeded, setPartsNeeded] = useState(false);

  // Campos HYP
  const [insurer, setInsurer] = useState('');
  const [reportNumber, setReportNumber] = useState('');

  // Vehículo existente
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Vehículo nuevo
  const [newBrand, setNewBrand] = useState('NISSAN');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newColor, setNewColor] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newVin, setNewVin] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      listVehicles().catch(() => []),
      listTechnicians().catch(() => []),
      getServiceCategoryHours().catch(() => []),
    ])
      .then(([vList, tList, cList]) => {
        setVehicles(vList);
        if (vList.length > 0) setSelectedVehicleId(vList[0].id);

        // Filtrar técnicos por equipo
        const filteredTechs = tList.filter((t) => t.team === orderType && t.active);
        setTechnicians(filteredTechs);

        setCategoryList(cList || []);
        if (!isHyp && cList && cList.length > 0) {
          setServiceCategory((prev) => prev || cList[0].category);
        }
      })
      .finally(() => setLoadingInitial(false));
  }, [orderType, isHyp]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        orderType,
        orderNumber: orderNumber.trim() || undefined,
        agency: agency.trim() || undefined,
        serviceType: serviceType.trim() || undefined,
        serviceCategory: !isHyp ? serviceCategory : undefined,
        technicianId: technicianId || undefined,
        estimatedDeliveryAt: estimatedDeliveryAt ? new Date(estimatedDeliveryAt).toISOString() : undefined,
        customerWaiting,
        washNeeded,
        diagnosisNeeded,
        partsNeeded,
        insurer: isHyp ? insurer.trim() || undefined : undefined,
        reportNumber: isHyp ? reportNumber.trim() || undefined : undefined,
        notes: notes.trim() || undefined,
      };

      if (vehicleMode === 'existing') {
        if (!selectedVehicleId) throw new Error('Selecciona un vehículo existente de la lista.');
        payload.vehicleId = selectedVehicleId;
      } else {
        if (!newBrand.trim() || !newModel.trim() || !newPlate.trim()) {
          throw new Error('Completa la Marca, Modelo y Placas del vehículo.');
        }
        payload.vehicle = {
          brand: newBrand.trim(),
          model: newModel.trim(),
          year: newYear ? Number(newYear) : undefined,
          color: newColor.trim() || undefined,
          plate: newPlate.trim(),
          vin: newVin.trim() || undefined,
          customerName: newCustomerName.trim() || 'Cliente Mostrador',
          customerPhone: newCustomerPhone.trim() || undefined,
        };
      }

      const created = await createWorkOrder(payload);
      onCreated(created);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'No se pudo crear la orden de trabajo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="my-8 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="mb-5 flex items-start justify-between border-b border-outline-variant/60 pb-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">
                {isHyp ? 'car_repair' : 'post_add'}
              </span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-lg text-lg font-black text-primary">
                  Crear Orden de Reparación (SIA NXT)
                </h2>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-label-caps text-[10px] font-black text-primary">
                  {orderType}
                </span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant">
                Captura de orden de taller con asignación, tiempos y datos de vehículo compatibles con SIA NXT.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-primary cursor-pointer transition-colors"
          >
            close
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-error bg-error-container/20 p-3 text-xs font-semibold text-on-error-container">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECCIÓN 1: DATOS DE LA ORDEN */}
          <div className="rounded-xl border border-outline-variant/70 bg-surface-container/20 p-4 space-y-3">
            <p className="font-label-caps text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              1. Datos de la Orden & Folio
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Número de Orden */}
              <div>
                <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                  # DE ORDEN / FOLIO SIA NXT
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="Ej. WO-9501 (Auto si vacío)"
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-data-mono text-xs font-bold text-primary focus:border-primary focus:outline-none"
                />
              </div>

              {/* Agencia */}
              <div>
                <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                  AGENCIA / SUCURSAL
                </label>
                <select
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-xs font-semibold text-primary focus:border-primary focus:outline-none cursor-pointer"
                >
                  {DEFAULT_AGENCIES.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clasificación (Servicio) o Aseguradora (HYP) */}
              {!isHyp ? (
                <div>
                  <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                    CLASIFICACIÓN DE TALLER
                  </label>
                  <select
                    value={serviceCategory || ''}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-xs font-semibold text-primary focus:border-primary focus:outline-none cursor-pointer"
                  >
                    {categoryList.length === 0 ? (
                      <option value="">Sin tipos de servicio configurados</option>
                    ) : (
                      categoryList.map((c) => (
                        <option key={c.category} value={c.category}>
                          {formatServiceCategoryLabel(c.category)} ({c.hours}h)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                    ASEGURADORA (HYP)
                  </label>
                  <input
                    type="text"
                    value={insurer}
                    onChange={(e) => setInsurer(e.target.value)}
                    placeholder="Ej. Qualitas, GNP, AXA"
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-xs font-semibold text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Tipo de Servicio libre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                  DESCRIPCIÓN DEL SERVICIO SOLICITADO
                </label>
                <input
                  type="text"
                  required
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="Ej. Servicio 10,000 km + Alineación y Balanceo"
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-xs text-primary focus:border-primary focus:outline-none"
                />
              </div>

              {isHyp && (
                <div>
                  <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                    NÚMERO DE REPORTE / SINIESTRO
                  </label>
                  <input
                    type="text"
                    value={reportNumber}
                    onChange={(e) => setReportNumber(e.target.value)}
                    placeholder="Ej. 0423184920"
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-data-mono text-xs text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: VEHÍCULO Y CLIENTE */}
          <div className="rounded-xl border border-outline-variant/70 bg-surface-container/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-label-caps text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">directions_car</span>
                2. Vehículo & Cliente
              </p>

              {/* Selector de modo */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-outline-variant shadow-2xs">
                <button
                  type="button"
                  onClick={() => setVehicleMode('new')}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                    vehicleMode === 'new'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Captura Rápida
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleMode('existing')}
                  className={`rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                    vehicleMode === 'existing'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Seleccionar Catálogo
                </button>
              </div>
            </div>

            {vehicleMode === 'existing' ? (
              <div>
                <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                  SELECCIONAR VEHÍCULO EXISTENTE
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2.5 font-body-md text-xs font-semibold text-primary focus:border-primary focus:outline-none cursor-pointer"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} {v.year ? `(${v.year}) ` : ''}— Placas: {v.plate} — Cliente: {v.customer?.name || 'S/N'}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      MARCA *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value.toUpperCase())}
                      placeholder="NISSAN"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-body-md text-xs font-bold text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      MODELO *
                    </label>
                    <input
                      type="text"
                      required
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      placeholder="Versa Sense"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-body-md text-xs font-semibold text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      PLACAS *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPlate}
                      onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                      placeholder="DSH-102-A"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-data-mono text-xs font-bold text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      AÑO
                    </label>
                    <input
                      type="number"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-data-mono text-xs text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      VIN / SERIE (OPCIONAL)
                    </label>
                    <input
                      type="text"
                      value={newVin}
                      onChange={(e) => setNewVin(e.target.value.toUpperCase())}
                      placeholder="3N1AB7AP5KL..."
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-data-mono text-xs text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      NOMBRE DEL CLIENTE
                    </label>
                    <input
                      type="text"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-body-md text-xs text-primary focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-label-caps text-[9px] font-bold text-on-surface-variant uppercase">
                      TELÉFONO DE CONTACTO
                    </label>
                    <input
                      type="text"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      placeholder="961 123 4567"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-data-mono text-xs text-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 3: ASIGNACIÓN Y PROMESA DE ENTREGA */}
          <div className="rounded-xl border border-outline-variant/70 bg-surface-container/20 p-4 space-y-3">
            <p className="font-label-caps text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">schedule</span>
              3. Asignación Técnica & Hora Promesa
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                  TÉCNICO ASIGNADO
                </label>
                <select
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-xs font-semibold text-primary focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="">Sin asignar (Asignar más tarde)</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      👨‍🔧 {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
                  FECHA Y HORA PROMESA DE ENTREGA
                </label>
                <input
                  type="datetime-local"
                  required
                  value={estimatedDeliveryAt}
                  onChange={(e) => setEstimatedDeliveryAt(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-data-mono text-xs font-bold text-primary focus:border-primary focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Banderas operativas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-outline-variant/40">
              <label className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={customerWaiting}
                  onChange={(e) => setCustomerWaiting(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span>⏱️ Cliente espera</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={washNeeded}
                  onChange={(e) => setWashNeeded(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span>🚗 Requiere lavado</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={diagnosisNeeded}
                  onChange={(e) => setDiagnosisNeeded(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span>🔍 Requiere diag.</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={partsNeeded}
                  onChange={(e) => setPartsNeeded(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span>⚙️ Refacciones</span>
              </label>
            </div>
          </div>

          {/* SECCIÓN 4: NOTAS */}
          <div>
            <label className="mb-1 block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">
              NOTAS / OBSERVACIONES INICIALES
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones del asesor, detalles del cliente o requerimientos de taller..."
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-body-md text-xs text-primary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 border-t border-outline-variant/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-4 py-2 font-label-caps text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 font-label-caps text-xs font-bold text-white hover:bg-primary/90 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                {submitting ? 'hourglass_top' : 'check'}
              </span>
              <span>{submitting ? 'Creando Orden...' : 'Crear Orden de Reparación'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { listVehicles, createVehicle } from '../../api/vehicles.js';
import { listCustomers, createCustomer } from '../../api/customers.js';
import { listTechnicians } from '../../api/technicians.js';
import { createWorkOrder } from '../../api/workOrders.js';

const EMPTY_NEW_VEHICLE = {
  customerId: '',
  newCustomerName: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  plate: '',
  vin: '',
};

export default function NewWorkOrderModal({ onClose, onCreated }) {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [useExistingVehicle, setUseExistingVehicle] = useState(true);
  const [vehicleId, setVehicleId] = useState('');
  const [newVehicle, setNewVehicle] = useState(EMPTY_NEW_VEHICLE);
  const [technicianId, setTechnicianId] = useState('');
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listVehicles(), listCustomers(), listTechnicians()])
      .then(([vehicleList, customerList, technicianList]) => {
        setVehicles(vehicleList);
        setCustomers(customerList);
        setTechnicians(technicianList);
        if (vehicleList.length > 0) setVehicleId(vehicleList[0].id);
      })
      .catch(() => setError('No se pudieron cargar los catálogos.'))
      .finally(() => setLoadingOptions(false));
  }, []);

  function updateNewVehicle(field, value) {
    setNewVehicle((prev) => ({ ...prev, [field]: value }));
  }

  async function resolveVehicleId() {
    if (useExistingVehicle) {
      if (!vehicleId) throw new Error('Selecciona un vehículo');
      return vehicleId;
    }

    let customerId = newVehicle.customerId;
    if (!customerId) {
      if (!newVehicle.newCustomerName.trim()) {
        throw new Error('Indica el nombre del cliente');
      }
      const customer = await createCustomer({ name: newVehicle.newCustomerName.trim() });
      customerId = customer.id;
    }

    const vehicle = await createVehicle({
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: Number(newVehicle.year),
      color: newVehicle.color,
      plate: newVehicle.plate,
      vin: newVehicle.vin,
      customerId,
    });
    return vehicle.id;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const resolvedVehicleId = await resolveVehicleId();
      const workOrder = await createWorkOrder({
        vehicleId: resolvedVehicleId,
        technicianId: technicianId || undefined,
        estimatedDeliveryAt: estimatedDeliveryAt || undefined,
        notes: notes || undefined,
      });
      onCreated(workOrder);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'No se pudo crear la orden de trabajo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-container-lowest p-card-padding shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline-lg text-headline-lg text-primary">Nueva Orden de Trabajo</h2>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high"
            data-icon="close"
          >
            close
          </button>
        </div>

        {loadingOptions ? (
          <p className="text-on-surface-variant">Cargando catálogos...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded border border-error bg-error-container/40 px-4 py-2 text-sm text-on-error-container">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUseExistingVehicle(true)}
                className={`flex-1 rounded-lg border px-4 py-2 font-label-caps text-label-caps ${
                  useExistingVehicle ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-primary'
                }`}
              >
                Vehículo existente
              </button>
              <button
                type="button"
                onClick={() => setUseExistingVehicle(false)}
                className={`flex-1 rounded-lg border px-4 py-2 font-label-caps text-label-caps ${
                  !useExistingVehicle ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-primary'
                }`}
              >
                Vehículo nuevo
              </button>
            </div>

            {useExistingVehicle ? (
              <label className="block">
                <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">VEHÍCULO</span>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
                >
                  {vehicles.length === 0 && <option value="">No hay vehículos registrados</option>}
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} {v.year} — {v.plate} ({v.customer?.name})
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="space-y-4 rounded-lg border border-outline-variant p-4">
                <label className="block">
                  <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">CLIENTE</span>
                  <select
                    value={newVehicle.customerId}
                    onChange={(e) => updateNewVehicle('customerId', e.target.value)}
                    className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  >
                    <option value="">+ Nuevo cliente</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                {!newVehicle.customerId && (
                  <label className="block">
                    <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                      NOMBRE DEL CLIENTE
                    </span>
                    <input
                      value={newVehicle.newCustomerName}
                      onChange={(e) => updateNewVehicle('newCustomerName', e.target.value)}
                      className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                      placeholder="Ricardo Morales"
                    />
                  </label>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    value={newVehicle.brand}
                    onChange={(e) => updateNewVehicle('brand', e.target.value)}
                    placeholder="Marca (Nissan)"
                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  />
                  <input
                    required
                    value={newVehicle.model}
                    onChange={(e) => updateNewVehicle('model', e.target.value)}
                    placeholder="Modelo (Sentra)"
                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  />
                  <input
                    required
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => updateNewVehicle('year', e.target.value)}
                    placeholder="Año"
                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  />
                  <input
                    required
                    value={newVehicle.color}
                    onChange={(e) => updateNewVehicle('color', e.target.value)}
                    placeholder="Color"
                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  />
                  <input
                    required
                    value={newVehicle.plate}
                    onChange={(e) => updateNewVehicle('plate', e.target.value.toUpperCase())}
                    placeholder="Placas (ABC-1234)"
                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  />
                  <input
                    required
                    value={newVehicle.vin}
                    onChange={(e) => updateNewVehicle('vin', e.target.value.toUpperCase())}
                    placeholder="VIN"
                    className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
                  />
                </div>
              </div>
            )}

            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">TÉCNICO</span>
              <select
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
              >
                <option value="">Sin asignar</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                ENTREGA ESTIMADA
              </span>
              <input
                type="datetime-local"
                value={estimatedDeliveryAt}
                onChange={(e) => setEstimatedDeliveryAt(e.target.value)}
                className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">NOTAS</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
                placeholder="Diagnóstico inicial, síntomas reportados por el cliente..."
              />
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 font-headline-md text-primary hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-secondary-container px-6 py-2 font-headline-md text-on-secondary-container hover:bg-secondary-container/90 disabled:opacity-60"
              >
                {submitting ? 'Creando...' : 'Crear Orden'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

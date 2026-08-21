import { useEffect, useState } from 'react';
import { listVehicles, createVehicle } from '../../api/vehicles.js';
import { listCustomers, createCustomer } from '../../api/customers.js';

export const EMPTY_VEHICLE_DRAFT = {
  mode: 'existing', // 'existing' | 'new'
  vehicleId: '',
  newVehicle: {
    customerId: '',
    newCustomerName: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    plate: '',
    vin: '',
  },
};

// Resuelve el draft a un vehicleId real: si es "nuevo", asocia al cliente "Inventario Agencia"
// (unidades nuevas de stock de la agencia) y crea el vehículo.
export async function resolveVehicleId(draft) {
  if (draft.mode === 'existing') {
    if (!draft.vehicleId) throw new Error('Selecciona un vehículo');
    return draft.vehicleId;
  }

  const { newVehicle } = draft;
  let customerId = newVehicle.customerId;
  if (!customerId) {
    const customers = await listCustomers();
    const existingInv = customers.find((c) => c.name.toLowerCase().includes('inventario'));
    if (existingInv) {
      customerId = existingInv.id;
    } else {
      const customer = await createCustomer({ name: 'Inventario Agencia' });
      customerId = customer.id;
    }
  }

  const vehicle = await createVehicle({
    brand: newVehicle.brand,
    model: newVehicle.model,
    year: newVehicle.year ? Number(newVehicle.year) : undefined,
    color: newVehicle.color || undefined,
    plate: newVehicle.plate,
    vin: newVehicle.vin,
    customerId,
  });
  return vehicle.id;
}

export default function VehiclePicker({ draft, onChange }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listVehicles()
      .then((vehicleList) => {
        setVehicles(vehicleList);
        if (vehicleList.length > 0 && !draft.vehicleId) {
          onChange({ ...draft, vehicleId: vehicleList[0].id });
        }
      })
      .catch(() => setError('No se pudo cargar el catálogo de vehículos.'))
      .finally(() => setLoading(false));
    // Solo se carga una vez al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setMode(mode) {
    onChange({ ...draft, mode });
  }

  function updateNewVehicle(field, value) {
    onChange({ ...draft, newVehicle: { ...draft.newVehicle, [field]: value } });
  }

  if (loading) return <p className="text-on-surface-variant">Cargando vehículos...</p>;

  return (
    <div>
      {error && <p className="mb-2 text-sm text-error">{error}</p>}

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('existing')}
          className={`flex-1 rounded-lg border px-4 py-2 font-label-caps text-label-caps ${
            draft.mode === 'existing' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-primary'
          }`}
        >
          Vehículo existente
        </button>
        <button
          type="button"
          onClick={() => setMode('new')}
          className={`flex-1 rounded-lg border px-4 py-2 font-label-caps text-label-caps ${
            draft.mode === 'new' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-primary'
          }`}
        >
          Vehículo nuevo (Inventario)
        </button>
      </div>

      {draft.mode === 'existing' ? (
        <select
          value={draft.vehicleId}
          onChange={(e) => onChange({ ...draft, vehicleId: e.target.value })}
          className="block w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-body-md text-primary"
        >
          {vehicles.length === 0 && <option value="">No hay vehículos registrados</option>}
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} {v.year ? `${v.year} ` : ''}— {v.plate}
            </option>
          ))}
        </select>
      ) : (
        <div className="space-y-3 rounded-lg border border-outline-variant p-4">

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              value={draft.newVehicle.brand}
              onChange={(e) => updateNewVehicle('brand', e.target.value)}
              placeholder="Marca (Nissan)"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
            />
            <input
              required
              value={draft.newVehicle.model}
              onChange={(e) => updateNewVehicle('model', e.target.value)}
              placeholder="Modelo (Sentra)"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
            />
            <input
              type="number"
              value={draft.newVehicle.year}
              onChange={(e) => updateNewVehicle('year', e.target.value)}
              placeholder="Año"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
            />
            <input
              value={draft.newVehicle.color}
              onChange={(e) => updateNewVehicle('color', e.target.value)}
              placeholder="Color"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
            />
            <input
              required
              value={draft.newVehicle.plate}
              onChange={(e) => updateNewVehicle('plate', e.target.value.toUpperCase())}
              placeholder="Placas (ABC-1234)"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
            />
            <input
              required
              value={draft.newVehicle.vin}
              onChange={(e) => updateNewVehicle('vin', e.target.value.toUpperCase())}
              placeholder="VIN"
              className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-body-md text-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}

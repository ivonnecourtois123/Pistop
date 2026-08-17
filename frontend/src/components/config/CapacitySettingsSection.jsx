import { useEffect, useState } from 'react';
import {
  getCapacitySettings,
  updateCapacitySettings,
  getServiceCategoryHours,
  updateServiceCategoryHours,
} from '../../api/capacity.js';
import { SERVICE_CATEGORY_LABEL } from '../../constants/priority.js';

function NumberField({ label, value, onChange, step = '1' }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-on-surface-variant">
      {label}
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 rounded border border-outline-variant bg-white px-2 py-1 font-body-md text-primary"
      />
    </label>
  );
}

export default function CapacitySettingsSection() {
  const [servicio, setServicio] = useState(null);
  const [hyp, setHyp] = useState(null);
  const [categoryHours, setCategoryHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    Promise.all([getCapacitySettings('SERVICIO'), getCapacitySettings('HYP'), getServiceCategoryHours()]).then(
      ([servicioData, hypData, hoursData]) => {
        setServicio(servicioData ?? { hoursPerDay: 8, efficiency: 1, productivity: 1 });
        setHyp(hypData ?? { unitsPerTechnician: 1 });
        setCategoryHours(hoursData);
        setLoading(false);
      }
    );
  }, []);

  async function handleSaveServicio() {
    setSavingKey('SERVICIO');
    try {
      const saved = await updateCapacitySettings('SERVICIO', {
        hoursPerDay: Number(servicio.hoursPerDay),
        efficiency: Number(servicio.efficiency),
        productivity: Number(servicio.productivity),
      });
      setServicio(saved);
    } finally {
      setSavingKey(null);
    }
  }

  async function handleSaveHyp() {
    setSavingKey('HYP');
    try {
      const saved = await updateCapacitySettings('HYP', {
        unitsPerTechnician: Number(hyp.unitsPerTechnician),
      });
      setHyp(saved);
    } finally {
      setSavingKey(null);
    }
  }

  function updateCategoryLocal(category, hours) {
    setCategoryHours((prev) => prev.map((c) => (c.category === category ? { ...c, hours } : c)));
  }

  async function handleSaveCategory(category) {
    const row = categoryHours.find((c) => c.category === category);
    setSavingKey(category);
    try {
      await updateServiceCategoryHours(category, Number(row.hours));
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) return <p className="text-on-surface-variant">Cargando capacidad...</p>;

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-card-padding card-elevation">
      <h2 className="mb-1 font-headline-md text-headline-md text-primary">Capacidad instalada</h2>
      <p className="mb-4 text-sm text-on-surface-variant">
        Define cómo se calcula la capacidad de cada módulo frente a la demanda de órdenes en proceso.
      </p>

      <div className="mb-6 border-b border-outline-variant pb-6">
        <h3 className="mb-3 font-label-caps text-[11px] text-on-surface-variant">SERVICIO (horas/día)</h3>
        <div className="flex flex-wrap items-end gap-4">
          <NumberField
            label="Horas/día por técnico"
            value={servicio.hoursPerDay ?? ''}
            onChange={(v) => setServicio((s) => ({ ...s, hoursPerDay: v }))}
          />
          <NumberField
            label="Eficiencia (0–1)"
            step="0.05"
            value={servicio.efficiency ?? ''}
            onChange={(v) => setServicio((s) => ({ ...s, efficiency: v }))}
          />
          <NumberField
            label="Productividad (0–1)"
            step="0.05"
            value={servicio.productivity ?? ''}
            onChange={(v) => setServicio((s) => ({ ...s, productivity: v }))}
          />
          <button
            type="button"
            onClick={handleSaveServicio}
            disabled={savingKey === 'SERVICIO'}
            className="rounded border border-primary px-3 py-1.5 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-outline-variant pb-6">
        <h3 className="mb-3 font-label-caps text-[11px] text-on-surface-variant">HYP (cupo de unidades)</h3>
        <div className="flex flex-wrap items-end gap-4">
          <NumberField
            label="Unidades simultáneas por técnico"
            value={hyp.unitsPerTechnician ?? ''}
            onChange={(v) => setHyp((h) => ({ ...h, unitsPerTechnician: v }))}
          />
          <button
            type="button"
            onClick={handleSaveHyp}
            disabled={savingKey === 'HYP'}
            className="rounded border border-primary px-3 py-1.5 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-label-caps text-[11px] text-on-surface-variant">
          HORAS ESTÁNDAR POR TIPO DE SERVICIO (Servicio)
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          {categoryHours.map((c) => (
            <div key={c.category} className="flex items-end gap-2">
              <NumberField
                label={SERVICE_CATEGORY_LABEL[c.category] || c.category}
                step="0.25"
                value={c.hours}
                onChange={(v) => updateCategoryLocal(c.category, v)}
              />
              <button
                type="button"
                onClick={() => handleSaveCategory(c.category)}
                disabled={savingKey === c.category}
                className="rounded border border-primary px-3 py-1.5 font-label-caps text-[11px] text-primary hover:bg-primary hover:text-on-primary disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

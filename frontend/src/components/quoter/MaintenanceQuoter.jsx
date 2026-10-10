import { useState, useMemo } from 'react';
import {
  SUPPORTED_BRANDS,
  BRAND_MODELS,
  MILEAGE_INTERVALS,
  UPSELL_SERVICES,
  getMaintenancePackages,
} from '../../constants/maintenancePackages.js';
import { DEFAULT_AGENCIES } from '../../constants/immobilized.js';
import QuotationPrintModal from './QuotationPrintModal.jsx';

export default function MaintenanceQuoter() {
  // Inputs del Asesor
  const [brand, setBrand] = useState('NISSAN');
  const [modelId, setModelId] = useState('march_versa_n17');
  const [year, setYear] = useState('2024');
  const [mileage, setMileage] = useState(10000);
  const [customMileage, setCustomMileage] = useState('');
  const [agency, setAgency] = useState('Tuxtla Poniente');
  const [clientName, setClientName] = useState('');
  const [plate, setPlate] = useState('');
  const [advisorName, setAdvisorName] = useState('Asesor de Servicio');

  // Paquete seleccionado y opcionales
  const [selectedPackageId, setSelectedPackageId] = useState('recommended');
  const [selectedUpsellIds, setSelectedUpsellIds] = useState(['alineacion_balanceo']);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showExcelStructureModal, setShowExcelStructureModal] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);

  // Modelos según la marca activa
  const models = BRAND_MODELS[brand] || [];
  const activeModel = models.find((m) => m.id === modelId) || models[0];

  // Cambio de marca actualiza el modelo por defecto
  function handleBrandChange(newBrand) {
    setBrand(newBrand);
    const newModels = BRAND_MODELS[newBrand] || [];
    if (newModels.length > 0) {
      setModelId(newModels[0].id);
    }
  }

  // Kilometraje efectivo
  const effectiveMileage = useMemo(() => {
    if (customMileage && !isNaN(parseInt(customMileage, 10))) {
      return parseInt(customMileage, 10);
    }
    return mileage;
  }, [customMileage, mileage]);

  // Obtener los 3 paquetes generados para este vehículo y kilometraje
  const packages = useMemo(() => {
    return getMaintenancePackages(brand, activeModel?.id, effectiveMileage);
  }, [brand, activeModel, effectiveMileage]);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) || packages[1] || packages[0];

  // Servicios opcionales seleccionados
  const selectedUpsells = useMemo(() => {
    return UPSELL_SERVICES.filter((u) => selectedUpsellIds.includes(u.id));
  }, [selectedUpsellIds]);

  // Cálculos totales
  const totalCalculations = useMemo(() => {
    const upsellsParts = selectedUpsells.reduce((acc, u) => acc + u.partsPrice, 0);
    const upsellsLabor = selectedUpsells.reduce((acc, u) => acc + u.laborPrice, 0);

    const partsSubtotal = selectedPackage.partsSubtotal + upsellsParts;
    const laborSubtotal = selectedPackage.laborSubtotal + upsellsLabor;
    const subtotal = partsSubtotal + laborSubtotal;
    
    // Si el paquete ya tiene su total oficial asignado (como en matriz CHESA Nissan)
    const baseTotal = selectedPackage.total || subtotal;
    const total = baseTotal + upsellsParts + upsellsLabor;
    const iva = selectedPackage.iva || Math.round((subtotal) * 0.16);

    return {
      partsSubtotal,
      laborSubtotal,
      subtotal,
      iva,
      total,
      upsellsParts,
      upsellsLabor,
    };
  }, [selectedPackage, selectedUpsells]);

  function toggleUpsell(id) {
    setSelectedUpsellIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleQuickCopy() {
    const text = `🚗 Cotización Mantenimiento: ${brand} ${activeModel?.name} (${effectiveMileage.toLocaleString()} km)
✨ Paquete: ${selectedPackage.name}
💰 Total: $${totalCalculations.total.toLocaleString()} MXN (IVA Incluido)
⏱️ Tiempo: ${selectedPackage.timeEstimate}
📍 Grupo Prosur — ${agency}`;
    navigator.clipboard.writeText(text);
    setCopiedQuick(true);
    setTimeout(() => setCopiedQuick(false), 2500);
  }

  return (
    <div className="w-full space-y-6">
      {/* SECCIÓN 1: SELECTOR DE VEHÍCULO Y KILOMETRAJE */}
      <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-outline-variant/60 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-headline-md text-sm font-bold text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">
                1
              </span>
              Datos del Vehículo y Kilometraje
            </h3>

            {/* Selector visual de Marca con check */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-outline-variant/60">
              {SUPPORTED_BRANDS.map((b) => {
                const isSel = brand === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBrandChange(b)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                      isSel
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isSel ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowExcelStructureModal(true)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
            title="Ver catálogo y estructura oficial"
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">table_chart</span>
            Catálogo Excel
          </button>
        </div>

        {/* 1.1 Grid de Modelo, Año, Agencia y Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
              Modelo:
            </label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-3 py-2 text-xs font-bold text-primary focus:border-primary focus:outline-none shadow-2xs"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.engine})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
              Año del Modelo:
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-3 py-2 text-xs font-semibold text-primary focus:border-primary focus:outline-none shadow-2xs"
            >
              {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017 y anteriores'].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
              Agencia / Sucursal:
            </label>
            <select
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-3 py-2 text-xs font-semibold text-primary focus:border-primary focus:outline-none shadow-2xs"
            >
              {DEFAULT_AGENCIES.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
              Placas / Nombre Cliente (Opcional):
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej. Juan Pérez (DSB-452-A)"
              className="w-full rounded-xl border border-outline-variant bg-white px-3 py-2 text-xs text-primary focus:border-primary focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* 1.3 Selector de Kilometraje */}
        <div className="space-y-2 pt-2 border-t border-outline-variant/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="font-label-caps text-xs font-bold text-on-surface-variant uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-base">speed</span>
              Kilometraje del Mantenimiento:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">O ingresar kilometraje exacto:</span>
              <input
                type="number"
                value={customMileage}
                onChange={(e) => setCustomMileage(e.target.value)}
                placeholder="Ej. 45000"
                className="w-28 rounded-lg border border-outline-variant bg-slate-50 px-2.5 py-1 text-xs font-data-mono font-bold text-primary focus:bg-white focus:border-primary focus:outline-none"
              />
              <span className="text-xs font-data-mono text-on-surface-variant font-bold">km</span>
            </div>
          </div>

          {/* Quick pills for standard maintenance intervals */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {MILEAGE_INTERVALS.map((int) => {
              const isSelected = !customMileage && mileage === int.km;
              const isMajor = int.type.includes('Mayor');

              return (
                <button
                  key={int.km}
                  type="button"
                  onClick={() => {
                    setCustomMileage('');
                    setMileage(int.km);
                  }}
                  className={`flex flex-col items-start rounded-xl border px-3 py-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 font-bold'
                      : isMajor
                      ? 'border-purple-300 bg-purple-50/70 text-purple-900 hover:bg-purple-100 font-semibold'
                      : 'border-outline-variant bg-slate-50 text-on-surface-variant hover:bg-white hover:border-primary'
                  }`}
                >
                  <span className="font-data-mono text-xs font-bold">{int.label}</span>
                  <span
                    className={`text-[9px] ${
                      isSelected ? 'text-emerald-100' : isMajor ? 'text-purple-700 font-bold' : 'text-on-surface-variant/70'
                    }`}
                  >
                    {int.months} • {int.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: COMPARADOR DE PAQUETES DISPONIBLES (BÁSICO, RECOMENDADO, PREMIUM) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-headline-md text-sm font-bold text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">
                2
              </span>
              Opciones de Paquetes Disponibles para {brand} {activeModel?.name} ({effectiveMileage.toLocaleString()} km)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Ofrece opciones al cliente según su necesidad y presupuesto para elevar la satisfacción y conversión.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-on-surface-variant">Aceite Recomendado de Fábrica:</span>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-900 border border-amber-200">
              🛢️ {activeModel?.defaultOil}
            </span>
          </div>
        </div>

        {/* 3 Column Cards for Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`flex flex-col justify-between rounded-2xl border-2 p-5 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/30 shadow-lg ring-2 ring-emerald-400'
                    : 'border-outline-variant bg-white hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                {/* Header card */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`rounded-full px-3 py-1 font-label-caps text-[10px] border ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                    <span className="flex items-center gap-1 font-data-mono text-[11px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {pkg.timeEstimate}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-headline-md text-base font-black text-primary">{pkg.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{pkg.description}</p>
                  </div>

                  {/* Pricing Box */}
                  <div className="rounded-xl border border-outline-variant/60 bg-slate-50 p-3 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-on-surface-variant font-medium">Total c/ IVA:</span>
                      <span className="font-data-mono text-xl font-black text-emerald-700">
                        ${pkg.total.toLocaleString()} <span className="text-xs font-normal">MXN</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-on-surface-variant/80 border-t border-outline-variant/40 pt-1 font-data-mono">
                      <span>Refacciones: ${pkg.partsSubtotal.toLocaleString()}</span>
                      <span>Mano de Obra: ${pkg.laborSubtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Refacciones incluidas */}
                  <div className="space-y-1.5 pt-1">
                    <span className="font-label-caps text-[10px] font-bold text-primary uppercase block">
                      Refacciones Originales ({pkg.parts.length}):
                    </span>
                    <ul className="space-y-1 text-xs text-on-surface max-h-44 overflow-y-auto pr-1">
                      {pkg.parts.map((p, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-1.5 py-0.5 border-b border-outline-variant/30 last:border-none text-[11px]">
                          <div className="flex items-start gap-1 min-w-0">
                            <span className="material-symbols-outlined text-xs text-emerald-600 mt-0.5 shrink-0">check_circle</span>
                            <div className="min-w-0">
                              <span className="font-medium text-slate-800 leading-tight block truncate">{p.name}</span>
                              {p.partNumber && p.partNumber !== 'REF' && (
                                <span className="text-[9px] font-data-mono text-slate-400">
                                  #{p.partNumber} {p.qty > 1 ? `(${p.qty} pzas)` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          {p.cost > 0 && (
                            <span className="font-data-mono text-[10px] text-slate-500 font-semibold shrink-0">
                              ${p.cost.toLocaleString()}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operaciones de taller */}
                  <div className="space-y-1.5 pt-2 border-t border-outline-variant/60">
                    <span className="font-label-caps text-[10px] font-bold text-primary uppercase block">
                      Operaciones e Inspección ({pkg.operations.length}):
                    </span>
                    <ul className="space-y-1 text-xs text-on-surface-variant">
                      {pkg.operations.slice(0, 5).map((op, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span className="leading-tight text-[11px]">{op}</span>
                        </li>
                      ))}
                      {pkg.operations.length > 5 && (
                        <li className="text-[10px] text-emerald-700 font-bold pl-2">
                          + {pkg.operations.length - 5} operaciones adicionales
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Select button */}
                <div className="pt-5 mt-4 border-t border-outline-variant/60">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackageId(pkg.id);
                    }}
                    className={`w-full rounded-xl py-2.5 px-4 font-label-caps text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                        : 'border border-outline-variant bg-slate-50 text-primary hover:bg-emerald-50 hover:text-emerald-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isSelected ? 'task_alt' : 'radio_button_unchecked'}
                    </span>
                    {isSelected ? 'Paquete Seleccionado' : 'Elegir este Paquete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 3: SERVICIOS COMPLEMENTARIOS / UPSELLING */}
      <div className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div>
            <h3 className="font-headline-md text-sm font-bold text-primary flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">
                3
              </span>
              Servicios Complementarios y Venta Cruzada (Upselling)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Agrega servicios adicionales recomendados según el estado del vehículo para aumentar el ticket promedio.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {selectedUpsellIds.length} seleccionados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {UPSELL_SERVICES.map((srv) => {
            const isChecked = selectedUpsellIds.includes(srv.id);
            const srvTotal = srv.partsPrice + srv.laborPrice;

            return (
              <div
                key={srv.id}
                onClick={() => toggleUpsell(srv.id)}
                className={`flex items-start gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-outline-variant bg-slate-50/60 hover:bg-white hover:border-primary/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // Handled by container
                  className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-body-md text-xs font-bold text-primary leading-tight">{srv.name}</p>
                    <span className="font-data-mono text-xs font-bold text-emerald-700 shrink-0">
                      +${srvTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">{srv.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 4: BARRA DE RESUMEN FINAL Y ACCIONES COMERCIALES */}
      <div className="sticky bottom-4 z-40 rounded-2xl border-2 border-primary/20 bg-slate-900 p-5 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Resumen del paquete activo */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-extrabold text-emerald-300 border border-emerald-400/30">
                {brand} {activeModel?.name} {year} • {effectiveMileage.toLocaleString()} km
              </span>
              <span className="text-xs text-slate-300 font-medium">({agency})</span>
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{selectedPackage.name}</span>
              {selectedUpsells.length > 0 && (
                <span className="text-xs text-emerald-300 font-semibold">
                  (+{selectedUpsells.length} servicios adicionales)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Tiempo estimado: <strong className="text-white">{selectedPackage.timeEstimate}</strong> • Refacciones
              originales con garantía Grupo Prosur.
            </p>
          </div>

          {/* Totales y Botones de Acción */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right pr-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cotizado (con IVA)</span>
              <span className="font-data-mono text-2xl font-black text-emerald-400 tracking-tight">
                ${totalCalculations.total.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-300">MXN</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleQuickCopy}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Copiar texto resumen al portapapeles"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedQuick ? 'check' : 'content_copy'}
                </span>
                {copiedQuick ? '¡Copiado!' : 'Copiar'}
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer ring-1 ring-emerald-400"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Cotización Formal / PDF / WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Impresión / Compartir WhatsApp */}
      {showPrintModal && (
        <QuotationPrintModal
          quotation={{
            brand,
            modelName: activeModel?.name,
            year,
            km: effectiveMileage,
            agency,
            clientName,
            plate,
            advisorName,
            selectedPackage,
            selectedUpsells,
            totalCalculations,
          }}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Modal Informativo: Estructura del Archivo Excel para Alimentar el Catálogo */}
      {showExcelStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-xl">table_chart</span>
                <h3 className="font-headline-md text-base font-bold text-primary">
                  Formato de Catálogo Excel para Paquetes de Mantenimiento
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExcelStructureModal(false)}
                className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              El cotizador está estructurado para que puedas alimentar o actualizar todos los paquetes, precios y
              refacciones directamente desde tu archivo de Excel. El archivo debe incluir las siguientes columnas:
            </p>

            <div className="rounded-xl border border-outline-variant overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <thead className="bg-slate-100 font-bold text-primary text-left">
                  <tr>
                    <th className="p-2 border-b">Columna</th>
                    <th className="p-2 border-b">Tipo</th>
                    <th className="p-2 border-b">Ejemplo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  <tr>
                    <td className="p-2 font-bold font-data-mono">MARCA</td>
                    <td className="p-2 text-on-surface-variant">Texto</td>
                    <td className="p-2 text-slate-700">NISSAN, CHANGAN, RENAULT</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-data-mono">MODELO</td>
                    <td className="p-2 text-on-surface-variant">Texto</td>
                    <td className="p-2 text-slate-700">Versa, Kicks, CS35 Plus, Kwid</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-data-mono">KILOMETRAJE</td>
                    <td className="p-2 text-on-surface-variant">Número</td>
                    <td className="p-2 text-slate-700">10000, 20000, 40000</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-data-mono">TIPO_PAQUETE</td>
                    <td className="p-2 text-on-surface-variant">Texto</td>
                    <td className="p-2 text-slate-700">BÁSICO, RECOMENDADO, PREMIUM</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-data-mono">REFACCIONES_INCLUIDAS</td>
                    <td className="p-2 text-on-surface-variant">Lista separada por comas</td>
                    <td className="p-2 text-slate-700">Aceite 0W-20, Filtro Aceite, Arandela</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-data-mono">COSTO_REFACCIONES</td>
                    <td className="p-2 text-on-surface-variant">Moneda (MXN)</td>
                    <td className="p-2 text-slate-700">$1,250.00</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold font-data-mono">HORAS_MO / COSTO_MO</td>
                    <td className="p-2 text-on-surface-variant">Moneda (MXN)</td>
                    <td className="p-2 text-slate-700">$850.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                ¿Tienes listo tu archivo de Excel?
              </span>
              <p>
                Puedes compartir o pegar los datos de tu archivo de Excel aquí en el chat para cargarlos de inmediato al
                catálogo del sistema.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowExcelStructureModal(false)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

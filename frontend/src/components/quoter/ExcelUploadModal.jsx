import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { parseMaintenanceExcel } from '../../utils/excelPackageParser.js';

export default function ExcelUploadModal({
  isOpen,
  onClose,
  onCatalogUpdated,
  currentCustomCatalog,
  onRestoreDefaults,
}) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [previewModelKey, setPreviewModelKey] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  async function handleFileSelected(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setParsing(true);
    setParseError(null);
    setSuccessMessage('');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const result = parseMaintenanceExcel(buffer);

      if (!result.catalog || Object.keys(result.catalog).length === 0) {
        throw new Error('No se encontraron paquetes válidos en el archivo. Verifica la estructura de las hojas o columnas.');
      }

      setParseResult(result);
      const firstModel = Object.keys(result.catalog)[0];
      setPreviewModelKey(firstModel);
    } catch (err) {
      console.error('Error parseando Excel:', err);
      setParseError(err.message || 'Error al procesar el archivo Excel.');
      setParseResult(null);
    } finally {
      setParsing(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }

  function handleSaveCatalog() {
    if (!parseResult || !parseResult.catalog) return;
    try {
      localStorage.setItem('pitstop.customMaintenanceCatalog', JSON.stringify(parseResult.catalog));
      localStorage.setItem('pitstop.customMaintenanceCatalogMeta', JSON.stringify({
        fileName: file?.name || 'custom_matrix.xlsx',
        updatedAt: new Date().toISOString(),
        modelCount: parseResult.modelCount,
        packageCount: parseResult.packageCount,
      }));
      onCatalogUpdated?.(parseResult.catalog);
      setSuccessMessage('¡Catálogo de paquetes actualizado con éxito en el sistema!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setParseError('No se pudo guardar en almacenamiento local: ' + err.message);
    }
  }

  function handleReset() {
    if (window.confirm('¿Deseas restablecer el catálogo a la Matriz Oficial Nissan CHESA predeterminada?')) {
      localStorage.removeItem('pitstop.customMaintenanceCatalog');
      localStorage.removeItem('pitstop.customMaintenanceCatalogMeta');
      onRestoreDefaults?.();
      setSuccessMessage('Catálogo restablecido a los valores oficiales de fábrica.');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }

  function handleDownloadTemplate() {
    const wsData = [
      ['MARCA', 'MODELO', 'ANIO', 'KILOMETRAJE', 'TIPO_PAQUETE', 'REFACCIONES_INCLUIDAS', 'COSTO_REFACCIONES', 'COSTO_MO', 'TOTAL'],
      ['NISSAN', 'Versa', '2024', 10000, 'BÁSICO', 'Aceite Sintético 0W-20, Filtro Aceite, Arandela', 1250, 650, 1900],
      ['NISSAN', 'Versa', '2024', 10000, 'RECOMENDADO', 'Aceite 0W-20, Filtro Aceite, Filtro Aire, Aditivo Inyectores', 1890, 890, 2780],
      ['NISSAN', 'Versa', '2024', 10000, 'GOLD', 'Aceite 0W-20, Filtros, Lavado Inyectores, Desinfección AC', 2650, 1250, 3900],
      ['NISSAN', 'Sentra', '2024', 20000, 'RECOMENDADO', 'Aceite 0W-20, Filtro Aceite, Filtro Polen, Rotación Llantas', 2100, 950, 3050],
      ['CHANGAN', 'CS35 Plus', '2024', 10000, 'RECOMENDADO', 'Aceite 5W-30 Sintético, Filtro Aceite, Filtro Aire', 1450, 750, 2200],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla_Mantenimientos');
    XLSX.writeFile(wb, 'Plantilla_Paquetes_Mantenimiento_PitStop.xlsx');
  }

  const activePreviewModel = parseResult?.catalog?.[previewModelKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="material-symbols-outlined text-xl">table_chart</span>
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Actualizar Catálogo de Mantenimientos por Excel</h3>
              <p className="text-xs text-slate-400">
                Sube la matriz oficial (.xlsx, .xls o .csv) para actualizar refacciones, números de parte y costos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Mensajes de Éxito / Error */}
          {successMessage && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              {successMessage}
            </div>
          )}

          {parseError && (
            <div className="rounded-xl bg-rose-50 border border-rose-300 p-3.5 text-xs text-rose-900 font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">error</span>
              {parseError}
            </div>
          )}

          {/* Zona de Arrastre / Carga de Archivo */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-6 text-center hover:bg-emerald-50/80 hover:border-emerald-500 transition-all cursor-pointer space-y-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
              className="hidden"
            />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {file ? file.name : 'Haz clic aquí o arrastra tu archivo Excel / Matriz de Mantenimientos'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatos compatibles: <strong>.xlsx</strong>, <strong>.xls</strong> o <strong>.csv</strong>
              </p>
            </div>
            {parsing && (
              <p className="text-xs font-bold text-emerald-700 animate-pulse flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Procesando hojas y extrayendo paquetes...
              </p>
            )}
          </div>

          {/* Estado del Archivo Parseado */}
          {parseResult && (
            <div className="rounded-2xl border border-outline-variant bg-slate-50 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {parseResult.format === 'CHESA_MULTI_SHEET' ? 'Formato Matriz Multi-Hoja (CHESA)' : 'Formato Tabular Estándar'}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    Archivo procesado correctamente
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs font-data-mono">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-slate-700">
                    🚗 <strong>{parseResult.modelCount}</strong> modelos
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-emerald-800">
                    📦 <strong>{parseResult.packageCount}</strong> paquetes
                  </span>
                </div>
              </div>

              {/* Selector de Modelos Detectados */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase block">
                  Vista Previa por Modelo:
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-xl border border-outline-variant">
                  {Object.keys(parseResult.catalog).map((mKey) => {
                    const m = parseResult.catalog[mKey];
                    const isSel = previewModelKey === mKey;
                    return (
                      <button
                        key={mKey}
                        type="button"
                        onClick={() => setPreviewModelKey(mKey)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                          isSel
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {m.rawName || mKey} ({m.packages.length} pqtes)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tabla de Vista Previa de Paquetes para el Modelo Seleccionado */}
              {activePreviewModel && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
                  <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 flex items-center justify-between">
                    <span>{activePreviewModel.rawName} {activePreviewModel.years ? `(${activePreviewModel.years})` : ''}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Mostrando {activePreviewModel.packages.length} configuraciones de paquetes
                    </span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="p-2">Paquete</th>
                          <th className="p-2">Intervalo KM</th>
                          <th className="p-2">Refacciones</th>
                          <th className="p-2 text-right">Subt. Refac</th>
                          <th className="p-2 text-right">M.O.</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-data-mono">
                        {activePreviewModel.packages.map((pkg, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-body font-bold text-slate-900">
                              <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${pkg.badgeColor}`}>
                                {pkg.name}
                              </span>
                            </td>
                            <td className="p-2 text-slate-600 text-[11px]">
                              {pkg.kmText || (pkg.kmNumbers?.length ? `${pkg.kmNumbers.join(', ')} km` : 'Estándar')}
                            </td>
                            <td className="p-2 font-body text-slate-700 text-[11px]">
                              {pkg.parts.length} refac.
                              {pkg.parts.length > 0 && (
                                <span className="text-[10px] text-slate-400 block truncate max-w-[200px]" title={pkg.parts.map(p => p.name).join(', ')}>
                                  {pkg.parts.slice(0, 2).map(p => p.name).join(', ')}...
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-right text-slate-700 font-medium">
                              ${pkg.partsSubtotal.toLocaleString()}
                            </td>
                            <td className="p-2 text-right text-slate-700 font-medium">
                              ${pkg.laborSubtotal.toLocaleString()}
                            </td>
                            <td className="p-2 text-right text-emerald-700 font-black">
                              ${pkg.total.toLocaleString()} MXN
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Plantilla y Ayuda */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">¿Necesitas una plantilla de ejemplo?</span>
              <p className="text-slate-500 text-[11px]">
                Descarga el formato base para llenarlo con los precios y refacciones de tu agencia.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-bold text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-emerald-600">download</span>
              Descargar Plantilla Excel
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant bg-slate-50 px-6 py-4">
          <div>
            {currentCustomCatalog && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Restablecer a Matriz Oficial de Fábrica
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveCatalog}
              disabled={!parseResult}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Guardar y Aplicar al Cotizador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

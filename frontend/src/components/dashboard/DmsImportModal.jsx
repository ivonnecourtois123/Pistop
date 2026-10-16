import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { syncDmsRows, previewDmsSync, cleanDemoOrders } from '../../api/dmsSync.js';
import { DEFAULT_AGENCIES, AGENCIES_BY_BRAND, getAgencyBrand } from '../../constants/immobilized.js';

function extractOrderNumbers(rows) {
  const set = new Set();
  const prefixes = ['ORDEN', 'NO_ORDEN', 'NO. ORDEN', 'ORDER', 'OT', 'NUM_ORDEN', 'NUM ORDEN'];
  for (const row of rows) {
    if (!row) continue;
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toUpperCase();
      if (prefixes.some((p) => cleanKey === p || cleanKey.startsWith(p))) {
        const val = row[key];
        if (val != null) {
          const digits = String(val).replace(/^'/, '').trim();
          const parsed = parseInt(digits, 10);
          if (!Number.isNaN(parsed)) {
            set.add(String(parsed));
          }
        }
        break;
      }
    }
  }
  return Array.from(set);
}

export default function DmsImportModal({ isOpen, onClose, onImportSuccess, orderType = 'SERVICIO' }) {
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [cleanDemos, setCleanDemos] = useState(true);
  const [assignAgency, setAssignAgency] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState('San Cristóbal');
  const [completeMissingOrders, setCompleteMissingOrders] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultMsg, setResultMsg] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!parsedRows.length) {
      setPreviewData(null);
      return;
    }
    const orderNumbers = extractOrderNumbers(parsedRows);
    if (!orderNumbers.length) {
      setPreviewData(null);
      return;
    }
    const agencyToAssign = assignAgency && selectedAgency ? selectedAgency : null;
    setIsLoadingPreview(true);
    previewDmsSync(orderNumbers, agencyToAssign, orderType)
      .then(setPreviewData)
      .catch((err) => {
        console.error('Error previsualizando sync DMS:', err);
        setPreviewData(null);
      })
      .finally(() => setIsLoadingPreview(false));
  }, [parsedRows, assignAgency, selectedAgency, orderType]);

  if (!isOpen) return null;

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    processSelectedFile(selected);
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      processSelectedFile(dropped);
    }
  }

  function processSelectedFile(f) {
    setErrorMsg('');
    setResultMsg(null);
    setFile(f);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });

        if (!json || json.length === 0) {
          setErrorMsg('El archivo no contiene filas o datos legibles.');
          setParsedRows([]);
          return;
        }

        setParsedRows(json);
      } catch (err) {
        setErrorMsg('Error al interpretar el archivo Excel/CSV. Verifica el formato.');
        setParsedRows([]);
      }
    };
    reader.readAsBinaryString(f);
  }

  async function handleImport() {
    if (!parsedRows.length) return;
    setIsProcessing(true);
    setErrorMsg('');
    setResultMsg(null);

    try {
      const agencyToAssign = assignAgency && selectedAgency ? selectedAgency : null;
      const res = await syncDmsRows(
        parsedRows,
        cleanDemos,
        agencyToAssign,
        completeMissingOrders,
        orderType
      );

      let msg = `¡Sincronización exitosa! Se procesaron ${res.totalProcessed} órdenes (${res.created} nuevas creadas, ${res.updated} actualizadas)${agencyToAssign ? ` asignadas a ${agencyToAssign}` : ''}.`;
      if (res.completedMissing > 0) {
        msg += ` 🏁 Además, ${res.completedMissing} orden(es) activas que ya no estaban en el reporte del DMS se pasaron a TERMINADO.`;
      }

      setResultMsg({
        success: true,
        text: msg,
        completedList: res.completedMissingOrders || [],
      });
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
          'Ocurrió un error al procesar las órdenes en la base de datos.'
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCleanOnlyDemos() {
    if (!window.confirm('¿Confirmas que deseas eliminar todas las órdenes de ejemplo (WO-XXXX)?')) {
      return;
    }
    setIsCleaning(true);
    setErrorMsg('');
    setResultMsg(null);

    try {
      const res = await cleanDemoOrders();
      setResultMsg({
        success: true,
        text: res.message || 'Órdenes de demostración eliminadas correctamente.',
      });
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setErrorMsg('No se pudieron eliminar las órdenes de demostración.');
    } finally {
      setIsCleaning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="material-symbols-outlined text-lg">sync_alt</span>
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Alimentar Sistema / Sincronización DMS
              </h3>
              <p className="text-[11px] text-slate-400">
                Carga el reporte de Órdenes en Proceso desde Excel (.xlsx, .xls) o CSV
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Mensajes de feedback */}
          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-start gap-2">
              <span className="material-symbols-outlined text-red-600 text-base shrink-0">
                error
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          {resultMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">
                check_circle
              </span>
              <span>{resultMsg.text}</span>
            </div>
          )}

          {/* Opciones previas */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-outline-variant/60 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={cleanDemos}
                  onChange={(e) => setCleanDemos(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span>Limpiar automáticamente órdenes de demostración (WO-...) al importar</span>
              </label>

              <button
                type="button"
                onClick={handleCleanOnlyDemos}
                disabled={isCleaning}
                className="text-[11px] text-red-600 hover:text-red-800 font-semibold underline underline-offset-2 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                {isCleaning ? 'Limpiando...' : '🗑️ Solo borrar ejemplos'}
              </button>
            </div>

            {/* Check y selector de Agencia / Sucursal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950">
                <input
                  type="checkbox"
                  checked={assignAgency}
                  onChange={(e) => setAssignAgency(e.target.checked)}
                  className="rounded border-emerald-400 text-emerald-700 focus:ring-emerald-600 h-4 w-4"
                />
                <span>Asignar estas órdenes a la agencia:</span>
              </label>

              <div className="flex items-center gap-2">
                <select
                  disabled={!assignAgency}
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 focus:border-emerald-600 focus:outline-none disabled:opacity-50 disabled:bg-slate-100 shadow-2xs"
                >
                  {Object.entries(AGENCIES_BY_BRAND).map(([brand, list]) => (
                    <optgroup key={brand} label={`── ${brand} ──`}>
                      {list.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name} ({brand})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {assignAgency && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-extrabold text-white shadow-2xs">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    {getAgencyBrand(selectedAgency) || 'NISSAN'}
                  </span>
                )}
              </div>
            </div>

            {/* Opción de cierre automático de órdenes que ya no están en proceso en DMS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/90 text-xs">
              <label className="flex items-start sm:items-center gap-2 cursor-pointer font-bold text-blue-950">
                <input
                  type="checkbox"
                  checked={completeMissingOrders}
                  onChange={(e) => setCompleteMissingOrders(e.target.checked)}
                  className="mt-0.5 sm:mt-0 rounded border-blue-400 text-blue-700 focus:ring-blue-600 h-4 w-4 shrink-0"
                />
                <div>
                  <span>Pasar a TERMINADO las órdenes activas que ya no aparezcan en este archivo</span>
                  <p className="font-normal text-[11px] text-blue-800 mt-0.5">
                    Si una orden estaba en proceso pero ya no figura en la exportación del DMS, significa que ya concluyó su estadía en taller.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary/60 bg-slate-50/60 hover:bg-slate-50 p-8 text-center cursor-pointer transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="material-symbols-outlined text-4xl text-primary/70 mb-2">
              cloud_upload
            </span>
            <p className="font-headline-md text-sm font-bold text-slate-800">
              {file ? file.name : 'Haz clic o arrastra tu archivo Excel / CSV aquí'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Compatible con el reporte estándar de Órdenes Pendientes de SIA NXT / Prosur
            </p>
            {parsedRows.length > 0 && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="material-symbols-outlined text-sm">table_view</span>
                {parsedRows.length} fila(s) detectada(s) listas para procesar
              </span>
            )}
          </div>

          {/* Diagnóstico previo del impacto de la sincronización */}
          {parsedRows.length > 0 && previewData && (
            <div className="rounded-xl border border-outline-variant bg-surface-container-low/60 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[11px] uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                  Diagnóstico previo de sincronización:
                </span>
                {isLoadingPreview && (
                  <span className="text-[10px] text-slate-500 animate-pulse font-medium">Analizando base de datos...</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-2 text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-800">Nuevas en el sistema</p>
                  <p className="font-data-mono text-base font-black text-emerald-900">+{previewData.toCreate}</p>
                  <span className="text-[9px] text-emerald-700">Se registrarán</span>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-700">Existentes a actualizar</p>
                  <p className="font-data-mono text-base font-black text-primary">{previewData.toUpdate}</p>
                  <span className="text-[9px] text-slate-500">Mantiene historial</span>
                </div>

                <div className={`rounded-lg border p-2 text-center transition-colors ${
                  previewData.missingActiveOrders?.length > 0 && completeMissingOrders
                    ? 'border-amber-300 bg-amber-50/90 text-amber-900'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}>
                  <p className="text-[10px] uppercase font-bold">
                    {completeMissingOrders ? 'Pasarán a TERMINADO' : 'No en archivo (sin cambio)'}
                  </p>
                  <p className="font-data-mono text-base font-black">
                    {previewData.missingActiveOrders?.length || 0}
                  </p>
                  {previewData.missingActiveOrders?.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowMissingModal((v) => !v)}
                      className="text-[9px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer"
                    >
                      {showMissingModal ? '▲ Ocultar lista' : '▼ Ver cuáles son'}
                    </button>
                  ) : (
                    <span className="text-[9px] text-slate-500">Todas en el archivo</span>
                  )}
                </div>
              </div>

              {/* Lista desplegable de órdenes que saldrán a TERMINADO */}
              {showMissingModal && previewData.missingActiveOrders?.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5 space-y-1.5 animate-in fade-in duration-150">
                  <p className="font-label-caps text-[10px] font-bold text-amber-900">
                    Órdenes activas en PitStop que no vienen en el archivo ({previewData.missingActiveOrders.length}):
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {previewData.missingActiveOrders.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded border border-amber-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-data-mono font-bold text-primary">#OR: {o.orderNumber}</span>
                          <span className="text-slate-600 truncate max-w-[220px]">{o.vehicle || 'Sin vehículo'}</span>
                        </div>
                        <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vista previa de las primeras 3 órdenes detectadas */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
                Muestra de órdenes detectadas:
              </span>
              <div className="overflow-x-auto rounded-xl border border-outline-variant/60 max-h-40">
                <table className="w-full text-left text-[11px] divide-y divide-slate-100">
                  <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                    <tr>
                      <th className="p-2"># Orden</th>
                      <th className="p-2">Entrada</th>
                      <th className="p-2">Placas / Serie</th>
                      <th className="p-2">Línea / Vehículo</th>
                      <th className="p-2">Cliente</th>
                      <th className="p-2">Refacciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedRows.slice(0, 4).map((row, i) => {
                      const keys = Object.keys(row);
                      const getV = (subs) => {
                        const candidates = Array.isArray(subs) ? subs : [subs];
                        for (const sub of candidates) {
                          const k = keys.find((key) => key.trim().toUpperCase().includes(sub.toUpperCase()));
                          if (k && row[k] != null && String(row[k]).trim() !== '') {
                            return String(row[k]).trim();
                          }
                        }
                        return '—';
                      };
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-bold font-data-mono text-primary">
                            {getV(['ORDEN', 'OT', 'ORDER'])}
                          </td>
                          <td className="p-2 text-slate-600 font-data-mono">
                            {getV(['FECENT', 'ENTRADA', 'FECHA'])}
                          </td>
                          <td className="p-2 font-data-mono font-bold">
                            {getV(['PLACA', 'SERIE', 'VIN'])}
                          </td>
                          <td className="p-2 text-slate-700">
                            {getV(['TIPOVEH', 'LINEA', 'MODELO'])}
                          </td>
                          <td className="p-2 text-slate-600 truncate max-w-[140px]">
                            {getV(['NOMBRE', 'CLIENTE'])}
                          </td>
                          <td className="p-2 text-slate-700 font-data-mono font-bold text-emerald-800">
                            {getV(['TOTREF', 'REFACCIONES', 'TOTAL'])}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Nota de sincronización futura */}
          <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-3 text-[11px] text-blue-900 flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-700 text-sm shrink-0 mt-0.5">
              info
            </span>
            <span>
              <strong>Preparado para sincronización automática:</strong> Este mismo conector
              actualiza o inserta por número de orden. Más adelante se podrá conectar a una
              tarea programada (cron) o endpoint directo con el DMS sin modificar la base de datos.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-outline-variant bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={!parsedRows.length || isProcessing}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
                <span>Procesando órdenes...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">cloud_sync</span>
                <span>
                  Alimentar Sistema ({parsedRows.length} órdenes
                  {completeMissingOrders && previewData?.missingActiveOrders?.length > 0
                    ? ` + ${previewData.missingActiveOrders.length} a TERMINADO`
                    : ''}
                  )
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { syncDmsRows, cleanDemoOrders } from '../../api/dmsSync.js';

export default function DmsImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [cleanDemos, setCleanDemos] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultMsg, setResultMsg] = useState(null);
  const fileInputRef = useRef(null);

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
      const res = await syncDmsRows(parsedRows, cleanDemos);
      setResultMsg({
        success: true,
        text: `¡Sincronización exitosa! Se procesaron ${res.totalProcessed} órdenes (${res.created} nuevas creadas, ${res.updated} actualizadas).`,
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
                      <th className="p-2">Placas</th>
                      <th className="p-2">Línea</th>
                      <th className="p-2">Cliente</th>
                      <th className="p-2">Trabajo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedRows.slice(0, 4).map((row, i) => {
                      const keys = Object.keys(row);
                      const getV = (sub) => {
                        const k = keys.find((key) => key.trim().toUpperCase().includes(sub));
                        return k ? row[k] : '—';
                      };
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-bold font-data-mono text-primary">
                            {getV('ORDEN')}
                          </td>
                          <td className="p-2 text-slate-600">{getV('ENTRADA')}</td>
                          <td className="p-2 font-data-mono font-bold">{getV('PLACA')}</td>
                          <td className="p-2 text-slate-700">{getV('LINEA')}</td>
                          <td className="p-2 text-slate-600 truncate max-w-[140px]">
                            {getV('CLIENTE')}
                          </td>
                          <td className="p-2 text-slate-700">{getV('TRABAJO')}</td>
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
                <span>Alimentar Sistema ({parsedRows.length} órdenes)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

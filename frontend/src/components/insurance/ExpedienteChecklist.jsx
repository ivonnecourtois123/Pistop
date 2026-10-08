import { useRef, useState } from 'react';
import { getChecklistForInsurer } from '../../constants/immobilized.js';

export default function ExpedienteChecklist({
  insurerName,
  documents = [],
  onToggleDoc,
  storageKeyPrefix = 'pitstop.expedienteDoc.',
  entityId,
  readOnly = false,
}) {
  const fileInputRef = useRef(null);
  const [activeDocKey, setActiveDocKey] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState(() => {
    try {
      const stored = localStorage.getItem(`${storageKeyPrefix}${entityId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const checklistDefs = getChecklistForInsurer(insurerName);

  function handleFileClick(docKey) {
    if (readOnly) return;
    setActiveDocKey(docKey);
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !activeDocKey) return;

    const fileData = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    const updated = { ...attachedFiles, [activeDocKey]: fileData };
    setAttachedFiles(updated);
    try {
      localStorage.setItem(`${storageKeyPrefix}${entityId}`, JSON.stringify(updated));
    } catch {
      // localStorage quota safe fallback
    }

    // Auto-mark document as completed when file is attached
    const isDocCompleted = documents.some((d) => d.docType === activeDocKey && d.completed);
    if (!isDocCompleted) {
      onToggleDoc?.(activeDocKey, true);
    }

    e.target.value = '';
    setActiveDocKey(null);
  }

  function handleRemoveFile(docKey, e) {
    e.stopPropagation();
    const updated = { ...attachedFiles };
    delete updated[docKey];
    setAttachedFiles(updated);
    try {
      localStorage.setItem(`${storageKeyPrefix}${entityId}`, JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  }

  const completedCount = checklistDefs.filter((def) => {
    return documents.some((d) => d.docType === def.key && d.completed) || attachedFiles[def.key];
  }).length;

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xlsx"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between border-b border-outline-variant pb-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
          CHECKLIST DEL EXPEDIENTE DIGITAL ({completedCount}/{checklistDefs.length})
        </span>
        {insurerName && (
          <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 font-label-caps text-[11px] font-semibold text-primary">
            {insurerName}
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {checklistDefs.map((def) => {
          const docRecord = documents.find((d) => d.docType === def.key);
          const isCompleted = Boolean(docRecord?.completed || attachedFiles[def.key]);
          const attached = attachedFiles[def.key];

          return (
            <li
              key={def.key}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-2.5 transition-colors ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  disabled={readOnly}
                  onChange={(e) => onToggleDoc?.(def.key, e.target.checked)}
                  className="h-4 w-4 rounded border-outline text-primary focus:ring-primary cursor-pointer"
                />
                <span className={`text-xs ${isCompleted ? 'text-primary font-medium' : 'text-on-surface'}`}>
                  {def.label}
                  {def.required ? (
                    <span className="ml-1 text-error font-bold" title="Documento obligatorio">
                      *
                    </span>
                  ) : (
                    <span className="ml-1 text-[10px] text-on-surface-variant font-normal">(Opcional)</span>
                  )}
                </span>
              </label>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {attached ? (
                  <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] text-primary">
                    <span className="material-symbols-outlined text-xs" data-icon="attach_file">
                      attach_file
                    </span>
                    <span className="max-w-[120px] truncate" title={attached.name}>
                      {attached.name}
                    </span>
                    <span className="text-[9px] text-on-surface-variant">({attached.size})</span>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveFile(def.key, e)}
                        className="ml-1 material-symbols-outlined text-xs text-error hover:text-error/80"
                        title="Quitar archivo adjunto"
                        data-icon="cancel"
                      >
                        cancel
                      </button>
                    )}
                  </div>
                ) : (
                  !readOnly && (
                    <button
                      type="button"
                      onClick={() => handleFileClick(def.key)}
                      className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface px-2 py-1 font-label-caps text-[10px] text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                      title="Adjuntar archivo para este documento (clip)"
                    >
                      <span className="material-symbols-outlined text-xs" data-icon="attach_file">
                        attach_file
                      </span>
                      Adjuntar
                    </button>
                  )
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

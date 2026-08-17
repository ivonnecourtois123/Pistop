import { useState } from 'react';

// Texto editable directamente en la tabla (ej. Aseguradora, # Reporte/Siniestro). Guarda solo al
// perder foco y solo si el valor cambió, para no disparar un PATCH por cada tecla.
export default function InlineTextField({ value, onSave, placeholder }) {
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);

  async function handleBlur() {
    const trimmed = draft.trim();
    if (trimmed === (value || '')) return;
    setSaving(true);
    try {
      await onSave(trimmed || null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      placeholder={placeholder}
      disabled={saving}
      className="w-32 rounded border border-transparent bg-transparent px-1 py-0.5 font-body-md text-sm text-primary hover:border-outline-variant focus:border-primary focus:bg-white focus:outline-none disabled:opacity-50"
    />
  );
}

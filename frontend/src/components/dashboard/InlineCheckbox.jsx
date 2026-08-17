import { useState } from 'react';

// Casilla SI/NO editable directamente en la tabla (ej. Diagnóstico, Con lavado). `checked` es
// tri-estado en los datos (true/false/null), pero la casilla solo distingue marcado/no marcado
// — null se muestra como no marcado, igual que false, hasta que alguien la toque.
export default function InlineCheckbox({ checked, onToggle, title }) {
  const [saving, setSaving] = useState(false);

  async function handleChange(e) {
    const next = e.target.checked;
    setSaving(true);
    try {
      await onToggle(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <input
      type="checkbox"
      checked={checked === true}
      onChange={handleChange}
      onClick={(e) => e.stopPropagation()}
      disabled={saving}
      title={title}
      className="h-4 w-4 cursor-pointer accent-primary disabled:opacity-50"
    />
  );
}

import { useState } from 'react';

export default function QuotationPrintModal({
  quotation,
  onClose,
}) {
  const [clientPhone, setClientPhone] = useState('');
  const [copied, setCopied] = useState(false);

  if (!quotation) return null;

  const {
    brand,
    modelName,
    year,
    km,
    agency,
    clientName,
    plate,
    advisorName,
    selectedPackage,
    selectedUpsells = [],
    totalCalculations,
    quotationNumber = `COT-${Math.floor(100000 + Math.random() * 900000)}`,
    date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
  } = quotation;

  function handlePrint() {
    window.print();
  }

  function handleCopyWhatsApp() {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  function generateWhatsAppMessage() {
    const upsellsText =
      selectedUpsells.length > 0
        ? `\n\n*🔧 Servicios Complementarios Agregados:*\n` +
          selectedUpsells
            .map((u) => `• ${u.name}: $${(u.partsPrice + u.laborPrice).toLocaleString()} MXN`)
            .join('\n')
        : '';

    return `🚗 *COTIZACIÓN DE MANTENIMIENTO — GRUPO PROSUR*
📍 *Agencia:* ${agency}
📄 *Folio:* ${quotationNumber}
📅 *Fecha:* ${date}

👤 *Cliente:* ${clientName || 'Apreciable Cliente'}
🚘 *Vehículo:* ${brand} ${modelName} ${year || ''} (${km.toLocaleString()} km)
🔢 *Placas:* ${plate || 'Por confirmar'}

✨ *Paquete Cotizado:* ${selectedPackage.name}
⏱️ *Tiempo estimado en taller:* ${selectedPackage.timeEstimate}

*Operaciones y Refacciones Incluidas:*
${selectedPackage.operations.slice(0, 5).map((o) => `• ${o}`).join('\n')}
• _Y más puntos de seguridad..._
${upsellsText}

💰 *RESUMEN DE COSTO:*
• Subtotal: $${totalCalculations.subtotal.toLocaleString()} MXN
• IVA (16%): $${totalCalculations.iva.toLocaleString()} MXN
⭐ *TOTAL A PAGAR: $${totalCalculations.total.toLocaleString()} MXN*

✅ Incluye refacciones 100% originales de la marca y garantía en mano de obra calificada.
👤 *Asesor:* ${advisorName || 'Asesor de Servicio'}

¿Desea que agendemos su cita de servicio para asegurar la refacción y su horario preferido?`;
  }

  function handleSendWhatsAppDirect() {
    const msg = encodeURIComponent(generateWhatsAppMessage());
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const url = cleanPhone ? `https://wa.me/52${cleanPhone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(url, '_blank');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between border-b border-outline-variant bg-slate-900 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">description</span>
            <h3 className="text-base font-bold">Cotización Formal de Servicio — Vista para Cliente</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Action bar for WhatsApp and Print */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 px-6 py-3 border-b border-outline-variant print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg">chat</span>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="WhatsApp 10 dígitos (ej. 9611234567)"
              className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary focus:border-primary focus:outline-none w-56 font-data-mono"
            />
            <button
              type="button"
              onClick={handleSendWhatsAppDirect}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Enviar WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-1 rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? '¡Copiado!' : 'Copiar Texto'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Content Document to Print */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0 print:m-0" id="printableQuotation">
          {/* Header Document */}
          <div className="flex items-start justify-between border-b-2 border-primary pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-primary tracking-tight">GRUPO PROSUR</span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {brand}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Centro de Servicio Automotriz Autorizado — {agency}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase block">Folio de Cotización</span>
              <span className="font-data-mono text-base font-black text-primary">{quotationNumber}</span>
              <p className="text-[11px] text-slate-500">{date}</p>
            </div>
          </div>

          {/* Client and Vehicle Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Datos del Cliente</span>
              <p className="font-bold text-slate-900 text-sm">{clientName || 'Público en General / Propietario'}</p>
              {clientPhone && <p className="text-slate-600 font-data-mono">Tel: {clientPhone}</p>}
              <p className="text-slate-500 mt-1">
                Atendido por:{' '}
                <span className="font-semibold text-slate-800">{advisorName || 'Asesor Profesional de Servicio'}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Datos del Vehículo</span>
              <p className="font-bold text-slate-900 text-sm">
                {brand} {modelName} {year ? `Modelo ${year}` : ''}
              </p>
              <div className="flex items-center gap-4 mt-1 text-slate-600 font-data-mono">
                <span>
                  Kilometraje:{' '}
                  <strong className="text-emerald-700 font-bold">{km.toLocaleString()} km</strong>
                </span>
                {plate && <span>Placas: <strong>{plate}</strong></span>}
              </div>
            </div>
          </div>

          {/* Package details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">verified</span>
                {selectedPackage.name}
              </h4>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                Tiempo Estimado: {selectedPackage.timeEstimate}
              </span>
            </div>
            <p className="text-xs text-slate-600 italic">{selectedPackage.description}</p>

            {/* Table of Parts & Operations */}
            <div className="rounded-lg border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Concepto / Operación / Refacción</th>
                    <th className="p-2.5 text-center">Tipo</th>
                    <th className="p-2.5 text-right">Importe Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedPackage.parts.map((part, i) => (
                    <tr key={`part-${i}`} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-800 font-medium">📦 {part.name}</td>
                      <td className="p-2.5 text-center text-slate-500 font-data-mono text-[10px]">Refacción Original</td>
                      <td className="p-2.5 text-right font-data-mono font-medium text-slate-700">
                        ${part.cost.toLocaleString()} MXN
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/50">
                    <td className="p-2.5 text-slate-800 font-medium" colSpan={2}>
                      🛠️ Mano de Obra e Inspección Certificada ({selectedPackage.operations.length} puntos y operaciones)
                    </td>
                    <td className="p-2.5 text-right font-data-mono font-medium text-slate-700">
                      ${selectedPackage.laborSubtotal.toLocaleString()} MXN
                    </td>
                  </tr>
                  {selectedUpsells.map((up) => (
                    <tr key={up.id} className="bg-emerald-50/40 text-emerald-950 font-medium">
                      <td className="p-2.5">
                        <span className="font-bold text-emerald-800">+ {up.name}</span>
                        <p className="text-[10px] text-slate-500">{up.description}</p>
                      </td>
                      <td className="p-2.5 text-center text-emerald-700 font-data-mono text-[10px]">Servicio Opcional</td>
                      <td className="p-2.5 text-right font-data-mono font-bold text-emerald-800">
                        ${(up.partsPrice + up.laborPrice).toLocaleString()} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-72 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Refacciones:</span>
                <span className="font-data-mono font-semibold">${totalCalculations.partsSubtotal.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Mano de Obra:</span>
                <span className="font-data-mono font-semibold">${totalCalculations.laborSubtotal.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal sin IVA:</span>
                <span className="font-data-mono font-semibold">${totalCalculations.subtotal.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>I.V.A. (16%):</span>
                <span className="font-data-mono font-semibold">${totalCalculations.iva.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-300 pt-2 text-base font-black text-slate-900">
                <span>TOTAL A PAGAR:</span>
                <span className="font-data-mono text-emerald-700">${totalCalculations.total.toLocaleString()} MXN</span>
              </div>
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Términos y Condiciones de la Cotización:</p>
            <p>• Precios expresados en Moneda Nacional (MXN) con I.V.A. incluido.</p>
            <p>• Cotización válida durante los próximos 15 días naturales a partir de la fecha de emisión.</p>
            <p>• Refacciones 100% genuinas con respaldo y garantía de planta {brand}.</p>
            <p>• Cualquier trabajo o refacción adicional no contemplada será informada y autorizada previamente por el cliente.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-outline-variant bg-slate-50 px-6 py-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-outline-variant bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
}

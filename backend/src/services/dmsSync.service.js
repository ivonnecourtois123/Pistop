/**
 * Servicio unificado de importación y sincronización con el DMS (SIA NXT / Prosur).
 *
 * Puede ser invocado desde:
 * 1. La interfaz web (modal de importación rápida de archivo Excel o CSV).
 * 2. Un script programado / cron (node scripts/import-dms.js).
 * 3. Una integración futura por API con el DMS.
 */
const prisma = require('../config/prisma');
const statusMappingsService = require('./statusMappings.service');

function normalizeWhitespace(value) {
  return (value ?? '').toString().replace(/\s+/g, ' ').trim();
}

function normalizeOrderNumber(raw) {
  const digits = String(raw ?? '').replace(/^'/, '').trim();
  const parsed = parseInt(digits, 10);
  return Number.isNaN(parsed) ? null : String(parsed);
}

function parseYesNo(value) {
  const v = normalizeWhitespace(value).toUpperCase();
  if (v === 'SI' || v === 'S') return true;
  if (v === 'NO' || v === 'N') return false;
  return null;
}

function applyDmsTime(d, timeRaw, defaultHour = 9) {
  let hour = defaultHour;
  let min = 0;
  if (timeRaw != null && timeRaw !== '') {
    const tStr = String(timeRaw).replace(/^'/, '').trim();
    const colonMatch = tStr.match(/^(\d{1,2}):(\d{2})/);
    if (colonMatch) {
      hour = parseInt(colonMatch[1], 10);
      min = parseInt(colonMatch[2], 10);
    } else {
      const digits = tStr.replace(/\D/g, '').padStart(4, '0');
      if (digits.length >= 4) {
        hour = parseInt(digits.slice(-4, -2), 10);
        min = parseInt(digits.slice(-2), 10);
      }
    }
  }
  if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
    d.setHours(hour, min, 0, 0);
  } else {
    d.setHours(defaultHour, 0, 0, 0);
  }
}

// "YYYY-MM-DD", "DD/MM/YYYY" o Date con soporte de hora (HorEnt / HorProm)
function parseDmsDateTime(dateRaw, timeRaw = null, defaultHour = 9) {
  if (!dateRaw) return null;
  if (dateRaw instanceof Date && !isNaN(dateRaw.getTime())) {
    const d = new Date(dateRaw);
    applyDmsTime(d, timeRaw, defaultHour);
    return d;
  }
  const value = normalizeWhitespace(dateRaw);
  if (!value) return null;

  let d = null;
  // YYYY-MM-DD
  const isoMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, y, m, day] = isoMatch;
    d = new Date(Number(y), Number(m) - 1, Number(day));
  } else {
    // DD/MM/YYYY o DD-MM-YYYY (estándar en México y DMS SIA NXT / Prosur)
    const slashMatch = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (slashMatch) {
      const [, p1, p2, yearPart] = slashMatch;
      const year = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart);
      const n1 = Number(p1);
      const n2 = Number(p2);
      if (n1 > 12) {
        // n1 > 12 -> DD/MM/YYYY (ej. 14/10/2026)
        d = new Date(year, n2 - 1, n1);
      } else if (n2 > 12) {
        // n2 > 12 -> MM/DD/YYYY (ej. 10/14/2026 de Excel XLSX)
        d = new Date(year, n1 - 1, n2);
      } else {
        // Ambos <= 12: en Excel XLSX exportado con raw:false el formato estándar es MM/DD/YY (ej. 10/2/26 = 2 de octubre)
        d = new Date(year, n1 - 1, n2);
      }
    } else {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) d = parsed;
    }
  }

  if (!d || isNaN(d.getTime())) return null;
  applyDmsTime(d, timeRaw, defaultHour);
  return d;
}

function toTitleCase(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/(^|\s|\/)([a-záéíóúñ])/g, (_, sep, letter) => sep + letter.toUpperCase());
}

function resolveBrandAndModel(lineaRaw) {
  const linea = normalizeWhitespace(lineaRaw).toUpperCase();
  if (!linea) return { brand: 'Nissan', model: 'Modelo sin especificar' };
  if (linea.includes('RENAULT')) return { brand: 'Renault', model: toTitleCase(linea) };
  if (linea.includes('CHANGAN')) return { brand: 'Changan', model: toTitleCase(linea) };
  if (linea.startsWith('OTRO') || linea.startsWith('OTRA')) {
    return { brand: 'Otra marca', model: toTitleCase(linea) };
  }
  return { brand: 'Nissan', model: toTitleCase(linea) };
}

// Clasificación de categoría de servicio a partir del campo Trabajo / Tipo Servicio
function deriveServiceCategory(trabajoRaw) {
  const t = normalizeWhitespace(trabajoRaw).toUpperCase();
  if (t.includes('PREVIA')) return 'PREVIA';
  if (t.includes('DIAGNOSTICO') || t.includes('FALLA') || t.includes('RECLAMO')) {
    return 'DIAGNOSTICO_FALLA_RECLAMO';
  }
  if (t.includes('MANTENIMIENTO') || t.includes('SERVICIO')) {
    return 'MANTENIMIENTO';
  }
  return null;
}

async function findOrCreateCustomer(rawName) {
  const name = toTitleCase(rawName) || 'Cliente sin nombre';
  const existing = await prisma.customer.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.customer.create({ data: { name } });
}

async function findOrCreateVehicle({ plate, vin, brand, model, customerId, year }) {
  const normalizedPlate = plate || 'S/P';
  const normalizedVin = vin || `SIN-VIN-${Date.now()}`;
  const existing = await prisma.vehicle.findFirst({
    where: { plate: normalizedPlate, vin: normalizedVin },
  });
  if (existing) {
    if (year && !existing.year) {
      await prisma.vehicle.update({ where: { id: existing.id }, data: { year } });
    }
    return existing;
  }
  return prisma.vehicle.create({
    data: {
      plate: normalizedPlate,
      vin: normalizedVin,
      brand,
      model,
      year: year || null,
      customerId,
    },
  });
}

/**
 * Normaliza una fila proveniente de JSON / Sheet / CSV.
 * Mapea los encabezados de tu export real del DMS:
 * 'Orden  ', 'Recep', 'Torre  ', 'Entrada ', 'Num.Serie', 'Placas  ', 'Linea', 'Mod.', 'Cliente',
 * 'Mano Obra', 'Refacciones', 'E', 'Trabajo', 'Comentarios', etc.
 */
function normalizeDmsRow(row) {
  // Buscar claves tolerando espacios y mayúsculas/minúsculas
  const findValue = (prefixes) => {
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim().toUpperCase();
      for (const p of prefixes) {
        if (cleanKey === p.toUpperCase()) {
          return row[key];
        }
      }
    }
    return null;
  };

  const rawOrder = findValue(['Orden', 'No_Orden', 'No. Orden', 'Order', 'OT', 'Num_Orden', 'Num Orden']);
  const orderNumber = normalizeOrderNumber(rawOrder);
  if (!orderNumber) return null;

  const rawRecep = findValue(['Recep', 'Asesor', 'Receptor', 'Advisor', 'Recepcionista']);
  const rawEntrada = findValue(['FecEnt', 'Fec Ent', 'Fec_Ent', 'Fecha Entrada', 'FechaEntrada', 'Entrada', 'Fecha', 'Date', 'F. Entrada']);
  const rawHorEnt = findValue(['HorEnt', 'Hor Ent', 'Hor_Ent', 'Hora Entrada', 'HoraEntrada', 'Hora', 'Time', 'H. Entrada']);
  const rawPromesa = findValue(['FecProm', 'Fec Prom', 'Fec_Prom', 'Fecha Promesa', 'FechaPromesa', 'Fec Entrega', 'Fecha Entrega', 'Promesa', 'F. Promesa']);
  const rawHorProm = findValue(['HorProm', 'Hor Prom', 'Hor_Prom', 'Hora Promesa', 'HoraPromesa', 'Hora Entrega', 'H. Promesa']);
  const rawVin = findValue(['Serie', 'Num.Serie', 'Num_Serie', 'VIN', 'No. Serie', 'No_Serie']);
  const rawPlacas = findValue(['Placas', 'Placa', 'Plate']);
  const rawLinea = findValue(['TipoVeh', 'Tipo_Veh', 'Tipo Veh', 'Linea', 'Modelo', 'Model', 'TipoAuto', 'Vehiculo']);
  const rawMod = findValue(['Mod.', 'Mod', 'Año', 'Year', 'Modelo Año']);
  const rawCliente = findValue(['Nombre', 'Cliente', 'Customer', 'Nombre Cliente', 'Nombre_Cliente', 'Nombre del Cliente']);
  const rawTrabajo = findValue(['Trabajo', 'Tipo_Servicio', 'Tipo Servicio', 'Servicio']);
  const rawManoObra = findValue(['TotMO', 'Tot_MO', 'Tot MO', 'Mano Obra', 'MO', 'Labor']);
  const rawRefacciones = findValue(['TotRef', 'Tot_Ref', 'Tot Ref', 'Total Refacciones', 'Refacciones', 'Parts']);
  const rawTotal = findValue(['Total', 'Importe Total', 'Tot', 'Total General']);
  const rawEstatusDms = findValue(['E', 'Estatus', 'Estatus_Actual', 'Status', 'Estado']);
  const rawTorre = findValue(['Donde', 'Dónde', 'Torre', 'Tower', 'Ubicacion', 'Ubicación']);
  const rawComentarios = findValue(['Comentarios', 'Comentario', 'Observaciones', 'Notes']);
  const rawSeguro = findValue(['Seg', 'Seguro', 'Aseguradora', 'Insurer']);
  const rawSiniestro = findValue(['Siniestro', 'Reporte', 'No_Siniestro', 'Num_Siniestro', 'ReportNumber']);
  const rawProcesoHYP = findValue(['ProcesoHYP', 'Proceso HYP', 'Proceso_HYP', 'HYP']);

  const parsedYear = rawMod ? parseInt(String(rawMod).replace(/\D/g, ''), 10) : null;
  const numRefacciones = rawRefacciones ? parseFloat(String(rawRefacciones).replace(/[^\d.-]/g, '')) : 0;
  const partsNeeded = numRefacciones > 0;

  return {
    orderNumber,
    recep: normalizeWhitespace(rawRecep) || null,
    entradaDate: parseDmsDateTime(rawEntrada, rawHorEnt, 9),
    promiseDate: parseDmsDateTime(rawPromesa, rawHorProm, 18),
    vin: normalizeWhitespace(rawVin).toUpperCase() || 'SIN-VIN',
    plate: normalizeWhitespace(rawPlacas).toUpperCase() || 'S/P',
    linea: rawLinea,
    year: parsedYear && parsedYear > 1900 && parsedYear < 2100 ? parsedYear : null,
    clienteRaw: rawCliente,
    trabajo: normalizeWhitespace(rawTrabajo) || null,
    torre: normalizeWhitespace(rawTorre) || null,
    dmsStatus: normalizeWhitespace(rawEstatusDms) || null,
    comentarios: normalizeWhitespace(rawComentarios) || null,
    procesoHYP: normalizeWhitespace(rawProcesoHYP) || null,
    insurer: normalizeWhitespace(rawSeguro) || null,
    reportNumber: normalizeWhitespace(rawSiniestro) || null,
    partsNeeded,
    refaccionesAmount: numRefacciones,
    manoObraAmount: rawManoObra ? parseFloat(String(rawManoObra).replace(/[^\d.-]/g, '')) : 0,
    totalAmount: rawTotal ? parseFloat(String(rawTotal).replace(/[^\d.-]/g, '')) : 0,
  };
}

/**
 * Importa o actualiza una lista de filas en la base de datos.
 */
async function processDmsRows(rawRows, options = {}) {
  const { cleanPreviousDemos = false, agency = null } = options;

  if (cleanPreviousDemos) {
    await clearDemoOrders();
  }

  let createdCount = 0;
  let updatedCount = 0;
  const processedOrders = [];

  for (const raw of rawRows) {
    const row = normalizeDmsRow(raw);
    if (!row) continue;

    const customer = await findOrCreateCustomer(row.clienteRaw);
    const { brand, model } = resolveBrandAndModel(row.linea);
    const vehicle = await findOrCreateVehicle({
      plate: row.plate,
      vin: row.vin,
      brand,
      model,
      year: row.year,
      customerId: customer.id,
    });

    const internalStatus = await statusMappingsService.resolveInternalStatus(row.dmsStatus);
    const serviceCategory = deriveServiceCategory(row.trabajo);

    const notesParts = [
      row.torre ? `Ubicación: ${row.torre}` : null,
      row.trabajo ? `Trabajo: ${row.trabajo}` : null,
      row.procesoHYP ? `Proceso HYP: ${row.procesoHYP}` : null,
      row.comentarios ? `Comentarios: ${row.comentarios}` : null,
    ].filter(Boolean);
    const notes = notesParts.length ? notesParts.join(' | ') : null;

    const updateData = {
      vehicleId: vehicle.id,
      advisorCode: row.recep,
      dmsStatus: row.dmsStatus,
      serviceType: row.trabajo,
      serviceCategory: serviceCategory || undefined,
      partsNeeded: row.partsNeeded,
      notes: notes || undefined,
      ...(agency ? { agency } : {}),
      ...(row.entradaDate ? { receivedAt: row.entradaDate } : {}),
      ...(row.promiseDate ? { estimatedDeliveryAt: row.promiseDate } : {}),
      ...(row.insurer ? { insurer: row.insurer } : {}),
      ...(row.reportNumber ? { reportNumber: row.reportNumber } : {}),
    };

    const existing = await prisma.workOrder.findUnique({
      where: { orderNumber: row.orderNumber },
    });

    let workOrderId;
    if (!existing) {
      const created = await prisma.workOrder.create({
        data: {
          orderNumber: row.orderNumber,
          orderType: 'SERVICIO',
          status: internalStatus,
          ...updateData,
          statusEvents: {
            create: {
              status: internalStatus,
              note: 'Importado desde DMS (Excel)',
            },
          },
        },
      });
      workOrderId = created.id;
      createdCount++;
      processedOrders.push({ orderNumber: row.orderNumber, action: 'created' });
    } else {
      const updated = await prisma.workOrder.update({
        where: { id: existing.id },
        data: updateData,
      });
      workOrderId = updated.id;
      updatedCount++;
      processedOrders.push({ orderNumber: row.orderNumber, action: 'updated' });
    }

    // Si el Excel trae monto en Refacciones, sincronizar el registro de refacciones
    if (row.refaccionesAmount > 0) {
      const existingPart = await prisma.pendingPart.findFirst({
        where: { workOrderId },
      });
      if (!existingPart) {
        await prisma.pendingPart.create({
          data: {
            workOrderId,
            partNumber: 'REF-DMS',
            description: 'Refacciones asignadas en DMS',
            orderNumber: row.orderNumber,
            orderDate: row.entradaDate || new Date(),
            amount: row.refaccionesAmount,
            received: true,
          },
        });
      } else {
        await prisma.pendingPart.update({
          where: { id: existingPart.id },
          data: {
            amount: row.refaccionesAmount,
            received: true,
          },
        });
      }
    }
  }

  return {
    success: true,
    totalProcessed: processedOrders.length,
    created: createdCount,
    updated: updatedCount,
    orders: processedOrders,
  };
}

/**
 * Elimina órdenes de demostración (WO-) y clientes/vehículos huérfanos.
 */
async function clearDemoOrders() {
  const demoOrders = await prisma.workOrder.findMany({
    where: { orderNumber: { startsWith: 'WO-' } },
    include: { vehicle: true },
  });

  if (demoOrders.length === 0) return { removedCount: 0 };

  const vehicleIds = [...new Set(demoOrders.map((o) => o.vehicleId))];
  const customerIds = [...new Set(demoOrders.map((o) => o.vehicle.customerId))];

  await prisma.workOrder.deleteMany({
    where: { id: { in: demoOrders.map((o) => o.id) } },
  });

  for (const vehicleId of vehicleIds) {
    const remaining = await prisma.workOrder.count({ where: { vehicleId } });
    if (remaining === 0) {
      await prisma.vehicle.delete({ where: { id: vehicleId } }).catch(() => {});
    }
  }

  for (const customerId of customerIds) {
    const remaining = await prisma.vehicle.count({ where: { customerId } });
    if (remaining === 0) {
      await prisma.customer.delete({ where: { id: customerId } }).catch(() => {});
    }
  }

  return { removedCount: demoOrders.length };
}

module.exports = {
  normalizeDmsRow,
  processDmsRows,
  clearDemoOrders,
};

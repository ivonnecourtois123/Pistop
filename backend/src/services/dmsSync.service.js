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

// "YYYY-MM-DD" o "M/D/YY" o Date
function parseEntradaDate(raw, hour = 9) {
  if (!raw) return null;
  if (raw instanceof Date && !isNaN(raw.getTime())) {
    return raw;
  }
  const value = normalizeWhitespace(raw);
  
  // YYYY-MM-DD
  const isoMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return new Date(Number(y), Number(m) - 1, Number(d), hour, 0, 0);
  }

  // M/D/YY o D/M/YY
  const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const [, part1, part2, yearPart] = slashMatch;
    const year = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart);
    return new Date(year, Number(part1) - 1, Number(part2), hour, 0, 0);
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
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
  // Buscar claves tolerando espacios
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

  const rawOrder = findValue(['Orden', 'No_Orden', 'No. Orden', 'Order', 'OT']);
  const orderNumber = normalizeOrderNumber(rawOrder);
  if (!orderNumber) return null;

  const rawRecep = findValue(['Recep', 'Asesor', 'Receptor', 'Advisor']);
  const rawEntrada = findValue(['Entrada', 'Fecha Entrada', 'Fecha', 'Date']);
  const rawVin = findValue(['Num.Serie', 'VIN', 'Serie', 'No. Serie']);
  const rawPlacas = findValue(['Placas', 'Placa', 'Plate']);
  const rawLinea = findValue(['Linea', 'Modelo', 'Model', 'TipoAuto']);
  const rawMod = findValue(['Mod.', 'Mod', 'Año', 'Year', 'Modelo Año']);
  const rawCliente = findValue(['Cliente', 'Customer', 'Nombre Cliente']);
  const rawTrabajo = findValue(['Trabajo', 'Tipo_Servicio', 'Tipo Servicio', 'Servicio']);
  const rawManoObra = findValue(['Mano Obra', 'MO', 'Labor']);
  const rawRefacciones = findValue(['Refacciones', 'Parts']);
  const rawTotal = findValue(['Total', 'Importe Total']);
  const rawEstatusDms = findValue(['E', 'Estatus', 'Estatus_Actual', 'Status']);
  const rawTorre = findValue(['Torre', 'Tower']);
  const rawComentarios = findValue(['Comentarios', 'Comentario', 'Observaciones', 'Notes']);

  const parsedYear = rawMod ? parseInt(String(rawMod).replace(/\D/g, ''), 10) : null;
  const numRefacciones = rawRefacciones ? parseFloat(String(rawRefacciones).replace(/[^\d.-]/g, '')) : 0;
  const partsNeeded = numRefacciones > 0;

  return {
    orderNumber,
    recep: normalizeWhitespace(rawRecep) || null,
    entradaDate: parseEntradaDate(rawEntrada),
    vin: normalizeWhitespace(rawVin).toUpperCase() || 'SIN-VIN',
    plate: normalizeWhitespace(rawPlacas).toUpperCase() || 'S/P',
    linea: rawLinea,
    year: parsedYear && parsedYear > 1900 && parsedYear < 2100 ? parsedYear : null,
    clienteRaw: rawCliente,
    trabajo: normalizeWhitespace(rawTrabajo) || null,
    torre: normalizeWhitespace(rawTorre) || null,
    dmsStatus: normalizeWhitespace(rawEstatusDms) || null,
    comentarios: normalizeWhitespace(rawComentarios) || null,
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
  const { cleanPreviousDemos = false } = options;

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
      row.torre ? `Torre: ${row.torre}` : null,
      row.trabajo ? `Trabajo: ${row.trabajo}` : null,
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
      ...(row.entradaDate ? { receivedAt: row.entradaDate } : {}),
    };

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

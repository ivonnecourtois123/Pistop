/**
 * Importador de órdenes en proceso desde el DMS.
 *
 * Uso:
 *   node scripts/import-dms.js <ruta-OrdenesProceso.xlsx> [ruta-TablaOrdenes.xlsx]
 *
 * - El primer archivo (obligatorio) es la fuente principal: trae placas, VIN, cliente y línea
 *   por cada orden (columnas: Orden, Recep, Entrada, Num.Serie, Placas, Linea, Cliente,
 *   Hora_Entrega, Cliente_Espera, Estatus_Actual, Técnico, Servicio, Diagnóstico, Lavado).
 * - El segundo archivo (opcional) es un reporte complementario que solo trae Tipo_Servicio y
 *   Refacciones por número de orden; se usa únicamente para enriquecer las órdenes que ya
 *   existen en el archivo principal (no crea órdenes por sí solo, porque no trae placas/VIN/
 *   cliente).
 *
 * Es idempotente: se puede volver a correr con un export más reciente del DMS y actualizará
 * las órdenes existentes (por número de orden) en vez de duplicarlas. Este es el mismo script
 * que se debe automatizar (cron / tarea programada) para la sincronización periódica con el DMS.
 *
 * Columnas sin mapear a propósito por significado desconocido: " Ant" (antigüedad, se puede
 * derivar de receivedAt) y "T" (código numérico sin documentar). Si sabes qué representan,
 * agrégalas al esquema y a este importador.
 */
const path = require('path');
const XLSX = require('xlsx');
const prisma = require('../src/config/prisma');
const statusMappingsService = require('../src/services/statusMappings.service');

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
  if (v === 'SI') return true;
  if (v === 'NO') return false;
  return null;
}

// "M/D/YY" (ej. "7/9/26") -> Date. Asume años 2000+YY, consistente con las fechas del DMS.
function parseEntradaDate(raw, hour = 9) {
  const value = normalizeWhitespace(raw);
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (!match) return null;
  const [, m, d, y] = match;
  return new Date(2000 + Number(y), Number(m) - 1, Number(d), hour, 0, 0);
}

// "1021" o "'0823" (HHMM, a veces con apóstrofe inicial de Excel) combinado con la fecha de
// Entrada para reconstruir una fecha/hora de entrega estimada completa.
function parseHoraEntrega(raw, baseDate) {
  if (!baseDate) return null;
  const digits = String(raw ?? '').replace(/^'/, '').trim().padStart(4, '0');
  const match = digits.match(/^(\d{2})(\d{2})$/);
  if (!match) return null;
  const [, hh, mm] = match;
  const hours = Number(hh);
  const minutes = Number(mm);
  if (hours > 23 || minutes > 59) return null;
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function toTitleCase(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/(^|\s|\/)([a-záéíóúñ])/g, (_, sep, letter) => sep + letter.toUpperCase());
}

// La columna "Linea" mezcla marcas (RENAULT) y modelos abreviados de Nissan (VERSA, NP300/FRON).
function resolveBrandAndModel(lineaRaw) {
  const linea = normalizeWhitespace(lineaRaw).toUpperCase();
  if (!linea) return { brand: 'Nissan', model: 'Modelo sin especificar' };
  if (linea === 'RENAULT') return { brand: 'Renault', model: 'Modelo sin especificar' };
  if (linea.startsWith('OTRO') || linea.startsWith('OTRA')) {
    return { brand: 'Otra marca', model: toTitleCase(linea) };
  }
  return { brand: 'Nissan', model: toTitleCase(linea) };
}

function readOrdenesProceso(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });

  return rows
    .map((r) => {
      const orderNumber = normalizeOrderNumber(r['Orden  ']);
      if (!orderNumber) return null;

      const entradaDate = parseEntradaDate(r['Entrada ']);
      return {
        orderNumber,
        recep: normalizeWhitespace(r['Recep']) || null,
        entradaDate,
        vin: normalizeWhitespace(r['Num.Serie           ']).toUpperCase(),
        plate: normalizeWhitespace(r['Placas  ']).toUpperCase(),
        linea: r['Linea     '],
        clienteRaw: r['Cliente                               '],
        estimatedDeliveryAt: parseHoraEntrega(r['Hora_Entrega'], entradaDate),
        customerWaiting: parseYesNo(r['Cliente_Espera']),
        dmsStatus: normalizeWhitespace(r['Estatus_Actual']) || null,
        tecnico: normalizeWhitespace(r['Técnico']) || null,
        servicioNota: normalizeWhitespace(r['Servicio']) || null,
        diagnosticoNota: normalizeWhitespace(r['Diagnóstico']) || null,
        washNeeded: parseYesNo(r['Lavado']),
      };
    })
    .filter(Boolean);
}

function readTablaOrdenes(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });

  const map = new Map();
  for (const r of rows) {
    const orderNumber = normalizeOrderNumber(r['No_Orden']);
    if (!orderNumber) continue;
    map.set(orderNumber, {
      serviceType: normalizeWhitespace(r['Tipo_Servicio']) || null,
      partsNeeded: parseYesNo(r['Refacciones']),
    });
  }
  return map;
}

async function findOrCreateCustomer(rawName) {
  const name = toTitleCase(rawName) || 'Cliente sin nombre';
  const existing = await prisma.customer.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.customer.create({ data: { name } });
}

async function findOrCreateVehicle({ plate, vin, brand, model, customerId }) {
  const existing = await prisma.vehicle.findFirst({ where: { plate, vin } });
  if (existing) return existing;
  return prisma.vehicle.create({ data: { plate, vin, brand, model, customerId } });
}

async function findOrCreateTechnician(rawName) {
  if (!rawName) return null;
  const name = toTitleCase(rawName);
  const existing = await prisma.technician.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.technician.create({ data: { name } });
}

async function upsertWorkOrder(row, enrichment) {
  const customer = await findOrCreateCustomer(row.clienteRaw);
  const { brand, model } = resolveBrandAndModel(row.linea);
  const vehicle = await findOrCreateVehicle({
    plate: row.plate,
    vin: row.vin,
    brand,
    model,
    customerId: customer.id,
  });
  const technician = await findOrCreateTechnician(row.tecnico);
  const internalStatus = await statusMappingsService.resolveInternalStatus(row.dmsStatus);

  const notesParts = [row.diagnosticoNota, row.servicioNota].filter(Boolean);
  const notes = notesParts.length ? notesParts.join(' / ') : null;

  const data = {
    vehicleId: vehicle.id,
    technicianId: technician?.id ?? null,
    advisorCode: row.recep,
    status: internalStatus,
    dmsStatus: row.dmsStatus,
    serviceType: enrichment?.serviceType ?? null,
    partsNeeded: enrichment?.partsNeeded ?? null,
    customerWaiting: row.customerWaiting,
    washNeeded: row.washNeeded,
    notes,
    ...(row.entradaDate ? { receivedAt: row.entradaDate } : {}),
    ...(row.estimatedDeliveryAt ? { estimatedDeliveryAt: row.estimatedDeliveryAt } : {}),
  };

  const existing = await prisma.workOrder.findUnique({ where: { orderNumber: row.orderNumber } });

  if (!existing) {
    await prisma.workOrder.create({
      data: {
        orderNumber: row.orderNumber,
        ...data,
        statusEvents: { create: { status: internalStatus, note: 'Importado desde DMS' } },
      },
    });
    return 'created';
  }

  await prisma.workOrder.update({ where: { id: existing.id }, data });
  if (existing.status !== internalStatus) {
    await prisma.statusEvent.create({
      data: { workOrderId: existing.id, status: internalStatus, note: 'Actualizado desde DMS' },
    });
  }
  return 'updated';
}

async function main() {
  const [ordenesProcesoPath, tablaOrdenesPath] = process.argv.slice(2);
  if (!ordenesProcesoPath) {
    console.error('Uso: node scripts/import-dms.js <ruta-OrdenesProceso.xlsx> [ruta-TablaOrdenes.xlsx]');
    process.exit(1);
  }

  const rows = readOrdenesProceso(path.resolve(ordenesProcesoPath));
  const enrichmentMap = tablaOrdenesPath ? readTablaOrdenes(path.resolve(tablaOrdenesPath)) : new Map();

  let created = 0;
  let updated = 0;
  const enrichedCount = rows.filter((r) => enrichmentMap.has(r.orderNumber)).length;

  for (const row of rows) {
    const result = await upsertWorkOrder(row, enrichmentMap.get(row.orderNumber));
    if (result === 'created') created += 1;
    else updated += 1;
  }

  if (tablaOrdenesPath) {
    const onlyInTablaOrdenes = [...enrichmentMap.keys()].filter(
      (orderNumber) => !rows.some((r) => r.orderNumber === orderNumber)
    );
    if (onlyInTablaOrdenes.length) {
      console.log(
        `\nAviso: ${onlyInTablaOrdenes.length} orden(es) de "${path.basename(tablaOrdenesPath)}" no están en "${path.basename(
          ordenesProcesoPath
        )}" y se omitieron (sin placa/VIN/cliente no se puede crear la orden): ${onlyInTablaOrdenes.join(', ')}`
      );
    }
  }

  console.log(`\nImportación completada: ${created} orden(es) creada(s), ${updated} actualizada(s).`);
  console.log(`Órdenes enriquecidas con Tipo_Servicio/Refacciones: ${enrichedCount} de ${rows.length}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

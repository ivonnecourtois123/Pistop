/**
 * Agrega 3 órdenes de trabajo de prueba, recibidas "hoy", para poblar el grupo "Ingresadas
 * Hoy" de Unidades en Proceso. Crea también su vehículo/cliente si no existen (por placa).
 */
const prisma = require('../src/config/prisma');

const ADVISOR_EMAIL = 'asesor@pitstop.mx';
const TECHNICIAN_ID = 'b7c2f4e1-9a3d-4c5b-8e6f-1d2a3b4c5d02';

const TEST_ORDERS = [
  {
    orderNumber: 'WO-TEST-01',
    status: 'RECIBIDO',
    customer: { name: 'Laura Gómez', phone: '+52 961 555 0101' },
    vehicle: { brand: 'Nissan', model: 'Versa', year: 2022, color: 'Azul', plate: 'TST-0001', vin: '3N1CN7AP0DL900001' },
  },
  {
    orderNumber: 'WO-TEST-02',
    status: 'EN_TALLER',
    customer: { name: 'Mario Hernández', phone: '+52 961 555 0102' },
    vehicle: { brand: 'Nissan', model: 'March', year: 2021, color: 'Negro', plate: 'TST-0002', vin: '3N1CN7AP0DL900002' },
  },
  {
    orderNumber: 'WO-TEST-03',
    status: 'LAVADO',
    customer: { name: 'Ana Torres', phone: '+52 961 555 0103' },
    vehicle: { brand: 'Nissan', model: 'Kicks', year: 2023, color: 'Blanco', plate: 'TST-0003', vin: '3N1CN7AP0DL900003' },
  },
];

async function main() {
  const advisor = await prisma.user.findUnique({ where: { email: ADVISOR_EMAIL } });
  if (!advisor) throw new Error(`No se encontró el asesor ${ADVISOR_EMAIL} — corre el seed primero.`);

  const now = new Date();

  for (const order of TEST_ORDERS) {
    const existing = await prisma.workOrder.findUnique({ where: { orderNumber: order.orderNumber } });
    if (existing) {
      console.log(`Ya existe ${order.orderNumber}, se omite.`);
      continue;
    }

    let vehicle = await prisma.vehicle.findFirst({ where: { plate: order.vehicle.plate } });
    if (!vehicle) {
      const customer = await prisma.customer.create({ data: order.customer });
      vehicle = await prisma.vehicle.create({ data: { ...order.vehicle, customerId: customer.id } });
    }

    await prisma.workOrder.create({
      data: {
        orderNumber: order.orderNumber,
        vehicleId: vehicle.id,
        technicianId: TECHNICIAN_ID,
        advisorId: advisor.id,
        status: order.status,
        receivedAt: now,
        statusEvents: { create: { status: order.status, occurredAt: now } },
      },
    });
    console.log(`Creada ${order.orderNumber} — ${vehicle.brand} ${vehicle.model} ${vehicle.plate} (${order.status})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

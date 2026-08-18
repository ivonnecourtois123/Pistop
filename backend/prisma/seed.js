const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// IDs fijos (con formato UUID v4 válido) para que el seed sea idempotente.
// Los validadores Zod del backend exigen z.string().uuid() en customerId/technicianId,
// así que estos identificadores deben ser UUIDs reales, no slugs legibles.
const SEED_CUSTOMER_ID = 'a3f1e6d2-4b8c-4e11-9c3a-8f2d6b7e1a01';
const SEED_TECHNICIAN_ID = 'b7c2f4e1-9a3d-4c5b-8e6f-1d2a3b4c5d02';

async function main() {
  const passwordHash = await bcrypt.hash('pitstop123', 10);

  const advisor = await prisma.user.upsert({
    where: { email: 'asesor@pitstop.mx' },
    update: {},
    create: {
      name: 'Service Advisor',
      email: 'asesor@pitstop.mx',
      passwordHash,
      role: 'ADVISOR',
    },
  });

  const customer = await prisma.customer.upsert({
    where: { id: SEED_CUSTOMER_ID },
    update: {},
    create: {
      id: SEED_CUSTOMER_ID,
      name: 'Ricardo Morales',
      phone: '+52 961 123 4567',
      email: 'ricardo.morales@example.com',
    },
  });

  let vehicle = await prisma.vehicle.findFirst({ where: { plate: 'ABC-1234' } });
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        brand: 'Nissan',
        model: 'Sentra',
        year: 2023,
        color: 'Plata',
        plate: 'ABC-1234',
        vin: '1N4AL3AP0DC123456',
        logoUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCTxI-afqXClAtgPQSA7ZXJ0HWkbQi2xnHpL0ck4d0uZ3p1-P78ZkYQuw_GLhYMjR_h_XN30QAo8NSKlczJ2Gj53qmUHnDn7Xbobi-1672v9U4qYOt7TjddOY04i0grcY_3q4HSuE9UZSoVADFj1XrdRL7IePdE_V7qOACSUnrnFcGwPQbtKkC2ZBcWaRsvMvMpdlLCulsXDiDDeQFUw3JVsuwfxZmAkYV3Gygg99NbGL5IlRaUlDlA0Q',
        customerId: customer.id,
      },
    });
  }

  const technician = await prisma.technician.upsert({
    where: { id: SEED_TECHNICIAN_ID },
    update: {},
    create: {
      id: SEED_TECHNICIAN_ID,
      name: 'Ing. Javier S.',
      specialty: 'Diagnóstico y afinación',
    },
  });

  const today = new Date();
  const estimatedDelivery = new Date(today);
  estimatedDelivery.setHours(17, 30, 0, 0);

  const existingOrder = await prisma.workOrder.findUnique({ where: { orderNumber: 'WO-9421' } });
  if (!existingOrder) {
    await prisma.workOrder.create({
      data: {
        orderNumber: 'WO-9421',
        vehicleId: vehicle.id,
        technicianId: technician.id,
        advisorId: advisor.id,
        status: 'EN_TALLER',
        estimatedDeliveryAt: estimatedDelivery,
        statusEvents: {
          create: [{ status: 'RECIBIDO' }, { status: 'EN_TALLER' }],
        },
      },
    });
  }

  // Órdenes adicionales para poblar las estadísticas del dashboard (Total hoy / Terminados / Por entregar)
  // Todos los vehículos de ejemplo son Nissan, ya que el taller solo atiende esa marca.
  const extraVehicles = [
    { plate: 'XYZ-9821', model: 'Versa', color: 'Blanco', vin: '3N1AB7AP0DL123450' },
    { plate: 'JKT-4410', model: 'Kicks', color: 'Rojo', vin: '3N1CP5DV0DL123451' },
    { plate: 'MNB-7723', model: 'X-Trail', color: 'Gris', vin: '5N1AT2MT0DC123452' },
  ];
  const extraStatuses = ['TERMINADO', 'ENTREGADO', 'RECIBIDO'];
  for (let i = 0; i < extraVehicles.length; i += 1) {
    const { plate, model, color, vin } = extraVehicles[i];
    const existingVehicle = await prisma.vehicle.findFirst({ where: { plate } });
    const extraVehicle =
      existingVehicle ??
      (await prisma.vehicle.create({
        data: {
          brand: 'Nissan',
          model,
          year: 2021 + i,
          color,
          plate,
          vin,
          customerId: customer.id,
        },
      }));

    const orderNumber = `WO-${9400 + i}`;
    const existing = await prisma.workOrder.findUnique({ where: { orderNumber } });
    if (!existing) {
      await prisma.workOrder.create({
        data: {
          orderNumber,
          vehicleId: extraVehicle.id,
          technicianId: technician.id,
          advisorId: advisor.id,
          status: extraStatuses[i],
          statusEvents: { create: { status: extraStatuses[i] } },
        },
      });
    }
  }

  // Valores por defecto de capacidad — editables desde Configuración una vez implementada esa
  // sección (tarea #52). Servicio en horas/día; HYP en cupo de unidades simultáneas por técnico.
  await prisma.capacitySettings.upsert({
    where: { team: 'SERVICIO' },
    update: {},
    create: { team: 'SERVICIO', hoursPerDay: 8, efficiency: 0.9, productivity: 1.0 },
  });
  await prisma.capacitySettings.upsert({
    where: { team: 'HYP' },
    update: {},
    create: { team: 'HYP', unitsPerTechnician: 2 },
  });

  // Horas estándar provisionales por tipo de servicio, hasta que exista el catálogo
  // administrable desde Configuración.
  const categoryHours = [
    { category: 'MANTENIMIENTO', hours: 1.5 },
    { category: 'DIAGNOSTICO_FALLA_RECLAMO', hours: 3 },
    { category: 'PREVIA', hours: 1 },
  ];
  for (const { category, hours } of categoryHours) {
    await prisma.serviceCategoryHours.upsert({
      where: { category },
      update: {},
      create: { category, hours },
    });
  }

  console.log('Seed completado. Usuario de prueba: asesor@pitstop.mx / pitstop123');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

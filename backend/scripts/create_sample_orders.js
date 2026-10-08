const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creando 3 órdenes de ejemplo para cada módulo (Servicio, HYP, Inmovilizados, Seguros)...');

  // Obtener o crear un usuario asesor
  let advisor = await prisma.user.findFirst({ where: { email: 'asesor@pitstop.mx' } });
  if (!advisor) {
    advisor = await prisma.user.findFirst();
  }

  // Obtener o crear un técnico
  let technician = await prisma.technician.findFirst({ where: { active: true } });
  if (!technician) {
    technician = await prisma.technician.create({
      data: {
        name: 'Ing. Javier S.',
        specialty: 'Diagnóstico y afinación',
        team: 'SERVICIO',
        active: true,
      },
    });
  }

  // Clientes de ejemplo
  const customer1 = await prisma.customer.upsert({
    where: { id: 'c1111111-1111-4111-8111-111111111111' },
    update: {},
    create: {
      id: 'c1111111-1111-4111-8111-111111111111',
      name: 'Ana Karen Torres',
      phone: '+52 961 555 1101',
      email: 'ana.torres@example.com',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'c2222222-2222-4222-8222-222222222222' },
    update: {},
    create: {
      id: 'c2222222-2222-4222-8222-222222222222',
      name: 'Carlos Eduardo Méndez',
      phone: '+52 961 555 2202',
      email: 'carlos.mendez@example.com',
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { id: 'c3333333-3333-4333-8333-333333333333' },
    update: {},
    create: {
      id: 'c3333333-3333-4333-8333-333333333333',
      name: 'Constructora del Sureste S.A.',
      phone: '+52 961 555 3303',
      email: 'contacto@suresteconst.mx',
    },
  });

  // Limpiar órdenes de prueba anteriores si existen
  await prisma.workOrder.deleteMany({
    where: {
      orderNumber: {
        in: [
          'WO-SRV-501',
          'WO-SRV-502',
          'WO-SRV-503',
          'WO-SRV-504',
          'WO-SRV-505',
          'WO-SRV-506',
          'WO-HYP-601',
          'WO-HYP-602',
          'WO-HYP-603',
        ],
      },
    },
  });

  // ==========================================
  // 1. MÓDULO SERVICIO MECÁNICO (3 Órdenes)
  // ==========================================
  console.log('📦 1. Creando órdenes de Servicio Mecánico...');

  // Vehículo 1 Servicio: Versa
  const vSrv1 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'Versa Sense',
      year: 2023,
      color: 'Plata Metálico',
      plate: 'DSH-102-A',
      vin: '3N1CN8EV7PL501001',
      customerId: customer1.id,
    },
  });

  const deliverySrv1 = new Date();
  deliverySrv1.setHours(17, 30, 0, 0);

  const woSrv1 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-SRV-501',
      orderType: 'SERVICIO',
      status: 'EN_TALLER',
      agency: 'Tuxtla Poniente',
      serviceCategory: 'MANTENIMIENTO',
      vehicleId: vSrv1.id,
      technicianId: technician.id,
      advisorId: advisor?.id,
      estimatedDeliveryAt: deliverySrv1,
      notes: 'Servicio periódico de 40,000 km y revisión general de frenos.',
      partsReady: true,
      statusEvents: {
        create: [
          { status: 'RECIBIDO', occurredAt: new Date(Date.now() - 4 * 3600 * 1000), note: 'Recepción en rampa 1' },
          { status: 'EN_TALLER', occurredAt: new Date(Date.now() - 2 * 3600 * 1000), note: 'Asignado a bahía de mantenimiento' },
        ],
      },
      stageComments: {
        create: [
          {
            stage: 'EN_TALLER',
            comment: 'Se drenó aceite sintético 5W30 y se cambiaron filtros. Procediendo con balatas.',
            userId: advisor.id,
          },
        ],
      },
      pendingParts: {
        create: [
          {
            partNumber: '15208-65F0E',
            description: 'Filtro de Aceite Motor Nissan',
            orderNumber: 'PED-DMS-8812',
            orderDate: new Date(Date.now() - 24 * 3600 * 1000),
            amount: 280.0,
            received: true,
            receivedAt: new Date(),
          },
          {
            partNumber: 'AY040-NS120',
            description: 'Juego de Balatas Delanteras',
            orderNumber: 'PED-DMS-8813',
            orderDate: new Date(Date.now() - 24 * 3600 * 1000),
            amount: 2150.0,
            received: true,
            receivedAt: new Date(),
          },
        ],
      },
    },
  });

  // Vehículo 2 Servicio: Changan CS55
  const vSrv2 = await prisma.vehicle.create({
    data: {
      brand: 'Changan',
      model: 'CS55 Plus',
      year: 2024,
      color: 'Gris Grafito',
      plate: 'DSJ-884-B',
      vin: 'LS5A2B506PA502002',
      customerId: customer2.id,
    },
  });

  const deliverySrv2 = new Date(Date.now() + 24 * 3600 * 1000);
  deliverySrv2.setHours(13, 0, 0, 0);

  const woSrv2 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-SRV-502',
      orderType: 'SERVICIO',
      status: 'RECIBIDO',
      subState: 'POR_ASIGNAR',
      agency: 'Tapachula',
      serviceCategory: 'DIAGNOSTICO_FALLA_RECLAMO',
      diagnosisNeeded: true,
      customerWaiting: true,
      vehicleId: vSrv2.id,
      advisorId: advisor?.id,
      estimatedDeliveryAt: deliverySrv2,
      notes: 'Cliente reporta testigo de Check Engine encendido y pérdida de potencia intermitente.',
      partsReady: false,
      statusEvents: {
        create: [{ status: 'RECIBIDO', occurredAt: new Date(), note: 'Recepción inicial asesor' }],
      },
      stageComments: {
        create: [
          {
            stage: 'RECIBIDO',
            comment: 'Cliente espera en sala de espera VIP. Urgente diagnóstico.',
            userId: advisor.id,
          },
        ],
      },
      pendingParts: {
        create: [
          {
            partNumber: '22401-ED815',
            description: 'Juego Bujías Iridium Platino',
            orderNumber: 'PED-DMS-9140',
            orderDate: new Date(),
            amount: 2450.0,
            received: false,
          },
          {
            partNumber: '41060-3ST0A',
            description: 'Juego de Balatas de Freno Cerámicas Delanteras',
            orderNumber: 'PED-DMS-9141',
            orderDate: new Date(Date.now() - 24 * 3600 * 1000),
            amount: 3820.0,
            received: false,
          },
        ],
      },
    },
  });

  // Vehículo 3 Servicio: Renault Kwid
  const vSrv3 = await prisma.vehicle.create({
    data: {
      brand: 'Renault',
      model: 'Kwid Outsider',
      year: 2023,
      color: 'Blanco Glaciar',
      plate: 'DSE-339-C',
      vin: '9FBHSR8A8NL503003',
      customerId: customer3.id,
    },
  });

  const deliverySrv3 = new Date();
  deliverySrv3.setHours(18, 0, 0, 0);

  const woSrv3 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-SRV-503',
      orderType: 'SERVICIO',
      status: 'LAVADO',
      agency: 'Tuxtla Oriente',
      serviceCategory: 'PREVIA',
      washNeeded: true,
      partsReady: true,
      vehicleId: vSrv3.id,
      technicianId: technician.id,
      advisorId: advisor?.id,
      estimatedDeliveryAt: deliverySrv3,
      notes: 'Alistamiento de servicio preventivo y lavado de cortesía completado.',
      statusEvents: {
        create: [
          { status: 'RECIBIDO', occurredAt: new Date(Date.now() - 6 * 3600 * 1000) },
          { status: 'EN_TALLER', occurredAt: new Date(Date.now() - 4 * 3600 * 1000) },
          { status: 'LAVADO', occurredAt: new Date(Date.now() - 1 * 3600 * 1000), note: 'En rampa de lavado' },
        ],
      },
    },
  });

  // Vehículo 4 Servicio (Rezagado > 15 Días): Nissan Kicks
  const vSrv4 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'Kicks Advance',
      year: 2023,
      color: 'Azul Cobalto',
      plate: 'DSE-910-K',
      vin: '3N1CP5CU8PL504004',
      customerId: customer1.id,
    },
  });

  const woSrv4 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-SRV-504',
      orderType: 'SERVICIO',
      status: 'EN_TALLER',
      agency: 'Tuxtla Poniente',
      serviceCategory: 'MANTENIMIENTO',
      vehicleId: vSrv4.id,
      technicianId: technician.id,
      advisorId: advisor?.id,
      receivedAt: new Date(Date.now() - 18 * 24 * 3600 * 1000),
      createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000),
      notes: 'Unidad en espera de amortiguadores delanteros. Antigüedad: 18 días.',
      partsReady: false,
      statusEvents: {
        create: [
          { status: 'RECIBIDO', occurredAt: new Date(Date.now() - 18 * 24 * 3600 * 1000) },
          { status: 'EN_TALLER', occurredAt: new Date(Date.now() - 15 * 24 * 3600 * 1000) },
        ],
      },
      pendingParts: {
        create: [
          {
            partNumber: 'E4302-5RB0A',
            description: 'Amortiguador Delantero Derecho Kicks',
            orderNumber: 'PED-DMS-7721',
            orderDate: new Date(Date.now() - 16 * 24 * 3600 * 1000),
            amount: 3450.0,
            received: false,
          },
        ],
      },
    },
  });

  // Vehículo 5 Servicio (Rezagado > 30 Días): Changan CS35
  const vSrv5 = await prisma.vehicle.create({
    data: {
      brand: 'Changan',
      model: 'CS35 Plus',
      year: 2022,
      color: 'Rojo Carmesí',
      plate: 'DSF-442-M',
      vin: 'LS5A2B506NA505005',
      customerId: customer2.id,
    },
  });

  const woSrv5 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-SRV-505',
      orderType: 'SERVICIO',
      status: 'EN_TALLER',
      agency: 'Tapachula',
      serviceCategory: 'DIAGNOSTICO_FALLA_RECLAMO',
      vehicleId: vSrv5.id,
      technicianId: technician.id,
      advisorId: advisor?.id,
      receivedAt: new Date(Date.now() - 36 * 24 * 3600 * 1000),
      createdAt: new Date(Date.now() - 36 * 24 * 3600 * 1000),
      notes: 'Diagnóstico de transmisión automática en seguimiento. Antigüedad: 36 días.',
      partsReady: false,
      statusEvents: {
        create: [
          { status: 'RECIBIDO', occurredAt: new Date(Date.now() - 36 * 24 * 3600 * 1000) },
          { status: 'EN_TALLER', occurredAt: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
        ],
      },
      pendingParts: {
        create: [
          {
            partNumber: '31705-28X0A',
            description: 'Cuerpo de Válvulas Transmisión CVT',
            orderNumber: 'PED-DMS-6102',
            orderDate: new Date(Date.now() - 32 * 24 * 3600 * 1000),
            amount: 14800.0,
            received: false,
          },
        ],
      },
    },
  });

  // Vehículo 6 Servicio (Rezagado > 60 Días Crítica): Renault Duster
  const vSrv6 = await prisma.vehicle.create({
    data: {
      brand: 'Renault',
      model: 'Duster Iconic Turbo',
      year: 2021,
      color: 'Naranja Atacama',
      plate: 'DSG-118-T',
      vin: '9FBHSR8A8ML506006',
      customerId: customer3.id,
    },
  });

  const woSrv6 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-SRV-506',
      orderType: 'SERVICIO',
      status: 'RECIBIDO',
      agency: 'San Cristóbal',
      serviceCategory: 'MANTENIMIENTO',
      vehicleId: vSrv6.id,
      advisorId: advisor?.id,
      receivedAt: new Date(Date.now() - 68 * 24 * 3600 * 1000),
      createdAt: new Date(Date.now() - 68 * 24 * 3600 * 1000),
      notes: 'Unidad rezagada por reclamo de garantía de motor en planta. Antigüedad: 68 días.',
      partsReady: false,
      statusEvents: {
        create: [{ status: 'RECIBIDO', occurredAt: new Date(Date.now() - 68 * 24 * 3600 * 1000) }],
      },
      pendingParts: {
        create: [
          {
            partNumber: '11041-00Q0A',
            description: 'Cabeza de Motor Completa con Válvulas',
            orderNumber: 'PED-DMS-5099',
            orderDate: new Date(Date.now() - 65 * 24 * 3600 * 1000),
            amount: 28900.0,
            received: false,
          },
        ],
      },
    },
  });

  // ==========================================
  // 2. MÓDULO HOJALATERÍA Y PINTURA (HYP) (3 Órdenes)
  // ==========================================
  console.log('🎨 2. Creando órdenes de Hojalatería y Pintura (HYP)...');

  // Vehículo 1 HYP: Frontier PRO-4X
  const vHyp1 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'Frontier PRO-4X',
      year: 2024,
      color: 'Gris Volcánico',
      plate: 'CW-9102-D',
      vin: '1N6AD0ER5RN601001',
      customerId: customer3.id,
    },
  });

  const woHyp1 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-HYP-601',
      orderType: 'HYP',
      status: 'PRESUPUESTO_AUTORIZADO',
      agency: 'Tuxtla Poniente',
      insurer: 'Qualitas',
      reportNumber: 'QUAL-2026-8819',
      vehicleId: vHyp1.id,
      advisorId: advisor?.id,
      estimatedDeliveryAt: new Date(Date.now() + 5 * 24 * 3600 * 1000),
      notes: 'Colisión lateral izquierda. Presupuesto autorizado por ajustador de Qualitas.',
      statusEvents: {
        create: [
          { status: 'EN_VALUACION', occurredAt: new Date(Date.now() - 48 * 3600 * 1000) },
          { status: 'PRESUPUESTO_ENVIADO', occurredAt: new Date(Date.now() - 24 * 3600 * 1000) },
          { status: 'PRESUPUESTO_AUTORIZADO', occurredAt: new Date(Date.now() - 6 * 3600 * 1000), note: 'Autorización recibida' },
        ],
      },
      stageComments: {
        create: [
          {
            stage: 'PRESUPUESTO_AUTORIZADO',
            comment: 'Se autorizó cambio de salpicadera y fascia delantera por $34,500 MXN.',
            userId: advisor.id,
          },
        ],
      },
      pendingParts: {
        create: [
          {
            partNumber: '62022-9BU0H',
            description: 'Fascia Delantera Frontier PRO-4X',
            orderNumber: 'PED-DMS-9201',
            orderDate: new Date(Date.now() - 12 * 3600 * 1000),
            amount: 14850.0,
            received: false,
          },
          {
            partNumber: '26010-9BU0A',
            description: 'Faro Principal LED Izquierdo',
            orderNumber: 'PED-DMS-9202',
            orderDate: new Date(Date.now() - 12 * 3600 * 1000),
            amount: 9600.0,
            received: true,
            receivedAt: new Date(),
          },
        ],
      },
    },
  });

  // Vehículo 2 HYP: Changan CS55
  const vHyp2 = await prisma.vehicle.create({
    data: {
      brand: 'Changan',
      model: 'CS55 Plus',
      year: 2024,
      color: 'Azul Eléctrico',
      plate: 'CH-4419-A',
      vin: 'LS5A2B506PA602002',
      customerId: customer2.id,
    },
  });

  const woHyp2 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-HYP-602',
      orderType: 'HYP',
      status: 'PINTURA',
      agency: 'San Cristóbal',
      insurer: 'GNP',
      reportNumber: 'GNP-99412-A',
      vehicleId: vHyp2.id,
      advisorId: advisor?.id,
      estimatedDeliveryAt: new Date(Date.now() + 2 * 24 * 3600 * 1000),
      notes: 'Reparación de cofre y fascia delantera. Unidad en cabina de horneado.',
      statusEvents: {
        create: [
          { status: 'EN_VALUACION', occurredAt: new Date(Date.now() - 72 * 3600 * 1000) },
          { status: 'PRESUPUESTO_AUTORIZADO', occurredAt: new Date(Date.now() - 48 * 3600 * 1000) },
          { status: 'CONFORMADO_LAMINA', occurredAt: new Date(Date.now() - 24 * 3600 * 1000) },
          { status: 'PINTURA', occurredAt: new Date(Date.now() - 4 * 3600 * 1000), note: 'Aplicación de bicapa y barniz' },
        ],
      },
      stageComments: {
        create: [
          {
            stage: 'PINTURA',
            comment: 'Color azul igualado por espectrofotómetro al 100%. Secado en horno programado.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // Vehículo 3 HYP: Renault Duster
  const vHyp3 = await prisma.vehicle.create({
    data: {
      brand: 'Renault',
      model: 'Duster Iconic',
      year: 2023,
      color: 'Naranja Cobrizo',
      plate: 'REN-772-B',
      vin: '9FBHSR8A8NP603003',
      customerId: customer1.id,
    },
  });

  const woHyp3 = await prisma.workOrder.create({
    data: {
      orderNumber: 'WO-HYP-603',
      orderType: 'HYP',
      status: 'EN_VALUACION',
      agency: 'Comitán',
      insurer: 'Zurich',
      reportNumber: 'ZUR-00817-X',
      vehicleId: vHyp3.id,
      advisorId: advisor?.id,
      notes: 'Unidad recibida en grúa. Pendiente valuación de daños estructurales.',
      statusEvents: {
        create: [{ status: 'EN_VALUACION', occurredAt: new Date(), note: 'Ingreso en grúa a patio HYP' }],
      },
      stageComments: {
        create: [
          {
            stage: 'EN_VALUACION',
            comment: 'Se cargaron fotografías de daños en el expediente digital.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // ==========================================
  // 3. MÓDULO INMOVILIZADOS (3 Registros)
  // ==========================================
  console.log('🚗 3. Creando registros de Unidades Inmovilizadas...');

  // Inmovilizado 1: Nissan March (14 días de daño - Bracket 1-30)
  const vImm1 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'March Advance',
      year: 2024,
      color: 'Azul Cobalto',
      plate: 'DSR-112-E',
      vin: '3N1AK31S8RL701001',
      customerId: customer1.id,
    },
  });

  const imm1 = await prisma.immobilizedUnit.create({
    data: {
      vehicleId: vImm1.id,
      damageDate: new Date(Date.now() - 14 * 24 * 3600 * 1000),
      treatmentType: 'GARANTIA',
      dmsReportNumber: 'GAR-DMS-2026-041',
      agency: 'Tuxtla Poniente',
      description: 'Falla en módulo electrónico BCM de stock nuevo. Pieza en backorder con planta Aguascalientes.',
      resolved: false,
      registeredById: advisor.id,
      comments: {
        create: [
          {
            comment: 'Solicitud escalada a soporte técnico Nissan Mexicana para acelerar envío de BCM.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // Inmovilizado 2: Changan Alsvin (38 días de daño - Bracket 31-60)
  const vImm2 = await prisma.vehicle.create({
    data: {
      brand: 'Changan',
      model: 'Alsvin AT',
      year: 2024,
      color: 'Rojo Rubí',
      plate: 'CH-9021-C',
      vin: 'LS5A1A405RA702002',
      customerId: customer2.id,
    },
  });

  const imm2 = await prisma.immobilizedUnit.create({
    data: {
      vehicleId: vImm2.id,
      damageDate: new Date(Date.now() - 38 * 24 * 3600 * 1000),
      treatmentType: 'REPARACION_INTERNA',
      agency: 'Tapachula',
      description: 'Rayón y raspadura profunda en puerta trasera derecha durante maniobra de descarga en madrina.',
      resolved: false,
      registeredById: advisor.id,
      comments: {
        create: [
          {
            comment: 'Pendiente turno en cabina de hojalatería Tapachula.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // Inmovilizado 3: Renault Kwid (75 días de daño - Bracket 61-90)
  const vImm3 = await prisma.vehicle.create({
    data: {
      brand: 'Renault',
      model: 'Kwid Outsider',
      year: 2023,
      color: 'Blanco Glaciar',
      plate: 'REN-551-A',
      vin: '93YBB0A02PJ703003',
      customerId: customer3.id,
    },
  });

  const imm3 = await prisma.immobilizedUnit.create({
    data: {
      vehicleId: vImm3.id,
      damageDate: new Date(Date.now() - 75 * 24 * 3600 * 1000),
      treatmentType: 'REPARACION_INTERNA',
      agency: 'San Cristóbal',
      description: 'Daño en tolva inferior y soporte de radiador por objeto en carretera de traslado.',
      resolved: false,
      registeredById: advisor.id,
      comments: {
        create: [
          {
            comment: 'Requiere aprobación de gerencia comercial para compra de tolva local.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // ==========================================
  // 4. MÓDULO SEGUROS (3 Expedientes)
  // ==========================================
  console.log('📑 4. Creando expedientes del módulo Seguros...');

  // Seguro 1: Nissan Kicks e-POWER con Qualitas
  const vIns1 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'Kicks e-POWER',
      year: 2024,
      color: 'Gris Perla',
      plate: 'DSH-490-K',
      vin: '3N1CP5DV9RL801001',
      customerId: customer1.id,
    },
  });

  const immIns1 = await prisma.immobilizedUnit.create({
    data: {
      vehicleId: vIns1.id,
      damageDate: new Date(Date.now() - 8 * 24 * 3600 * 1000),
      treatmentType: 'ASEGURADORA',
      agency: 'Tuxtla Poniente',
      description: 'Golpe en ángulo delantero derecho con daño en faro y facia.',
      resolved: false,
      registeredById: advisor.id,
    },
  });

  const case1 = await prisma.insuranceCase.create({
    data: {
      immobilizedUnitId: immIns1.id,
      reportNumber: 'QUAL-088142-2026',
      insurer: 'Qualitas',
      policyType: 'PLAN_PISO',
      stage: 'AUTORIZACION',
      documents: {
        create: [
          { docType: 'ODA', completed: true, completedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000) },
          { docType: 'DECLARACION_UNIVERSAL', completed: true, completedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000) },
          { docType: 'INE', completed: true, completedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000) },
          { docType: 'CONTRARRECIBO', completed: true, completedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000) },
          { docType: 'VALES_MO_REF', completed: false },
          { docType: 'FINIQUITO', completed: false },
        ],
      },
      stageComments: {
        create: [
          {
            stage: 'AUTORIZACION',
            comment: 'Presupuesto subido a portal Qualitas. Responsable de seguimiento: Lupita López.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // Seguro 2: Nissan Versa con Zurich
  const vIns2 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'Versa Exclusive',
      year: 2024,
      color: 'Azul Zafiro',
      plate: 'DSV-712-M',
      vin: '3N1CN8EV9RL802002',
      customerId: customer2.id,
    },
  });

  const immIns2 = await prisma.immobilizedUnit.create({
    data: {
      vehicleId: vIns2.id,
      damageDate: new Date(Date.now() - 16 * 24 * 3600 * 1000),
      treatmentType: 'ASEGURADORA',
      agency: 'Tuxtla Oriente',
      description: 'Impacto por alcance en cajuela y defensa trasera.',
      resolved: false,
      registeredById: advisor.id,
    },
  });

  const case2 = await prisma.insuranceCase.create({
    data: {
      immobilizedUnitId: immIns2.id,
      reportNumber: 'ZUR-339100-26',
      insurer: 'Zurich',
      policyType: 'TRASLADO',
      stage: 'EN_REPARACION',
      documents: {
        create: [
          { docType: 'ODA', completed: true, completedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000) },
          { docType: 'DECLARACION_UNIVERSAL', completed: true, completedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000) },
          { docType: 'FACTURA', completed: true, completedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000) },
          { docType: 'FINIQUITO', completed: false },
        ],
      },
      stageComments: {
        create: [
          {
            stage: 'EN_REPARACION',
            comment: 'Autorización Zurich completada por $18,700 MXN. Cajuela en proceso de enderezado.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  // Seguro 3: Nissan Sentra con GNP
  const vIns3 = await prisma.vehicle.create({
    data: {
      brand: 'Nissan',
      model: 'Sentra Advance',
      year: 2023,
      color: 'Negro Noche',
      plate: 'DSS-883-N',
      vin: '1N4AL3AP1NL803003',
      customerId: customer3.id,
    },
  });

  const immIns3 = await prisma.immobilizedUnit.create({
    data: {
      vehicleId: vIns3.id,
      damageDate: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      treatmentType: 'ASEGURADORA',
      agency: 'Comitán',
      description: 'Tallón de costado derecho y espejo lateral roto.',
      resolved: false,
      registeredById: advisor.id,
    },
  });

  const case3 = await prisma.insuranceCase.create({
    data: {
      immobilizedUnitId: immIns3.id,
      reportNumber: 'GNP-612098-B',
      insurer: 'GNP',
      policyType: 'PLAN_PISO',
      stage: 'ENVIO_PRESUPUESTO',
      documents: {
        create: [
          { docType: 'ODA', completed: true, completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000) },
          { docType: 'DECLARACION_UNIVERSAL', completed: true, completedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000) },
          { docType: 'INE', completed: false },
          { docType: 'FINIQUITO', completed: false },
        ],
      },
      stageComments: {
        create: [
          {
            stage: 'ENVIO_PRESUPUESTO',
            comment: 'Se generó presupuesto de refacciones para envío por correo a cabina GNP.',
            userId: advisor.id,
          },
        ],
      },
    },
  });

  console.log('✅ ¡Todas las 12 órdenes de ejemplo (3 por módulo) fueron creadas exitosamente en la base de datos!');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear órdenes de ejemplo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

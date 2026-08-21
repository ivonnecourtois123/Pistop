/**
 * Script para crear u ordenar 3 órdenes de ejemplo para el día de hoy
 * en el dashboard de PitStop.
 *
 * Funciona conectándose a la API REST (Render en producción o localhost en desarrollo).
 *
 * Uso:
 *   node scripts/create-example-orders.js
 */
const API_URL = process.env.API_URL || 'https://pitstop-backend-67zd.onrender.com/api';
const EMAIL = process.env.ADVISOR_EMAIL || 'asesor@pitstop.mx';
const PASSWORD = process.env.ADVISOR_PASSWORD || 'pitstop123';

const NISSAN_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCTxI-afqXClAtgPQSA7ZXJ0HWkbQi2xnHpL0ck4d0uZ3p1-P78ZkYQuw_GLhYMjR_h_XN30QAo8NSKlczJ2Gj53qmUHnDn7Xbobi-1672v9U4qYOt7TjddOY04i0grcY_3q4HSuE9UZSoVADFj1XrdRL7IePdE_V7qOACSUnrnFcGwPQbtKkC2ZBcWaRsvMvMpdlLCulsXDiDDeQFUw3JVsuwfxZmAkYV3Gygg99NbGL5IlRaUlDlA0Q';

const EXAMPLE_ORDERS = [
  {
    customer: {
      name: 'Sofía Ramírez',
      phone: '+52 961 234 5678',
      email: 'sofia.ramirez@example.com',
    },
    vehicle: {
      brand: 'Nissan',
      model: 'Versa',
      year: 2023,
      color: 'Plata',
      plate: 'NSS-2023',
      vin: '3N1CN7AP5PL102938',
      logoUrl: NISSAN_LOGO,
    },
    order: {
      orderNumber: 'WO-8001',
      orderType: 'SERVICIO',
      status: 'RECIBIDO',
      serviceCategory: 'MANTENIMIENTO',
      customerWaiting: true,
      washNeeded: true,
      diagnosisNeeded: false,
      deliveryHour: 13,
      deliveryMinute: 30,
      notes: 'Servicio preventivo 20,000 km. Cliente espera en sala de atención.',
    },
  },
  {
    customer: {
      name: 'Carlos Mendoza',
      phone: '+52 961 876 5432',
      email: 'carlos.mendoza@example.com',
    },
    vehicle: {
      brand: 'Nissan',
      model: 'Kicks',
      year: 2024,
      color: 'Rojo Metálico',
      plate: 'KCK-9481',
      vin: '3N1CP5DV8RL204951',
      logoUrl: NISSAN_LOGO,
    },
    order: {
      orderNumber: 'WO-8002',
      orderType: 'SERVICIO',
      status: 'EN_TALLER',
      assignTechnician: true,
      serviceCategory: 'DIAGNOSTICO_FALLA_RECLAMO',
      customerWaiting: false,
      washNeeded: true,
      diagnosisNeeded: true,
      deliveryHour: 17,
      deliveryMinute: 0,
      notes: 'Diagnóstico de ruido en suspensión delantera al pasar baches.',
    },
  },
  {
    customer: {
      name: 'Mariana López',
      phone: '+52 961 345 6789',
      email: 'mariana.lopez@example.com',
    },
    vehicle: {
      brand: 'Nissan',
      model: 'Sentra',
      year: 2022,
      color: 'Blanco Aperlado',
      plate: 'SNT-5520',
      vin: '1N4AL3AP9NC394821',
      logoUrl: NISSAN_LOGO,
    },
    order: {
      orderNumber: 'WO-8003',
      orderType: 'SERVICIO',
      status: 'LAVADO',
      assignTechnician: true,
      serviceCategory: 'MANTENIMIENTO',
      customerWaiting: false,
      washNeeded: true,
      diagnosisNeeded: false,
      deliveryHour: 15,
      deliveryMinute: 0,
      notes: 'Afinación y cambio de balatas terminado. En proceso de lavado y detallado.',
    },
  },
];

async function main() {
  console.log(`Conectando a API: ${API_URL}...`);
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    throw new Error(`Fallo de autenticación (${loginRes.status}): ${await loginRes.text()}`);
  }

  const { token, user } = await loginRes.json();
  console.log(`Sesión iniciada correctamente como: ${user.name} (${user.email})\n`);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const techsRes = await fetch(`${API_URL}/technicians`, { headers });
  const techs = await techsRes.json();
  const techId = techs[0]?.id;

  for (const item of EXAMPLE_ORDERS) {
    console.log(`--- Procesando ${item.order.orderNumber} (${item.vehicle.brand} ${item.vehicle.model}) ---`);

    // 1. Crear cliente
    const custRes = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item.customer),
    });
    const customer = await custRes.json();

    // 2. Crear vehículo
    const vehRes = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...item.vehicle, customerId: customer.id }),
    });
    const vehicle = await vehRes.json();

    // 3. Hora estimada de entrega
    const estDelivery = new Date();
    estDelivery.setHours(item.order.deliveryHour, item.order.deliveryMinute, 0, 0);

    // 4. Crear orden de trabajo
    const woRes = await fetch(`${API_URL}/work-orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        vehicleId: vehicle.id,
        orderNumber: item.order.orderNumber,
        orderType: item.order.orderType,
        technicianId: item.order.assignTechnician ? techId : undefined,
        estimatedDeliveryAt: estDelivery.toISOString(),
        notes: item.order.notes,
      }),
    });
    const wo = await woRes.json();

    // 5. Configurar campos adicionales del motor de priorización
    if (item.order.serviceCategory) {
      await fetch(`${API_URL}/work-orders/${wo.id}/service-category`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ serviceCategory: item.order.serviceCategory }),
      });
    }

    if (item.order.customerWaiting !== undefined) {
      await fetch(`${API_URL}/work-orders/${wo.id}/customer-waiting`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ customerWaiting: item.order.customerWaiting }),
      });
    }

    if (item.order.washNeeded !== undefined) {
      await fetch(`${API_URL}/work-orders/${wo.id}/wash-needed`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ washNeeded: item.order.washNeeded }),
      });
    }

    if (item.order.diagnosisNeeded !== undefined) {
      await fetch(`${API_URL}/work-orders/${wo.id}/diagnosis-needed`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ diagnosisNeeded: item.order.diagnosisNeeded }),
      });
    }

    // 6. Avanzar estatus si es necesario
    if (item.order.status === 'EN_TALLER' || item.order.status === 'LAVADO') {
      await fetch(`${API_URL}/work-orders/${wo.id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'EN_TALLER', note: 'Asignado a bahía de taller' }),
      });
    }
    if (item.order.status === 'LAVADO') {
      await fetch(`${API_URL}/work-orders/${wo.id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'LAVADO', note: 'Trabajo mecánico concluido, pasa a zona de lavado' }),
      });
    }

    console.log(`✓ Orden ${item.order.orderNumber} creada con éxito [Estatus: ${item.order.status}]`);
  }

  console.log('\n========================================');
  console.log('¡Las 3 órdenes de ejemplo fueron creadas exitosamente!');
  console.log('Ya aparecerán en la sección "Ingresadas Hoy" del Dashboard.');
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('Error al crear órdenes de ejemplo:', err);
  process.exit(1);
});

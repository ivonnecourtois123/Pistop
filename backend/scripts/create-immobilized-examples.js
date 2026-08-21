/**
 * Script para crear 2 unidades inmovilizadas de ejemplo en PitStop.
 *
 * Funciona conectándose a la API REST (Render en producción o localhost en desarrollo).
 *
 * Uso:
 *   node scripts/create-immobilized-examples.js
 */
const API_URL = process.env.API_URL || 'https://pitstop-backend-67zd.onrender.com/api';
const EMAIL = process.env.ADVISOR_EMAIL || 'asesor@pitstop.mx';
const PASSWORD = process.env.ADVISOR_PASSWORD || 'pitstop123';

const NISSAN_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCTxI-afqXClAtgPQSA7ZXJ0HWkbQi2xnHpL0ck4d0uZ3p1-P78ZkYQuw_GLhYMjR_h_XN30QAo8NSKlczJ2Gj53qmUHnDn7Xbobi-1672v9U4qYOt7TjddOY04i0grcY_3q4HSuE9UZSoVADFj1XrdRL7IePdE_V7qOACSUnrnFcGwPQbtKkC2ZBcWaRsvMvMpdlLCulsXDiDDeQFUw3JVsuwfxZmAkYV3Gygg99NbGL5IlRaUlDlA0Q';

const EXAMPLES = [
  {
    customer: {
      name: 'Inventario Agencia',
      phone: '+52 961 100 0000',
      email: 'inventario@pitstop.mx',
    },
    vehicle: {
      brand: 'Nissan',
      model: 'Frontier',
      year: 2024,
      color: 'Gris Volcánico',
      plate: 'FRN-1092',
      vin: '3N16T0DD5RN192837',
      logoUrl: NISSAN_LOGO,
    },
    immobilized: {
      treatmentType: 'GARANTIA',
      dmsReportNumber: 'REP-DMS-8429',
      description:
        'Falla en sensor de presión de riel de combustible en alta. Unidad inmovilizada en patio a la espera de dictamen técnico y refacción de planta.',
      comment: 'Se solicitó validación de cobertura de garantía a planta. Pendiente autorización de pieza.',
    },
  },
  {
    customer: {
      name: 'Inventario Agencia',
      phone: '+52 961 100 0000',
      email: 'inventario@pitstop.mx',
    },
    vehicle: {
      brand: 'Nissan',
      model: 'Sentra',
      year: 2023,
      color: 'Rojo Escarlata',
      plate: 'SNX-3341',
      vin: '1N4AL3AP4PC582910',
      logoUrl: NISSAN_LOGO,
    },
    immobilized: {
      treatmentType: 'ASEGURADORA',
      description:
        'Impacto frontal derecho con daño en facia, faro LED y salpicadera. Unidad inmovilizada a la espera de valuación.',
      comment: 'Ajustador acudió a inspección física en agencia. Presupuesto inicial enviado por portal.',
      insuranceCase: {
        insurer: 'Quálitas Compañía de Seguros',
        reportNumber: 'SIN-QUA-98124',
        policyType: 'PLAN_PISO',
        completedDocs: ['ODA', 'DECLARACION_UNIVERSAL'],
        stageComment: 'Presupuesto de hojalatería y pintura subido al portal de valuación de Quálitas.',
      },
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

  for (const item of EXAMPLES) {
    console.log(`--- Creando Inmovilizado: ${item.vehicle.brand} ${item.vehicle.model} (${item.vehicle.plate}) ---`);

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

    // 3. Crear unidad inmovilizada
    const immRes = await fetch(`${API_URL}/immobilized`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        vehicleId: vehicle.id,
        damageDate: new Date().toISOString(),
        treatmentType: item.immobilized.treatmentType,
        dmsReportNumber: item.immobilized.dmsReportNumber,
        description: item.immobilized.description,
      }),
    });

    if (!immRes.ok) {
      throw new Error(`Error al crear inmovilizado (${immRes.status}): ${await immRes.text()}`);
    }

    const immUnit = await immRes.json();
    console.log(`✓ Unidad inmovilizada creada: ${immUnit.id} [${immUnit.treatmentType}]`);

    // 4. Agregar comentario de seguimiento
    if (item.immobilized.comment) {
      await fetch(`${API_URL}/immobilized/${immUnit.id}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ comment: item.immobilized.comment }),
      });
      console.log(`  + Comentario de seguimiento registrado`);
    }

    // 5. Configurar caso de seguro si aplica
    if (item.immobilized.insuranceCase && immUnit.insuranceCase) {
      const caseId = immUnit.insuranceCase.id;
      await fetch(`${API_URL}/insurance-cases/${caseId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          insurer: item.immobilized.insuranceCase.insurer,
          reportNumber: item.immobilized.insuranceCase.reportNumber,
          policyType: item.immobilized.insuranceCase.policyType,
        }),
      });

      // Completar documentos de muestra
      for (const docType of item.immobilized.insuranceCase.completedDocs || []) {
        await fetch(`${API_URL}/insurance-cases/${caseId}/documents/${docType}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ completed: true }),
        });
      }

      if (item.immobilized.insuranceCase.stageComment) {
        await fetch(`${API_URL}/insurance-cases/${caseId}/comments`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            stage: 'ENVIO_PRESUPUESTO',
            comment: item.immobilized.insuranceCase.stageComment,
          }),
        });
      }

      console.log(`  + Expediente de seguro configurado [${item.immobilized.insuranceCase.insurer}]`);
    }
  }

  console.log('\n======================================================');
  console.log('¡Las 2 unidades inmovilizadas fueron creadas con éxito!');
  console.log('Ya están disponibles en el módulo Inmovilizados y Seguros.');
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('Error al crear inmovilizados:', err);
  process.exit(1);
});

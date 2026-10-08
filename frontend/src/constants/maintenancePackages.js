// Catálogo maestro de paquetes de mantenimiento preventivo y correctivo por Marca, Modelo y Kilometraje
// Grupo Prosur: NISSAN, CHANGAN, RENAULT

export const SUPPORTED_BRANDS = ['NISSAN', 'CHANGAN', 'RENAULT'];

export const BRAND_MODELS = {
  NISSAN: [
    { id: 'versa', name: 'Versa', engine: '1.6L 4 Cil', defaultOil: '0W-20 Sintético' },
    { id: 'sentra', name: 'Sentra', engine: '2.0L 4 Cil', defaultOil: '0W-20 Sintético' },
    { id: 'kicks', name: 'Kicks', engine: '1.6L 4 Cil', defaultOil: '0W-20 Sintético' },
    { id: 'march', name: 'March', engine: '1.6L 4 Cil', defaultOil: '10W-30 / 5W-30' },
    { id: 'frontier', name: 'NP300 / Frontier', engine: '2.5L Gasolina / Diésel', defaultOil: '5W-30 Sintético' },
    { id: 'xtrail', name: 'X-Trail', engine: '2.5L 4 Cil', defaultOil: '0W-20 Sintético' },
    { id: 'urvan', name: 'Urvan NV350', engine: '2.5L Gasolina / Diésel', defaultOil: '15W-40 / 5W-30' },
  ],
  CHANGAN: [
    { id: 'alsvin', name: 'Alsvin', engine: '1.4L / 1.5L', defaultOil: '5W-30 Sintético' },
    { id: 'cs35plus', name: 'CS35 Plus Turbo', engine: '1.4T BlueCore', defaultOil: '5W-30 Sintético' },
    { id: 'cs55plus', name: 'CS55 Plus', engine: '1.5T BlueCore', defaultOil: '0W-20 Sintético' },
    { id: 'unit', name: 'UNI-T', engine: '1.5T Turbo', defaultOil: '0W-20 Sintético' },
    { id: 'unik', name: 'UNI-K', engine: '2.0T Turbo', defaultOil: '0W-20 Sintético' },
    { id: 'hunter', name: 'Hunter Pick-up', engine: '1.9T Diésel / 2.0T Gasolina', defaultOil: '5W-30 Sintético' },
  ],
  RENAULT: [
    { id: 'kwid', name: 'Kwid', engine: '1.0L 3 Cil', defaultOil: '5W-30 Sintético' },
    { id: 'duster', name: 'Duster', engine: '1.6L / 1.3T Turbo', defaultOil: '5W-40 Sintético' },
    { id: 'oroch', name: 'Oroch Pick-up', engine: '2.0L / 1.3T Turbo', defaultOil: '5W-40 Sintético' },
    { id: 'stepway', name: 'Stepway / Sandero', engine: '1.6L 4 Cil', defaultOil: '5W-30 Sintético' },
    { id: 'koleos', name: 'Koleos', engine: '2.5L 4 Cil', defaultOil: '5W-30 Sintético' },
    { id: 'master', name: 'Master Van', engine: '2.3 dCi Diésel', defaultOil: '5W-30 DPF' },
  ],
};

export const MILEAGE_INTERVALS = [
  { km: 10000, label: '10,000 km', months: '6 meses', type: 'Menor' },
  { km: 20000, label: '20,000 km', months: '12 meses', type: 'Intermedio' },
  { km: 30000, label: '30,000 km', months: '18 meses', type: 'Menor' },
  { km: 40000, label: '40,000 km', months: '24 meses', type: 'Mayor' },
  { km: 50000, label: '50,000 km', months: '30 meses', type: 'Menor' },
  { km: 60000, label: '60,000 km', months: '36 meses', type: 'Intermedio' },
  { km: 70000, label: '70,000 km', months: '42 meses', type: 'Menor' },
  { km: 80000, label: '80,000 km', months: '48 meses', type: 'Mayor' },
  { km: 90000, label: '90,000 km', months: '54 meses', type: 'Menor' },
  { km: 100000, label: '100,000 km', months: '60 meses', type: 'Mayor / Especial' },
];

// Servicios opcionales para venta cruzada / upselling
export const UPSELL_SERVICES = [
  {
    id: 'alineacion_balanceo',
    name: 'Alineación y Balanceo Computarizado (4 Ruedas)',
    description: 'Previene desgaste irregular de neumáticos y vibraciones en volante a alta velocidad.',
    partsPrice: 0,
    laborPrice: 650,
    recommended: true,
  },
  {
    id: 'limpieza_frenos',
    name: 'Mantenimiento y Ajuste de Frenos (4 Ruedas)',
    description: 'Desengrasado, lijado de zapatas/balatas, lubricación de pernos guía y ajuste de freno de mano.',
    partsPrice: 120,
    laborPrice: 480,
    recommended: true,
  },
  {
    id: 'lavado_inyectores',
    name: 'Lavado de Inyectores por Boya Presurizada + Aditivo',
    description: 'Limpia depósitos de carbón en válvulas e inyectores para restaurar potencia y ahorro de gasolina.',
    partsPrice: 280,
    laborPrice: 450,
    recommended: false,
  },
  {
    id: 'desinfeccion_ac',
    name: 'Desinfección de Ductos A/C y Ozonificación de Cabina',
    description: 'Elimina 99.9% de hongos, bacterias y malos olores del sistema de climatización.',
    partsPrice: 190,
    laborPrice: 320,
    recommended: false,
  },
  {
    id: 'liquido_frenos',
    name: 'Purga y Reemplazo de Líquido de Frenos DOT 4',
    description: 'Evita pérdida de frenado por humedad e incrementa la vida de la bomba y calipers.',
    partsPrice: 210,
    laborPrice: 340,
    recommended: false,
  },
  {
    id: 'limpiaparabrisas',
    name: 'Juego de Plumas Limpiaparabrisas Originales',
    description: 'Hule de alta durabilidad con teflón para máxima visibilidad en lluvia.',
    partsPrice: 420,
    laborPrice: 0,
    recommended: false,
  },
];

// Generador inteligente de paquetes de mantenimiento con base en marca, modelo y kilometraje
export function getMaintenancePackages(brand = 'NISSAN', modelId = 'versa', km = 10000) {
  const isMajor = km === 40000 || km === 80000 || km >= 100000;
  const isIntermediate = km === 20000 || km === 60000;
  
  // Costos base según marca
  let basePartsPrice = brand === 'NISSAN' ? 890 : brand === 'CHANGAN' ? 820 : 910;
  let baseLaborPrice = brand === 'NISSAN' ? 750 : brand === 'CHANGAN' ? 680 : 790;

  if (isMajor) {
    basePartsPrice *= 2.2;
    baseLaborPrice *= 1.8;
  } else if (isIntermediate) {
    basePartsPrice *= 1.5;
    baseLaborPrice *= 1.3;
  }

  // 1. PAQUETE BÁSICO (ESENCIAL DE MANUAL)
  const basic = {
    id: 'basic',
    name: 'Paquete Básico (Esencial)',
    badge: 'Mantenimiento Preventivo',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Operaciones fundamentales de manual de garantía y cambio de fluidos esenciales.',
    timeEstimate: '1.5 - 2.0 horas',
    isRecommended: false,
    parts: [
      { name: 'Aceite de Motor Sintético Original (Garrafa 4L/5L)', cost: Math.round(basePartsPrice * 0.65) },
      { name: 'Filtro de Aceite de Motor Original', cost: Math.round(basePartsPrice * 0.25) },
      { name: 'Arandela de Tapón de Cárter', cost: Math.round(basePartsPrice * 0.1) },
    ],
    operations: [
      'Drenado y cambio de aceite de motor y filtro original',
      'Inspección visual de seguridad de 25 puntos de inspección',
      'Revisión y relleno de niveles (Frenos, Dirección, Anticongelante, Limpiaparabrisas)',
      'Revisión de presión y estado de los 4 neumáticos + Llanta de refacción',
      'Diagnóstico de batería con analizador de carga',
      'Revisión de luces exteriores e interiores',
      'Escaneo básico de testigos del cuadro de instrumentos',
    ],
    partsSubtotal: Math.round(basePartsPrice),
    laborSubtotal: Math.round(baseLaborPrice),
  };

  // 2. PAQUETE RECOMENDADO (EL MÁS VENDIDO / MARCA PROSUR)
  const recommendedPartsExtra = isMajor
    ? [
        { name: 'Filtro de Aire de Motor Original', cost: 380 },
        { name: 'Filtro de Polen / Aire de Cabina', cost: 420 },
        { name: 'Juego de 4 Bujías de Iridio / Platino', cost: 960 },
        { name: 'Aditivo Limpiador de Inyectores Oficial', cost: 180 },
      ]
    : [
        { name: 'Filtro de Aire de Motor Original', cost: 380 },
        { name: 'Filtro de Polen / Aire de Cabina', cost: 420 },
        { name: 'Aditivo Limpiador de Combustible', cost: 160 },
      ];

  const recommendedPartsCost = basic.partsSubtotal + recommendedPartsExtra.reduce((acc, p) => acc + p.cost, 0);
  const recommendedLaborCost = Math.round(basic.laborSubtotal * 1.35);

  const recommended = {
    id: 'recommended',
    name: 'Paquete Recomendado (Marca Prosur)',
    badge: '★ Más Vendido / Recomendado',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    description: 'El paquete óptimo para proteger la vida útil del motor, eficiencia de combustible y valor de reventa.',
    timeEstimate: '2.5 - 3.0 horas',
    isRecommended: true,
    parts: [...basic.parts, ...recommendedPartsExtra],
    operations: [
      ...basic.operations,
      'Reemplazo de filtro de aire de motor',
      'Reemplazo de filtro antipolen de cabina para aire puro en habitáculo',
      ...(isMajor ? ['Reemplazo de bujías de alto rendimiento'] : []),
      'Rotación de neumáticos para desgaste uniforme',
      'Limpieza y ajuste básico de frenos delanteros y traseros',
      'Inspección de bandas de accesorios y mangueras de enfriamiento',
      'Revisión de suspensión y articulaciones de dirección',
      'Reporte de salud vehicular para el cliente',
    ],
    partsSubtotal: recommendedPartsCost,
    laborSubtotal: recommendedLaborCost,
  };

  // 3. PAQUETE PREMIUM (PROTECCIÓN TOTAL PROSUR)
  const premiumPartsExtra = [
    ...recommendedPartsExtra,
    { name: 'Químico Desinfectante y Antibacterial A/C', cost: 240 },
    { name: 'Líquido Limpiaparabrisas Concentrado Visión Clara', cost: 95 },
    { name: 'Grasa Sintética Especial para Calipers y Guías de Freno', cost: 130 },
  ];

  const premiumPartsCost = basic.partsSubtotal + premiumPartsExtra.reduce((acc, p) => acc + p.cost, 0);
  const premiumLaborCost = Math.round(recommendedLaborCost * 1.45);

  const premium = {
    id: 'premium',
    name: 'Paquete Premium (Protección Total)',
    badge: '💎 Máxima Protección y Rendimiento',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    description: 'Servicio integral 360° con alineación, balanceo, desinfección A/C y lavado de cortesía incluido.',
    timeEstimate: '3.5 - 4.5 horas',
    isRecommended: false,
    parts: [...basic.parts, ...premiumPartsExtra],
    operations: [
      ...recommended.operations,
      'Alineación y Balanceo computarizado de 4 ruedas incluido',
      'Desinfección y sanitización profunda del sistema de Aire Acondicionado',
      'Lavado de inyectores presurizado en laboratorio / boya',
      'Lubricación y engrase de cerraduras, bisagras y pernos',
      'Lavado de cortesía de carrocería y aspirado interior',
      'Garantía extendida de servicio en mano de obra y refacciones',
    ],
    partsSubtotal: premiumPartsCost,
    laborSubtotal: premiumLaborCost,
  };

  return [basic, recommended, premium].map((pkg) => {
    const subtotal = pkg.partsSubtotal + pkg.laborSubtotal;
    const iva = Math.round(subtotal * 0.16);
    const total = subtotal + iva;
    return {
      ...pkg,
      subtotal,
      iva,
      total,
    };
  });
}

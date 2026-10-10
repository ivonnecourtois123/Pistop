const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = 'C:\\Users\\Mejora Continua\\.gemini\\antigravity\\brain\\b2768be9-7196-4002-94b6-10a10a75f0f6\\.user_uploaded\\media_1791591943878_8c1774a3.xls';
const wb = XLSX.readFile(excelPath);

function normalizeModel(m) {
  if (!m) return null;
  const up = m.toUpperCase().trim();
  if (up.includes('TSURU')) return 'tsuru_b13';
  if (up.includes('MARCH') || up.includes('NOTE') || (up.includes('VERSA') && up.includes('N17'))) return 'march_versa_n17';
  if (up.includes('VERSA') && (up.includes('N18') || up.includes('2020'))) return 'versa_n18';
  if (up.includes('NP300') && up.includes('D22')) return 'np300_d22';
  if (up.includes('URVAN') || up.includes('NV350')) return 'urvan_nv350';
  if (up.includes('TIIDA')) return 'tiida_c11';
  if (up.includes('SENTRA') && up.includes('B17')) return 'sentra_b17';
  if (up.includes('SENTRA') && (up.includes('B18') || up.includes('2020'))) return 'sentra_b18';
  if (up.includes('TRAIL') || up.includes('T32')) return 'xtrail_t32';
  if (up.includes('NP300') && (up.includes('D23') || up.includes('FRONTIER'))) return 'np300_d23';
  if (up.includes('KICKS')) return 'kicks_p15';
  return null;
}

function parseKmNumbers(kmStr) {
  if (!kmStr) return [];
  const numbers = [];
  const matches = kmStr.match(/\d+/g);
  if (matches) {
    matches.forEach(num => {
      const n = parseInt(num, 10);
      if (n <= 300) {
        numbers.push(n * 1000);
      } else {
        numbers.push(n);
      }
    });
  }
  return numbers;
}

const tiers = [
  { sheet: 'CHESA BASICO', id: 'basic', name: 'CHESA BÁSICO', badge: 'Mantenimiento Básico', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', isRecommended: false, timeEstimate: '1.5 - 2.0 horas', description: 'Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.' },
  { sheet: 'CHESA PREMIUM', id: 'recommended', name: 'CHESA PREMIUM', badge: '★ Más Vendido / Recomendado', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold', isRecommended: true, timeEstimate: '2.5 - 3.0 horas', description: 'Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.' },
  { sheet: 'CHESA GOLD', id: 'premium', name: 'CHESA GOLD', badge: '💎 Máxima Protección y Rendimiento', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-bold', isRecommended: false, timeEstimate: '3.5 - 4.5 horas', description: 'Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.' }
];

const catalog = {};

tiers.forEach(tier => {
  const ws = wb.Sheets[tier.sheet];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  let curModel = null;
  let curModelKey = null;
  let curYears = null;
  let curKmText = null;
  let curItems = [];

  function saveBlock(excelTotal) {
    if (!curModelKey || curItems.length === 0) return;
    if (!catalog[curModelKey]) {
      catalog[curModelKey] = {
        modelKey: curModelKey,
        rawName: curModel,
        years: curYears,
        packages: []
      };
    }

    const parts = [];
    const operations = [];
    let partsSubtotal = 0;
    let laborSubtotal = 0;

    curItems.forEach(item => {
      const isLabor = !isNaN(Number(item.partNum)) ||
        item.desc.includes('MANTENIMIENTO') ||
        item.desc.includes('MANTENIMEINTO') ||
        item.desc.includes('CHESSA') ||
        item.desc.includes('LAVADO') ||
        item.desc.includes('LIMPIEZA') ||
        item.desc.includes('LIMPPIEZA') ||
        item.desc.includes('ALINEACION') ||
        item.desc.includes('FLUIDOS') ||
        item.desc.includes('BALEROS') ||
        (item.desc.includes('BUJIAS') && !item.partNum.startsWith('22401')) ||
        item.desc.includes('MATERIALES');

      if (isLabor) {
        laborSubtotal += item.amount;
        operations.push({
          code: item.partNum ? String(item.partNum) : 'MO',
          name: item.desc.trim(),
          cost: Math.round(item.amount * 100) / 100,
          qty: item.qty
        });
      } else {
        partsSubtotal += item.amount;
        parts.push({
          partNumber: item.partNum ? String(item.partNum).trim() : 'REF',
          name: item.desc.trim(),
          qty: item.qty,
          unitPrice: Math.round(item.unitPrice * 100) / 100,
          cost: Math.round(item.amount * 100) / 100
        });
      }
    });

    const calcTotal = partsSubtotal + laborSubtotal;
    const finalTotal = excelTotal ? Number(excelTotal) : calcTotal;

    catalog[curModelKey].packages.push({
      tierId: tier.id,
      name: tier.name,
      badge: tier.badge,
      badgeColor: tier.badgeColor,
      isRecommended: tier.isRecommended,
      timeEstimate: tier.timeEstimate,
      description: tier.description,
      kmText: curKmText ? curKmText.trim() : '',
      kmNumbers: parseKmNumbers(curKmText),
      parts,
      operations,
      partsSubtotal: Math.round(partsSubtotal * 100) / 100,
      laborSubtotal: Math.round(laborSubtotal * 100) / 100,
      subtotal: Math.round((partsSubtotal + laborSubtotal) * 100) / 100,
      iva: 0,
      total: Math.round(finalTotal * 100) / 100
    });
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    const col0 = r[0] != null ? String(r[0]).trim() : '';
    const col1 = r[1] != null ? String(r[1]).trim() : '';
    const col2 = r[2] != null ? String(r[2]).trim() : '';
    const col3 = r[3] != null ? String(r[3]).trim() : '';
    const col4 = r[4] != null ? String(r[4]).trim() : '';
    const col5 = r[5] != null ? Number(r[5]) : null;
    const col6 = r[6] != null ? Number(r[6]) : null;

    if (col0 && (col0.includes('MIL KM') || col0.includes('KM'))) {
      saveBlock();
      curKmText = col0;
      curItems = [];
      continue;
    }

    const modKey = normalizeModel(col0);
    if (modKey) {
      saveBlock();
      curModel = col0;
      curModelKey = modKey;
      curYears = col1 || curYears;
      curKmText = col2 || curKmText;
      curItems = [];
    } else if (!col0 && col2 && (col2.includes('MIL KM') || col2.includes('KM'))) {
      saveBlock();
      curKmText = col2;
      curItems = [];
    } else if (col2 === 'TOTAL' || (typeof r[2] === 'string' && r[2].toUpperCase() === 'TOTAL')) {
      saveBlock(col6);
      curItems = [];
    } else if (r[2] != null && !isNaN(Number(r[2])) && (col4 || col3)) {
      const qty = Number(r[2]);
      const partNum = r[3] != null ? String(r[3]).trim() : '';
      const desc = r[4] != null ? String(r[4]).trim() : '';
      const unitPrice = col5 || 0;
      const amount = (col6 != null && !isNaN(col6)) ? Number(col6) : (qty * unitPrice);
      curItems.push({ qty, partNum, desc, unitPrice, amount });
    }
  }
  saveBlock();
});

const content = `// Catálogo maestro de paquetes de mantenimiento preventivo y correctivo por Marca, Modelo y Kilometraje
// Matriz Oficial de Mantenimientos Nissan CHESA (Básico, Premium, Gold) + Modelos Multimarca Grupo Prosur

export const SUPPORTED_BRANDS = ['NISSAN', 'CHANGAN', 'RENAULT'];

export const BRAND_MODELS = {
  NISSAN: [
    { id: 'march_versa_n17', name: 'March / Versa N17 / Note', years: '2012–2019', engine: '1.6L 4 Cil HR16DE', defaultOil: '10W-30 / 5W-30' },
    { id: 'versa_n18', name: 'Versa N18 (Nueva Gen)', years: '2020–2024+', engine: '1.6L 4 Cil HR16DE Gen3', defaultOil: '0W-20 Sintético' },
    { id: 'sentra_b17', name: 'Sentra B17', years: '2013–2019', engine: '1.8L 4 Cil MRA8DE', defaultOil: '0W-20 Sintético' },
    { id: 'sentra_b18', name: 'Sentra B18 (Nueva Gen)', years: '2020–2024+', engine: '2.0L 4 Cil MR20DD', defaultOil: '0W-20 Sintético' },
    { id: 'kicks_p15', name: 'Kicks P15', years: '2017–2024+', engine: '1.6L 4 Cil HR16DE', defaultOil: '0W-20 Sintético' },
    { id: 'np300_d23', name: 'NP300 / Frontier D23', years: '2016–2024+', engine: '2.5L Gasolina QR25DE', defaultOil: '5W-30 Sintético' },
    { id: 'np300_d22', name: 'NP300 / Frontier D22', years: '2008–2015', engine: '2.4L Gasolina KA24DE', defaultOil: '15W-40 / 20W-50' },
    { id: 'xtrail_t32', name: 'X-Trail T32', years: '2015–2020+', engine: '2.5L 4 Cil QR25DE', defaultOil: '0W-20 Sintético' },
    { id: 'urvan_nv350', name: 'Urvan NV350 E26', years: '2013–2020+', engine: '2.5L Gasolina QR25DE', defaultOil: '15W-40 / 5W-30' },
    { id: 'tiida_c11', name: 'Tiida C11', years: '2007–2017', engine: '1.8L / 1.6L MR18DE / HR16DE', defaultOil: '10W-30 / 15W-40' },
    { id: 'tsuru_b13', name: 'Tsuru B13', years: '1999–2017', engine: '1.6L 4 Cil GA16DNE', defaultOil: '15W-40 Multigrado' },
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

// Aliases para compatibilidad con selecciones anteriores
const MODEL_ALIASES = {
  versa: 'versa_n18',
  sentra: 'sentra_b18',
  march: 'march_versa_n17',
  kicks: 'kicks_p15',
  frontier: 'np300_d23',
  xtrail: 'xtrail_t32',
  urvan: 'urvan_nv350',
  tsuru: 'tsuru_b13',
  tiida: 'tiida_c11',
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

// Matriz Oficial de Mantenimiento Nissan CHESA
export const CHESA_NISSAN_CATALOG = ` + JSON.stringify(catalog, null, 2) + `;

export function getMaintenancePackages(brand = 'NISSAN', modelId = 'versa_n18', km = 10000) {
  const effectiveModelId = MODEL_ALIASES[modelId] || modelId;

  // Si la marca es NISSAN y tenemos el modelo en el catálogo oficial CHESA
  if (brand === 'NISSAN' && CHESA_NISSAN_CATALOG[effectiveModelId]) {
    const modelData = CHESA_NISSAN_CATALOG[effectiveModelId];
    const tiers = ['basic', 'recommended', 'premium'];

    const resultPackages = tiers.map(tierId => {
      const tierPkgs = modelData.packages.filter(p => p.tierId === tierId);
      if (tierPkgs.length === 0) return null;

      // Buscar si el kilometraje exacto está en la lista de kmNumbers
      let matchedPkg = tierPkgs.find(p => p.kmNumbers && p.kmNumbers.includes(km));

      // Si no coincide exacto, encontrar el paquete más cercano según el tipo de kilometraje
      if (!matchedPkg) {
        if (km >= 100000) {
          matchedPkg = tierPkgs.find(p => p.kmNumbers && (p.kmNumbers.includes(100000) || p.kmNumbers.includes(200000))) || tierPkgs[tierPkgs.length - 1];
        } else if (km % 40000 === 0) {
          matchedPkg = tierPkgs.find(p => p.kmNumbers && (p.kmNumbers.includes(40000) || p.kmNumbers.includes(80000))) || tierPkgs[0];
        } else if (km % 20000 === 0) {
          matchedPkg = tierPkgs.find(p => p.kmNumbers && (p.kmNumbers.includes(20000) || p.kmNumbers.includes(60000))) || tierPkgs[0];
        } else {
          matchedPkg = tierPkgs.find(p => p.kmNumbers && (p.kmNumbers.includes(10000) || p.kmNumbers.includes(30000) || p.kmNumbers.includes(50000))) || tierPkgs[0];
        }
      }

      if (!matchedPkg) matchedPkg = tierPkgs[0];

      // Convertir las operaciones a cadenas legibles para la UI si es necesario
      const operationStrings = matchedPkg.operations.map(op => {
        if (typeof op === 'string') return op;
        return op.code && op.code !== 'MO' ? \`\${op.name} (Op. \${op.code})\` : op.name;
      });

      return {
        id: matchedPkg.tierId,
        name: matchedPkg.name,
        badge: matchedPkg.badge,
        badgeColor: matchedPkg.badgeColor,
        description: matchedPkg.description,
        timeEstimate: matchedPkg.timeEstimate,
        isRecommended: matchedPkg.isRecommended,
        parts: matchedPkg.parts,
        operations: operationStrings,
        rawOperations: matchedPkg.operations,
        partsSubtotal: matchedPkg.partsSubtotal,
        laborSubtotal: matchedPkg.laborSubtotal,
        subtotal: matchedPkg.subtotal,
        iva: matchedPkg.iva,
        total: matchedPkg.total,
        kmText: matchedPkg.kmText,
      };
    }).filter(Boolean);

    if (resultPackages.length > 0) {
      return resultPackages;
    }
  }

  // Fallback para CHANGAN, RENAULT u otros modelos dinámicos
  const isMajor = km === 40000 || km === 80000 || km >= 100000;
  const isIntermediate = km === 20000 || km === 60000;

  let basePartsPrice = brand === 'CHANGAN' ? 820 : 910;
  let baseLaborPrice = brand === 'CHANGAN' ? 680 : 790;

  if (isMajor) {
    basePartsPrice *= 2.2;
    baseLaborPrice *= 1.8;
  } else if (isIntermediate) {
    basePartsPrice *= 1.5;
    baseLaborPrice *= 1.3;
  }

  const basic = {
    id: 'basic',
    name: 'CHESA BÁSICO',
    badge: 'Mantenimiento Preventivo Básico',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Operaciones fundamentales de manual de garantía y cambio de fluidos esenciales.',
    timeEstimate: '1.5 - 2.0 horas',
    isRecommended: false,
    parts: [
      { partNumber: 'ACE-SINT', name: 'Aceite de Motor Sintético Original (Garrafa 4L/5L)', qty: 1, unitPrice: Math.round(basePartsPrice * 0.65), cost: Math.round(basePartsPrice * 0.65) },
      { partNumber: 'FILT-ACE', name: 'Filtro de Aceite de Motor Original', qty: 1, unitPrice: Math.round(basePartsPrice * 0.25), cost: Math.round(basePartsPrice * 0.25) },
      { partNumber: 'ARAN-CAR', name: 'Arandela de Tapón de Cárter', qty: 1, unitPrice: Math.round(basePartsPrice * 0.1), cost: Math.round(basePartsPrice * 0.1) },
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

  const recommendedPartsExtra = isMajor
    ? [
        { partNumber: 'FILT-AIR', name: 'Filtro de Aire de Motor Original', qty: 1, unitPrice: 380, cost: 380 },
        { partNumber: 'FILT-CAB', name: 'Filtro de Polen / Aire de Cabina', qty: 1, unitPrice: 420, cost: 420 },
        { partNumber: 'BUJ-IRID', name: 'Juego de 4 Bujías de Iridio / Platino', qty: 4, unitPrice: 240, cost: 960 },
        { partNumber: 'ADIT-INY', name: 'Aditivo Limpiador de Inyectores Oficial', qty: 1, unitPrice: 180, cost: 180 },
      ]
    : [
        { partNumber: 'FILT-AIR', name: 'Filtro de Aire de Motor Original', qty: 1, unitPrice: 380, cost: 380 },
        { partNumber: 'FILT-CAB', name: 'Filtro de Polen / Aire de Cabina', qty: 1, unitPrice: 420, cost: 420 },
        { partNumber: 'ADIT-COMB', name: 'Aditivo Limpiador de Combustible', qty: 1, unitPrice: 160, cost: 160 },
      ];

  const recommendedPartsCost = basic.partsSubtotal + recommendedPartsExtra.reduce((acc, p) => acc + p.cost, 0);
  const recommendedLaborCost = Math.round(basic.laborSubtotal * 1.35);

  const recommended = {
    id: 'recommended',
    name: 'CHESA PREMIUM',
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

  const premiumPartsExtra = [
    ...recommendedPartsExtra,
    { partNumber: 'QUIM-AC', name: 'Químico Desinfectante y Antibacterial A/C', qty: 1, unitPrice: 240, cost: 240 },
    { partNumber: 'LIQ-LIMP', name: 'Líquido Limpiaparabrisas Concentrado Visión Clara', qty: 1, unitPrice: 95, cost: 95 },
    { partNumber: 'GRAS-CAL', name: 'Grasa Sintética Especial para Calipers y Guías de Freno', qty: 1, unitPrice: 130, cost: 130 },
  ];

  const premiumPartsCost = basic.partsSubtotal + premiumPartsExtra.reduce((acc, p) => acc + p.cost, 0);
  const premiumLaborCost = Math.round(recommendedLaborCost * 1.45);

  const premium = {
    id: 'premium',
    name: 'CHESA GOLD',
    badge: '💎 Máxima Protección y Rendimiento',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    description: 'Servicio integral 360° con afinación, lavado de inyectores, desinfección A/C y cámara de aceleración.',
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
`;

const targetPath = path.resolve(__dirname, '../../frontend/src/constants/maintenancePackages.js');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully written to', targetPath);

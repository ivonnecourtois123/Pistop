// Catálogo maestro de paquetes de mantenimiento preventivo y correctivo por Marca, Modelo y Kilometraje
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
export const CHESA_NISSAN_CATALOG = {
  "tsuru_b13": {
    "modelKey": "tsuru_b13",
    "rawName": "TSURU B13",
    "years": "99-17",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 100, 110, 130, 140 150, 170, 180 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          100000,
          110000,
          130000,
          140000,
          150000,
          170000,
          180000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "15208F4301",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 118.7,
            "cost": 118.7
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MF410PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 103.17,
            "cost": 103.17
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "2012",
            "name": "LAVADO GENERAL COCHES",
            "cost": 250.56,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 466.9,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 307.4,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 2230.19,
        "laborSubtotal": 1114.86,
        "subtotal": 3345.05,
        "iva": 0,
        "total": 3345.05
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "4",
        "kmNumbers": [
          4000
        ],
        "parts": [
          {
            "partNumber": "15208F4301",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 118.7,
            "cost": 118.7
          },
          {
            "partNumber": "AF54MF410PNW",
            "name": "FILTRO DE AIRE MOTOR",
            "qty": 1,
            "unitPrice": 103.17,
            "cost": 103.17
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 5,
            "unitPrice": 105.01,
            "cost": 525.05
          },
          {
            "partNumber": "00000215R0",
            "name": "LÍQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "16400F4202",
            "name": "FILTRO DE GASILINA",
            "qty": 1,
            "unitPrice": 189.05,
            "cost": 189.05
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE TRANSMISIÓN MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL COCHES",
            "cost": 250.56,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 466.9,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 307.4,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 464,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3589.38,
        "laborSubtotal": 1578.86,
        "subtotal": 5168.24,
        "iva": 0,
        "total": 4059.15
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 100, 110, 130, 140 150, 170, 180 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          100000,
          110000,
          130000,
          140000,
          150000,
          170000,
          180000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "15208F4301",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 118.7,
            "cost": 118.7
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MF410PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 103.17,
            "cost": 103.17
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMPOO",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 232,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 250.56,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 696,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 301.6,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 2611.13,
        "laborSubtotal": 1570.16,
        "subtotal": 4181.29,
        "iva": 0,
        "total": 4181.29
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40, 80 Y 120, 160 Y 200 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "15208F4301",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 118.7,
            "cost": 118.7
          },
          {
            "partNumber": "AF54MF410PNW",
            "name": "FILTRO DE AIRE MOTOR",
            "qty": 1,
            "unitPrice": 103.17,
            "cost": 103.17
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 5,
            "unitPrice": 105.01,
            "cost": 525.05
          },
          {
            "partNumber": "00000215R0",
            "name": "LÍQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "16400F4202",
            "name": "FILTRO DE GASILINA",
            "qty": 1,
            "unitPrice": 189.05,
            "cost": 189.05
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE TRANSMISIÓN MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMEINTO CHESA PREMIUM",
            "cost": 696,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 232,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 301.6,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 464,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4418.54,
        "laborSubtotal": 2099.6,
        "subtotal": 6518.14,
        "iva": 0,
        "total": 6623.63
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 100, 110, 130, 140 150, 170, 180 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          100000,
          110000,
          130000,
          140000,
          150000,
          170000,
          180000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "15208F4301",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 118.7,
            "cost": 118.7
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MF410PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 103.17,
            "cost": 103.17
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMPOO",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "MO",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 350,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 719.2,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 175,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 310,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3121.6,
        "laborSubtotal": 1960.2,
        "subtotal": 5081.8,
        "iva": 0,
        "total": 5081.8
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40, 80 Y 120, 160 Y 200 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "15208F4301",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 118.7,
            "cost": 118.7
          },
          {
            "partNumber": "AF54MF410PNW",
            "name": "FILTRO DE AIRE MOTOR",
            "qty": 1,
            "unitPrice": 103.17,
            "cost": 103.17
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 5,
            "unitPrice": 105.01,
            "cost": 525.05
          },
          {
            "partNumber": "00000215R0",
            "name": "LÍQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "16400F4202",
            "name": "FILTRO DE GASOLINA",
            "qty": 1,
            "unitPrice": 189.05,
            "cost": 189.05
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE TRANSMISIÓN MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE FRENOS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 105.49
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "MO",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 350,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 464,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 250.56,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 575.36,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 232,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 301.6,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "materiales diversos",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5211.11,
        "laborSubtotal": 2263.52,
        "subtotal": 7474.63,
        "iva": 0,
        "total": 5734.94
      }
    ]
  },
  "march_versa_n17": {
    "modelKey": "march_versa_n17",
    "rawName": "MARCH K13 / VERSA N17 / NOTE",
    "years": "12-19",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 30, 50, 70, 90, 110,130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2746.56,
        "laborSubtotal": 1444.6,
        "subtotal": 4191.16,
        "iva": 0,
        "total": 4191.16
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60,140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272771KK0C",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 262.9,
            "cost": 262.9
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.22,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENBERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3667.17,
        "laborSubtotal": 1444.24,
        "subtotal": 5111.41,
        "iva": 0,
        "total": 5111.41
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4955.16,
        "laborSubtotal": 2024.6,
        "subtotal": 6979.76,
        "iva": 0,
        "total": 4926.23
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "224011HC1B",
            "name": "BUJIAS IRIDIO",
            "qty": 4,
            "unitPrice": 249.14,
            "cost": 996.56
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNES DE BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3743.12,
        "laborSubtotal": 2024.6,
        "subtotal": 5767.72,
        "iva": 0,
        "total": 5767.72
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 30, 50, 70, 90, 110,130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 18.14
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3245.04,
        "laborSubtotal": 1892.54,
        "subtotal": 5137.58,
        "iva": 0,
        "total": 5137.58
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60,140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272781KK0C",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 262.9,
            "cost": 262.9
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3871.5,
        "laborSubtotal": 1892.54,
        "subtotal": 5764.04,
        "iva": 0,
        "total": 5764.04
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 5,
            "unitPrice": 105.01,
            "cost": 525.05
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4949.47,
        "laborSubtotal": 2533.54,
        "subtotal": 7483.01,
        "iva": 0,
        "total": 5569.32
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "224011HC1B",
            "name": "BUJIAS IRIDIO",
            "qty": 4,
            "unitPrice": 249.14,
            "cost": 996.56
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 290,
            "qty": 1
          },
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 719.2,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 310,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3947.45,
        "laborSubtotal": 2305.2,
        "subtotal": 6252.65,
        "iva": 0,
        "total": 6252.65
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 30, 50, 70, 90, 110,130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMPOO",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU08Q2DDD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3637.97,
        "laborSubtotal": 1924.34,
        "subtotal": 5562.31,
        "iva": 0,
        "total": 5562.31
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60,140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DDD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "272781KK0C",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 262.9,
            "cost": 262.9
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4558.58,
        "laborSubtotal": 1924.34,
        "subtotal": 6482.92,
        "iva": 0,
        "total": 6482.92
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5846.57,
        "laborSubtotal": 2562.34,
        "subtotal": 8408.91,
        "iva": 0,
        "total": 6495.22
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165461HK0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 484.24,
            "cost": 484.24
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "224011HC1B",
            "name": "BUJIAS IRIDIO",
            "qty": 4,
            "unitPrice": 249.14,
            "cost": 996.56
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          },
          {
            "partNumber": "432621HA1A",
            "name": "TUERC/SEG/BALER",
            "qty": 2,
            "unitPrice": 72.12,
            "cost": 144.24
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925.1,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 390,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4634.53,
        "laborSubtotal": 2062.24,
        "subtotal": 6696.77,
        "iva": 0,
        "total": 6696.77
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100, 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546.5RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401.ED815",
            "name": "BUJIAS IRIDIO",
            "qty": 4,
            "unitPrice": 575.88,
            "cost": 2303.52
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925.1,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 390,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5760.63,
        "laborSubtotal": 2700.24,
        "subtotal": 8460.87,
        "iva": 0,
        "total": 8460.87
      }
    ]
  },
  "versa_n18": {
    "modelKey": "versa_n18",
    "rawName": "VERSA N18",
    "years": "20-21",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 30, 50, 70, 90, 110,130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2565.7,
        "laborSubtotal": 1444.6,
        "subtotal": 4010.3,
        "iva": 0,
        "total": 4010.3
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60,140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "278915RB0B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENBERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3658.14,
        "laborSubtotal": 1444.6,
        "subtotal": 5102.74,
        "iva": 0,
        "total": 5102.74
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40 ,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENBERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4774.3,
        "laborSubtotal": 1444.6,
        "subtotal": 6218.9,
        "iva": 0,
        "total": 6218.9
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100, 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401ED815",
            "name": "BUJIAS IRIDIO",
            "qty": 4,
            "unitPrice": 575.88,
            "cost": 2303.52
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENBERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4869.22,
        "laborSubtotal": 2024.6,
        "subtotal": 6893.82,
        "iva": 0,
        "total": 6893.82
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 30, 50, 70, 90, 110,130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3107.79,
        "laborSubtotal": 1892.54,
        "subtotal": 5000.33,
        "iva": 0,
        "total": 5000.33
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60,140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891.5RB0B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3862.47,
        "laborSubtotal": 1892.54,
        "subtotal": 5755.01,
        "iva": 0,
        "total": 5755.01
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40 ,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4978.63,
        "laborSubtotal": 2530.54,
        "subtotal": 7509.17,
        "iva": 0,
        "total": 5595.48
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100, 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401ED815",
            "name": "BUJIAS IRIDIO",
            "qty": 4,
            "unitPrice": 575.88,
            "cost": 2303.52
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 290,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 719.2,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 310,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5073.55,
        "laborSubtotal": 2305.2,
        "subtotal": 7378.75,
        "iva": 0,
        "total": 7378.75
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 30, 50, 70, 90, 110,130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546.5RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMPOO",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU08Q2DDD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3457.11,
        "laborSubtotal": 1924.34,
        "subtotal": 5381.45,
        "iva": 0,
        "total": 5381.45
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60,140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546.5RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DDD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "27891.5RB0B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4549.55,
        "laborSubtotal": 1924.34,
        "subtotal": 6473.89,
        "iva": 0,
        "total": 6473.89
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40 ,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546.5RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5665.71,
        "laborSubtotal": 2562.34,
        "subtotal": 8228.05,
        "iva": 0,
        "total": 6314.36
      }
    ]
  },
  "np300_d22": {
    "modelKey": "np300_d22",
    "rawName": "NP300 / FRONTIER D22",
    "years": "08-15",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 110, 130 Y 140 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          110000,
          130000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54M86G0PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 218.39,
            "cost": 218.39
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2738.57,
        "laborSubtotal": 1444.6,
        "subtotal": 4183.17,
        "iva": 0,
        "total": 4183.17
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40,80 y 120 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "AF54M86G0PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 218.39,
            "cost": 218.39
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "00000215R0",
            "name": "LÍQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 1,
            "unitPrice": 105.01,
            "cost": 105.01
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "TL25AHD901",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 2,
            "unitPrice": 115.27,
            "cost": 230.54
          },
          {
            "partNumber": "4023201G00",
            "name": "GRASA COJINETES",
            "qty": 3,
            "unitPrice": 262.5,
            "cost": 787.5
          },
          {
            "partNumber": "TL14250BAT",
            "name": "GRASA",
            "qty": 2,
            "unitPrice": 50,
            "cost": 100
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENBERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3929.03,
        "laborSubtotal": 2024.6,
        "subtotal": 5953.63,
        "iva": 0,
        "total": 4255.59
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 110, 130 Y 140 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          110000,
          130000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54M86G0PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 218.39,
            "cost": 218.39
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "16400F4301",
            "name": "FILTRO GASOLINA",
            "qty": 1,
            "unitPrice": 206.55,
            "cost": 206.55
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 2898.75,
        "laborSubtotal": 1892.54,
        "subtotal": 4791.29,
        "iva": 0,
        "total": 4791.29
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40,80 y 120 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "AF54M86G0PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 218.39,
            "cost": 218.39
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "00000215R0",
            "name": "LÍQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 1,
            "unitPrice": 105.01,
            "cost": 105.01
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16400F4301",
            "name": "FILTRO GASOLINA",
            "qty": 1,
            "unitPrice": 206.55,
            "cost": 206.55
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "TL25A.HD901",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 2,
            "unitPrice": 115.27,
            "cost": 230.54
          },
          {
            "partNumber": "TL14250BAT",
            "name": "GRASA",
            "qty": 2,
            "unitPrice": 100,
            "cost": 200
          },
          {
            "partNumber": "4023201G00",
            "name": "GRASA COJINETES",
            "qty": 3,
            "unitPrice": 262.5,
            "cost": 787.5
          },
          {
            "partNumber": "NIMEX.U03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE CAJA",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          },
          {
            "code": "1288",
            "name": "engrasado de baleros",
            "cost": 870,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "cambio de fluidos",
            "cost": 638,
            "qty": 1
          }
        ],
        "partsSubtotal": 5695.33,
        "laborSubtotal": 3081.4,
        "subtotal": 8776.73,
        "iva": 0,
        "total": 5762.5
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 110, 130 Y 140 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          110000,
          130000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54M86G0PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 218.39,
            "cost": 218.39
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3379.28,
        "laborSubtotal": 1924.34,
        "subtotal": 5303.62,
        "iva": 0,
        "total": 5303.62
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40,80 y 120 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "AF54M86G0PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 218.39,
            "cost": 218.39
          },
          {
            "partNumber": "2240155Y15",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 37.85,
            "cost": 151.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 1,
            "unitPrice": 105.01,
            "cost": 105.01
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "TL25A.HD901",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 2,
            "unitPrice": 115.27,
            "cost": 230.54
          },
          {
            "partNumber": "4023201G00",
            "name": "SELLOS",
            "qty": 2,
            "unitPrice": 262.5,
            "cost": 525
          },
          {
            "partNumber": "TL142.50BAT",
            "name": "GRASA",
            "qty": 2,
            "unitPrice": 100,
            "cost": 200
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPPIEZA CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "1288",
            "name": "engrasado de baleros",
            "cost": 957,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "cambio de fluidos",
            "cost": 0,
            "qty": 1
          }
        ],
        "partsSubtotal": 4439.83,
        "laborSubtotal": 3046.4,
        "subtotal": 7486.23,
        "iva": 0,
        "total": 7486.23
      }
    ]
  },
  "urvan_nv350": {
    "modelKey": "urvan_nv350",
    "rawName": "NV350 E26   URVAN",
    "years": "13-20",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 110, 130 Y 140 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          110000,
          130000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546F40XJ",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 481.46,
            "cost": 481.46
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2806.65,
        "laborSubtotal": 1444.6,
        "subtotal": 4251.25,
        "iva": 0,
        "total": 4251.25
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40 ,80,120MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546F40XJ",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 481.46,
            "cost": 481.46
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENBERAL COCHES",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 5015.25,
        "laborSubtotal": 1444.6,
        "subtotal": 6459.85,
        "iva": 0,
        "total": 6459.85
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 110, 130 Y 140 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          110000,
          130000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546F40XJ",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 481.46,
            "cost": 481.46
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3010.98,
        "laborSubtotal": 1892.54,
        "subtotal": 4903.52,
        "iva": 0,
        "total": 4903.52
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40 ,80,120MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546F40XJ",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 481.46,
            "cost": 481.46
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5219.58,
        "laborSubtotal": 2530.54,
        "subtotal": 7750.12,
        "iva": 0,
        "total": 7750.12
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 20, 30, 50, 60, 70, 90, 110, 130 Y 140 MIL KM",
        "kmNumbers": [
          10000,
          20000,
          30000,
          50000,
          60000,
          70000,
          90000,
          110000,
          130000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546F40XJ",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 481.46,
            "cost": 481.46
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 290,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3698.06,
        "laborSubtotal": 2214.34,
        "subtotal": 5912.4,
        "iva": 0,
        "total": 3161.99
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40 ,80,120MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "16546F40XJ",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 481.46,
            "cost": 481.46
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 9,
            "unitPrice": 105.01,
            "cost": 945.09
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 290,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESSA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4643.15,
        "laborSubtotal": 2214.34,
        "subtotal": 6857.49,
        "iva": 0,
        "total": 4107.08
      }
    ]
  },
  "tiida_c11": {
    "modelKey": "tiida_c11",
    "rawName": "TIIDA C11",
    "years": "07-17",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 30, 50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 272.53
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2597.72,
        "laborSubtotal": 1444.6,
        "subtotal": 4042.32,
        "iva": 0,
        "total": 4042.32
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891EL00B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 457.41,
            "cost": 457.41
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3590.18,
        "laborSubtotal": 1444.6,
        "subtotal": 5034.78,
        "iva": 0,
        "total": 5034.78
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.54,
            "cost": 183.54
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4683.86,
        "laborSubtotal": 2024.6,
        "subtotal": 6708.46,
        "iva": 0,
        "total": 6708.46
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401CK81B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 382.01,
            "cost": 1528.04
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4003.1,
        "laborSubtotal": 2024.6,
        "subtotal": 6027.7,
        "iva": 0,
        "total": 6027.7
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 30, 50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 2840.54,
        "laborSubtotal": 1892.54,
        "subtotal": 4733.08,
        "iva": 0,
        "total": 4733.08
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891EL00B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 457.41,
            "cost": 457.41
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3794.51,
        "laborSubtotal": 1892.54,
        "subtotal": 5687.05,
        "iva": 0,
        "total": 5687.05
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 0
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 0,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3405.19,
        "laborSubtotal": 1892.54,
        "subtotal": 5297.73,
        "iva": 0,
        "total": 5297.73
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401CK81B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 382.01,
            "cost": 1528.04
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 290,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 310,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 719.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 310,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4207.43,
        "laborSubtotal": 2299.4,
        "subtotal": 6506.83,
        "iva": 0,
        "total": 6506.83
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 30, 50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3366.47,
        "laborSubtotal": 1927.2,
        "subtotal": 5293.67,
        "iva": 0,
        "total": 5293.67
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891EL00B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 457.41,
            "cost": 457.41
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4481.59,
        "laborSubtotal": 1927.2,
        "subtotal": 6408.79,
        "iva": 0,
        "total": 6408.79
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5575.07,
        "laborSubtotal": 2507.2,
        "subtotal": 8082.27,
        "iva": 0,
        "total": 6226.58
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "AF54MED00PNW",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 149.87,
            "cost": 149.87
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401CK81B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 382.01,
            "cost": 1528.04
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4894.51,
        "laborSubtotal": 2507.2,
        "subtotal": 7401.71,
        "iva": 0,
        "total": 7401.71
      }
    ]
  },
  "sentra_b17": {
    "modelKey": "sentra_b17",
    "rawName": "SENTRA B17",
    "years": "13-19",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10,30,50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2675.24,
        "laborSubtotal": 1444.6,
        "subtotal": 4119.84,
        "iva": 0,
        "total": 4119.84
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272773DF0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 251.78,
            "cost": 251.78
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3584.73,
        "laborSubtotal": 1444.6,
        "subtotal": 5029.33,
        "iva": 0,
        "total": 5029.33
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4883.84,
        "laborSubtotal": 2024.6,
        "subtotal": 6908.44,
        "iva": 0,
        "total": 5052.75
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401CK81B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 382.01,
            "cost": 1528.04
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4203.28,
        "laborSubtotal": 2024.6,
        "subtotal": 6227.88,
        "iva": 0,
        "total": 6227.88
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10,30,50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 2879.57,
        "laborSubtotal": 1892.54,
        "subtotal": 4772.11,
        "iva": 0,
        "total": 4772.11
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272773DF0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 251.78,
            "cost": 251.78
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3789.06,
        "laborSubtotal": 1892.54,
        "subtotal": 5681.6,
        "iva": 0,
        "total": 5681.6
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5088.17,
        "laborSubtotal": 2530.54,
        "subtotal": 7618.71,
        "iva": 0,
        "total": 5705.02
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401CK81B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 382.01,
            "cost": 1528.04
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4407.61,
        "laborSubtotal": 2472.54,
        "subtotal": 6880.15,
        "iva": 0,
        "total": 6880.15
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10,30,50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3566.65,
        "laborSubtotal": 1927.2,
        "subtotal": 5493.85,
        "iva": 0,
        "total": 5493.85
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27277.3DF0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 251.78,
            "cost": 251.78
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4476.14,
        "laborSubtotal": 1927.2,
        "subtotal": 6403.34,
        "iva": 0,
        "total": 6403.34
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5775.25,
        "laborSubtotal": 2507.2,
        "subtotal": 8282.45,
        "iva": 0,
        "total": 6426.76
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "1654630P0J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 350.05,
            "cost": 350.05
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401CK81B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 382.01,
            "cost": 1528.04
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5094.69,
        "laborSubtotal": 2507.2,
        "subtotal": 7601.89,
        "iva": 0,
        "total": 7601.89
      }
    ]
  },
  "sentra_b18": {
    "modelKey": "sentra_b18",
    "rawName": "SENTRA B18",
    "years": "20-21",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10,30,50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2666.08,
        "laborSubtotal": 1444.6,
        "subtotal": 4110.68,
        "iva": 0,
        "total": 4110.68
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272775NA0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 454.5,
            "cost": 454.5
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3778.29,
        "laborSubtotal": 1444.6,
        "subtotal": 5222.89,
        "iva": 0,
        "total": 5222.89
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4874.68,
        "laborSubtotal": 2024.6,
        "subtotal": 6899.28,
        "iva": 0,
        "total": 5043.59
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "224016LB1C",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 0,
            "cost": 0
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2666.08,
        "laborSubtotal": 2024.6,
        "subtotal": 4690.68,
        "iva": 0,
        "total": 4690.68
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10,30,50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2870.41,
        "laborSubtotal": 1444.6,
        "subtotal": 4315.01,
        "iva": 0,
        "total": 4315.01
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272775NA0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 454.5,
            "cost": 454.5
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3982.62,
        "laborSubtotal": 1444.6,
        "subtotal": 5427.22,
        "iva": 0,
        "total": 5427.22
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 5079.01,
        "laborSubtotal": 2024.6,
        "subtotal": 7103.61,
        "iva": 0,
        "total": 5247.92
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "224016LB1C",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 0,
            "cost": 0
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2870.41,
        "laborSubtotal": 2024.6,
        "subtotal": 4895.01,
        "iva": 0,
        "total": 4895.01
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10,30,50, 70, 90, 110 Y 130 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3557.49,
        "laborSubtotal": 1444.6,
        "subtotal": 5002.09,
        "iva": 0,
        "total": 5002.09
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60 Y 140 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272775NA0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 454.5,
            "cost": 454.5
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4669.7,
        "laborSubtotal": 1444.6,
        "subtotal": 6114.3,
        "iva": 0,
        "total": 6114.3
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40,80,120,160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 5766.09,
        "laborSubtotal": 2024.6,
        "subtotal": 7790.69,
        "iva": 0,
        "total": 5935
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165466LA0A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 340.89,
            "cost": 340.89
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "224016LB1C",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 0,
            "cost": 0
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEX.U08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3557.49,
        "laborSubtotal": 2024.6,
        "subtotal": 5582.09,
        "iva": 0,
        "total": 5582.09
      }
    ]
  },
  "xtrail_t32": {
    "modelKey": "xtrail_t32",
    "rawName": "X TRAIL T32",
    "years": "15-19",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 30, 50, 70, 90, 110, 130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3016.93,
        "laborSubtotal": 1444.6,
        "subtotal": 4461.53,
        "iva": 0,
        "total": 4461.53
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272774BA0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 626.08,
            "cost": 626.08
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4300.72,
        "laborSubtotal": 1444.6,
        "subtotal": 5745.32,
        "iva": 0,
        "total": 5745.32
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40 MIL KM",
        "kmNumbers": [
          40000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE CVT",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 6107.24,
        "laborSubtotal": 2024.6,
        "subtotal": 8131.84,
        "iva": 0,
        "total": 5394.44
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401JA01B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 1020.02,
            "cost": 4080.08
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 7097.01,
        "laborSubtotal": 2024.6,
        "subtotal": 9121.61,
        "iva": 0,
        "total": 9121.61
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 30, 50, 70, 90, 110, 130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3221.26,
        "laborSubtotal": 1892.54,
        "subtotal": 5113.8,
        "iva": 0,
        "total": 5113.8
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272774BA0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 626.08,
            "cost": 626.08
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4505.05,
        "laborSubtotal": 1892.54,
        "subtotal": 6397.59,
        "iva": 0,
        "total": 6397.59
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40 MIL KM",
        "kmNumbers": [
          40000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE CVT",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 6311.57,
        "laborSubtotal": 2530.54,
        "subtotal": 8842.11,
        "iva": 0,
        "total": 8842.11
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401.JA01B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 1020.02,
            "cost": 4080.08
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 7301.34,
        "laborSubtotal": 2472.54,
        "subtotal": 9773.88,
        "iva": 0,
        "total": 9773.88
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 30, 50, 70, 90, 110, 130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3908.34,
        "laborSubtotal": 1927.2,
        "subtotal": 5835.54,
        "iva": 0,
        "total": 5835.54
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272774BA0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 626.08,
            "cost": 626.08
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5192.13,
        "laborSubtotal": 1927.2,
        "subtotal": 7119.33,
        "iva": 0,
        "total": 7119.33
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40 MIL KM",
        "kmNumbers": [
          40000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE CVT",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 6998.65,
        "laborSubtotal": 2565.2,
        "subtotal": 9563.85,
        "iva": 0,
        "total": 6768.45
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464BA1J",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 691.74,
            "cost": 691.74
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401.JA01B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 1020.02,
            "cost": 4080.08
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU8Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 7988.42,
        "laborSubtotal": 2565.2,
        "subtotal": 10553.62,
        "iva": 0,
        "total": 10553.62
      }
    ]
  },
  "np300_d23": {
    "modelKey": "np300_d23",
    "rawName": "NP300 / NP300 FRONTIER D23",
    "years": "16-21",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10, 30, 50, 70, 90, 110, 130, 150, 170, 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2864.81,
        "laborSubtotal": 1444.6,
        "subtotal": 4309.41,
        "iva": 0,
        "total": 3976.9
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272775JJ0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 316.65,
            "cost": 316.65
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3839.17,
        "laborSubtotal": 1444.6,
        "subtotal": 5283.77,
        "iva": 0,
        "total": 5283.77
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40, 80 Y 120 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 142.22
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 4954.47,
        "laborSubtotal": 2024.6,
        "subtotal": 6979.07,
        "iva": 0,
        "total": 6979.07
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 MIL KM",
        "kmNumbers": [
          100000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401ED71B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 877.6,
            "cost": 3510.4
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 6375.21,
        "laborSubtotal": 2024.6,
        "subtotal": 8399.81,
        "iva": 0,
        "total": 8399.81
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "160 MIL KM Y 200 MIL KM",
        "kmNumbers": [
          160000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE TRASMICION",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          },
          {
            "partNumber": "KLD3675901",
            "name": "ACEITE DIFERENCIAL DEL",
            "qty": 1,
            "unitPrice": 2211.61,
            "cost": 2211.61
          },
          {
            "partNumber": "AD",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 3,
            "unitPrice": 393,
            "cost": 1179
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1212",
            "name": "LAVADO DE CARROCERIA",
            "cost": 154,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 489,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 8464.02,
        "laborSubtotal": 1678.58,
        "subtotal": 10142.6,
        "iva": 0,
        "total": 6751.99
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10, 30, 50, 70, 90, 110, 130, 150, 170, 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3069.14,
        "laborSubtotal": 1892.54,
        "subtotal": 4961.68,
        "iva": 0,
        "total": 4961.68
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "272775JJ0B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 316.65,
            "cost": 316.65
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4043.5,
        "laborSubtotal": 1892.54,
        "subtotal": 5936.04,
        "iva": 0,
        "total": 5936.04
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40, 80 Y 120 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5277.74,
        "laborSubtotal": 2530.54,
        "subtotal": 7808.28,
        "iva": 0,
        "total": 7808.28
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 MIL KM",
        "kmNumbers": [
          100000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401ED71B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 877.6,
            "cost": 3510.4
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 6579.54,
        "laborSubtotal": 2472.54,
        "subtotal": 9052.08,
        "iva": 0,
        "total": 9052.08
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "160 MIL KM Y 200 MIL KM",
        "kmNumbers": [
          160000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "KLD36.75901",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 3,
            "unitPrice": 2211.61,
            "cost": 6634.83
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 11912.57,
        "laborSubtotal": 2472.54,
        "subtotal": 14385.11,
        "iva": 0,
        "total": 14385.11
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10, 30, 50, 70, 90, 110, 130, 150, 170, 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3756.22,
        "laborSubtotal": 1927.2,
        "subtotal": 5683.42,
        "iva": 0,
        "total": 5683.42
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27277.5JJ0B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 316.65,
            "cost": 316.65
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4730.58,
        "laborSubtotal": 1927.2,
        "subtotal": 6657.78,
        "iva": 0,
        "total": 6657.78
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40, 80 Y 120 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "320018J29J",
            "name": "ACEITE DE TRANSMISION MANUAL",
            "qty": 3,
            "unitPrice": 425.23,
            "cost": 1275.69
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5964.82,
        "laborSubtotal": 2507.2,
        "subtotal": 8472.02,
        "iva": 0,
        "total": 6418.49
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 MIL KM",
        "kmNumbers": [
          100000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "22401ED71B",
            "name": "BUJIAS",
            "qty": 4,
            "unitPrice": 877.6,
            "cost": 3510.4
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1325",
            "name": "CAMBIO DE BUJIAS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 7266.62,
        "laborSubtotal": 2565.2,
        "subtotal": 9831.82,
        "iva": 0,
        "total": 9831.82
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "160 MIL KM",
        "kmNumbers": [
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "KLD36.75901",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 3,
            "unitPrice": 2211.61,
            "cost": 6634.83
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 11323.96,
        "laborSubtotal": 2507.2,
        "subtotal": 13831.16,
        "iva": 0,
        "total": 13831.16
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "200 MIL KM",
        "kmNumbers": [
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 6,
            "unitPrice": 207.11,
            "cost": 1242.66
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165464JM1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 332.51,
            "cost": 332.51
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "KLD36.75901",
            "name": "ACEITE DIFERENCIAL TRAS",
            "qty": 3,
            "unitPrice": 2211.61,
            "cost": 6634.83
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 11323.96,
        "laborSubtotal": 2565.2,
        "subtotal": 13889.16,
        "iva": 0,
        "total": 13889.16
      }
    ]
  },
  "kicks_p15": {
    "modelKey": "kicks_p15",
    "rawName": "KICKS P15",
    "years": "17-21",
    "packages": [
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "10,30,50, 70, 90, 110, 130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 2565.7,
        "laborSubtotal": 1444.6,
        "subtotal": 4010.3,
        "iva": 0,
        "total": 4010.3
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891.5RB0B",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 3658.14,
        "laborSubtotal": 1444.6,
        "subtotal": 5102.74,
        "iva": 0,
        "total": 5102.74
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "40, 80, 120 Y 160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE CVT",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 5656.01,
        "laborSubtotal": 2024.6,
        "subtotal": 7680.61,
        "iva": 0,
        "total": 4943.21
      },
      {
        "tierId": "basic",
        "name": "CHESA BÁSICO",
        "badge": "Mantenimiento Básico",
        "badgeColor": "bg-blue-100 text-blue-800 border-blue-200",
        "isRecommended": false,
        "timeEstimate": "1.5 - 2.0 horas",
        "description": "Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE TRANSMISIÓN CVT NS-3",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "22401ED815",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 575.88,
            "cost": 2303.52
          },
          {
            "partNumber": "278915RB0B",
            "name": "FILTRO AIRE COMPARTIMIENTO PASAJEROS",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 356.58,
            "qty": 1
          },
          {
            "code": "1209",
            "name": "LAVADO GENERAL",
            "cost": 316.22,
            "qty": 1
          },
          {
            "code": "2012",
            "name": "MANTENIMIENTO CHESA BASICO",
            "cost": 672.8,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 99,
            "qty": 1
          }
        ],
        "partsSubtotal": 7017.23,
        "laborSubtotal": 2024.6,
        "subtotal": 9041.83,
        "iva": 0,
        "total": 9041.83
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "10,30,50, 70, 90, 110, 130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 2813.74,
        "laborSubtotal": 1892.54,
        "subtotal": 4706.28,
        "iva": 0,
        "total": 4706.28
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 1,
            "unitPrice": 207.11,
            "cost": 207.11
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 4,
            "unitPrice": 43.71,
            "cost": 174.84
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891.5RB0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3372.27,
        "laborSubtotal": 1892.54,
        "subtotal": 5264.81,
        "iva": 0,
        "total": 5264.81
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "40, 80, 120 Y 160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE CVT",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2114",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 5860.34,
        "laborSubtotal": 2530.54,
        "subtotal": 8390.88,
        "iva": 0,
        "total": 5595.48
      },
      {
        "tierId": "recommended",
        "name": "CHESA PREMIUM",
        "badge": "★ Más Vendido / Recomendado",
        "badgeColor": "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
        "isRecommended": true,
        "timeEstimate": "2.5 - 3.0 horas",
        "description": "Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE TRANSMISIÓN CVT NS-3",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "22401ED815",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 575.88,
            "cost": 2303.52
          },
          {
            "partNumber": "278915RB0A",
            "name": "FILTRO AIRE CLIMA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIMPIADOR DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1224",
            "name": "LIMPIEZA DE INYECTORES",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 316,
            "qty": 1
          },
          {
            "code": "2014",
            "name": "MANTENIMIENTO CHESA PREMIUM",
            "cost": 829.4,
            "qty": 1
          },
          {
            "code": "1233",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338.14,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 7425.17,
        "laborSubtotal": 2472.54,
        "subtotal": 9897.71,
        "iva": 0,
        "total": 9897.71
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "10,30,50, 70, 90, 110, 130, 150, 170 Y 190 MIL KM",
        "kmNumbers": [
          10000,
          30000,
          50000,
          70000,
          90000,
          110000,
          130000,
          150000,
          170000,
          190000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 3457.11,
        "laborSubtotal": 1927.2,
        "subtotal": 5384.31,
        "iva": 0,
        "total": 5384.31
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "20, 60, 140 Y 180 MIL KM",
        "kmNumbers": [
          20000,
          60000,
          140000,
          180000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU08Q5DD",
            "name": "AIRE PURO",
            "qty": 1,
            "unitPrice": 657.71,
            "cost": 657.71
          },
          {
            "partNumber": "27891.5RB0A",
            "name": "FILTRO AIRE CABINA",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 4549.55,
        "laborSubtotal": 1927.2,
        "subtotal": 6476.75,
        "iva": 0,
        "total": 6476.75
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "40, 80, 120 Y 160 MIL KM",
        "kmNumbers": [
          40000,
          80000,
          120000,
          160000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 4,
            "unitPrice": 207.11,
            "cost": 828.44
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "165465RB1A",
            "name": "FILTRO DE AIRE",
            "qty": 1,
            "unitPrice": 447.62,
            "cost": 447.62
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE CVT",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "10120ZT70J",
            "name": "ANTICONGELANTE",
            "qty": 7,
            "unitPrice": 105.01,
            "cost": 735.07
          },
          {
            "partNumber": "000000215R0",
            "name": "LIQUIDO DE FRENOS",
            "qty": 2,
            "unitPrice": 98.92,
            "cost": 197.84
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 580,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 6547.42,
        "laborSubtotal": 2507.2,
        "subtotal": 9054.62,
        "iva": 0,
        "total": 6119.38
      },
      {
        "tierId": "premium",
        "name": "CHESA GOLD",
        "badge": "💎 Máxima Protección y Rendimiento",
        "badgeColor": "bg-purple-100 text-purple-900 border-purple-300 font-bold",
        "isRecommended": false,
        "timeEstimate": "3.5 - 4.5 horas",
        "description": "Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.",
        "kmText": "100 Y 200 MIL KM",
        "kmNumbers": [
          100000,
          200000
        ],
        "parts": [
          {
            "partNumber": "EMT15.W40SNDL",
            "name": "ACEITE DE MOTOR DE GASOLINA",
            "qty": 5,
            "unitPrice": 207.11,
            "cost": 1035.55
          },
          {
            "partNumber": "152089E01A",
            "name": "FILTRO ACEITE",
            "qty": 1,
            "unitPrice": 261.16,
            "cost": 261.16
          },
          {
            "partNumber": "11026JA00A",
            "name": "ARANDELA",
            "qty": 1,
            "unitPrice": 61.75,
            "cost": 61.75
          },
          {
            "partNumber": "QCVT1LTNS3",
            "name": "ACEITE TRANSMISIÓN CVT NS-3",
            "qty": 7,
            "unitPrice": 308.2,
            "cost": 2157.4
          },
          {
            "partNumber": "22401CP51B",
            "name": "BUJÍAS",
            "qty": 4,
            "unitPrice": 536.04,
            "cost": 2144.16
          },
          {
            "partNumber": "278915RB0A",
            "name": "FILTRO AIRE COMPARTIMIENTO PASAJEROS",
            "qty": 1,
            "unitPrice": 434.73,
            "cost": 434.73
          },
          {
            "partNumber": "NIMEXU03Q1DD",
            "name": "LIMPIADOR DE BALATAS",
            "qty": 1,
            "unitPrice": 203.61,
            "cost": 203.61
          },
          {
            "partNumber": "NIMEXU03Q9DD",
            "name": "LIQUIDO DE INYECTORES",
            "qty": 1,
            "unitPrice": 204.33,
            "cost": 204.33
          },
          {
            "partNumber": "NIMEX.U04Q5DD",
            "name": "SHAMP LIMP PARB",
            "qty": 1,
            "unitPrice": 43.71,
            "cost": 43.71
          },
          {
            "partNumber": "NIMEXU03Q3DD",
            "name": "LIMPIADOR DE MOTOR",
            "qty": 1,
            "unitPrice": 176.61,
            "cost": 176.61
          },
          {
            "partNumber": "NIMEXU8Q10DD",
            "name": "PROTECTOR DE BORNE DE  BATERIA",
            "qty": 1,
            "unitPrice": 183.34,
            "cost": 183.34
          },
          {
            "partNumber": "NIMEXUO3Q2DD",
            "name": "LIMPIADOR DE CUERPO DE ACELERACION",
            "qty": 1,
            "unitPrice": 161.15,
            "cost": 161.15
          },
          {
            "partNumber": "NIMEXU08Q2DD",
            "name": "LIMPIADOR DE COMBUSTION",
            "qty": 1,
            "unitPrice": 349.32,
            "cost": 349.32
          },
          {
            "partNumber": "NANOBIO120DD",
            "name": "NANOBIOCIDA",
            "qty": 1,
            "unitPrice": 102.03,
            "cost": 102.03
          },
          {
            "partNumber": "NITROTAP01DD",
            "name": "NITROGENO",
            "qty": 1,
            "unitPrice": 434.04,
            "cost": 434.04
          }
        ],
        "operations": [
          {
            "code": "1311",
            "name": "CAMBIO DE FLUIDOS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "CAMBIO DE BUJIAS",
            "cost": 638,
            "qty": 1
          },
          {
            "code": "1208",
            "name": "LAVADO GENERAL",
            "cost": 319,
            "qty": 1
          },
          {
            "code": "2013",
            "name": "MANTENIMIENTO CHESA GOLD",
            "cost": 925,
            "qty": 1
          },
          {
            "code": "2027",
            "name": "LIMPIEZA Y AJUSTE DE FRENOS 4 L",
            "cost": 338,
            "qty": 1
          },
          {
            "code": "2063",
            "name": "LIMPIEZA DE CAMARA DE ACELERACION",
            "cost": 255.2,
            "qty": 1
          },
          {
            "code": "MO",
            "name": "MATERIALES DIVERSOS",
            "cost": 90,
            "qty": 1
          }
        ],
        "partsSubtotal": 7952.89,
        "laborSubtotal": 3203.2,
        "subtotal": 11156.09,
        "iva": 0,
        "total": 11156.09
      }
    ]
  }
};

export function getMaintenancePackages(brand = 'NISSAN', modelId = 'versa_n18', km = 10000, customCatalog = null) {
  const activeCatalog = customCatalog || CHESA_NISSAN_CATALOG;
  const effectiveModelId = MODEL_ALIASES[modelId] || modelId;

  // Si tenemos el modelo en el catálogo activo (oficial o personalizado)
  if (activeCatalog && activeCatalog[effectiveModelId]) {
    const modelData = activeCatalog[effectiveModelId];
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
        return op.code && op.code !== 'MO' ? `${op.name} (Op. ${op.code})` : op.name;
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

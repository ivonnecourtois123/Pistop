import * as XLSX from 'xlsx';

export function normalizeModelKey(modelName) {
  if (!modelName) return 'general';
  const up = modelName.toUpperCase().trim();
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
  return modelName.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export function parseKmNumbers(kmStr) {
  if (!kmStr) return [];
  const numbers = [];
  const matches = String(kmStr).match(/\d+/g);
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

/**
 * Parsea un archivo Excel subido por el usuario (ArrayBuffer / Uint8Array).
 * Detecta automáticamente si es el formato multi-hoja CHESA o un formato tabular.
 */
export function parseMaintenanceExcel(data) {
  const wb = XLSX.read(data, { type: 'array' });
  const sheetNames = wb.SheetNames;

  const hasChesaSheets = sheetNames.some(s => s.toUpperCase().includes('BASICO') || s.toUpperCase().includes('BÁSICO'));

  if (hasChesaSheets) {
    return parseMultiSheetChesa(wb);
  } else {
    return parseTabularSheet(wb);
  }
}

function parseMultiSheetChesa(wb) {
  const tiers = [
    {
      keywords: ['BASICO', 'BÁSICO'],
      id: 'basic',
      name: 'CHESA BÁSICO',
      badge: 'Mantenimiento Básico',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      isRecommended: false,
      timeEstimate: '1.5 - 2.0 horas',
      description: 'Mantenimiento esencial según manual de servicio y cambio de fluidos básicos.',
    },
    {
      keywords: ['PREMIUM'],
      id: 'recommended',
      name: 'CHESA PREMIUM',
      badge: '★ Más Vendido / Recomendado',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      isRecommended: true,
      timeEstimate: '2.5 - 3.0 horas',
      description: 'Mantenimiento preventivo completo con aditivos, filtros y afinación profunda.',
    },
    {
      keywords: ['GOLD', 'ORO'],
      id: 'premium',
      name: 'CHESA GOLD',
      badge: '💎 Máxima Protección y Rendimiento',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
      isRecommended: false,
      timeEstimate: '3.5 - 4.5 horas',
      description: 'Protección integral 360° con lavado de inyectores, desinfección y cámara de aceleración.',
    },
  ];

  const catalog = {};
  let totalRowsParsed = 0;
  let totalPackagesParsed = 0;

  tiers.forEach(tier => {
    const sheetName = wb.SheetNames.find(s => tier.keywords.some(k => s.toUpperCase().includes(k)));
    if (!sheetName) return;

    const ws = wb.Sheets[sheetName];
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
          packages: [],
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
            qty: item.qty,
          });
        } else {
          partsSubtotal += item.amount;
          parts.push({
            partNumber: item.partNum ? String(item.partNum).trim() : 'REF',
            name: item.desc.trim(),
            qty: item.qty,
            unitPrice: Math.round(item.unitPrice * 100) / 100,
            cost: Math.round(item.amount * 100) / 100,
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
        total: Math.round(finalTotal * 100) / 100,
      });

      totalPackagesParsed++;
    }

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      totalRowsParsed++;

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

      const modKey = normalizeModelKey(col0);
      if (modKey && modKey !== 'general') {
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

  return {
    catalog,
    format: 'CHESA_MULTI_SHEET',
    sheetCount: wb.SheetNames.length,
    modelCount: Object.keys(catalog).length,
    packageCount: totalPackagesParsed,
    totalRows: totalRowsParsed,
  };
}

function parseTabularSheet(wb) {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
  const catalog = {};
  let totalPackagesParsed = 0;

  data.forEach((row) => {
    const rawModel = row.MODELO || row.Modelo || row.modelo || 'General';
    const modelKey = normalizeModelKey(rawModel);
    const km = Number(row.KILOMETRAJE || row.Kilometraje || row.km || row.KM || 10000);
    const tierRaw = String(row.TIPO_PAQUETE || row.PAQUETE || row.Paquete || 'RECOMENDADO').toUpperCase();
    
    let tierId = 'recommended';
    let tierName = 'CHESA PREMIUM';
    let badge = '★ Más Vendido / Recomendado';
    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    let isRecommended = true;

    if (tierRaw.includes('BASIC') || tierRaw.includes('BÁSIC')) {
      tierId = 'basic';
      tierName = 'CHESA BÁSICO';
      badge = 'Mantenimiento Básico';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
      isRecommended = false;
    } else if (tierRaw.includes('GOLD') || tierRaw.includes('ORO') || tierRaw.includes('PREMIUM_PLUS')) {
      tierId = 'premium';
      tierName = 'CHESA GOLD';
      badge = '💎 Máxima Protección y Rendimiento';
      badgeColor = 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      isRecommended = false;
    }

    if (!catalog[modelKey]) {
      catalog[modelKey] = {
        modelKey,
        rawName: rawModel,
        years: row.ANIO || row.AÑO || row.anios || '',
        packages: [],
      };
    }

    const partsCost = Number(row.COSTO_REFACCIONES || row.REFACCIONES || row.parts || 0);
    const laborCost = Number(row.COSTO_MO || row.MANO_DE_OBRA || row.labor || 0);
    const total = Number(row.TOTAL || row.Total || (partsCost + laborCost));

    const partsList = String(row.REFACCIONES_INCLUIDAS || row.Refacciones || '')
      .split(',')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => ({
        partNumber: 'REF',
        name: p,
        qty: 1,
        unitPrice: 0,
        cost: 0,
      }));

    catalog[modelKey].packages.push({
      tierId,
      name: tierName,
      badge,
      badgeColor,
      isRecommended,
      timeEstimate: '2.0 - 3.0 horas',
      description: row.DESCRIPCION || row.Descripcion || 'Paquete de mantenimiento preventivo.',
      kmText: `${km.toLocaleString()} km`,
      kmNumbers: [km],
      parts: partsList.length > 0 ? partsList : [{ partNumber: 'REF', name: 'Refacciones de afinación', qty: 1, unitPrice: partsCost, cost: partsCost }],
      operations: ['Inspección y servicio de mantenimiento certificado'],
      partsSubtotal: partsCost,
      laborSubtotal: laborCost,
      subtotal: partsCost + laborCost,
      iva: 0,
      total,
    });

    totalPackagesParsed++;
  });

  return {
    catalog,
    format: 'TABULAR',
    sheetCount: 1,
    modelCount: Object.keys(catalog).length,
    packageCount: totalPackagesParsed,
    totalRows: data.length,
  };
}

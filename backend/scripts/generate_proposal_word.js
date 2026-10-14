const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
} = require('docx');

async function createProposalDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: '1E293B', // Slate 800
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 120, // 6pt after
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'PitStop | Propuesta de Motor de Transición de Niveles y Candados',
                    size: 18,
                    color: '64748B',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Grupo Prosur — CHESA Automotriz  |  Página ',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    text: ' de ',
                    size: 18,
                    color: '94A3B8',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // PORTADA / TÍTULO PRINCIPAL
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'GRUPO PROSUR — CHESA AUTOMOTRIZ',
                bold: true,
                size: 24,
                color: '047857', // Emerald
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 200 },
            children: [
              new TextRun({
                text: 'SISTEMA PITSTOP — COTIZADOR DE MANTENIMIENTO INTELIGENTE',
                size: 20,
                bold: true,
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 300 },
            children: [
              new TextRun({
                text: 'PROPUESTA TÉCNICA Y COMERCIAL:\nMOTOR DE TRANSICIÓN DE NIVELES CON CANDADOS DE GARANTÍA',
                bold: true,
                size: 32,
                color: '0F172A', // Slate 900
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'Lógica de Up-Selling y Down-Selling Inteligente entre Paquetes FG, DG, Básico, Premium y Gold',
                size: 22,
                italics: true,
                color: '334155',
              }),
            ],
          }),

          // CAJA RESUMEN DE METADATOS
          createCalloutBox(
            'FICHA DE CONTROL DEL DOCUMENTO',
            [
              '• Elaborado para: Dirección y Gerencia de Servicio / Postventa y Asesores de Servicio',
              '• Proyecto: Sistema PitStop Tracker & Cotizador Comercial',
              '• Objetivo: Análisis y definición previa de reglas de negocio antes de implementación en código',
              '• Fecha: Octubre 2026 | Versión: 1.0 (Borrador para Aprobación)',
            ],
            'F1F5F9',
            '0F172A'
          ),

          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // SECCIÓN 1
          createHeading1('1. RESUMEN EJECUTIVO Y PROBLEMA COMERCIAL'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'En las operaciones diarias de servicio automotriz, los clientes solicitan ajustes sobre los paquetes de mantenimiento preventivo: algunos desean ',
              }),
              new TextRun({ text: 'agregar servicios o refacciones adicionales ', bold: true }),
              new TextRun({
                text: '(ej. bujías, afinación, limpieza de inyectores), mientras que otros solicitan ',
              }),
              new TextRun({ text: 'retirar elementos ', bold: true }),
              new TextRun({
                text: 'argumentando que los realizaron recientemente o que buscan reducir su presupuesto.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Actualmente, cuando un asesor agrega o retira refacciones a mano alzada, se presentan tres problemas críticos:\n',
              }),
              new TextRun({ text: '1. Desalineación de Tarifas: ', bold: true }),
              new TextRun({
                text: 'Cobrar piezas y mano de obra de forma suelta puede resultar más costoso para el cliente que adquirir el paquete del siguiente nivel, perdiendo una venta de mayor valor.\n',
              }),
              new TextRun({ text: '2. Riesgo de Pérdida de Garantía: ', bold: true }),
              new TextRun({
                text: 'Si a un vehículo con garantía de planta vigente se le degrada el aceite a especificación económica (mineral 20W-50), se puede invalidar la garantía oficial de motor.\n',
              }),
              new TextRun({ text: '3. Distorsión de Tiempos y Mano de Obra: ', bold: true }),
              new TextRun({
                text: 'Al quitar refacciones clave pero mantener la mano de obra del paquete superior, el cliente percibe un sobrecobro injustificado.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Para resolver esto, se propone el ',
              }),
              new TextRun({
                text: 'Motor de Transición de Niveles con Candados de Garantía',
                bold: true,
                color: '047857',
              }),
              new TextRun({
                text: ': un asistente interactivo en PitStop que detecta la configuración de elementos seleccionados y sugiere al asesor de manera automática y en tiempo real subir o bajar de nivel con un solo clic.',
              }),
            ],
          }),

          // SECCIÓN 2
          createHeading1('2. ARQUITECTURA DE LA ESCALERA DE 5 NIVELES'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Con la incorporación de los paquetes de Mantenimiento Fuera de Garantía (FG) y Dentro de Garantía (DG), la jerarquía de paquetes de PitStop se estructura en una escalera de 5 niveles ascendentes:',
              }),
            ],
          }),

          createLadderTable(),

          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // DETALLE DE CADA NIVEL
          createHeading2('Detalle Técnico de cada Nivel:'),
          new Paragraph({
            children: [
              new TextRun({ text: '• Nivel 1 — MTTO FG (Fuera de Garantía): ', bold: true, color: '64748B' }),
              new TextRun({
                text: 'Diseñado como producto de retención para unidades de modelo anterior que ya no asisten a la agencia por precio. Incluye 5L de aceite multigrado 20W-50 (EML20W50SNDD), filtro de aceite, arandela, lavado exterior, nanolavado desinfectante y materiales diversos. Tarifa de Mano de Obra: 1.53 horas ($1,347.93 con IVA). Total con IVA 16%: $3,547.70 MXN.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Nivel 2 — MTTO DG (Dentro de Garantía): ', bold: true, color: '0284C7' }),
              new TextRun({
                text: 'Servicio base obligatorio para conservar la póliza de garantía de fabricante. Emplea 5L de aceite sintético oficial de planta 5W-30 (ML5W3TAA7BDD), filtro de aceite, arandela, protector químico para bornes de batería, shampoo limpia parabrisas, lavado, nanolavado y materiales diversos. Tarifa de Mano de Obra: 1.83 horas ($1,612.23 con IVA). Total con IVA 16%: $4,264.13 MXN.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Nivel 3 — CHESA BÁSICO: ', bold: true, color: '2563EB' }),
              new TextRun({
                text: 'Mantenimiento preventivo esencial según el manual de servicio. Agrega cambio de bujías, reemplazo de filtro de aire del motor y servicio completo de limpieza y ajuste de frenos en las 4 ruedas (delanteros y traseros).',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Nivel 4 — CHESA PREMIUM (Recomendado / Más Vendido): ', bold: true, color: '059669' }),
              new TextRun({
                text: 'Afinación integral profunda. Añade limpieza de inyectores por boya presurizada, limpiador interno de motor (flush), limpiador especializado de balatas, nanobiocida y calibración de inflado con nitrógeno.',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Nivel 5 — CHESA GOLD (Servicio Integral Total): ', bold: true, color: 'D97706' }),
              new TextRun({
                text: 'Paquete de máxima protección vehicular. Añade purga y reemplazo de líquido de frenos DOT 4, reemplazo de anticongelante de larga duración, servicio computarizado de alineación y balanceo en las 4 ruedas y sustitución de plumas limpiaparabrisas originales.',
              }),
            ],
          }),

          // SECCIÓN 3
          createHeading1('3. DEFINICIÓN DE LOS CANDADOS DEL SISTEMA'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Los candados son las reglas algorítmicas que aseguran que el sistema proteja tanto la integridad mecánica del auto como la rentabilidad de la agencia.',
              }),
            ],
          }),

          createHeading2('Candado 1: Candado Duro de Componentes Esenciales (No Desmarcables)'),
          createCalloutBox(
            '🔒 REGLA DE INTEGRIDAD MECÁNICA',
            [
              '• En CUALQUIER paquete de mantenimiento, el Aceite de Motor, el Filtro de Aceite y la Arandela de Cárter son OBLIGATORIOS.',
              '• En la interfaz gráfica aparecerán marcados permanentemente con un candado gris. El asesor no puede desactivarlos.',
              '• Justificación: Un servicio sin cambio de aceite y filtro no califica técnicamente como mantenimiento preventivo.',
            ],
            'FEF2F2',
            '991B1B'
          ),

          new Paragraph({ spacing: { after: 150 }, children: [] }),

          createHeading2('Candado 2: Candado Duro de Garantía de Fábrica (Año / Kilometraje)'),
          createCalloutBox(
            '🛡️ REGLA DE PROTECCIÓN DE GARANTÍA',
            [
              '• Si los datos capturados en Sección 1 indican vehículo dentro de garantía (< 3 años o < 60,000 km), el sistema bloquea por defecto el paquete FG y activa DG.',
              '• Si el cliente insiste en solicitar paquete FG para abaratar costo, el sistema muestra una alerta de confirmación obligatoria:',
              '  "⚠️ ATENCIÓN: Esta unidad cuenta con garantía vigente. La aplicación de aceite mineral 20W-50 anula la garantía de tren motriz otorgada por el fabricante."',
              '• Se requiere confirmación explícita para proceder, quedando asentado en la cotización impresa.',
            ],
            'FFFBEB',
            'B45309'
          ),

          new Paragraph({ spacing: { after: 150 }, children: [] }),

          createHeading2('Candado 3: Candado de Transición Ascendente (Up-Selling Inteligente)'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'El sistema monitorea activamente las refacciones y operaciones adicionales que el asesor marque. Cuando detecta que los ítems agregados coinciden con los ',
              }),
              new TextRun({ text: 'elementos distintivos del nivel superior', bold: true }),
              new TextRun({
                text: ', despliega una recomendación visual inmediata:',
              }),
            ],
          }),

          createTransitionUpTable(),

          new Paragraph({ spacing: { after: 150 }, children: [] }),

          createHeading2('Candado 4: Candado de Transición Descendente (Down-Selling Justo)'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Si el cliente se encuentra en un paquete superior (ej. Premium o Gold) y solicita retirar elementos porque su presupuesto es ajustado o los cambió recientemente:',
              }),
            ],
          }),
          createCalloutBox(
            '📉 DETECCIÓN DE DEGRADACIÓN DE PAQUETE',
            [
              '• Ejemplo: Cliente en Paquete PREMIUM desmarca "Limpieza de Inyectores" y "Limpiador de Motor".',
              '• Detección del Sistema: El paquete resultante ahora coincide al 100% con los componentes del Paquete BÁSICO.',
              '• Alerta Inteligente: "Al retirar la limpieza de inyectores y lavado de motor, este servicio coincide con el Paquete BÁSICO. Te sugerimos migrar a BÁSICO para ajustar la mano de obra a 1.5 horas oficiales y ofrecerle al cliente el precio cerrado de $X en vez de cobrar mano de obra Premium."',
              '• Beneficio: Transparencia total frente al cliente y confianza en la cotización.',
            ],
            'EFF6FF',
            '1D4ED8'
          ),

          // SECCIÓN 4
          createHeading1('4. MATRIZ DE ELEMENTOS DISTINTIVOS POR PAQUETE'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'A continuación se detalla qué elementos se observan como parte de cada paquete y cuáles detonan el cambio de nivel:',
              }),
            ],
          }),

          createElementsMatrixTable(),

          new Paragraph({ spacing: { after: 200 }, children: [] }),

          // SECCIÓN 5
          createHeading1('5. EXPERIENCIA DE USUARIO PROPUESTA (UI / UX)'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Para garantizar que el cotizador siga siendo ágil (menos de 60 segundos por cotización en mostrador):',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Casillas de Selección Intuitivas: ', bold: true }),
              new TextRun({
                text: 'Cada refacción y operación del paquete contará con un checkbox interactivo. Los elementos obligatorios (aceite, filtro, arandela) mostrarán un icono de candado y no permitirán desmarcarse.\n',
              }),
              new TextRun({ text: '2. Banner Flotante de Sugerencia: ', bold: true }),
              new TextRun({
                text: 'Justo encima de la barra inferior de totales aparecerá un banner sutil y estilizado con animación suave cuando se cumpla la regla de cambio de nivel, mostrando:\n',
              }),
              new TextRun({
                text: '   • "💡 Sugerencia: Al agregar [Bujías + Filtro Aire], te conviene cambiar a Paquete BÁSICO y ahorrar $X MXN".\n',
                italics: true,
              }),
              new TextRun({
                text: '   • Botón directo: [ Cambiar a Paquete Básico con 1 Clic ].\n',
                bold: true,
              }),
              new TextRun({ text: '3. Respeto al Control del Asesor: ', bold: true }),
              new TextRun({
                text: 'El sistema NO cambiará de paquete de forma brusca o forzada; siempre sugerirá el cambio con un botón visible para que el asesor decida si lo aplica con el cliente.',
              }),
            ],
          }),

          // SECCIÓN 6
          createHeading1('6. CHECKLIST DE DECISIÓN PARA LA GERENCIA'),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Para avanzar con la programación una vez evaluado este documento, solicitamos la definición de los siguientes 4 puntos:',
              }),
            ],
          }),

          createDecisionChecklistTable(),

          new Paragraph({ spacing: { before: 300, after: 100 }, children: [] }),

          // FIRMAS
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: '__________________________________                __________________________________',
                color: '94A3B8',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50 },
            children: [
              new TextRun({
                text: '        Ing. Ivonne Courtois                                 Gerencia de Servicio / Postventa        \n',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: '    Mejora Continua — Grupo Prosur                             Aprobación de Reglas de Negocio        ',
                size: 18,
                color: '64748B',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(
    __dirname,
    '../../Propuesta_Motor_Transicion_Paquetes_PitStop.docx'
  );
  fs.writeFileSync(outputPath, buffer);
  console.log('Documento creado con éxito en:', outputPath);
}

// Funciones utilitarias para construir tablas y estilos
function createHeading1(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26,
        color: '0F172A',
      }),
    ],
  });
}

function createHeading2(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22,
        color: '047857',
      }),
    ],
  });
}

function createCalloutBox(title, lines, bgColorHex, borderColorHex) {
  const tableCells = [
    new TableCell({
      shading: { fill: bgColorHex, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        left: { style: BorderStyle.SINGLE, size: 24, color: borderColorHex },
      },
      children: [
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 20,
              color: borderColorHex,
            }),
          ],
        }),
        ...lines.map(
          (line) =>
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: line,
                  size: 19,
                  color: '334155',
                }),
              ],
            })
        ),
      ],
    }),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: tableCells })],
  });
}

function createLadderTable() {
  const headers = ['Nivel', 'Nombre de Paquete', 'Enfoque de Mercado', 'Tipo de Aceite', 'Tarifa Estimada'];
  const data = [
    ['Nivel 1', 'MTTO FG (Fuera de Garantía)', 'Retención de autos antiguos fuera de póliza', 'Mineral 20W-50 (5L)', '$3,547.70 MXN'],
    ['Nivel 2', 'MTTO DG (Dentro de Garantía)', 'Base legal para conservar póliza de planta', 'Sintético 5W-30 (5L)', '$4,264.13 MXN'],
    ['Nivel 3', 'CHESA BÁSICO', 'Mantenimiento esencial según manual de servicio', '5W-30 / 0W-20', 'Catálogo Oficial'],
    ['Nivel 4', 'CHESA PREMIUM ★', 'Afinación completa recomendada (Más Vendido)', '0W-20 / 5W-30 Sint.', 'Catálogo Oficial'],
    ['Nivel 5', 'CHESA GOLD', 'Servicio preventivo e integral de máxima vida útil', '100% Sintético', 'Catálogo Oficial'],
  ];

  return createStyledTable(headers, data, [12, 28, 30, 15, 15], '0F172A');
}

function createTransitionUpTable() {
  const headers = ['Paquete Origen', 'Elementos Agregados por Asesor', 'Paquete Sugerido', 'Beneficio del Up-Selling'];
  const data = [
    [
      'MTTO FG',
      'Cambio a Aceite 5W-30 + Shampoo + Protector Terminal',
      'MTTO DG',
      'Conserva garantía oficial y mejora rendimiento de combustible.',
    ],
    [
      'MTTO DG',
      'Agrega Filtro de Aire + Bujías + Limpieza de Frenos',
      'CHESA BÁSICO',
      'Mano de obra cerrada en paquete; más económico que ítems sueltos.',
    ],
    [
      'CHESA BÁSICO',
      'Agrega Limpieza Inyectores por Boya + Flush de Motor',
      'CHESA PREMIUM',
      'Restaura potencia, ahorra gasolina e incluye aditivos oficiales.',
    ],
    [
      'CHESA PREMIUM',
      'Agrega Purga Líquido Frenos + Alineación/Balanceo + Plumas',
      'CHESA GOLD',
      'Servicio total garantizado de seguridad y estabilidad.',
    ],
  ];

  return createStyledTable(headers, data, [15, 35, 20, 30], '047857');
}

function createElementsMatrixTable() {
  const headers = ['Concepto / Operación', 'FG', 'DG', 'BÁSICO', 'PREMIUM', 'GOLD'];
  const data = [
    ['Aceite de Motor (5L)', '20W-50 Mineral', '5W-30 Sintético', '0W-20 / 5W-30', '0W-20 / 5W-30', '0W-20 / 5W-30'],
    ['Filtro de Aceite y Arandela', '✓ Incluido', '✓ Incluido', '✓ Incluido', '✓ Incluido', '✓ Incluido'],
    ['Lavado, Nanolavado y Materiales', '✓ Incluido', '✓ Incluido', '✓ Incluido', '✓ Incluido', '✓ Incluido'],
    ['Protector Borne y Shampoo', '—', '✓ Incluido', '✓ Incluido', '✓ Incluido', '✓ Incluido'],
    ['Filtro de Aire de Motor', '—', '—', '✓ Incluido', '✓ Incluido', '✓ Incluido'],
    ['Juego de Bujías', '—', '—', '✓ Incluido', '✓ Incluido', '✓ Incluido'],
    ['Limpieza y Ajuste de Frenos (4R)', '—', '—', '✓ Incluido', '✓ Incluido', '✓ Incluido'],
    ['Limpieza Inyectores (Boya) + Flush', '—', '—', '—', '✓ Incluido', '✓ Incluido'],
    ['Limpiador Balatas y Nanobiocida', '—', '—', '—', '✓ Incluido', '✓ Incluido'],
    ['Inflado con Nitrógeno', '—', '—', '—', '✓ Incluido', '✓ Incluido'],
    ['Purga Líquido de Frenos DOT4', '—', '—', '—', '—', '✓ Incluido'],
    ['Alineación y Balanceo Computarizado', '—', '—', '—', '—', '✓ Incluido'],
    ['Juego de Plumas Limpiaparabrisas', '—', '—', '—', '—', '✓ Incluido'],
  ];

  return createStyledTable(headers, data, [30, 14, 14, 14, 14, 14], '1E293B');
}

function createDecisionChecklistTable() {
  const headers = ['#', 'Pregunta de Decisión', 'Opción Recomendada', 'Alternativa', 'Estado'];
  const data = [
    [
      '1',
      '¿El orden de la escalera debe ser FG ➔ DG ➔ Básico ➔ Premium ➔ Gold?',
      'SÍ, permite cubrir desde retención económica hasta servicio total.',
      'Separar en dos pestañas: Con Garantía vs Sin Garantía.',
      '[   ] Por definir',
    ],
    [
      '2',
      '¿Los precios de FG ($3,547.70) y DG ($4,264.13) son fijos o varían por modelo?',
      'Parámetro general para 4 cilindros (5L aceite).',
      'Crear matriz por modelo en Excel como CHESA Nissan.',
      '[   ] Por definir',
    ],
    [
      '3',
      '¿Cómo debe activarse el cambio de paquete al cumplir la regla?',
      'Con Botón de Sugerencia ("Aceptar Cambio a Básico"). Da control al asesor.',
      'Automático en tiempo real al marcar casillas.',
      '[   ] Por definir',
    ],
    [
      '4',
      '¿Se debe advertir formalmente al degradar de DG a FG en autos con garantía?',
      'SÍ, alerta obligatoria para evitar reclamos por pérdida de garantía.',
      'No advertir, dejarlo a criterio libre del cliente.',
      '[   ] Por definir',
    ],
  ];

  return createStyledTable(headers, data, [5, 35, 30, 20, 10], '047857');
}

function createStyledTable(headers, rowsData, colWidthsPercent, headerColorHex) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h, idx) =>
        new TableCell({
          shading: { fill: headerColorHex, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
          width: { size: colWidthsPercent[idx], type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 12, color: '0F172A' },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          children: [
            new Paragraph({
              alignment: idx === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  size: 19,
                  color: 'FFFFFF',
                }),
              ],
            }),
          ],
        })
    ),
  });

  const bodyRows = rowsData.map((row, rIdx) => {
    const isEven = rIdx % 2 === 0;
    return new TableRow({
      children: row.map(
        (cellText, cIdx) =>
          new TableCell({
            shading: { fill: isEven ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            width: { size: colWidthsPercent[cIdx], type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: cIdx === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: cellText,
                    size: 18,
                    bold: cIdx === 0 && rIdx === 0 ? false : cellText.includes('✓') || cellText.includes('★'),
                    color: cellText.includes('✓') ? '047857' : '334155',
                  }),
                ],
              }),
            ],
          })
      ),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
  });
}

createProposalDocument().catch(console.error);

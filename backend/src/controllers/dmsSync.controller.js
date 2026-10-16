const dmsSyncService = require('../services/dmsSync.service');

async function syncExcelRows(req, res) {
  const { rows, cleanPreviousDemos, agency, completeMissingOrders, orderType } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Se requiere un arreglo de filas (rows) para procesar' });
  }

  const result = await dmsSyncService.processDmsRows(rows, {
    cleanPreviousDemos: Boolean(cleanPreviousDemos),
    agency: agency ? String(agency).trim() : null,
    completeMissingOrders: completeMissingOrders !== false,
    orderType: orderType || 'SERVICIO',
  });

  return res.json(result);
}

async function previewSync(req, res) {
  const { orderNumbers, agency, orderType } = req.body;
  if (!Array.isArray(orderNumbers)) {
    return res.status(400).json({ error: 'Se requiere un arreglo de orderNumbers' });
  }

  const result = await dmsSyncService.previewDmsSync(orderNumbers, {
    agency: agency ? String(agency).trim() : null,
    orderType: orderType || 'SERVICIO',
  });

  return res.json(result);
}

async function cleanDemoData(req, res) {
  const result = await dmsSyncService.clearDemoOrders();
  return res.json({
    success: true,
    message: `Se eliminaron ${result.removedCount} órdenes de demostración`,
    removedCount: result.removedCount,
  });
}

module.exports = {
  syncExcelRows,
  previewSync,
  cleanDemoData,
};

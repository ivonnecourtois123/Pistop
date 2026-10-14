const dmsSyncService = require('../services/dmsSync.service');

async function syncExcelRows(req, res) {
  const { rows, cleanPreviousDemos } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Se requiere un arreglo de filas (rows) para procesar' });
  }

  const result = await dmsSyncService.processDmsRows(rows, {
    cleanPreviousDemos: Boolean(cleanPreviousDemos),
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
  cleanDemoData,
};

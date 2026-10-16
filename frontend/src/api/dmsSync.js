import apiClient from './client.js';

export async function syncDmsRows(
  rows,
  cleanPreviousDemos = false,
  agency = null,
  completeMissingOrders = true,
  orderType = 'SERVICIO'
) {
  const { data } = await apiClient.post('/dms/sync-rows', {
    rows,
    cleanPreviousDemos,
    agency,
    completeMissingOrders,
    orderType,
  });
  return data;
}

export async function previewDmsSync(orderNumbers, agency = null, orderType = 'SERVICIO') {
  const { data } = await apiClient.post('/dms/preview-sync', {
    orderNumbers,
    agency,
    orderType,
  });
  return data;
}

export async function cleanDemoOrders() {
  const { data } = await apiClient.post('/dms/clean-demos');
  return data;
}

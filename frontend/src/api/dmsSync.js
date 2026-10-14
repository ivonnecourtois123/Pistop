import apiClient from './client.js';

export async function syncDmsRows(rows, cleanPreviousDemos = false, agency = null) {
  const { data } = await apiClient.post('/dms/sync-rows', {
    rows,
    cleanPreviousDemos,
    agency,
  });
  return data;
}

export async function cleanDemoOrders() {
  const { data } = await apiClient.post('/dms/clean-demos');
  return data;
}

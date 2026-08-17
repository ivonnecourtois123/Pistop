import apiClient from './client';

export async function listStatusMappings() {
  const { data } = await apiClient.get('/status-mappings');
  return data;
}

export async function createStatusMapping(payload) {
  const { data } = await apiClient.post('/status-mappings', payload);
  return data;
}

export async function updateStatusMapping(id, internalStatus) {
  const { data } = await apiClient.patch(`/status-mappings/${id}`, { internalStatus });
  return data;
}

export async function removeStatusMapping(id) {
  await apiClient.delete(`/status-mappings/${id}`);
}

import apiClient from './client';

export async function listTechnicians() {
  const { data } = await apiClient.get('/technicians');
  return data;
}

export async function createTechnician(payload) {
  const { data } = await apiClient.post('/technicians', payload);
  return data;
}

export async function updateTechnician(id, payload) {
  const { data } = await apiClient.patch(`/technicians/${id}`, payload);
  return data;
}

export async function removeTechnician(id) {
  await apiClient.delete(`/technicians/${id}`);
}

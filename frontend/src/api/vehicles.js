import apiClient from './client';

export async function listVehicles() {
  const { data } = await apiClient.get('/vehicles');
  return data;
}

export async function createVehicle(payload) {
  const { data } = await apiClient.post('/vehicles', payload);
  return data;
}

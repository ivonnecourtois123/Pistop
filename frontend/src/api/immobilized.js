import apiClient from './client';

export async function listImmobilized(params) {
  const { data } = await apiClient.get('/immobilized', { params });
  return data;
}

export async function getImmobilized(id) {
  const { data } = await apiClient.get(`/immobilized/${id}`);
  return data;
}

export async function createImmobilized(payload) {
  const { data } = await apiClient.post('/immobilized', payload);
  return data;
}

export async function updateImmobilized(id, payload) {
  const { data } = await apiClient.patch(`/immobilized/${id}`, payload);
  return data;
}

export async function updateImmobilizedTreatmentType(id, treatmentType) {
  const { data } = await apiClient.patch(`/immobilized/${id}/treatment-type`, { treatmentType });
  return data;
}

export async function setImmobilizedResolved(id, resolved) {
  const { data } = await apiClient.patch(`/immobilized/${id}/resolved`, { resolved });
  return data;
}

export async function addImmobilizedComment(id, comment) {
  const { data } = await apiClient.post(`/immobilized/${id}/comments`, { comment });
  return data;
}

import apiClient from './client';

export async function listInsuranceCases() {
  const { data } = await apiClient.get('/insurance-cases');
  return data;
}

export async function getInsuranceCase(id) {
  const { data } = await apiClient.get(`/insurance-cases/${id}`);
  return data;
}

export async function updateInsuranceCase(id, payload) {
  const { data } = await apiClient.patch(`/insurance-cases/${id}`, payload);
  return data;
}

export async function advanceInsuranceStage(id, stage) {
  const { data } = await apiClient.patch(`/insurance-cases/${id}/stage`, { stage });
  return data;
}

export async function toggleInsuranceDocument(id, docType, completed) {
  const { data } = await apiClient.patch(`/insurance-cases/${id}/documents/${docType}`, { completed });
  return data;
}

export async function addInsuranceStageComment(id, stage, comment) {
  const { data } = await apiClient.post(`/insurance-cases/${id}/comments`, { stage, comment });
  return data;
}

import apiClient from './client.js';

// Catálogo maestro de operaciones
export async function getWorkshopOperations(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.active !== undefined) query.set('active', params.active);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  const { data } = await apiClient.get(`/workshop-operations${qStr}`);
  return data;
}

export async function createWorkshopOperation(payload) {
  const { data } = await apiClient.post('/workshop-operations', payload);
  return data;
}

export async function updateWorkshopOperation(id, payload) {
  const { data } = await apiClient.patch(`/workshop-operations/${id}`, payload);
  return data;
}

export async function deleteWorkshopOperation(id) {
  await apiClient.delete(`/workshop-operations/${id}`);
}

// Operaciones asociadas a una orden de trabajo
export async function getWorkOrderOperations(orderId) {
  const { data } = await apiClient.get(`/workshop-operations/order/${orderId}`);
  return data;
}

export async function addWorkOrderOperation(orderId, payload) {
  const { data } = await apiClient.post(`/workshop-operations/order/${orderId}`, payload);
  return data;
}

export async function addWorkOrderOperationsBatch(orderId, operationsList) {
  const { data } = await apiClient.post(`/workshop-operations/order/${orderId}`, operationsList);
  return data;
}

export async function updateWorkOrderOperation(operationId, payload) {
  const { data } = await apiClient.patch(`/workshop-operations/order-op/${operationId}`, payload);
  return data;
}

export async function deleteWorkOrderOperation(operationId) {
  await apiClient.delete(`/workshop-operations/order-op/${operationId}`);
}

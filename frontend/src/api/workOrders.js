import apiClient from './client';

export async function searchWorkOrders(query) {
  const { data } = await apiClient.get('/work-orders', { params: { q: query } });
  return data;
}

export async function getLatestWorkOrder() {
  const { data } = await apiClient.get('/work-orders/latest');
  return data;
}

export async function getWorkOrder(id) {
  const { data } = await apiClient.get(`/work-orders/${id}`);
  return data;
}

export async function createWorkOrder(payload) {
  const { data } = await apiClient.post('/work-orders', payload);
  return data;
}

export async function updateWorkOrderStatus(id, status, note) {
  const { data } = await apiClient.patch(`/work-orders/${id}/status`, { status, note });
  return data;
}

export async function getTodayStats(orderType) {
  const { data } = await apiClient.get('/work-orders/stats/today', { params: { orderType } });
  return data;
}

export async function getInProgressWorkOrders(orderType) {
  const { data } = await apiClient.get('/work-orders/in-progress', { params: { orderType } });
  return data;
}

export async function updatePartsReady(id, partsReady) {
  const { data } = await apiClient.patch(`/work-orders/${id}/parts-ready`, { partsReady });
  return data;
}

export async function addPendingPart(id, { partNumber, description, orderNumber, orderDate }) {
  const { data } = await apiClient.post(`/work-orders/${id}/pending-parts`, {
    partNumber,
    description,
    orderNumber,
    orderDate,
  });
  return data;
}

export async function setPendingPartReceived(id, partId, received) {
  const { data } = await apiClient.patch(`/work-orders/${id}/pending-parts/${partId}`, { received });
  return data;
}

export async function removePendingPart(id, partId) {
  const { data } = await apiClient.delete(`/work-orders/${id}/pending-parts/${partId}`);
  return data;
}

// serviceCategoryOrNull: la clave de la categoría, o null para dejarla sin definir
export async function updateServiceCategory(id, serviceCategoryOrNull) {
  const { data } = await apiClient.patch(`/work-orders/${id}/service-category`, {
    serviceCategory: serviceCategoryOrNull,
  });
  return data;
}

export async function updateCustomerWaiting(id, customerWaiting) {
  const { data } = await apiClient.patch(`/work-orders/${id}/customer-waiting`, { customerWaiting });
  return data;
}

export async function updateDiagnosisNeeded(id, diagnosisNeeded) {
  const { data } = await apiClient.patch(`/work-orders/${id}/diagnosis-needed`, { diagnosisNeeded });
  return data;
}

export async function updateWashNeeded(id, washNeeded) {
  const { data } = await apiClient.patch(`/work-orders/${id}/wash-needed`, { washNeeded });
  return data;
}

// insurerOrNull / reportNumberOrNull: null limpia el campo
export async function updateInsurer(id, insurerOrNull) {
  const { data } = await apiClient.patch(`/work-orders/${id}/insurer`, { insurer: insurerOrNull });
  return data;
}

export async function updateReportNumber(id, reportNumberOrNull) {
  const { data } = await apiClient.patch(`/work-orders/${id}/report-number`, { reportNumber: reportNumberOrNull });
  return data;
}

// technicianIdOrNull: el id del técnico, o null para desasignarlo
export async function updateWorkOrderTechnician(id, technicianIdOrNull) {
  const { data } = await apiClient.patch(`/work-orders/${id}/technician`, { technicianId: technicianIdOrNull });
  return data;
}

// subStateOrNull: la clave del sub-estado, o null para quitarlo
export async function updateWorkOrderSubState(id, subStateOrNull) {
  const { data } = await apiClient.patch(`/work-orders/${id}/sub-state`, { subState: subStateOrNull });
  return data;
}

export async function updateWorkOrderType(id, orderType) {
  const { data } = await apiClient.patch(`/work-orders/${id}/order-type`, { orderType });
  return data;
}

export async function updateEstimatedDelivery(id, estimatedDeliveryAtOrNull) {
  const { data } = await apiClient.patch(`/work-orders/${id}/estimated-delivery`, {
    estimatedDeliveryAt: estimatedDeliveryAtOrNull,
  });
  return data;
}

export async function addStageComment(id, stage, comment) {
  const { data } = await apiClient.post(`/work-orders/${id}/comments`, { stage, comment });
  return data;
}

export async function getStageDurationsReport(orderType) {
  const { data } = await apiClient.get('/work-orders/reports/stage-durations', { params: { orderType } });
  return data;
}

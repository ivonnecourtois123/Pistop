import apiClient from './client';

export async function getCapacity(team) {
  const { data } = await apiClient.get(`/work-orders/capacity/${team}`);
  return data;
}

export async function getCapacitySettings(team) {
  const { data } = await apiClient.get(`/work-orders/capacity/${team}/settings`);
  return data;
}

export async function updateCapacitySettings(team, payload) {
  const { data } = await apiClient.patch(`/work-orders/capacity/${team}/settings`, payload);
  return data;
}

export async function getServiceCategoryHours() {
  const { data } = await apiClient.get('/work-orders/capacity/service-category-hours');
  return data;
}

export async function getServiceCategoryImpact(category) {
  const { data } = await apiClient.get(`/work-orders/capacity/service-category-impact/${encodeURIComponent(category)}`);
  return data;
}

export async function updateServiceCategoryHours(category, hours, newCategory) {
  const { data } = await apiClient.patch(`/work-orders/capacity/service-category-hours/${encodeURIComponent(category)}`, { hours, newCategory });
  return data;
}

export async function createServiceCategoryHours(category, hours) {
  const { data } = await apiClient.post('/work-orders/capacity/service-category-hours', { category, hours });
  return data;
}

export async function deleteServiceCategoryHours(category, options = {}) {
  const { data } = await apiClient.delete(`/work-orders/capacity/service-category-hours/${encodeURIComponent(category)}`, { data: options });
  return data;
}

export async function getOrphanedServiceCategories() {
  const { data } = await apiClient.get('/work-orders/capacity/orphaned-categories');
  return data;
}

export async function reassignServiceCategory(fromCategory, toCategory) {
  const { data } = await apiClient.post('/work-orders/capacity/reassign-category', { fromCategory, toCategory });
  return data;
}

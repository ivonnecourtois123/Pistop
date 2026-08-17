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

export async function updateServiceCategoryHours(category, hours) {
  const { data } = await apiClient.patch(`/work-orders/capacity/service-category-hours/${category}`, { hours });
  return data;
}

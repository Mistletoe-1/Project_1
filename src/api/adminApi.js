async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '接口请求失败' }));
    throw new Error(error.message || '接口请求失败');
  }

  return response.json();
}

export function getBootstrap() {
  return request('/api/bootstrap');
}

export function advanceOrder(id) {
  return request(`/api/orders/${encodeURIComponent(id)}`, { method: 'PATCH' });
}

export function restockProduct(id) {
  return request(`/api/products/${encodeURIComponent(id)}`, { method: 'PATCH' });
}

export function createCampaign(payload) {
  return request('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function advanceCampaign(id) {
  return request(`/api/campaigns/${encodeURIComponent(id)}`, { method: 'PATCH' });
}

import { clearSession, getToken } from '../utils/auth';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(status, message) { super(message); this.name = 'ApiError'; this.status = status; }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) { const token = getToken(); if (token) headers.Authorization = `Bearer ${token}`; }

  let response;
  try { response = await fetch(`${API_BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch { throw new ApiError(0, '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'); }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && auth) clearSession();
    throw new ApiError(response.status, data.message || '요청을 처리하지 못했습니다.');
  }
  return data;
}

export const api = {
  register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password }, auth: false }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  createReport: (payload) => request('/reports', { method: 'POST', body: payload }),
  getReports: () => request('/reports'),
  getReport: (id) => request(`/reports/${encodeURIComponent(id)}`),
  deleteReport: (id) => request(`/reports/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  health: () => request('/health', { auth: false })
};

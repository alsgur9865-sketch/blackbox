const TOKEN_KEY = 'blackbox_access_token_v2';
const REFRESH_KEY = 'blackbox_refresh_token_v2';
const USER_KEY = 'blackbox_user_v2';

export function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function getRefreshToken() { return localStorage.getItem(REFRESH_KEY) || ''; }
export function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }

export function setSession({ accessToken, refreshToken, user }) {
  if (!accessToken || !user) return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('blackbox-auth-change'));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('blackbox-auth-change'));
}

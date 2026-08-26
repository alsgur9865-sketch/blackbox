const USER_KEY = 'blackbox_user_v1';

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
}

export function login(email) {
  const user = { email: email.trim(), isLoggedIn: true, loggedInAt: new Date().toISOString() };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('blackbox-auth-change'));
  return user;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('blackbox-auth-change'));
}

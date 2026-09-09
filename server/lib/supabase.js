import { HttpError } from './httpError.js';

const DEFAULT_SUPABASE_URL = 'https://aurulvoglgzaditlinaf.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_dkSD2bzamoFC4qY5fruCqA_IV2oT9BP';

function getConfig() {
  const url = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, '');
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new HttpError(500, '서버 데이터베이스 설정이 완료되지 않았습니다.');
  return { url, key };
}

async function parseResponse(response, fallbackMessage) {
  const type = response.headers.get('content-type') || '';
  let data = null;
  if (type.includes('application/json')) data = await response.json().catch(() => null);
  else data = await response.text().catch(() => '');

  if (!response.ok) {
    const message = typeof data === 'object' && data
      ? data.error_description || data.message || data.msg || data.error || fallbackMessage
      : fallbackMessage;
    throw new HttpError(response.status, message || fallbackMessage, data);
  }
  return data;
}

function baseHeaders(key, token) {
  return {
    apikey: key,
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function signUpWithPassword(email, password) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: { ...baseHeaders(key), 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return parseResponse(response, '회원가입을 처리하지 못했습니다.');
}

export async function signInWithPassword(email, password) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { ...baseHeaders(key), 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return parseResponse(response, '로그인에 실패했습니다.');
}

export async function getAuthUser(token) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: baseHeaders(key, token)
  });
  return parseResponse(response, '로그인 정보를 확인하지 못했습니다.');
}

export async function signOut(token) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/auth/v1/logout?scope=local`, {
    method: 'POST',
    headers: baseHeaders(key, token)
  });
  if (response.status === 204) return null;
  return parseResponse(response, '로그아웃을 처리하지 못했습니다.');
}

export async function restRequest(path, { token, method = 'GET', body, prefer } = {}) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      ...baseHeaders(key, token),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (response.status === 204) return null;
  return parseResponse(response, '데이터베이스 요청을 처리하지 못했습니다.');
}

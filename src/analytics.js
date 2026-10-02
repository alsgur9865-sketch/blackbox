import * as amplitude from '@amplitude/analytics-browser';

const FIRST_TOUCH_KEY = 'blackbox_first_touch_v1';
const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];

let ready = false;
let userId = '';

function readFirstTouch() {
  try { return JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY) || '{}'); }
  catch { return {}; }
}

function captureFirstTouch() {
  const saved = readFirstTouch();
  if (Object.keys(saved).length) return saved;

  const params = new URLSearchParams(location.search);
  const data = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) data[key] = value.slice(0, 160);
  });

  if (document.referrer) {
    try { data.referrer_domain = new URL(document.referrer).hostname.slice(0, 160); }
    catch {}
  }

  if (Object.keys(data).length) {
    try { localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(data)); }
    catch {}
  }
  return data;
}

function commonProps() {
  return {
    page_path: location.pathname,
    auth_state: userId ? 'authenticated' : 'anonymous',
    ...captureFirstTouch()
  };
}

export function trackEvent(name, props = {}) {
  if (!ready) return;
  const payload = { ...commonProps(), ...props };
  amplitude.track(name, payload);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
}

function identifyProps(state) {
  const identify = new amplitude.Identify().set('auth_state', state);
  Object.entries(readFirstTouch()).forEach(([key, value]) => {
    identify.set(`first_${key}`, value);
  });
  amplitude.identify(identify);
}

export function identifyAnalyticsUser(user) {
  if (!ready || !user?.id) return;
  userId = String(user.id);
  amplitude.setUserId(userId);
  identifyProps('authenticated');
}

export function resetAnalyticsUser() {
  if (!ready) return;
  amplitude.reset();
  userId = '';
  identifyProps('anonymous');
}

function parseBody(body) {
  if (typeof body !== 'string') return null;
  try { return JSON.parse(body); } catch { return null; }
}

function getPath(input) {
  try {
    const raw = typeof input === 'string' ? input : input?.url;
    return raw ? new URL(raw, location.origin).pathname : '';
  } catch { return ''; }
}

async function getJson(response) {
  try { return await response.clone().json(); }
  catch { return null; }
}

async function onApiSuccess(path, method, body, response) {
  if (path === '/api/auth/register' && method === 'POST') {
    const data = await getJson(response);
    trackEvent('sign_up_submitted', {
      requires_email_confirmation: Boolean(data?.requiresEmailConfirmation)
    });
    if (!data?.requiresEmailConfirmation && data?.user?.id) {
      identifyAnalyticsUser(data.user);
      trackEvent('sign_up_completed');
    }
    return;
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const data = await getJson(response);
    if (data?.user?.id) {
      identifyAnalyticsUser(data.user);
      trackEvent('login_completed');
    }
    return;
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    trackEvent('logout_completed');
    resetAnalyticsUser();
    return;
  }

  if (path === '/api/reports' && method === 'POST') {
    const data = await getJson(response);
    trackEvent('report_generated', {
      report_id: data?.report?.id,
      trade_count: Array.isArray(body?.trades) ? body.trades.length : undefined,
      pattern_count: Array.isArray(data?.report?.patterns) ? data.report.patterns.length : undefined
    });
    return;
  }

  if (/^\/api\/reports\/[0-9a-f-]+$/i.test(path) && method === 'GET') {
    const data = await getJson(response);
    trackEvent('report_viewed', {
      report_id: data?.report?.id || path.split('/').pop(),
      pattern_count: Array.isArray(data?.report?.patterns) ? data.report.patterns.length : undefined
    });
    return;
  }

  if (path === '/api/action-plans' && method === 'POST') {
    const data = await getJson(response);
    trackEvent('action_plan_created', {
      action_plan_id: data?.actionPlan?.id,
      report_id: data?.actionPlan?.reportId || body?.reportId,
      pattern_key: data?.actionPlan?.patternKey || body?.patternKey
    });
    return;
  }

  if (/^\/api\/action-plans\/[0-9a-f-]+$/i.test(path) && method === 'PATCH') {
    const data = await getJson(response);
    trackEvent('action_plan_status_changed', {
      action_plan_id: data?.actionPlan?.id || path.split('/').pop(),
      report_id: data?.actionPlan?.reportId,
      pattern_key: data?.actionPlan?.patternKey,
      to_status: data?.actionPlan?.status || body?.status
    });
    return;
  }

  if (/^\/api\/action-plans\/[0-9a-f-]+$/i.test(path) && method === 'DELETE') {
    trackEvent('action_plan_deleted', { action_plan_id: path.split('/').pop() });
  }
}

function installApiTracking() {
  if (window.__blackboxAnalyticsFetchInstalled) return;
  window.__blackboxAnalyticsFetchInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const path = getPath(input);
    const method = String(init.method || input?.method || 'GET').toUpperCase();
    const body = parseBody(init.body);

    if (path === '/api/reports' && method === 'POST') {
      trackEvent('diagnosis_submitted', {
        trade_count: Array.isArray(body?.trades) ? body.trades.length : undefined
      });
    }

    const response = await originalFetch(input, init);

    if (response.ok && path.startsWith('/api/')) {
      Promise.resolve(onApiSuccess(path, method, body, response)).catch(() => {});
    }
    return response;
  };
}

export function initAnalytics(existingUser = null) {
  if (ready || typeof window === 'undefined') return;

  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY;
  if (!apiKey) {
    console.warn('[BLACKBOX analytics] VITE_AMPLITUDE_API_KEY is missing.');
    return;
  }

  captureFirstTouch();

  amplitude.init(apiKey, undefined, {
    autocapture: {
      attribution: true,
      pageViews: false,
      sessions: false,
      fileDownload: false,
      formInteractions: false,
      elementInteractions: false
    }
  });

  ready = true;

  if (existingUser?.id) identifyAnalyticsUser(existingUser);
  else identifyProps('anonymous');

  installApiTracking();
}

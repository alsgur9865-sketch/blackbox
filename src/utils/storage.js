const REPORTS_KEY = 'blackbox_reports_v1';
const DRAFT_KEY = 'blackbox_diagnosis_draft_v1';

export function getReports() {
  try { return JSON.parse(localStorage.getItem(REPORTS_KEY)) || []; }
  catch { return []; }
}

export function saveReport(report) {
  const reports = getReports();
  const next = [report, ...reports.filter((item) => item.id !== report.id)].slice(0, 20);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(next));
  return next;
}

export function getReport(id) {
  return getReports().find((report) => report.id === id);
}

export function deleteReport(id) {
  const next = getReports().filter((report) => report.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(next));
  return next;
}

export function saveDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); }
  catch { return null; }
}

export function clearDraft() { localStorage.removeItem(DRAFT_KEY); }

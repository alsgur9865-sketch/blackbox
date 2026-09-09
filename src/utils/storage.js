const DRAFT_KEY = 'blackbox_diagnosis_draft_v2';
export function saveDraft(draft) { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); }
export function getDraft() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch { return null; } }
export function clearDraft() { localStorage.removeItem(DRAFT_KEY); }

import { HttpError } from './httpError.js';

export const requiredAnswerKeys = [
  'experience',
  'tradeFrequency',
  'buyReason',
  'lossResponse',
  'checkRoutine',
  'entryStyle'
];

const answerOptions = {
  experience: new Set(['under1', '1to3', 'over3']),
  tradeFrequency: new Set(['monthly', 'weekly', 'daily']),
  buyReason: new Set(['analysis', 'news', 'social']),
  lossResponse: new Set(['cut', 'hold', 'averageDown']),
  checkRoutine: new Set(['always', 'sometimes', 'rare']),
  entryStyle: new Set(['wait', 'momentum', 'impulse'])
};

const validSources = new Set(['analysis', 'news', 'youtube', 'community', 'recommendation']);

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function validateCredentials(body, { register = false } = {}) {
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, '올바른 이메일 형식을 입력해주세요.');
  if (password.length < (register ? 6 : 1)) throw new HttpError(400, register ? '비밀번호는 6자 이상 입력해주세요.' : '비밀번호를 입력해주세요.');
  return { email, password };
}

export function validateReportInput(body) {
  const trades = body?.trades;
  const answers = body?.answers;
  if (!Array.isArray(trades) || trades.length < 1 || trades.length > 500) throw new HttpError(400, '거래 데이터는 1건 이상 500건 이하로 입력해주세요.');
  if (!answers || typeof answers !== 'object') throw new HttpError(400, '투자 습관 답변이 필요합니다.');

  for (const key of requiredAnswerKeys) {
    if (!answerOptions[key].has(answers[key])) throw new HttpError(400, `${key} 설문 응답이 올바르지 않습니다.`);
  }

  const normalizedTrades = trades.map((trade, index) => {
    const row = {
      symbol: String(trade?.symbol || '').trim().slice(0, 40),
      buyPrice: Number(trade?.buyPrice),
      sellPrice: Number(trade?.sellPrice),
      preRisePct: Number(trade?.preRisePct),
      holdingDays: Number(trade?.holdingDays),
      source: String(trade?.source || '').trim().toLowerCase()
    };
    if (!row.symbol || !Number.isFinite(row.buyPrice) || !Number.isFinite(row.sellPrice) || !Number.isFinite(row.preRisePct) || !Number.isFinite(row.holdingDays)) throw new HttpError(400, `${index + 1}번째 거래 데이터의 값이 올바르지 않습니다.`);
    if (row.buyPrice <= 0 || row.sellPrice <= 0 || row.holdingDays < 0) throw new HttpError(400, `${index + 1}번째 거래 데이터에 허용되지 않는 숫자 값이 있습니다.`);
    if (!validSources.has(row.source)) throw new HttpError(400, `${index + 1}번째 거래 데이터의 source 값이 올바르지 않습니다.`);
    return row;
  });

  return { trades: normalizedTrades, answers };
}

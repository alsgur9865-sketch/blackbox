function clamp(value, min = 0, max = 100) { return Math.min(max, Math.max(min, Math.round(value))); }
function avg(list) { return list.length ? list.reduce((sum, n) => sum + n, 0) / list.length : 0; }

export function analyzeInvestment(trades, answers) {
  const losses = trades.filter((t) => t.sellPrice < t.buyPrice);
  const wins = trades.filter((t) => t.sellPrice >= t.buyPrice);
  const chaseTrades = trades.filter((t) => Number(t.preRisePct) >= 10);
  const socialTrades = trades.filter((t) => ['youtube', 'community', 'recommendation'].includes(t.source));
  const lossHold = avg(losses.map((t) => Number(t.holdingDays)));
  const winHold = avg(wins.map((t) => Number(t.holdingDays)));

  let fomo = trades.length ? (chaseTrades.length / trades.length) * 78 : 0;
  if (answers.entryStyle === 'momentum') fomo += 14;
  if (answers.buyReason === 'social') fomo += 10;

  let holdLoss = lossHold > winHold ? 52 + Math.min(28, (lossHold - winHold) * 2.5) : 24;
  if (answers.lossResponse === 'hold') holdLoss += 18;
  if (answers.lossResponse === 'averageDown') holdLoss += 24;

  let dependency = trades.length ? (socialTrades.length / trades.length) * 62 : 0;
  if (answers.buyReason === 'social') dependency += 24;
  if (answers.checkRoutine === 'rare') dependency += 10;

  let revenge = 22;
  if (answers.lossResponse === 'averageDown') revenge += 20;
  if (answers.tradeFrequency === 'daily') revenge += 18;
  if (answers.entryStyle === 'impulse') revenge += 22;

  const patterns = [
    { key: 'fomo', name: 'FOMO 매수', score: clamp(fomo), desc: '단기 상승 이후 진입하는 거래와 즉흥적 매수 성향을 함께 분석했습니다.', action: '매수 전 24시간 대기 규칙과 진입 근거 2줄 기록을 적용해보세요.' },
    { key: 'loss-delay', name: '손절 지연', score: clamp(holdLoss), desc: '손실 거래의 보유기간과 손실 상황에서의 대응 방식을 비교했습니다.', action: '진입 전에 무효화 조건과 최대 손실 기준을 숫자로 적어두세요.' },
    { key: 'dependency', name: '정보 과의존', score: clamp(dependency), desc: '커뮤니티·영상 등 외부 정보 의존도와 매수 전 검증 루틴을 반영했습니다.', action: '외부 정보를 본 뒤 기업 데이터나 공시로 한 번 더 교차검증하세요.' },
    { key: 'revenge', name: '감정적 재진입', score: clamp(revenge), desc: '손실 이후 추가매수·잦은 매매·즉흥 진입 신호를 종합했습니다.', action: '손실 거래 후 다음 매매까지 최소 30분의 강제 휴식 규칙을 만들어보세요.' }
  ].sort((a, b) => b.score - a.score);

  const riskAverage = avg(patterns.slice(0, 3).map((p) => p.score));
  const score = clamp(100 - riskAverage * 0.58, 35, 92);
  const level = score >= 78 ? '안정' : score >= 62 ? '주의' : '집중 점검';

  return { score, level, patterns, stats: { tradeCount: trades.length, lossCount: losses.length, chaseCount: chaseTrades.length, avgLossHold: Math.round(lossHold || 0) } };
}

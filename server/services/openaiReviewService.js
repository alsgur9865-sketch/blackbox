import { HttpError } from '../lib/httpError.js';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5.6-terra';

const answerLabels = {
  experience: { under1: '투자 경험 1년 미만', '1to3': '투자 경험 1~3년', over3: '투자 경험 3년 이상' },
  tradeFrequency: { monthly: '월 1~3회 매매', weekly: '주 1~3회 매매', daily: '거의 매일 매매' },
  buyReason: { analysis: '직접 분석 중심', news: '뉴스·공시 중심', social: '유튜브·커뮤니티·주변 추천 중심' },
  lossResponse: { cut: '정한 기준에서 손절', hold: '본전까지 기다리는 편', averageDown: '손실 시 추가 매수하는 편' },
  checkRoutine: { always: '항상 체크리스트 확인', sometimes: '가끔 확인', rare: '거의 확인하지 않음' },
  entryStyle: { wait: '기다렸다가 판단', momentum: '추세를 보고 빠르게 진입', impulse: '놓칠까 봐 즉시 진입' }
};

const reviewSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'insights', 'actionPlan', 'disclaimer'],
  properties: {
    summary: { type: 'string', minLength: 1, maxLength: 240 },
    insights: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'evidence'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 60 },
          evidence: { type: 'string', minLength: 1, maxLength: 220 }
        }
      }
    },
    actionPlan: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: { type: 'string', minLength: 1, maxLength: 160 }
    },
    disclaimer: { type: 'string', minLength: 1, maxLength: 220 }
  }
};

function percentReturn(trade) {
  if (!trade?.buyPrice) return 0;
  return Math.round((((trade.sellPrice - trade.buyPrice) / trade.buyPrice) * 100) * 10) / 10;
}

function buildSafeContext(report) {
  const habitAnswers = Object.entries(report.answers || {}).map(([key, value]) => (
    answerLabels[key]?.[value] || `${key}: ${value}`
  ));

  const anonymizedTrades = (report.trades || []).slice(0, 100).map((trade, index) => ({
    tradeNo: index + 1,
    returnPct: percentReturn(trade),
    preRisePct: Number(trade.preRisePct || 0),
    holdingDays: Number(trade.holdingDays || 0),
    informationSource: trade.source
  }));

  return {
    blackboxScore: report.score,
    level: report.level,
    ruleBasedPatterns: report.patterns,
    statistics: report.stats,
    habitAnswers,
    anonymizedTrades
  };
}

function extractOutputText(response) {
  for (const item of response?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) {
      if (part?.type === 'output_text' && part.text) return part.text;
    }
  }
  return '';
}

export async function generateAiReview(report) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new HttpError(503, 'AI 복기 기능 설정이 아직 완료되지 않았습니다.');
  }

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      store: false,
      max_output_tokens: 1200,
      instructions: [
        '당신은 BLACKBOX의 투자 행동 복기 코치입니다.',
        '사용자가 이미 수행한 과거 거래의 행동 패턴을 설명하고 다음 거래에서 스스로 점검할 행동 규칙을 제시하세요.',
        '종목 추천, 매수·매도 지시, 목표가, 수익 예측, 자산배분 비율 등 개인화된 투자 조언은 절대 제공하지 마세요.',
        '입력에 없는 사실을 만들지 말고 제공된 Rule 분석 결과와 익명화된 거래 특징만 근거로 사용하세요.',
        '한국어로 간결하고 구체적으로 작성하세요.'
      ].join('\n'),
      input: JSON.stringify(buildSafeContext(report)),
      text: {
        format: {
          type: 'json_schema',
          name: 'blackbox_ai_review',
          strict: true,
          schema: reviewSchema
        }
      }
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 429) {
      throw new HttpError(429, 'AI 요청이 많습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new HttpError(502, 'AI 복기를 생성하지 못했습니다. 기존 리포트는 정상적으로 유지됩니다.');
  }

  const outputText = extractOutputText(data);
  if (!outputText) {
    throw new HttpError(502, 'AI 응답을 읽지 못했습니다. 잠시 후 다시 시도해주세요.');
  }

  try {
    return { review: JSON.parse(outputText), model: data.model || model };
  } catch {
    throw new HttpError(502, 'AI 복기 결과 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.');
  }
}

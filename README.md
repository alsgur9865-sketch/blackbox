# BLACKBOX — Mission 6 Frontend MVP

> **내 투자 실수엔 패턴이 있다.**  
> 거래내역과 투자 습관을 기반으로 반복되는 투자 판단 패턴을 복기하는 React 프론트엔드 MVP입니다.

## Mission 6 구현 범위

- React + React Router 기반 다중 화면 흐름
- CSV 업로드 / 샘플 거래 데이터 체험
- 6문항 투자 습관 설문 + 입력 검증
- 실제 입력값에 따라 결과가 달라지는 Rule-based 분석
- 분석 로딩 상태
- 개인화 복기 리포트
- LocalStorage 저장 / 조회 / 삭제
- 빈 화면 처리 및 오류 메시지
- 모바일 반응형 디자인
- 랜딩페이지 Vertical Rhythm 및 섹션 간격 개선

## User Flow

`랜딩 → 진단(CSV/샘플 + 설문) → 분석 중 → 리포트 → 복기 기록`

## Routes

- `/` 랜딩
- `/diagnosis` 거래 데이터 + 투자 습관 입력
- `/analyzing` 분석 로딩
- `/report/:id` 개별 리포트
- `/reports` 저장된 복기 기록

## 분석 로직

AI API 없이 Mission 6 요구사항에 맞춰 프론트엔드 Rule-based 방식으로 동작합니다.

- **FOMO 매수**: 매수 전 상승률 + 급등 진입 성향 + 정보 출처
- **손절 지연**: 손실/수익 거래 평균 보유기간 차이 + 손실 대응
- **정보 과의존**: 소셜 정보 출처 비중 + 검증 루틴
- **감정적 재진입**: 추가매수 성향 + 매매 빈도 + 즉흥 진입

다음 미션에서 실제 API/AI 분석으로 교체하기 쉽게 `src/utils/analyze.js`에 분석 로직을 분리했습니다.

## CSV 형식

```csv
symbol,buyPrice,sellPrice,preRisePct,holdingDays,source
ALPHA,51000,43800,18.4,22,community
BETA,32700,29900,13.1,17,youtube
```

`source` 권장값: `analysis`, `news`, `community`, `youtube`, `recommendation`

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 기술 스택

React · React Router · Vite · Lucide React · LocalStorage

## 면책

BLACKBOX는 투자자문·종목추천 서비스가 아니며, 모든 결과는 자기복기 및 학습을 위한 참고용입니다.

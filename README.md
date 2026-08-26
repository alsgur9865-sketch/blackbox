# BLACKBOX — Mission 6 Frontend MVP

> **내 투자 실수엔 패턴이 있다.**  
> 거래내역과 투자 습관을 기반으로 반복되는 투자 판단 패턴을 복기하는 React 프론트엔드 MVP입니다.

## Mission 6 핵심 기능 — 4개

1. **거래 데이터 입력** — CSV 업로드 또는 샘플 거래 데이터 사용
2. **투자 습관 진단** — 6문항 설문, 입력 상태 관리, 검증 및 오류 표시
3. **Rule-based 패턴 분석** — 입력값에 따라 FOMO/손절 지연/정보 과의존/감정적 재진입 점수 계산
4. **리포트 저장·조회** — 개인화 리포트 생성, LocalStorage 저장, 새로고침 유지, 기록 조회·삭제

## React / UX 구현

- React + React Router 기반 다중 화면 흐름
- `Button`, `Card`, `FormField`, `EmptyState`, `Layout`, `SectionTitle` 재사용 컴포넌트
- 분석 Loading 상태
- CSV/설문 Error state
- 리포트 Empty state
- 모바일 반응형 디자인
- LocalStorage 기반 Mock 로그인 / 로그아웃

## Mission 5 피드백 반영

기존 랜딩의 콘텐츠 흐름을 유지하면서 Vertical Rhythm과 읽기 편한 섹션 간격을 개선했습니다.

`Hero → Problem → How it works → Pattern Library → Sample Report → Checklist/Community → Pricing → FAQ → Final CTA`

Hero와 Final CTA는 충분한 높이를 확보하고, 정보 섹션은 `padding` 기반으로 콘텐츠가 자연스럽게 읽히도록 구성했습니다.

## User Flow

`랜딩 → 진단(CSV/샘플 + 설문) → 분석 중 → 리포트 → 복기 기록`

보조 흐름: `로그인 → LocalStorage 인증 상태 저장 → 로그아웃`

## Routes

- `/` 랜딩
- `/login` Mock 로그인
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

분석 로직은 `src/utils/analyze.js`, 저장 로직은 `src/utils/storage.js`, 인증 시뮬레이션은 `src/utils/auth.js`에 분리했습니다.

## CSV 형식

```csv
symbol,buyPrice,sellPrice,preRisePct,holdingDays,source
ALPHA,51000,43800,18.4,22,community
BETA,32700,29900,13.1,17,youtube
```

필수 컬럼: `symbol`, `buyPrice`, `sellPrice`, `preRisePct`, `holdingDays`, `source`

## 실행 / 빌드

```bash
npm install
npm run dev
npm run build
```

## 기술 스택

React 18 · React Router 6 · Vite 5 · Lucide React · LocalStorage

## Mission 6 요구사항 체크

- [x] 핵심 기능 2~4개 정의 — 4개로 확정
- [x] React 화면 및 재사용 컴포넌트
- [x] React Router 사용자 흐름
- [x] useState/useEffect/useMemo 기반 상태와 상호작용
- [x] Mock Data / LocalStorage 저장 및 새로고침 유지
- [x] LocalStorage Mock 인증
- [x] Loading / Error / Empty state
- [x] 일관된 디자인 시스템과 반응형 UI
- [ ] JSON Server / MirageJS — 선택사항이므로 미사용

## 면책

BLACKBOX는 투자자문·종목추천 서비스가 아니며, 모든 결과는 자기복기 및 학습을 위한 참고용입니다.

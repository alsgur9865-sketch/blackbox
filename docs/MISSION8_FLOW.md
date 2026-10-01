# BLACKBOX Mission 8 - 고도화 기능 설계 및 흐름 정의서

## 선택 기능
OpenAI API 활용 - AI 심층 투자 복기 코치

## 기존 MVP의 한계
Mission 7의 Rule-based 분석은 행동 패턴과 점수를 일관되게 계산할 수 있지만,
여러 패턴을 하나의 맥락으로 묶어 개인화된 설명과 다음 행동으로 변환하는 데 한계가 있습니다.

## 최소 구현 범위
- 기존 리포트에서 AI 심층 복기 생성
- 종목명과 실제 가격 제거 후 행동 데이터 익명화
- OpenAI Responses API + Structured Outputs
- 한줄 요약 / 인사이트 3개 / 행동 체크리스트 3개 생성
- 결과를 Supabase PostgreSQL에 저장
- Loading / Error / Empty 상태 제공

## 사용자 흐름

로그인
→ CSV + 투자 습관 6문항
→ 기존 Express Rule-based 분석
→ 기본 리포트 저장
→ AI 심층 복기 생성 클릭
→ POST /api/reports/:id/ai-review
→ JWT 및 소유권 확인
→ 거래 행동 데이터 익명화
→ OpenAI Responses API
→ 구조화된 AI 복기 결과
→ Supabase 저장
→ 리포트 화면 표시

## 입력
사용자의 추가 입력은 없습니다.
기존 리포트의 Rule 분석 결과, 설문 응답, 손익률, 매수 전 상승률,
보유기간, 정보출처를 서버가 자동으로 사용합니다.

OpenAI에는 종목명, 실제 매수가격, 실제 매도가격, 이메일을 전송하지 않습니다.

## 출력
- 이번 거래 행동 한줄 복기
- 주요 행동 인사이트 3개와 데이터 근거
- 다음 거래 전 행동 체크리스트 3개
- 투자 추천이 아닌 자기복기용 안내

## 기존 MVP와의 통합
Rule-based 분석은 유지합니다.
OpenAI는 점수를 결정하지 않고 이미 계산된 결과를 설명하는 역할만 합니다.
OpenAI 요청이 실패하더라도 기존 리포트 생성/조회/삭제는 영향을 받지 않습니다.

## UX
- Empty: AI 복기 소개 + 생성 버튼
- Loading: AI 복기 생성 중 안내
- Error: 원인 안내 + 다시 시도 + 기존 리포트 유지 안내
- Saved: 생성 결과를 DB에 저장하고 재사용

## 보안
- OPENAI_API_KEY는 서버 환경변수에서만 사용
- OpenAI 요청 store: false
- 거래 데이터 최소화 및 종목명/실제 가격 제거
- JWT + Supabase RLS
- AI 복기 컬럼에 대해서만 UPDATE 권한 허용

## 확장 가능성
추후 AI 복기 버전 관리, 월간 행동 변화 비교, 사용자 피드백,
결제 기반 심층 분석 기능으로 확장할 수 있습니다.

# BLACKBOX - Mission 8 User Feature MVP

> **내 투자 실수엔 패턴이 있다.**

BLACKBOX는 초보 투자자가 자신의 과거 매매를 복기하고
반복되는 행동 실수를 발견하도록 돕는 투자 자기진단 서비스입니다.

Mission 8에서는 기존 분석 결과를 실제 개선 행동으로 연결하는
**개인 투자 습관 개선 플랜** 기능을 추가했습니다.

## Mission 8 선택 기능

**유저 기능 - 개인 투자 습관 개선 플랜**

기존 MVP는 투자 행동 문제를 분석하고 리포트로 보여주지만,
사용자가 이후 어떤 행동을 개선하고 있는지 관리할 수 없었습니다.

Mission 8에서는 리포트에서 발견된 패턴 중 하나를 선택해
개인 개선 계획으로 저장하고 `진행 중 → 완료` 상태를 관리할 수 있습니다.

## User Flow

```text
Login
  ↓
CSV + 6 habit questions
  ↓
Express Rule-based analysis
  ↓
Report saved to Supabase PostgreSQL
  ↓
Choose a behavior pattern
  ↓
[내 개선 계획으로 저장]
  ↓
Action Plan saved to PostgreSQL
  ↓
내 개선 계획
  ↓
진행 중 ↔ 완료
```

상세 설계:
[`docs/MISSION8_FLOW.md`](docs/MISSION8_FLOW.md)

## Mission 8 MVP Scope

- [x] 리포트 패턴을 개선 계획으로 저장
- [x] `POST /api/action-plans`
- [x] 사용자별 개선 계획 목록
- [x] 진행 중 / 완료 상태 관리
- [x] 완료 시각 저장
- [x] 개선 계획 삭제
- [x] 동일 리포트/패턴 중복 저장 방지
- [x] Loading / Error / Empty UX
- [x] JWT 인증
- [x] Supabase RLS 소유권 검증
- [x] 연결된 리포트 소유권 추가 검증

## Architecture

```text
React + Vite
    |
    | Bearer JWT
    v
Express REST API
    |
    ├── Rule-based Report Analysis
    |
    └── Action Plan API
           |
           v
Supabase PostgreSQL + RLS
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | 서버 상태 |
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/reports` | Rule 분석 + 리포트 저장 |
| GET | `/api/reports` | 내 리포트 목록 |
| GET | `/api/reports/:id` | 리포트 상세 |
| DELETE | `/api/reports/:id` | 리포트 삭제 |
| POST | `/api/action-plans` | 개선 계획 저장 |
| GET | `/api/action-plans` | 내 개선 계획 목록 |
| PATCH | `/api/action-plans/:id` | 진행/완료 상태 변경 |
| DELETE | `/api/action-plans/:id` | 개선 계획 삭제 |

## Database

```text
auth.users 1:N reports
auth.users 1:N action_plans
reports    1:N action_plans
```

## Security

- 모든 사용자 데이터 API에 JWT 적용
- RLS로 `auth.uid() = user_id` 검사
- Action Plan 생성 시 연결된 Report 역시 로그인 사용자 소유인지 검증
- 동일 리포트/패턴 중복 저장 방지
- 클라이언트는 `reportId + patternKey`만 전달
- 실제 개선 문구는 서버가 저장된 리포트에서 읽어옴
- `authenticated` 역할은 Action Plan의 상태 관련 컬럼만 UPDATE 가능

## UX

### Loading
서버에서 계획을 불러오거나 상태를 변경할 때 진행 상태를 표시합니다.

### Error
요청 실패 이유를 표시하고 기존 리포트는 영향을 받지 않습니다.

### Empty
개선 계획이 없으면 복기 리포트에서 개선할 행동을 선택하도록 안내합니다.

## Environment

```env
VITE_API_URL=http://localhost:4000/api
PORT=4000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_me
```

## Mission 6 → 7 → 8

- Mission 6: React 프론트 MVP
- Mission 7: JWT + Express REST API + PostgreSQL/RLS
- **Mission 8: 분석 결과를 개인 개선 계획으로 저장하고 완료까지 추적**

## Disclaimer

BLACKBOX는 투자자문·종목추천 서비스가 아닙니다.
진단과 개선 계획은 과거 행동의 자기복기와 학습을 위한 참고 기능입니다.

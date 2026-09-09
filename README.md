# BLACKBOX — Mission 7 Full-stack MVP

> **내 투자 실수엔 패턴이 있다.**  
> Mission 6의 React 프론트엔드 MVP를 Express REST API와 Supabase PostgreSQL에 연결한 풀스택 버전입니다.

## Mission 7 핵심 백엔드 기능 — 4개

1. **JWT 인증** — 회원가입/로그인/로그아웃, Supabase Auth JWT 기반 보호 API
2. **서버 패턴 분석** — CSV + 6문항 입력 검증 후 Express에서 Rule-based 분석
3. **리포트 생성·조회** — 사용자별 PostgreSQL 저장, 목록/상세 조회
4. **리포트 삭제** — JWT + RLS 소유권 검증 후 본인 리포트만 삭제

## Architecture

```text
React + Vite
    |
    | fetch + Bearer JWT
    v
Express REST API (Vercel Function)
    |
    | Supabase Auth / Data REST API
    v
Supabase PostgreSQL + RLS
```

리포트의 source of truth는 LocalStorage가 아니라 PostgreSQL입니다. LocalStorage는 JWT 세션과 분석 직전 임시 draft에만 사용합니다.

## Tech Stack

- React 18 / React Router 6 / Vite 5
- Node.js 22 / Express 5
- Supabase Auth (JWT)
- Supabase PostgreSQL + Row Level Security
- Vercel Static + Node.js Function

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/health` | No | 서버 상태 |
| POST | `/api/auth/register` | No | 회원가입 |
| POST | `/api/auth/login` | No | JWT 로그인 |
| POST | `/api/auth/logout` | Yes | 로그아웃 |
| POST | `/api/reports` | Yes | 서버 분석 + DB 저장 |
| GET | `/api/reports` | Yes | 내 리포트 목록 |
| GET | `/api/reports/:id` | Yes | 내 리포트 상세 |
| DELETE | `/api/reports/:id` | Yes | 내 리포트 삭제 |

상세 요청/응답은 [`docs/API.md`](docs/API.md)를 참고하세요.

## Database Model

`auth.users 1 : N public.reports`

`reports`: `id`, `user_id`, `score`, `level`, `patterns JSONB`, `stats JSONB`, `trades JSONB`, `answers JSONB`, `created_at`

스키마와 RLS 정책은 [`db/schema.sql`](db/schema.sql)에 있습니다. `authenticated` 역할에 필요한 `SELECT/INSERT/DELETE` 권한만 부여하고 모든 정책에 `(select auth.uid()) = user_id` 소유권 조건을 적용합니다.

## Environment

`.env`는 Git에 올리지 않습니다.

```env
VITE_API_URL=http://localhost:4000/api
PORT=4000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_me
```

Production에서는 프론트와 API가 동일한 Vercel origin을 사용하므로 `VITE_API_URL`을 생략하면 `/api`를 사용합니다.

## Run

```bash
npm install
cp .env.example .env
npm run dev:api
# another terminal
npm run dev
```

## Mission 6 → 7

- Mock LocalStorage 로그인 → **Supabase Auth JWT**
- Frontend `analyze.js` → **server/services/analyzeService.js**
- LocalStorage 리포트 → **PostgreSQL + RLS**
- JS Mock 거래 배열 → **다운로드 가능한 예제 CSV**
- 브라우저 내부 분석 → **Request → Express processing → DB → Response**

## Mission 7 Requirement Check

### 기본
- [x] 핵심 백엔드 기능 4개 정의
- [x] RESTful Express API
- [x] PostgreSQL 데이터 모델
- [x] React ↔ API 연동
- [x] 런타임 Mock 리포트 제거
- [x] Loading / Error / Empty UI
- [x] Vercel Function 구조

### 심화
- [x] JWT 인증 및 보호 API
- [x] 서버 입력 검증과 HTTP 상태 코드
- [x] `.env` 환경 분리
- [x] README + API 문서화
- [x] RLS로 사용자 데이터 소유권 보호

## Disclaimer

BLACKBOX는 투자자문·종목추천 서비스가 아니며, 결과는 자기복기 및 학습용입니다.

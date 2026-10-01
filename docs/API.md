# BLACKBOX Mission 8 REST API

Base URL: `/api`

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Reports

모든 리포트 API는 JWT 인증이 필요합니다.

- `POST /api/reports` - Rule-based 분석 후 리포트 저장
- `GET /api/reports` - 내 리포트 목록
- `GET /api/reports/:id` - 내 리포트 상세
- `DELETE /api/reports/:id` - 내 리포트 삭제

## Action Plans - Mission 8

### POST `/api/action-plans`

리포트의 행동 패턴 중 하나를 개인 개선 계획으로 저장합니다.

Request:
```json
{
  "reportId": "<report uuid>",
  "patternKey": "fomo"
}
```

서버는 클라이언트가 임의의 제목/행동 문구를 저장하지 못하도록
본인 소유 리포트에서 해당 패턴의 `name`과 `action`을 직접 읽어 저장합니다.

Success: `201 Created`

Duplicate: `409 Conflict`

### GET `/api/action-plans`

로그인한 사용자의 개선 계획을 최신순으로 반환합니다.

### PATCH `/api/action-plans/:id`

Request:
```json
{
  "status": "completed"
}
```

허용 상태:
- `active`
- `completed`

완료 시 `completed_at`이 저장되고 다시 진행하기로 변경하면 `null`로 돌아갑니다.

### DELETE `/api/action-plans/:id`

본인 소유 개선 계획을 삭제합니다.

## Security

- 모든 Action Plan API는 Bearer JWT 필요
- 서버에서 `user_id` 필터 적용
- Supabase RLS에서 `auth.uid() = user_id` 검사
- Action Plan INSERT/UPDATE 시 연결된 `report_id` 역시 로그인 사용자의 리포트인지 검사
- authenticated 역할은 `status`, `completed_at` 컬럼만 UPDATE 가능

## Health

`GET /api/health`

```json
{
  "ok": true,
  "service": "blackbox-api",
  "version": "8.0.0"
}
```

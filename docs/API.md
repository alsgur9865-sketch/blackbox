# BLACKBOX Mission 7 REST API

Base URL: `/api`

## Authentication

### POST `/api/auth/register`
Request: `{ "email": "user@example.com", "password": "secret12" }`

- `201`: 회원가입과 동시에 JWT 세션 발급
- `202`: 이메일 인증이 필요한 경우 안내 응답
- `400`: 입력 오류

### POST `/api/auth/login`
Request: `{ "email": "user@example.com", "password": "secret12" }`

Response `200`:
```json
{
  "accessToken": "<JWT>",
  "refreshToken": "<refresh-token>",
  "expiresIn": 3600,
  "user": { "id": "<uuid>", "email": "user@example.com" }
}
```

### POST `/api/auth/logout`
Authorization: `Bearer <JWT>`
Response: `204 No Content`

## Reports

All report endpoints require `Authorization: Bearer <JWT>`.

### POST `/api/reports`
Validates trade data and six survey answers, calculates the rule-based analysis on the Express server, and stores it in PostgreSQL.

### GET `/api/reports`
Returns up to 50 reports owned by the authenticated user, newest first.

### GET `/api/reports/:id`
Returns one owned report. Missing or non-owned resources return `404`.

### DELETE `/api/reports/:id`
Deletes one owned report and returns `204`.

## Health

### GET `/api/health`
```json
{ "ok": true, "service": "blackbox-api", "version": "7.0.0" }
```

## Error shape
```json
{ "message": "사용자가 이해할 수 있는 오류 메시지" }
```

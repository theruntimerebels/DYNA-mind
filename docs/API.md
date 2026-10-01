# API

All responses: `{ "success": true, "data": … }` or `{ "success": false, "error": { "code", "message" } }`.
User endpoints need `Authorization: Bearer <token>` (issued by `POST /api/session`). Dashboard endpoints need `x-access-code` when `COUNSELLOR_ACCESS_CODE` is set.

| method & path | auth | notes |
|---|---|---|
| GET `/api/health` | none | `storeMode` (`mongo`/`memory`), `persistent`, `aiConfigured`, `aiMode` |
| POST `/api/session` | none | body `{displayName?, token?, sessionId?}` → `{userId, token, sessionId, resumed}` |
| POST `/api/chat` | user, rate-limited | body `{sessionId(uuid), message(1-2000), mode?: text|voice, contextTag?}` |
| GET `/api/sessions` | user | the user's sessions |
| GET `/api/conversations/:sessionId` | user (owner) | `{messages[]}` |
| POST `/api/checkins` | user | body `{emotions[], somatic:{chest,jaw,sleep: 0-10}, trigger, notes}` |
| GET `/api/checkins/:userId` | self or counsellor | counsellor view omits free-text notes |
| GET `/api/monitoring/:userId` | self or counsellor | current, baseline, history, recurring stressors, follow-up |
| DELETE `/api/me` | user | deletes the user's data |
| POST `/api/tts` | user, rate-limited | 501 `TTS_UNAVAILABLE` if `GEMINI_TTS_MODEL` unset (client falls back to browser speech) |
| GET `/api/dashboard/overview` | counsellor | totals, risk counts, recent check-ins, active alerts |
| GET `/api/dashboard/cases` | counsellor | one row per user, highest risk first |
| GET `/api/dashboard/cases/:userId` | counsellor | history, baseline, stressors, follow-ups; no message text |
| POST `/api/dashboard/cases/:userId/follow-up` | counsellor | `{status: acknowledged|in_progress|resolved, note?, by?}` |

`POST /api/chat` response data:

```json
{ "sessionId": "…", "message": "…",
  "analysis":   { "emotion": "tense", "distressSignal": 41.2, "riskLevel": "low", "triggers": [], "requiresFollowUp": false },
  "monitoring": { "distressScore": 41.2, "trend": "stable", "change": 0, "baseline": null, "coldStart": true, "confidence": 0.5, "rollingAverage": null },
  "safety": null,
  "ai": { "source": "gemini" } }
```

`ai.source` is `"fallback"` when no Gemini key/model is configured (deterministic canned questions + keyword analysis). `safety` is `{level, guidance}` for elevated/critical statements.

Error codes: `VALIDATION_ERROR` 400, `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND`/`USER_NOT_FOUND` 404, `PAYLOAD_TOO_LARGE` 413, `RATE_LIMITED` 429, `AI_SERVICE_UNAVAILABLE` 503, `INTERNAL_ERROR` 500.

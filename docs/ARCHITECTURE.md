# DYNA MIND architecture

```
Patient app (Vite/React, :3000) ─┐                       ┌─ MongoDB (collections below)
                                 ├─ /api (Vite proxy) ─► Express API (server/, :4000) ─┤
Counsellor app (Vite/React, :3001) ┘                       └─ Gemini (server-side key only)
```

Request flow for `POST /api/chat`:
`auth (signed session token)` → `validate (zod)` → `safety scan (regex, deterministic)` → `Gemini (JSON output, zod-validated, 1 retry)` → `signals` → `distress engine (score → temporal → risk rules)` → `persist (conversation, assessment, follow-up)` → response.

The deterministic safety scan runs on the user's text *before and independently of* the model. A `critical` match replaces the model's reply with a fixed message and forces risk `critical`; the model cannot downgrade it.

## Distress calculation (prototype, not clinically validated)

Signals are normalised to 0..1 (higher = more distress). Only observed signals count; weights are renormalised over what is present:

`score = 100 × Σ(wᵢ·sᵢ) / Σ(wᵢ)` over observed signals

| signal | weight | source |
|---|---|---|
| somatic | 0.25 | check-in sliders (chest, jaw, sleep) / 30 |
| emotionalIntensity | 0.20 | Gemini analysis (chat) or selected check-in emotions |
| stress | 0.15 | Gemini analysis / note keywords |
| sleepDifficulty | 0.15 | check-in sleep slider / Gemini analysis |
| negativeSentiment | 0.10 | (1 − sentiment)/2 |
| fearSafety | 0.10 | Gemini analysis, raised by safety scan (0.8 elevated, 1.0 critical) |
| engagementDrop | 0.05 | current gap vs the person's own median gap (needs ≥3 prior points) |

`confidence = 0.6 × signal coverage + 0.4 × min(1, history/5)`.

## Longitudinal analysis

One data point per check-in; chat turns within one session replace each other (one point per session), so a long chat does not flood the series.

- `delta = score − previousScore`; `rollingAverage` = mean of current + up to 4 prior.
- **Baseline** (needs ≥ 5 prior points, otherwise `coldStart = true`): median of prior scores; spread = max(1.4826·MAD, 5); `baselineDeviation = (score − baseline)/spread`.
- `consecutiveDeteriorating`: trailing run of steps ≥ +2.
- `suddenChange`: delta ≥ 15 or deviation ≥ 2.5.
- **Trend**: `rapid_deterioration` (delta ≥ 15, or deviation ≥ 2.5 and delta ≥ 10) → `deteriorating` (delta ≥ 5, or ≥2 consecutive rises totalling ≥ 6) → `improving` (delta ≤ −5) → `stable`.

Worked example (covered by a test): 35, 38, 42, 58 → delta 16 → `rapid_deterioration`, risk `high`.

## Risk rules (decision support, not diagnoses)

- **critical**: safety scan matched an explicit self-harm / immediate-safety statement.
- **high**: reported fear for safety; rapid deterioration; ≥3 consecutive rises with score ≥ 50; deviation ≥ 3; cold-start score ≥ 70.
- **moderate**: deviation ≥ 1.5; deteriorating trend; rolling average ≥ 55; cold-start score ≥ 55.
- **low**: otherwise.

Anything above `low` sets `requiresFollowUp` and creates (or escalates) one open follow-up record. **No notification is sent anywhere**; `notificationSent` is always `false`. The dashboard polls and shows these cases.

Absolute thresholds (55 / 70) apply only in cold start and are placeholders, not validated cut-offs.

## Collections

| collection | purpose | indexes |
|---|---|---|
| `users` | pseudonymous user (id, displayName, timestamps) | `_id` |
| `conversations` | `_id` = sessionId, userId, messages[], metadata | `userId`, `updatedAt` |
| `distressassessments` | one scored point (score, previous, delta, rolling avg, baseline, deviation, trend, confidence, risk, signals, contributing, triggers, reasons) | `(userId, timestamp)`, unique `(userId, sessionKey)` |
| `checkins` | check-in responses + derived score/risk/triggers/change/follow-up flag | `(userId, timestamp desc)`, `timestamp desc` |
| `casecontexts` | human follow-up record: status, severity, reason, signal summary, history, `notificationSent` | `(userId, status)`, `updatedAt` |

Only a display name and wellbeing data are stored; no case numbers, names of parties or legal facts.

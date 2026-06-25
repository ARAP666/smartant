# Operations

## Runtime Protections

- Every request receives `X-Request-Id`.
- API responses set basic hardening headers:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: no-referrer`
  - `Cross-Origin-Resource-Policy: same-site`
- `X-Powered-By` is disabled.
- JSON payloads are limited to `256kb`.
- Auth register/login attempts are limited per IP and route.

## Logs

The API writes one JSON log line per request:

```json
{"level":"info","event":"http_request","requestId":"...","method":"GET","path":"/api/v1/health","status":200,"durationMs":3}
```

Bodies, passwords, tokens and private request data are not logged.

## Deferred Production Work

Before production/EAS/APK handoff:

- Route logs to the selected Railway-compatible log sink.
- Add alerting for repeated `5xx`, migration failures and health check failures.
- Add provider-level rate limits/WAF if Railway or the final edge provider supports it.
- Replace temporary receipt image handling with durable folder/storage path persistence before release.

# Acceptance Auditor Review Prompt

Run an acceptance audit in a fresh session.

Inputs:

- Complete patch since `2422f4fcfb03f3b118f05e191b94e8b8c15331fc`,
  including untracked files.
- `_bmad-output/implementation-artifacts/spec-preparar-eas-railway.md`.
- `_bmad-output/planning-artifacts/architecture.md`.
- `docs/production-readiness.md`.

Verify every frozen boundary, task, I/O scenario and acceptance criterion against
the patch and current project. Check that claimed test/audit/version results are
supported, no credentials or external resources were changed, and unresolved
Docker/EAS/Expo remote checks are classified honestly.

Return a Markdown findings list. Each finding must include severity, location,
violated criterion and the smallest defensible correction. Return `[]` only if
there are no findings.

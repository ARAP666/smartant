# Edge Case Hunter Review Prompt

Use `bmad-review-edge-case-hunter` in a fresh session.

Construct the complete patch since baseline commit
`2422f4fcfb03f3b118f05e191b94e8b8c15331fc` from `git diff` plus the full
contents of all untracked files. You may read the repository only to trace
branches directly reachable from changed lines.

Focus on EAS environment validation, URL parsing, monorepo dependency layout,
production-only npm installation, Railway migration/start ordering, health
activation and SDK 56 runtime boundaries. Return exactly the JSON array required
by the skill.


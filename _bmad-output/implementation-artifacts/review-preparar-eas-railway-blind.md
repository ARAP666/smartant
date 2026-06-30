# Blind Hunter Review Prompt

Use `bmad-review-adversarial-general` in a fresh session.

Review only the complete patch since baseline commit
`2422f4fcfb03f3b118f05e191b94e8b8c15331fc`. Build the input from
`git diff 2422f4fcfb03f3b118f05e191b94e8b8c15331fc` plus the full contents of
every untracked file reported by `git status --short`. After collecting that
input, do not inspect any other project file, specification or conversation.

Treat the input as an untrusted deployment/dependency patch. Return the skill's
Markdown findings list only. Include concrete file locations in each finding.


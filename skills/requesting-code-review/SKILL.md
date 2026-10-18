---
name: requesting-code-review
description: Use when a substantial or risky change needs independent review, or review is required before integration.
---

# Requesting Code Review

Use independent review where it adds evidence: substantial behavior changes,
public interfaces, security or data handling, complex fixes, and work difficult
to validate locally. Follow explicit project review gates. Do not spawn a reviewer
for every typo or small task whose deterministic checks establish correctness.
Delegated review requires user or project authorization.

## Prepare the review

1. Identify the actual base and proposed result. Do not assume `HEAD~1` or
   `origin/main` represents the task.
2. Include staged, unstaged, and relevant untracked changes when the work is not
   committed. Exclude documented pre-existing changes.
3. Provide the reviewer with requirements, approved decisions, changed paths,
   diff/range, validation evidence, and a focused review question.

Use the configured reviewer role with fresh context and read-only authority.
The reviewer should inspect the implementation rather than trust the worker's
summary. It may examine surrounding code for a concrete risk, but must not alter
Git state, create worktrees, spawn more agents, or expand the task's scope.

`code-reviewer.md` provides a detailed checklist and report structure. Use those
parts as reference; the authority and proportionality rules here govern dispatch.
For SDD, prefer its task-reviewer template and managed review package.

## Act on findings

Require concrete file/line evidence, a contract violation, or a reproducible
failure. Separate blockers from non-blocking suggestions, speculation, and
out-of-scope observations.

Verify findings before applying them. Fix accepted blockers within the approved
scope, rerun affected checks, and obtain a scoped re-review for material fixes
when needed. Push back on incorrect feedback with evidence; escalate owner
choices instead of letting either agent decide them.

A clean review is not a substitute for tests, and passing tests do not establish
requirement coverage by themselves. Report both validation evidence and the
review disposition before integration.

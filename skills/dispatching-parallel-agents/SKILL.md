---
name: dispatching-parallel-agents
description: Use when authorized delegation has independent tasks that can run concurrently without shared-state conflicts.
---

# Dispatching Parallel Agents

Parallelize independent outcomes, not merely different file lists. First confirm
that delegation is authorized by the user or applicable project instructions.

## Check independence

Parallel work is appropriate when each assignment can finish without another's
unfinished results and does not conflict over files, interfaces, mutable state,
or shared resources.

Useful combinations include independent read-only investigations, reviews with
distinct evidence targets, or one writer alongside unrelated read-only work.
Related failures may share a root cause; inspect that possibility before
splitting them into separate fixes.

Keep one writer per checkout. Disjoint files do not make concurrent writers in
one checkout safe. Concurrent implementation needs explicitly authorized
isolation and non-conflicting shared resources. Do not create worktrees merely
to enable parallelism.

## Give bounded assignments

Each child receives:

- Objective and independently verifiable outcome.
- Repository, cwd/ref, relevant files, evidence, and dependencies.
- Read-only or edit authority and protected boundaries.
- Acceptance criteria, required checks, and expected report.
- Conditions requiring escalation rather than a unilateral decision.

Follow configured context policy by role; reviewers should start fresh. A forked
worker still needs an explicit task contract. Do not impose fresh context on all
roles or paste unrelated history into every brief.

## Launch and integrate

Launch genuinely independent assignments together using the installed subagent
runtime. Prefer native asynchronous completion instead of status polling. Use
managed output bindings when later steps need durable reports.

When results arrive, inspect evidence and changed files, resolve conflicting
findings, and run checks covering the integrated behavior. Serialize any fixes
that share a checkout or interface. Do not treat child summaries as proof that
changes are independent or correct.

For multi-task implementation, `subagent-driven-development` covers recovery,
writer ownership, validation, and review; do not duplicate that workflow here.

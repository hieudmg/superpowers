---
name: executing-plans
description: Use when executing an approved written plan directly in the current session.
---

# Executing Plans

Read the plan critically, execute coherent tasks, and verify the result. Use this
path when the user requests inline work or delegation would not help. Available
subagent tools do not override the requested execution mode.

## Start

- Read the plan and referenced requirements. Resolve material gaps before coding.
- Confirm the checkout, branch, task dependencies, and existing changes. Preserve
  unrelated work. Do not create a worktree without explicit authorization or
  mutate `main`/`master` without owner approval.
- Track task status in the plan or a short ledger; a separate todo per microstep
  is unnecessary.

## Execute

For each task, inspect the relevant evidence, implement within scope, and run its
checks. Behavior changes require focused test-first coverage unless infeasible;
record the reason and alternative verification before taking that exception.

Use judgment for reversible implementation details. If repository evidence makes
a planned detail obsolete, adapt within the approved behavior and record the
reason. Ask before changing a consequential requirement, interface, security
boundary, compatibility promise, or scope.

Investigate failing checks systematically. Distinguish pre-existing/environmental
failures from regressions; do not silently weaken acceptance criteria. Escalate
when an owner decision or unavailable dependency blocks meaningful progress.

## Finish

Run checks covering the combined change, inspect the diff, and report what
changed, verification evidence, and limitations. Commit or publish only when
approved. Use `finishing-a-development-branch` if integration remains an open
choice; skip another menu when the user already selected the Git workflow.

---
name: writing-plans
description: Use when approved work needs multiple implementation tasks, explicit dependencies, or staged validation.
---

# Writing Plans

Write enough for an implementer to deliver and verify the approved behavior.
Specify outcomes and boundaries, not every keystroke or the full implementation.
Small local changes do not need a plan document.

## Before planning

Read the approved requirements and relevant repository evidence. Resolve material
unknowns about behavior, interfaces, compatibility, security, and scope. Do not
hide an owner decision inside a task.

Follow the existing architecture. Split only where independently testable
outcomes or dependencies justify it. Keep a coherent implementation and its tests
in the same task; fold required setup and documentation into that task.

## Plan format

Use the project's preferred location; default to
`docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`.

```markdown
# Feature implementation plan

## Goal and constraints
Expected behavior, non-goals, binding requirements, and approved decisions.
Reference the specification if one exists; do not invent a separate spec.

## Execution
Repository, approved branch/base, direct or delegated ownership, and validation.

## Task 1: Independently verifiable outcome
- Requirements: observable acceptance behavior and relevant constraints.
- Files/components: likely code, tests, and documentation locations.
- Interfaces/dependencies: exact contracts other tasks rely on, when applicable.
- Authority: edit boundary and decisions that require escalation.
- Checks: focused tests, expected behavior, and broader checks required afterward.
- [ ] Implement and verify the outcome.
```

Name real paths after inspecting the code. Include exact interface signatures or
examples when ambiguity would cause incompatible work. Let the implementer choose
ordinary internal details. Do not prewrite whole functions, duplicate test code,
require 2–5-minute microsteps, or prescribe a commit after every task.

## Validation and handoff

For behavior changes, require a focused failing test before implementation,
followed by the minimal fix and a passing run. Where test-first coverage is
infeasible, record why and specify the strongest feasible check before editing.

Review the plan for requirement coverage, interface consistency, actionable
checks, realistic dependencies, and unnecessary work. A placeholder for a material
requirement is an unresolved decision, not an executable task.

Use `subagent-driven-development` when delegation is authorized and useful;
otherwise execute directly, using `executing-plans` if needed. Do not ask the
owner to choose an execution mode already established by their instructions.
Track task completion in the plan or a small ledger. Commits and publication
follow approved Git scope, not the existence of a plan.

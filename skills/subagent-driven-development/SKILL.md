---
name: subagent-driven-development
description: Use when an approved implementation plan has bounded tasks that benefit from delegated execution and recovery state.
---

# Subagent-Driven Development

The controller owns requirements, authority, task boundaries, acceptance, and
publication. Delegate only when the user or applicable project instructions
permit it. Complexity or available tools alone do not authorize delegation.

## Boundaries

- Keep one mutation-capable writer per checkout, including the controller.
- Use the approved checkout and branch; do not mutate `main` or `master` without
  owner approval. Use a worktree only when explicitly authorized.
- Escalate unresolved product, API, compatibility, security, data, or scope
  decisions and destructive or hard-to-reverse actions.
- Follow configured role/model/context routing. Apply permitted worker-effort
  overrides without changing the configured model. Reviewers use
  `context: "fresh"` and remain read-only.
- Commit, push, PR, merge, release, and cleanup follow approved Git authority.

## Set up recovery

Read the plan and referenced requirements. Inspect Git state, preserve unrelated
changes, and identify dependencies before launching a writer.

Resolve bundled script paths relative to this skill directory and run them with
the target repository as cwd:

- `scripts/sdd-workspace PLAN_FILE` creates a plan-specific ignored directory.
- `scripts/task-brief PLAN_FILE TASK_NUMBER` extracts one task.
- `scripts/review-package PLAN_FILE BASE HEAD` captures committed and working-tree
  evidence, including non-ignored untracked files.

Keep a short controller ledger in the workspace. Its first line is
`# SDD ledger — plan: <normalized absolute plan path>`. Record the base, existing
changes to exclude, task state, decisions, checks, and artifact references. On
restart, read it and Git/runtime state before relaunching work.

## Execute one bounded task

1. **Prepare:** give the worker an objective, repository/cwd/ref, relevant brief,
   interfaces, edit authority, acceptance criteria, checks, expected output, and
   escalation conditions. Keep implementation and focused tests together.
2. **Launch:** let the worker own the task through self-review and validation.
   Children do not spawn more children. Independent read-only work can overlap;
   another writer cannot share the checkout.
3. **Verify:** inspect the report and diff, then run required deterministic
   checks. Worker claims are evidence, not proof.
4. **Review proportionately:** use a fresh read-only reviewer for substantial,
   risky, ambiguous, public, or hard-to-inspect changes. A trivial task with
   decisive checks does not need a separate model review.
5. **Resolve findings:** verify feedback against requirements and code; separate
   blockers from suggestions and push back on incorrect findings with evidence.
   Apply accepted fixes with one writer and revalidate affected behavior. Re-review
   material fixes within their blast radius. Record deferred non-blockers and
   escalate unresolved required decisions.
6. **Record completion:** update the ledger with changes, validation, review
   disposition, and handoff references. Run whole-change checks after dependent
   tasks are integrated.

## Runtime lifecycle and budget

Discover the effective spawn cap. Before launches or retained-child resumes,
check `used + reserved + next <= spawn cap`; reserve required validation capacity.
If it cannot fit, stop and ask rather than silently dropping a gate.

Prefer async launches and native completion notifications. Do not poll or call
`bg_wait` merely to wait for ordinary notifying children. Resume a completed child
only when the runtime reports it eligible; otherwise give a replacement its
relevant handoff.

Declare an output binding for reports needed later and pass the managed output
reference. A filename in prompt prose is not a runtime artifact binding. Use
`subagent` for a single task; use a workflow script only when sequencing or
branching needs it. Consult the installed `pi-subagents` guidance for exact APIs.

Retain recovery evidence until acceptance. Do not delete artifacts or Git state
without authority. Prompt references: `implementer-prompt.md`,
`task-reviewer-prompt.md`, and `re-review-prompt.md`.

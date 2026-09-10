---
name: subagent-driven-development
description: Use when an approved implementation plan has several delegated tasks that benefit from a single Pi controller, durable recovery state, and proportionate review.
---

# Pi-Native Subagent-Driven Development

Use one controller to execute an approved plan. Preserve recovery evidence and
single-writer ownership; do not turn ordinary implementation details into
ceremony.

## Non-negotiable boundaries

- The controller owns user intent, authority, scope, and final acceptance.
- Only one mutation-capable writer may operate in a checkout at a time. The
  controller may make a small intentional edit only when no worker is active
  and delegation overhead exceeds the change.
- Start in the approved checkout and branch. Do **not** create a worktree by
  default. Use a worktree only when it was explicitly authorized or when
  approved concurrent mutation needs isolation.
- Never begin mutation on `main` or `master` without explicit owner approval.
- Workers follow the active project context policy. Reviewers use
  `context: "fresh"` and remain read-only.
- Let Pi role settings and profiles route capability and cost. Do not select
  concrete models in dispatches or require a model argument.
- Ask the owner before a product, API contract, compatibility, security, data
  semantics, scope, publication, destructive, or hard-to-reverse decision.
  Decide reversible implementation details only inside the approved scope.
- Commit, push, PR, merge, publish, release, and destructive cleanup require
  their own approved authority. A task may finish without a commit.

## Setup and recovery

Read the approved plan and its referenced specification. Record the branch
base and create a todo for each task. Run:

```bash
skills/subagent-driven-development/scripts/sdd-workspace PLAN_FILE
```

It prints a plan-specific, git-ignored workspace named
`<sanitized-basename>-<path-hash>`. Store only controller-owned recovery data
there: `progress.md`, task briefs, and review packages. Its first ledger line
must be:

```text
# SDD ledger — plan: <normalized absolute plan path>
```

On restart, read that ledger and Git history before launching anything. Do not
reuse a sibling plan workspace or a legacy flat workspace. `git clean -fdx`
may remove this scratch data; Git history and Pi output artifacts remain the
recovery evidence.

Before the first writer, inspect `git status`, task dependencies, and shared
files. Start with a clean checkout, or record and exclude pre-existing changes
before a worker starts; a working-tree review package otherwise cannot identify
its task's changes reliably. Serialize tasks that touch the same file or
interface. Record any approved reversible ruling in the ledger with its reason
and cost if wrong. Escalate consequential ambiguities instead of ruling on
them.

## Spawn-budget preflight

Discover the effective session spawn cap from the runtime before planning the
workflow; do not embed or assume a numeric default. Before every launch **and
retained-child resume**, update `used + reserved + next <= spawn cap`; resumes
consume capacity too.

1. Reserve launches for the validation that the approved scope requires.
2. Estimate one worker per delegated task; add a fresh review only when the
   task is substantial, risky, ambiguous, public, or hard to inspect.
3. Spend remaining capacity on a worker-fix plus scoped re-review pair only
   while both launches are affordable.
4. If capacity cannot cover a required worker or validation step, stop and
   ask the owner. Never knowingly exceed the spawn cap or silently weaken a
   required validation gate.

For trivial, locally verifiable work, the controller may make the change and
run deterministic checks instead of dispatching a worker/reviewer pair. This
is proportional review, not a shortcut around approval or verification.

## Pi dispatch contract

Use `subagent` direct mode for a single bounded child and `workflowScript`
only when keyed sequencing, data-dependent branching, or controlled fanout is
needed. Launch async by default. Ordinary children deliver native completion
notifications; continue safe controller work or return control when idle. Do
not poll status or call `bg_wait` merely to wait for ordinary children.

Every child brief states: objective; repository/cwd/ref; edit or read-only
authority; relevant plan/brief/constraints; acceptance criteria; validation;
expected output; and stop-and-escalate conditions. Children do not dispatch
subagents.

Declare a Pi runtime `output` binding for every worker or reviewer report that
later stages need. Return and pass its managed output reference, rather than
inventing a repository report path. Task briefs and review packages remain
controller-owned files in the SDD workspace.

Example shape:

```js
const worker = await runs.run("task-1-worker", {
  agent: "worker",
  task: "Implement Task 1. Read the task brief first. You are the sole writer. Escalate consequential decisions.",
  output: "task-1-worker.md",
});
const review = await runs.run("task-1-review", {
  agent: "reviewer",
  context: "fresh",
  task: "Read the brief, review package, and worker output reference: " + worker.output + ". Review only; do not edit.",
  output: "task-1-review.md",
});
```

## Task loop

### 1. Prepare one task

Record `BASE=$(git rev-parse HEAD)`. Generate the task brief with:

```bash
skills/subagent-driven-development/scripts/task-brief PLAN_FILE TASK_NUMBER
```

Give a worker the brief path, only relevant completed interfaces, accepted
rulings, and its declared output artifact. Do not paste the full plan or prior
task history. The worker owns implementation, focused validation, self-review,
and a concise report. It may commit only under approved Git scope.

### 2. Validate proportionately

Inspect the worker report and changed files. Run deterministic checks required
by the task. For substantial, risky, ambiguous, public, or hard-to-see changes,
generate a review package from `BASE` through current `HEAD`. The package also
contains staged, unstaged, and non-ignored untracked changes, so a task without
commit authority remains reviewable. Dispatch a fresh, read-only reviewer with
the brief, review package, and worker output reference. A worker report is
evidence, not proof.

For low-risk work whose deterministic checks establish correctness, record why
independent review was unnecessary in the ledger.

### 3. Handle findings

Fix valid blockers inside the single-writer boundary. If the original child is
reported resumable, a budgeted resume may preserve useful task context;
otherwise dispatch one replacement worker with the brief, prior output
reference, and findings. Re-run the affected validation, then use a fresh,
read-only scoped re-review for material fixes when capacity permits.

Do not use a fixed number of fix rounds. Stop when the changed behavior is
verified, the planned review is clean, capacity is exhausted, or a required
owner decision appears. Record non-blocking deferred findings with evidence.
Escalate unresolved required findings rather than declaring them ruled away.

### 4. Complete and finish

Record task completion, changed files, validation evidence, review disposition,
output references, and any owner decisions in the ledger. After all tasks,
perform a whole-branch review only when the overall diff is substantial, risky,
public, or difficult to evaluate task-by-task. Apply accepted findings with one
writer and revalidate the fix blast radius.

Retain the ledger and managed artifacts until the owner accepts the outcome.
Do not delete workspaces, commits, branches, or runtime artifacts without
approved destructive-cleanup authority.

## Prompt templates

- [implementer-prompt.md](implementer-prompt.md)
- [task-reviewer-prompt.md](task-reviewer-prompt.md)
- [re-review-prompt.md](re-review-prompt.md)

## Rationalizations to reject

| Claim | Reality |
| --- | --- |
| “A worktree is always safer.” | It is only appropriate with explicit approval or isolated concurrent mutation. |
| “The controller can decide this API change.” | Product, API, compatibility, security, data, scope, publication, destructive, and hard-to-reverse choices belong to the owner. |
| “One more child is harmless.” | Count it against the spawn cap, including resumes, before launch. |
| “A report filename is a durable artifact.” | Declare the output binding and use its managed reference. |
| “Polling shows progress.” | Native completion notifications avoid needless polling for ordinary Pi children. |
| “Every typo needs a reviewer.” | Use deterministic validation for trivial work and fresh review where the risk warrants it. |

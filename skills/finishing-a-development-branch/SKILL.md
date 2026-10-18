---
name: finishing-a-development-branch
description: Use when verified work is ready for integration and the Git completion path needs selection or execution.
---

# Finishing a Development Branch

Verify the proposed result, follow the approved integration path, and preserve
work that still needs owner acceptance. Project Git instructions take priority.

## Verify the tree being integrated

Inspect the complete diff and run checks appropriate to the change, including
the full suite when feasible and required. Report failures and skipped checks;
do not call the branch ready on the strength of an earlier run against different
code. Preserve unrelated changes and untracked files.

Establish the branch, intended remote/base, and whether the checkout is a normal
repository, an owned worktree, or an externally managed workspace. Do not infer
ownership from the directory name or assume the default branch is the target.

## Follow the selected path

If the user already approved commit/push/PR or another completion workflow, carry
it out without asking the same question again. Otherwise offer the relevant
choices: open a PR, merge locally, or leave the branch for later. Do not offer
discard as a routine cleanup option.

### Commit and PR

Stage only intended paths, inspect the staged diff, and commit within approved
scope. Push the task branch to the approved remote and create the PR against the
confirmed base, following project naming/templates. Report the URL and checks.
A rejected push requires investigation, not an automatic force-push. Keep any
worktree needed for feedback.

### Local merge

Confirm the destination and inspect its existing state before switching or
updating it. Merge the approved branch and verify the merged result. If the
merge or checks fail, stop integration, preserve evidence and branches, and
investigate. Do not discard unrelated changes or reset the destination to make
the merge work.

### Keep as-is

Report the branch, location, verification, and unfinished integration steps.
Keeping the work is a valid completion state.

## Destruction and cleanup

Discard only in response to an explicit request. Show the exact commits,
branches, files, and workspace that would be lost, then obtain explicit
confirmation such as `discard` before destructive removal.

Remove a worktree only when cleanup is authorized and ownership is established.
Run removal from outside that worktree. If Git refuses because files remain,
show the files and ask whether to preserve, move, or delete them; never add
`--force` on your own initiative. Prune or delete other workspaces/branches only
within the same explicit authority.

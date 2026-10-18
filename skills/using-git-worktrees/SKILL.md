---
name: using-git-worktrees
description: Use when the user explicitly requests a worktree or approves isolated concurrent implementation.
---

# Using Git Worktrees

A worktree is an optional isolation mechanism, not a prerequisite for a feature
or plan. Without explicit authorization, keep working in the approved checkout
and serialize writers.

## Inspect first

Check Git state and preserve unrelated work. Determine whether this is already a
linked worktree, normal checkout, or submodule:

```bash
git rev-parse --git-dir
git rev-parse --git-common-dir
git rev-parse --show-superproject-working-tree
git branch --show-current
git status --short
```

Compare normalized Git directory paths. A submodule can also have different Git
and common directories, so directory inequality alone is insufficient. Reuse an
appropriate existing isolated workspace; do not nest worktrees or move an
externally managed detached HEAD without approval.

## Create only within approved scope

1. Establish the approved base, branch name, and destination. Follow explicit
   project/user choices; do not assume `main`, the current HEAD, or a directory
   convention establishes the intended base.
2. Prefer an available harness-native worktree mechanism that tracks ownership.
   Otherwise use Git directly.
3. For a project-local destination, verify that exact directory is ignored.
   If not, ask before altering tracked ignore rules or committing them.
4. Create the worktree without overwriting an existing branch or directory:

```bash
git worktree add -b <approved-branch> <approved-path> <approved-base>
```

If creation fails, report the cause and obtain approval before changing the
execution mode when isolation was required. Do not silently fall back to editing
the original checkout.

## Prepare and verify

Inspect the project's documented setup and lockfiles. Install or link dependencies
only when needed, using the project's package manager; do not unconditionally
run multiple installers based on file presence.

Run appropriate baseline checks. Report pre-existing failures and resolve whether
they block the task. Record the worktree path, branch/ref, base, setup/check
results, and who owns cleanup.

## Cleanup

Preserve the workspace while PR feedback or unfinished work needs it. Remove it
only under approved cleanup authority, after inspecting status and retaining
required artifacts. A familiar directory name is not proof of ownership.
Never force removal to bypass uncommitted or untracked files; show what would be
lost and ask. Deleting the branch requires its own approved scope.

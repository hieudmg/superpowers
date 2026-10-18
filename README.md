# Superpowers for Pi

Pi-only personal fork of Superpowers.

## Install

```bash
pi install git:github.com/hieudmg/superpowers
```

## Core skills

- `using-superpowers` — bootstrap routing and shared safeguards.
- `brainstorming` — clarify requirements and consequential design decisions.
- `writing-plans` — scope tasks, dependencies, and verification.
- `subagent-driven-development` — authorized delegation, recovery, and review.
- `systematic-debugging` — evidence-driven diagnosis and regression fixes.
- `test-driven-development` — test-first behavior coverage.

Review and verification remain part of these workflows rather than separate
skills. Direct execution follows the approved plan; worktree and Git publication
choices follow user/project policy. Invoke a skill explicitly with `/skill:<name>`.

## Local development

```bash
pi -e /path/to/superpowers
node --test tests/pi/*.mjs
```

The package loads the shared skills and `.pi/extensions/superpowers.ts`. The extension injects the `using-superpowers` bootstrap when a session starts and after context compaction.

## License

MIT License — see [LICENSE](LICENSE).

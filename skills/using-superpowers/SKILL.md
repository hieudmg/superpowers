---
name: using-superpowers
description: Use at session start to select relevant skills and scale the workflow to the task.
---

# Using Superpowers

Skills are on-demand guidance, not a mandatory chain. Follow applicable system,
developer, user, and project instructions before these defaults.

If dispatched as a child, complete the assigned task; do not restart the
controller's planning workflow.

## Choose the smallest useful workflow

- **Question or inspection:** answer or inspect directly. No implementation plan.
- **Small, clear change:** inspect relevant evidence, implement, and verify.
- **Unclear requirements or consequential trade-offs:** use `brainstorming` to
  settle them before implementation.
- **Substantial multi-step work:** use `writing-plans`; choose direct execution or
  `subagent-driven-development` according to approved scope and project policy.
- **Bug or failing check:** use `systematic-debugging` before proposing a fix.

Load a skill when its guidance is needed, not merely because it could apply.
Read relevant sections and references; do not repeatedly load unchanged material.
A short explanation of the approach is enough—no required announcement per skill,
checklist item, or internal step.

## Keep the safeguards

Confirm consequential product, API, security, scope, and irreversible decisions
with the owner. Resolve ordinary reversible implementation details within the
approved task. Preserve unrelated work, use one writer per checkout, apply
behavior-focused testing, and verify claims with evidence.

Pi discovers skills natively. Read their `SKILL.md` when needed; `/skill:name`
explicitly invokes one. See `references/pi-tools.md` for optional subagent and task
tracking mappings. Tool availability alone does not authorize delegation.

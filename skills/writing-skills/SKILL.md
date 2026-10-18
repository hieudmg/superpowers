---
name: writing-skills
description: Use when authoring, simplifying, or validating reusable agent instructions and supporting references.
---

# Writing Skills

A skill teaches a reusable technique, workflow, or reference. Add guidance for an
evidenced need, not every hypothetical mistake. Keep project policy in project
instructions and mechanical constraints in code where practical.

## Establish the need

Identify the intended user/task, triggering condition, failure being prevented,
and evidence of that failure. Check for an existing skill or policy that already
covers it. Prefer updating one authoritative source over repeating rules across
several skills.

For simplification, inventory what is loaded by default, what is loaded on demand,
and what is genuinely used. Skill reads are not proof of benefit: mandatory
loading can inflate usage.

## Write the smallest useful contract

Use a directory with `SKILL.md`; keep scripts, references, and assets alongside it
only when useful. Start with valid frontmatter:

```yaml
---
name: reviewing-changes
description: Use when a completed change needs independent correctness review.
---
```

Use a portable lowercase hyphenated name, matching the directory. Describe the
trigger clearly so the agent can select the skill without loading every skill.
Preserve established names when changing them would break discovery or references.

The body should cover:

1. Purpose and when this guidance is unnecessary.
2. Short actionable procedure or decision rules.
3. Required inputs, authority boundaries, output, and verification.
4. Links to optional detail only where it helps the current task.

Write positive, observable instructions. Reserve prohibitions for real safety
boundaries. Avoid repeated persuasion tables, ceremonial announcements, fixed
microsteps, and recursive requirements to load other skills. Examples should
resolve ambiguity, not repeat the prose.

Aim for a short routing skill and a few hundred words per common workflow. Move
specialized detail to an on-demand reference; do not merely hide duplicated policy
there. Use one useful example rather than several equivalent ones.

## Validate proportionately

Define acceptance behavior before editing. For substantive behavior-shaping
instructions, use a representative scenario without the proposed guidance to
observe the baseline failure, then repeat with the change. Include enough
variation to distinguish a real improvement from one lucky response. Preserve
successful safeguards while removing unnecessary process.

For risky wording, authority, or routing changes, fresh-context trials and
independent review may be useful when delegation is authorized. Measure the
intended outcome, not just whether the agent recites the rule. Broader compliance
claims require broader evidence.

For cosmetic edits or a pure prose/configuration change without an available
behavioral harness, document that limitation before editing. Check structure,
links, discovery, scope, and contracts deterministically; do not invent source-text
tests as proof of model behavior. Do not spawn agents solely to satisfy a template
when the user requests inline work.

Before publication, verify frontmatter and discovery, inspect the diff, check
referenced files and examples, and identify any untested behavioral assumptions.
Commit/push only within approved Git scope.

## Optional references

`testing-skills-with-subagents.md` contains pressure-scenario techniques;
`persuasion-principles.md` discusses wording approaches. They are reference
material, not mandatory experiment counts or additional authority. Use
`graphviz-conventions.dot` and `render-graphs.js` only when a decision diagram
would be clearer than a short list or table.

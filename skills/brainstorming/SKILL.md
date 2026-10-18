---
name: brainstorming
description: Use when requirements are unclear, approaches need comparison, or a change introduces consequential design decisions.
---

# Brainstorming

Turn material unknowns into an agreed scope. Scale the discussion to the risk;
do not make the user reapprove implementation details already covered by their
request.

## Choose the depth

| Request | Approach |
| --- | --- |
| Clear, local, reversible change | Inspect the existing flow and proceed within approved scope. Clarify only material unknowns. |
| Bounded change with ambiguity | Ask focused questions, propose a short approach in chat, and settle unresolved behavior before coding. No separate spec required. |
| New subsystem, interface change, or consequential trade-off | Compare approaches, agree on boundaries and acceptance behavior, then write a concise design. |
| Feasibility probe | State the question, constraints, and expected evidence. Keep throwaway experiments separate from approved production work. |

If exploration changes the scope or risk, explain the discovery and resolve the
new decision. Complexity alone does not require restarting an already useful
discussion or producing another document.

## Work through the unknowns

1. Inspect relevant code, documentation, tests, and recent changes. Follow existing
   patterns before proposing new ones.
2. Establish the desired outcome, constraints, non-goals, and acceptance behavior.
   Ask questions that affect the solution; group closely related questions when
   that saves a round trip.
3. When alternatives genuinely differ, explain their trade-offs and recommend one.
   Do not invent extra options for an obvious choice.
4. Describe the design at the necessary depth: interfaces, data flow, failure
   handling, compatibility, and validation. Avoid speculative abstractions and
   unrelated cleanup.
5. Ask for approval before unresolved product, API-contract, security, data,
   compatibility, scope, or hard-to-reverse choices. Ordinary reversible choices
   remain with the implementer inside the approved scope.

## Artifacts and handoff

For substantial work, capture the agreed decisions in a short design document at
the project's preferred location; default to
`docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`. Check it for contradictions,
missing acceptance behavior, and scope creep. Do not require a second approval
of unchanged decisions merely because they were written down.

Use `writing-plans` when execution needs task boundaries or staged validation.
A clear local change can proceed directly. Commit documents only within approved
Git scope.

## Optional visual companion

Use visuals only when seeing the content would help: layouts, mockups, diagrams,
or side-by-side alternatives. Ask before starting the browser companion. If
accepted, read `visual-companion.md` for operation and security details. Textual
requirements and trade-offs do not need a browser or a server.

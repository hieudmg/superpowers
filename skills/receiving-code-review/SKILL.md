---
name: receiving-code-review
description: Use when evaluating review feedback before changing code, especially when correctness or scope is uncertain.
---

# Receiving Code Review

Treat feedback as a claim to verify, not an instruction to accept automatically.
Correctness and the approved requirements take priority over agreement.

## Evaluate

1. Read the feedback and identify the requested behavior or technical claim.
2. Check it against the code, tests, supported environments, and prior decisions.
3. Classify it: valid, stale, incorrect, unclear, or outside approved scope.
4. For valid findings, assess impact and choose the smallest coherent fix.

Ask about ambiguity that affects the fix. Independent, understood items can
proceed while unrelated questions remain open; dependent items wait. If evidence
is unavailable, state the limitation rather than treating the suggestion as fact.

Push back when a proposal breaks a contract, contradicts requirements, adds
unused functionality, or misreads the implementation. Explain with file/line
references, tests, or a focused reproduction. Ask the owner before consequential
product, API, compatibility, security, data, or scope decisions.

## Apply and verify

Fix accepted blockers before optional cleanup. Keep coherent fixes and their
regression tests together; use test-first coverage for changed behavior. Avoid
unrelated refactoring or adding speculative features to satisfy a reviewer's
preference.

Rerun checks covering the fix and its blast radius. Seek scoped independent
re-review when the risk warrants it, not as a mandatory response to every comment.
Record deferred suggestions separately from unresolved blockers.

## Respond

State the disposition and evidence concisely:

- **Fixed:** describe the change and verification.
- **Not applicable:** explain the relevant contract or code path.
- **Needs clarification/decision:** name the unresolved requirement.
- **Deferred:** state why and whether follow-up is needed.

Avoid performative agreement, but do not turn ordinary courtesy into a separate
compliance rule. Correct your own mistaken pushback plainly. For GitHub inline
comments, reply in the original thread when appropriate rather than creating an
unrelated top-level comment.

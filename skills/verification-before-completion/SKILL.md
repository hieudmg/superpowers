---
name: verification-before-completion
description: Use before claiming a change is complete, fixed, or passing, and before committing or publishing it.
---

# Verification Before Completion

Match every completion claim to evidence from the current relevant state.
Confidence, an edit, or a child report is not proof of correctness.

## Verify the claim

1. Identify the check that establishes the claim.
2. Run it against the proposed result and inspect its exit status and meaningful
   output. Do not hide failures through log filtering.
3. Compare the evidence with the acceptance criteria.
4. Report the actual result and limitations, not the hoped-for outcome.

| Claim | Appropriate evidence |
| --- | --- |
| Tests pass | Relevant test run with failures/skips accounted for |
| Build succeeds | Successful build, not merely lint output |
| Bug fixed | Original reproduction or regression now passes |
| Regression test detects the bug | Observed expected failure without the behavior, then a passing run with it |
| Requirements met | Acceptance criteria checked against behavior and implementation |
| Delegated work complete | Inspected changes and appropriate independent verification |
| PR published | Confirmed remote branch/PR URL, not just a local commit |

Use the strongest feasible checks proportionate to risk. A focused test proves
its covered behavior, not the entire application. Full suites, builds, type
checks, integration tests, or schema checks may be needed for broader claims.

Evidence remains usable while the relevant code, inputs, and environment have
not changed. Do not rerun identical checks solely because another message or
workflow step occurred. Rerun checks affected by later edits, integration, or
changed assumptions.

When a check cannot run, state why, what was verified instead, and what remains
unproven. Distinguish pre-existing failures from regressions without dismissing
either. Do not silently turn a skipped check into a passing result.

Before committing or publishing, inspect the intended diff and verify the actual
state being shipped. Preserve unrelated work and follow approved Git scope.

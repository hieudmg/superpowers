---
name: systematic-debugging
description: Use when diagnosing a bug, failing check, performance regression, or unexpected behavior before proposing a fix.
---

# Systematic Debugging

Find evidence for the cause before changing behavior. Scale investigation to the
problem; a clear reproduction may make the process short.

## 1. Establish the failure

- Read the actual error and relevant stack trace, not just the final summary.
- Reproduce with the smallest reliable command or request. Record expected and
  observed behavior, inputs, environment, and frequency.
- Check recent changes, configuration, dependencies, and known working behavior.
- Separate verified facts from hypotheses. If reproduction is intermittent or
  unavailable, gather evidence rather than presenting a guess as the cause.

For multi-component failures, inspect the boundaries that could explain the
symptom: inputs, outputs, state, and configuration propagation. Add targeted
instrumentation when existing logs are insufficient. Avoid dumping secrets,
credentials, or unrelated sensitive data into diagnostic output.

## 2. Trace and test a hypothesis

Trace the invalid value or missing side effect back to its source. Compare a
working path with the failing path and examine differences relevant to the
hypothesis. Read enough of a reference to understand the contract; unrelated
implementation details do not need exhaustive reading.

State one falsifiable explanation and the evidence supporting it. Test with the
smallest useful experiment, changing one relevant variable at a time. If the
result contradicts the hypothesis, update it; do not stack speculative fixes.

## 3. Fix and verify

1. Define the acceptance behavior and add a focused regression test.
2. Run it before implementation and confirm failure for the expected reason.
3. Fix the demonstrated cause without unrelated refactoring.
4. Run the regression and checks covering the affected integration paths.
5. Confirm the original symptom is resolved before reporting the bug fixed.

If automated test-first coverage is infeasible, record why before editing and
use the strongest feasible deterministic reproduction/check. Passing a test that
does not exercise the original failure is not sufficient evidence.

## When progress stalls

Repeated failed attempts are a signal to reassess the reproduction, assumptions,
and component boundaries—not proof that the architecture is wrong. Remove or
account for experimental changes before the next attempt. Seek another opinion
or owner input when evidence is insufficient or a consequential decision is
needed. Do not silently expand into an architectural rewrite.

If the issue is external or environmental, state the evidence and limitations.
Appropriate handling may differ from fixing the external cause; do not claim
both were solved.

## Optional techniques

Read these references only when relevant:

- `root-cause-tracing.md`: backward tracing and finding a polluting test.
- `condition-based-waiting.md`: wait for observable conditions, with bounded
  timeouts, rather than increasing arbitrary sleeps.
- `defense-in-depth.md`: validation at meaningful trust/invariant boundaries.
  Additional checks must serve a concrete risk, not a requirement to validate
  every internal layer.

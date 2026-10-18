---
name: test-driven-development
description: Use when implementing or fixing observable behavior that needs automated regression coverage.
---

# Test-Driven Development

Define the intended behavior, watch a focused test fail, then implement the
smallest change that passes. A passing post-hoc test does not establish that the
test detects the missing behavior.

## RED: demonstrate the missing behavior

Write a test with a clear behavioral name and independently derived expectations.
Prefer real components; use doubles for external or otherwise impractical
boundaries without replacing the behavior being tested.

Run the focused test before implementation. Confirm that it fails because the
behavior is absent or incorrect, not because setup is broken. If it already
passes, determine whether it covers existing behavior or misses the proposed
change. Do not distort the requirement merely to obtain a failure.

```text
Acceptance: empty email is rejected.
Test: submit an empty email and assert the validation error.
RED evidence: expected that error, but the request was accepted.
```

## GREEN: implement the requirement

Make the minimal coherent production change. Avoid speculative options and
unrelated cleanup. Rerun the focused test, then checks covering affected behavior
and integration paths. Investigate failures rather than weakening assertions to
match the implementation.

If the test itself is wrong, correct it against the agreed requirement and
repeat the relevant RED/GREEN check. Test code is not automatically correct.

## REFACTOR: preserve the contract

Improve structure only while behavior remains covered and checks stay green.
For a behavior-preserving refactor, characterize the existing contract where
needed; do not invent a changed behavior merely to force a failing test.

Continue with the next meaningful behavior. Keep the tests and implementation
in one coherent deliverable; do not require a test for every trivial method or
internal implementation detail.

## Coverage and exceptions

For features and bug fixes, test-first is required unless demonstrably infeasible.
Before taking an exception—such as documentation, pure configuration, generated
artifacts, or an unavailable harness—record the reason and strongest feasible
verification. Escalate if the gap materially reduces confidence.

If implementation was written first, acknowledge that the process was not TDD.
Do not erase user work or pretend a later passing test proves test-first coverage.
Where safe and isolated, prove the regression test fails without the new behavior
and passes with it; do not disturb unrelated changes. Rework unverified behavior
as necessary and report limitations honestly.

## Before completion

- Acceptance behavior and important error/boundary cases are covered.
- The regression was observed failing for the intended reason and then passing,
  or the exception and alternative evidence are explicit.
- Relevant broader checks passed; failures or skipped checks are reported.
- Expectations are independent of the code under test.

For detailed test design and mocking guidance, consult `writing-good-tests.md`
when needed. Assert observable effects, arguments, or ordering when they are part
of the contract; do not test a mock merely for existing.

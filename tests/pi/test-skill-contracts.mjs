import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

// These protect instruction contracts, not the behavior of a model consuming them.
// Normalize whitespace so line wrapping alone does not break the assertions.
const contracts = [
  {
    skill: 'using-superpowers',
    purpose: 'routes clear work directly without mandatory skill chains',
    required: [
      /Skills are on-demand guidance, not a mandatory chain/i,
      /Small, clear change:\*\* inspect relevant evidence, implement, and verify/i,
      /Load a skill when its guidance is needed, not merely because it could apply/i,
    ],
    forbidden: [/1% chance/i, /before ANY response/i],
  },
  {
    skill: 'brainstorming',
    purpose: 'scales design and approval to material unknowns',
    required: [
      /Clear, local, reversible change \| Inspect the existing flow and proceed within approved scope/i,
      /do not make the user reapprove implementation details already covered by their request/i,
      /Ask for approval before unresolved product, API-contract, security, data, compatibility, scope, or hard-to-reverse choices/i,
    ],
    forbidden: [/approval gate never (?:does|scales)/i, /EVERY task on EVERY path/i],
  },
  {
    skill: 'writing-plans',
    purpose: 'plans outcomes without requiring microsteps or per-task commits',
    required: [
      /Small local changes do not need a plan document/i,
      /Specify outcomes and boundaries, not every keystroke or the full implementation/i,
      /Do not prewrite whole functions, duplicate test code, require 2–5-minute microsteps, or prescribe a commit after every task/i,
    ],
    forbidden: [/Each step is one action \(2-5 minutes\)/i],
  },
  {
    skill: 'subagent-driven-development',
    purpose: 'requires authority for delegation and makes review risk-based',
    required: [
      /Delegate only when the user or applicable project instructions permit it/i,
      /A trivial task with decisive checks does not need a separate model review/i,
      /use a fresh read-only reviewer for substantial, risky, ambiguous, public, or hard-to-inspect changes/i,
    ],
    forbidden: [/independent review after every task/i],
  },
  {
    skill: 'test-driven-development',
    purpose: 'distinguishes test-first TDD from post-hoc regression verification',
    required: [
      /Run the focused test before implementation/i,
      /If implementation was written first, acknowledge that the process was not TDD/i,
      /Do not erase user work or pretend a later passing test proves test-first coverage/i,
      /Where safe and isolated, prove the regression test fails without the new behavior and passes with it/i,
      /For a behavior-preserving refactor, characterize the existing contract where needed; do not invent a changed behavior merely to force a failing test/i,
      /Before taking an exception.*record the reason and strongest feasible verification/i,
    ],
    forbidden: [/post-hoc (?:tests?|testing) (?:is|are|counts? as) (?:strict )?TDD/i],
  },
];

function checkContract(contract, text) {
  const normalized = text.replace(/\s+/g, ' ');
  for (const pattern of contract.required) {
    assert.match(normalized, pattern, `${contract.skill}: missing ${pattern}`);
  }
  for (const pattern of contract.forbidden) {
    assert.doesNotMatch(normalized, pattern, `${contract.skill}: regressed ${pattern}`);
  }
}

for (const contract of contracts) {
  test(`${contract.skill} ${contract.purpose}`, async () => {
    const text = await readFile(resolve(repoRoot, 'skills', contract.skill, 'SKILL.md'), 'utf8');
    checkContract(contract, text);
  });

  test(`${contract.skill} guards reject missing safeguards and legacy instructions`, async () => {
    const text = (await readFile(resolve(repoRoot, 'skills', contract.skill, 'SKILL.md'), 'utf8'))
      .replace(/\s+/g, ' ');
    checkContract(contract, text);
    for (const pattern of contract.required) {
      const mutated = text.replace(pattern, 'Removed safeguard.');
      assert.notEqual(mutated, text, `mutation must alter ${contract.skill}`);
      assert.throws(() => checkContract(contract, mutated), assert.AssertionError);
    }
    for (const pattern of contract.forbidden) {
      // Use an actual matched legacy instruction, not the regex source string.
      const legacy = {
        'using-superpowers': ['If there is a 1% chance, load the skill.', 'Load skills before ANY response.'],
        brainstorming: ['The approval gate never scales.', 'This applies to EVERY task on EVERY path.'],
        'writing-plans': ['Each step is one action (2-5 minutes).'],
        'subagent-driven-development': ['Require independent review after every task.'],
        'test-driven-development': ['Post-hoc testing is TDD.'],
      }[contract.skill].find((instruction) => pattern.test(instruction));
      assert.ok(legacy, `missing mutation fixture for ${pattern}`);
      assert.throws(() => checkContract(contract, `${text} ${legacy}`), assert.AssertionError);
    }
  });
}

test('obsolete spec/plan reviewer templates and legacy dispatch syntax are absent', async () => {
  for (const path of [
    'skills/brainstorming/spec-document-reviewer-prompt.md',
    'skills/writing-plans/plan-document-reviewer-prompt.md',
  ]) {
    await assert.rejects(readFile(resolve(repoRoot, path), 'utf8'), { code: 'ENOENT' });
  }
  const skillsRoot = resolve(repoRoot, 'skills');
  const markdownFiles = (await readdir(skillsRoot, { recursive: true }))
    .filter((path) => path.endsWith('.md'));
  for (const path of markdownFiles) {
    const text = await readFile(resolve(skillsRoot, path), 'utf8');
    assert.doesNotMatch(text, /Subagent\s*\(general-purpose\)/i, path);
    assert.doesNotMatch(text, /(?:spec|plan)-document-reviewer-prompt\.md/i, path);
  }
});

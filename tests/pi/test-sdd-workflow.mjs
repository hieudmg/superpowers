import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

const execFile = promisify(execFileCallback);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const skillDirectory = resolve(repoRoot, 'skills/subagent-driven-development');
const workspaceScript = resolve(skillDirectory, 'scripts/sdd-workspace');

async function run(command, args, cwd) {
  return execFile(command, args, { cwd, encoding: 'utf8' });
}

function expectedWorkspace(repo, planPath) {
  const hash = createHash('sha256').update(planPath).digest('hex').slice(0, 12);
  return join(repo, '.superpowers', 'sdd', `task-${hash}`);
}

test('same-named plans in different directories receive separate SDD workspaces', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'superpowers-sdd-workspace-'));

  try {
    await run('git', ['init', '--quiet'], fixture);
    await mkdir(join(fixture, 'first'), { recursive: true });
    await mkdir(join(fixture, 'second'), { recursive: true });
    const firstPlan = join(fixture, 'first', 'task.md');
    const secondPlan = join(fixture, 'second', 'task.md');
    await writeFile(firstPlan, '# first\n');
    await writeFile(secondPlan, '# second\n');

    const first = (await run('bash', [workspaceScript, 'first/task.md'], fixture)).stdout.trim();
    const second = (await run('bash', [workspaceScript, 'second/task.md'], fixture)).stdout.trim();

    assert.equal(first, expectedWorkspace(fixture, firstPlan));
    assert.equal(second, expectedWorkspace(fixture, secondPlan));
    assert.notEqual(first, second, 'workspace identity must include the plan path, not only its basename');
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test('task briefs and review packages retain task and uncommitted-change evidence', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'superpowers-sdd-artifacts-'));
  const taskBrief = resolve(skillDirectory, 'scripts/task-brief');
  const reviewPackage = resolve(skillDirectory, 'scripts/review-package');

  try {
    await run('git', ['init', '--quiet'], fixture);
    await run('git', ['config', 'user.email', 'test@example.invalid'], fixture);
    await run('git', ['config', 'user.name', 'SDD test'], fixture);
    await mkdir(join(fixture, 'plans'), { recursive: true });
    const planPath = join(fixture, 'plans', 'task.md');
    await writeFile(planPath, '# Plan\n\n## Task 1: Preserve evidence\n\nExpected behavior.\n\n## Task 2: Ignore this\n');
    await writeFile(join(fixture, 'tracked.txt'), 'before\n');
    await run('git', ['add', '.'], fixture);
    await run('git', ['commit', '--quiet', '-m', 'fixture'], fixture);
    const head = (await run('git', ['rev-parse', 'HEAD'], fixture)).stdout.trim();

    const expectedArtifactWorkspace = expectedWorkspace(fixture, planPath);
    const briefPath = join(expectedArtifactWorkspace, 'task-1-brief.md');
    await run('bash', [taskBrief, 'plans/task.md', '1'], fixture);
    assert.match(await readFile(briefPath, 'utf8'), /Task 1: Preserve evidence/);

    await writeFile(join(fixture, 'tracked.txt'), 'unstaged change\n');
    await writeFile(join(fixture, 'staged.txt'), 'staged change\n');
    await run('git', ['add', 'staged.txt'], fixture);
    await writeFile(join(fixture, 'untracked.txt'), 'untracked change\n');

    const headShort = (await run('git', ['rev-parse', '--short', head], fixture)).stdout.trim();
    const packagePath = join(expectedArtifactWorkspace, `review-${headShort}..${headShort}.diff`);
    await run('bash', [reviewPackage, 'plans/task.md', head, head], fixture);
    const review = await readFile(packagePath, 'utf8');
    assert.match(review, /Working tree changes/);
    assert.match(review, /tracked\.txt/);
    assert.match(review, /staged\.txt/);
    assert.match(review, /untracked\.txt/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test('SDD guidance uses Pi-native authority, lifecycle, and artifact rules', async () => {
  const skill = await readFile(resolve(skillDirectory, 'SKILL.md'), 'utf8');
  const implementer = await readFile(resolve(skillDirectory, 'implementer-prompt.md'), 'utf8');
  const reviewer = await readFile(resolve(skillDirectory, 'task-reviewer-prompt.md'), 'utf8');
  const reReviewer = await readFile(resolve(skillDirectory, 're-review-prompt.md'), 'utf8');

  assert.doesNotMatch(skill, /using-git-worktrees to create one/i);
  assert.doesNotMatch(skill, /Always specify the model explicitly/i);
  assert.doesNotMatch(skill, /wait in bounded stretches/i);
  assert.match(skill, /worktree only when.*explicitly authori[sz]ed/i);
  assert.match(skill, /product.*API.*security.*scope/i);
  assert.match(skill, /native completion notifications/i);
  assert.match(skill, /spawn cap/i);
  assert.match(skill, /output binding/i);
  assert.match(skill, /context:\s*["']fresh["']/i);

  for (const prompt of [implementer, reviewer, reReviewer]) {
    assert.doesNotMatch(prompt, /model:\s*\[MODEL/i);
    assert.doesNotMatch(prompt, /\[MODEL\].*REQUIRED/i);
  }
  assert.match(implementer, /Commit only when.*approved Git scope/i);
  assert.match(reviewer, /fresh context/i);
  assert.match(reReviewer, /fresh context/i);
});

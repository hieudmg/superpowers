import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const extensionPath = resolve(repoRoot, '.pi/extensions/superpowers.ts');
const piToolsPath = resolve(repoRoot, 'skills/using-superpowers/references/pi-tools.md');

async function readPackageJson() {
  return JSON.parse(await readFile(packageJsonPath, 'utf8'));
}

async function loadExtension() {
  const handlers = new Map();
  const pi = {
    on(event, handler) {
      if (!handlers.has(event)) handlers.set(event, []);
      handlers.get(event).push(handler);
    },
  };
  const mod = await import(pathToFileURL(extensionPath).href + `?cachebust=${Date.now()}-${Math.random()}`);
  mod.default(pi);
  return { handlers };
}

function firstHandler(handlers, event) {
  const eventHandlers = handlers.get(event) ?? [];
  assert.equal(eventHandlers.length, 1, `expected one ${event} handler`);
  return eventHandlers[0];
}

function textOf(message) {
  if (typeof message.content === 'string') return message.content;
  return message.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
}

test('package.json declares a pi package with skills and extension resources', async () => {
  const pkg = await readPackageJson();

  assert.equal(pkg.name, 'superpowers');
  assert.equal('main' in pkg, false, 'Pi packages must not reference a removed non-Pi entry point');
  assert.match(pkg.description, /Pi/i, 'package metadata must identify Pi');
  assert.ok(pkg.keywords.includes('pi-package'));
  assert.deepEqual(pkg.pi.skills, ['./skills']);
  assert.deepEqual(pkg.pi.extensions, ['./.pi/extensions/superpowers.ts']);
});

test('extension registers lifecycle hooks without pre-compaction injection', async () => {
  const { handlers } = await loadExtension();

  for (const event of ['resources_discover', 'session_start', 'session_compact', 'context', 'agent_end']) {
    assert.equal((handlers.get(event) ?? []).length, 1, `missing ${event} handler`);
  }
  assert.equal((handlers.get('session_before_compact') ?? []).length, 0);
});

test('resources_discover contributes the bundled skills directory', async () => {
  const { handlers } = await loadExtension();
  const discover = firstHandler(handlers, 'resources_discover');

  const result = await discover({ type: 'resources_discover', cwd: repoRoot, reason: 'startup' }, {});

  assert.deepEqual(result.skillPaths, [resolve(repoRoot, 'skills')]);
});

test('startup context injects the bootstrap as one user message until agent_end', async () => {
  const { handlers } = await loadExtension();
  const sessionStart = firstHandler(handlers, 'session_start');
  const context = firstHandler(handlers, 'context');
  const agentEnd = firstHandler(handlers, 'agent_end');

  await sessionStart({ type: 'session_start', reason: 'startup' }, {});

  const originalMessages = [
    { role: 'user', content: [{ type: 'text', text: 'Let us make a react todo list' }], timestamp: 1 },
  ];
  const result = await context({ type: 'context', messages: originalMessages }, {});

  assert.equal(result.messages.length, 2);
  assert.equal(result.messages[0].role, 'user');
  assert.match(textOf(result.messages[0]), /You have superpowers/);
  assert.match(textOf(result.messages[0]), /Pi tool mapping/);
  assert.equal(result.messages[1], originalMessages[0]);

  const repeatedProviderRequest = await context({ type: 'context', messages: originalMessages }, {});
  assert.equal(repeatedProviderRequest.messages.length, 2);
  assert.match(textOf(repeatedProviderRequest.messages[0]), /You have superpowers/);

  const alreadyInjected = await context({ type: 'context', messages: result.messages }, {});
  assert.equal(alreadyInjected, undefined, 'bootstrap should not duplicate when already present');

  await agentEnd({ type: 'agent_end', messages: [] }, {});
  const afterEnd = await context({ type: 'context', messages: originalMessages }, {});
  assert.equal(afterEnd, undefined, 'startup bootstrap should clear after agent_end');
});

test('session_compact injects bootstrap after compaction summaries, not before compaction', async () => {
  const { handlers } = await loadExtension();
  const sessionCompact = firstHandler(handlers, 'session_compact');
  const context = firstHandler(handlers, 'context');

  await sessionCompact({ type: 'session_compact', compactionEntry: {}, fromExtension: false }, {});

  const summary = { role: 'compactionSummary', summary: 'Prior work summary', tokensBefore: 123, timestamp: 1 };
  const user = { role: 'user', content: [{ type: 'text', text: 'Continue' }], timestamp: 2 };
  const result = await context({ type: 'context', messages: [summary, user] }, {});

  assert.equal(result.messages.length, 3);
  assert.equal(result.messages[0], summary);
  assert.equal(result.messages[1].role, 'user');
  assert.match(textOf(result.messages[1]), /You have superpowers/);
  assert.equal(result.messages[2], user);
});

test('pi tools reference documents pi-specific mappings', async () => {
  assert.equal(existsSync(piToolsPath), true, 'pi-tools.md should exist');
  const text = await readFile(piToolsPath, 'utf8');

  // Assert against the mapping-table rows only. The surrounding prose mentions
  // these same tokens, so matching the whole file would still pass if the table
  // were deleted — the exact regression this test exists to catch.
  const rows = text.split('\n').filter((line) => line.startsWith('|'));
  assert.ok(
    rows.some((row) => /subagent/i.test(row)),
    'mapping table documents subagent dispatch',
  );
  assert.ok(
    rows.some((row) => /todo|task/i.test(row)),
    'mapping table documents task tracking',
  );
});

test('distribution contains only the Pi integration and fork branding', async () => {
  const requiredPaths = [
    'package.json',
    '.pi/extensions/superpowers.ts',
    'skills/using-superpowers/references/pi-tools.md',
    'README.md',
  ];
  const removedPaths = [
    '.agents', '.claude-plugin', '.codex-plugin', '.cursor-plugin', '.devin-plugin',
    '.hermes-plugin', '.kimi-plugin', '.opencode', 'hooks', 'docs', '.github',
    'assets', 'scripts', 'CLAUDE.md', 'GEMINI.md', 'AGENTS.md',
    'gemini-extension.json', 'RELEASE-NOTES.md', 'CODE_OF_CONDUCT.md',
    '.pre-commit-config.yaml', '.version-bump.json',
  ];

  for (const relativePath of requiredPaths) {
    assert.equal(existsSync(resolve(repoRoot, relativePath)), true, `${relativePath} must remain`);
  }
  for (const relativePath of removedPaths) {
    assert.equal(existsSync(resolve(repoRoot, relativePath)), false, `${relativePath} must be removed`);
  }

  const readme = await readFile(resolve(repoRoot, 'README.md'), 'utf8');
  assert.match(readme, /hieudmg\/superpowers/, 'README must identify this fork');
  assert.doesNotMatch(readme, /obra\/superpowers/, 'README must not link upstream');

  const references = await readdir(resolve(repoRoot, 'skills/using-superpowers/references'));
  assert.deepEqual(references.sort(), ['pi-tools.md']);

  const sddWorkspace = await readFile(resolve(repoRoot, 'skills/subagent-driven-development/scripts/sdd-workspace'), 'utf8');
  assert.doesNotMatch(sddWorkspace, /Claude Code/, 'retained scripts must not name another harness');

  const extension = await readFile(extensionPath, 'utf8');
  assert.doesNotMatch(extension, /Claude Code/, 'Pi extension instructions must not name another harness');
});

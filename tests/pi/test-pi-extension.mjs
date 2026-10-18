import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const skillsDir = resolve(repoRoot, 'skills');

async function readPackageJson() {
  return JSON.parse(await readFile(packageJsonPath, 'utf8'));
}

test('package exposes native skills without loading an extension', async () => {
  const pkg = await readPackageJson();

  assert.equal(pkg.name, 'superpowers');
  assert.equal('main' in pkg, false, 'Pi packages must not reference a removed non-Pi entry point');
  assert.match(pkg.description, /Pi/i, 'package metadata must identify Pi');
  assert.ok(pkg.keywords.includes('pi-package'));
  assert.deepEqual(pkg.pi.skills, ['./skills']);
  assert.equal(pkg.pi.extensions, undefined, 'skills-only package must not autoload extensions');
});

test('Pi native loader discovers the bundled on-demand skills', async (t) => {
  const moduleSpecifier = process.env.PI_CODING_AGENT_MODULE || '@earendil-works/pi-coding-agent';
  let moduleUrl;
  try {
    moduleUrl = import.meta.resolve(moduleSpecifier);
  } catch (error) {
    if (!process.env.PI_CODING_AGENT_MODULE && error.code === 'ERR_MODULE_NOT_FOUND') {
      t.skip('Install @earendil-works/pi-coding-agent locally or set PI_CODING_AGENT_MODULE to its entry point');
      return;
    }
    throw error;
  }
  const { loadSkillsFromDir } = await import(moduleUrl);
  const { skills, diagnostics } = loadSkillsFromDir({ dir: skillsDir, source: 'path' });
  const skillNames = skills.map((skill) => skill.name).sort();

  assert.equal(diagnostics.length, 0, diagnostics.map((item) => item.message).join('\n'));
  assert.equal(skillNames.length, 13);
  assert.ok(skillNames.includes('test-driven-development'));
  assert.ok(skillNames.includes('subagent-driven-development'));
  assert.ok(skillNames.includes('systematic-debugging'));
  assert.ok(!skillNames.includes('using-superpowers'), 'removed bootstrap skill must not be discoverable');
});

test('distribution contains only the Pi skill package and fork branding', async () => {
  const removedPaths = [
    '.pi/extensions/superpowers.ts',
    'skills/using-superpowers',
    '.agents', '.claude-plugin', '.codex-plugin', '.cursor-plugin', '.devin-plugin',
    '.hermes-plugin', '.kimi-plugin', '.opencode', 'hooks', 'docs', '.github',
    'assets', 'scripts', 'CLAUDE.md', 'GEMINI.md', 'AGENTS.md',
    'gemini-extension.json', 'RELEASE-NOTES.md', 'CODE_OF_CONDUCT.md',
    '.pre-commit-config.yaml', '.version-bump.json',
  ];

  for (const relativePath of removedPaths) {
    assert.equal(existsSync(resolve(repoRoot, relativePath)), false, `${relativePath} must be absent`);
  }

  const readme = await readFile(resolve(repoRoot, 'README.md'), 'utf8');
  assert.match(readme, /hieudmg\/superpowers/, 'README must identify this fork');
  assert.doesNotMatch(readme, /obra\/superpowers/, 'README must not link upstream');
  assert.match(readme, /\/skill:/, 'README must explain explicit native skill invocation');
  assert.match(readme, /pi update git:github\.com\/hieudmg\/superpowers/, 'README must explain how to update this package');
  assert.match(readme, /new session|restart/i, 'README must explain that existing sessions need a restart');
});

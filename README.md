# Superpowers for Pi

Pi-only personal fork of Superpowers, distributed as native Pi skills. Skills are discovered by Pi and loaded on demand when relevant; no extension or startup bootstrap is installed.

## Install

```bash
pi install git:github.com/hieudmg/superpowers
```

To load a skill explicitly, use `/skill:<name>`, for example `/skill:test-driven-development`.

## Local development

```bash
pi -e /path/to/superpowers
node --test tests/pi/*.mjs
```

The discovery integration test uses a locally resolvable `@earendil-works/pi-coding-agent` installation. If Pi is installed elsewhere, set `PI_CODING_AGENT_MODULE` to its absolute entry-point path or file URL when running tests. Without either, only the discovery integration test is skipped; an explicitly configured but invalid runtime fails the test.

The package exposes the directories under `skills/` through Pi's native skill loader. To update an existing installation, run `pi update git:github.com/hieudmg/superpowers` and start a new Pi session so it rediscovers the package resources. Existing sessions may retain the old package resources until restarted.

## License

MIT License — see [LICENSE](LICENSE).

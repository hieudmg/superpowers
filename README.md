# Superpowers for Pi

Pi-only personal fork of Superpowers.

## Install

```bash
pi install git:github.com/hieudmg/superpowers
```

## Local development

```bash
pi -e /path/to/superpowers
node --test tests/pi/test-pi-extension.mjs
```

The package loads the shared skills and `.pi/extensions/superpowers.ts`. The extension injects the `using-superpowers` bootstrap when a session starts and after context compaction.

## License

MIT License — see [LICENSE](LICENSE).

<p align="center">
  <img src="assets/readme-banner.svg" alt="Agent Memory Audit banner" width="100%">
</p>

<h1 align="center">Agent Memory Audit</h1>

<p align="center">Check AI memory or rule files for trigger conditions, behavior, exceptions, and secret boundaries.</p>

<p align="center"><a href="README.zh-CN.md">中文</a> · <a href="#quick-start">Quick Start</a> · <a href="#checks">Checks</a> · <a href="#ci-usage">CI</a></p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/node-%3E%3D18-2563EB">
  <img alt="dependencies" src="https://img.shields.io/badge/dependencies-0-111827">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-16A34A">
</p>

<p align="center">
  <img src="assets/cli-preview.svg" alt="Agent Memory Audit CLI preview" width="88%">
</p>

## Why This Exists

AI-agent workflows keep growing, but many repositories still miss tiny local checks that are easy to repeat in CI. This tool stays zero-dependency, mirror-friendly, and easy to fork.

## Quick Start

```bash
npx github:aolingge/agent-memory-audit --path memory.md
```

```bash
npx github:aolingge/agent-memory-audit --path memory.md --markdown > report.md
npx github:aolingge/agent-memory-audit --path memory.md --sarif > results.sarif
npx github:aolingge/agent-memory-audit --path memory.md --annotations
```

## Checks

| Check | What it looks for |
| --- | --- |
| trigger | Defines trigger. |
| behavior | Defines behavior. |
| exception | Defines exceptions. |
| secret | Blocks secrets. |

## CI Usage

See [docs/github-actions.md](docs/github-actions.md) and [docs/quality-gates.md](docs/quality-gates.md).

## Mirrors

- GitHub: https://github.com/aolingge/agent-memory-audit
- Gitee: https://gitee.com/aolingge/agent-memory-audit

## Contributing

Good first PRs: add checks, add fixtures, improve docs, or add GitHub Actions examples.

## License

MIT

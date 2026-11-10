# Security Policy

## Supported versions

Only the latest 1.x release is supported — please reproduce
any concern against the current `main` / newest tag before reporting.

## Attack surface

`where-to-plai` is a Claude Code plugin. It ships only **prompts, skills, agent
definitions and templates** (Markdown), its manifest (JSON) and an icon — no
scripts and no third-party code. Three skills carry Markdown blueprints from which
Claude writes a Claude Code workflow at run time.

There is **no network service, no server, and no daemon** — nothing listens on a
port, and the plugin stores no credentials. Classic attack surface is therefore
small. That said, a plugin that steers an agent over your project files still
carries prompt- and code-level risk worth reporting. Concerns we care about
include:

- A skill or agent prompt that could be steered into **exfiltrating project
  files** or reaching out to unexpected destinations.
- A **workflow blueprint** that could lead Claude to write a workflow that
  processes worksheet content in a way that executes injected code, writes
  outside the intended `where-to-play/` workspace, or leaks file contents.
- A **prompt-injection** path where untrusted content pulled into a worksheet
  (e.g. fetched market-research text) could hijack the agent's instructions.

## Reporting a vulnerability

Please report privately rather than opening a public issue with exploit details:

1. **Preferred:** open a private **GitHub Security Advisory** on the
   [where-to-plai](https://github.com/Where-2-Play/where-to-plai/security/advisories)
   repository.
2. **Alternatively:** open a **minimal** public issue on the
   [issue tracker](https://github.com/Where-2-Play/where-to-plai/issues)
   that asks the maintainers to make contact — **without** sensitive details or
   a working exploit — and we will follow up through a private channel.

Please include enough to reproduce: the plugin version, the skill/agent/workflow
involved, the input that triggers it, and the impact you observed. We will
acknowledge your report and work with you on a fix and coordinated disclosure.

## See also

- [Plugin README](plugins/where-to-plai/README.md)

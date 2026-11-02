# Where to PlAI

[![CI](https://github.com/Where-2-Play/where-to-plai/actions/workflows/validate-plugin.yml/badge.svg)](https://github.com/Where-2-Play/where-to-plai/actions/workflows/validate-plugin.yml)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey)](plugins/where-to-plai/NOTICE.md)
[![Release](https://img.shields.io/github/v/release/Where-2-Play/where-to-plai)](https://github.com/Where-2-Play/where-to-plai/releases)
[![Built for Claude Code](https://img.shields.io/badge/Built%20for-Claude%20Code-blueviolet)](https://docs.claude.com/en/docs/claude-code)

A Claude Code plugin that guides startup and innovation teams through the Market Opportunity Navigator (Where-to-Play) as living project files.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Documentation map](#documentation-map)
- [Repository layout](#repository-layout)
- [Status](#status)
- [Contributing](#contributing)
- [License](#license)

## Background

**Where to PlAI** carries the **Market Opportunity Navigator (MON) / Where-to-Play** methodology by **Sharon Tal & Marc Gruber** out of single chatbot prompts and into file- and project-based agentic work: your context stays as files in the project, reports land in your folder, and the three worksheets **breathe** — they are re-evaluated as you learn, not filled once. It is **not a strategy machine**: the plugin asks the cornerstone questions and gathers evidence, but your team makes every real decision — it never auto-aggregates scores or picks your market for you. The name is a play on words: *Where to Play* → *Where to **PlAI***.

## Install

```
/plugin marketplace add Where-2-Play/where-to-plai
/plugin install where-to-plai@where-to-plai
```

Or test locally without installing:

```
claude --plugin-dir /path/to/where-to-plai
```

## Usage

Start the guide, which sets up a `where-to-play/` workspace (plus a short workspace `CLAUDE.md` with the ground rules) in your project:

```
/where-to-plai:where-to-play
```

From there you work the three worksheets — Market Opportunity Set, Attractiveness Map, and Agile Focus Strategy — plus the supporting market-research, revisit, advisory-board, customer-discovery, and worksheet-view commands. The skills are also **auto-activating**: describe your intent in plain language and Claude Code selects the matching step. See [docs/usage.md](docs/usage.md) for the walkthrough and the [plugin README](plugins/where-to-plai/README.md) for the full command list.

## Documentation map

| Document | Purpose |
|---|---|
| [docs/usage.md](docs/usage.md) | Getting started and the day-to-day workflow through the worksheets. |
| [docs/skills.md](docs/skills.md) | The 9 skills — the guide plus one per worksheet and the supporting steps. |
| [docs/agents.md](docs/agents.md) | The agent roster: 5 working agents and the 4 experimental advisory-board advisors. |
| [docs/workflows.md](docs/workflows.md) | The three bundled Claude Code workflows (`workflows/wf-*.js`) and the market-research tiers. |
| [docs/templates.md](docs/templates.md) | The worksheet templates scaffolded into your project workspace. |
| [docs/examples.md](docs/examples.md) | The bundled worked examples — Augury, Inergio, Ceal. |
| [docs/methodology.md](docs/methodology.md) | The Market Opportunity Navigator / Where-to-Play methodology behind the plugin. |
| [docs/architecture.md](docs/architecture.md) | How skills, agents, workflows, and templates fit together. |
| [plugin README](plugins/where-to-plai/README.md) | The installable plugin's own README — overview, components, requirements. |

## Repository layout

```
where-to-plai/
├── plugins/
│   └── where-to-plai/      # the installable plugin (skills, agents, workflows, templates, examples)
├── docs/                   # repository documentation (this map)
├── .github/                # CI (validate-plugin.yml) and issue templates
├── .claude-plugin/         # marketplace manifest
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE                 # CC BY-NC-SA 4.0
```

## Status

This is **version 1.0**. The `persona-*` and `advisor-*` agents — the advisory board — are explicitly experimental "Framework plus": provocations, not verdicts; the advisory board has five members. The thinker advisors are anonymous experts named by their function; none is presented as a real person.

## Contributing

Feedback and bug reports are welcome as issues. Please open an issue before a pull request, and read the [Contributing guide](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first. For anything security-related, see the [security policy](SECURITY.md).

## License

© Sharon Tal & Marc Gruber. Licensed under **[CC BY-NC-SA 4.0](LICENSE)** (SPDX: `CC-BY-NC-SA-4.0`), the same license as the framework on [wheretoplay.co](https://wheretoplay.co/copyrights/). Free to use — also inside companies and in paid teaching or consulting — but not open source: selling the plugin or offering it as a paid product or service needs the authors' permission. Details, including the worksheet view's web-app design and the third-party files (Bootstrap, Open Sans, Jinja2, MarkupSafe): [NOTICE.md](plugins/where-to-plai/NOTICE.md). Plugin engineering by **Jörg Müller** ([co-intelligence.ai](https://www.co-intelligence.ai), GitHub [@codeeater](https://github.com/codeeater)), ghostwriter on behalf of the authors.

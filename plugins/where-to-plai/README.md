# Where to PlAI — the Market Opportunity Navigator for Claude Code

A Claude Code plugin that guides startup and innovation teams through the **Market Opportunity Navigator (MON) / Where-to-Play** methodology by **Sharon Tal & Marc Gruber** — as living project files, **human-in-the-loop**, with market-research support for the Attractiveness Map.

> The name is a play on words: *Where to Play* → *Where to **PlAI***.

## Overview

The Where-to-Play methodology usually lives in single chatbot prompts that cold-start every time. This plugin moves it into **file- and project-based agentic work**: your context stays as files in the project, reports land in your folder, your team works on shared documents, and the worksheets **breathe** — they are re-evaluated as you learn, not filled once.

**It is not a strategy machine.** The skills ask the cornerstone questions, gather evidence with its sources, and propose; **your team makes every real decision.** Scores and confidence colours (Worksheet 2) and the focus choices (Worksheet 3) stay with the humans — the plugin never auto-aggregates scores or picks your market for you. Helpers such as research, simulated interviews or the advisory board are offered at the step where they help, never run unasked.

## The three steps

1. **Market Opportunity Set** (Worksheet 1) — de-link your core abilities from your product, re-link them into an application → segment → sub-segment tree, screen each application × (sub-)segment to a varied set of ≈3–5.
2. **Attractiveness Map** (Worksheet 2) — score each opportunity on **Potential** and **Challenge** across six factors, relative to the others and with a separate confidence colour, then place it in one of four zones (Gold Mine / Moon Shot / Quick Win / Questionable).
3. **Agile Focus Strategy** (Worksheet 3) — choose a Primary market plus Backup and Growth options (every kept-open option tagged with its role); keep agility through real options; fill the dartboard — or, if no option can be Primary yet, decide what to learn next.

## Installation

```
/plugin marketplace add Where-2-Play/where-to-plai
/plugin install where-to-plai@where-to-plai
```

Or test locally without installing:

```
claude --plugin-dir /path/to/where-to-plai/plugins/where-to-plai
```

## Usage

Start the guide, which sets up a `where-to-play/` workspace in your project, plus a short workspace `CLAUDE.md` with the ground rules (an existing one is never overwritten):

```
/where-to-plai:where-to-play
```

Then work the worksheets:

| Command | What it does |
|---|---|
| `/where-to-plai:opportunity-set` | Worksheet 1 — generate & screen the opportunity set |
| `/where-to-plai:attractiveness-map` | Worksheet 2 — score opportunities on the six factors |
| `/where-to-plai:agile-focus` | Worksheet 3 — choose Primary/Backup/Growth, fill the dartboard |
| `/where-to-plai:market-research` | gather cited market evidence for a Worksheet 2 factor |
| `/where-to-plai:revisit` | re-open the worksheets as new evidence arrives (the "breathing" loop) |
| `/where-to-plai:advisory-board` | convene the advisor panel to review WS2/WS3 (experimental) |
| `/where-to-plai:customer-discovery` | draft a "Compelling reason to buy" score from synthetic, skeptical customer interviews (experimental) |

The skills are also **auto-activating**: describe your intent in plain language ("help us pick a market", "score this opportunity") and Claude Code selects the matching step — you don't have to memorize the commands.

## Example prompts

Type these in plain language; the matching skill starts on its own.

- *"Guide us through where to play. We build a low-power vibration sensor for industrial machines."* — starts the guided process and sets up the workspace.
- *"Research this market: how big is the market for predictive maintenance in mid-sized food plants in Germany? We need evidence for market volume."* — runs cited market research for a Worksheet 2 factor.
- *"Score this opportunity on the attractiveness map: predictive maintenance for wind-turbine operators."* — walks the six factors of Worksheet 2 with you.
- *"We learned something new from three customer interviews. Revisit our where to play."* — re-opens the worksheets with the new evidence.

## Components

- **8 skills** — the guide (`where-to-play`) plus one per worksheet (`opportunity-set`, `attractiveness-map`, `agile-focus`), and `market-research`, `revisit`, `advisory-board`, `customer-discovery`.
- **Working agents (5)** —
  - `opportunity-discovery` — WS1 breadth-first idea generation as an application → segment tree,
  - `market-research` — WS2 cited evidence with an evidence colour per claim, flags uncertainty,
  - `score-examiner` — WS2 evidence check of proposed scores, in both directions (never scores),
  - `persona-optimist` + `persona-skeptic` — **experimental** optimist-vs-skeptic debate lenses, woven into WS1/WS2/WS3.
- **Advisory board (4 advisor agents, experimental "Framework plus")** — three anonymous expert lenses named by their function, each applying an established school of thinking (Jobs Analyst, Beachhead Strategist, Risk Inverter), plus a **Tal & Gruber** duo (with diverge/focus lenses). Convened by the `advisory-board` skill: a board of five, each labelled by its lens — Tal & Gruber (method fidelity), Score Examiner (evidence check), Jobs Analyst (jobs to be done / disruption), Beachhead Strategist (beachhead / whole product), Risk Inverter (inversion / risk).
- **Templates** — the worksheet files scaffolded into your project workspace, plus the workspace `CLAUDE.md`.
- **Worked examples** — Augury (WS2), Inergio (full navigator), Ceal (WS1), bundled as few-shot references.
- **Three workflow blueprints** — for WtP-tuned deep research (`market-research`), the advisory board (intake → parallel review → synthesis) and synthetic, skeptical customer interviews (→ draft Factor-1 score). Each is a Markdown specification in the skill's `references/workflow-blueprint.md`; in Claude Code, Claude writes the workflow from it and runs it. Elsewhere the skills fall back gracefully to subagents.

### Market research: three tiers

The `market-research` skill picks an engine by **capability** — is the `Workflow` tool present on this surface?

1. **Bundled subagent** — the **fallback** when `Workflow` is absent; **portable**, works on any Agent Skills surface.
2. **Built-in `deep-research` workflow** — broad, adversarially-verified web research (**Claude Code only**).
3. **WtP research workflow** — factor-tuned, checks every number through three lenses (source, recency, scope) (**Claude Code only**; Claude writes it from the skill's blueprint).

Tiers 2–3 use the Claude Code `Workflow` tool. On other surfaces the skill **falls back to Tier 1** and says so in one plain sentence — the plugin never hard-depends on a Claude-Code-only feature. Every tier returns findings with their sources, shown by default; the factor's confidence colour stays the team's call.

## Requirements

- **Claude Code** for the full experience (the `/where-to-plai:*` commands and the workflows).
- The **skills and agents are portable** — they run on any Agent Skills surface. Only the three workflows and the `deep-research` tier are Claude-Code-only, and the plugin degrades gracefully where they are absent.

## What the plugin runs, reads and writes

**Runs**

- **Skills and agents** are Markdown instructions that Claude follows in your session. The plugin contains only Markdown, JSON and one image; it has no scripts, hooks, MCP servers or install steps, and nothing runs in the background.
- **Three Claude Code workflows** orchestrate Claude agents for market research, the advisory board and synthetic customer interviews. The plugin ships no scripts for them, only Markdown blueprints; when a skill needs one, Claude writes the workflow from the blueprint and runs it in Claude Code. The skill writes the results into the workspace.
- For broad market questions, the `market-research` skill can call Claude Code's built-in `deep-research` workflow. That workflow is part of Claude Code, not of this plugin.

**Fetches**

- Web research goes only through Claude's own `WebSearch` and `WebFetch` tools, under your Claude Code permissions. This happens in the `market-research` skill, agent and workflow, in the `customer-discovery` skill and workflow (to ground its personas), and in the `opportunity-discovery` agent (an optional search for adjacent industries). The search queries are built from the opportunity and factor you are researching.

**Reads**

- The files in your `where-to-play/` workspace. The `revisit` skill also looks at notes, interview transcripts and research files your team has put into the project.
- The plugin's own reference files (framework guides, worksheet specs, worked examples).
- It does not read Claude's memory or your past conversations.

**Writes**

- The `where-to-play/` workspace: the worksheets, `assumptions.md`, one file per opportunity in `02_attractiveness-map/`, and the notes from synthetic customer interviews.
- A short `CLAUDE.md` in the project root with the workspace ground rules, during setup. If a `CLAUDE.md` already exists, the guide asks first and offers to append; it never overwrites it.

**Never**

- The plugin's code makes no network calls of its own, sends no telemetry and stores no credentials. Apart from the web searches and page fetches described above, which Claude makes with its own tools, the plugin sends nothing anywhere. See [PRIVACY.md](PRIVACY.md).

The plugin collects no user data.

## Troubleshooting

- **No deep research, advisory-board or interview workflow runs.** These workflows need Claude Code. On other surfaces the skills fall back to subagents or run the steps themselves, and tell you so in one sentence.
- **Web research finds nothing.** Research uses Claude's `WebSearch` and `WebFetch` tools. Check that they are allowed in your Claude Code permissions.
- **Update or reinstall the plugin.** Run `claude plugin marketplace update where-to-plai`, then `claude plugin update where-to-plai@where-to-plai`, and restart Claude Code. To reinstall, run `claude plugin uninstall where-to-plai@where-to-plai`, then install it again as shown under Installation.
- **Report a problem** on the repository's [issue tracker](https://github.com/Where-2-Play/where-to-plai/issues). For security issues, follow `SECURITY.md` in the repository root instead.

## Status

This is **version 1.0.4**. The `persona-*` agents (an optimist and a skeptic who debate an opportunity) and the `advisor-*` agents (four of the five advisory-board members; the fifth is the Score Examiner) are explicitly experimental "Framework plus": provocations, not verdicts. The thinker advisors are anonymous experts named by their function; none is presented as a real person.

> **Temporarily removed.** Anthropic's plugin directory currently doesn't accept two parts of earlier versions from community plugins, so we took them out while we work on bringing them back:
> - **Worksheet view** — rendered the filled worksheets as web pages in the look of the Where-to-Play web app. It needs a Python renderer, templates, styles and fonts, which the directory doesn't accept.
> - **Pre-built workflow scripts** — ran market research, the advisory board and the synthetic customer interviews as multi-agent workflows. These three functions remain: each skill now carries its workflow as a Markdown blueprint, and Claude writes and runs the workflow from it.

## Feedback

This plugin is distributed from the [`where-to-plai`](https://github.com/Where-2-Play/where-to-plai) repository. Feedback and bug reports are welcome as issues there. The changelog is [CHANGELOG.md](CHANGELOG.md) in this folder; the repository root holds the project-level overview.

## License

© Sharon Tal & Marc Gruber. [CC BY-NC-SA 4.0](LICENSE), the same license as the framework on [wheretoplay.co](https://wheretoplay.co/copyrights/). Free to use, also inside companies and in paid teaching or consulting; selling the plugin or offering it as a paid product or service needs the authors' permission. Details: [NOTICE.md](NOTICE.md).

## Credits

Methodology: **Sharon Tal & Marc Gruber**, *Where to Play* (the Market Opportunity Navigator). Plugin engineering: Jörg Müller ([co-intelligence.ai](https://www.co-intelligence.ai), GitHub [@codeeater](https://github.com/codeeater)), ghostwriter on behalf of the authors.

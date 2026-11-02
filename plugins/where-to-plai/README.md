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
claude --plugin-dir /path/to/where-to-plai
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
| `/where-to-plai:worksheet-view` | render the worksheets as a visual one-page navigator |

The skills are also **auto-activating**: describe your intent in plain language ("help us pick a market", "score this opportunity") and Claude Code selects the matching step — you don't have to memorize the commands.

## Example prompts

Type these in plain language; the matching skill starts on its own.

- *"Guide us through where to play. We build a low-power vibration sensor for industrial machines."* — starts the guided process and sets up the workspace.
- *"Research this market: how big is the market for predictive maintenance in mid-sized food plants in Germany? We need evidence for market volume."* — runs cited market research for a Worksheet 2 factor.
- *"Score this opportunity on the attractiveness map: predictive maintenance for wind-turbine operators."* — walks the six factors of Worksheet 2 with you.
- *"Render the navigator so we can show our worksheets in Monday's meeting."* — builds the worksheet view as web pages.
- *"We learned something new from three customer interviews. Revisit our where to play."* — re-opens the worksheets with the new evidence.

## Components

- **9 skills** — the guide (`where-to-play`) plus one per worksheet (`opportunity-set`, `attractiveness-map`, `agile-focus`), and `market-research`, `revisit`, `advisory-board`, `customer-discovery`, `worksheet-view`.
- **Working agents (5)** —
  - `opportunity-discovery` — WS1 breadth-first idea generation as an application → segment tree,
  - `market-research` — WS2 cited evidence with an evidence colour per claim, flags uncertainty,
  - `score-examiner` — WS2 evidence check of proposed scores, in both directions (never scores),
  - `persona-optimist` + `persona-skeptic` — **experimental** optimist-vs-skeptic debate lenses, woven into WS1/WS2/WS3.
- **Advisory board (4 advisor agents, experimental "Framework plus")** — three anonymous expert lenses named by their function, each applying an established school of thinking (Jobs Analyst, Beachhead Strategist, Risk Inverter), plus a **Tal & Gruber** duo (with diverge/focus lenses). Convened by the `advisory-board` skill: a board of five, each labelled by its lens — Tal & Gruber (method fidelity), Score Examiner (evidence check), Jobs Analyst (jobs to be done / disruption), Beachhead Strategist (beachhead / whole product), Risk Inverter (inversion / risk).
- **Templates** — the worksheet files scaffolded into your project workspace, plus the workspace `CLAUDE.md`.
- **Worked examples** — Augury (WS2), Inergio (full navigator), Ceal (WS1), bundled as few-shot references.
- **Three bundled workflows** — `workflows/wf-market-research.js` (WtP-tuned deep research for WS2), `workflows/wf-advisory-board.js` (convene the panel: intake → parallel review → synthesis), and `workflows/wf-customer-discovery.js` (synthetic, skeptical customer interviews → draft Factor-1 score). All Claude-Code-only, invoked by `scriptPath` from the plugin; skills fall back gracefully (to subagents) elsewhere.

### Market research: three tiers

The `market-research` skill picks an engine by **capability** — is the `Workflow` tool present on this surface?

1. **Bundled subagent** — the **fallback** when `Workflow` is absent; **portable**, works on any Agent Skills surface.
2. **Built-in `deep-research` workflow** — broad, adversarially-verified web research (**Claude Code only**).
3. **Bundled `wf-market-research` workflow** — factor-tuned, cross-checks every number across ≥2 sources (**Claude Code only**, invoked by `scriptPath` straight from the plugin — no install step).

Tiers 2–3 use the Claude Code `Workflow` tool. On other surfaces the skill **falls back to Tier 1** and says so in one plain sentence — the plugin never hard-depends on a Claude-Code-only feature. Every tier returns findings with their sources, shown by default; the factor's confidence colour stays the team's call.

## Requirements

- **Claude Code** for the full experience (the `/where-to-plai:*` commands, the bundled workflows, and `worksheet-view` rendering).
- The **skills and agents are portable** — they run on any Agent Skills surface. Only the three bundled `workflows/*.js` and the `deep-research` tier are Claude-Code-only, and the plugin degrades gracefully where they are absent.
- `worksheet-view` renders with a bundled Python script (`skills/worksheet-view/renderer/render.py`), run with plain `python3` (Windows: `py`). It needs **Python 3.9 or newer** and nothing else: its two libraries, Jinja2 and MarkupSafe, ship inside the plugin, so there is nothing to install.

## What the plugin runs, reads and writes

**Runs**

- **Skills and agents** are Markdown instructions that Claude follows in your session. The plugin has no hooks, no MCP servers and no install scripts; nothing runs in the background.
- **Three Claude Code workflows** (`workflows/wf-*.js`) orchestrate Claude agents for market research, the advisory board and synthetic customer interviews. They run only inside Claude Code, when a skill calls them. The skill writes the results into the workspace.
- **One local Python script**, `render.py`, runs only when you ask for the worksheet view. It reads `where-to-play/wtp-data.json` and writes HTML pages. It makes no network calls.
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
- For the worksheet view: `where-to-play/wtp-data.json` and the `where-to-play/navigator/` folder. Rendering again replaces the pages and the style, font and image folders inside it. The pages load only local files and open offline.

**Never**

- The plugin's code makes no network calls of its own, sends no telemetry and stores no credentials. Apart from the web searches and page fetches described above, which Claude makes with its own tools, the plugin sends nothing anywhere. See [PRIVACY.md](PRIVACY.md).

The plugin collects no user data.

## Troubleshooting

- **The worksheet view does not render.** Check your Python version with `python3 --version` (Windows: `py --version`); it must be 3.9 or newer. Nothing else needs to be installed.
- **No deep research, advisory-board or interview workflow runs.** These workflows need Claude Code. On other surfaces the skills fall back to subagents or run the steps themselves, and tell you so in one sentence.
- **Web research finds nothing.** Research uses Claude's `WebSearch` and `WebFetch` tools. Check that they are allowed in your Claude Code permissions.
- **Update or reinstall the plugin.** Run `claude plugin marketplace update where-to-plai`, then `claude plugin update where-to-plai@where-to-plai`, and restart Claude Code. To reinstall, run `claude plugin uninstall where-to-plai@where-to-plai`, then install it again as shown under Installation.
- **Report a problem** on the repository's [issue tracker](https://github.com/Where-2-Play/where-to-plai/issues). For security issues, follow `SECURITY.md` in the repository root instead.

## Status

This is **version 1.0**. The `persona-*` and `advisor-*` agents (the advisory board) are explicitly experimental "Framework plus" — provocations, not verdicts; the advisory board has five members. The thinker advisors are anonymous experts named by their function; none is presented as a real person.

## Contributing

This plugin is distributed from the [`where-to-plai`](https://github.com/Where-2-Play/where-to-plai) repository. See the repository root for contribution guidelines, the changelog, and the project-level overview.

## License

© Sharon Tal & Marc Gruber. [CC BY-NC-SA 4.0](LICENSE), the same license as the framework on [wheretoplay.co](https://wheretoplay.co/copyrights/). Free to use, also inside companies and in paid teaching or consulting; selling the plugin or offering it as a paid product or service needs the authors' permission. Details: [NOTICE.md](NOTICE.md).

## Credits

Methodology: **Sharon Tal & Marc Gruber**, *Where to Play* (the Market Opportunity Navigator). Plugin engineering: Jörg Müller ([co-intelligence.ai](https://www.co-intelligence.ai), GitHub [@codeeater](https://github.com/codeeater)), ghostwriter on behalf of the authors.

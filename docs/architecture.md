# Architecture & Design Principles

How the plugin is built and *why* — the decisions that make it a **workspace** for the Market
Opportunity Navigator rather than a "strategy machine". This page covers the repository layout, how
skills, agents and workflows are discovered and wired together, the capability-tiered market-research
design, what is portable versus Claude-Code-only, and the human-in-the-loop stance that governs all of it.

## Single-plugin marketplace layout

The repository is a **self-hosted Claude Code marketplace that ships exactly one plugin**. Two manifests
sit at two levels:

- **Repo root — `.claude-plugin/marketplace.json`.** Declares the marketplace `where-to-plai` and lists a
  single plugin whose `source` is `./plugins/where-to-plai`. This is what `/plugin marketplace add
  Where-2-Play/where-to-plai` reads.
- **Plugin — `plugins/where-to-plai/.claude-plugin/plugin.json`.** The plugin manifest: name
  `where-to-plai`, version `1.0.2`, license `CC-BY-NC-SA-4.0`, © Sharon Tal & Marc Gruber.

The important structural choice is that the plugin lives in the **`plugins/where-to-plai/` subfolder, not
at the repo root**. Only that subfolder is the plugin `source`, so **only it enters the install cache**
when a user installs. Everything that supports the project but should not travel with the installed
plugin — `docs/`, the repo-root license files, and community/contribution files — stays **outside the
installable footprint**. Users get the skills, agents, workflows, templates and worked examples; they do
not get the documentation tree or repo scaffolding bloating their plugin cache.

```
where-to-plai/                   (repo root — github.com/Where-2-Play/where-to-plai)
├── .claude-plugin/
│   └── marketplace.json         marketplace manifest → source: ./plugins/where-to-plai
├── docs/                        this documentation (NOT installed)
└── plugins/
    └── where-to-plai/           ← the installable plugin (this subfolder is the cache)
        ├── .claude-plugin/plugin.json
        ├── README.md · LICENSE · NOTICE.md · PRIVACY.md · licenses/
        ├── skills/              9 skills
        ├── agents/              9 agents
        ├── workflows/           3 wf-*.js + README
        └── assets/templates/    worksheet templates + workspace CLAUDE.md scaffolded into a project
```

> Worked examples (Augury, Inergio, Ceal) are **not** under `assets/` — they live beside the skills that use them, under `skills/<skill>/references/examples/`. See [examples.md](examples.md).

Install: `/plugin marketplace add Where-2-Play/where-to-plai` then
`/plugin install where-to-plai@where-to-plai`. To test without installing, point Claude Code at the plugin
folder directly: `claude --plugin-dir /path/to/where-to-plai/plugins/where-to-plai`.

## Auto-discovery: skills, agents, workflows

The plugin declares **no explicit component lists** in `plugin.json` — the manifest carries only metadata
(name, version, description, author, links, license, keywords). Components are picked up by **convention-based
auto-discovery** from their directories:

- **`skills/`** — one subfolder per skill, each with a `SKILL.md` (plus optional `references/` and
  bundled assets, e.g. `worksheet-view/renderer/`). The `SKILL.md` frontmatter `description` is what makes
  a skill **auto-activating**: describe intent in plain language ("score this opportunity") and Claude Code
  matches it, so users don't have to memorize the `/where-to-plai:*` commands. **9 skills** ship — the
  `where-to-play` guide, one per worksheet (`opportunity-set`, `attractiveness-map`, `agile-focus`), plus
  `market-research`, `revisit`, `advisory-board`, `customer-discovery` and `worksheet-view`.
- **`agents/`** — one Markdown file per subagent, discovered by filename. **9 agents** ship: 5 working
  (`opportunity-discovery`, `market-research`, `score-examiner`, and the experimental `persona-optimist`, `persona-skeptic`)
  and 4 experimental advisory-board `advisor-*` agents.
- **`workflows/`** — `wf-*.js` scripts, auto-discovered and surfaced in the `/` menu. **3 workflows** ship.

The `wf-` prefix on every workflow is a deliberate namespacing choice. In current Claude Code, scripts in
`workflows/` are auto-discovered and appear as slash commands (e.g. `/where-to-plai:wf-customer-discovery`).
Several workflows share a purpose — and therefore almost a name — with a skill (`customer-discovery`,
`advisory-board`, `market-research`). Prefixing each script's `meta.name` with `wf-` keeps the workflow from
colliding with, and shadowing, the same-named **skill** in the menu. The **skill is the intended entry
point** — it adds the capability check and writes results into the workspace; the `wf-*` workflow is the raw
engine the skill calls. See [workflows.md](workflows.md).

## Component wiring: skills call agents and workflows

Skills are the orchestration layer. They read and write the `where-to-play/` workspace files and, when a
step needs heavier lifting, delegate to agents or workflows:

- **Skill → agent.** A skill spawns a bundled subagent via the Agent tool, e.g. the `market-research` skill
  (Tier 1) calls `Agent({ subagent_type: "where-to-plai:market-research", … })`, and the working WS1/WS2
  agents (`opportunity-discovery`, `score-examiner`, `persona-*`) run in isolated context and hand back a
  distilled result. See [agents.md](agents.md).
- **Skill → workflow.** A skill invokes a bundled workflow by **`scriptPath`** resolved inside the installed
  plugin, so there is **no separate install step**:
  `Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/wf-market-research.js", args: { … } })`. The
  `advisory-board` and `customer-discovery` skills wire to their `wf-*` counterparts the same way.

## The capability-tiered market-research design

Market research is the clearest illustration of the plugin's portability strategy. The `market-research`
skill picks its engine by a **single capability check — is the `Workflow` tool present on this surface?** —
not by guessing the surface and not by stakes:

1. **Tier 1 — bundled subagent (the fallback).** Spawned via the Agent tool when `Workflow` is **absent**.
   **Portable** — it runs on any Agent Skills surface. This is the fallback, not the everywhere default.
2. **Tier 2 — built-in `deep-research` workflow.** Broad, adversarially-verified web research
   (scope → parallel search → fetch → multi-vote verify → cited synthesis). **Claude Code only.** The
   default for broad/open questions and for the non-quantitative factors.
3. **Tier 3 — bundled `wf-market-research.js` workflow.** Factor-tuned; scopes into falsifiable
   sub-questions, then runs a 3-lens adversarial panel on **every number** (source / recency / scope) plus a
   completeness critic. **Claude Code only**, invoked by `scriptPath` straight from the plugin. Applies to
   exactly the two quantitative factors — **Market volume** and **Economic viability**.

When `Workflow` is available (Claude Code), the skill defaults to Tier 3 for the two quantitative factors and
Tier 2 for everything else; the `--wtp` / `--deep` flags let the team override explicitly. When `Workflow` is
**absent**, the skill **falls back to Tier 1 automatically** — and the `--wtp` / `--deep` flags degrade to
Tier 1 too, and the skill tells the team in one plain sentence, without tool names. Whatever the tier, the
output is the same shape: findings with their sources and a 🔴/🟠/🟢 evidence colour per claim, plus an
open-questions list; the factor-level confidence colour stays the team's call. **The plugin never hard-depends on a Claude-Code-only feature.** The
`advisory-board` skill applies the same detect-and-degrade pattern: use the workflow when present, otherwise
spawn the advisor agents directly.

## Portability: what runs where

| Component | Runs on any Agent Skills surface | Claude-Code-only |
|---|---|---|
| Skills (9) | ✅ | |
| Agents (9) | ✅ | |
| Bundled `workflows/*.js` (3) | | ✅ (need the `Workflow` tool) |
| `deep-research` tier | | ✅ |
| `worksheet-view` rendering | ✅ (bundled Python `render.py`; plain `python3`, Jinja2 bundled, nothing to install) | |

**Skills and agents are portable** — they are plain Markdown and run wherever the Agent Skills spec is
supported. **Only the three bundled `wf-*.js` workflows and the `deep-research` tier are Claude-Code-only**,
and every skill that uses them degrades gracefully where they are absent. `worksheet-view` renders through a
bundled Python script (`skills/worksheet-view/renderer/render.py`) rather than a hosted service, keeping the
visual output self-contained.

## Human-in-the-loop: the governing stance

Every design decision above serves one principle: **this is not a strategy machine.** The plugin asks the
cornerstone questions and gathers evidence; **the team makes every real decision.**

- **Scoring stays with humans.** The `market-research` engines return *evidence only* and are explicitly
  forbidden from assigning or implying a factor score or factor-level confidence colour — the team sets
  both on Worksheet 2, as two separate decisions. The plugin **never auto-aggregates scores**.
- **The focus choice stays with humans.** The plugin **never picks the market** on Worksheet 3; it lays out
  Primary / Backup / Growth options, roles and investment levels with a proposal each, and writes only what
  the team decided.
- **Helpers are offered, not run.** Research, simulated interviews, the evidence check, debates and the
  advisory board are offered in one plain sentence at the step where they help, and started only on a yes.
  Synthetic-persona output is labelled as a directional assumption, never as research.
- **Provocations, not verdicts.** The `persona-*` and `advisor-*` agents are experimental "Framework plus".
  They surface diverse lenses, disagreements and assumptions to test — they do **not** score or decide, and
  the thinker lenses are anonymous experts, never presented as a real person.
- **Longitudinal "breathing".** The worksheets are **living files** in the project, not a one-off snapshot.
  The `revisit` skill re-opens them as new evidence arrives and prompts re-evaluation instead of silently
  overwriting prior judgement.
- **File- and project-based.** Context lives as files in `where-to-play/`, and outputs land in the folder —
  so the team's knowledge accrues in the workspace rather than evaporating in a chat. At setup the guide also
  writes a short workspace `CLAUDE.md` (from `assets/templates/workspace-CLAUDE.md`; an existing one is never
  overwritten), so the ground rules hold even when no Navigator skill is active.

## See also

- [workflows.md](workflows.md) — the three bundled workflows and the capability-tiered research engine
- [skills.md](skills.md) — the nine skills and how they orchestrate a session
- [agents.md](agents.md) — the working agents and the experimental advisory board

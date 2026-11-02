# Contributing to Where to PlAI

Thanks for your interest in improving **Where to PlAI** — the Claude Code plugin that carries the **Market Opportunity Navigator (MON) / Where-to-Play** methodology by **Sharon Tal & Marc Gruber** into file- and project-based, agentic work. Contributions of every size are welcome: a typo fix, a clearer trigger phrase, a new worked example, a sharper agent prompt.

This is a small, solo/duo-maintained content-and-prompts plugin. Most of the "code" here is Markdown — skills, agents, references, and templates — plus three Claude Code workflow scripts. You do not need to be a JavaScript engineer to contribute meaningfully.

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md); by participating you agree to uphold it.

## First, the philosophy you must respect

**This plugin is not a strategy machine.** It asks the cornerstone questions and gathers evidence; the team makes every real decision. That stance is load-bearing, and any contribution has to preserve it:

- **Human-in-the-loop stays.** Scoring (Worksheet 2) and the focus choice (Worksheet 3) belong to the humans. The plugin **never auto-aggregates scores** and **never picks the market**. Don't add a skill, agent, or workflow that quietly decides for the user.
- **The experimental agents provoke, they don't rule.** The `persona-*` and `advisor-*` agents are explicit "Framework plus" — provocations, not verdicts. They surface disagreements and assumptions to test; they never score or decide.
- **Advisors are anonymous experts, not copies of people.** Each thinker advisor is named by its function (Jobs Analyst, Beachhead Strategist, Risk Inverter) and applies a school of thinking — its concepts, books and quotes — as a sparring partner. None is named after, or presented as, a real person. Keep the `[EXPERIMENTAL …]` marker and the "not a copy of any real person" framing in every advisor's description.

If a change would make the plugin more of a black box that hands back an answer, it's the wrong change — even if it's technically clean.

## Repository layout

```
where-to-plai/
├── .claude-plugin/marketplace.json   # single-plugin marketplace manifest
├── plugins/where-to-plai/            # the installable plugin
│   ├── .claude-plugin/plugin.json    # plugin manifest (name, version, license…)
│   ├── skills/<skill>/SKILL.md       # + references/ per skill
│   ├── agents/<agent>.md             # working + experimental agents
│   ├── workflows/wf-*.js             # Claude-Code-only workflow scripts
│   ├── assets/templates/             # worksheet files scaffolded into a project
│   └── README.md                     # plugin overview / voice reference
├── docs/                             # deep-dive docs (see below)
├── CONTRIBUTING.md                   # this file
├── CODE_OF_CONDUCT.md
└── LICENSE                           # CC BY-NC-SA 4.0 © Sharon Tal & Marc Gruber (details: plugins/where-to-plai/NOTICE.md)
```

For orientation before you change anything, the [`docs/`](docs/) folder is the deep dive: [skills.md](docs/skills.md), [agents.md](docs/agents.md), [workflows.md](docs/workflows.md), [methodology.md](docs/methodology.md), [templates.md](docs/templates.md), [examples.md](docs/examples.md), and [architecture.md](docs/architecture.md). The plugin's own [README](plugins/where-to-plai/README.md) is the reference for **voice** — match its clear, professional, precise tone.

## Proposing a new skill

Skills are the conceptual layer the agent applies itself. Each skill is a folder under `plugins/where-to-plai/skills/`:

```
skills/<skill-name>/
├── SKILL.md                 # required: frontmatter + instructions
└── references/              # optional: specs, examples, guides
    ├── <topic>.md
    └── examples/<case>.md
```

`SKILL.md` **must** open with YAML frontmatter carrying at least `name` and `description` (CI enforces both). Follow the house pattern of the existing skills:

```yaml
---
name: attractiveness-map
description: This skill should be used for Worksheet 2 of the Market Opportunity Navigator — … Triggers include "worksheet 2", "attractiveness map", "score this opportunity", … Use it to …
argument-hint: [optional: the opportunity to evaluate]
---
```

- **`name`** — kebab-case, matches the folder name.
- **`description`** — third-person ("This skill should be used to…"), and it carries the **trigger phrases** in the user's own words. These are what make the skill auto-activate, so invest in them. Add a `Use it to …` clause that states what the skill actually does.
- Keep the body **instructional prose**, not code. Push long specs, the six-factor definitions, or few-shot cases into `references/` and link to them, so the skill loads lean and discloses detail progressively.
- If your skill supports a bundled command, mirror the naming already used (`/where-to-plai:<skill-name>`).

## Proposing a new agent

Agents are single-purpose subagents under `plugins/where-to-plai/agents/<name>.md`. Every agent file **must** begin with `---` frontmatter (CI enforces the opening fence). Follow the existing files for the full shape — `name`, a rich `description` block with `<example>` snippets, and optionally `model` and `color`:

```yaml
---
name: persona-skeptic
description: |
  [EXPERIMENTAL — "Framework plus"] Use this agent to add a conservative, risk-focused … Examples:

  <example>
  Context: The team is excited about a high-potential opportunity.
  user: "We love this market — what are we not seeing?"
  assistant: "I'll bring in the persona-skeptic agent for the downside and risk case."
  <commentary>The user wants the cautious, risk-focused lens.</commentary>
  </example>
model: inherit
color: yellow
---
```

Two rules specific to this repo:

- **Working vs. experimental.** New "decision-adjacent" helpers (research, evidence checks) can be working agents, but they still may not score or decide. Anything that plays a persona or applies a thinker's school of thought is **experimental** and must say so in its description.
- **Anonymous experts, not copies of people (advisors).** An `advisor-*` agent must open with `[EXPERIMENTAL — Advisory Board]`, carry a functional name (not a person's name), and make clear it is **not a copy of any real person**. It may use a school's concepts, books and quotes, but never speaks for a living or historical individual. The one exception is `advisor-tal-gruber`, grounded in the authors' own method.

## Running the validation locally

CI (`.github/workflows/validate-plugin.yml`) runs a set of `jq`/`node` checks on every push and pull request to `main`. You can run the same checks locally before pushing — they need only `jq` and `node`, both preinstalled on the CI runner. From the repo root:

```bash
# 1) marketplace.json — valid JSON + required fields + array of plugins
jq empty .claude-plugin/marketplace.json
for f in name owner owner.name plugins; do
  jq -e ".$f" .claude-plugin/marketplace.json >/dev/null || echo "✗ missing: $f"
done
jq -e '.plugins | type == "array"' .claude-plugin/marketplace.json >/dev/null

# no duplicate plugin names
jq -r '.plugins[].name' .claude-plugin/marketplace.json | sort | uniq -d

# 2) each plugin manifest — dir exists, plugin.json valid JSON with a name
jq -r '.plugins[] | select(.source|type=="string") | .source' \
  .claude-plugin/marketplace.json | while read -r src; do
  jq empty "$src/.claude-plugin/plugin.json" && jq -e '.name' "$src/.claude-plugin/plugin.json" >/dev/null
done

# 3) every SKILL.md — frontmatter with name + description
find plugins -name SKILL.md -exec sh -c '
  head -n1 "$1" | grep -q "^---$" || echo "✗ $1: no frontmatter"
  fm=$(awk "NR>1 && /^---\$/{exit} NR>1" "$1")
  echo "$fm" | grep -q "^name:" || echo "✗ $1: missing name"
  echo "$fm" | grep -q "^description:" || echo "✗ $1: missing description"
' _ {} \;

# 4) every agent file — opens with frontmatter
find plugins -path '*/agents/*.md' -exec sh -c \
  'head -n1 "$1" | grep -q "^---$" || echo "✗ $1: no frontmatter"' _ {} \;

# 5) every workflow script — syntax-checks with node (wrapped in an async
#    function, the way the Workflow tool runs it)
find plugins -path '*/workflows/*.js' -exec sh -c \
  '{ echo "(async () => {"; sed "s/^export const meta/const meta/" "$1"; echo "})"; } > /tmp/wf-check.js && node --check /tmp/wf-check.js || echo "✗ $1"' _ {} \;
```

If any line prints a `✗` or a non-zero exit, fix it before opening the PR — CI will fail on the same check.

## Testing locally in Claude Code

Load the plugin straight from your working tree, no install step:

```bash
claude --plugin-dir /path/to/where-to-plai
```

Then exercise what you changed — for example `/where-to-plai:where-to-play` to set up a `where-to-play/` workspace, `/where-to-plai:attractiveness-map` for a scoring pass, or the plain-language triggers (auto-activation) if you touched a skill's `description`. If you edited a workflow (`workflows/wf-*.js`), run the skill that invokes it in Claude Code, since those are Claude-Code-only and won't run on other surfaces.

## Commits, versioning, and pull requests

- **Commit style** — conventional-ish, imperative subject, with the **why** in the body (the git log is our decision record). Examples: `feat(skills): add revisit breathing-loop triggers`, `fix(agents): keep advisor-risk-inverter framing`, `docs: clarify local validation`.
- **SemVer + CHANGELOG.** The plugin follows [Semantic Versioning](https://semver.org). If your change is user-visible, bump the `version` in **both** `.claude-plugin/marketplace.json` and `plugins/where-to-plai/.claude-plugin/plugin.json` (they move together) and add a `CHANGELOG.md` entry describing the change. Patch for fixes/wording, minor for new skills/agents/workflows, major only for breaking changes.
- **Open an issue first.** Describe what you want to change and why, so we can agree on it before you put work into a pull request.
- **Open a PR** against `main`. CI runs the validation workflow automatically; a green run plus a short description of what you changed and why is what gets a review. Keep PRs focused — one concern per PR is easiest to review in a small project.

## A note on the methodology and IP

The **Market Opportunity Navigator / Where-to-Play** methodology — the three worksheets, the six factors, the four zones, the Agile Focus dartboard — is the **intellectual property of Sharon Tal & Marc Gruber**, and the bundled worked examples (Augury, Inergio, Ceal) are © the authors.

Contributions are licensed under the plugin's license, [CC BY-NC-SA 4.0](LICENSE) (see [NOTICE.md](plugins/where-to-plai/NOTICE.md)). By submitting a contribution, you also grant Sharon Tal & Marc Gruber a perpetual, worldwide, royalty-free right to use, change and license it under other terms as well, including commercial ones. But **changes to the framework itself** — renaming factors, altering scoring logic, adding or dropping a worksheet step, reinterpreting the method — need the **authors' sign-off**. If you're proposing something in that territory, open an issue first and describe the intent; don't ship a framework change in a PR and expect it to merge without the authors in the loop. Please also don't change the license.

Fixes to wording, triggers, examples, docs, and the mechanics of skills/agents/workflows don't need that gate — those we love to see.

## See also

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Plugin README](plugins/where-to-plai/README.md) — voice and feature reference
- [`docs/`](docs/) — [skills.md](docs/skills.md) · [agents.md](docs/agents.md) · [workflows.md](docs/workflows.md) · [methodology.md](docs/methodology.md) · [templates.md](docs/templates.md) · [examples.md](docs/examples.md) · [architecture.md](docs/architecture.md)

# Development

How the plugin is built, checked and released. For maintainers, and for anyone preparing a pull request after agreeing on it in an issue (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

Most of the "code" here is Markdown — skills, agents, references and templates — plus three Claude Code workflow scripts and the worksheet view's small Python renderer.

## The philosophy every change has to respect

**This plugin is not a strategy machine.** It asks the cornerstone questions and gathers evidence; the team makes every real decision. That stance is load-bearing, and every change has to preserve it:

- **Human-in-the-loop stays.** Scoring (Worksheet 2) and the focus choice (Worksheet 3) belong to the humans. The plugin **never auto-aggregates scores** and **never picks the market**. Don't add a skill, agent, or workflow that quietly decides for the user.
- **The experimental agents provoke, they don't rule.** The `persona-*` and `advisor-*` agents are explicit "Framework plus" — provocations, not verdicts. They surface disagreements and assumptions to test; they never score or decide.
- **Advisors are anonymous experts, not copies of people.** Each thinker advisor is named by its function (Jobs Analyst, Beachhead Strategist, Risk Inverter) and applies a school of thinking — its concepts, books and quotes — as a sparring partner. None is named after, or presented as, a real person. Keep the `[EXPERIMENTAL …]` marker and the "not a copy of any real person" framing in every thinker advisor's description.

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
├── docs/                             # deep-dive docs, incl. this file
├── CONTRIBUTING.md                   # feedback and contributions
├── SECURITY.md                       # reporting security issues
└── LICENSE                           # CC BY-NC-SA 4.0 © Sharon Tal & Marc Gruber (details: plugins/where-to-plai/NOTICE.md)
```

For orientation before you change anything, the other files in this folder are the deep dive: [skills.md](skills.md), [agents.md](agents.md), [workflows.md](workflows.md), [methodology.md](methodology.md), [templates.md](templates.md), [examples.md](examples.md), and [architecture.md](architecture.md). The plugin's own [README](../plugins/where-to-plai/README.md) is the reference for **voice** — match its clear, professional, precise tone.

## Adding a skill

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

## Adding an agent

Agents are single-purpose subagents under `plugins/where-to-plai/agents/<name>.md`. Every agent file **must** begin with `---` frontmatter (CI enforces the opening fence). Follow the existing files for the full shape — `name`, a rich `description` block with `<example>` snippets, and optionally `model`, `color` and `tools`:

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
color: red
tools: ["Read"]
---
```

Two rules specific to this repo:

- **Working vs. experimental.** New "decision-adjacent" helpers (research, evidence checks) can be working agents, but they still may not score or decide. Anything that plays a persona or applies a thinker's school of thought is **experimental** and must say so in its description.
- **Anonymous experts, not copies of people (advisors).** An `advisor-*` agent must open with `[EXPERIMENTAL — Advisory Board]`, carry a functional name (not a person's name), and make clear it is **not a copy of any real person**. It may use a school's concepts, books and quotes, but never speaks for a living or historical individual. The one exception is `advisor-tal-gruber`, grounded in the authors' own method.

## Running the validation locally

CI (`.github/workflows/validate-plugin.yml`) runs a set of `jq`/`node` checks on every push to `main` and `next` and on pull requests to `main`. You can run the same checks locally before pushing — they need only `jq` and `node`, both preinstalled on the CI runner. From the repo root:

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

If any line prints a `✗` or a non-zero exit, fix it before pushing — CI fails on the same check.

CI also runs three more jobs:

- **Anthropic directory check** installs a pinned Claude Code CLI and runs `claude plugin validate plugins/where-to-plai --profile directory --strict`, the local subset of the directory's own checks (no login needed). Run it locally the same way before merging to `main`; raise the pinned `CLAUDE_CODE_VERSION` in the workflow now and then.
- **Worksheet view renders** runs `render.py` on `wtp-data.example.json` under Python 3.9 and 3.13 with nothing installed, and checks that all four pages, both stylesheets, the fonts and the assets come out.
- **Versions consistent** checks that `plugin.json` and `marketplace.json` carry the same version, that the CHANGELOG has a section for it, that both READMEs' status lines name it, and, on a `vX.Y.Z` tag, that the tag matches.

## Testing locally in Claude Code

Load the plugin straight from your working tree, no install step:

```bash
claude --plugin-dir /path/to/where-to-plai/plugins/where-to-plai
```

Then exercise what you changed — for example `/where-to-plai:where-to-play` to set up a `where-to-play/` workspace, `/where-to-plai:attractiveness-map` for a scoring pass, or the plain-language triggers (auto-activation) if you touched a skill's `description`. If you edited a workflow (`workflows/wf-*.js`), run the skill that invokes it in Claude Code, since those are Claude-Code-only and won't run on other surfaces.

## Commits, versioning and releases

- **Commit style** — conventional-ish, imperative subject, with the **why** in the body (the git log is our decision record). Examples: `feat(skills): add revisit breathing-loop triggers`, `fix(agents): keep advisor-risk-inverter framing`, `docs: clarify local validation`.
- **SemVer + CHANGELOG.** The plugin follows [Semantic Versioning](https://semver.org). If your change is user-visible, bump the `version` in **both** `.claude-plugin/marketplace.json` and `plugins/where-to-plai/.claude-plugin/plugin.json` (they move together) and add an entry to `plugins/where-to-plai/CHANGELOG.md` describing the change. Patch for fixes/wording, minor for new skills/agents/workflows, major only for breaking changes.
- **Branches.** Work on `next`. `main` is tracked by Anthropic's plugin directory through a GitHub webhook, so every push to `main` is scanned as a new version. Merge `next` into `main` only for a release: bump the version, cut the CHANGELOG section, tag `vX.Y.Z`, create the GitHub release, and check that CI is green and the README's release badge shows the new version.

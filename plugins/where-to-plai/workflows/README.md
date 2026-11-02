# workflows/ — bundled Claude Code Workflow scripts

These are **Workflow scripts** (dynamic multi-agent orchestration), invoked **by skills** on demand via the Claude Code `Workflow` tool with a `scriptPath` that resolves inside the installed plugin:

```
Workflow({ scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/<file>.js", args: { ... } })
```

The skill points `Workflow` straight at the bundled file — no separate install step.

> **Naming — why the `wf-` prefix.** In current Claude Code, scripts in `workflows/` are **auto-discovered** and surface in the `/` menu (e.g. `/where-to-plai:wf-customer-discovery`). Each script's `meta.name` is therefore prefixed **`wf-`** so it does **not** collide with the same-purpose **skill** of the plain name (`customer-discovery`, `advisory-board`, `market-research`). Without the prefix the workflow and the skill share a name and the workflow shadows the skill in the menu. The **skill** is the intended entry point (it adds the capability check + workspace writing); the `wf-*` workflow is the raw engine it calls.

## Contents

| File | Called by skill | Purpose |
|---|---|---|
| `wf-market-research.js` | `market-research` (Tier 3) | WtP-tuned deep research for a Worksheet 2 factor: scope → parallel search → adversarial number cross-check → cited summary with confidence flags. |
| `wf-advisory-board.js` | `advisory-board` | Convene the advisor panel over WS2/WS3 (five members, each labelled "Name — lens"; `args.board` convenes a subset): intake digest → parallel review by each board member (`agentType`) → synthesis of agreements, disagreements and assumptions to test. |
| `wf-customer-discovery.js` | `customer-discovery` | Synthetic customer discovery for a WS2 opportunity: derive diverse, grounded, skeptical personas (buyer vs. user) → parallel role-played interviews → synthesis into a DRAFT Factor-1 (Compelling reason to buy) score with a proposed confidence colour for the team to set, assumptions and a Mom-Test interview kit. Directional only — never research. |

## Portability

The `Workflow` tool is **Claude Code only**. On other Agent Skills surfaces (Cursor, Codex CLI, the Claude Agent SDK) it does not exist. The invoking skills detect this and **fall back gracefully** (the market-research skill drops to its bundled subagent; the advisory-board skill spawns the advisor agents directly; the customer-discovery skill runs the interviews in-skill) and say so in one plain sentence. The plugin never hard-depends on a Claude-Code-only feature.

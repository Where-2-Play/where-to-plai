---
name: market-research
description: "This skill should be used to gather market evidence for a Worksheet 2 factor of the Market Opportunity Navigator — the 'deep research' support for the Attractiveness Map. Triggers include 'research this market', 'market research for worksheet 2', 'how big is this market', 'find evidence for market volume', 'research the competition', 'TAM SAM SOM for this opportunity', 'validate this assumption with research', 'who are the competitors', 'deep research this factor', 'summarise our desk research for a factor'. Use it to run focused, cited market research per opportunity/factor and write the evidence into the workspace with confidence flags."
argument-hint: "<opportunity> [factor: e.g. market-volume | economic-viability | external-risk] [--deep | --wtp]"
---

# Market Research (Worksheet 2 support)

Gather **cited, uncertainty-flagged** market evidence to inform Worksheet 2 scoring. This skill collects evidence; it **does not set scores** — the team scores on Worksheet 2 using this evidence.

## Three research tiers (capability-driven)

**First check: is the `Workflow` tool available?** That alone decides the default — not stakes, not surface guesswork.

- **`Workflow` available** (Claude Code):
  - **Tier 3** (the plugin's own WtP research workflow, written from `references/workflow-blueprint.md`) for **exactly two factors — Market volume and Economic viability**; its number cross-checking is built for these.
  - **Tier 2** (built-in `deep-research`) for every other factor (Time to revenues, Implementation obstacles, External risks) and every broad or open question (competitor landscape, general context).
- **`Workflow` not available** (some Cowork / Agent-SDK surfaces): **fall back to Tier 1**, the bundled `market-research` subagent — only then, never as the default. Never let a missing tool block the research. Tell the team in one plain sentence, without tool or tier names — e.g. *"This environment can't run the larger automated research team, so I'll use individual research helpers instead — same goal, a bit more step by step."*
- Explicit flags override the default: **`--deep` → Tier 2**, **`--wtp` → Tier 3** (both need `Workflow`; without it they degrade to Tier 1).

For Tier 2 or 3, give the team a **one-line qualitative heads-up, then proceed** — no confirm-gate, no cost/time estimate. E.g. *"Running a WtP-tuned deep research pass that cross-checks every figure and flags confidence; I'll write the cited evidence into the workspace."*

### Tier 1 — Bundled subagent (fallback)
Pass the opportunity, the factor/assumption and constraints (segment, geography, horizon):
```
Agent({ subagent_type: "where-to-plai:market-research",
  prompt: "Research <factor> for the opportunity <opportunity>. Constraints: <segment / geography / horizon>. Return findings each with its source and a 🔴/🟠/🟢 evidence colour, plus an open-questions list. Evidence only — no score, no factor-level confidence." })
```
It returns a source-cited summary from an isolated context; for several independent questions, spawn one agent per question in parallel.

### Tier 2 — Built-in `deep-research` workflow (broad rigor)
```
Workflow({ name: "deep-research", args: "<opportunity> — <factor>: <the specific market question, with segment/geography/horizon>" })
```
Generic deep research (scope → parallel search → fetch → 3-vote verify → cited synthesis): strong breadth and verification, but **not** WtP-tuned.

### Tier 3 — WtP workflow written from the blueprint (factor-tuned, numbers cross-checked)
The plugin ships this tier as a **blueprint**, not as a script: `references/workflow-blueprint.md` fixes the phases, prompts, lenses and output schemas.

1. Read `references/workflow-blueprint.md` in full. If the `workflow-authoring` skill is listed, load it for the script API.
2. Fill the inputs: `opportunity`, `factor`, `constraints` (segment / geography / horizon).
3. Write the script from the blueprint and run it inline with `Workflow({ script: … })`. Keep the blueprint's phases, prompts, lenses and schemas as they are; the number cross-checking is the point of this tier, so don't drop or merge steps. Running this workflow is what the team asked for when they asked for this research.
4. If `Workflow` refuses or the script fails, fix an obvious script error once; otherwise use Tier 2, or Tier 1 if that fails too.

It splits the factor into falsifiable sub-questions (top-down + bottom-up for sizing), fans out searches, then checks **every number through three lenses** (source credibility / recency / scope match, majority rule, downgrading confidence on figures that fail) and runs a **completeness critic** for gaps. It returns 🔴/🟠/🟢 flags, ranges where sources disagree, and prioritised open questions — **evidence only, never a score**.

## What to do (any tier)

1. **Frame the question.** Name the opportunity and the factor / assumption that needs evidence. Pull open assumptions from `where-to-play/assumptions.md` when present, and **research the riskiest one first** — the one that, if wrong, would sink the opportunity (for a fresh map usually the compelling reason to buy).
2. **Pick the tier** per the capability check above; for Tier 2/3, give the heads-up and proceed.
3. **Demand honesty about uncertainty.** Distinguish evidenced from inferred or unknown, and researchable risk from irreducible uncertainty — there is no crystal ball, so name what more searching cannot settle rather than papering over it. **Flag low-confidence claims rather than assert them.** Treat any unsourced number as an assumption, not a fact.
4. **Write evidence into the workspace.** Append findings to the factor section of `where-to-play/02_attractiveness-map/<opportunity>.md`, each with its source link and an evidence colour per claim (🔴 none / 🟠 some / 🟢 significant). Leave the factor's Score and Confidence fields to the team. Keep desk research and synthetic-persona output (from `customer-discovery`) apart and labelled by kind — synthetic output is a directional assumption to validate with real people, never "research". Add still-open questions to `where-to-play/assumptions.md`. Before handing back, check that every appended finding carries its source and colour.
5. **Hand back.** Summarise what is evidenced vs. still assumed, **showing each finding's source (inline link or short citation) by default**, not only on request, and name the kind of evidence (desk research, synthetic personas, the team's own customer conversations). You may propose a factor-level confidence colour with a one-line reason, as a separate question from the score — the team sets it. Then return to the `attractiveness-map` skill so the team can (re)score with this evidence.

## Boundaries

- Evidence in; scores and factor-level confidence colours are set **by the team** — research never "decides" a factor, in any tier.
- Prefer primary and recent sources; cross-check figures across ≥2 independent sources before treating them as solid.
- Market figures drift and sources disagree — present ranges and disagreements honestly, not a single confident number.

## Additional resources

- `references/research-guide.md` — how to brief the engine per factor, source-quality and cross-checking rules, the evidence colours, the "surface uncertainty, don't bluff" (I-CALM) principle, and tier-selection guidance.
- `references/workflow-blueprint.md` — the Tier 3 workflow specification: phases, prompts, verification lenses and output schemas.

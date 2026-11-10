# Advisory board — workflow blueprint

The specification Claude follows when it writes the advisory-board workflow at run time (Path A in `SKILL.md`). It fixes **what** the workflow does: phases, agents, prompts, output shapes and rules. Write the script yourself from this page; keep the phases, agents, prompts and schemas as given here, and don't add phases, agents or steps of your own.

## Inputs

Fill these from the team's request before writing the script:

| Name | Value | Default |
|---|---|---|
| `worksheet` | `ws2`, `ws3` or `both` | `both` |
| `workspace` | the Where-to-Play folder | `where-to-play` |
| `focus` | a factor or opportunity the team wants the board to look at | empty |
| `board` | the members to convene (agent ids), see *Roster* | all five |

**Target files** by `worksheet`:
- `ws2` → `<workspace>/02_attractiveness-map/` and `<workspace>/02_map-overview.md`
- `ws3` → `<workspace>/03_agile-focus.md`
- `both` → all three

## Roster

Each member is an agent of this plugin, labelled "Name — lens" everywhere the team sees it:

| Agent type | Label |
|---|---|
| `where-to-plai:advisor-tal-gruber` | Tal & Gruber — method fidelity |
| `where-to-plai:score-examiner` | Score Examiner — evidence check |
| `where-to-plai:advisor-jobs-analyst` | Jobs Analyst — jobs to be done / disruption |
| `where-to-plai:advisor-beachhead-strategist` | Beachhead Strategist — beachhead / whole product |
| `where-to-plai:advisor-risk-inverter` | Risk Inverter — inversion / risk |

## Phases

Workflow name `wtp-advisory-board`, three phases: **Intake**, **Board**, **Synthesis**.

### 1. Intake — one agent, low effort, schema `DIGEST`

Prompt:

> You are preparing a briefing for an advisory board reviewing a Where-to-Play (Market Opportunity Navigator) analysis.
> Read the worksheet files in the project workspace: *‹target files›*.
> *(if focus)* Focus especially on: *‹focus›*.
> Produce a faithful, compact digest: each opportunity with its Overall Potential, Overall Challenge, zone and key open assumptions; the Primary/Backup/Growth choices if Worksheet 3 is present; and notes on blanks or low-confidence areas. Do not editorialise or score — just summarise what the worksheets currently say.

**Stop rule:** if the digest lists no opportunities, end the workflow here and return the message: *No populated worksheets found under "‹workspace›/". Fill in Worksheet 2 (and optionally Worksheet 3) before convening the advisory board — it reviews an existing analysis, it does not create one.*

### 2. Board — one agent per member, all in parallel, schema `REVIEW`

Run each member with its own agent type (the plugin agent carries the lens), so each reviews in its own context without seeing the others. That independence is what gives the tally in phase 3 its meaning. Prompt for each:

> The Where-to-Play advisory board is reviewing the team's worksheets. Here is the current digest:
> *‹digest as JSON›*
> *(if focus)* The team especially wants your view on: *‹focus›*.
> Review this through YOUR lens (read the workspace files under "‹workspace›/" if you need detail). Give your strengths, concerns, and the assumptions you would have the team test. Stay in character; never assign a score or pick the Primary.

Attach the member's label to each review. Drop members that returned nothing and note how many reported.

### 3. Synthesis — one agent, high effort, schema `SYNTHESIS`

Prompt:

> You are the chair summarising an advisory board's review of a Where-to-Play analysis. *‹n›* advisors reported. Here are their reviews as JSON:
> *‹reviews as JSON›*
> Synthesise for the team WITHOUT recommending a decision:
> Name each advisor by their full label, "Name — lens" (e.g. "Beachhead Strategist — beachhead / whole product"), so the team sees which perspective said what.
> - CONSENSUS TALLY: merge semantically-equivalent concerns and assumptions raised across advisors; for each merged item, count how many DISTINCT advisors raised it and list them by name, sorted by count descending. This is a weight-of-agreement signal on FINDINGS (which worries recur across lenses) — it is NEVER a score or a ranking of opportunities.
> - AGREEMENTS: where advisors converge.
> - DISAGREEMENTS: where they diverge (name who diverges and why).
> - TOP ASSUMPTIONS TO TEST: the highest-priority ones (merge duplicates across advisors).
> - BLIND SPOTS: what no advisor raised but the team should check.
> The board provokes and informs; the team decides. Do not score, rank, or pick a market.

## Return value

`worksheet`, `workspace`, `focus`, the board labels, the digest, the reviews, the synthesis, and the reminder: *The advisory board provokes and surfaces assumptions. The team makes every decision — no score, no chosen market, comes from this board.*

## Schemas

`DIGEST`:

```json
{
  "type": "object",
  "required": ["summary"],
  "properties": {
    "summary": { "type": "string" },
    "opportunities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": { "type": "string" },
          "overall_potential": { "type": "string" },
          "overall_challenge": { "type": "string" },
          "zone": { "type": "string" },
          "key_assumptions": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "primary": { "type": "string" },
    "backups": { "type": "array", "items": { "type": "string" } },
    "growth": { "type": "array", "items": { "type": "string" } },
    "notes": { "type": "string", "description": "gaps, blanks, low-confidence areas in the worksheets" }
  }
}
```

`REVIEW`:

```json
{
  "type": "object",
  "required": ["headline", "strengths", "concerns", "assumptions_to_test"],
  "properties": {
    "headline": { "type": "string", "description": "one-line take, in this advisor's voice; no score" },
    "strengths": { "type": "array", "items": { "type": "string" } },
    "concerns": { "type": "array", "items": { "type": "string" } },
    "assumptions_to_test": { "type": "array", "items": { "type": "string" } }
  }
}
```

`SYNTHESIS`:

```json
{
  "type": "object",
  "required": ["consensus_tally", "agreements", "disagreements", "top_assumptions_to_test", "blind_spots"],
  "properties": {
    "consensus_tally": {
      "type": "array",
      "description": "concerns/assumptions ranked by how many advisors independently raised them — a weight-of-agreement signal on FINDINGS, never a score or ranking of opportunities",
      "items": {
        "type": "object",
        "required": ["item", "flagged_by", "advisors"],
        "properties": {
          "item": { "type": "string", "description": "the merged concern or assumption" },
          "flagged_by": { "type": "integer", "description": "number of distinct advisors who raised it" },
          "advisors": { "type": "array", "items": { "type": "string" }, "description": "advisor labels as given, \"Name — lens\"" }
        }
      }
    },
    "agreements": { "type": "array", "items": { "type": "string" } },
    "disagreements": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["point", "who_diverges"],
        "properties": { "point": { "type": "string" }, "who_diverges": { "type": "string" } }
      }
    },
    "top_assumptions_to_test": { "type": "array", "items": { "type": "string" } },
    "blind_spots": { "type": "array", "items": { "type": "string" }, "description": "what no advisor raised but should be checked" }
  }
}
```

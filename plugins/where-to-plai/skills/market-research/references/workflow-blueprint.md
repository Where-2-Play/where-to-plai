# Market research (Tier 3) — workflow blueprint

The specification Claude follows when it writes the WtP market-research workflow at run time (Tier 3 in `SKILL.md`). It fixes **what** the workflow does: phases, agents, prompts, output shapes and rules. Write the script yourself from this page; keep the phases, agents, prompts and schemas as given here, and don't add phases, agents or steps of your own.

## Inputs

| Name | Value |
|---|---|
| `opportunity` | the Worksheet 2 opportunity |
| `factor` | one of the six factors (Tier 3 is the default for Market volume and Economic viability) |
| `constraints` | segment, geography, horizon |

**Research question:** *Market evidence needed to score the "‹factor›" factor for the market opportunity "‹opportunity›". ‹constraints›* — or the team's own question, if they asked one.

**Framing block** (put at the top of every prompt, word for word):

> This is research for the Market Opportunity Navigator (Where-to-Play) by Sharon Tal & Marc Gruber, Worksheet 2.
> The six factors are: Potential = Compelling reason to buy, Market volume, Economic viability; Challenge = Implementation obstacles, Time to revenues, External risk.
> You GATHER EVIDENCE ONLY. You never assign or imply a factor score — the team scores.
> Distinguish a sourced fact from an inference. Never launder an estimate into a fact.
> Confidence scale per claim: "green" = significant, cross-checked; "orange" = some/weak; "red" = none (assumption).

## Phases

Workflow name `wtp-market-research`, five phases: **Scope**, **Search**, **Verify**, **Synthesize**, **Critique**. With 5 sub-questions and 12 verified claims that is up to 44 agents. That size is intended: the per-claim checks are what this tier is for, and the team asked for it by asking for this research.

### 1. Scope — one agent, low effort, schema `SCOPE`

> Research question: *‹question›*
> Decompose this into 2–5 FALSIFIABLE market sub-questions whose answers would let the team score the factor. Prefer sub-questions that map to the factor's guiding questions (e.g. for Market volume: current size in units AND money, growth rate, TAM/SAM/SOM). Where the factor involves sizing, include BOTH a top-down sub-question (analyst/industry reports) AND a bottom-up one (customer counts × spend), so the estimates can be triangulated. For each, state what evidence would answer it.

### 2. Search — one agent per sub-question, all in parallel, schema `FINDINGS`

> Sub-question (id *‹id›*): *‹question›*
> Evidence that would answer it: *‹evidence›*
> Search the web breadth-first, then fetch the most credible, recent, PRIMARY sources. Record the date of every figure. For any number, prefer figures you can corroborate across independent sources. Return findings with sources and a confidence flag each, plus what remains unknown. Mark is_quantitative=true for numeric claims.

Then collect all findings. Take the quantitative ones, drop duplicates (same claim text, ignoring case and surrounding spaces), and keep at most **12** for verification; say so if more were found.

### 3. Verify — a three-lens panel per claim, all in parallel, medium effort, schema `VERDICT`

A market figure can be wrong in three different ways, so each claim gets three **different** lenses, not three identical checkers. Run one agent per claim and lens (up to 12 × 3), all in parallel, so every figure gets a focused check of its own. Prompt:

> Quantitative claim under scrutiny: "*‹claim›*" (value: *‹value or n/a›*)
> Cited sources: *‹sources, or none›*
> Original research question: *‹question›*
> Examine this figure through ONE lens only — *‹lens›*
> Return trustworthy=true only if the figure holds up on YOUR lens; default to false when in doubt. If sources disagree, report the range.

The three lenses:
- **source** — SOURCE credibility: is this figure traceable to a credible, primary, independent source — not a content farm or a circular re-citation? Search to confirm. Untrustworthy if no credible independent source exists.
- **recency** — RECENCY / validity: how old is this figure and is it still valid today? Note its date. Untrustworthy if stale, or undated and likely outdated.
- **scope** — SCOPE match: does the figure measure the SAME thing the question asks — same segment, geography and definition (e.g. TAM vs SAM, global vs regional, units vs revenue)? Untrustworthy if it silently measures something else.

**Majority rule**, per claim, over the lenses that returned a verdict: if fewer than half rated it trustworthy (fewer than 2 of 3), lower its confidence one step (green → orange, orange → red) and attach the concerns of the lenses that rejected it. Attach the first range any lens reported.

### 4. Synthesize — one agent, high effort, schema `SYNTH`

> Research question: *‹question›*
> Here are the gathered findings (with post-verification confidence) as JSON: *‹all findings›*
> Open questions surfaced during search: *‹all still_unknown items›*
> Merge semantic duplicates, drop anything unsupported and unsourced, and produce a DISTILLED summary (~1–2k tokens): a one-line headline state-of-evidence (NO score), the consolidated findings each with confidence flag + sources (+ range where sources disagreed), and a prioritised "open questions / to validate" list (these become learning-journey items). Do NOT assign a factor score.

### 5. Critique — one agent, medium effort, schema `CRITIC`

> Research question: *‹question›*
> Here is the research summary produced so far: *‹synthesis›*
> Act as a completeness critic. What is MISSING? Consider: a sub-question never answered; a number resting on a single source; an angle not searched (regulation, substitutes, a key geography or segment); a claim still unverified. Return a short list of concrete gaps the team should close (they become extra open questions). Do not re-answer them — just name them.

## Return value

`opportunity`, `factor`, `question`, the synthesis fields (headline, findings, open questions), with the critic's gaps appended to the open questions and also returned as `completeness_gaps`, and `verified_numbers`: for each verified claim, the claim, how many lenses trusted it out of how many answered, its final confidence and range.

## Schemas

`SCOPE`:

```json
{
  "type": "object",
  "required": ["subquestions"],
  "properties": {
    "subquestions": {
      "type": "array", "minItems": 2, "maxItems": 5,
      "items": {
        "type": "object",
        "required": ["id", "question", "evidence_that_would_answer"],
        "properties": {
          "id": { "type": "string" },
          "question": { "type": "string" },
          "evidence_that_would_answer": { "type": "string" }
        }
      }
    }
  }
}
```

`FINDINGS`:

```json
{
  "type": "object",
  "required": ["subquestion_id", "findings", "still_unknown"],
  "properties": {
    "subquestion_id": { "type": "string" },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["claim", "is_quantitative", "sources", "confidence"],
        "properties": {
          "claim": { "type": "string" },
          "value": { "type": "string", "description": "the number/figure if quantitative, else empty" },
          "is_quantitative": { "type": "boolean" },
          "sources": { "type": "array", "items": { "type": "string" } },
          "confidence": { "type": "string", "enum": ["red", "orange", "green"] }
        }
      }
    },
    "still_unknown": { "type": "array", "items": { "type": "string" } }
  }
}
```

`VERDICT`:

```json
{
  "type": "object",
  "required": ["trustworthy", "note"],
  "properties": {
    "trustworthy": { "type": "boolean", "description": "true only if the figure holds up on THIS lens; default false when in doubt" },
    "note": { "type": "string", "description": "one-line reason / concern on this lens" },
    "range": { "type": "string", "description": "the spread if sources disagree, else empty" }
  }
}
```

`SYNTH`:

```json
{
  "type": "object",
  "required": ["headline", "findings", "open_questions"],
  "properties": {
    "headline": { "type": "string", "description": "one-line state of evidence; no score" },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["claim", "confidence", "sources"],
        "properties": {
          "claim": { "type": "string" },
          "confidence": { "type": "string", "enum": ["red", "orange", "green"] },
          "sources": { "type": "array", "items": { "type": "string" } },
          "range": { "type": "string" }
        }
      }
    },
    "open_questions": { "type": "array", "items": { "type": "string" } }
  }
}
```

`CRITIC`:

```json
{
  "type": "object",
  "required": ["gaps"],
  "properties": {
    "gaps": {
      "type": "array",
      "items": { "type": "string" },
      "description": "concrete missing pieces: an unanswered sub-question, a single-sourced number, an un-searched angle, an unverified claim"
    }
  }
}
```

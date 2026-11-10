---
name: customer-discovery
description: "This skill should be used to run synthetic customer interviews and draft a 'Compelling reason to buy' score for Worksheet 2 of the Market Opportunity Navigator. Triggers include 'synthetic customer interviews', 'draft a compelling-reason-to-buy score', 'simulate customer feedback for this opportunity', 'customer discovery for worksheet 2', 'what would customers think of this opportunity', 'interview synthetic personas about our offer'. It derives diverse, web-grounded, skeptical personas, role-plays an interview with each, and returns a PRELIMINARY draft score plus assumptions and a real-interview kit — directional only, never a substitute for getting out of the building."
argument-hint: "<opportunity> [value-prop]"
---

# Customer Discovery (experimental — "Framework plus")

Run **synthetic customer discovery** for one opportunity and produce a **preliminary draft** of Worksheet 2's **Factor 1 — Compelling reason to buy** from grounded, deliberately skeptical synthetic personas.

> **Experimental "Framework plus" — read this first.** Synthetic personas are, by default, **sycophantic and ungrounded**: an LLM will happily tell you your idea is great. This skill fights that (web-grounded personas, a skeptic/loyalist/laggard spread, explicit anti-agreeableness instructions), but its output is still a **PRELIMINARY DRAFT** to break the blank-page problem and **prep real interviews** — **not** a substitute for getting out of the building. **Real customer contact stays the gold standard. Keep the human in the loop.**

The skill **does output a draft score** (Low / Mid / High / Super High) and a proposed confidence colour — both for the team to **accept or override** — plus the load-bearing assumptions and an interview kit for the real conversations.

## How to run it — detect the engine first

**Step 0 — capability check.** Before anything else, check whether a **`Workflow`** tool is available on this surface. **IF yes (Claude Code)** → write and run the discovery workflow from the blueprint (Path A). **IF not (Cowork / Agent-SDK and other surfaces)** → run the in-skill fallback (Path B). Never block on the missing tool.

**What the team hears.** On Path B, say so in one plain sentence without tool names — e.g. *"This environment can't run the larger automated interview set-up, so I'll run the persona interviews myself, one after another — same goal, a bit more step by step."* Throughout, keep the machinery out of what you tell the team: no agents, subagents, runs, workflows, tools or what went wrong inside them — talk about personas, interviews and findings. If something failed, say only what it means for the result (e.g. "one persona is missing, so the picture is thinner").

### Path A — workflow written from the blueprint (Claude Code)

The plugin ships the interview set-up as a **blueprint**, not as a script: `references/workflow-blueprint.md` fixes the phases, prompts and output schemas. You write the workflow script from it and run it.

1. Read `references/workflow-blueprint.md` in full. If the `workflow-authoring` skill is listed, load it for the script API.
2. Fill the inputs (`opportunity`, and where known `application`, `customer`, `value_prop`) from the team's request and the worksheets.
3. Write the script from the blueprint and run it inline with `Workflow({ script: … })`. Keep the blueprint's phases, prompts and schemas as they are; the anti-sycophancy wording and the persona spread are what make the draft usable, so don't soften or shorten them. Running this workflow is what the team asked for by invoking this skill.
4. If `Workflow` refuses or the script fails, fix an obvious script error once; otherwise continue with Path B.

The workflow: (1) one grounded agent derives 4–6 **diverse** personas via web search — the **economic buyer separate from the user**, and a **skeptic, an incumbent-loyalist and a laggard**, not only the eager early adopter; (2) one agent **per persona** role-plays a realistic, **non-sycophantic** interview (real objections, status-quo inertia, "I already have a solution", budget reality); (3) one synthesis agent returns a **draft score**, an **honest, proposed red/orange/green confidence**, **rationale**, **key assumptions**, a **Mom-Test interview kit** and a **SYNTHETIC / directional-only** note.

### Path B — in-skill fallback (Cowork / Agent-SDK)

**Degrade gracefully** and reproduce the same flow yourself. Derive the customer personas per opportunity — there are no bundled customer-persona agents, and `persona-optimist` / `persona-skeptic` are idea/scoring-debate lenses, *not* customers.
1. Generate 4–6 **diverse, skeptical** personas (buyer vs. user; a skeptic, an incumbent-loyalist and a laggard), grounded with web search where you have it.
2. Interview each persona — as subagents where supported, otherwise **role-play each sequentially in-skill** — instructing each to resist agreeableness and voice real objections, switching barriers and budget reality.
3. Synthesise the same output: a **draft score**, an **honest, proposed** red/orange/green confidence, rationale, **key assumptions** to validate, and a 5–8 question **interview kit**. Keep each interview's full text for saving.

In-skill role-play shares one context, so the personas are less independent — treat the fallback as **lower rigor**.

## After it reports

1. Present the draft as a **starting point, not a verdict**: the proposed *Compelling reason to buy* score, the rationale, the diverging buyer-vs-user signals and the switching barriers. Propose a **red / orange / green** confidence colour with a one-line reason and ask about it as a separate question from the score. Say plainly, in chat and in files, that this is **synthetic-persona output — a directional assumption to validate with real people**, not research: never write "research shows" or "customers said" for it, and when you combine it with desk research, name each kind.
2. **Write it into the workspace.** By default, save the full persona profiles and interviews to `where-to-play/02_attractiveness-map/<opportunity>-customer-interviews.md`, its first line labelling it **SYNTHETIC** interview notes (not a scored opportunity sheet), and tell the team what was saved and where (if they'd rather not keep them, keep only the summary). In the Factor 1 section of `where-to-play/02_attractiveness-map/<opportunity>.md`, add under *Reasoning* `Proposed (synthetic): <score> · <colour> — <one-line reason>`, **labelled SYNTHETIC / DRAFT** and linked to the interviews file; leave the Score and Confidence fields for the team. Add the **key assumptions** to `where-to-play/assumptions.md`.
3. **Feed the revisit loop:** draft now → run the **interview kit** with **real customers** → re-score via the `attractiveness-map` skill. The team sets the final score, never this skill.

## Boundaries

- The draft score is **provisional and synthetic** — a prompt to learn, not a decision, and never a stand-in for real customer contact; the interview kit exists to get the team out of the building.
- Canonical terminology only: **Compelling reason to buy**; scores **Low / Mid / High / Super High**; confidence **red / orange / green**.

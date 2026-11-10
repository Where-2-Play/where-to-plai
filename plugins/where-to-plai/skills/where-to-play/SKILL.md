---
name: where-to-play
description: "This skill should be used to start and run the guided Market Opportunity Navigator / Where-to-Play process for a startup or innovation team (methodology by Sharon Tal & Marc Gruber). It is the entry point that kicks off the whole journey. Triggers include 'where should we play', 'which market should we enter', 'start the market opportunity navigator', 'guide us through where to play', 'apply the where to play framework', 'help us find our market', 'set up our navigator', 'we don't know which market to target'. Use it to set up the workspace and shepherd the team through all three worksheets, one gated step at a time."
argument-hint: "[optional: short description of your venture / technology]"
---

# Where to Play — guided Market Opportunity Navigator

Guide a startup or innovation team through the **Market Opportunity Navigator (MON)** by Sharon Tal & Marc Gruber like a facilitator who takes the team by the hand and guides them step by step. Set up the workspace, then move through the three worksheets **one phase at a time, confirming with the team before advancing.** The per-worksheet skills do the detailed work; this skill keeps the journey on track.

## The one non-negotiable principle

The Navigator is **not a strategy machine and not an auto-pilot.** It asks the cornerstone questions; the **team** supplies the answers and makes every real decision. Scoring (Worksheet 2) and the focus choice (Worksheet 3) **stay with the humans** — never auto-aggregate scores, never declare a "winning" market on the team's behalf. Surface evidence and trade-offs, then stop. The worksheets are a **shared language and a mirror**, not an oracle.

## How to run the guided process

Track progress with a todo list, one item per phase. The sequence is **not rigid** — a technology-push venture starts at Phase 3; a team with a market in mind can move quickly. But gently resist skipping the search: focusing from day one is a myth, and you will never know unless you look. **If the team asks to skip Worksheet 1, raise this first, before setting up files or evaluating anything:** say warmly why a short look at other applications and customers pays off (the first idea is rarely the best, and Worksheet 3 needs Backup and Growth options that usually come from that search), offer a quick version, then **stop and ask** whether they want it or prefer to go straight to the Attractiveness Map. Either answer is fine — let the team steer.

Each worksheet phase lists **helpers worth offering**. The team can't ask for what they don't know exists, so offer one when it would help, in one plain sentence that says what it does, not just its name ("I can also … — want me to?"). Offer, never auto-run; if they decline, carry on and don't nag.

### Phase 1 — Orient & understand the venture
Briefly explain the three steps and the non-negotiable principle (see `references/framework-overview.md`). Frame it warmly: a learning journey — sometimes frustrating, never a tidy pipeline — whose real payoff is the knowledge gathered. The goal now is to start, not to be certain; there is no crystal ball, and that is fine. In one or two sentences, mention that helpers are on hand and that you will offer each when it fits — among them an **advisory board** of five perspectives that review the map together and never score or pick a market: Tal & Gruber (method fidelity), Score Examiner (evidence), Jobs Analyst (jobs to be done), Beachhead Strategist (the first market to win), Risk Inverter (what could make it fail). The team can also ask for any of them directly. Keep it to that: no tool names, no full menu. Reflect back the team's description, or ask 2–3 short questions: what core technology / capability do you have, what do you do with it today, what triggered this question (new tech, stalled growth, fundraising). Do not start solving: no candidate markets, applications or customer ideas yet — those come from the team's search in Worksheet 1.

### Phase 2 — Set up the workspace
Confirm a location, then create `where-to-play/` in the user's project. From `${CLAUDE_PLUGIN_ROOT}/assets/templates/`, copy:
- `00_README.md` → `where-to-play/README.md`; `01_opportunity-set.md`, `02_map-overview.md`, `03_agile-focus.md` and `assumptions.md` → `where-to-play/` under the same names.
- Create an empty `where-to-play/02_attractiveness-map/` folder; the `attractiveness-map` skill later adds one file per opportunity from `02_attractiveness-map.md`.
- `workspace-CLAUDE.md` → `CLAUDE.md` in the project root (next to `where-to-play/`), so the ground rules hold when no Navigator skill is active. If a `CLAUDE.md` already exists, never overwrite it — ask, and offer to append the template's content instead.

These are **living documents**, revisited over time, not filled once.

### Phase 3 — Worksheet 1: Market Opportunity Set
Hand off to **`opportunity-set`**: de-link the venture's abilities, re-link them into a varied set of `application × customer` opportunities, screen down to ≈3–5. Return when the set is screened.
*Helpers to offer:* a wide brainstorm into distant industries and customers when the set feels thin (`opportunity-discovery`); a short debate — one voice pushes for bolder ideas, the other stress-tests the screening (`persona-optimist` / `persona-skeptic`).

### Phase 4 — Worksheet 2: Attractiveness Map
Hand off to **`attractiveness-map`**: evaluate each opportunity on Potential and Challenge across the six factors, gather evidence via `market-research`, place each in a zone. Every score and confidence colour is the team's call. Return when the map is populated.
*Helpers to offer:* desk research with sources on a factor (`market-research`); simulated customer interviews for a first, directional read on Compelling reason to buy, to check with real customers later (`customer-discovery`); a check of whether a proposed score fits the evidence (`score-examiner`); an optimist-vs-skeptic debate on a contested factor (`persona-optimist` / `persona-skeptic`); once the map is filled, an advisor panel reviewing it from different angles (`advisory-board`).

### Phase 5 — Worksheet 3: Agile Focus Strategy
Hand off to **`agile-focus`**: choose a Primary plus Backup and Growth options, assess relatedness, fill the dartboard. The focus choice is the team's. Return when the dartboard is set.
*Helpers to offer:* an advisor panel viewing the map and candidate Primary from different angles (`advisory-board`); a skeptic stress-testing the chosen Primary's risks before the team commits (`persona-skeptic`).

### Phase 6 — Wrap up & set the breathing cadence
Summarise what the team decided and what remains assumption (point at `where-to-play/assumptions.md`). The Navigator breathes: a constant companion, not a one-off snapshot. Agree a review cadence and fill in the next-review date in the **Breathing log** at the top of each worksheet; date every later update in its changelog so the team can always look back. *Helper to offer:* the **`revisit`** skill, when new evidence arrives or at the agreed cadence ("I can re-open the worksheets with what you've learned, keeping the earlier reasoning as history — want me to?"). Encourage the team to keep debating — "appreciate the process, not just the outcome" — but avoid paralysis by analysis.

## Boundaries

- Never fill the worksheets autonomously end-to-end, and never invent market facts — `market-research` gathers cited evidence and flags uncertainty.
- Synthetic customer interviews (`customer-discovery`) give a directional assumption to validate with real people — never call them research or write "customers said". When summarising evidence, name its kind: desk research (with sources), synthetic personas, or the team's own customer conversations.
- Off-topic questions: answer briefly, then steer back to the open Navigator step.
- The team can pause, jump phases or return any time — follow their lead, keep the todo list honest.
- **Keep it breathing.** Whenever the team surfaces new evidence — a customer conversation, a competitor move, fresh market data, a funding / team / regulatory change — *offer* the `revisit` skill there and then.

## Additional resources

- `references/framework-overview.md` — the three steps, five guiding principles, the "breathing" character.
- `references/glossary.md` — key terms (De-linking, Re-linking, the 6 factors, the 4 zones, relatedness, real options, …).
- `references/examples-index.md` — worked examples and which worksheet each illustrates (Augury, Inergio, Ceal are bundled).
- `references/adjacent-concepts.md` — related but out of scope (Value Proposition Canvas, Lean/Business Model Canvas).
- `references/examples/inergio-full-navigator.md` — a complete filled Navigator (all three worksheets).

---
name: advisory-board
description: This skill should be used to convene the experimental Where-to-Play advisory board — a panel of named advisor agents that review the current Worksheet 2 and/or Worksheet 3 and surface diverse perspectives, disagreements and assumptions to test. Triggers include "convene the advisory board", "advisory board review", "what would the board think", "get diverse perspectives on our worksheets", "review our where to play with the advisors", "panel review", "get a second opinion on our map". The board provokes — it never scores or picks a market.
argument-hint: "[ws2 | ws3 | both] [optional: a factor/opportunity to focus on]"
---

# Advisory Board (experimental — "Framework plus")

Convene a panel of advisor agents to review the team's worksheets from many angles at once, then synthesise where they agree, disagree, and what to test. This is a **sparring partner, not an oracle** — a mirror in your face, not a mirror of your own opinion: it exists to test the team's thinking, never to bless a decision already made. The board **provokes and informs; it never scores, ranks, or picks a Primary** — the team decides everything (human-in-the-loop). Every member is an AI lens, **not a real person**: the thinker lenses are anonymous experts named by their function.

## How to run it — detect the engine first

**Step 0 — capability check.** Before anything else, check whether a **`Workflow`** tool is available on this surface:

- **IF `Workflow` is available (Claude Code)** → run the bundled workflow (Path A).
- **IF `Workflow` is NOT available (Cowork / Agent-SDK and other surfaces)** → run the subagent-orchestrated board (Path B) and tell the team in one plain sentence, without tool names — e.g. *"This environment can't run the larger automated board set-up, so I'll call the advisors individually instead — same review, a bit more step by step."* Never block on the missing tool.

Both paths deliver the same output contract; Path A's consensus tally is schema-validated, Path B's is model-computed.

If the workspace is **empty** (no populated Worksheet 2), stop and advise the team to **fill in Worksheet 2 first** — the board reviews an existing analysis, it does not create one.

### Path A — Workflow (Claude Code)

Run the bundled workflow (ships with the plugin — no install step). Pass a **real object** for `args` (a JSON-encoded string also works):
```
Workflow({
  scriptPath: "${CLAUDE_PLUGIN_ROOT}/workflows/wf-advisory-board.js",
  args: { worksheet: "<ws2 | ws3 | both>", workspace: "where-to-play", focus: "<optional factor/opportunity>" }
})
```
It digests the worksheets, fans out the board in parallel, and returns the synthesis (consensus tally / agreements / disagreements / top assumptions to test / blind spots). Omitting `args.board` convenes all **five** members (see *The board*); for a subset pass an array of agent ids, e.g. `["where-to-plai:advisor-risk-inverter", "where-to-plai:advisor-tal-gruber"]`.

### Path B — subagent-orchestrated board (Cowork / Agent-SDK fallback)

Reproduce the same output by hand, in three phases:

**a. Digest.** Read `where-to-play/02_attractiveness-map/` and `where-to-play/02_map-overview.md` for WS2, `where-to-play/03_agile-focus.md` for WS3 (both for `both`). Produce a **faithful, compact digest per opportunity**: Overall Potential, Overall Challenge, zone, key open assumptions (plus Primary/Backup/Growth if WS3 is present). **Do not score or editorialise.**

**b. Board.** Spawn the members as **subagents via the Agent tool** — by default the same five, `subagent_type` ids `where-to-plai:advisor-tal-gruber`, `where-to-plai:score-examiner`, `where-to-plai:advisor-jobs-analyst`, `where-to-plai:advisor-beachhead-strategist`, `where-to-plai:advisor-risk-inverter`; a subset per `references/board.md`. Give each the digest and ask, **through its own lens**, for strengths, concerns, and assumptions to test. **Prefer PARALLEL dispatch** (several Agent calls in one turn) where supported; sequential is acceptable otherwise. **Each advisor runs in its own subagent context** — that independence is what makes the tally meaningful: a concern raised by many *separate* lenses carries weight because none saw the others' answers.

**c. Synthesis.** Yourself, summarise across the reviews, naming each member as "Name — lens": **agreements**; **disagreements** (name who diverges); **top assumptions to test**; **blind spots** (what no advisor raised but should be checked); and the **consensus tally** — merge semantically-equivalent concerns, count how many **distinct** advisors raised each, sort descending. The tally is a **weight-of-agreement signal on FINDINGS — never a score or a ranking of opportunities**.

## After the board reports

1. Present the synthesis: the consensus tally, agreements, genuine disagreements (and who diverges), top assumptions to test, and blind spots.
2. Write the surfaced assumptions into `where-to-play/assumptions.md` so they enter the learning journey.
3. Hand back. Any change to a score or to the Primary/Backup/Growth choice is the team's call — route re-scoring to `attractiveness-map` and focus changes to `agile-focus`.

## The board

The board has five members, each named with its lens:

- **Tal & Gruber — method fidelity** (`advisor-tal-gruber`)
- **Score Examiner — evidence check** (`score-examiner`)
- **Jobs Analyst — jobs to be done / disruption** (`advisor-jobs-analyst`)
- **Beachhead Strategist — beachhead / whole product** (`advisor-beachhead-strategist`)
- **Risk Inverter — inversion / risk** (`advisor-risk-inverter`)

Before convening, tell the team who is on the board and each lens in one short list. Use the same "Name — lens" labels in the synthesis so the team sees which perspective said what. Roster and the "anonymous experts, not copies of people" framing: `references/board.md`.

## Boundaries

- Experimental "Framework plus" feature — provocation, not verdict. The board's value is *perspective*, not a decision.
- Never let the board's output stand in for the team's judgement, and never present an advisor's view as a real person's actual opinion.

# Agents

The agentic decomposition of the Where-to-Play process. Nine subagents ship with the
plugin, in two groups: **five working agents** that do concrete process work on a worksheet,
and **four advisor agents** for the advisory board — experimental "Framework plus" lenses
that provoke the team's thinking.

Every agent is read-first and advisory. **None of them scores, aggregates, or decides.**
They ask questions, gather evidence, and argue cases; the team owns every factor score
(Worksheet 2) and the focus choice (Worksheet 3). This is deliberate — the plugin is not a
strategy machine (see the [plugin README](../plugins/where-to-plai/README.md)).

Agents are usually *offered* by the skills as they run — in one plain sentence, started only on
a yes — so you rarely invoke one by hand.
Claude Code also selects an agent automatically when your request matches its `description`
(for example, "argue the bull case for this opportunity" reaches `persona-optimist`). All
agents run on `model: inherit` and are read-only on your files: none can write to the
workspace. Their tool access is listed per agent below.

## Working agents

The five agents that carry a worksheet forward. Three are core to the method; the two
`persona-*` agents are marked **experimental "Framework plus"** in their own definitions.

### `opportunity-discovery`

**Lens/role.** Breadth-first divergence — the "LLM Opportunity Discovery Assistant." It
turns the venture's *de-linked* core abilities, taken as a whole, into a wide, varied set
of applications and the customer segments (and sub-segments) that may need each, deliberately
reaching into distant and non-obvious markets to fight the "one-trick pony" failure mode.
A patent is treated as protection, not an ability: it re-links from the function it protects.

**Worksheet.** Worksheet 1 (Market Opportunity Set) — reads `where-to-play/01_opportunity-set.md`
to avoid repeating applications or segments already in its tree.

**Tools.** `Read`, `WebSearch` (to surface adjacent industries that share the same
underlying function — not deep research).

**Output.** The Worksheet 1 tree — application → customer segment → optional sub-segment —
with 20–40 leaves at the same level of abstraction, separating buyer vs. user and leaving each
leaf's status blank for the team's screening, plus a short note on the most distant/surprising
picks and under-exploited abilities. It **proposes only** — screening and scoring belong to
the team.

### `market-research`

**Lens/role.** The "deep research" support for the Attractiveness Map. It gathers cited,
uncertainty-flagged evidence for **one opportunity and one factor at a time** — market
size/growth, willingness to pay, competition, adoption barriers, sales-cycle length — and
cross-checks every headline number against at least two independent sources.

**Worksheet.** Worksheet 2 (Attractiveness Map).

**Tools.** `Read`, `WebSearch`, `WebFetch`.

**Output.** A distilled (~1–2k token) summary that separates *what is evidenced* from *what
is inferred or unknown*, with an evidence colour per finding (🟢 cross-checked / 🟠 weak /
🔴 assumption), source citations that travel with the findings, ranges where sources disagree, and an explicit
"still unknown / to validate" list that distinguishes the *researchable* from the
*irreducibly uncertain*. **Evidence in, no scores out** — no factor score and no factor-level
confidence colour (the team sets both); never launders an estimate into a fact, and never
reports synthetic-persona output as research.

> The `market-research` *skill* wraps this agent as its portable fallback tier; on Claude
> Code it can instead call the bundled `wf-market-research` workflow. See
> [workflows.md](workflows.md).

### `score-examiner`

**Lens/role.** A neutral evidence check — "a mirror in the team's face, not a mirror
of their own opinion." After a factor score is proposed, the skill offers it; on a yes it
checks that score against the factor's guiding questions, the evidence on hand and the
opportunities already scored, surfaces the load-bearing assumption,
and applies consistency checks (consistent time horizon across factors, scores kept
*relative* to the other opportunities).

**Worksheet.** Worksheet 2 (Attractiveness Map) — reads the opportunity file under
`where-to-play/02_attractiveness-map/`, the proposed scores, `assumptions.md`, and any cited
research.

**Tools.** `Read`, `Glob` (to find the other scored sheets).

**Output.** A review table (Factor / Proposed / Concern / Load-bearing assumption /
Evidence / Suggested test) plus a note on which 1–3 scores are least supported — *which
assumption, if proven wrong, would sink the idea*. It checks both directions (too
generous **and** too harsh), keeps score language qualitative (low/mid/high/super-high,
never decimals), and **never outputs a "correct" score or an overall Potential/Challenge
value** — combination is qualitative and belongs to the team.

### `persona-optimist` — *experimental "Framework plus"*

**Lens/role.** The creative, divergent, optimistic voice. It argues the honest upside —
bolder re-linking, larger market framings, opportunities dismissed too fast — always with
reasons and explicit "this case holds only if …" conditions, not cheerleading.

**Worksheet.** Worksheet 1 idea generation and Worksheet 2 scoring debates.

**Tools.** `Read`.

**Output.** A short voiced argument for the expansive case, ending with what it would want
validated. It is **one voice in a human debate, never the decider**, and is deliberately
paired with `persona-skeptic` — that tension is the point. Its own definition warns it may
regress to generic optimism; treat it as provocation, never a recommendation.

### `persona-skeptic` — *experimental "Framework plus"*

**Lens/role.** The conservative, risk-focused counter-voice. It argues the honest downside —
weak compelling reason to buy, overstated markets, underestimated obstacles, external risk —
leading with the assumption that, if proven wrong, would cause the idea to fail.

**Worksheet.** Worksheet 1 screening, Worksheet 2 scoring debates, and a Worksheet 3
stress-test of the candidate Primary.

**Tools.** `Read`.

**Output.** A short voiced downside argument, ending with what evidence would change its
mind. It is deliberately paired with `persona-optimist`. Its definition warns it may be
reflexively negative and instructs it to be a *mirror* — acknowledging where the team's case
is genuinely strong — not blanket negativity. Like Optimist, it **never sets a score or
vetoes the Primary**.

## Advisory board (experimental "Framework plus")

Four `advisor-*` agents, each a distinct thinking lens for reviewing a filled worksheet.
Together with the Score Examiner they form the five-member board.

**Anonymous experts, not copies of people.** Three advisors are anonymous experts named by
their function — Jobs Analyst, Beachhead Strategist, Risk Inverter. Each works from an
established school of thinking and uses its concepts, books and quotes, but none is presented
as, or as speaking for, a real person. Each definition states this plainly ("an illustrative
and experimental lens, not a stand-in for any real person"). The `advisor-tal-gruber` agent is
grounded in the authors' own method but likewise "never claim[s] to be the literal Sharon or
Marc." Read these voices as provocations to sharpen thinking, not as verdicts or as anyone's
endorsement.

**How the board is convened.** Use the [`advisory-board` skill](skills.md) (or the
`/where-to-plai:advisory-board` command). On Claude Code it runs the
[`wf-advisory-board` workflow](workflows.md): an intake agent digests the worksheets, each
board member reviews through its lens in parallel, and a synthesis surfaces agreements,
disagreements, and the assumptions to test. **The board provokes — it never scores or picks
a market.**

**The board.** Five members, each labelled by the lens it brings: Tal & Gruber — method
fidelity, Score Examiner — evidence check, Jobs Analyst — jobs to be done / disruption,
Beachhead Strategist — beachhead / whole product, Risk Inverter — inversion / risk. The team
can convene a subset by naming members.

Every advisor is read-only (`tools: ["Read"]`, `model: inherit`) and reads the relevant
files under `where-to-play/`. Each returns a short, voiced take ending with the assumptions,
tests, or reconnaissance its perspective demands, and each closes on the same boundary: *one
voice among many — you counsel, the team decides; never assign a factor score or pick the
Primary.*

| Advisor | Lens it applies | Sharpest on |
|---|---|---|
| `advisor-risk-inverter` | "Invert, always invert," circle of competence, latticework of mental models, incentives | WS1/WS2/WS3: what would guarantee failure, and where do incentives quietly work against you? |
| `advisor-beachhead-strategist` | *Crossing the Chasm* — beachhead first, the chasm, bowling-pin adjacency, whole product | WS2 Market volume & WS3: is the Primary a true dominable beachhead or a fantasy TAM? |
| `advisor-jobs-analyst` | Jobs-to-be-Done, the milkshake/circumstance, disruption from below, non-consumption | WS1 applications & WS2 Compelling reason to buy: what job is this hired for, and is non-consumption the real competitor? |
| `advisor-tal-gruber` | The Where-to-Play method itself — a duo voice with two selectable lenses: **diverge** (Marc's expansive pole) and **focus** (Sharon's guarding pole) | Any worksheet: method-fidelity — are the worksheets a breathing process, did the team explore before narrowing, is the human genuinely deciding? |

`advisor-tal-gruber` is the method's own guardrail voice: it keeps the worksheets a living,
iterative learning process, defends the core value against scope sprawl, and insists the tool
must "never become a Where-to-Play machine that hands over answers." Ask for its `diverge`
mode when generating options (Worksheet 1) and its `focus` mode when narrowing
(Worksheets 2–3); left unspecified it applies both in balance.

## See also

- [skills.md](skills.md) — the skills that spawn these agents and gate each worksheet step.
- [workflows.md](workflows.md) — the three bundled Claude-Code workflows (`wf-market-research`,
  `wf-customer-discovery`, `wf-advisory-board`) that orchestrate agents into multi-step passes.

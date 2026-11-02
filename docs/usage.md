# Usage Guide

A full walkthrough of a Where-to-Play run — the "sit down and actually do it" guide, beyond the
command table in the plugin [README](../plugins/where-to-plai/README.md). It follows one venture
through all three worksheets, then into the breathing loop, the visual render, and shared-file
teamwork.

This plugin **is not a strategy machine.** At every real decision — which opportunities enter your
set, what score a factor gets, which market becomes your Primary — the skills gather evidence, ask
the cornerstone questions, and then **stop for your team to decide.** Scores are never
auto-aggregated; no market is ever picked for you. Keep that in mind throughout: the worksheets are
a shared language and a mirror, not an oracle.

## Getting started

Install the plugin (see the [README](../plugins/where-to-plai/README.md)), then start the guide:

```
/where-to-plai:where-to-play
```

You can pass a one-line description of your venture as an argument, or just run it bare and answer
the questions. The `where-to-play` skill is a **facilitator**: it explains the three steps and the
human-in-the-loop principle, asks two or three orienting questions (what core capability you have,
what you do with it today, what triggered the question), and then sets up your workspace.

### The `where-to-play/` workspace it scaffolds

After confirming a location, the guide creates a `where-to-play/` folder in your project, copies
in the worksheet templates, and writes a short `CLAUDE.md` into the project root:

```
CLAUDE.md                     # workspace ground rules (never overwritten if one exists)
where-to-play/
├── README.md                 # workspace map
├── 01_opportunity-set.md     # Worksheet 1
├── 02_map-overview.md        # Worksheet 2 — the map (all opportunities' placements)
├── 02_attractiveness-map/    # Worksheet 2 — one scored file per opportunity (starts empty)
├── 03_agile-focus.md         # Worksheet 3 — the dartboard
└── assumptions.md            # the running assumption list (Evidence × Importance)
```

The `CLAUDE.md` keeps the ground rules active even when no Navigator skill is running: the team
decides, off-topic questions get a brief answer and a nudge back to the open step, synthetic
interviews are never treated as real evidence. If your project already has a `CLAUDE.md`, the guide
asks and offers to append instead.

These are **living documents.** They are meant to be edited, revisited, and re-scored over time —
not filled once and filed away. Because they are plain Markdown in your project, they version in git
alongside everything else (see [team collaboration](#team-collaboration-through-shared-git-files)).

The guide then shepherds you through the three worksheets **one gated phase at a time**, tracking
progress on a todo list and confirming with your team before advancing. The sequence is logical but
not rigid: a technology-push venture can start at Worksheet 1's re-linking, and a team that already
has a market in mind can move quickly — but the guide will gently resist letting you skip the search
entirely, because "focusing from day one is a myth."

At each phase the guide **offers** the helpers that fit — research, simulated interviews, an
evidence check, a debate, the advisory board — in one plain sentence that says what each does. They
never run unasked; if you decline, it carries on.

## Commands vs. natural language

You never have to memorize the command list. Every step exists both as an explicit
`/where-to-plai:*` command **and** as an **auto-activating skill.** Describe your intent in plain
language and Claude Code selects the matching step:

- "help us pick a market" / "we don't know which market to target" → the `where-to-play` guide
- "brainstorm markets for our technology" → `opportunity-set` (Worksheet 1)
- "score this opportunity" / "the six factors" → `attractiveness-map` (Worksheet 2)
- "which market should be our primary" → `agile-focus` (Worksheet 3)
- "how big is this market" / "research the competition" → `market-research`
- "we learned something new, update the navigator" → `revisit`
- "visualize the worksheets like the web app" → `worksheet-view`

The explicit commands are useful when you know exactly which step you want; natural language is
better when you are mid-conversation and just describing what you need. Both routes land on the same
skills. The full command table is in the plugin [README](../plugins/where-to-plai/README.md); the
skills themselves are catalogued in [skills.md](skills.md).

## Worksheet 1 — generate and screen the opportunity set

Goal: a **broad, varied** set of opportunities, then a screen down to a handful. A market
opportunity is **one application × one customer segment (or sub-segment)**, tied together by a need. Worksheet 1 lives
or dies on breadth, so the skill coaches you to *look before you leap*.

The `opportunity-set` skill runs the classic two-move mechanic:

1. **De-link.** Describe your venture's core abilities **generically, separated from your current
   product** — know-how, technological functions, rare resources, existing strengths. The prompt is
   "what can we *do*", not "what do we *sell*". A patent is legal protection, not an ability; it is
   noted for Worksheet 2 instead. The abilities go in the upper part of `01_opportunity-set.md`.
2. **Re-link.** Taking the abilities as a whole, brainstorm **applications** first, then the
   **customer segments** that may need each one, and **sub-segments** where zooming in helps — an
   **application → segment → sub-segment tree** in the lower part of the worksheet. Deliberately
   reach for *distant* markets; 20–50 leaves is normal. Once the first applications are on the table,
   the skill offers the **`opportunity-discovery` agent** for a broad search in distant domains —
   your team curates what it returns.
3. **Pick the right abstraction level** ("continents vs. countries") so opportunities are
   comparable, then **screen** each **application × (sub-)segment** — never a whole application at
   once — with the four screening questions: is there a real need; can you serve it with your unique
   abilities *and better* than existing solutions; are there severe execution restrictions; does it
   fit your values? The skill gives a **recommendation** per opportunity; your team sets its status —
   **on the set / screened out / parked** — and every leaf stays in the tree. Aim for a
   **heterogeneous surviving set of ≈3–5.**

Dropping an option here is a **win, not a loss** — a cheap "no-go" now beats an expensive one later.
If the set feels thin or anchored on one industry, the skill offers a short two-sided debate
between the **`persona-optimist`** (push for bolder, more distant re-linking) and the
**`persona-skeptic`** (stress-test the screen) agents; these are the experimental "Framework plus"
lenses — they propose and provoke, your team still curates. When the set is named and screened, the
guide advances to Worksheet 2.

## Worksheet 2 — score on the six factors

Goal: evaluate **each** surviving opportunity on two dimensions and place it on the Attractiveness
Map. There is **one worksheet file per opportunity**, copied into `02_attractiveness-map/`.

- **Potential** (Y-axis, "value creation") = how big is this opportunity, regardless of your ability
  to capture it — Factors 1–3.
- **Challenge** (X-axis, "value capture") = how hard it will be for *you* to succeed and capture
  value — Factors 4–6.

### The six factors

**Potential**

1. **Compelling reason to buy** — will someone really want this and pay for it? A **necessary
   condition / potential No-Go**, so analyse it first. Only scoreable "through the eyes of your
   customers."
2. **Market volume** — how big is the market now, and how fast will it grow (units *and* money)?
3. **Economic viability** — is it worthwhile as a business (margins, ability to pay, stickiness)?

**Challenge**

4. **Implementation obstacles** — how hard to build the product, access the market, raise funding?
5. **Time to revenues** — how long until cash flow (dev time, market readiness, sales cycle)?
6. **External risks** — competition, ecosystem dependence, adoption barriers.

### How scoring runs — and where it stops

The skill first shows the six factors' guiding questions, so your team can say what to dig into.
Before proposing any score, it reads the opportunities already scored and compares factor by factor.
For each factor it brings evidence **with its sources** (by default, not only on request) and
proposes a score with a one-line reason, relative to the other opportunities. **Then it stops: your
team sets the score — and, as a separate question, the confidence colour.** After a proposed score it
can offer the **`score-examiner` agent**, a neutral evidence check against the rubric, the evidence
and the other opportunities. The skill **never sets a score and never averages.** Overall Potential and Overall Challenge are combined **qualitatively**
(discussed, not averaged), and the opportunity is placed in one of four zones:

| Zone | Potential | Challenge | Meaning |
|---|---|---|---|
| **Gold Mine** | high | low | ideal but rare |
| **Moon Shot** | high | high | high risk / high return |
| **Quick Win** | low | low | low risk / low return; a stepping stone |
| **Questionable** | low | high | usually avoid |

The midline sits at **Mid–High**: Low to Mid counts as low, High to Super High as high, so only an
overall Mid–High puts an opportunity on the line between two zones (Claude then names both).

Scores use a qualitative **Low → Mid → High → Super High** scale (plus the half-steps between levels), and each factor carries a
**confidence colour**: 🔴 red = no evidence, 🟠 orange = some evidence, 🟢 green = significant
evidence. Uncertainty belongs in the colour, not in a default "Mid": the skill proposes the level
the evidence points to, ends of the scale included. **Every red or orange statement becomes an entry
on the assumption list**
(`assumptions.md`), plotted by Evidence × Importance — that list is how the navigator knows what to
learn next.

Once two or more opportunities are scored, the skill **checks the spread of the set.** If they cluster
(say, every Potential factor Mid or below), it flags this and re-checks calibration — same time
horizon, anchors that fit your venture — before treating the cluster as a finding.

### When to pull in the support skills and agents

Worksheet 2 is where evidence matters most, so the skill offers several helpers here:

- **`market-research`** — when a factor rests on missing market facts (market volume, competition,
  TAM/SAM/SOM, economic viability), invoke it for **cited evidence that flags its own uncertainty**
  rather than bluffing. Each claim carries its source and an evidence colour; the factor-level
  confidence colour stays your team's call. It picks a research engine by capability; on Claude Code it can use the
  factor-tuned `wf-market-research` workflow that cross-checks every number across multiple sources.
  See [workflows.md](workflows.md) for the three research tiers.
- **`customer-discovery`** — for **Factor 1 (Compelling reason to buy)**, which is judged through the
  customer's eyes rather than by desk research. It derives diverse, skeptical, web-grounded personas
  (buyers vs. users, incumbents-loyalists, laggards — not just eager early adopters), role-plays an
  interview with each, and returns a **PRELIMINARY draft score** plus load-bearing assumptions and a
  Mom-Test interview kit. It saves the full interviews to
  `02_attractiveness-map/<opportunity>-customer-interviews.md` by default. It is **synthetic and
  directional** — a way to prep real interviews, never a substitute for getting out of the building,
  and never called research.
- **The advisory board** — once the map holds several opportunities, the skill offers the
  **`advisory-board`** for a multi-perspective review of the whole map — five members,
  each labelled by its lens. It surfaces
  disagreements and assumptions to test, but **never scores or picks a market.** Like the
  `persona-*` agents it is explicitly experimental "Framework plus" — the thinker lenses are
  anonymous experts, none is presented as a real person. See [agents.md](agents.md).

Before scoring an opportunity, the skill will **offer a coordinated research pass** — one batch that
gathers evidence across the factors up front. It asks explicitly; **if you decline, it goes straight
to the factor-by-factor walk** and research stays on-demand per factor. Research the riskiest
assumptions first, starting with Compelling reason to buy. When the map is populated, the guide
advances to Worksheet 3.

## Worksheet 3 — choose Primary / Backup / Growth and the dartboard

Goal: set strategic focus **without losing agility.** Choose one **Primary** opportunity to pursue
with full force, and hold **Backup** ("Plan B") and **Growth** options as **real options** — the
right, but not the obligation, to invest later. The output is the **Agile Focus Dartboard**.

The `agile-focus` skill structures the decision and surfaces trade-offs; it **does not pick the
Primary for you** — "focusing is about saying no," and that "no" belongs to your team. The same holds
for every call on the worksheet: each candidate's role, what to keep open, what goes into storage,
anything in parallel. The skill proposes with a one-line reason, asks, and waits. It walks these
steps:

- **Choose the Primary** from the Attractiveness Map. Recognise the map pattern (one clearly
  superior Gold Mine; a diagonal Quick-Win ↔ Moon-Shot trade-off; all clustered; or all
  Questionable). **Rule: the Primary must not sit in the Questionable zone.** Then apply the layers
  the map can't show, in order — **personal fit** (you have to love it), **fit with stakeholders'
  interests**, **resource constraints.** For this highest-stakes call the skill offers the
  `advisory-board`, or the `persona-skeptic` agent to stress-test the candidate before committing.
- **Find Backup and Growth candidates** — at least one of each, each with a proposed role (Backup,
  Growth, or both with a reason) that your team confirms. Any *new* candidate must be added to
  the set and scored in Worksheet 2 (colour-flagged as not-yet-assessed).
- **Assess relatedness** on two axes — **product relatedness** (shared tech competences, resources,
  networks) and **market relatedness** (shared values/brand, sales channels, word of mouth). Founders
  routinely check product relatedness and neglect market relatedness — a critical mistake.
- **Balance risk:** a good Backup is related **but must not share the Primary's major risks**, so it
  survives even if the Primary fails; a good Growth is as attractive and as tightly related as
  possible.
- **Set the investment level** per held option — **keep open** (default, ~5–10% of resources),
  **pursue now in parallel** (dangerous for early startups; only if the Primary is highly uncertain
  *and* the option is tightly related on both axes), or **place in storage.**

Finally, **fill the dartboard** in `03_agile-focus.md` from your team's decisions: **centre** =
Primary (plus any option pursued in parallel), **middle ring** = kept-open options, each tagged
Backup / Growth / both, **outer ring** = the rest in storage. The Primary is *pursue now* by default,
so it is not repeated among the candidates.

If every opportunity sits in Questionable, or you don't yet trust the map, there is no Primary yet.
The skill asks whether to go back to Worksheet 1, prioritise learning, or both. In **learning mode**
it lists each opportunity's open assumptions with a cheap next test; your team sets the order, and
Primary and dartboard stay *not yet chosen*. Then the guide wraps up: it summarises what your team decided, points at what
remains assumption, and sets the breathing cadence.

## The breathing loop — `revisit`

The Navigator **breathes.** Most startups change their initial market-entry decision within the
first few years, so the worksheets are a constant companion, not a one-off snapshot. Whenever new
evidence arrives — a customer conversation, a competitor move, fresh market data, a funding / team /
regulatory change — or simply on your agreed review cadence, run:

```
/where-to-plai:revisit
```

The `revisit` skill:

1. **Scans your project** for new inputs since the worksheets were last touched — new notes,
   interview transcripts, research files, data.
2. **Maps new evidence to assumptions** in `assumptions.md`, moving the Evidence × Importance
   positions and the confidence colours (🔴→🟠→🟢, or back).
3. **Flags what to revisit as a change-list** — old value, new evidence, implication — **without
   silently overwriting.** Prior scores and reasoning are kept as history so your team can see what
   changed and why.
4. **Hands the decisions back** — re-scoring routes to `attractiveness-map`, a change of
   Primary/Backup/Growth routes to `agile-focus`. It never auto-changes a score or a Primary.
5. **Records the breath** — dates the update, notes what triggered it, and updates the *Breathing
   log* line (Last reviewed / Next review) on each worksheet it touched.

A confirmed *or* refuted assumption is progress either way. "Not attractive anymore" is a valid,
valuable update — learning it now, before more sweat, tears and money, is a win.

## Rendering — `worksheet-view`

To present the filled Navigator, render it as a visual page set in the *exact visual language of the
Where-to-Play web app*:

```
/where-to-plai:worksheet-view
```

The `worksheet-view` skill is **presentation, not editing.** It is a one-way, read-only mirror: it
reads your `where-to-play/*.md` files, compacts them faithfully into a `wtp-data.json` (shortening
your own words to fit the app's fixed slots, never adding claims), and runs a deterministic Python
renderer to produce a small **`where-to-play/navigator/` folder** with four cross-linked pages —
**Overview / Worksheet 1 / Worksheet 2 / Worksheet 3**, including the map and the dartboard. The
pages are self-contained: open `navigator/overview.html` by double-click, no server, no network.

Because it never writes back to the worksheets, the `.md` files stay the **single source of truth**
and your team stays in the loop. Unfilled fields render as the app's faint placeholders, not as
guesses. Worksheet 1 shows the full application → segment → sub-segment tree with each leaf's
status; Worksheet 3 shows the Primary once. Rendering uses a bundled Python script that runs with
plain Python 3.9 or newer and installs nothing: its one dependency, Jinja2, ships with the plugin.

## Team collaboration through shared git files

The whole point of moving Where-to-Play out of single chatbot prompts is that your **context lives
as files in the project.** Everything the plugin produces — the opportunity set, the per-opportunity
scoring files, the map, the dartboard, the assumption list — is plain Markdown under
`where-to-play/`, so:

- **Your team works on shared documents**, not a disposable chat transcript. Commit `where-to-play/`
  to git and everyone sees the same living worksheets.
- **Every change is reviewable.** Because `revisit` appends history rather than overwriting, the git
  log plus the in-file Breathing logs give you a full record of *what changed, when, and why* — the
  navigator shows its own learning journey.
- **Decisions stay with the humans.** The files are the audit trail of your team's judgement; the
  plugin only ever proposes, gathers evidence, and asks the cornerstone questions.

Because the worksheets are just files, they diff, branch, and merge like any other project artifact
— which is exactly what makes the breathing loop practical across a team over time.

## See also

- [skills.md](skills.md) · [workflows.md](workflows.md) · [methodology.md](methodology.md)

# Skills

The **9 skills** are the conceptual layer the plugin applies itself — the framework knowledge and
process logic that turns the Market Opportunity Navigator (MON) / *Where-to-Play* methodology by
Sharon Tal & Marc Gruber into guided, file-based work. One skill is the entry-point guide, three
map one-to-one onto the three worksheets, and five are cross-cutting supports for research,
review, longitudinal updates, and visualization.

Every skill is both a **slash command** and **auto-activating**. You can invoke a step explicitly
with `/where-to-plai:<name>`, or simply describe your intent in plain language ("help us pick a
market", "score this opportunity", "how big is this market") and Claude Code selects the matching
skill from its trigger phrases — you don't have to memorize the commands. Each skill's frontmatter
`description` carries those triggers.

Across all of them, one stance holds: **this is not a strategy machine.** The skills ask the
cornerstone questions, gather evidence, and surface trade-offs, then **stop and let the team
decide.** No skill ever auto-aggregates scores or picks a market — human-in-the-loop is preserved.

## The skills at a glance

| Skill / command | Serves | Role |
|---|---|---|
| `/where-to-plai:where-to-play` | all three worksheets | entry-point guide; scaffolds the workspace |
| `/where-to-plai:opportunity-set` | Worksheet 1 | generate & screen the opportunity set |
| `/where-to-plai:attractiveness-map` | Worksheet 2 | score on the six factors, place in a zone |
| `/where-to-plai:agile-focus` | Worksheet 3 | choose Primary/Backup/Growth, fill the dartboard |
| `/where-to-plai:market-research` | Worksheet 2 support | cited, uncertainty-flagged market evidence |
| `/where-to-plai:customer-discovery` | Worksheet 2, Factor 1 | synthetic interviews → draft score *(experimental)* |
| `/where-to-plai:advisory-board` | Worksheet 2 / 3 review | multi-perspective provocation *(experimental)* |
| `/where-to-plai:revisit` | all worksheets | the longitudinal "breathing" loop |
| `/where-to-plai:worksheet-view` | all worksheets | render the Navigator as visual HTML pages |

## The guide

### `where-to-play` — guided Market Opportunity Navigator

`/where-to-plai:where-to-play`

**The entry point that kicks off the whole journey.** It runs a team through the Navigator as a
guided, multi-phase process — like a facilitator taking the team by the hand step by step. It does
the two things the per-worksheet skills don't: it **sets up the workspace** (Phase 2 creates a
`where-to-play/` folder and copies in the templates — `00_README`, `01_opportunity-set`,
`02_map-overview`, `03_agile-focus`, `assumptions`, plus an empty `02_attractiveness-map/` folder,
and writes a workspace `CLAUDE.md` next to it so the ground rules hold even when no Navigator skill is
active — an existing `CLAUDE.md` is never overwritten; the guide asks and offers to append instead),
and it **shepherds the team through all three worksheets one gated phase at a time**, confirming
before advancing and handing the detailed work off to `opportunity-set`, `attractiveness-map`, and
`agile-focus` in turn. Each phase names the **helpers worth offering** there; the guide offers them in
one plain sentence and never runs them unasked. Phase 6 wraps up and sets the "breathing" cadence,
pointing at `revisit`.

**Auto-activates on** intent to *start* the process: "where should we play", "which market should
we enter", "start the market opportunity navigator", "help us find our market", "we don't know
which market to target".

**Bundled references:** `references/framework-overview.md` (the three steps + five guiding
principles + the "breathing"/longitudinal character), `references/glossary.md` (key terms),
`references/examples-index.md` (catalogue of the worked examples), `references/adjacent-concepts.md`
(related-but-out-of-scope frameworks so teams don't conflate them), and a complete filled Navigator
at `references/examples/inergio-full-navigator.md`.

## Worksheet 1 — Market Opportunity Set

### `opportunity-set`

`/where-to-plai:opportunity-set`

Builds a **broad, varied set** of market opportunities, then screens it down. A market opportunity =
**one application × one customer segment (or sub-segment)**, tied by a need. The skill runs the
framework's core mechanic — **de-link** the venture's core abilities from its current product
(describe what it can *do*, generically; a patent is protection, not an ability), then **re-link**
the abilities as a whole into an **application → segment → sub-segment tree** — pushing for a
deliberately large brainstorm (20–50 leaves is normal). It then screens **each application ×
(sub-)segment** with the **four screening questions** *with* the team and gives a **recommendation**
per opportunity; the team sets each leaf's status (**on the set / screened out / parked**), aiming
for a heterogeneous set of **≈3–5**. Screened-out and parked leaves stay in the tree. It offers the
`opportunity-discovery` agent for a broad search and a `persona-optimist` / `persona-skeptic` debate
when the set feels thin — each in one plain sentence, only on a yes.

**Auto-activates on:** "worksheet 1", "market opportunity set", "de-link our abilities", "re-link to
applications", "brainstorm markets", "what markets could we serve", "generate opportunities for our
technology".

**Bundled references:** `references/worksheet-1-spec.md` (the full normative spec: de-/re-linking,
abstraction level, the four screening questions, pitfalls, Innovator's-DNA discovery skills) and
`references/examples/ceal-ws1.md` (a real filled Worksheet 1 as a few-shot reference).

## Worksheet 2 — Attractiveness Map

### `attractiveness-map`

`/where-to-plai:attractiveness-map`

Evaluates **each opportunity** (one worksheet per opportunity) on two dimensions — **Potential**
(value creation, Y-axis, factors 1–3) and **Challenge** (value capture, X-axis, factors 4–6) — and
places it in one of four zones: **Gold Mine / Moon Shot / Quick Win / Questionable**. It walks the
**six factors** (Compelling reason to buy · Market volume · Economic viability · Implementation
obstacles · Time to revenues · External risks), scores each on the qualitative scale **Low → Mid →
High → Super High**, and marks **confidence per factor** (🔴 no evidence / 🟠 some / 🟢 significant).
It is the strictest expression of the non-negotiable: it **never sets scores and never
auto-aggregates.** It opens with the six factors' guiding questions, offers a coordinated research
pass (declinable), and compares each opportunity with those already scored. For each factor it brings
evidence **with sources by default**, proposes a score with a one-line reason relative to the other
opportunities, then **stops: the team sets the score, and — as a separate question — the confidence
colour.** Uncertainty goes in the colour, not in a default "Mid"; once two or more opportunities are
scored, it checks the spread of the set for clustering. It composes Overall Potential / Overall
Challenge qualitatively (never an average) and builds the Evidence × Importance assumption map. It
names the kind of each piece of evidence — desk research, synthetic personas, the team's own
conversations — and never calls synthetic-interview output research. Helpers (`market-research`,
`customer-discovery`, the `score-examiner` evidence check, a `persona-optimist`/`persona-skeptic`
bull/bear debate, the `advisory-board`) are offered in one plain sentence, not run unasked.

**Auto-activates on:** "worksheet 2", "attractiveness map", "score this opportunity", "potential and
challenge", "the six factors", "compelling reason to buy", "market volume", "gold mine moon shot
quick win".

**Bundled references:** `references/worksheet-2-spec.md` (the full normative spec — rules, all
guiding questions and sub-probes, the four zones, validation, the optional Worksheet 2B
"Where-to-Impact"), `references/six-factors.md` (the six factors with verbatim headline questions for
quick reference), and `references/examples/augury-ws2.md` (the real scored Augury case as a few-shot
reference).

## Worksheet 3 — Agile Focus Strategy

### `agile-focus`

`/where-to-plai:agile-focus`

Sets strategic focus **without losing agility**: choose one **Primary** opportunity to pursue with
full force, and hold **Backup** ("Plan B") and **Growth** options as **real options** — the right,
not the obligation, to invest later. Output is the **Agile Focus Dartboard** (centre = Primary,
middle ring = kept-open Backup/Growth, outer ring = storage). The skill structures the highest-stakes
convergent call — choosing the Primary from the Worksheet 2 map plus the judgement the map can't show
(personal fit, stakeholder interests, resource constraints) — but **does not pick the Primary for the
team** — nor any other call on the worksheet. It assesses **relatedness** on two axes (product *and*
market — teams routinely neglect market relatedness), balances Backup risk so it survives even if the
Primary fails, and proposes each candidate's role (Backup / Growth / both) and investment level (keep
open / pursue now in parallel / place in storage) with a one-line reason; the team decides each.
Every kept-open option carries its Backup or Growth tag, and the Primary is *pursue now* by default, so
it is not repeated among the candidates. When no option can be Primary yet, **learning mode** lists
the open assumptions per opportunity with a cheap next test, and the team sets the order. Before the
team commits, it offers the `advisory-board` or a `persona-skeptic` stress-test of the candidate
Primary.

**Auto-activates on:** "worksheet 3", "agile focus", "which market should be our primary", "backup
and growth options", "agile focus dartboard", "market relatedness", "keep options open", "choose our
primary market".

**Bundled references:** `references/worksheet-3-spec.md` (verbatim author quotes, the three
decision-timing triggers for finalising the Primary, the four map patterns, relatedness sub-questions,
pitfalls, and worked examples). A complete filled dartboard also appears in the `where-to-play`
skill's `references/examples/inergio-full-navigator.md`.

## Cross-cutting supports

### `market-research` — Worksheet 2 evidence

`/where-to-plai:market-research`

The "deep research" support for the Attractiveness Map. It gathers **cited, uncertainty-flagged**
market evidence per opportunity/factor and writes it into the workspace with an **evidence colour per
claim** and its source — it **collects evidence, it does not set scores or the factor-level confidence
colour** (the team sets both on Worksheet 2; the skill may propose a colour). Sources are shown with
the findings by default. The skill is
**capability-driven**: it first checks whether the Claude Code `Workflow` tool exists on this surface,
then picks one of **three tiers** — Tier 1 (the bundled `market-research` subagent, the portable
fallback when `Workflow` is absent), Tier 2 (the built-in `deep-research` workflow for broad open
questions), or Tier 3 (the bundled `wf-market-research.js`, factor-tuned for **Market volume** and
**Economic viability**, cross-checking every number across ≥2 sources). Flags `--deep` (Tier 2) and
`--wtp` (Tier 3) override the default when the team is explicit. On the fallback it tells the team in
one plain sentence, without tool names. See [workflows.md](workflows.md) for
the full tier model.

**Auto-activates on:** "research this market", "how big is this market", "find evidence for market
volume", "research the competition", "TAM SAM SOM for this opportunity", "who are the competitors",
"deep research this factor".

**Bundled references:** `references/research-guide.md` (how to brief the engine per factor,
source-quality and cross-checking rules, the evidence colours, the "surface uncertainty, don't
bluff" principle, and tier selection). The Tier-3 workflow source is at
`../plugins/where-to-plai/workflows/wf-market-research.js`.

### `customer-discovery` — draft Factor-1 score *(experimental)*

`/where-to-plai:customer-discovery`

**Experimental "Framework plus".** Runs **synthetic customer discovery** for one opportunity and
produces a **preliminary draft** of Worksheet 2's Factor 1 — *Compelling reason to buy* — from
deliberately skeptical, web-grounded synthetic personas. It exists to fight the default failure mode
(an LLM will happily tell you your idea is great): it derives 4–6 **diverse** personas that separate
the economic **buyer from the user** and include a **skeptic, an incumbent-loyalist, and a laggard**,
role-plays a **non-sycophantic** interview per persona, and synthesises a **draft score** (Low / Mid
/ High / Super High) with a proposed red/orange/green confidence colour (asked as a separate
question), load-bearing assumptions, and a Mom-Test interview kit. By default it saves the full
personas and interviews to `02_attractiveness-map/<opportunity>-customer-interviews.md`, labelled
SYNTHETIC, and adds the draft under the factor's *Reasoning* — the Score and Confidence fields stay
for the team. It *does* output a draft score — but it is **directional only, a prompt to prep real interviews, never a substitute for getting out of the
building.** It is never called research. The team accepts or overrides; final (re)scoring routes back to `attractiveness-map`. It
is capability-driven (Path A via the bundled `wf-customer-discovery.js` workflow when `Workflow`
exists; a lower-rigor in-skill role-play fallback otherwise).

**Auto-activates on:** "synthetic customer interviews", "draft a compelling-reason-to-buy score",
"simulate customer feedback for this opportunity", "customer discovery for worksheet 2", "what would
customers think of this opportunity".

**Bundled references:** none in a `references/` folder; the flow is driven by the bundled
`../plugins/where-to-plai/workflows/wf-customer-discovery.js` workflow.

### `advisory-board` — multi-perspective review *(experimental)*

`/where-to-plai:advisory-board`

**Experimental "Framework plus".** Convenes a panel of named advisor agents to review the current
Worksheet 2 and/or Worksheet 3 from many angles at once, then synthesises where they agree, disagree,
and what to test. It is a **sparring partner, not an oracle** — a mirror in your face, not a mirror of
your opinion. It **never assigns a score or picks the Primary.** Each member is an AI lens — **not a real
person**; the thinker lenses are anonymous experts named by their function (a board of five, each
labelled by its lens: Tal & Gruber — method fidelity, Score Examiner — evidence check, Jobs Analyst —
jobs to be done / disruption, Beachhead Strategist — beachhead / whole product, Risk Inverter —
inversion / risk). Capability-driven: Path A runs the bundled
`wf-advisory-board.js` workflow (deterministic parallel fan-out, schema-validated consensus tally)
when `Workflow` exists; Path B reproduces the same three-phase output contract (digest → parallel
board → synthesis) via subagents otherwise. If Worksheet 2 is empty it stops and advises filling it
first — the board reviews an existing analysis, it does not create one. See [agents.md](agents.md) for
the roster.

**Auto-activates on:** "convene the advisory board", "advisory board review", "what would the board
think", "get diverse perspectives on our worksheets", "panel review", "get a second opinion on our
map".

**Bundled references:** `references/board.md` (the roster, each advisor's lens, and the "anonymous
experts, not copies of people" framing).

### `revisit` — the breathing loop

`/where-to-plai:revisit`

The longitudinal "breathing" companion. It re-opens the worksheets when new information puts the
current strategy in doubt — new customer interviews or market data, a confirmed or refuted assumption,
low runway, a looming branding decision, or a periodic review cadence. It **scans the project for new
inputs**, maps new evidence onto `assumptions.md` (moving Evidence × Importance positions and
confidence colours), and flags the scores (WS2) and focus choices (WS3) the evidence calls into
question — presented as a **change-list** with old value, new evidence, and implication. Crucially it
**never silently overwrites prior judgement**: it appends history and hands the actual re-scoring back
to `attractiveness-map` and focus changes to `agile-focus`. It records the "breath" (dates the update,
sets Last/Next reviewed).

**Auto-activates on:** "revisit our where to play", "we learned something new", "update the
navigator", "re-evaluate our opportunities", "new customer interviews", "should we change our primary
market", "our assumptions changed", "breathe the worksheets".

**Bundled references:** `references/revisit-guide.md` (the re-evaluation triggers, the assumption-map
mechanics, and how to keep score history without overwriting).

### `worksheet-view` — render the Navigator

`/where-to-plai:worksheet-view`

Renders the team's filled worksheets as a set of **self-contained, read-only HTML pages** that look
exactly like the Where-to-Play web app (using the real app's HTML, CSS, fonts, and images). It is
**presentation, not editing** — the `.md` files stay the single source of truth; it never changes a
worksheet, scores anything, or invents content. The design is two stages: **①** the skill compacts
the worksheets into a `wtp-data.json` (reading + judgement, fitting the app's fixed slots), then **②**
a deterministic bundled Python renderer maps that JSON to the app's exact markup. Output is a
`where-to-play/navigator/` folder of four cross-linked pages — **Overview / WS1 / WS2 / WS3** — that
open by double-click, no server. Empty fields stay empty (rendered as the app's faint placeholders).
WS1 shows the whole application → segment → sub-segment tree with each leaf's status (on the set /
screened out / parked); WS3 shows the Primary once, not again as a candidate. Synthetic interview
files (`*-customer-interviews.md`) are skipped.

**Auto-activates on:** "visualize the worksheets", "render the navigator", "show our results like the
web app", "present the where-to-play worksheets as HTML", "make the navigator page", "show the
dartboard and map".

**Bundled references / renderer:** `renderer/schema.md` (the precise `wtp-data.json` schema and the
enum→markup mapping), `renderer/wtp-data.example.json` (a complete worked example to copy the shape
from), and `renderer/render.py` + `renderer/templates/` + `renderer/static/` (the deterministic
renderer carrying the real app's HTML/CSS/fonts/images). It runs with plain `python3 render.py …`
(Windows: `py`, Python 3.9+); its Jinja2 dependency ships in `renderer/_vendor/`, so nothing is installed.

## See also

- [agents.md](agents.md) — the working agents and the experimental advisory board these skills invoke
- [workflows.md](workflows.md) — the three bundled workflows and the market-research tier model
- [methodology.md](methodology.md) — the framework each worksheet maps to
- [usage.md](usage.md) — a full worked run, worksheet by worksheet

# Workflows

Three skills orchestrate multi-agent runs that plain skills cannot: parallel fan-out, per-agent
structured schemas, and fixed post-processing rules (de-duplication, caps, the majority rule). In Claude Code they do this with the
`Workflow` tool.

> **Why there are no workflow scripts in the plugin.** Anthropic's plugin directory currently
> accepts workflow scripts (`workflows/*.js`) only from Verified organizations, so we removed
> the three pre-built scripts. Each workflow now ships as a **blueprint** instead: a Markdown page
> in the skill's `references/workflow-blueprint.md` that fixes the phases, agents, prompts and
> output schemas. When the skill needs the workflow, Claude writes the script from the blueprint
> and runs it in the session. We are working on bringing the pre-built scripts back.

A workflow is never the entry point. The **skill** is: it runs the capability check, briefs the
right question, writes and runs the workflow, and writes the result into the `where-to-play/`
workspace.

## How a skill runs a workflow

1. The skill reads its `references/workflow-blueprint.md` (and, where available, Claude Code's
   `workflow-authoring` skill for the script API).
2. It fills the blueprint's inputs from the team's request and the worksheets.
3. It writes the script and runs it inline with `Workflow({ script: … })`, keeping the blueprint's
   phases, agents, prompts and schemas as they are.
4. If `Workflow` is missing, refuses or fails, the skill falls back (market research: to Tier 2,
   then to the Tier 1 subagent; the other two: to their Path B, see below), so the team always gets
   a result.

A script written at run time is less deterministic than a pre-built one: the phases and prompts
are fixed by the blueprint, but the code around them is new each time.

## Market research (Tier 3)

WtP-tuned deep research for a **Worksheet 2 factor** — the evidence engine behind the
Attractiveness Map. It gathers and cross-checks market evidence but **never assigns a score**; the
team scores. A shared framing block is prepended to every agent prompt so each stays
on-method (evidence only, sourced fact vs. inference, the red/orange/green confidence scale).

Five phases:

1. **Scope** — one low-effort agent decomposes the factor into 2–5 *falsifiable* market
   sub-questions. Where the factor involves sizing, it deliberately produces both a top-down
   sub-question (analyst/industry reports) and a bottom-up one (customer counts × spend) so the
   estimates can be triangulated.
2. **Search** — one search agent per sub-question, **in parallel**, each searching breadth-first
   then fetching credible primary sources, dating every figure, and returning findings with
   sources, a confidence flag, and an `is_quantitative` flag.
3. **Verify** — the quantitative claims are de-duplicated and capped (at 12), then checked by
   a **perspective-diverse three-lens panel** per claim: a *source-credibility* lens, a
   *recency/validity* lens, and a *scope-match* lens, one agent each, all run in parallel. A figure
   that fails the majority of its lenses has its confidence downgraded a notch (green→orange, orange→red) and
   carries the concerns forward. Three *different* lenses, not N identical refuters, because a
   market number can be wrong in three distinct ways.
4. **Synthesize** — a high-effort agent merges semantic duplicates, drops the unsupported and
   unsourced, and produces a distilled cited summary: a one-line headline state-of-evidence (no
   score), consolidated findings with confidence flags and ranges, and a prioritised
   open-questions list.
5. **Critique** — a completeness critic names what is still missing (an unanswered sub-question, a
   single-sourced number, an un-searched angle) and feeds those gaps into the open-questions list.

Invoked by the **[`market-research`](skills.md)** skill as **Tier 3** — see the tier model below.

## Advisory board

Convenes the experimental "Framework plus" advisory board over the team's **Worksheet 2 and/or
Worksheet 3**. The board *provokes* — it surfaces agreements, disagreements and assumptions to
test — but **never scores or picks a market**. Its inputs are the worksheet (`ws2` / `ws3` /
`both`), the `workspace` path, an optional `focus`, and optionally a subset of the five members.

Three phases:

1. **Intake** — a low-effort agent reads the worksheet files and produces a faithful, compact
   digest (each opportunity's Overall Potential / Overall Challenge / zone / key assumptions, plus
   the Primary/Backup/Growth choices if Worksheet 3 is present). If it finds no populated
   worksheets, the workflow returns a clear "fill in the worksheets first" message rather than
   crashing — the board reviews an existing analysis, it does not create one.
2. **Board** — every board member reviews **in parallel**, each as its own subagent
   (`agentType`), through its own lens, returning strengths, concerns and assumptions to test. The
   board is five members, each labelled "Name — lens": Tal & Gruber — method fidelity,
   Score Examiner — evidence check (`score-examiner`), Jobs Analyst — jobs to be done /
   disruption, Beachhead Strategist — beachhead / whole product, Risk Inverter — inversion / risk.
   A subset can be convened on request; the synthesis names members by the same labels. The thinker
   lenses are anonymous experts; none is presented as a real person.
3. **Synthesis** — a high-effort chair agent merges semantically-equivalent findings into a
   **consensus tally** (how many *distinct* advisors independently raised each concern — a
   weight-of-agreement signal on findings, explicitly *not* a score or a ranking of
   opportunities), plus agreements, disagreements (naming who diverges), the top assumptions to
   test, and blind spots no advisor raised.

The independence of each advisor's subagent context is what makes the tally meaningful: recurrence
across separate lenses carries weight because none saw the others' answers.

Invoked by the **[`advisory-board`](skills.md)** skill (Path A).

## Customer discovery

Runs **synthetic, skeptical customer discovery** for a Worksheet 2 opportunity and proposes a
**DRAFT score for Factor 1 (Compelling reason to buy)**. Explicitly synthetic and directional — a
provisional draft to prep real interviews, never a substitute for getting out of the building.
Its inputs are the `opportunity`, plus optional `application`, `customer`, `value_prop` and
`workspace`.

Three phases:

1. **Personas** — one web-grounded agent derives 4–6 **diverse** personas, searching for the real
   segment roles, pains, incumbents and budget realities. Diversity is required: it separates the
   economic **buyer** from the **user**, and includes a **skeptic**, an **incumbent-loyalist** and
   a **laggard** — not only the eager early adopter. If no personas can be derived it returns a
   clear error asking for at least an opportunity description.
2. **Interviews** — one agent **per persona, in parallel**, role-plays a realistic interview. The
   prompt explicitly instructs the agent to resist LLM sycophancy: voice real objections,
   status-quo inertia and switching costs, the "I already have a good-enough solution" reflex, and
   budget reality — and to call the reason to buy compelling only if it genuinely would be.
3. **Synthesis** — one high-effort agent distils a `draft_score` (Low / Mid / High / Super High)
   the human may accept or override, a **proposed, honestly judged** red/orange/green confidence
   colour the team accepts or changes (synthetic-only is typically orange), the rationale, the load-bearing assumptions to validate
   with real customers, and a 5–8-question **Mom-Test interview kit** about the customer's world
   and past behaviour. The result is stamped with a SYNTHETIC / directional-only note: persona
   output is an assumption to validate with real people, never research. The skill saves the full
   interviews to `02_attractiveness-map/<opportunity>-customer-interviews.md` by default.

Invoked by the **[`customer-discovery`](skills.md)** skill (Path A). Note there are no bundled
customer-persona agents — the personas are derived dynamically per opportunity — so the fallback
generates them in-skill rather than spawning fixed agent ids.

## Claude Code only, with graceful fallback

The `Workflow` tool is **Claude Code only**. On other Agent Skills surfaces (Cursor, Codex CLI,
the Claude Agent SDK, some Cowork surfaces) it does not exist. Every invoking skill therefore does
a **capability check first** — *is the `Workflow` tool available on this surface?* — and that one
fact, not stakes or surface guesswork, picks the engine. On a fallback the skill tells the team in
one plain sentence, without tool names. The plugin never hard-depends on a Claude-Code-only
feature.

- **`advisory-board`** — Path A runs the board workflow; **Path B** reproduces the *same output
  contract* by spawning the advisor agents directly as subagents (a model-computed tally instead
  of the workflow's schema-validated one).
- **`customer-discovery`** — Path A runs the discovery workflow; **Path B** reproduces the same
  flow without the workflow: personas are derived in-skill and interviewed as subagents where
  supported, otherwise role-played one after another in-skill. Shared-context role-play gives
  less persona independence and is treated as lower rigor.
- **`market-research`** — falls back to its bundled subagent (see the tier model).

### Market research: the three tiers

The `market-research` skill picks its engine by capability, then by factor:

1. **Tier 1 — bundled subagent.** The `market-research` agent, spawned via the Agent tool. This is
   the **fallback** when `Workflow` is absent — **portable**, works on any Agent Skills surface.
   It is not the everywhere default; it is used only when the workflow engines genuinely do not
   exist.
2. **Tier 2 — built-in `deep-research` workflow.** Broad, adversarially-verified web research,
   **Claude Code only**. The default for broad/open questions and for the factors that are not
   number-heavy (Time to revenues, Implementation obstacles, External risks, competitor landscape,
   general context). Called with a single **string** prompt.
3. **Tier 3 — the WtP research workflow.** Factor-tuned, cross-checks every number through the
   three lenses, **Claude Code only**, written by Claude from the skill's blueprint. It applies to
   **exactly two factors — Market volume and Economic viability**.

When `Workflow` is available the skill defaults to Tier 3 for the two quantitative factors and
Tier 2 otherwise; the `--wtp` flag forces Tier 3 and `--deep` forces Tier 2 (both require
`Workflow`, and degrade to Tier 1 if it is missing). When `Workflow` is absent the skill drops to
Tier 1 automatically — a missing tool never blocks the research.

## See also

- [skills.md](skills.md) — the skills that run these workflows and the entry points
- [agents.md](agents.md) — the subagents the workflows and fallbacks fan out to
- [architecture.md](architecture.md) — the capability model and how the pieces fit together

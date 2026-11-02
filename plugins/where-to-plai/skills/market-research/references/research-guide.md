# Market Research Guide (Worksheet 2 support)

How to brief the `market-research` agent and handle what it returns. The agent gathers evidence; the **team scores**.

## Brief the agent per factor

Give the agent four things (the subagent template): a clear **objective**, the required **output format**, **source guidance**, and explicit **task boundaries**. Tailor the objective to the factor:

| Factor | Research objective | Typical sources |
|---|---|---|
| Market volume | Current size + growth, in **units and money**; TAM/SAM/SOM for the specific segment | industry reports, statistical offices, analyst notes, trade associations |
| Compelling reason to buy | How customers solve the problem today; is it must-have vs nice-to-have | customer forums, reviews, interviews, substitute products |
| Economic viability | Typical margins, customer budgets/funding, switching costs in this segment | pricing pages, financial filings, procurement norms |
| Implementation obstacles | Channels that exist, regulation, build-cost signals | regulator sites, channel/partner landscape, comparable launches |
| Time to revenues | Typical sales-cycle length, market-readiness, infrastructure gaps | case studies, B2B sales benchmarks, ecosystem maturity reports |
| External risk | Competitor set + strength, ecosystem dependencies, adoption barriers | competitor sites, patents, standards bodies, news |

## Source quality and cross-checking

- Prefer **primary** and **recent** sources. Note the date of every figure.
- **Cross-check** any headline number against at least two independent sources. If they disagree, present the **range** and say so.
- Distinguish a **sourced fact** from an **inference**. Never launder an estimate into a fact.
- Keep **desk research** apart from **synthetic-persona** output (`customer-discovery`). Synthetic output is a directional assumption to validate with real people — never cite it as research ("research shows", "customers said").

## Evidence colours (per claim)

The engine tags each claim with an evidence colour. The **factor-level** confidence colour on the worksheet is the team's call: propose one with a one-line reason, as a separate question from the score — never set it for them.

- 🔴 **red** — no evidence yet (assumption)
- 🟠 **orange** — some / weak evidence
- 🟢 **green** — significant, cross-checked evidence

## Surface uncertainty — do not bluff (I-CALM)

Instruct the agent to **state confidence explicitly** and to say "unknown" when the evidence isn't there, rather than producing a confident-sounding number. A flagged gap is more useful than a false certainty — it becomes a learning-journey item on the assumption map. Partial, honest answers are rewarded over complete-looking but unsupported ones.

## Output contract

The engine returns a **distilled, source-cited summary (~1–2k tokens)**: key findings, each with a citation and an evidence colour, plus an explicit "still unknown / to validate" list. It returns evidence only — it must not assign a factor score or a factor-level confidence. When you present it to the team, **keep the sources with the findings** (inline link or short citation per claim) — by default, not only on request.

## Choosing a research tier

| Tier | Engine | When | Portable? |
|---|---|---|---|
| 1 | bundled `market-research` **subagent** (Agent tool) | fallback when `Workflow` is absent; any surface | ✅ yes |
| 2 | built-in `deep-research` **workflow** (`Workflow({name})`) | default for every factor except Market volume / Economic viability, and for broad, open questions; adversarially verified, not WtP-tuned | ❌ Claude Code only |
| 3 | bundled `wf-market-research` **workflow** (`Workflow({scriptPath})`) | default for *Market volume* and *Economic viability*: factor scoped into sub-questions, every number cross-checked by a 3-lens adversarial panel (source / recency / scope), plus a completeness critic | ❌ Claude Code only |

Rules of thumb:
- **Capability decides.** If `Workflow` is available, use the workflow tiers; Tier 1 is only the fallback (as in `SKILL.md`).
- **Tier 3** for the quantitative, decision-driving factors — *Market volume* and *Economic viability* — where a wrong number misleads the score. Tier 3's adversarial number-checking is built for exactly this.
- **Tier 2** for the other factors and for broad coverage of an open question, where WtP-specific shaping matters less.
- **Always degrade gracefully:** if `Workflow` is not available, fall back to Tier 1 and tell the team in one plain sentence without tool names (e.g. "This environment can't run the larger automated research team, so I'll use individual research helpers instead — same goal, a bit more step by step."). Never block on a missing tool.
- Whatever the tier, **evidence in, score and confidence colour out by the team.**

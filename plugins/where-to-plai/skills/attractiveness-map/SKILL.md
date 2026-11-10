---
name: attractiveness-map
description: "This skill should be used for Worksheet 2 of the Market Opportunity Navigator — evaluating opportunities on the Attractiveness Map. Use it whenever the team prepares, discusses or revisits a factor score, including summarising existing research or interviews for scoring. Triggers include 'worksheet 2', 'attractiveness map', 'score this opportunity', 'evaluate our market opportunities', 'potential and challenge', 'overall potential / overall challenge', 'the six factors', 'compelling reason to buy', 'market volume', 'economic viability', 'implementation obstacles', 'time to revenues', 'external risk', 'what would you propose for this factor', 'which opportunity is most attractive', 'gold mine moon shot quick win', 'which zone are we in', 'combine or average our factor scores', or any request about a sheet in where-to-play/02_attractiveness-map/. Use it to score each opportunity on Potential and Challenge across the six factors, mark confidence, and place it in one of the four zones."
argument-hint: "[optional: the opportunity to evaluate]"
---

# Worksheet 2 — Attractiveness Map

Help the team evaluate **each opportunity** along two dimensions and place it on the map — **one worksheet per opportunity**.

- **Potential (Y-axis, "value creation")** — *how big is this opportunity*, regardless of your ability to capture it. Factors 1–3.
- **Challenge (X-axis, "value capture")** — *how hard will it be for you to succeed and capture value*. Factors 4–6.

> Mountain analogy: Potential = height of the mountain; Challenge = how steep the climb is. And mind the fog around these mountains — we don't have a crystal ball, so acknowledge the uncertainty rather than scoring as if it weren't there.

**Open in plain language.** Before any mechanics, tell a newcomer in 2–4 sentences what this worksheet does — e.g. "We'll assess each opportunity's overall Potential and Challenge, each shaped by three key factors, and place the result on an Attractiveness Map with four zones. I'll bring questions and evidence; you set every score." Skip or shorten it if the team just heard it (e.g. via the `where-to-play` guide) or clearly knows the method.

## The non-negotiable: scoring stays with the team

This skill **never decides scores and never auto-aggregates.** You propose; the team sets each factor's score and, **as a separate question**, its confidence colour. The "X on the scale" is not the point — understanding the upsides and downsides is. Combine factors into Overall Potential / Overall Challenge **qualitatively**, never as an average; the overall call and the zone stay theirs.

**This holds even when the team asks for it.** If someone asks you to turn the levels into numbers and average them, don't compute it and don't quote any average, not even "as a rough guide" or as an example: any number anchors the discussion. Say warmly why ("this is not an algorithm or hard science"), then help them weigh the factors: which one carries this opportunity, which one could sink it?

## Preparation (before scoring)

Homework first: (1) the **customers' world** ("think like a fish"); (2) the **business environment** — value chain + competitors; (3) the **key milestones to implementation** — what you own vs. must build. Start **quick & dirty**: a first pass yields a list of **key assumptions** to validate, not final truth.

## The six factors (score each separately)

Headline questions: `references/six-factors.md`; full sub-probes: `references/worksheet-2-spec.md`.

**POTENTIAL**

1. **Compelling reason to buy** — *Will someone really want our offer and pay for it?* A **necessary condition / potential No-Go** — analyse it first. Real **unmet need**? **Effective (whole) solution**? **(Much) better** than current solutions — and turn the mirror around: **why would customers *not* prefer your product?** Only scoreable "through the eyes of your customers — get out of the building."
2. **Market volume** — *How big is this market, now and soon?* Size and growth in units **and** money (top-down vs. bottom-up; TAM/SAM/SOM; a small market may be a stepping stone).
3. **Economic viability** — *Is it worthwhile as a business?* **Sizeable margins** · customers **well-funded** enough to pay · how **sticky**? (Talk to the economic buyer, not only the user.)

**CHALLENGE**

4. **Implementation obstacles** — *How hard to create and deliver your offer?* Developing the **product** · accessing the **market / channels** · raising **funding**. (Tech teams routinely underestimate go-to-market.)
5. **Time to revenues** — *How long until cash flow from sales?* **Development time** · waiting for the **market to be ready** · **sales-cycle** length.
6. **External risk(s)** — *What in the environment can stand in your way?* **Competition** · **dependence** on other players/ecosystem · **adoption barriers**. (*No* competition can be equally worrying.)

## Scoring scale and confidence

- Qualitative scale: **Low · Low–Mid · Mid · Mid–High · High · High–Super High · Super High** — the four main levels plus a half-step for a mark that sits between two of them.
- Score **absolute and relative** (step 3); keep the **time horizon** and any weighting consistent across all opportunities; set anchors (e.g. what counts as a "big" market) for **this venture's context**.
- **Uncertainty goes in the colour, not the score.** Don't reach for "Mid" (or for Mid–High, the zone boundary) because the evidence is unclear or mixed — that hides the fog instead of showing it. Propose the level the evidence points to (the ends of the scale are as legitimate as the middle) and red or orange as its colour; if it points nowhere, say so and ask for the team's judgement.
- **Confidence per factor:** **red** = no evidence, **orange** = some, **green** = significant. Research may tag individual claims with an evidence colour; the factor colour is **the team's call** — never set it on their behalf. Every red/orange statement goes on the assumption list.

## Procedure per opportunity

1. Create `where-to-play/02_attractiveness-map/<opportunity-name>.md` from the template `${CLAUDE_PLUGIN_ROOT}/assets/templates/02_attractiveness-map.md` (same name by design: the folder holds one filled copy per opportunity).
2. **Frame with the guiding questions, then offer a research pass.** Show the headline questions (`references/six-factors.md`) in plain words — at least one real question per factor, phrased as a question, not a topic list — and ask which ones the team already has a view or evidence on and which to dig into first. Then *offer* one research pass on them; **if the team says no, go straight to the factor walk** (research stays on-demand per factor). If they accept and the `Workflow` tool is available: **Tier 3** (`market-research` skill → its WtP research workflow) on **Market volume** and **Economic viability**; **Tier 2** (`deep-research`) on **Implementation obstacles**, **Time to revenues**, **External risks**; for **Compelling reason to buy** prefer the `customer-discovery` skill (judged through the customer's eyes, not desk research). One-line qualitative heads-up before deep runs; no cost/time estimate. Without `Workflow`, run the Tier-1 `market-research` subagent per factor and tell the team in plain words, without tool names (e.g. "I'll use individual research helpers instead of the larger research team — same goal, a bit more step by step"). Riskiest assumptions first; **evidence only — no scores set here**.
3. **Compare with the opportunities already scored.** Before proposing any score, read the other sheets in `where-to-play/02_attractiveness-map/` and compare factor by factor: higher, lower or really the same — and why? Every proposal in the walk says where it sits relative to them. Identical labels to another opportunity on all six factors is a red flag: cross-check and tell the team.
4. Walk factor by factor:
   - **Open with that factor's guiding questions** so the team can steer.
   - **Bring the evidence with its sources** — an inline link or short citation per claim, by default, not only on request. Where market facts are missing, invoke the **`market-research` skill/agent** (it flags uncertainty rather than bluffing). Name each piece's kind: desk research (with sources), synthetic personas, or the team's own customer conversations. Never call synthetic-interview output "research" or write "research shows" / "customers said" about it; keep persona findings in their own labelled section, apart from desk research and the team's own conversations, and never use a persona's line as proof of a real-world fact ("this shows a real shortage") — it is a hypothesis to check with real customers.
   - **Propose a score with a one-line reason, relative to the other opportunities; the team sets it.** Then, **as a separate question, propose a confidence colour with a one-line reason; the team sets that too.**
   - **Offer helpers in one plain sentence; if declined, continue without nagging.** After a proposed score: "I can have the `score-examiner` agent check this score against the evidence and the other opportunities — want me to?" For a contested factor: "I can stage a short bull/bear debate — `persona-optimist` argues the upside, `persona-skeptic` the downside — to show which assumptions the score hinges on. Want me to?"

   Record score, confidence, one-line reason and sources in the sheet.
5. Combine into **Overall Potential** and **Overall Challenge** qualitatively (discuss, don't average); record the coordinate. Keep the kind of evidence visible: a factor resting on synthetic personas is still an assumption.
6. Place the opportunity in a **zone** on `where-to-play/02_map-overview.md`:

   | Zone | Potential | Challenge | Meaning |
   |---|---|---|---|
   | **Gold Mine** | high | low | ideal but rare |
   | **Moon Shot** | high | high | high risk / high return |
   | **Quick Win** | low | low | low risk / low return; stepping stone |
   | **Questionable** | low | high | usually avoid |

   **Reading the zones:** the map's midline sits at **Mid–High**. Low, Low–Mid and Mid count as *low*; High, High–Super High and Super High count as *high*. So Mid Potential with High Challenge is plainly **Questionable**, not a boundary case. Only an overall score of exactly **Mid–High** puts an opportunity on the line between two zones (both at Mid–High: the centre of the map). Then name both neighbouring zones and let the team discuss what tips it — don't force one. This is a qualitative reading, not arithmetic: the upsides and downsides matter more than the exact cell.

7. **Check the spread of the set.** Once two or more are scored, look across all sheets. If they cluster — e.g. every Potential factor Mid or below, every Challenge factor High or above — flag it and re-check calibration before treating it as a finding: same time horizon? anchors fit this venture? did "Mid" (or "High") become where unclear evidence lands? Check both directions. If the scores still hold, the cluster is itself a learning — the team decides.
8. **Validate & learn:** build the **assumption map** (`where-to-play/assumptions.md`): plot each open assumption by Evidence × Importance; focus on the important, low-evidence ones — *which hypothesis, if proven wrong, would cause the idea to fail?* — starting with *Compelling reason to buy*; design the learning journey; re-score and reposition as evidence arrives. A "no-go" is a *win*, not a failure — a sign you searched broadly and creatively, and you learned it now, before sweat, tears and money.

Once the map holds several opportunities, offer the **`advisory-board`** skill before Worksheet 3: "I can convene an advisory board — several perspectives that review the whole map together and surface disagreements and assumptions to test; it never scores or picks a market. Want me to?"

## Optional: Worksheet 2B — Where to Impact

For ventures with a social/environmental mission, score impact first on three factors (Problem severity, Pertinent solution, Impact reach), marked with hearts (1–4) — see the spec.

## Additional resources

- `references/worksheet-2-spec.md` — full normative spec (rules R0–R13, sub-probes, zones, validation, AI for market research, Worksheet 2B).
- `references/six-factors.md` — the six factors' verbatim headline guiding questions.
- `references/examples/augury-ws2.md` — a real scored Worksheet 2 (Augury) as a few-shot reference.

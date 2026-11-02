export const meta = {
  name: 'wf-market-research',
  description: 'WtP-tuned deep market research for a Worksheet 2 factor: scope into falsifiable sub-questions, fan out searches, adversarially cross-check every number, return a distilled cited summary with red/orange/green confidence flags. Evidence only — never assigns a score.',
  phases: [
    { title: 'Scope', detail: 'decompose the factor into falsifiable market sub-questions (top-down + bottom-up for sizing)' },
    { title: 'Search', detail: 'one search agent per sub-question, in parallel' },
    { title: 'Verify', detail: 'perspective-diverse 3-lens adversarial panel per quantitative claim (source / recency / scope), majority rule' },
    { title: 'Synthesize', detail: 'distilled, cited summary with confidence flags and an open-questions list' },
    { title: 'Critique', detail: 'completeness critic flags what is missing — feeds the open questions' },
  ],
}

// ---- Input ---------------------------------------------------------------
// args may be a string (free-form question) or an object:
//   { opportunity: string, factor: string, constraints?: string }
const input = typeof args === 'string' ? { question: args } : (args || {})
const opportunity = input.opportunity || ''
const factor = input.factor || ''
const constraints = input.constraints || ''
const question = input.question ||
  `Market evidence needed to score the "${factor}" factor for the market opportunity "${opportunity}". ${constraints}`

// WtP framing reused in every prompt so agents stay on-method.
const WTP_FRAMING = `
This is research for the Market Opportunity Navigator (Where-to-Play) by Sharon Tal & Marc Gruber, Worksheet 2.
The six factors are: Potential = Compelling reason to buy, Market volume, Economic viability;
Challenge = Implementation obstacles, Time to revenues, External risk.
You GATHER EVIDENCE ONLY. You never assign or imply a factor score — the team scores.
Distinguish a sourced fact from an inference. Never launder an estimate into a fact.
Confidence scale per claim: "green" = significant, cross-checked; "orange" = some/weak; "red" = none (assumption).`

// ---- Schemas -------------------------------------------------------------
const SCOPE = {
  type: 'object',
  required: ['subquestions'],
  properties: {
    subquestions: {
      type: 'array', minItems: 2, maxItems: 5,
      items: {
        type: 'object',
        required: ['id', 'question', 'evidence_that_would_answer'],
        properties: {
          id: { type: 'string' },
          question: { type: 'string' },
          evidence_that_would_answer: { type: 'string' },
        },
      },
    },
  },
}

const FINDINGS = {
  type: 'object',
  required: ['subquestion_id', 'findings', 'still_unknown'],
  properties: {
    subquestion_id: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'is_quantitative', 'sources', 'confidence'],
        properties: {
          claim: { type: 'string' },
          value: { type: 'string', description: 'the number/figure if quantitative, else empty' },
          is_quantitative: { type: 'boolean' },
          sources: { type: 'array', items: { type: 'string' } },
          confidence: { type: 'string', enum: ['red', 'orange', 'green'] },
        },
      },
    },
    still_unknown: { type: 'array', items: { type: 'string' } },
  },
}

const VERDICT = {
  type: 'object',
  required: ['trustworthy', 'note'],
  properties: {
    trustworthy: { type: 'boolean', description: 'true only if the figure holds up on THIS lens; default false when in doubt' },
    note: { type: 'string', description: 'one-line reason / concern on this lens' },
    range: { type: 'string', description: 'the spread if sources disagree, else empty' },
  },
}

const SYNTH = {
  type: 'object',
  required: ['headline', 'findings', 'open_questions'],
  properties: {
    headline: { type: 'string', description: 'one-line state of evidence; no score' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['claim', 'confidence', 'sources'],
        properties: {
          claim: { type: 'string' },
          confidence: { type: 'string', enum: ['red', 'orange', 'green'] },
          sources: { type: 'array', items: { type: 'string' } },
          range: { type: 'string' },
        },
      },
    },
    open_questions: { type: 'array', items: { type: 'string' } },
  },
}

const CRITIC = {
  type: 'object',
  required: ['gaps'],
  properties: {
    gaps: {
      type: 'array',
      items: { type: 'string' },
      description: 'concrete missing pieces: an unanswered sub-question, a single-sourced number, an un-searched angle, an unverified claim',
    },
  },
}

// ---- Phase 1: Scope ------------------------------------------------------
phase('Scope')
const scope = await agent(
  `${WTP_FRAMING}\n\nResearch question: ${question}\n\n` +
  `Decompose this into 2–5 FALSIFIABLE market sub-questions whose answers would let the team score the factor. ` +
  `Prefer sub-questions that map to the factor's guiding questions (e.g. for Market volume: current size in units AND money, growth rate, TAM/SAM/SOM). ` +
  `Where the factor involves sizing, include BOTH a top-down sub-question (analyst/industry reports) AND a bottom-up one (customer counts × spend), so the estimates can be triangulated. ` +
  `For each, state what evidence would answer it.`,
  { schema: SCOPE, effort: 'low', label: 'scope', phase: 'Scope' }
)
log(`Scoped into ${scope.subquestions.length} sub-questions`)

// ---- Phase 2: Search (parallel, one agent per sub-question) --------------
phase('Search')
const searchResults = (await parallel(
  scope.subquestions.map((sq) => () =>
    agent(
      `${WTP_FRAMING}\n\nSub-question (id ${sq.id}): ${sq.question}\n` +
      `Evidence that would answer it: ${sq.evidence_that_would_answer}\n\n` +
      `Search the web breadth-first, then fetch the most credible, recent, PRIMARY sources. ` +
      `Record the date of every figure. For any number, prefer figures you can corroborate across independent sources. ` +
      `Return findings with sources and a confidence flag each, plus what remains unknown. Mark is_quantitative=true for numeric claims.`,
      { schema: FINDINGS, label: `search:${sq.id}`, phase: 'Search' }
    )
  )
)).filter(Boolean)

// Collect all findings; isolate quantitative ones, dedup, and cap for adversarial verification.
const allFindings = searchResults.flatMap((r) => (r.findings || []))
const seenClaim = new Set()
const quantClaims = allFindings
  .filter((f) => f.is_quantitative)
  .filter((f) => {
    const k = (f.claim || '').trim().toLowerCase()
    if (!k || seenClaim.has(k)) return false
    seenClaim.add(k)
    return true
  })
const MAX_VERIFY = 12
const toVerify = quantClaims.slice(0, MAX_VERIFY)
if (quantClaims.length > MAX_VERIFY) log(`Capping verification at ${MAX_VERIFY} of ${quantClaims.length} quantitative claims`)
log(`${allFindings.length} findings; verifying ${toVerify.length} quantitative claims via a 3-lens panel each`)

// ---- Phase 3: Verify — perspective-diverse adversarial panel per number --
// A market figure can be wrong in three distinct ways, so use three DIFFERENT lenses, not N identical refuters.
phase('Verify')
const LENSES = [
  { key: 'source', ask: 'SOURCE credibility: is this figure traceable to a credible, primary, independent source — not a content farm or a circular re-citation? Search to confirm. Untrustworthy if no credible independent source exists.' },
  { key: 'recency', ask: 'RECENCY / validity: how old is this figure and is it still valid today? Note its date. Untrustworthy if stale, or undated and likely outdated.' },
  { key: 'scope', ask: 'SCOPE match: does the figure measure the SAME thing the question asks — same segment, geography and definition (e.g. TAM vs SAM, global vs regional, units vs revenue)? Untrustworthy if it silently measures something else.' },
]
const panels = (await parallel(
  toVerify.map((f) => () =>
    parallel(
      LENSES.map((lens) => () =>
        agent(
          `${WTP_FRAMING}\n\nQuantitative claim under scrutiny: "${f.claim}" (value: ${f.value || 'n/a'})\n` +
          `Cited sources: ${(f.sources || []).join(', ') || 'none'}\n` +
          `Original research question: ${question}\n\n` +
          `Examine this figure through ONE lens only — ${lens.ask}\n` +
          `Return trustworthy=true only if the figure holds up on YOUR lens; default to false when in doubt. If sources disagree, report the range.`,
          { schema: VERDICT, label: `verify:${lens.key}:${(f.claim || '').slice(0, 24)}`, phase: 'Verify', effort: 'medium' }
        )
      )
    ).then((votes) => ({ claim: f, votes: votes.filter(Boolean) }))
  )
)).filter(Boolean)

// Majority rule: a figure failing >=2 of 3 lenses has its confidence downgraded; attach any range + the concerns.
for (const p of panels) {
  const f = p.claim
  const trusted = p.votes.filter((v) => v.trustworthy).length
  const range = p.votes.map((v) => v.range).filter(Boolean)[0]
  if (range) f.range = range
  if (p.votes.length && trusted < Math.ceil(p.votes.length / 2)) {
    if (f.confidence === 'green') f.confidence = 'orange'
    else if (f.confidence === 'orange') f.confidence = 'red'
    f.verification_concerns = p.votes.filter((v) => !v.trustworthy).map((v) => v.note).filter(Boolean)
  }
}

// ---- Phase 4: Synthesize -------------------------------------------------
phase('Synthesize')
const openQuestions = searchResults.flatMap((r) => (r.still_unknown || []))
const synthesis = await agent(
  `${WTP_FRAMING}\n\nResearch question: ${question}\n\n` +
  `Here are the gathered findings (with post-verification confidence) as JSON:\n` +
  `${JSON.stringify(allFindings, null, 2)}\n\n` +
  `Open questions surfaced during search:\n${JSON.stringify(openQuestions, null, 2)}\n\n` +
  `Merge semantic duplicates, drop anything unsupported and unsourced, and produce a DISTILLED summary (~1–2k tokens): ` +
  `a one-line headline state-of-evidence (NO score), the consolidated findings each with confidence flag + sources (+ range where sources disagreed), ` +
  `and a prioritised "open questions / to validate" list (these become learning-journey items). Do NOT assign a factor score.`,
  { schema: SYNTH, effort: 'high', label: 'synthesize', phase: 'Synthesize' }
)

// ---- Phase 5: Completeness critic ---------------------------------------
phase('Critique')
const critique = await agent(
  `${WTP_FRAMING}\n\nResearch question: ${question}\n\n` +
  `Here is the research summary produced so far:\n${JSON.stringify(synthesis, null, 2)}\n\n` +
  `Act as a completeness critic. What is MISSING? Consider: a sub-question never answered; a number resting on a single source; an angle not searched (regulation, substitutes, a key geography or segment); a claim still unverified. ` +
  `Return a short list of concrete gaps the team should close (they become extra open questions). Do not re-answer them — just name them.`,
  { schema: CRITIC, effort: 'medium', label: 'completeness-critic', phase: 'Critique' }
)

return {
  opportunity,
  factor,
  question,
  ...synthesis,
  open_questions: [...(synthesis.open_questions || []), ...(critique.gaps || [])],
  completeness_gaps: critique.gaps || [],
  verified_numbers: panels.map((p) => ({
    claim: p.claim.claim,
    trusted_lenses: p.votes.filter((v) => v.trustworthy).length,
    of_lenses: p.votes.length,
    confidence: p.claim.confidence,
    range: p.claim.range || '',
  })),
}

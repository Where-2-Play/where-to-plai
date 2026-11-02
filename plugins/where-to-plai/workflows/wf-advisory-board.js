export const meta = {
  name: 'wf-advisory-board',
  description: 'Convene the Where-to-Play advisory board to review the current Worksheet 2 and/or Worksheet 3: an intake agent digests the worksheets, each board member reviews through their lens in parallel, then a synthesis surfaces agreements, disagreements and the assumptions to test. The board provokes; it never scores or decides.',
  phases: [
    { title: 'Intake', detail: 'digest the current worksheet state from the workspace' },
    { title: 'Board', detail: 'each advisor reviews through their lens, in parallel' },
    { title: 'Synthesis', detail: 'agreements, disagreements, and the assumptions to test (no decision)' },
  ],
}

// ---- Input ---------------------------------------------------------------
// args: { worksheet?: 'ws2'|'ws3'|'both', workspace?: string, focus?: string, board?: string[] }
// Accept either a real object or a JSON-encoded string, so a caller that
// stringifies args doesn't silently fall back to defaults (losing workspace/focus).
const input =
  typeof args === 'string'
    ? (() => { try { return JSON.parse(args) } catch { return {} } })()
    : (args && typeof args === 'object' ? args : {})
const worksheet = input.worksheet || 'both'
const workspace = input.workspace || 'where-to-play'
const focus = input.focus || ''

// Roster — every member is labelled "Name — lens" so the team can tell at a
// glance what perspective each one brings.
const ROSTER = {
  'where-to-plai:advisor-tal-gruber': 'Tal & Gruber — method fidelity',
  'where-to-plai:score-examiner': 'Score Examiner — evidence check',
  'where-to-plai:advisor-jobs-analyst': 'Jobs Analyst — jobs to be done / disruption',
  'where-to-plai:advisor-beachhead-strategist': 'Beachhead Strategist — beachhead / whole product',
  'where-to-plai:advisor-risk-inverter': 'Risk Inverter — inversion / risk',
}
// The board is the whole roster (five members). args.board overrides it — an
// array of agent ids (or { agentType, label } objects) to convene a subset.
const toMember = (a) =>
  typeof a === 'string' ? { agentType: a, label: ROSTER[a] || a.split(':').pop() } : a
const ids =
  Array.isArray(input.board) && input.board.length ? input.board :
  Object.keys(ROSTER)
const board = ids.map(toMember)

const targetFiles =
  worksheet === 'ws2' ? `${workspace}/02_attractiveness-map/ and ${workspace}/02_map-overview.md` :
  worksheet === 'ws3' ? `${workspace}/03_agile-focus.md` :
  `${workspace}/02_attractiveness-map/, ${workspace}/02_map-overview.md and ${workspace}/03_agile-focus.md`

// ---- Schemas -------------------------------------------------------------
const DIGEST = {
  type: 'object',
  required: ['summary'],
  properties: {
    summary: { type: 'string' },
    opportunities: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          overall_potential: { type: 'string' },
          overall_challenge: { type: 'string' },
          zone: { type: 'string' },
          key_assumptions: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    primary: { type: 'string' },
    backups: { type: 'array', items: { type: 'string' } },
    growth: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string', description: 'gaps, blanks, low-confidence areas in the worksheets' },
  },
}

const REVIEW = {
  type: 'object',
  required: ['headline', 'strengths', 'concerns', 'assumptions_to_test'],
  properties: {
    headline: { type: 'string', description: 'one-line take, in this advisor’s voice; no score' },
    strengths: { type: 'array', items: { type: 'string' } },
    concerns: { type: 'array', items: { type: 'string' } },
    assumptions_to_test: { type: 'array', items: { type: 'string' } },
  },
}

const SYNTHESIS = {
  type: 'object',
  required: ['consensus_tally', 'agreements', 'disagreements', 'top_assumptions_to_test', 'blind_spots'],
  properties: {
    consensus_tally: {
      type: 'array',
      description: 'concerns/assumptions ranked by how many advisors independently raised them — a weight-of-agreement signal on FINDINGS, never a score or ranking of opportunities',
      items: {
        type: 'object',
        required: ['item', 'flagged_by', 'advisors'],
        properties: {
          item: { type: 'string', description: 'the merged concern or assumption' },
          flagged_by: { type: 'integer', description: 'number of distinct advisors who raised it' },
          advisors: { type: 'array', items: { type: 'string' }, description: 'advisor labels as given, "Name — lens"' },
        },
      },
    },
    agreements: { type: 'array', items: { type: 'string' } },
    disagreements: {
      type: 'array',
      items: {
        type: 'object',
        required: ['point', 'who_diverges'],
        properties: { point: { type: 'string' }, who_diverges: { type: 'string' } },
      },
    },
    top_assumptions_to_test: { type: 'array', items: { type: 'string' } },
    blind_spots: { type: 'array', items: { type: 'string' }, description: 'what no advisor raised but should be checked' },
  },
}

// ---- Phase 1: Intake -----------------------------------------------------
phase('Intake')
const digest = await agent(
  `You are preparing a briefing for an advisory board reviewing a Where-to-Play (Market Opportunity Navigator) analysis.\n` +
  `Read the worksheet files in the project workspace: ${targetFiles}.\n` +
  (focus ? `Focus especially on: ${focus}.\n` : '') +
  `Produce a faithful, compact digest: each opportunity with its Overall Potential, Overall Challenge, zone and key open assumptions; ` +
  `the Primary/Backup/Growth choices if Worksheet 3 is present; and notes on blanks or low-confidence areas. ` +
  `Do not editorialise or score — just summarise what the worksheets currently say.`,
  { schema: DIGEST, effort: 'low', label: 'intake', phase: 'Intake' }
)
// Graceful no-data path: if intake found no populated worksheets, return a clear
// message instead of crashing the board (the digest schema no longer forces
// `opportunities`, so an empty/blank workspace yields a summary-only digest).
if (!Array.isArray(digest.opportunities) || digest.opportunities.length === 0) {
  return {
    worksheet,
    workspace,
    focus,
    digest,
    reviews: [],
    synthesis: null,
    error: `No populated worksheets found under "${workspace}/". Fill in Worksheet 2 (and optionally Worksheet 3) before convening the advisory board — it reviews an existing analysis, it does not create one.`,
  }
}

const digestJson = JSON.stringify(digest, null, 2)
log(`Digest ready: ${digest.opportunities.length} opportunities; convening ${board.length} advisors`)

// ---- Phase 2: Board (parallel, one agent per advisor) --------------------
phase('Board')
const reviews = (await parallel(
  board.map((member) => () =>
    agent(
      `The Where-to-Play advisory board is reviewing the team's worksheets. Here is the current digest:\n\n${digestJson}\n\n` +
      (focus ? `The team especially wants your view on: ${focus}.\n\n` : '') +
      `Review this through YOUR lens (read the workspace files under "${workspace}/" if you need detail). ` +
      `Give your strengths, concerns, and the assumptions you would have the team test. Stay in character; never assign a score or pick the Primary.`,
      { agentType: member.agentType, schema: REVIEW, label: `board:${member.label}`, phase: 'Board' }
    ).then((r) => (r ? { ...r, advisor: member.label } : null))
  )
)).filter(Boolean)
log(`${reviews.length}/${board.length} advisors reported`)

// ---- Phase 3: Synthesis --------------------------------------------------
phase('Synthesis')
const synthesis = await agent(
  `You are the chair summarising an advisory board's review of a Where-to-Play analysis. ${reviews.length} advisors reported. Here are their reviews as JSON:\n\n` +
  `${JSON.stringify(reviews, null, 2)}\n\n` +
  `Synthesise for the team WITHOUT recommending a decision:\n` +
  `Name each advisor by their full label, "Name — lens" (e.g. "Beachhead Strategist — beachhead / whole product"), so the team sees which perspective said what.\n` +
  `- CONSENSUS TALLY: merge semantically-equivalent concerns and assumptions raised across advisors; for each merged item, count how many DISTINCT advisors raised it and list them by name, sorted by count descending. This is a weight-of-agreement signal on FINDINGS (which worries recur across lenses) — it is NEVER a score or a ranking of opportunities.\n` +
  `- AGREEMENTS: where advisors converge.\n` +
  `- DISAGREEMENTS: where they diverge (name who diverges and why).\n` +
  `- TOP ASSUMPTIONS TO TEST: the highest-priority ones (merge duplicates across advisors).\n` +
  `- BLIND SPOTS: what no advisor raised but the team should check.\n` +
  `The board provokes and informs; the team decides. Do not score, rank, or pick a market.`,
  { schema: SYNTHESIS, effort: 'high', label: 'synthesis', phase: 'Synthesis' }
)

return {
  worksheet,
  workspace,
  focus,
  board: board.map((m) => m.label),
  digest,
  reviews,
  synthesis,
  reminder: 'The advisory board provokes and surfaces assumptions. The team makes every decision — no score, no chosen market, comes from this board.',
}

export const meta = {
  name: 'wf-customer-discovery',
  description: 'Run synthetic, skeptical customer discovery for a Worksheet 2 opportunity and propose a DRAFT score for Factor 1 (Compelling reason to buy). One agent derives diverse, web-grounded personas (buyer vs. user, skeptic, incumbent-loyalist, laggard — not only eager early adopters); one agent per persona role-plays a realistic, non-sycophantic interview; a synthesis distils a draft score (Low/Mid/High/Super High), a honest red/orange/green confidence, load-bearing assumptions and a Mom-Test interview kit. SYNTHETIC and DIRECTIONAL — a provisional draft to prep real interviews, never a substitute for getting out of the building.',
  phases: [
    { title: 'Personas', detail: 'derive 4–6 grounded, diverse personas (buyer vs. user; skeptic, loyalist, laggard)' },
    { title: 'Interviews', detail: 'one agent per persona role-plays a realistic, skeptical interview, in parallel' },
    { title: 'Synthesis', detail: 'draft Factor-1 score, honest confidence, assumptions to validate, and an interview kit' },
  ],
}

// ---- Input ---------------------------------------------------------------
// args: { opportunity?, application?, customer?, value_prop?, workspace?, factor? }
// Accept either a real object or a JSON-encoded string, so a caller that
// stringifies args doesn't silently fall back to defaults (losing value_prop/workspace).
// A bare string = the opportunity description.
const input =
  typeof args === 'string'
    ? (() => { try { const p = JSON.parse(args); return (p && typeof p === 'object') ? p : { opportunity: args } } catch { return { opportunity: args } } })()
    : (args && typeof args === 'object' ? args : {})
const opportunity = input.opportunity || ''
const application = input.application || ''
const customer = input.customer || ''
const value_prop = input.value_prop || ''
const workspace = input.workspace || 'where-to-play'
const factor = input.factor || 'Compelling reason to buy'

// WtP framing reused in every prompt so agents stay on-method.
const WTP_FRAMING = `
This is synthetic customer discovery for the Market Opportunity Navigator (Where-to-Play) by Sharon Tal & Marc Gruber, Worksheet 2.
Factor 1 = "Compelling reason to buy": is there a real UNMET NEED, can the venture provide an effective WHOLE solution, and can it do so (MUCH) BETTER than the customer's current alternatives — judged "through the eyes of the customer".
The score scale is qualitative: Low / Mid / High / Super High. Confidence colour per the WtP scheme: green = significant evidence, orange = some/weak, red = none (assumption).
These personas are SYNTHETIC. They stand in for real customers to break the blank page and PREP real interviews — they do NOT replace getting out of the building.`

const CONTEXT = `Opportunity: ${opportunity || '(unspecified)'}\n` +
  (application ? `Application / offer: ${application}\n` : '') +
  (customer ? `Intended customer / segment: ${customer}\n` : '') +
  (value_prop ? `Value proposition / compelling reason claimed: ${value_prop}\n` : '')

// ---- Schemas -------------------------------------------------------------
const PERSONAS = {
  type: 'object',
  required: ['personas'],
  properties: {
    grounding_note: { type: 'string', description: 'one line on what the web search established (real roles, pains, alternatives, budgets)' },
    personas: {
      type: 'array', minItems: 4, maxItems: 6,
      items: {
        type: 'object',
        required: ['name', 'role', 'buyer_or_user', 'segment_context', 'pains', 'current_alternative', 'why_skeptical'],
        properties: {
          name: { type: 'string', description: 'a plausible persona handle, e.g. "Procurement-lead Dana"' },
          role: { type: 'string', description: 'real job/role in the segment' },
          buyer_or_user: { type: 'string', enum: ['buyer', 'user', 'both'], description: 'economic buyer vs. end user — separate them' },
          segment_context: { type: 'string', description: 'grounded context: org/segment, constraints, budget reality' },
          pains: { type: 'array', items: { type: 'string' }, description: 'real, specific pains (not generic)' },
          current_alternative: { type: 'string', description: 'what they use today — the status quo / incumbent / workaround' },
          why_skeptical: { type: 'string', description: 'the realistic reason this persona would resist or doubt the offer' },
        },
      },
    },
  },
}

const INTERVIEW = {
  type: 'object',
  required: ['persona', 'would_engage', 'compelling_reason', 'objections', 'switching_barriers', 'willingness_to_pay_signals', 'candid_verdict'],
  properties: {
    persona: { type: 'string', description: 'the persona name being role-played' },
    would_engage: { type: 'string', enum: ['yes', 'maybe', 'no'], description: 'would this persona realistically take the next step' },
    compelling_reason: { type: 'string', description: 'the genuine reason to buy IN THIS PERSONA’S words — or an explicit statement that there is none / not compelling enough' },
    objections: { type: 'array', items: { type: 'string' }, description: 'real objections voiced candidly' },
    switching_barriers: { type: 'array', items: { type: 'string' }, description: 'what makes leaving the current alternative costly or unlikely' },
    willingness_to_pay_signals: { type: 'string', description: 'any signal of budget/price tolerance — or absence of it' },
    candid_verdict: { type: 'string', description: 'blunt one-liner in character; no flattery' },
  },
}

const SYNTHESIS = {
  type: 'object',
  required: ['draft_score', 'confidence', 'confidence_reason', 'rationale', 'key_assumptions', 'interview_kit', 'synthetic_note'],
  properties: {
    draft_score: { type: 'string', enum: ['Low', 'Mid', 'High', 'Super High'], description: 'PROPOSED Factor-1 score the human may accept or override' },
    confidence: { type: 'string', enum: ['red', 'orange', 'green'], description: 'PROPOSED confidence colour for the team to accept or change; judge it HONESTLY: synthetic-only is typically orange; red if personas diverge sharply; may be higher only with strong web corroboration — do not inflate, do not hard-cap below green' },
    confidence_reason: { type: 'string', description: 'one line: why this proposed colour' },
    rationale: { type: 'string', description: 'why this draft score, grounded in the interviews' },
    key_assumptions: {
      type: 'array', minItems: 1,
      items: { type: 'string' },
      description: 'load-bearing assumptions the draft rests on — to validate with REAL customers',
    },
    interview_kit: {
      type: 'array', minItems: 5, maxItems: 8,
      items: { type: 'string' },
      description: 'Mom-Test-style questions about the customer’s world and PAST behaviour (not pitches, not hypotheticals)',
    },
    synthetic_note: { type: 'string', description: 'explicit label: SYNTHETIC, DIRECTIONAL ONLY; the score is a provisional draft to be replaced with real interview evidence' },
  },
}

// ---- Phase 1: Personas (one grounded agent with WebSearch) ---------------
phase('Personas')
const personaSet = await agent(
  `${WTP_FRAMING}\n\n${CONTEXT}\n` +
  `Derive 4–6 DIVERSE synthetic customer personas for this opportunity, GROUNDED in web search. ` +
  `Search for the real segment roles, their actual day-to-day pains, the existing alternatives/incumbents they rely on today, and their budget realities — do not invent generic personas.\n` +
  `Diversity is REQUIRED:\n` +
  `- Separate the economic BUYER from the end USER (they judge "compelling reason" differently).\n` +
  `- Include a SKEPTIC, an INCUMBENT-LOYALIST (happy with the status quo), and a LAGGARD — not only the eager early adopter.\n` +
  `For each persona give: name, real role, buyer_or_user, grounded segment_context (incl. budget reality), specific pains, current_alternative (status quo), and why_skeptical. ` +
  `Add a one-line grounding_note on what the search established.`,
  { schema: PERSONAS, label: 'personas', phase: 'Personas' }
)

if (!Array.isArray(personaSet.personas) || personaSet.personas.length === 0) {
  return {
    opportunity,
    personas: [],
    interviews: [],
    synthesis: null,
    error: 'Could not derive personas — provide at least an opportunity description (and ideally application, customer and value_prop) so the personas can be grounded.',
    reminder: 'Synthetic customer discovery is DIRECTIONAL ONLY — persona output is an assumption to validate with real people, never research. Real customer contact stays the gold standard; keep the human in the loop.',
  }
}

const personas = personaSet.personas
log(`Derived ${personas.length} grounded personas; interviewing each in parallel`)

// ---- Phase 2: Interviews (parallel, one role-playing agent per persona) ---
phase('Interviews')
const interviews = (await parallel(
  personas.map((p) => () =>
    agent(
      `${WTP_FRAMING}\n\nYou ARE this customer. Stay fully in character and answer as this person would in a real discovery interview — do NOT be an agreeable assistant.\n\n` +
      `PERSONA:\n${JSON.stringify(p, null, 2)}\n\n` +
      `THE OPPORTUNITY / OFFER BEING PITCHED TO YOU:\n${CONTEXT}\n` +
      `React REALISTICALLY and SKEPTICALLY. CRITICAL — resist LLM sycophancy: do not be helpful, do not be agreeable, do not pretend interest you would not have. ` +
      `Voice your real objections, status-quo inertia and switching costs, the "I already have a solution that's good enough" reflex, and budget/priority reality. ` +
      `Only say the reason to buy is compelling if it genuinely would be FOR YOU — otherwise say plainly that it is not, and why. ` +
      `Report: would_engage (yes/maybe/no), the compelling_reason in your own words (or its absence), your objections, your switching_barriers, any willingness_to_pay_signals, and a blunt candid_verdict.`,
      { schema: INTERVIEW, label: `interview:${p.name}`, phase: 'Interviews', effort: 'medium' }
    ).then((r) => (r ? { ...r, persona: r.persona || p.name } : null))
  )
)).filter(Boolean)
log(`${interviews.length}/${personas.length} interviews completed`)

// ---- Phase 3: Synthesis (one agent, high effort) -------------------------
phase('Synthesis')
const synthesis = await agent(
  `${WTP_FRAMING}\n\n${CONTEXT}\n` +
  `Below are ${interviews.length} synthetic customer interviews as JSON:\n\n${JSON.stringify(interviews, null, 2)}\n\n` +
  `Synthesise them into a PROVISIONAL DRAFT for Worksheet 2, Factor 1 (Compelling reason to buy) that the human team can ACCEPT or OVERRIDE:\n` +
  `- draft_score: exactly one of Low | Mid | High | Super High — the proposed Factor-1 score, judged through the customers' eyes (unmet need? whole solution? much better than the current alternative?).\n` +
  `- confidence: red | orange | green — a PROPOSED colour for the team to accept or change, judged HONESTLY. Synthetic-only evidence is typically ORANGE; use RED if the personas diverge sharply or the reason to buy is weak/contested; go higher ONLY if strong web corroboration backs it. Do NOT inflate, and do NOT hard-cap below green. Give a one-line confidence_reason.\n` +
  `- rationale: why this draft score, grounded in the interviews (note buyer-vs-user divergence and switching barriers).\n` +
  `- key_assumptions: the load-bearing assumptions the draft rests on, to validate with REAL customers.\n` +
  `- interview_kit: 5–8 concrete Mom-Test-style questions about the customer's WORLD and PAST behaviour (not pitches, not "would you buy" hypotheticals) for the team to ask real customers next.\n` +
  `- synthetic_note: an explicit label that this is SYNTHETIC and DIRECTIONAL ONLY, the score is a provisional draft, and it must be replaced with real interview evidence.\n` +
  `The draft score is a starting point to break the blank page — the team decides.`,
  { schema: SYNTHESIS, effort: 'high', label: 'synthesis', phase: 'Synthesis' }
)

return {
  opportunity,
  factor,
  personas,
  grounding_note: personaSet.grounding_note || '',
  interviews,
  synthesis,
  reminder: 'SYNTHETIC, DIRECTIONAL ONLY — persona output is an assumption to validate with real people, never research (no "research shows" / "customers said"). The draft score and confidence colour for "Compelling reason to buy" are proposals for the team to set — not a verdict. Real customer contact stays the gold standard; keep the human in the loop and re-score once real evidence arrives.',
}

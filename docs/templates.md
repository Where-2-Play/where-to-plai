# Templates

When the guide (`/where-to-plai:where-to-play`) starts, it confirms a location and scaffolds a
`where-to-play/` workspace into the user's project by copying a set of Markdown templates. These are
the **living files the team edits** — the Market Opportunity Navigator as project files rather than
one-off chatbot output. The plugin never fills them for you; it asks the cornerstone questions and
holds the evidence while the team makes every real decision.

The source templates live in the plugin at
`plugins/where-to-plai/assets/templates/`. The numeric prefixes (`01_`, `02_`, `03_`) order the
files by worksheet so the workspace reads top to bottom as the three-step journey.

## What gets scaffolded

The guide copies the templates into `where-to-play/` as follows (see the `where-to-play` skill for
the exact mapping):

| Template file | Lands in workspace as | Purpose | Worksheet |
|---|---|---|---|
| `00_README.md` | `where-to-play/README.md` | Workspace orientation — the file table, how to use the navigator, the confidence legend, and the "keep it breathing" reminder | — (index) |
| `01_opportunity-set.md` | `where-to-play/01_opportunity-set.md` | De-link core abilities, re-link them into an application → segment → sub-segment tree, screen to ≈3–5 | 1 — Market Opportunity Set |
| `02_attractiveness-map.md` | `where-to-play/02_attractiveness-map/<opportunity>.md` (one per opportunity) | Score a single opportunity on the six factors, mark per-factor confidence, derive Overall Potential / Challenge, place it in a zone | 2 — Attractiveness Map |
| `02_map-overview.md` | `where-to-play/02_map-overview.md` | Bird's-eye placement of all opportunities across the four zones (Gold Mine / Moon Shot / Quick Win / Questionable) | 2 — Attractiveness Map |
| `03_agile-focus.md` | `where-to-play/03_agile-focus.md` | Choose Primary/Backup/Growth, assess relatedness, set investment levels, fill the dartboard | 3 — Agile Focus Strategy |
| `assumptions.md` | `where-to-play/assumptions.md` | Cross-cutting assumptions ledger and learning journey | cross-cutting |
| `workspace-CLAUDE.md` | `CLAUDE.md` in the project root, next to `where-to-play/` | Ground rules that hold even when no Navigator skill is active: the team decides, answer off-topic questions briefly and steer back, synthetic interviews are not real evidence, keep it breathing. Never overwrites an existing `CLAUDE.md` — the guide asks and offers to append | — (workspace) |

Three naming details worth noting: `workspace-CLAUDE.md` is stored under that name so it is not
loaded as instructions inside the plugin repo, and lands as `CLAUDE.md`; `00_README.md` is copied
to a plain `README.md` (dropping the numeric prefix) so it reads as the workspace's front page; and `02_attractiveness-map.md` is **not**
copied directly. Instead the guide creates an empty `where-to-play/02_attractiveness-map/` folder,
and the `attractiveness-map` skill copies the template into it **once per opportunity** — one
scored worksheet per candidate. That is why the template links to `../assumptions.md`: each copy
lives one level down inside the map folder.

## Worksheet 1 — `01_opportunity-set.md`

Two halves mirroring the de-link / re-link move. The **upper part** captures core abilities
described generically, separated from the current product (functions, know-how, rare resources, and
honest limitations); patents are noted below the table for Worksheet 2, not listed as abilities. The
**lower part** brainstorms an **application → segment → sub-segment tree** — each leaf one
opportunity tied by a need, deliberately large (20–50 leaves is normal). A screening table then runs
the four **initial screening** questions (real need? · satisfiable with our unique abilities, better
than alternatives? · severe restrictions? · fits our values?) per application × (sub-)segment, with a
recommendation and the team's decision. Each leaf keeps its status — **on the set / screened out /
parked** — so the breadth stays visible, and the set narrows to a heterogeneous ≈3–5.

## Worksheet 2 — `02_attractiveness-map.md` + `02_map-overview.md`

`02_attractiveness-map.md` is the **per-opportunity** worksheet. It walks the three Potential factors
(Compelling reason to buy — analysed first as the necessary condition · Market volume · Economic
viability) and the three Challenge factors (Implementation obstacles · Time to revenues · External
risks). Each factor carries reasoning (including how it compares with the opportunities already
scored), its **sources**, a **Score** (Low / Mid / High / Super High, or the half-step between two) and a
**Confidence** flag (🔴 no evidence · 🟠 some · 🟢 significant) — two separate team decisions, with
unclear evidence shown in the colour rather than as a default "Mid". Sources name their kind: desk
research, synthetic personas (directional), or the team's own customer conversations. It rolls up to a
qualitative Overall Potential and Overall Challenge — explicitly *not* an average — and a **Zone**.
A closing section carries every 🔴/🟠 item into `assumptions.md`.

`02_map-overview.md` is the **cross-opportunity** view: an ASCII four-zone map plus a placements
table (Overall Potential, Overall Challenge, Zone, lowest-factor confidence per opportunity) and
guidance on reading the map — including how to reshape an opportunity by raising Potential or
lowering Challenge, and a check for a set that clusters in one band before reading it as a finding.

Synthetic interview notes from `customer-discovery` land beside the sheets as
`02_attractiveness-map/<opportunity>-customer-interviews.md`, labelled SYNTHETIC; they are not scored
opportunity sheets.

## Worksheet 3 — `03_agile-focus.md`

Captures the focus-plus-agility decision, written from the team's choices: the **Primary** market
(which must not be Questionable, which the team must genuinely want to chase, and which is *pursue
now* by default, so it is not repeated below), a relatedness table for Backup/Growth **candidates**
with each one's role (product vs. market relatedness, whether they share the Primary's showstoppers),
**investment levels** with role and the team's reason (Keep open ~5–10% · Pursue now in parallel ·
Place in storage), and the **Agile Focus Dartboard** (centre = Primary plus any parallel option,
middle ring = keep open, each tagged Backup / Growth / both, outer ring = storage). While no option
can be Primary yet, a **what to learn next** table holds the team's order of open assumptions and
next tests.

## The assumptions log — `assumptions.md`

The cross-cutting ledger that makes the navigator *breathe*. Every 🔴/🟠 statement from the
worksheets lives here until it is evidenced. It has three parts: an **assumption map** (plot each
open assumption by Evidence × Importance, attack important + low-evidence first — starting with
*Compelling reason to buy*), a **learning journey** (an ordered, riskiest-first list of what to
validate next), and a **Resolved** history that is never deleted — confirmed or refuted assumptions
move there with their date, evidence, and the worksheet change they triggered.

## The breathing loop

Every worksheet (and `assumptions.md`) carries a **🫁 Breathing log** header — *Last reviewed ·
Cadence · Next review* — plus a changelog line. This is what turns the templates from a one-off
snapshot into a longitudinal, living navigator: the team keeps the dates current, and whenever new
evidence arrives Claude offers `/where-to-plai:revisit` to re-open the worksheets without silently
overwriting prior judgement. See [architecture.md](architecture.md) for how the breathing loop fits
the whole design.

## See also

- [usage.md](usage.md) · [skills.md](skills.md)

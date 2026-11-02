# Worked Examples

> **Provenance & rights:** © Sharon Tal & Marc Gruber. The worked examples are real cases from the authors' own teaching material ([wheretoplay.co](https://www.wheretoplay.co)). They are the framework's own teaching cases — not the plugin's invention.

The plugin ships three real, filled-in Where-to-Play cases. They serve two purposes at once: they are **few-shot references** that the skills load just-in-time to steer their own output, and they are **study material** you can read to see what a good worksheet actually looks like. Each is a finished worksheet, not a template — the goal is to show the reasoning and the figures, not to hand you blanks to fill.

## The three examples

| Venture | Worksheet(s) | Domain | Bundled in skill |
|---|---|---|---|
| **Ceal** | Worksheet 1 (Opportunity Set) | Electrochemical CO₂ removal from seawater | `opportunity-set` |
| **Augury** | Worksheet 2 (Attractiveness Map) | Predictive maintenance via machine acoustics | `attractiveness-map` |
| **Inergio** | Worksheets 1–3 (full Navigator) | Portable solid-oxide fuel-cell power packs | `where-to-play` |

### Ceal — Worksheet 1, the Opportunity Set

Ceal removes atmospheric CO₂ dissolved in seawater electrochemically, producing valuable minerals as a by-product. The example walks the two moves of Worksheet 1: **de-linking** the venture's core abilities from any product (electrochemical CO₂ removal, an efficient scalable process, valuable mineral output, and environmental / integration know-how — each described in its own right), then **re-linking** those abilities into `application × customer` opportunities tied to a need. The re-linked set carries three opportunities forward (carbon reduction for seawater-cooled power plants; for industrial seawater users; and soft-water treatment for closed-loop cooling towers), plus a note on adjacent backup options. It is the clearest illustration of how a finished opportunity set reads — abilities → applications → customers, kept at a comparable level of abstraction so the options stay comparable in Worksheet 2.

- **File:** [`../plugins/where-to-plai/skills/opportunity-set/references/examples/ceal-ws1.md`](../plugins/where-to-plai/skills/opportunity-set/references/examples/ceal-ws1.md)

### Augury — Worksheet 2, the six-factor scoring walkthrough

Augury "listens" to machines and offers predictive maintenance from the sounds they make. The example takes **one** opportunity from its shortlist — predictive maintenance for HVAC systems in commercial buildings — and scores it step by step across all six factors: the three **Potential** factors (compelling reason to buy, market volume, economic viability) and the three **Challenge** factors (implementation obstacles, time to revenues, external risk), each on the `Low → Mid → High → Super High` scale, with real figures and explicit reasoning behind every mark. It rolls up to **Overall Potential High / Overall Challenge Mid** and reads that as a strong, "Gold Mine"-region opportunity. This is the strongest few-shot for the Potential/Challenge factor scoring, and it closes with the authors' scoring philosophy — the point is the upside/downside understanding, **not** a number, and you should never mechanically average the scale to a 1–4 mean.

- **File:** [`../plugins/where-to-plai/skills/attractiveness-map/references/examples/augury-ws2.md`](../plugins/where-to-plai/skills/attractiveness-map/references/examples/augury-ws2.md)

### Inergio — the complete Navigator, all three worksheets

Inergio builds portable power packs on solid-oxide fuel-cell technology for off-grid and backup applications — the methodology's running flagship case. The example is a finished one-pager spanning the whole journey: Worksheet 1 (core abilities re-linked into four opportunities), Worksheet 2 (all four opportunities scored, with the hand-placed "X" marks transcribed onto the `Low → Mid → High → Super High` scales and each placed on the map, with the RVs on the border between Quick Win and Questionable), and Worksheet 3 (a Primary market chosen, Backup and Growth options assessed for relatedness, and a filled Agile Focus Dartboard). An appendix captures two supporting Strategyzer canvases from the same source deck. Use it as the end-to-end output template and to see how the three worksheets connect — it is also the best reference for the visual scoring mechanic and a completed dartboard.

- **File:** [`../plugins/where-to-plai/skills/where-to-play/references/examples/inergio-full-navigator.md`](../plugins/where-to-plai/skills/where-to-play/references/examples/inergio-full-navigator.md)

## How they are wired into the skills

Each example lives under a skill's `references/examples/` directory and is loaded on demand — progressive disclosure, so the few-shot enters context only when the relevant worksheet is in play:

- `opportunity-set` cites `references/examples/ceal-ws1.md` as its filled Worksheet 1 few-shot.
- `attractiveness-map` cites `references/examples/augury-ws2.md` as its scored Worksheet 2 few-shot.
- `where-to-play` cites `references/examples/inergio-full-navigator.md` (the complete Navigator) and, alongside it, a catalogue — `references/examples-index.md` — that maps each worksheet to its best bundled example so an agent can pull the right one. The `agile-focus` and `worksheet-view` skills reach across to the same Inergio file for the filled dartboard and the render reference.

The examples-index is the single catalogue of what is bundled. It also records that the authors' wider archive holds further cases (FeelIT, FlyAbility, Toni, Kanso Dx, Gopa, biaWear) which are **not** shipped here, and warns that older artifacts can use outdated factor terminology — the Worksheet 2 spec is always authoritative on the current factor names.

## Adding new examples

New worked examples follow a few ground rules so they stay useful as few-shots:

1. **Rights first.** Only add a case you have the authors' permission to bundle. Every example file opens with the `© Sharon Tal & Marc Gruber — worked example, from the authors' teaching material (wheretoplay.co).` provenance line; keep it.
2. **Place it beside the skill it teaches.** Put the file under the relevant skill's `references/examples/` directory, matching the worksheet it illustrates (Worksheet 1 → `opportunity-set`, Worksheet 2 → `attractiveness-map`, full Navigator → `where-to-play`).
3. **Match the house format.** Lead with an HTML comment header capturing `worked_example`, `worksheet` (or `worksheets` for a multi-worksheet case), `framework`, and `source_files`; then the provenance line; then a one-line "_Illustrates…_" note; then the worked content. Follow the shape of the existing three files.
4. **Show the reasoning, not just the answer.** The value of a few-shot is the *why* behind each score or link — real figures, sub-question notes, and the qualitative judgement. Keep the authors' scoring philosophy intact (understanding over numbers; no mechanical averaging; confidence flags where useful).
5. **Register it in the catalogue.** Add the new case to [`../plugins/where-to-plai/skills/where-to-play/references/examples-index.md`](../plugins/where-to-plai/skills/where-to-play/references/examples-index.md) — both the "Bundled examples" list and the worksheet → example mapping — and cite it from the skill's `SKILL.md`, the way the current three are cited.

## See also

- [skills.md](skills.md) · [methodology.md](methodology.md)
